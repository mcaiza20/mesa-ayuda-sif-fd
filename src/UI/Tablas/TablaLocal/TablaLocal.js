import React, { Component } from 'react';
import Spinner from '../../Spinner/Spinner';
import { Select, Input } from 'antd';
import { DataTable } from 'primereact/datatable';
import Auxiliar from '../../../cao/Auxiliar';
import { Column } from 'primereact/column';
import Boton from '../../Boton/Boton';
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Dialog } from 'primereact/dialog';
import Container from 'react-bootstrap/Container';
import FormValidator from '../../../function/Validador/FormValidator'
import Ordenar from '../../../function/Ordenar/Ordenar'
import estilos from './TablaLocal.module.css'
import Alerta from '../../Toast/Alerta';
import { Message } from 'primereact/message';
import Axios from 'axios';
import XLSX from 'xlsx';
import SheetJSFT from './types';
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';

const { Option } = Select;
const { TextArea } = Input;

class TablaLocal extends Component {

    constructor() {
        super()
        this.state = {
            registrosTabla: {},
            iconos: {},
            listaSlas: []
        }
        this.registroSeleccionado = this.registroSeleccionado.bind(this);
        this.anadirNuevo = this.anadirNuevo.bind(this);
        this.guardar = this.guardar.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.registro = {}
        this.icono = {}
        this.estado = ['activo', 'inactivo']
        this.rol = ['administrador', 'supervisor', 'encargado','otro']
        this.validaciones = []
        this.validacion = ''
        this.notificaciones = []
        this.justificacion = true
    }
    componentWillMount() {

        
        this.state.listaSlas.map(r=>console.log(r))

        let registrosTabla = JSON.parse(localStorage.getItem('objTabla'+this.props.identificador));
        let titulos = []
        if (registrosTabla !== null && registrosTabla.length > 0) {
            titulos = Object.keys(registrosTabla[0])
        } else {
            localStorage.setItem('objTabla'+this.props.identificador, JSON.stringify([]))
            titulos = this.props.titulos
            registrosTabla = []
        }
        this.obtenerValidacion(titulos)
        this.setState({ registrosTabla: registrosTabla })
    }
    componentWillReceiveProps(nextProps) {
        let registrosTabla = JSON.parse(localStorage.getItem('objTabla'+this.props.identificador));
        let titulos = []
        if (nextProps.titulos && nextProps.titulos !== undefined) {
            if (registrosTabla !== null && registrosTabla.length > 0) {
                titulos = Object.keys(registrosTabla[0])
            } else {
                localStorage.setItem('objTabla'+this.props.identificador, JSON.stringify([]))
                titulos = nextProps.titulos
                registrosTabla = []
            }
            this.obtenerValidacion(titulos)
            this.setState({ registrosTabla: registrosTabla })
        }
    }

    componentDidMount() {
        let objAWS = { "operation": "list", "tableName": "mayorista", "payload": {} }
        if (this.registro.mayorista !== undefined) {
            Axios.put('https://1ps11pdwp0.execute-api.us-east-1.amazonaws.com/default/crud', objAWS)
                .then(r => {
                    this.mayoristas = r.data.payload
                }).catch(error => Alerta.error(error))
        }
    }
    obtenerValidacion = titulos => {
        this.validaciones = []
        titulos.map(r => {
            this.registro[r] = ''
            this.validacion = {}
            if (r === 'notificación' && !this.justificacion) {
                this.validacion = {
                    field: r,
                    method: 'isEmpty',
                    validWhen: false,
                    message: 'Campo ' + r + ' es requerido.'
                }
            }
            if (r !== 'id' && r !== 'contrato' && r !== 'cliente' && r !== 'nombre usuario' && r !== 'clave' && r !== 'correo 2' && r !== 'teléfono 2' && 
                r !== 'notificación' && r !== 'ignore_whitespace' ) {
                this.validacion = {
                    field: r,
                    method: 'isEmpty',
                    validWhen: false,
                    message: 'Campo ' + r + ' es requerido.'
                }
            }
            if (Object.keys(this.validacion).length > 0) this.validaciones.push(this.validacion)
            return this.validacion
        })
        this.validator = new FormValidator(this.validaciones)
        this.registro.validation = this.validator.valid()
    }
    guardar() {
        this.validation = this.validator.validate(this.state.registro);
        let registros = [...this.state.registrosTabla];

        if (this.validation.isValid === true) {
            delete this.state.registro['ignore_whitespace']
            delete this.state.registro.validation
            let fechaActual = new Date().toLocaleString("en-Us", { timeZone: "America/Guayaquil" })
            //Falta obtener el verdadero id de la persona que esta cambiando el estado
            if(this.state.registro['notificación']!==""){
                this.notificaciones.push({ fecha: fechaActual, 'descripción': this.state.registro['notificación'], responsable: { id: 'CON-1234' } })
            }
            if (this.newRegistro)
                registros.push(this.state.registro);
            else {
                registros[this.encontrarIndexSeleccionado()] = this.state.registro;
                registros[this.encontrarIndexSeleccionado()]['notificación'] = this.notificaciones;
            }
            this.setState({ registrosTabla: registros, registro: null, displayDialog: false, registroSeleccionado: null });
            localStorage.setItem('objTabla'+this.props.identificador, JSON.stringify(registros))
        } else {
            Object.keys(this.validation).forEach(r => {
                this.validation[r].isInvalid ? this.icono[r] = <Message severity="warn" /> : this.icono[r] = <Message severity="success" />
            })
            delete this.icono['isValid']
            this.setState({ iconos: this.icono })
            Alerta.error('Faltan campos por completar')
        }
    }
    encontrarIndexSeleccionado() {
        return this.state.registrosTabla.indexOf(this.state.registroSeleccionado);
    }
    registroSeleccionado(e) {
        this.newRegistro = false;
        this.notificaciones = Object.assign([], e.data['notificación'])
        this.setState({ displayDialog: true, registro: Object.assign({}, e.data) })
    }
    anadirNuevo() {
        const nuevoRegistro = Object.assign({}, this.registro)
        this.newRegistro = true;
        this.setState({
            registro: nuevoRegistro,
            displayDialog: true,
            registroSeleccionado: {}
        });
    }
    inputChange = event => {
        event.preventDefault();
        let newState = Object.assign({}, this.state);
        newState.registro[event.target.name] = event.target.value
        this.setState(newState);
        this.validation = this.validator.validate(this.state.registro);
        if (event.target.name !== 'correo 2' && event.target.name !== 'teléfono 2')
            this.validacionPorCampo(event.target.name)
    }
    selectChange = (value, nombre) => {
        let newState = Object.assign({}, this.state);
        let titulos = Object.assign([], this.props.titulos);

        if (nombre === 'SLA MAYORISTA') {
            newState.registro[nombre] = value
        } else if (nombre === 'estado') {
            newState.registro[nombre] = value
            if (Object.entries(newState.registroSeleccionado).length > 0) {
                let index = this.encontrarIndexSeleccionado();
                let encontrado = this.state.registrosTabla.filter((val, i) => i === index)
                if (encontrado[0].estado !== value) {
                    newState.registro['notificación'] = ''
                    titulos.push('notificación')
                    this.justificacion = false
                    this.obtenerValidacion(titulos)
                } else {
                    delete newState.registro['notificación']
                    this.justificacion = true
                    this.obtenerValidacion(titulos)
                }
            }
        } else if (nombre === 'rol') {
            if (value === 'administrador') {
                let rolEncontrado = this.state.registrosTabla.find(o => o.rol === 'administrador')
                if (rolEncontrado === undefined)
                    newState.registro[nombre] = value
                else
                    Alerta.error('Ya se encuentra registrado un contacto administrador cambie su rol y vuelva a intentar')
            } else {
                newState.registro[nombre] = value
            }
        } else {
            let datos = JSON.parse(value)
            newState.registro[nombre] = datos.nombre
            newState.registro['SLA MAYORISTA'] = []
            newState.listaSlas = datos.sla
        }
        this.setState(newState);
        this.validation = this.validator.validate(this.state.registro);
        this.validacionPorCampo(nombre)
    }
    validacionPorCampo(nombreCampo) {
        if (this.validation[nombreCampo].isInvalid === false)
            this.icono[nombreCampo] = <Message className={estilos.icono} severity="success" />
        else
            this.icono[nombreCampo] = <Message className={estilos.icono} severity="warn" />
        this.setState({ iconos: this.icono })
    }
    handleChange(e) {
        const files = e.target.files;
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        let registrosTabla = this.state.registrosTabla
        reader.onload = (e) => {
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            let nuevosRegistros = XLSX.utils.sheet_to_json(ws)

            nuevosRegistros.forEach((x, index) => {
                if(x.estado!==undefined){
                    x.estado = x.estado.toLowerCase()
                }
                console.log(index)
                this.props.titulos.forEach(y => {
                    if((y=== 'PAÍS' && x[y]===undefined)|| (y=== 'MODELO' && x[y]===undefined )|| (y=== 'DESCRIPCIÓN' && x[y]===undefined))
                        nuevosRegistros.splice(index,1)
                    if (x[y] === undefined) x[y] = ""
                    if (y === 'SLA MAYORISTA' && x[y] !== "" ) {
                        x[y] = x[y].split('-')
                    }
                    

                })
            })

            localStorage.setItem('objTabla'+this.props.identificador, JSON.stringify([...registrosTabla, ...nuevosRegistros]))
            this.setState({ registrosTabla: [...registrosTabla, ...nuevosRegistros] })
        };
        if (rABS) {
            reader.readAsBinaryString(files[0]);
        } else {
            reader.readAsArrayBuffer(files[0]);
        };
    }

    render() {

        let tabla = <Spinner></Spinner>
        let buscar = ''
        let i = 0
        let cabeceraTabla = this.state.registrosTabla.length > 0 ? Object.keys(this.state.registrosTabla[0]) : this.props.titulos
        cabeceraTabla = Ordenar(this.props.titulos)
        let deshabilitado
        let header = <div className="p-clearfix" style={{ lineHeight: '2em' }}>
            <div style={{ float: "left", lineHeight: "3rem" }}>Registros
            <InputText key='input' type="search" className="BuscarGlobal" style={{ height: '50%', marginLeft: '5px' }} onInput={(e) => {
                    let busqueda = e.target.value.replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u");
                    this.setState({ globalFilter: busqueda })
                }} placeholder="Búsqueda Global" size="20" />
            </div>
            <div style={{ float: "right" }}>
                <Boton className={estilos['btn-responsive']} btnTipo="icon" icono={{ familia: 'font Awesome', icono: faPlus }} click={() => this.anadirNuevo()} >Añadir</Boton>
            </div>
            <div style={{ float: "right", textAlign: "end" }}>
                {this.props.csv ? <input type="file" className={estilos.inputFile} accept={SheetJSFT} onChange={this.handleChange} /> : null}
            </div>
        </div>;
        let dialogFooter = <Row className="pl-3"><Boton className={estilos['btn-responsive']} btnTipo="icon" icono={{ familia: 'font Awesome', icono: faCheck }} click={() => this.guardar()} desactivado={this.state.valido} >Guardar</Boton></Row>
        tabla =
            <Auxiliar>
                <DataTable value={this.state.registrosTabla} paginator={true} rows={15} header={header} responsive={true}
                    selectionMode="single" selection={this.state.registroSeleccionado} onSelectionChange={e => { this.setState({ registroSeleccionado: e.value }) }}
                    onRowSelect={this.registroSeleccionado} globalFilter={this.state.globalFilter}>
                    {cabeceraTabla.map(r => {
                        if (this.props.noMostrar) { buscar = this.props.noMostrar.find(o => o === r); }
                        if (buscar === undefined) {
                            return (<Column className={estilos.Header} key={r} field={r} header={r} />)
                        } else {
                            return <Column className={estilos.Ocultar} key={r} field={r} header={r} />
                        }
                    })}
                </DataTable>
                <Dialog visible={this.state.displayDialog} header={"Registro de "+this.props.cabecera} modal={true}
                    footer={dialogFooter} onHide={() => {
                        this.setState({ displayDialog: false, registro: null, iconos: {} });
                        this.justificacion = true;
                        this.obtenerValidacion(this.props.titulos)
                        this.icono = {}
                    }}>
                    <Container >
                        {this.state.registro &&
                            cabeceraTabla.map(r => {

                                let campos = []

                                if (r !== 'id' && r !== 'cliente') {
                                    switch (r) {
                                        case 'mayorista':
                                            // let mayorista = this.state.registro.mayorista.length > 0 ? this.mayoristas.find(i => i.id === this.state.registro.mayorista || i.nombre === this.state.registro.mayorista).nombre : this.state.registro.mayorista
                                            // let mayorista = this.state.registro.mayorista.length > 0 ? this.mayoristas.nombre : this.state.registro.mayorista

                                            campos.push(
                                                <Row key={r}>
                                                    <Col style={{ textAlign: "left" }} xs={12} md={4}>
                                                        <label className={estilos.etiquetas}>{r + ' '}<label className={estilos.requerido}>*</label></label>
                                                    </Col>
                                                    <Col style={{ textAlign: "left" }} xs={10} md={6}>
                                                        <Select style={{ marginTop: '0.6%', width: '100%' }} value={this.state.registro.mayorista}
                                                            onChange={e => { this.selectChange(e, r) }}>
                                                            {this.mayoristas.map(index => {
                                                                let mayorista = JSON.stringify(index)
                                                                return <Option key={index.nombre} value={mayorista}>{index.nombre}</Option>
                                                            })}
                                                        </Select>
                                                    </Col>
                                                    <Col style={{ textAlign: "left" }} xs={2} md={2}>
                                                        <span className="help-block">{this.validation ? this.state.iconos[r] : null}</span>
                                                    </Col>
                                                </Row>)
                                            break;

                                        case 'sla mayorista':
                                            let sla = this.state.registro[r] ? this.state.registro[r].length === 0 ? undefined : this.state.registro[r] : undefined
                                            campos.push(
                                                <Row key={r}>
                                                    <Col style={{ textAlign: "left" }} xs={12} md={4}>
                                                        <label className={estilos.etiquetas}>{r }</label>
                                                    </Col>
                                                    <Col style={{ textAlign: "left" }} xs={10} md={6}>
                                                        <Select mode="tags" style={{ marginTop: '0.6%', width: '100%' }}
                                                            value={sla} onChange={e => { this.selectChange(e, r) }}>
                                                            {
                                                                this.state.listaSlas.length > 0? 
                                                                this.state.listaSlas.map(index => 
                                                               <Option key={i} value={index}>{index}</Option>):null
                                                            }
                                                        </Select>
                                                    </Col>
                                                    <Col style={{ textAlign: "left" }} xs={2} md={2}>
                                                        <span className="help-block">{this.validation ? this.state.iconos[r] : null}</span>
                                                    </Col>
                                                </Row>)
                                            break;
                                        case 'SLA AL CLIENTE':
                                            campos.push(
                                                <Row key={r}>
                                                    <Col style={{ textAlign: "left" }} xs={12} md={4}>
                                                        <label className={estilos.etiquetas}>{r}</label>
                                                    </Col>
                                                    <Col style={{ textAlign: "left" }} xs={10} md={6}>
                                                        <InputMask name={r} mask="99/99/99" value={this.state.registro[r]} onChange={(e) => this.inputChange(e)}></InputMask>
                                                    </Col>
                                                    <Col style={{ textAlign: "left" }} xs={2} md={2}>
                                                        <span className="help-block">{this.validation ? this.state.iconos[r] : null}</span>
                                                    </Col>
                                                </Row>)
                                            break;
                                        case 'estado':
                                            campos.push(
                                                <Auxiliar>
                                                    <Row key={r} >
                                                        <Col style={{ textAlign: "left" }} xs={12} md={4}>
                                                            <label className={estilos.etiquetas}>{r + ' '}<label className={estilos.requerido}>*</label></label>
                                                        </Col>
                                                        <Col style={{ textAlign: "left" }} xs={10} md={6}>
                                                            <Select style={{ marginTop: '0.6%', width: '100%' }} value={this.state.registro[r]}
                                                                onChange={e => { this.selectChange(e, r) }}>
                                                                {this.estado.map(index => <Option key={index} value={index}>{index}</Option>)}
                                                            </Select>
                                                        </Col>
                                                        <Col style={{ textAlign: "left" }} xs={2} md={2}>
                                                            <span className="help-block">{this.validation ? this.state.iconos[r] : null}</span>
                                                        </Col>
                                                    </Row>
                                                    <Row hidden={this.justificacion}>
                                                        <Col style={{ textAlign: "left" }} xs={12} md={4}>
                                                            <label className={estilos.etiquetas}>Justificación <label className={estilos.requerido}>*</label></label>
                                                        </Col>
                                                        <Col style={{ textAlign: "left" }} xs={10} md={6}>
                                                            <TextArea value={this.state.registro['notificación']} name='notificación' onChange={(e) => this.inputChange(e)} autosize />
                                                        </Col>
                                                        <Col style={{ textAlign: "left" }} xs={2} md={2}>
                                                            <span className="help-block">{this.validation ? this.state.iconos['notificación'] : null}</span>
                                                        </Col>
                                                    </Row>
                                                </Auxiliar>)
                                            break;

                                        case 'rol':
                                            campos.push(
                                                <Row key={r}>
                                                    <Col style={{ textAlign: "left" }} xs={12} md={4}>
                                                        <label className={estilos.etiquetas}>{r + ' '}<label className={estilos.requerido}>*</label></label>
                                                    </Col>
                                                    <Col style={{ textAlign: "left" }} xs={10} md={6}>
                                                        <Select style={{ marginTop: '0.6%', width: '100%' }} value={this.state.registro[r]}
                                                            onChange={e => { this.selectChange(e, r) }}>
                                                            {this.rol.map(index => <Option key={index} value={index}>{index}</Option>)}
                                                        </Select>
                                                    </Col>
                                                    <Col style={{ textAlign: "left" }} xs={2} md={2}>
                                                        <span className="help-block">{this.validation ? this.state.iconos[r] : null}</span>
                                                    </Col>
                                                </Row>)
                                            break;

                                        case 'clave':
                                            campos.push(
                                                <Row key={r}>
                                                    <Col style={{ textAlign: "left" }} md={4} xs={12}>
                                                        <label className={estilos.etiquetas}>{r}</label>
                                                    </Col>
                                                    <Col style={{ textAlign: "left" }} md={6} xs={10}>
                                                        <Input.Password disabled name={r} id={r} value={this.state.registro[r]} />
                                                    </Col>
                                                    <Col style={{ textAlign: "left" }} md={2} xs={2}>
                                                        <span className="help-block">{this.validation ? this.state.iconos[r] : null}</span>
                                                    </Col>
                                                </Row>)
                                            break;

                                        default:
                                            r === 'nombre usuario' ? deshabilitado = true : deshabilitado = false

                                            if (r !== 'id' && r !== 'contrato' && r !== 'cliente' && r !== 'nombre usuario' && r !== 'clave' && r !== 'correo 2' && r !== 'teléfono 2') {
                                                campos.push(
                                                    <Row key={r} >
                                                        <Col style={{ textAlign: "left" }} xs={12} md={4}>
                                                            <label className={estilos.etiquetas}>{r + ' '}<label className={estilos.requerido}>*</label></label>
                                                        </Col>
                                                        <Col style={{ textAlign: "left" }} xs={12} md={6}>
                                                            <Input disabled={deshabilitado} name={r} id={r} value={this.state.registro[r]} onChange={(e) => this.inputChange(e)} />
                                                        </Col>
                                                        <Col style={{ textAlign: "left" }} xs={12} md={2}>
                                                            <span className="help-block">{this.validation ? this.state.iconos[r] : null}</span></Col>
                                                    </Row>)
                                            } else {
                                                campos.push(
                                                    <Row key={r} >
                                                        <Col style={{ textAlign: "left" }} xs={12} md={4}>
                                                            <label className={estilos.etiquetas}>{r}</label></Col>
                                                        <Col style={{ textAlign: "left" }} xs={12} md={6}>
                                                            <Input disabled={deshabilitado} name={r} id={r} value={this.state.registro[r]} onChange={(e) => this.inputChange(e)} />
                                                        </Col>
                                                        <Col style={{ textAlign: "left" }} xs={12} md={2}>
                                                            <span className="help-block">{this.validation ? this.state.iconos[r] : null}</span></Col>
                                                    </Row>)
                                            }
                                            break
                                    }
                                }
                                return campos
                            })}
                    </Container>
                </Dialog>
            </Auxiliar>
        return (<div>{tabla}</div>);
    }
}
export default TablaLocal;
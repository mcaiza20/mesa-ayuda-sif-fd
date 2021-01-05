import React, { Component } from 'react'
import estilos from './ClienteDetalle.module.css'
import Boton from '../../UI/Boton/Boton';
import Auxiliar from '../../cao/Auxiliar';
import Titulo from '../../UI/Titulo/Titulo';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { TextInputField } from 'evergreen-ui'
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Select, Spin } from 'antd';
import { ColorPicker } from 'primereact/colorpicker';
import Alerta from '../../UI/Toast/Alerta';
import TablaLocal from '../../UI/Tablas/TablaLocal/TablaLocal';
import ClienteAcordeon from './ClienteAcordeon';
import axios from '../../Servicio';
import { limpiarLocalStorage } from '../../function/LocalStorage/limpiarLocalStorage';
import BotonRol from '../../UI/BotonRol/BotonRol';

export default class ClienteDetalle extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading : false,
            cliente: {
                id: '',
                ruc: '',
                nombre: '',
                alias:'',
                'país': '',
                'provincia o estado': '',
                ciudad: '',
                'dirección': '',
                color: '',
                'razón social': '',
                'tipo cliente': '',
                contacto: [],
            },
            tabla: {
                noMostrar: ['id', 'cliente', 'clave'],
                titulos: ['nombre', 'apellido', 'correo 1', 'correo 2', 'teléfono 1', 'teléfono 2' ,'nombre usuario', 'clave', 'rol', 'estado','notificación']
            },
            requeridos: ['ruc', 'nombre','alias', 'país', 'provincia o estado', 'ciudad', 'dirección', 'razón social', 'tipo cliente', 'color'],
            validar: {},
            url: 'https://ptcy067kz8.execute-api.us-east-1.amazonaws.com/default/crudCliente'
        };
    }

    componentWillMount() {
        let clienteSeleccionado = null
        try {
            clienteSeleccionado = JSON.parse(localStorage.getItem("seleccionado"))
            localStorage.setItem('objTablaCliente', clienteSeleccionado.contacto)
            clienteSeleccionado.contacto = JSON.parse(clienteSeleccionado.contacto)
            delete clienteSeleccionado.contrato
            if (!clienteSeleccionado.color)
                clienteSeleccionado.color = ''
            else
                clienteSeleccionado.color = clienteSeleccionado.color.substring(1, clienteSeleccionado.color.length)
            if (!clienteSeleccionado['país'])
                clienteSeleccionado['país'] = 'Ecuador'

            this.setState((ob) => {
                Object.keys(clienteSeleccionado).map(c => (
                    ob.cliente[c] = clienteSeleccionado[c]
                ))
                return ob
            })
        } catch (error) {
            clienteSeleccionado = null
        }
    }

    regresar = () => {
        // this.props.history.goBack();
        this.props.history.push('/home/cliente/')
    }
    handleChangeColorPicker = (params) => {
        let valor = params.target.value
        let nameInput = params.target.name
        this.setState((ob) => {
            ob.cliente[nameInput] = valor
            ob.validar[nameInput] = true
            return ob
        })
    }
    handleChangeDropdown = (params, componete) => {
        this.setState((ob) => {
            ob.cliente[componete] = params
            if (params) {
                ob.validar[componete] = true
            }
            return ob
        })
    }
    handleChangeInput = (params) => {
        let valor = params.target.value
        let nameInput = params.target.name
        // let valido = params.target.validity.valid
        let valido = false;
        if(valor.trim() !== "")
            valido = true
        this.setState((ob) => {
            ob.cliente[nameInput] = valor
            ob.validar[nameInput] = valido
            return ob
        })
    }
    onSubmitFuncion = () => {
        let formularioValido = true
        let validar = {}
      
        //Validar los campos con el arreglo validar
        Object.keys(this.state.cliente).map(c => {
            let temp = this.state.requeridos.find(o => o === c)
            if (temp && this.state.cliente[c] === "") {
                formularioValido = false
                validar[c] = false
            } else if (temp && this.state.cliente[c] !== "") {
                validar[c] = true
            }
            temp = undefined
            return c
        })

        //set el state
        this.setState((s) => {
            if(formularioValido)
                s.loading = true
            
            Object.keys(validar).map(v => (
                s.validar[v] = validar[v]
            ))
            return s
        })

        //Validar data tabla
        
        let tabla = JSON.parse(localStorage.getItem('objTablaCliente'))
        if (tabla.length > 1 && tabla.find(o => o.rol === 'administrador') && tabla.find(o => o.rol === 'supervisor')) {
            formularioValido = (formularioValido && true)
        } else {
            this.setState({loading: false})
            return Alerta.error('Debe al menos tener un contacto administrador y un contacto supervisor')
            // formularioValido = false
        }

        //Ejecutar acción en el backend
        if (formularioValido) {
            let a = this.state.cliente
            a.contacto = tabla
            a.color = '#' + a.color

            let objetoAWS = {
                "operation": 'create',
                "tableName": 'cliente',
                "payload": this.state.cliente
            }
            //mensajes de error
            axios.put(this.state.url, objetoAWS).then(r => {
                Alerta.success(r.data.mensaje)
                if(r.data.mensaje ==='DATOS INGRESADOS/ACTUALIZADO'){
                    setTimeout(() => {
                        limpiarLocalStorage()
                        // localStorage.clear()
                        this.props.history.push('/home/cliente/')
                        this.setState({loading: false})
                    }, 1500);
                }else{
                    Alerta.error(r.data.mensaje)
                    this.setState({loading: false})
                }
            }).catch(e => {
                Alerta.error('Error en el servidor')
            })
        }
        else
            Alerta.error('Falta completar campos')
    }
    render() {
        const su = <Message severity="success" />
        const er = <Message severity="warn" />
        const { Option } = Select;

        let salir = <Boton click={this.regresar} btnClase="Exit">X</Boton>
        let cliente = 
        <Auxiliar>
            <Row>
                <Col xs={10} sm={10}>
                    <label><b>Ruc <label className={estilos.requerido}>*</label></b></label>
                    <TextInputField
                        label=''
                        name="ruc"
                        value={this.state.cliente.ruc}
                        onChange={this.handleChangeInput}
                        placeholder="Ingresar el ruc del cliente"
                    />
                </Col>
                <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {this.state.validar.ruc === undefined ? null : (this.state.validar.ruc ? su : er)}
                </Col>
            </Row>
            <Row>
                <Col xs={10} sm={10}>
                     <label><b>Nombre <label className={estilos.requerido} >*</label></b></label>
                    <TextInputField
                        label=''
                        name="nombre"
                        value={this.state.cliente.nombre}
                        onChange={this.handleChangeInput}
                        placeholder="Ingresar el nombre del cliente"
                    />
                </Col>
                <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {this.state.validar.nombre === undefined ? null : (this.state.validar.nombre ? su : er)}
                </Col>
            </Row>
            <Row>
                <Col xs={10} sm={10}>
                     <label><b>Alias <label className={estilos.requerido} >*</label></b></label>
                    <TextInputField
                        label=''
                        name="alias"
                        value={this.state.cliente.alias}
                        onChange={this.handleChangeInput}
                        placeholder="Ingresar alias del cliente"
                    />
                </Col>
                <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {this.state.validar.alias === undefined ? null : (this.state.validar.alias ? su : er)}
                </Col>
            </Row>

            <Row>
                <Col xs={10} sm={10}>
                    <label><b>País <label className={estilos.requerido} >*</label></b></label>
                    <TextInputField
                        label=''
                        name="país"
                        value={this.state.cliente['país']}
                        onChange={this.handleChangeInput}
                        placeholder="Ingresar el país del cliente"
                    />
                </Col>
                <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {this.state.validar['país'] === undefined ? null : (this.state.validar['país'] ? su : er)}
                </Col>
            </Row>
            <Row>
                <Col xs={10} sm={10}>
                    <label><b>Provincia o Estado <label className={estilos.requerido} >*</label></b></label>
                    <TextInputField
                        label=''
                        name="provincia o estado"
                        value={this.state.cliente['provincia o estado']}
                        onChange={this.handleChangeInput}
                        placeholder="Ingresar la provincia o estado del cliente"
                    />
                </Col>
                <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {this.state.validar['provincia o estado'] === undefined ? null : (this.state.validar['provincia o estado'] ? su : er)}
                </Col>
            </Row>
            <Row>
                <Col xs={10} sm={10}>
                    <label><b>Ciudad <label className={estilos.requerido} >*</label></b></label>
                    <TextInputField
                        label=''
                        name="ciudad"
                        value={this.state.cliente.ciudad}
                        onChange={this.handleChangeInput}
                        placeholder="Ingresar la ciudad del cliente"
                    />
                </Col>
                <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {this.state.validar.ciudad === undefined ? null : (this.state.validar.ciudad ? su : er)}
                </Col>
            </Row>
            <Row>
                <Col xs={10} sm={10}>
                    <label><b>Dirección <label className={estilos.requerido} >*</label></b></label>
                    <TextInputField
                        label=''
                        name="dirección"
                        value={this.state.cliente['dirección']}
                        onChange={this.handleChangeInput}
                        placeholder="Ingresar la dirección del cliente"
                    />
                </Col>
                <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {this.state.validar['dirección'] === undefined ? null : (this.state.validar['dirección'] ? su : er)}
                </Col>
            </Row>

            <Row>
                <Col xs={10} sm={10}>
                    <label><b>Razón social <label className={estilos.requerido} >*</label></b></label>
                    <TextInputField
                        label=''
                        name="razón social"
                        value={this.state.cliente['razón social']}
                        onChange={this.handleChangeInput}
                        placeholder="Ingresar el razón social del cliente" />
                </Col>
                <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {this.state.validar['razón social'] === undefined ? null : (this.state.validar['razón social'] ? su : er)}
                </Col>
            </Row>
            <Row>
                <Col xs={10} sm={10}>
                    <label><b>Tipo de Cliente <label className={estilos.requerido} >*</label></b></label>
                    <div>
                        <Select value={this.state.cliente["tipo cliente"]} style={{ width: '80%' }} onChange={(e) => this.handleChangeDropdown(e, 'tipo cliente')}>
                            <Option value="publico">Publico</Option>
                            <Option value="privado">Privado</Option>
                            <Option value="personal">Personal</Option>
                        </Select>
                    </div>

                </Col>
                <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {this.state.validar['tipo cliente'] === undefined ? null : (this.state.validar['tipo cliente'] ? su : er)}
                </Col>
            </Row>
            <br></br>
            <Row>
                <Col xs={10} sm={10}>
                    <label><b>Color</b></label>
                    <div>
                        <ColorPicker inline={true} name="color" value={this.state.cliente.color} onChange={this.handleChangeColorPicker}></ColorPicker>
                        <p style={{ 'marginTop': '.5em' }}>Color selecionado: <span style={{ 'display': 'inline-block', 'width': '32px', 'height': '32px', 'verticalAlign': 'middle', 'backgroundColor': '#' + this.state.cliente.color }}></span> {this.state.cliente.color} </p>
                    </div>
                </Col>
                <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {this.state.validar.color === undefined ? null : (this.state.validar.color ? su : er)}
                </Col>
            </Row>
        </Auxiliar>

        let contactos = <TablaLocal cabecera='Contactos' noMostrar={this.state.tabla.noMostrar} titulos={this.state.tabla.titulos} identificador='Cliente'></TablaLocal>

        return (
            <Spin spinning={this.state.loading}>
            <Auxiliar>
                
                <Container>
                        <Titulo texto="Módulo de Cliente"></Titulo>
                        <Row style={{ textAlign: "right" }}><Col>{salir}</Col></Row>
                    {/* <form onSubmit={this.onSubmitFuncion}> */}
                    <Row style={{ justifyContent: 'center' }}>
                        <Col sm={2}></Col>
                        <Col sm={8}>
                            <ClienteAcordeon>
                                {{ cliente: cliente, contacto: contactos }}
                            </ClienteAcordeon>
                        </Col>
                        <Col sm={2}></Col>
                    </Row>
                        <Row>
                        <Col style={{ textAlign: "center", marginBottom:'3%', padding:'2%', margin:'0%' }}>
                            <BotonRol etiqueta='Listo' funcion={this.onSubmitFuncion}/>
                        </Col>
                    </Row>
                    {/* </form> */}
                    
                </Container>
            </Auxiliar>
            </Spin>
        )
    }
}

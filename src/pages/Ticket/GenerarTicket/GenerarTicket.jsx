import React, { Component } from 'react'
import estilos from './GenerarTicket.module.css'
import Auxiliar from '../../../cao/Auxiliar';
import Titulo from '../../../UI/Titulo/Titulo';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { TextInputField, Textarea } from 'evergreen-ui'
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Select } from 'antd';
import Alerta from '../../../UI/Toast/Alerta';
import Axios from 'axios';
import Spinner from '../../../UI/Spinner/Spinner';
import Tabla from '../../../UI/Tablas/Tabla/Tabla';
import { Radio, Spin } from 'antd';
import { limpiarLocalStorage } from '../../../function/LocalStorage/limpiarLocalStorage';
import {Card} from 'semantic-ui-react'
import conf from '../../../data/configuracion.json'
import aes256 from 'aes256'

export default class GenerarTicket extends Component {
    constructor(props) {
        super(props);
        this.nuevoClienteParaTabla = false
        this.state = {
            cargando: true,
            loading: false,
            nuevoContacto: false,
            listaClientes: [],
            listaContactos: [],
            listaEquipos: [],
            listaSLA: [],
            ticket: {
                cliente: {},
                contacto: {},
                equipo: {},
                'ticket relacionado': '',
                'descripción': '',
                'sla': ''
            },
            requeridos: ['cliente', 'contacto','nombre','apellido','correo 1','teléfono 1', 'equipo', 'descripción', 'sla'],
            validar: {nuevoContacto:{}},
            tabla: {
                noMostrar: ['id', 'PAÍS', 'PROVINCIA (ESTADO)','DIRECCIÓN','CIUDAD','ESTADO','SLA','MAYORISTA','SLA MAYORISTA','SLA AL CLIENTE'],
                titulos: ["SERIE", "MARCA", "MODELO", "DESCRIPCIÓN", "TIPO"]
            },
            url: 'https://8x168bkqgl.execute-api.us-east-1.amazonaws.com/default/crearTicket',
            urlCliente: 'https://ptcy067kz8.execute-api.us-east-1.amazonaws.com/default/crudCliente',
            urlClienteEquipo: ' https://i016i9xmzd.execute-api.us-east-1.amazonaws.com/default/listaEquipoCliente',
            cliente:null
        }

        this.rol=""
    }

    componentWillMount() {
        let usuario = JSON.parse(aes256.decrypt(conf.KEYLOCALSTORAGE, localStorage.getItem(conf.USUARIOLOCAL)));
        //let usuario = JSON.parse(localStorage.getItem("usuario"))
        this.rol = usuario.usuarioAWS.attributes['custom:rol']
        let objetoAWSCliente = {}
        if(this.rol === "cliente"){
            objetoAWSCliente = {
                "operation": "getOne",
                "tableName": "cliente",
                "payload": {"id":usuario.usuarioDynamoDB.cliente.id}
            }
        }if(this.rol === "personal"){
            objetoAWSCliente = {
                "operation": "list",
                "tableName": "cliente",
                "payload": {}
            }
        }

        Axios.put(this.state.urlCliente, objetoAWSCliente).then(r => {
            let clientes = r.data.payload

            if(this.rol === 'cliente'){
                this.handleChangeDropdownUnido(clientes[0], "cliente")
                this.handleChangeDropdownUnido((clientes[0].contacto.filter(m=>m['nombre usuario']===usuario.usuarioAWS.username))[0], "contacto")
            }
            this.setState(s => {
                s.listaClientes = clientes
                s.cargando = false
                return s
            })

        }).catch(err => {
            console.log(err)
        })
    }

    seleccionarEquipo = (evento) => {
        let state = this.state.ticket
        // let sla = evento.value.SLA
        state.equipo = evento.value
        // this.setState({listaSLA:sla})
    }
    crearContacto = () => {
        this.setState(estado => {
            estado.nuevoContacto = !this.state.nuevoContacto
            estado.ticket.contacto={}
            if(this.state.nuevoContacto){
                estado.ticket.contacto.rol = 'supervisor'   
            }
            estado.validar.nuevoContacto = {}
            estado.validar.contacto = undefined

            return estado
        })
    }
    cambiarDatosContacto = (evento) => {
        let valor = evento.target.value
        let nameInput = evento.target.name
        let valido = evento.target.validity.valid
        this.setState((ob) => {
            ob.ticket.contacto[nameInput] = valor
            ob.validar.nuevoContacto[nameInput] = valido
            return ob
            
        })
    }
    handleChangeDropdownUnido = (valor, componete) => {
        //DropDown cliente
        if (componete === 'cliente') {
            let temp = this.state
            this.nuevoClienteParaTabla = true
            
            // #region tablaEquipo
            // LLenar tabla de los equipos
            let objAws = {
                "payload": { "id": valor.id }
            }
            Axios.put(this.state.urlClienteEquipo, objAws)
                .then(resp => {
                    let equipos=[]
                    
                    Object.keys(resp.data.payload).forEach(r=>{
                       
                        resp.data.payload[r]['SLA AL CLIENTE'] = JSON.stringify(resp.data.payload[r]['SLA AL CLIENTE'])
                        if(resp.data.payload[r].ESTADO === 'Activo' || resp.data.payload[r].ESTADO ==='activo' || resp.data.payload[r].ESTADO === 'ACTIVO'){
                            equipos.push(resp.data.payload[r])
                        }
                    })
                    this.setState(ob => {
                        ob.ticket[componete] = valor
                        ob.validar[componete] = true
                        ob.listaEquipos = equipos
                        return ob
                    })
                })
                .catch()
            //#endregion tablaEquipo

            temp.listaContactos = valor.contacto
            temp.listaSLA = []
            temp.ticket.contacto = {}
            temp.ticket.equipo = {}
            temp.ticket.sla = ''
            temp.validar.contacto = false
            temp.cliente = valor.nombre
        } 
        else if(componete ==='sla'){
            this.setState((ob) => {
                ob.ticket[componete] = valor.target.value
                ob.validar[componete] = true
                return ob
            })
        }
        else {
            this.setState((ob) => {
                ob.ticket[componete] = valor
                ob.validar[componete] = true
                return ob
            })
        }
    }
    handleChangeInput = (params) => {
        let valor = params.target.value
        let nameInput = params.target.name
        let valido = params.target.validity.valid
        this.setState((ob) => {
            ob.ticket[nameInput] = valor
            ob.validar[nameInput] = valido
            return ob
        })
    }
    onSubmitFuncion = () => {
        let test = this.state
        test.loading = true
        
        let formularioValido = true
        let validar = {nuevoContacto:{}}
        //Validar los campos con el arreglo validar
        Object.keys(this.state.ticket).map(c => {
            let temp = this.state.requeridos.find(o => o === c)
            if (temp && this.state.ticket[c] === "") {
                formularioValido = false
                validar[c] = false
            } else if (temp && JSON.stringify(this.state.ticket[c]) === '{}') {
                formularioValido = false
                validar[c] = false
            } else if (temp && this.state.nuevoContacto && c === 'contacto') {
                if(this.state.ticket.contacto.nombre){
                    validar.nuevoContacto.nombre = true
                }else{
                    formularioValido = false
                    validar.nuevoContacto.nombre = false
                }
                if(this.state.ticket.contacto.apellido){
                    validar.nuevoContacto.apellido = true
                }else{
                    formularioValido = false
                    validar.nuevoContacto.apellido = false
                }
                if(this.state.ticket.contacto['correo 1']){
                    validar.nuevoContacto['correo 1'] = true
                }else{
                    formularioValido = false
                    validar.nuevoContacto['correo 1'] = false
                }
                if(this.state.ticket.contacto['teléfono 1']){
                    validar.nuevoContacto['teléfono 1'] = true
                }else{
                    formularioValido = false
                    validar.nuevoContacto['teléfono 1']= false
                }                  
            } else if (temp && this.state.ticket[c] !== "") {
                validar[c] = true
            }
            temp = undefined
            return c
        })

        //set el state
        this.setState((s) => {
            Object.keys(validar).map(v => (
                s.validar[v] = validar[v]
            ))
            return s
        })

        // Validar data tabla
        if(validar && validar.equipo){
            formularioValido = (formularioValido && true)
        } else {
            this.setState({loading: false})
            return Alerta.error('Debe almenos tener un equipo')
        }

        //Ejecutar acción en el backend
        if (formularioValido) {
            let state = this.state.ticket
            if (this.state.ticket.equipo['provincia o estado'])
                state.provincia = state.equipo['provincia o estado']
            else
                state.provincia = "PICHINCHA"

             let objetoAWS = {
                "operation": 'create',
                "tableName": 'ticket',
                "payload": state
            }

            //mensajes
            Axios.put(this.state.url, objetoAWS).then(r => {
                Alerta.success(r.data.mensaje)
                if(r.data.mensaje === 'TICKET CREADO'){
                    setTimeout(()=>{
                        limpiarLocalStorage()
                        // localStorage.clear()
                        this.props.history.push('/home/ticket/')
                        this.setState({loading: false})
                    },1500)
                }else{
                    Alerta.error(r.data.mensaje)
                    this.setState({loading: false})
                }

                    
            }).catch(e => {
                Alerta.error('Error en el servidor')
                this.setState({loading: false})
            })
        }
        else
            Alerta.error('Falta completar campos')
            this.setState({loading: false})
    }
    render() {
        const su = <Message severity="success" />
        const er = <Message severity="warn" />
        const { Option } = Select;
        let contactoDefault = <Row style={{ paddingLeft: '2%', paddingBottom:'2%'}}>
            <Col xs={10} sm={10}>
                <div>
                    <Row>
                        <Col xs={7} sm={7}><span><b>Contacto <span className={estilos.requerido}>*</span></b></span></Col>
                        {
                            this.state.ticket.contacto!=null?null: <Col xs={5} sm={5} style={{ textAlign: 'right' }}><Button label="Nuevo Contacto" onClick={this.crearContacto} /></Col>
                        }
                       
                    </Row>
                </div>
                <div>
                    <Select value={JSON.stringify(this.state.ticket.contacto)} disabled={this.state.ticket.contacto!=null&&this.rol==='cliente'?true:false} style={{ width: '100%' }} onChange={(e) => this.handleChangeDropdownUnido(JSON.parse(e), 'contacto')}>
                        <Option value="{}">--Seleccione--</Option>
                        {this.state.listaContactos.map(f => (
                            <Option key={f.id} value={JSON.stringify(f)}>{f.nombre}</Option>
                        ))}
                    </Select>
                </div>
            </Col>
            <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {this.state.validar['contacto'] === undefined ? null : (this.state.validar['contacto'] ? su : er)}
            </Col>
        </Row>       

        let contactoNuevo = <Auxiliar>
            <Row style={{  paddingLeft: '2%', paddingBottom:'2%'}}>
                <Col xs={10} sm={10}>
                    <Row>
                        <Col xs={7} sm={7}><span><b>Contacto<span className={estilos.requerido}>*</span></b></span></Col>
                        <Col xs={5} sm={5} style={{ textAlign: 'right' }}><Button label="Seleccionar Contacto" onClick={this.crearContacto} /></Col>
                    </Row>
                </Col>
            </Row>
            <Row style={{  paddingLeft: '2%', paddingBottom:'2%'}}>
                <Col xs={10} sm={10}>
                    <span><b>Nombre <span className={estilos.requerido}>*</span></b></span>
                    <TextInputField
                        label=''
                        name="nombre"
                        onChange={this.cambiarDatosContacto}
                        placeholder="Ingresar el nombre del contacto" />
                </Col>
                <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {this.state.validar.nuevoContacto['nombre'] === undefined ? null : (this.state.validar.nuevoContacto['nombre'] ? su : er)}
                </Col>
            </Row>
            <Row style={{ paddingLeft: '2%', paddingBottom:'2%'}}>
                <Col xs={10} sm={10}>
                    <span><b>Apellido <span className={estilos.requerido}>*</span></b></span>
                    <TextInputField
                        label=''
                        name="apellido"
                        onChange={this.cambiarDatosContacto}
                        placeholder="Ingresar el apellido del contacto" />
                </Col>
                <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {this.state.validar.nuevoContacto['apellido'] === undefined ? null : (this.state.validar.nuevoContacto['apellido'] ? su : er)}
                </Col>
            </Row>
            <Row style={{ paddingLeft: '2%', paddingBottom:'2%'}}>
                <Col xs={10} sm={10}>
                    <span><b>Correo <span className={estilos.requerido}>*</span></b></span>
                    <TextInputField
                        label=''
                        name="correo 1"
                        onChange={this.cambiarDatosContacto}
                        placeholder="Ingresar el correo del contacto" />
                </Col>
                <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {this.state.validar.nuevoContacto['correo 1'] === undefined ? null : (this.state.validar.nuevoContacto['correo 1'] ? su : er)}
                </Col>
            </Row>
            <Row style={{ paddingLeft: '2%', paddingBottom:'2%'}}>
                <Col xs={10} sm={10}>
                    <span><b>Teléfono <span className={estilos.requerido}>*</span></b></span>
                    <TextInputField
                        label=''
                        name="teléfono 1"
                        onChange={this.cambiarDatosContacto}
                        placeholder="Ingresar el teléfono del contacto" />
                </Col>
                <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {this.state.validar.nuevoContacto['teléfono 1'] === undefined ? null : (this.state.validar.nuevoContacto['teléfono 1'] ? su : er)}
                </Col>
            </Row>
        </Auxiliar>


        return (
            <Auxiliar>
                <Spin  spinning={this.state.loading}>
                    <Container>
                            <Titulo texto="Generar Ticket"></Titulo>
                    </Container>
                        
                        {this.state.cargando ? <Spinner /> :
                    <Container>
                        {/* <form onSubmit={this.onSubmitFuncion}> */}
                        <Card style={{width:'100%', margin:'0%'}}>
                        <Row style={{ justifyContent: 'center' }}>
                            {/* <Col sm={1}></Col> */}
                            <Col sm={12}>
                                <br></br>
                                <br></br>
                                <Row style={{ padding: '2%'}}>
                                   
                                    <Col xs={10} sm={10}>
                                        <span><b>Cliente <span className={estilos.requerido}>*</span></b></span>
                                        <div>
                                            <Select value={this.state.cliente} disabled={this.state.cliente!=null&&this.rol==='cliente'?true:false}   style={{ width: '100%' }} onChange={(e) => this.handleChangeDropdownUnido(JSON.parse(e), 'cliente')}>
                                                {this.state.listaClientes.map(f => (
                                                    <Option key={f.id} value={JSON.stringify(f)}>{f.nombre}</Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </Col>
                                    <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {this.state.validar['cliente'] === undefined ? null : (this.state.validar['cliente'] ? su : er)}
                                    </Col>
                                </Row>
                                <br></br>                                
                                    {this.state.nuevoContacto ? contactoNuevo : contactoDefault}
                                <br></br>
                                    <Row style={{padding:'2%'}}>
                                    <Col xs={12} sm={12}>
                                        <span><b>Equipo <span className={estilos.requerido}>*</span></b></span>
                                        <div>
                                            <Tabla nuevo={this.nuevoClienteParaTabla} seleccionarUno={this.seleccionarEquipo} tipo="check" data={this.state.listaEquipos} noMostrar={this.state.tabla.noMostrar} titulos={this.state.tabla.titulos}></Tabla>
                                            {this.nuevoClienteParaTabla = false}
                                        </div>
                                    </Col>
                                    {/* <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {this.state.validar['equipo'] === undefined ? null : (this.state.validar['equipo'] ? su : er)}
                                    </Col> */}
                                </Row>
                            </Col>
                            {/* <Col sm={1}></Col> */}
                        </Row>
                        <br></br>
                        <Row style={{padding:'2%'}}>
                            <Col xs={10} sm={10}>
                                <span><b>Descripción problema <span className={estilos.requerido}>*</span></b></span>
                                <Radio.Group onChange={(e) => this.handleChangeDropdownUnido(e, 'sla')} value={this.state.ticket.sla} style={{border:'1px solid lightgrey', padding:'1%', marginTop:'0.5%'}}>
                                    <Row>
                                        <Col sm={12} xs={12}>
                                            <Radio value={'Equipo dejó de funcionar y no existe posibilidad de reanudarlo'} >Equipo dejo de funcionar y no existe posibilidad de reanudarlo</Radio>
                                        </Col>
                                        <Col sm={12} xs={12}>
                                            <Radio value={'Equipo funciona parcialmente'}>Equipo funciona parcialmente</Radio>
                                        </Col>
                                        <Col sm={12} xs={12}>
                                            <Radio value={'Equipo presenta alertas o problemas intermitentes'}>Equipo presenta alertas o problemas intermitentes</Radio>
                                        </Col>
                                    </Row>
                                </Radio.Group>
                                {/* <div>
                                    <Select style={{ width: '100%' }} onChange={(e) => this.handleChangeDropdownUnido(e, 'sla')}>
                                        {this.state.listaSLA.map(f => (
                                            <Option key={f} value={f}>{f}</Option>
                                        ))}
                                    </Select>
                                </div> */}
                            </Col>
                            <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {this.state.validar['sla'] === undefined ? null : (this.state.validar['sla'] ? su : er)}
                            </Col>
                        </Row>
                        <br></br>
                        <Row style={{padding:'2%'}}>
                            <Col xs={10} sm={10}>
                                <span><b>Decripción <span className={estilos.requerido}>*</span></b></span>
                                <div>
                                    <Textarea
                                        name="descripción"
                                        onChange={this.handleChangeInput}
                                        placeholder="Ingresar la descripción" />
                                </div>
                            </Col>
                            <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {this.state.validar['descripción'] === undefined ? null : (this.state.validar['descripción'] ? su : er)}
                            </Col>
                        </Row>
                        <br></br>
                        <Row style={{padding:'2%'}}>
                            <Col xs={10} sm={10}>
                                <span><b>Ticket relacionado</b></span>
                                <TextInputField
                                    label=''
                                    name="ticket relacionado"
                                    onChange={this.handleChangeInput}
                                    placeholder="Ingresar el ticket relacionado" />
                            </Col>
                            {/* <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {this.state.validar['ticket relacionado'] === undefined ? null : (this.state.validar['ticket relacionado'] ? su : er)}
                            </Col> */}
                        </Row>
                        </Card>
                            <Row>
                                <Col style={{ textAlign: "center",marginBottom:'3%', padding:'2%', margin:'0%' }}>
                                    <Button label="Listo" onClick={this.onSubmitFuncion} />
                                </Col>
                            </Row>
                        
                        {/* </form> */}
                    </Container>
                }
                </Spin>
            </Auxiliar>
        )
    }
}

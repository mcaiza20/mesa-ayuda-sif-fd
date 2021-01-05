import React, { Component } from 'react'
import estilos from './Contrato.module.css'
import Auxiliar from '../../cao/Auxiliar';
import Titulo from '../../UI/Titulo/Titulo';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { TextInputField } from 'evergreen-ui'
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Calendar } from 'primereact/calendar';
import { Select, Spin, Modal, Icon, Input, Card, Divider } from 'antd';
import Alerta from '../../UI/Toast/Alerta';
import Spinner from '../../UI/Spinner/Spinner';
// import ClienteAcordeon from './ContratoAcordeon';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import Axios from 'axios';
import Tabla from '../../UI/Tablas/Tabla/Tabla'
import { limpiarLocalStorage } from '../../function/LocalStorage/limpiarLocalStorage';
// import axios from '../../Servicio';
// import { Card } from 'semantic-ui-react'
import XLSX from 'xlsx';
import { InputMask } from 'primereact/inputmask';


import { Steps } from 'antd';
import BotonRol from '../../UI/BotonRol/BotonRol';

const { Step } = Steps;


export default class Contrato extends Component {

    constructor(props) {
        super(props)
        this.dataSLA = [
            {
                "prioridad": "alta",
                "descripción": "El ambiente deja de funcionar y no existe posibilidad de reanudarlo",
                "tiempo respuesta (horas)": "",
                "modalidad de comunicación": "Vía telefónica y/o e-mail, al centro de soporte de SIFUTURO, para constancia y registro respectivo",
                "tiempo máximo de diagnóstico (horas)": "",
                "tiempo máximo de solución (horas)": "",
                "forma de trabajo para diagnóstico o solución": "En sitio",
                "entregables": "Informe de actividades "
            },
            {
                "prioridad": "media",
                "descripción": "El ambiente funciona parcialmente",
                "tiempo respuesta (horas)": "",
                "modalidad de comunicación": "Vía telefónica y/o e-mail, al centro de soporte de SIFUTURO, para constancia y registro respectivo",
                "tiempo máximo de diagnóstico (horas)": "",
                "tiempo máximo de solución (horas)": "",
                "forma de trabajo para diagnóstico o solución": "En sitio o remoto",
                "entregables": "Informe de actividades "
            },
            {
                "prioridad": "baja",
                "descripción": "Alertas que demandan el soporte y solución para mitigar riesgos de mal funcionamiento",
                "tiempo respuesta (horas)": "",
                "modalidad de comunicación": "Vía telefónica y/o e-mail, al centro de soporte de SIFUTURO, para constancia y registro respectivo",
                "tiempo máximo de diagnóstico (horas)": "",
                "tiempo máximo de solución (horas)": "",
                "forma de trabajo para diagnóstico o solución": "En sitio o remoto",
                "entregables": "Informe de actividades "
            }
        ]

        this.state = {
            tecnico: [],
            listaCliente: [],
            listaVentas: [],
            cargando: true,
            loading: false,
            estado: ['activo', 'inactivo'],
            listaSlas: [],
            contrato: {
                id: '',
                'número de contrato': '',
                'nombre de contrato': '',
                'dueño de contrato': '',
                // 'horario del contrato': '',
                cliente: null,
                equipo: [],
                'personal ventas': null,
                'duración contrato': [],
                // 'fechas programadas': [],
                mantenimientos: 0,
                years:0,
                'técnico preferencial': null,
                SLA: null,
            },
            tabla: {
                noMostrar: ['id', 'cliente', 'PROVINCIA (ESTADO)', 'ESTADO', 'PAÍS', 'SERIE'],
                titulos1: ['SERIE', 'MARCA', 'MODELO', 'DESCRIPCIÓN', 'ESTADO', 'TIPO', 'CIUDAD', 'DIRECCIÓN', 'PAÍS', 'PROVINCIA (ESTADO)', 'MAYORISTA', 'SLA MAYORISTA'],
                titulos2: ['SERIE', 'MARCA', 'MODELO', 'DESCRIPCIÓN', 'ESTADO', 'TIPO', 'CIUDAD', 'DIRECCIÓN', 'PAÍS', 'PROVINCIA (ESTADO)', 'MAYORISTA', 'SLA MAYORISTA', 'SLA AL CLIENTE']
            },
            requeridos: ['dueño de contrato', 'número de contrato', 'cliente', 'personal ventas', 'duración contrato'],
            validar: {},
            url: 'https://0utuqhew54.execute-api.us-east-1.amazonaws.com/default/crudContrato',
            urlLista: 'https://76o22dcayd.execute-api.us-east-1.amazonaws.com/default/listaClientePersonal',
            deshabilitado: false,
            siguiente: false,
            visible: false,
            current: 0,
            equipo: {
                "PAÍS": "",
                "PROVINCIA (ESTADO)": "",
                "CIUDAD": "",
                "DIRECCIÓN": "",
                "TIPO": "",
                "MODELO": "",
                "SERIE": "",
                "MARCA": "",
                "DESCRIPCIÓN": "",
                "HORARIO DEL CONTRATO": "",
                "FECHAS PROGRAMADAS": "",
                "ESTADO": "",
                "MAYORISTA": "",
                "SLA MAYORISTA": null,
                "SLA AL CLIENTE": ""
            },
            equipos: [],
            equiposGuardados: [],
            nuevoEquipo: true,
            equipoSeleccionado: null,
        };
        this.editor = this.editor.bind(this);
        this.mensaje = ''
        this.sla = {}
        this.mayoristas = []
    }

    componentWillMount() {
        let contratoId = null
        Axios.get(this.state.urlLista)
            .then(r => {
                let cliente = r.data.cliente
                let personal = r.data.personal
                let tecnico = []
                let ventas = []
                personal.forEach(m => {
                    if ((m.rol === 'ventas' && m.estado === 'activo') || (m.rol === 'administrador' && m.estado === 'activo')) {
                        ventas.push(m)
                    } else if (m.rol === 'técnico' && m.estado === 'activo') {
                        tecnico.push(m)
                    }
                })
                let punteroState = this.state
                punteroState.listaCliente = cliente
                punteroState.tecnico = tecnico
                punteroState.listaVentas = ventas
            })
            .then(() => {
                /** Obtiene del localstorage el id del contacto y pide al aws los datos del contacto */
                if (JSON.parse(localStorage.getItem("seleccionado"))) {
                    contratoId = JSON.parse(localStorage.getItem("seleccionado")).id
                    let objetoAWS = {
                        "operation": 'getOne',
                        "tableName": 'contrato',
                        "payload": { 'id': contratoId }
                    }
                    Axios.put(this.state.url, objetoAWS)
                        .then(awsResp => {
                            let contratoAWS = awsResp.data.payload
                            let punteroState = this.state
                            punteroState.contrato["fechas programadas"] = []
                            punteroState.contrato["duración contrato"] = []
                            if (contratoAWS.equipo[0]['SLA AL CLIENTE']) {
                                this.setState({ sla: 'sla por equipo', deshabilitado: true })
                            } else {
                                this.setState({ sla: 'sla por contrato', deshabilitado: true })
                            }
                            Object.keys(contratoAWS).forEach(parametro => {
                                if (parametro === "duración contrato" || parametro === "fechas programadas") {
                                    contratoAWS[parametro].forEach((fecha, index) => {
                                        punteroState.contrato[parametro][index] = new Date(fecha)
                                    })
                                } else
                                    punteroState.contrato[parametro] = contratoAWS[parametro]
                            })

                            if (contratoAWS.id !== "") {
                                this.setState(s => {
                                    s.cargando = false
                                    s.equiposGuardados = contratoAWS.equipo
                                    s.siguiente = true
                                    return s
                                })
                            }
                        })
                        .catch()
                } else {
                    /** crear/new contacto */
                    this.setState(s => {
                        s.cargando = false
                        return s
                    })
                }
            })
            .catch(e => Alerta.error("Error con el servidor"))
    }

    componentDidMount() {
        let objAWS = { "operation": "list", "tableName": "mayorista", "payload": {} }
        Axios.put('https://1ps11pdwp0.execute-api.us-east-1.amazonaws.com/default/crud', objAWS)
            .then(r => {
                this.mayoristas = r.data.payload
            }).catch(error => Alerta.error(error))
    }

    selectSLA = event => {
        this.setState({ sla: event.target.value })
        if (event.target.value === 'sla por contrato')
            this.mensaje = <p style={{ marginTop: '30px', fontSize: '14px', fontWeight: 'bold' }}>Recuerde que el SLA ingresado a continuación corresponderá a cada uno de los equipos</p>
        else
            this.mensaje = <p style={{ marginTop: '30px', fontSize: '14px', fontWeight: 'bold' }}>Recuerde que debe ingresar el SLA por cada uno de los equipos</p>
    }
    onEditorValueChange(evento, value) {
        let registrosActualizados = [...evento.value];
        switch (evento.field) {
            case 'tiempo respuesta (horas)':
            case 'tiempo maximo de diagnostico (horas)':
            case 'tiempo maximo de solucion (horas)':
                value = Number(value)
                if (isNaN(value)) {
                    Alerta.error('Solo valores numéricos')
                } else {
                    registrosActualizados[evento.rowIndex][evento.field] = value;
                }
                break;

            default:
                registrosActualizados[evento.rowIndex][evento.field] = value;
                break;
        }
        this.setState(state => {
            state.contrato.SLA = registrosActualizados
            return state
        });
    }
    inputTextEditor(evento, field) {
        if (field !== 'prioridad')
            return <InputText type="text" value={evento.rowData[field]} onChange={(e) => this.onEditorValueChange(evento, e.target.value)} />;
        else
            return <label >{evento.rowData[field]}</label>
    }
    editor(evento) {
        return this.inputTextEditor(evento, evento.field);
    }
    handleChangeCalendarRange = (params) => {
        let valor = params.target.value
        let nameInput = params.target.name
        let valido = true
        let years=0
        valor.forEach((elem, index) => {
            if (elem === null) {
                valido = false
            }
        });
        
        if (valor[0] !== null && valor[1] !== null) {
            years = new Date(valor[1]).getFullYear() - new Date(valor[0]).getFullYear()
            this.setState({ years })
        }

        this.setState((ob) => {
            ob.contrato[nameInput] = valor
            ob.validar[nameInput] = valido
            years = new Date(valor[1]).getFullYear() - new Date(valor[0]).getFullYear()
            ob.contrato["years"]=years
            return ob
        })
    }
    handleChangeCalendarMulti = (params) => {
        let valor = params.target.value
        let nameInput = params.target.name
        let valido = true
        this.setState((ob) => {
            ob.equipo[nameInput] = valor
            ob.equipo['mantenimientos'] = valor.length
            console.log(ob.equipo['mantenimientos'])
            ob.validar[nameInput] = valido
            return ob
        })
    }
    handleChangeDropdown = (params, componete) => {

        this.setState((ob) => {
            ob.contrato[componete] = params
            if (params && componete !== 'técnico preferencial') {
                ob.validar[componete] = true
            }
            return ob
        })
    }
    handleChangeDropdownEquipo = (params, componete) => {

        this.setState((ob) => {
            ob.equipo[componete] = params
            // if (params && componete !== 'técnico preferencial') {
            //     ob.validar[componete] = true
            // }
            return ob
        })
    }
    handleChangeInput = (params) => {
        let valor = params.target.value
        let nameInput = params.target.name
        let valido = params.target.validity.valid
        this.setState((ob) => {
            ob.contrato[nameInput] = valor
            ob.validar[nameInput] = valido
            return ob
        })
    }

    selectChange = (value, nombre) => {
        let newState = Object.assign({}, this.state);

        if (nombre === 'MAYORISTA') {
            let datos = JSON.parse(value)
            newState.equipo[nombre] = datos.nombre
            newState.equipo['SLA MAYORISTA'] = []
            newState.listaSlas = datos.sla
        } else if (nombre === 'ESTADO') {
            newState.equipo[nombre] = value
        } else {
            newState.equipo[nombre] = value
        }
        this.setState(newState)
    }

    siguiente = () => {

        let formularioValido = true
        let validar = {}
        //Validar los campos con el arreglo validar
        Object.keys(this.state.contrato).forEach(c => {
            let temp = this.state.requeridos.find(o => o === c)
            if (temp) {
                if (this.state.contrato[c] === "" || this.state.contrato[c] === null || this.state.contrato[c].length === 0) {
                    formularioValido = false
                    validar[c] = false
                } else if (c === 'duración contrato' && this.state.contrato['duración contrato'][1] === null) {
                    formularioValido = false
                    validar[c] = false
                } else if (this.state.contrato[c] !== "") {
                    validar[c] = true
                }
            }
        })

        //set el state
        this.setState((s) => {
            // s.loading = true
            Object.keys(validar).map(v => (
                s.validar[v] = validar[v]
            ))
            return s
        })

        if (formularioValido) {
            this.setState({ visible: true })
        } else {
            this.setState({ visible: false })
            Alerta.error('Faltan campos por completar')
            // this.setState({loading:false }) 
        }

    }
    seleccionarRegistro = event => {

        let equipo = Object.assign({}, event.value)
        debugger
        let tipo = typeof equipo['FECHAS PROGRAMADAS']
        if (typeof equipo['FECHAS PROGRAMADAS'] === 'string') {
            equipo['FECHAS PROGRAMADAS'] = event.value['FECHAS PROGRAMADAS'].split(",")
            equipo['FECHAS PROGRAMADAS'] = equipo['FECHAS PROGRAMADAS'].map(r => {
                return new Date(r)
            })
        } else {
            equipo['FECHAS PROGRAMADAS'] = equipo['FECHAS PROGRAMADAS'].map(r => {
                return new Date(r)
            })
        }

        this.setState({ equipo: equipo, nuevoEquipo: false, equipoSeleccionado: event.value })
    }

    next() {
        const current = this.state.current + 1;

        switch (this.state.current) {
            case 0:
                if (this.state.equipo.PAÍS !== "" && this.state.equipo['PROVINCIA (ESTADO)'] !== "" && this.state.equipo.CIUDAD !== "" && this.state.equipo.DIRECCIÓN !== "") {
                    this.setState({ current });
                } else {
                    Alerta.error('Ingresar campos obligatorios')
                }
                break
            case 1:
                if (this.state.equipo.TIPO !== "" && this.state.equipo.MODELO !== "" && this.state.equipo.SERIE !== "" && this.state.equipo.MARCA !== "" && this.state.equipo.DESCRIPCIÓN !== "") {
                    this.setState({ current });
                } else {
                    Alerta.error('Ingresar campos obligatorios')
                }
                break
            default:
                break
        }


    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    handleContrato = () => {
        this.setState({ sla: 'sla por contrato' })
    }
    handleEquipo = () => {
        this.setState({ visible: false, siguiente: true, sla: 'sla por equipo' })
    }
    handleCancel = () => {
        this.setState({ visible: false, sla: undefined });
    }
    handleCancelarSla = () => {
        this.setState({ sla: undefined });
    }
    aceptar = () => {
        if (this.state.contrato.SLA) {
            Object.keys(this.state.contrato.SLA).forEach(r => {
                if (this.state.contrato.SLA[r]["tiempo respuesta (horas)"]) {
                    this.sla[r] = this.state.contrato.SLA[r]["tiempo respuesta (horas)"] + "/" + this.state.contrato.SLA[r]["tiempo máximo de diagnóstico (horas)"] + "/" + this.state.contrato.SLA[r]["tiempo máximo de solución (horas)"]
                    this.setState({ visible: false, siguiente: true })
                }
            })
        }
        else {
            Alerta.error('No ha ingresado ningún SLA')
            this.setState({ loading: false })
        }
    }
    onSubmitFuncion = () => {
        let formularioValido = true
        let validar = {}
        //Validar los campos con el arreglo validar
        Object.keys(this.state.contrato).forEach(c => {
            let temp = this.state.requeridos.find(o => o === c)
            if (temp) {
                if (this.state.contrato[c] === "" || this.state.contrato[c] === null || this.state.contrato[c].length === 0) {
                    formularioValido = false
                    validar[c] = false
                } else if (c === 'duración contrato' && this.state.contrato['duración contrato'][1] === null) {
                    formularioValido = false
                    validar[c] = false
                } else if (this.state.contrato[c] !== "") {
                    validar[c] = true
                }
            }
        })

        //set el state
        this.setState((s) => {
            s.loading = true
            Object.keys(validar).map(v => (
                s.validar[v] = validar[v]
            ))
            return s
        })

        // let equipos = JSON.parse(localStorage.getItem('objTablaContrato'))
        let equipos = this.state.equiposGuardados

        if (equipos.length > 0) {
            formularioValido = (formularioValido && true)
            if (this.state.sla === 'sla por contrato') {
                Object.keys(equipos).map(r => {
                    equipos[r]['sla al cliente'] = this.sla
                    return equipos
                })
            }
        } else {
            Alerta.error('Debe tener almenos un equipo')
            this.setState({ loading: false })
            return null
        }


        //Ejecutar acción en el backend
        if (formularioValido) {
            let a = this.state.contrato
            if (a.id === '')
                delete a.id
            a.equipo = equipos

            let objetoAWS = {
                "operation": 'create',
                "tableName": 'contrato',
                "payload": this.state.contrato
            }
            delete this.state.contrato.SLA
            //mensajes de error
            Alerta.success('Formulario completo')


            Axios.put(this.state.url, objetoAWS).then(r => {
                if (r.data.HTTPStatusCode === 200) {
                    Alerta.success(r.data.mensaje)
                    limpiarLocalStorage()
                    //  localStorage.clear()
                    this.props.history.push('/home/')
                } else {
                    Alerta.error(r.data.mensaje)
                    this.setState({ loading: false })
                }
            }).catch(e => {
                this.setState({ loading: false })
                Alerta.error('Error en el servidor')
            })
        }
        else {
            this.setState({ loading: false })
            Alerta.error('Falta completar campos')
        }
    }
    handleInputEquipo = (params) => {

        let valor = params.target.value
        let nameInput = params.target.name
        // let valido = params.target.validity.valid
        this.setState((ob) => {
            ob.equipo[nameInput] = valor
            // ob.validar[nameInput] = valido
            return ob
        })
    }
    handleChange = event => {


        const files = event.target.files;
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        //let registrosTabla = this.state.registrosTabla

        reader.onload = (e) => {
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const nuevosRegistros = XLSX.utils.sheet_to_json(ws);
            this.setState({ equiposGuardados: nuevosRegistros })
        };

        if (rABS) {
            reader.readAsBinaryString(files[0]);
        } else {
            reader.readAsArrayBuffer(files[0]);
        };
    }

    cancelar = () => {
        let equipoNuevo = {
            "PAÍS": "",
            "PROVINCIA (ESTADO)": "",
            "CIUDAD": "",
            "DIRECCIÓN": "",
            "TIPO": "",
            "MODELO": "",
            "SERIE": "",
            "MARCA": "",
            "DESCRIPCIÓN": "",
            "HORARIO DEL CONTRATO": "",
            "FECHAS PROGRAMADAS": "",
            "ESTADO": "",
            "MAYORISTA": "",
            "SLA MAYORISTA": null,
            "SLA AL CLIENTE": ""
        }

        this.setState({ equipo: equipoNuevo, nuevoEquipo: true })
    }

    direccionCliente = () => {
        this.setState((ob) => {
            ob.equipo.PAÍS = this.state.contrato.cliente['país']
            ob.equipo['PROVINCIA (ESTADO)'] = this.state.contrato.cliente['provincia o estado']
            ob.equipo.CIUDAD = this.state.contrato.cliente.ciudad
            ob.equipo['DIRECCIÓN'] = this.state.contrato.cliente['dirección']
            return ob
        })
    }

    guardar = () => {
        let equipos = [...this.state.equiposGuardados]
        let nuevosEquipos = [...this.state.equipos]
        console.log(this.state.contrato["mantenimientos"])
        console.log(this.state.contrato["years"])
        
        if (this.state.equipo['HORARIO DEL CONTRATO'] !== "" && this.state.equipo['FECHAS PROGRAMADAS'] !== "" && this.state.equipo.ESTADO !== "" && this.state.equipo.MAYORISTA !== "" && this.state.equipo['SLA MAYORISTA'] !== null && this.state.equipo['SLA AL CLIENTE'] !== "") {
            if(this.state.contrato["years"]/this.state.contrato["mantenimientos"]===this.state.contrato["mantenimientos"]){
                console.log("es valido")
            }
            if (this.state.nuevoEquipo) {
                equipos.push(this.state.equipo)
                nuevosEquipos.push(this.state.equipo)
            } else {
                equipos[equipos.indexOf(this.state.equipoSeleccionado)] = this.state.equipo
            }
            this.cancelar()

            this.setState({ equiposGuardados: equipos, equipos: nuevosEquipos, current: 0, nuevoEquipo: true })

        } else {
            Alerta.error('Ingresar campos obligatorios')
        }
    }

    borrar = () => {
        let equipos = [...this.state.equipos]
        let encontrado = equipos.indexOf(this.state.equipoSeleccionado)
        let encontrado2 = this.state.equiposGuardados.indexOf(this.state.equipoSeleccionado)

        if (encontrado >= 0) {
            this.setState(ob => ob.equiposGuardados = this.state.equiposGuardados.filter((val, i) => i !== encontrado2))
        } else {
            Alerta.error('No se puede borrar Equipo ')
        }

        this.cancelar()
    }

    render() {
        const { current } = this.state;
        const su = <Message severity="success" />
        const er = <Message severity="warn" />
        let equipo
        const { Option } = Select;

        if (this.state.contrato.SLA && this.state.contrato.SLA !== 'SLA por equipo revise en cada uno') {
            if (typeof this.state.contrato.SLA[0] === 'string')
                Object.keys(this.state.contrato.SLA).forEach(i => {
                    let horas = this.state.contrato.SLA[i].split('/')
                    this.dataSLA[i]["tiempo respuesta (horas)"] = horas[0]
                    this.dataSLA[i]["tiempo máximo de diagnóstico (horas)"] = horas[1]
                    this.dataSLA[i]["tiempo máximo de solución (horas)"] = horas[2]
                })

            //this.setState(ob=>ob.contrato.SLA = this.dataSLA)
        }


        let ubicacion = <Auxiliar>
            <Row className="justify-content-md-center">
                <Col xs={11} sm={12} lg={12} style={{ paddingRight: '0px' }}>
                    <span><b>País<span className={estilos.requerido}>*</span></b></span>
                    <Input
                        name="PAÍS"
                        value={this.state.equipo.PAÍS}
                        onChange={this.handleInputEquipo}
                        placeholder="Ingresar País"
                    />
                </Col>
            </Row>
            <br></br>
            <Row className="justify-content-md-center">
                <Col xs={11} sm={12} lg={12} style={{ paddingRight: '0px' }}>
                    <span><b>Provincia (Estado) <span className={estilos.requerido}>*</span></b></span>
                    <Input
                        name="PROVINCIA (ESTADO)"
                        value={this.state.equipo['PROVINCIA (ESTADO)']}
                        onChange={this.handleInputEquipo}
                        placeholder="Ingresar Provincia"
                    />
                </Col>
            </Row>
            <br></br>
            <Row className="justify-content-md-center">
                <Col xs={11} sm={12} lg={12} style={{ paddingRight: '0px' }}>
                    <span><b>Ciudad <span className={estilos.requerido}>*</span></b></span>
                    <Input
                        name="CIUDAD"
                        value={this.state.equipo.CIUDAD}
                        onChange={this.handleInputEquipo}
                        placeholder="Ingresar Ciudad"
                    />
                </Col>
            </Row>
            <br></br>
            <Row className="justify-content-md-center">
                <Col xs={11} sm={12} lg={12} style={{ paddingRight: '0px' }}>
                    <span><b>Dirección<span className={estilos.requerido}>*</span></b></span>
                    <Input
                        name="DIRECCIÓN"
                        value={this.state.equipo.DIRECCIÓN}
                        onChange={this.handleInputEquipo}
                        placeholder="Ingresar Dirección"
                    />
                </Col>
            </Row>
        </Auxiliar>

        let infoEquipo = <Auxiliar>
            <Row className="justify-content-md-center">
                <Col xs={11} sm={12} lg={12} style={{ paddingRight: '0px' }}>
                    <span><b>Tipo <span className={estilos.requerido}>*</span></b></span>
                    <Input
                        name="TIPO"
                        value={this.state.equipo.TIPO}
                        onChange={this.handleInputEquipo}
                        placeholder="Ingresar Tipo"
                    />
                </Col>
            </Row>
            <br></br>
            <Row className="justify-content-md-center">
                <Col xs={11} sm={12} lg={12} style={{ paddingRight: '0px' }}>
                    <span><b>Modelo <span className={estilos.requerido}>*</span></b></span>
                    <Input
                        name="MODELO"
                        value={this.state.equipo.MODELO}
                        onChange={this.handleInputEquipo}
                        placeholder="Ingresar Modelo"
                    />
                </Col>
            </Row>
            <br></br>
            <Row className="justify-content-md-center">
                <Col xs={11} sm={12} lg={12} style={{ paddingRight: '0px' }}>
                    <span><b>Serie <span className={estilos.requerido}>*</span></b></span>
                    <Input
                        name="SERIE"
                        value={this.state.equipo.SERIE}
                        onChange={this.handleInputEquipo}
                        placeholder="Ingresar Serie"
                    />
                </Col>
            </Row>
            <br></br>
            <Row className="justify-content-md-center">
                <Col xs={11} sm={12} lg={12} style={{ paddingRight: '0px' }}>
                    <span><b>Marca <span className={estilos.requerido}>*</span></b></span>
                    <Input
                        name="MARCA"
                        value={this.state.equipo.MARCA}
                        onChange={this.handleInputEquipo}
                        placeholder="Ingresar Marca"
                    />
                </Col>
            </Row>
            <br></br>
            <Row className="justify-content-md-center">
                <Col xs={11} sm={12} lg={12} style={{ paddingRight: '0px' }}>
                    <span><b>Descripción <span className={estilos.requerido}>*</span></b></span>
                    <Input
                        name="DESCRIPCIÓN"
                        value={this.state.equipo.DESCRIPCIÓN}
                        onChange={this.handleInputEquipo}
                        placeholder="Ingresar Descripción"
                    />
                </Col>
            </Row>
        </Auxiliar>

        let sla = <Auxiliar>
            <Row className="justify-content-md-center">
                <Col xs={6} sm={12} lg={6} style={{ paddingRight: '0px' }}>
                    <span><b>Horario del contrato <span className={estilos.requerido}>*</span></b></span>
                    <div>
                        <Select value={this.state.equipo['HORARIO DEL CONTRATO']} style={{ width: '100%' }} onChange={(e) => this.handleChangeDropdownEquipo(e, 'HORARIO DEL CONTRATO')}>
                            <Option value='6x9'>Laboral 6x9</Option>
                            <Option value='7x24'>Extendido 7x24</Option>
                        </Select>
                    </div>
                </Col>
                <br></br>
                <Col xs={6} sm={12} lg={6} style={{ paddingRight: '0px' }}>
                    <span><b>Fechas Programadas <span className={estilos.requerido}>*</span></b></span>
                    <div>
                        <Calendar className=''
                            id='calendar-fechas programadas'
                            value={this.state.equipo['FECHAS PROGRAMADAS']}
                            name='FECHAS PROGRAMADAS'
                            readOnlyInput
                            onChange={this.handleChangeCalendarMulti}
                            dateFormat="yy/mm/dd"
                            monthNavigator={true}
                            yearNavigator={true}
                            yearRange="2010:2100"
                            numberOfMonths={2}
                            selectionMode="multiple"
                            showIcon={true} />
                    </div>
                </Col>
            </Row>
            <br></br>
            <Row className="justify-content-md-center">
                <Col xs={11} sm={12} lg={12} style={{ paddingRight: '0px' }}>
                    <span><b>Estado <span className={estilos.requerido}>*</span></b></span>
                    <Select style={{ marginTop: '0.6%', width: '100%' }} value={this.state.equipo.ESTADO}
                        onChange={e => { this.selectChange(e, 'ESTADO') }}>
                        {this.state.estado.map(index => <Option key={index} value={index}>{index}</Option>)}
                    </Select>
                </Col>
            </Row>
            <br></br>
            <Row className="justify-content-md-center">
                <Col xs={11} sm={12} lg={12} style={{ paddingRight: '0px' }}>
                    <span><b>Mayorista <span className={estilos.requerido}>*</span></b></span>
                    <Select style={{ marginTop: '0.6%', width: '100%' }} value={this.state.equipo.MAYORISTA}
                        onChange={e => { this.selectChange(e, 'MAYORISTA') }}>
                        {this.mayoristas.map(index => {
                            let mayorista = JSON.stringify(index)
                            return <Option key={index.nombre} value={mayorista}>{index.nombre}</Option>
                        })}
                    </Select>
                </Col>
            </Row>
            <br></br>
            <Row className="justify-content-md-center">
                <Col xs={11} sm={12} lg={12} style={{ paddingRight: '0px' }}>
                    <span><b>SLA Mayorista <span className={estilos.requerido}>*</span></b></span>
                    <Select mode="tags" style={{ marginTop: '0.6%', width: '100%' }}
                        value={this.state.equipo['SLA MAYORISTA']} onChange={e => { this.selectChange(e, 'SLA MAYORISTA') }}>
                        {
                            this.state.listaSlas.length > 0 ?
                                this.state.listaSlas.map(index =>
                                    <Option key={index} value={index}>{index}</Option>) : null
                        }
                    </Select>
                </Col>
            </Row>
            <br></br>
            {<Row className="justify-content-md-center">
                <Col xs={11} sm={12} lg={12} style={{ paddingRight: '0px' }}>
                    <span><b>SLA al Cliente <span className={estilos.requerido}>*</span></b></span>
                    <InputMask name='SLA AL CLIENTE' mask="99/99/99" value={this.state.equipo['SLA AL CLIENTE']} onChange={(e) => this.handleInputEquipo(e)}></InputMask>
                </Col>
            </Row>}
        </Auxiliar>

        let generales = <Auxiliar>
            <Row className="justify-content-md-center">
                <Col xs={10} sm={4} style={{ paddingRight: '0px' }}>
                    <label><b>Número de contrato <label className={estilos.requerido}>*</label></b></label>
                    <TextInputField
                        label=""
                        name="número de contrato"
                        value={this.state.contrato['número de contrato']}
                        onChange={this.handleChangeInput}
                        placeholder="Ingresar el número de contrato"

                    />
                </Col>
                <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', paddingLeft: '0px', marginTop: '6px' }}>
                    {this.state.validar['número de contrato'] === undefined ? null : (this.state.validar['número de contrato'] ? su : er)}
                </Col>
                <Col xs={10} sm={4} style={{ paddingRight: '0px' }}>
                    <label><b>Nombre de contrato </b></label>
                    <TextInputField
                        label=""
                        name="nombre de contrato"
                        value={this.state.contrato['nombre de contrato']}
                        onChange={this.handleChangeInput}
                        placeholder="Ingresar el nombre de contrato"
                    />
                </Col>
                <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', paddingLeft: '0px', marginTop: '6px' }}>
                    {this.state.validar['nombre de contrato'] === undefined ? null : (this.state.validar['nombre de contrato'] ? su : er)}
                </Col>

            </Row>
            <Row className="justify-content-md-center">
                <Col xs={10} sm={4} style={{ paddingRight: '0px' }}>
                    <label><b>Dueño de contrato <label className={estilos.requerido}>*</label></b></label>
                    <div>
                        <Select value={this.state.contrato['dueño de contrato']} style={{ width: '100%' }} onChange={(e) => this.handleChangeDropdown(e, 'dueño de contrato')}>
                            <Option value='Sifuturo'>Sifuturo</Option>
                            <Option value='CharPC'>CharPC</Option>
                        </Select>
                    </div>
                </Col>
                <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', paddingLeft: '0px', marginTop: '26px' }}>
                    {this.state.validar['dueño de contrato'] === undefined ? null : (this.state.validar['dueño de contrato'] ? su : er)}
                </Col>
                <Col xs={10} sm={4} style={{ paddingRight: '0px' }}>
                    <label><b>Cliente <label className={estilos.requerido}>*</label></b></label>
                    <div>
                        <Select value={this.state.contrato.cliente ? JSON.stringify(this.state.contrato.cliente) : null} style={{ width: '100%' }} onChange={(e) => this.handleChangeDropdown(JSON.parse(e), 'cliente')}>
                            {this.state.listaCliente.map(f => (
                                <Option key={f.id} value={JSON.stringify(f)}>{f.nombre}</Option>
                            ))}
                        </Select>
                    </div>
                </Col>
                <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', paddingLeft: '0px', marginTop: '26px' }}>
                    {this.state.validar['cliente'] === undefined ? null : (this.state.validar['cliente'] ? su : er)}
                </Col>

            </Row>
            <br />

            <Row className="justify-content-md-center">
                <Col xs={10} sm={4} style={{ paddingRight: '0px' }}>
                    <label><b>Personal Ventas <label className={estilos.requerido}>*</label></b></label>
                    <div>
                        <Select value={this.state.contrato['personal ventas'] ? JSON.stringify(this.state.contrato['personal ventas']) : null} style={{ width: '100%' }} onChange={(e) => this.handleChangeDropdown(JSON.parse(e), 'personal ventas')}>
                            {this.state.listaVentas.map(f => (
                                <Option key={"ventas-" + f.ci} value={JSON.stringify(f)}>{f.apellido + " " + f.nombre}</Option>
                            ))}
                        </Select>
                    </div>
                </Col>
                <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', paddingLeft: '0px', marginTop: '26px' }}>
                    {this.state.validar['personal ventas'] === undefined ? null : (this.state.validar['personal ventas'] ? su : er)}
                </Col>
                <Col xs={10} sm={4} style={{ paddingRight: '0px' }}>
                    <label><b>Duración Contrato <label className={estilos.requerido}>*</label></b></label>
                    <div>
                        <Calendar className=''
                            id='calendar-duración contrato'
                            value={this.state.contrato['duración contrato']}
                            name='duración contrato'
                            readOnlyInput
                            onChange={this.handleChangeCalendarRange}
                            dateFormat="yy/mm/dd"
                            monthNavigator={true}
                            yearNavigator={true}
                            yearRange="2010:2100"
                            numberOfMonths={1}
                            selectionMode="range"
                            showIcon={true} />
                    </div>
                </Col>
                <Col xs={1} sm={1} style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', paddingLeft: '0px', marginTop: '26px' }}>
                    {this.state.years} años
                </Col>
                <Col xs={1} sm={1} style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', paddingLeft: '0px', marginTop: '26px' }}>
                    {this.state.validar['duración contrato'] === undefined ? null : (this.state.validar['duración contrato'] ? su : er)}
                </Col>
            </Row>
            <br></br>
            <Row className="justify-content-md-center">
                <Col xs={10} sm={4} style={{ paddingRight: '0px' }}>
                    <label><b>Mantenimientos <label className={estilos.requerido}>*</label></b></label>
                    <TextInputField
                        label=""
                        name="mantenimientos"
                        value={this.state.contrato['mantenimientos']}
                        onChange={this.handleChangeInput}
                        placeholder="Ingresar número de mantenimientos"
                    />
                </Col>
                <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', paddingLeft: '0px', marginTop: '26px' }}>
                    {this.state.validar['mantenimientos'] === undefined ? null : (this.state.validar['mantenimientos'] ? su : er)}
                </Col>
                <Col xs={10} sm={4} style={{ paddingRight: '0px' }}>
                    <label><b>Técnico Preferencial</b></label>
                    <div>
                        <Select value={this.state.contrato['técnico preferencial'] ? JSON.stringify(this.state.contrato['técnico preferencial']) : null} style={{ width: '100%' }} onChange={(e) => this.handleChangeDropdown(JSON.parse(e), 'técnico preferencial')}>
                            {this.state.tecnico.map(f => (
                                <Option key={"tecnico-" + f.ci} value={JSON.stringify(f)}>{f.apellido + " " + f.nombre}</Option>
                            ))}
                        </Select>
                    </div>

                </Col>
                <Col xs={2} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: '0px', marginTop: '26px' }}>
                    {this.state.validar['técnico preferencial'] === undefined ? null : (this.state.validar['técnico preferencial'] ? su : er)}
                </Col>
            </Row>

            {this.state.contrato.id === '' ? <Button label="Ingresar Equipos" onClick={this.siguiente}></Button> :
                <div>
                    <br></br>
                    <Divider></Divider>
                    <h4>Equipos</h4>
                    <br></br>
                </div>}
        </Auxiliar>


        const steps = [
            {
                title: '',
                content: ubicacion,
                icono: <i class="fas fa-map-marked-alt"></i>
            },
            {
                title: '',
                content: infoEquipo,
                icono: <i class="fas fa-laptop-code"></i>
            },
            {
                title: '',
                content: sla,
                icono: <i class="fas fa-calendar-alt"></i>
            },
        ];

        let formEquipo =

            <div>
                <Steps current={current}>
                    {steps.map((item, i) => (
                        <Step key={i} title={item.title} icon={item.icono} />
                    ))}
                </Steps>
                <br></br>
                {current === 0 && (<div><i style={{ fontSize: '15px', color: '#007ad9', cursor: 'pointer' }} class="fas fa-map-marker-alt" onClick={() => this.direccionCliente()}> Dirección cliente</i> <br></br></div>)}
                <br></br>
                <div >
                    <div className="steps-content">{steps[current].content}</div>
                    <Row>
                        <div className="steps-action">
                            <br></br>
                            {/* {current === 0 && (<Button style={{ marginLeft: 8 }} className="p-button-rounded"  onClick={() => this.direccionCliente()} label="Dirección Cliente"></Button>)} */}
                            {current > 0 && (<Button style={{ marginLeft: 8 }} className="p-button-rounded" onClick={() => this.prev()} label="Anterior"></Button>)}
                            {current < steps.length - 1 && (<Button style={{ marginLeft: 8 }} className="p-button-rounded" onClick={() => this.next()} label="Siguiente"></Button>)}
                            {current === steps.length - 1 && (<Button style={{ marginLeft: 8 }} className="p-button-rounded" label="Guardar Equipo" onClick={this.guardar}></Button>)}
                            {current >= 0 && (<Button style={{ marginLeft: 8 }} className="p-button-rounded" onClick={() => this.cancelar()} label="Limpiar"></Button>)}
                            {current >= 0 && (<Button style={{ marginLeft: 8 }} icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => this.borrar()} ></Button>)}
                        </div>
                        <br></br>
                    </Row>
                </div>
            </div>

        equipo = <Auxiliar>
            <Col md={{ offset: 10 }}><input type="file" className={estilos.inputFile} accept={[".xlsx", ".xlsb", ".xlsm", ".xls", ".xml", ".csv"]} onChange={this.handleChange} /></Col>
            <Tabla tipo='seleccion' data={this.state.equiposGuardados} seleccionarUno={this.seleccionarRegistro} noMostrar={this.state.tabla.noMostrar} />
        </Auxiliar>

        //  equipo = this.state.sla ? this.state.sla === 'sla por contrato' ? <TablaLocal cabecera='Equipos' csv titulos={this.state.tabla.titulos1} noMostrar={this.state.tabla.noMostrar} identificador='Contrato'></TablaLocal> :
        //      <TablaLocal cabecera='Equipos' csv titulos={this.state.tabla.titulos2} noMostrar={this.state.tabla.noMostrar} identificador='Contrato'></TablaLocal> : null
        // <ImportCSV form={this.state.tabla.form} noMostrar={this.state.tabla.noMostrar} titulos={this.state.tabla.form.titulos}></ImportCSV>
        return (
            <Auxiliar>
                <Spin spinning={this.state.loading}>
                    <div>
                        <Titulo texto="Módulo de Contrato"></Titulo>
                    </div>


                    {this.state.cargando ? <Spinner /> :
                        <div>

                            <Modal
                                visible={this.state.visible}
                                width="900px"
                                onCancel={this.handleCancel}
                                footer={[
                                    !this.state.sla ?
                                        <div> <Button onClick={this.handleContrato} label="SLA por contrato"></Button>,
                                              <Button type="primary" onClick={this.handleEquipo} label="SLA por equipo"></Button></div> :
                                        <div> <Button onClick={this.handleCancelarSla} label="Cancelar"></Button>,
                                              <Button type="primary" onClick={this.aceptar} label="Aceptar"></Button></div>
                                ]}>
                                {
                                    this.state.sla ? this.state.sla :
                                        <div key="modal"><Icon style={{ fontSize: '22px' }} type="question-circle" theme="twoTone" /><label style={{ marginLeft: '4px', fontSize: '16px' }}>¿Que tipo de SLA se aplicará? </label></div>}

                                {
                                    this.state.sla === 'sla por contrato' ? <Auxiliar>
                                        <DataTable key="modal" style={{ fontSize: '116px' }} value={this.dataSLA} selectionMode="single" responsive={true} editable={true}>
                                            <Column style={{ width: '9%', fontSize: '0.1em' }} className="Header" field='prioridad' header='Prioridad' editor={this.editor} />
                                            <Column style={{ width: '16%', fontSize: '0.1em' }} className="Header" field='descripción' header='Descripción' editor={this.editor} />
                                            <Column style={{ width: '10%', fontSize: '0.1em' }} className="Header" field='tiempo respuesta (horas)' header='Tiempo respuesta (horas)' editor={this.editor} />
                                            <Column style={{ width: '20%', fontSize: '0.1em' }} className="Header" field='modalidad de comunicación' header='Modalidad de comunicación' editor={this.editor} />
                                            <Column style={{ width: '10%', fontSize: '0.1em' }} className="Header" field='tiempo máximo de diagnóstico (horas)' header='Tiempo máximo de diagnóstico (horas)' editor={this.editor} />
                                            <Column style={{ width: '10%', fontSize: '0.1em' }} className="Header" field='tiempo máximo de solución (horas)' header='Tiempo máximo de solución (horas)' editor={this.editor} />
                                            <Column style={{ width: '10%', fontSize: '0.1em' }} className="Header" field='forma de trabajo para diagnóstico o solución' header='Forma de trabajo' editor={this.editor} />
                                            <Column style={{ width: '11%', fontSize: '0.1em' }} className="Header" field='entregables' header='Entregables' editor={this.editor} />
                                        </DataTable>
                                    </Auxiliar> : null


                                }
                            </Modal>



                            <Card style={{ padding: '2%', width: '90%', marginLeft: '5%' }}>
                                {/* <Row style={{ textAlign: "right" }}><Col>{salir}</Col></Row> */}
                                {/* <form onSubmit={this.onSubmitFuncion}> */}
                                <Row style={{ justifyContent: 'center' }}>
                                    <Col sm={12}>
                                        {(!this.state.siguiente && this.state.contrato.id === '') || (this.state.siguiente && this.state.contrato.id !== '') ? generales : null}
                                    </Col>
                                    <Col sm={4}>
                                        {/* {<ClienteAcordeon>{{ generales, sla, equipo }}</ClienteAcordeon> } */}
                                        {/* {this.state.siguiente && this.state.contrato.id !== "" ? <div>{generales, sla, equipo}</div>:null} */}
                                        {this.state.siguiente ? formEquipo : null}
                                    </Col>
                                    <Col sm={8} >
                                        {this.state.siguiente ? equipo : null}
                                    </Col>
                                </Row>
                            </Card>
                            <Row>
                                <Col style={{ textAlign: "center", marginBottom: '3%', padding: '2%', margin: '0%' }}>
                                    {this.state.siguiente && this.state.contrato.id === '' ? <Button label="REGRESAR" onClick={() => this.setState({ siguiente: false, sla: null })} /> : null}
                                    {this.state.siguiente ? <BotonRol style={{ marginLeft: 8 }} etiqueta="GUARDAR CONTRATO" funcion={this.onSubmitFuncion} /> : null}
                                </Col>
                            </Row>
                            {/* </form> */}
                        </div>}
                </Spin>
            </Auxiliar>
        )
    }
    componentWillUnmount() {
        // localStorage.clear()
        limpiarLocalStorage()
    }
}

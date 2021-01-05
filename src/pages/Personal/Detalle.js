import React, { Component } from 'react'
import Auxiliar from '../../cao/Auxiliar';
import Titulo from '../../UI/Titulo/Titulo';
import Form from '../../UI/Form/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Servicio from '../../Servicio';
import Spinner from '../../UI/Spinner/Spinner';
import Boton from '../../UI/Boton/Boton';
import Ordenar from '../../function/Ordenar/Ordenar';
import {Panel} from 'primereact/panel';
import './Detalle.css'
import {Card} from 'semantic-ui-react'


export default class Detalle extends Component {

    constructor(){
        super();
        this.state={
            loading:true,
            data: null
        }
        this.accion = null
        try {
            this.accion = localStorage.getItem("accion")
        } catch (error) {

        }
    }

    componentWillMount() {
        try {
            let seleccionado = JSON.parse(localStorage.getItem("seleccionado"))
            try {
                seleccionado['especialidad hardware'] = JSON.parse(seleccionado['especialidad hardware'])
            } catch (error) {
                seleccionado['especialidad hardware'] = null
            }
            try {
                seleccionado['especialidad software'] = JSON.parse(seleccionado['especialidad software'])
            } catch (error) {
                seleccionado['especialidad software'] = null
            }
            try {
                seleccionado['especialidad consultoria'] = JSON.parse(seleccionado['especialidad consultoria'])
            } catch (error) {
                seleccionado['especialidad consultoria'] = null
            }
            let campos;
            if (seleccionado) {
                let objetoAWS = { "operation": 'list', "tableName": 'especialidad', "payload": [] }

                Servicio.put('https://1ps11pdwp0.execute-api.us-east-1.amazonaws.com/default/crud', objetoAWS)
                    .then(resp => {
                        let dataAWS = resp.data.payload;
                        campos = this.llenarData(seleccionado, dataAWS)
                        this.setState({ data: campos, loading: false })
                    })
                    .catch(err => {
                        console.log("Error servidor")
                    });
            }else{
                this.props.history.push('/home/persona/')
            }
            localStorage.removeItem("seleccionado")
        } catch (error) {
            this.props.history.push('/home/persona/')
        }
    }

    llenarData = (data, especialidadAWS) => {
        let especialidadSoftware = []
        let especialidadHardware = []
        let especialidadConsultoria = []
        especialidadAWS.map(m =>{
            switch (m.especialidad) {
                case "hardware":
                        especialidadHardware.push(m)
                        break;            
                case "software":
                        especialidadSoftware.push(m)
                        break;
                case "consultoria":
                        especialidadConsultoria.push(m)
                        break;
                default:
                    break;
            }
            return m
        })
        let campos = {};
        let titulos = []
        Object.keys(data).map(d =>(
            titulos.push(d)
        ))
        
        titulos = Ordenar(titulos)

        titulos.map(d =>{
            // console.log(d)
            switch (d) {
                case "apellido" :
                        campos[d] = {
                            elementType: 'input',
                            elementConfig: {
                                type: 'text',
                                placeholder: d,
                                etiqueta: d,
                                tooltip: "Ingresar un apellido válido"
                            },
                            value: data[d],
                            validation: {
                                required: true
                            }
                        }
                        break;
                case 'nombre' :
                        campos[d] = {
                            elementType: 'input',
                            elementConfig: {
                                type: 'text',
                                placeholder: d,
                                etiqueta: d,
                                tooltip: "Ingresar un nombre válido"
                            },
                            value: data[d],
                            validation: {
                                required: true
                            }
                        }
                        break;
                case 'teléfono':
                        campos[d] = {
                            elementType: 'input',
                            elementConfig: {
                                type: 'text',
                                placeholder: d,
                                etiqueta: d,
                                tooltip: "Ingresar número teléfono válido"
                            },
                            value: data[d],
                            validation: {
                                required: true
                            }
                        }
                        break;
                case 'título':
                    campos[d] = {
                        elementType: 'input',
                        elementConfig: {
                            type: 'text',
                            placeholder: d,
                            etiqueta: d,
                            tooltip: "Ingresar un título válido"
                        },
                        value: data[d],
                        validation: {
                            required: true
                        }
                    }
                    break;
                case "ci" :
                        let desactivo;
                        if(data[d]===null){
                            desactivo = false;
                        }else{
                            desactivo = true
                        }

                        campos[d] = {
                            elementType: 'input',
                            elementConfig: {
                                type: 'text',
                                placeholder: d,
                                etiqueta: d,
                                disabled: desactivo,
                                tooltip: "Ingresar número de cédula válido"
                            },
                            value: data[d],
                            validation: {
                                required: true
                            }
                        }
                        break;
                case "correo":
                    campos[d] = {
                        elementType: 'input',
                        elementConfig: {
                            type: 'email',
                            placeholder: d,
                            etiqueta: d,
                            tooltip: "Ingresar dirección de correo válida",
                            id:'password'
                        },
                        value: data[d],
                        validation: {
                            required: true
                        }
                    }
                    break;
                case "clave":
                    campos[d] = {
                        elementType: 'input',
                        elementConfig: {
                            type: 'password',
                            placeholder: d,
                            etiqueta: d,
                            tooltip: "Ingresar una clave "
                        },
                        value: data[d],
                    }
                    break;
                case "estado":
                    campos[d] = {
                        elementType: 'dropDown',
                        elementConfig: {
                            options: [
                                    { label: ' --Selecione-- ', value: "" },
                                    { label: 'Activo', value: "activo" },
                                    { label: 'Inactivo', value: "inactivo" },
                                ],
                                etiqueta: d,
                                tooltip: "Seleccionar un estado"
                        },
                        value: data[d],
                        validation: {
                            required: true
                        }
                    }
                    break;
                case "especialidad hardware":
                    campos[d] = {
                        elementType: 'multi',
                        elementConfig: {
                            etiqueta: d,
                            filtro: "equipo/producto",
                            lista: especialidadHardware,
                            tooltip: "Seleccionar una especialidad",
                            multiple: true
                        },
                        value: data[d],
                    }
                    break;
                case "especialidad software":
                    campos[d] = {
                        elementType: 'multi',
                        elementConfig: {
                            etiqueta: d,
                            filtro: "equipo/producto",
                            lista: especialidadSoftware,
                            tooltip: "Seleccionar una especialidad",
                            multiple: true
                        },
                        value: data[d],
                    }
                    break;
                case "especialidad consultoria":
                    campos[d] = {
                        elementType: 'multi',
                        elementConfig: {
                            etiqueta: d,
                            filtro: "equipo/producto",
                            lista: especialidadConsultoria,
                            tooltip: "Seleccionar una especialidad",
                            multiple: true
                        },
                        value: data[d],
                    }
                    break;
                case "rol":
                        campos[d] = {
                            elementType: 'dropDown',
                            elementConfig: {
                                options: [
                                    { label: '--Selecionar--', value: "" },
                                    { label: 'Administrador', value: "administrador" },
                                    { label: 'Técnico', value: "técnico" },
                                    { label: 'Ventas', value: "ventas" },
                                ],
                                etiqueta: d,
                                tooltip: "Seleccionar un rol"
                            },
                            value: data[d],
                            validation: {
                                required: true
                            }
                        }
                        break;

                default:
                    break;
            }
            return campos;
        })
        return campos
    }
    
    regresar = () => {
        this.props.history.goBack();
    }
    

    render() {
        // let izquierda = <Auxiliar>
        //         <Titulo texto="Personal Técnico"></Titulo>
        //         <p>Ingresa la información de todo el personal de la empresa</p>
        //         <p><strong>Correo: </strong>*****@*****.com</p>
        //         <p><strong>Rol: </strong>Administrador/Técnico/Cliente</p>
        //         <p><strong>Estado: </strong>Activo/Desactivado</p>
        //     </Auxiliar>
        let derecha =this.state.loading?<Spinner></Spinner>:<Form {...this.props} campos={this.state.data} axiosLink="https://o1nki9lmf9.execute-api.us-east-1.amazonaws.com/default/crudPersonal" operacion={this.accion === "nuevo" ?"create":"update"} tabla="personal"></Form>

        let salir = <div style={{textAlign:"right"}}><Boton click={this.regresar} btnClase="Exit">X</Boton></div>
        return (
            <Auxiliar>
                <Container>
                        <Titulo texto="Módulo de Personal"></Titulo>
                    <Card style={{width:'100%',margin:'0%'}}>
                        <Panel >
                            <Row>
                                <Col xs={12} md={5}></Col>
                                <Col xs={12} md={7}><Container>{salir}</Container></Col>
                            </Row>
                            
                            <Row style={{ justifyContent: "center" , textTransform:'capitalize'}}>
                        
                                <Col xs={12} md={7}>{derecha}</Col>
                            </Row>
                        </Panel>
                    </Card>
                </Container>
                
            </Auxiliar>
        )
    }
}

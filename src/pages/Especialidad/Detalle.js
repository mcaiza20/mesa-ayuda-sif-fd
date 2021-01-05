import React, { Component } from 'react'
import Auxiliar from '../../cao/Auxiliar';
import Titulo from '../../UI/Titulo/Titulo';
import Form from '../../UI/Form/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Servicio from '../../Servicio';
import Spinner from '../../UI/Spinner/Spinner';
import Boton from '../../UI/Boton/Boton';
import {Panel} from 'primereact/panel';
import {Card} from 'semantic-ui-react'

export default class Detalle extends Component {

    state ={
        loading:true
    }
    componentDidMount() {
        try {
            let seleccionado = JSON.parse(localStorage.getItem("seleccionado"))
            // let seleccionado = JSON.parse(localStorage.getItem("seleccionado")).id
            let campos;
            if(seleccionado){
                // let objetoAWS = { "operation": 'getOne', "tableName": 'especialidad', "payload": { "id": seleccionado } }
                // Servicio.put('https://1ps11pdwp0.execute-api.us-east-1.amazonaws.com/default/crud', objetoAWS)
                //     .then(resp => {
                //         let dataAWS = resp.data.payload;
                //         // console.log(dataAWS)
                //         campos = this.llenarData(dataAWS)
                //         this.setState({data:campos,loading:false})
                //     })
                //     .catch(err => {
                //         console.log("Error servidor")
                //     });
                campos = this.llenarData(seleccionado)
            }else{
                campos = this.llenarData(JSON.parse(localStorage.getItem("seleccionado")))
            }
            localStorage.removeItem("seleccionado")
            this.setState({data:campos,loading:false})
        } catch (error) {
            this.props.history.push('/home/especialidad/')
        }
    }

    llenarData = (data) => {
        let campos = {};
        Object.keys(data).map(d =>{
            switch (d) {
                case "especialidad" :
                        campos[d] = {
                            elementType: 'dropDown',
                            elementConfig: {
                                options: [
                                    { label: '--Selecionar--', value: "" },
                                    { label: 'Hardware', value: "hardware" },
                                    { label: 'Software', value: "software" },
                                    { label: 'Consultoría', value: "consultoria" },
                                ],
                                placeholder: d,
                                etiqueta: d,
                                tooltip: "Ingrese una especialidad válida"                     
                            },
                            value: data[d],
                            validation: {
                                required: true
                            }
                        }
                        break;
                case "id" :
                case "equipo/producto" :
                case 'descripción':
                    campos[d] = {
                        elementType: 'input',
                        elementConfig: {
                            type: 'text',
                            placeholder: d,
                            etiqueta: d,
                            tooltip:"Ingrese una descripción válida"                            
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
        // console.log(campos)
        return campos
    }
    
    regresar = () => {
        this.props.history.goBack();
    }

    render() {
        // let izquierda = <Auxiliar>
        //         <Titulo texto="Especialidades"></Titulo>
        //         <p>Ingresa las especialidades del persona de la empresa</p>
        //         <p><strong>Especialidad: </strong>AS400</p>
        //         <p><strong>Descripción: </strong>Descripción de la especialidad</p>
                
        //     </Auxiliar>
        let derecha =this.state.loading?<Spinner></Spinner>:<Form {...this.props} campos={this.state.data} axiosLink="https://1ps11pdwp0.execute-api.us-east-1.amazonaws.com/default/crud" operacion="create" tabla="especialidad"></Form>

        let salir = <div style={{textAlign:"right"}}><Boton click={this.regresar} btnClase="Exit">X</Boton></div>
        
        return (
            <Auxiliar>
                <Container>
                        <Titulo texto="Módulo de especialidad"></Titulo>
                    <Card style={{width:'100%',margin:'0%'}}>
                        <Panel>
                    <Row>
                        <Col xs={12} md={5}></Col>
                        <Col xs={12} md={7}><Container>{salir}</Container></Col>
                    </Row>

                    <Row style={{ justifyContent: "center", textTransform:'capitalize' }}>
                        <Col xs={12} md={7}>{derecha}</Col>
                    </Row>
                </Panel>
                    </Card>
                </Container>
                
                
            </Auxiliar>
        )
    }
}

import React, { Component } from 'react';
import Tabla from '../../UI/Tablas/Tabla/Tabla';
import axios from '../../Servicio';
import Spinner from '../../UI/Spinner/Spinner';
import Container from 'react-bootstrap/Container'
import Titulo from '../../UI/Titulo/Titulo';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {Panel} from 'primereact/panel';

class ClienteContratos extends Component {

    constructor(){
        super();
        this.state={
            data:{},
            consultado:false,
            objAws: {
                "operation": "getByCliente",
                "tableName": "contrato",
                "payload": {}
              },
              url:'https://0utuqhew54.execute-api.us-east-1.amazonaws.com/default/crudContrato',
              equipos:''
        }

    }

   

    componentWillMount(){
        let equipos="";
        try {
            let seleccionado = JSON.parse(localStorage.getItem("seleccionado"))
            let objAWSGetContr = {...this.state.objAws}
            objAWSGetContr.payload['cliente']=seleccionado.id;
            // console.log('objAWS',objAWSGetContr);
            let contratos;
            axios.put(this.state.url,objAWSGetContr).then(resp => {
                //console.log('contratos',resp); 
                contratos= resp.data.payload;
                contratos.map(contr=>{
                    Object.keys(contr).map(key => {
                        if(key === 'duración contrato'){

                            contr[key] = 'Desde: '+(contr[key][0]?contr[key][0].substring(0, 10):'')+' Hasta: '+(contr[key][1]?contr[key][1].substring(0, 10):'');
                        }
                        
                        if(key === 'equipo'){
                            equipos = contr[key].length +' equipos con Nº de Serie '
                            contr[key].map(equipo=>{
                                console.log(equipo)
                                equipos += (equipo['serie']+", ")
                               //equipos.push(JSON.stringify(equipo).replace(/['"{}]+/g, ' '))
                               //console.log(equipos)
                               return equipo
                            })
                            //contr[key] = JSON.stringify(equipos);
                            contr[key] = equipos.substring(0, equipos.length -2);

                        }
                        return key
                    });
                    return contr
                });
                this.setState({contratos:contratos,consultado:true});
            });
            //console.log("selected-cli-contr",contrato);
        
            localStorage.removeItem("seleccionado")
        } catch (error) {
            this.props.history.push('/home/cliente/')
        }
    }

    regresar=()=>{
        this.props.history.push('/home/cliente/')
    }
    crearContrato=()=>{
        this.props.history.push('/home/contrato/detalle')
    }


    render() {
        // console.log('state',this.state)
        let principal = null;
        if(this.state.consultado){
            principal = this.state.contratos.length>0 ? <Tabla opciones={{ver:'/home/contrato'}} tipo='opciones-acordeon' data={this.state.contratos} noMostrar={['duración contrato','equipo']}></Tabla>:
                        <Row className="justify-content-md-center">
                            <Col xs={8} md={7}>
                                <Panel style={{textAlign:'center'}}>
                                <h3>El cliente seleccionado no tiene contratos</h3>
                                <br></br>
                                <Button style={{marginRight:'1%'}} variant="primary" onClick={this.regresar}>Cancelar</Button>

                                <Button style={{marginLeft:'1%'}} variant="primary" onClick={this.crearContrato}>Crear Contrato</Button>
                                </Panel>
                            </Col>
                        </Row>
        }
        else{
            principal=<Spinner></Spinner>
        }

        return (
            <Container>
                <Titulo texto="Contratos"></Titulo>
                {principal}
            </Container>
        );
    }
}

export default ClienteContratos;
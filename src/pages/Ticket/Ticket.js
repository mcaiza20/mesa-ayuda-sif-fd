import React, { Component } from 'react'
import Spinner from '../../UI/Spinner/Spinner';
import { Link } from "react-router-guard";
import Tabla from '../../UI/Tablas/Tabla/Tabla';
import Axios from 'axios';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import './Ticket.css' 
import Auxiliar from '../../cao/Auxiliar';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import {Button} from 'primereact/button';
import conf from '../../data/configuracion.json'
import aes256 from 'aes256'


export default class ListaTickets extends Component {
    state = {
        loading: true,
        url: 'https://qol0qatnki.execute-api.us-east-1.amazonaws.com/default/listaTicketsActivos',
        tickets:[]
    }

    componentDidMount() {
        let usuario = JSON.parse(aes256.decrypt(conf.KEYLOCALSTORAGE, localStorage.getItem(conf.USUARIOLOCAL)));
        //let usuario = JSON.parse(localStorage.getItem("usuario"))
        let rol = usuario.usuarioAWS.attributes['custom:rol']
        let objetoAWSCliente = {}
        if(rol === "cliente"){
            objetoAWSCliente = {"cliente":usuario.usuarioDynamoDB.cliente.id}
        }if(rol === "personal"){
            objetoAWSCliente = {}
        }

        Axios.put(this.state.url, objetoAWSCliente).then(r => {
            let tabla = r.data.payload
            let inicial=[]
            tabla.map(m => {
                if(m.estado==='activo'){
                    inicial.push(m)
                }
                m.cliente2 = m.cliente
                m.cliente = m.cliente.nombre
                m.equipo2 = m.equipo
                m['técnico asignado 2'] =m['técnico asignado']
                if(m['técnico asignado'].nombre && m['técnico asignado'].apellido){
                m['técnico asignado'] = m['técnico asignado'].nombre +" "+ m['técnico asignado'].apellido
                }
                m.equipo = 'Modelo: ' + m.equipo.MODELO + ' Serie: ' + m.equipo['SERIE']
                return m
            })
            this.setState({ loading: false, data: tabla, tickets: inicial })
        }).catch(error => console.log(error))
    //    console.log(this.state.data)
    }

    filtrarTickets(e){
        let tickets = this.state.data.filter(tickets=> (tickets.estado === e))
        this.setState({tickets: tickets})
    }

    render() {
        let tabla = 
        <Tabla tipo='opciones'
            data={this.state.tickets}
            opciones={{ ver: '/home/ticket/detalle' }}
            noMostrar={['estado', 'personal', 'repuesto', 'cliente2', 'equipo2','sla al cliente','técnico asignado 2']} />    

        return (
            <Auxiliar>
                <Container>
                <Row>
                    <Col className="principal">
                        <div > Ticket</div>
                    </Col>
                    <Col className="botonCrear">
                        <Link to='/home/ticket/generar'>
                            <Button label="Crear Ticket" icon="pi pi-pencil"/>
                        </Link>
                    </Col>
                </Row>
                </Container>
                {this.state.loading ? <Spinner /> :
                <div style={{width:'95%', paddingLeft:'5%'}}>
                    <Tabs defaultActiveKey="activo" onSelect={e => this.filtrarTickets(e)}>
                        <Tab eventKey="activo" title="Tickets Activos" id='llenos'  >
                            <br/>
                         {tabla} 
                        </Tab>
                        <Tab eventKey="asignado" title="Tickets Asignados" >
                            <br />
                         {tabla} 
                        </Tab>
                        <Tab eventKey="revisado" title="Tickets Revisados" >
                            <br />
                         {tabla} 
                        </Tab>
                        <Tab eventKey="en espera" title="Tickets En espera" >
                            <br />
                         {tabla} 
                        </Tab>
                        <Tab eventKey="solucionado" title="Tickets Solucionados" >
                            <br />
                         {tabla} 
                        </Tab>
                        <Tab eventKey="terminado" title="Tickets Terminados" >
                            <br />
                         {tabla} 
                        </Tab>
                    </Tabs>
                </div>    
                }
            </Auxiliar>
        )
    }
}


import React, { Component } from 'react'
import { Link } from "react-router-guard";
import { faMicrochip, faUser, faPeopleCarry, faFileSignature, faTicketAlt, faUserGraduate, faFileArchive } from '@fortawesome/free-solid-svg-icons'
import estillos from './Menu.module.css'
import Auxiliar from '../../cao/Auxiliar';
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { limpiarLocalStorage } from '../../function/LocalStorage/limpiarLocalStorage';
import conf from '../../data/configuracion.json'
import aes256 from 'aes256'

export default class Menu extends Component {
    constructor(){
        super()
        this.state = {
            rol : null
        }
    }

    
    componentWillMount(){
        debugger
        limpiarLocalStorage()        
        try {
            let decryptedString = JSON.parse(aes256.decrypt(conf.KEYLOCALSTORAGE, localStorage.getItem(conf.USUARIOLOCAL)));
            this.state.rol = decryptedString.usuarioAWS.attributes['custom:rol']
        } catch (error) {
            
        }         
        // localStorage.clear()
        console.log("componentWillMount")
    }
    go =(ruta)=> {
        debugger
        this.props.history.push(ruta)
    }
    
    render() {
        return (
            <Auxiliar>
               <Container >
                    <Row className="justify-content-md-center">
                        {this.state.rol === "personal" || this.state.rol === "cliente" ?<Col style={{ textAlign: 'center' }} sm={4}>
                        <Link to="/home/ticket">
                            <div className={estillos.content}>
                                <div className={estillos.card} >
                                    <div className={estillos.icon}>
                                        <FontAwesomeIcon icon={faTicketAlt} size='2x'/>
                                    </div>
                                    <p className={estillos.title}>Ticket</p>
                                    <p className={estillos.text}>Seleccionar esta opción para ver y crear un ticket</p>
                                </div>
                            </div>
                        </Link>
                        </Col>:null}
                        {this.state.rol === "personal"?<Col  style={{textAlign:'center'}} sm={4}>
                        <Link to="/home/cliente">
                            <div className={estillos.content}>
                                <div className={estillos.card}>
                                    <div className={estillos.icon}>
                                        <FontAwesomeIcon icon={faUser} size='2x'  />
                                    </div>
                                    <p className={estillos.title}>CLIENTE</p>
                                    <p className={estillos.text}>Seleccionar esta opción para ver y crear un cliente</p>
                                </div>
                            </div>
                        </Link>
                        </Col>:null}
                        {this.state.rol === "personal"?<Col  style={{textAlign:'center'}} sm={4}>
                        <Link to="/home/contrato">
                        <div className={estillos.content}>
                                <div className={estillos.card}>
                                    <div className={estillos.icon}>
                                        <FontAwesomeIcon icon={faFileSignature} size='2x' />
                                    </div>
                                    <p className={estillos.title}>CONTRATO</p>
                                    <p className={estillos.text}>Seleccionar esta opción para ver y crear un contrato</p>
                                </div>
                            </div>
                        </Link>        
                        </Col>:null}
                    {/*</Row>
                    <Row className="justify-content-md-center">*/}
                        {this.state.rol === "personal"?<Col  style={{textAlign:'center'}} sm={4}>
                        <Link to="/home/persona">
                            <div className={estillos.content}>
                                <div className={estillos.card}>
                                    <div className={estillos.icon}>
                                        <FontAwesomeIcon icon={faPeopleCarry} size='2x' />
                                    </div>
                                    <p className={estillos.title}>PERSONAL TÉCNICO</p>
                                    <p className={estillos.text}>Seleccionar esta opción para ver y crear personal</p>
                                </div>
                            </div>
                        </Link>
                        </Col>:null}
                        {this.state.rol === "personal"?<Col  style={{textAlign:'center'}} sm={4}>
                        <Link to="/home/especialidad">    
                        <div className={estillos.content}>
                                <div className={estillos.card}>
                                    <div className={estillos.icon}>
                                        <FontAwesomeIcon icon={faUserGraduate} size='2x' />
                                    </div>
                                    <p className={estillos.title}>ESPECIALIDADES</p>
                                    <p className={estillos.text}>Seleccionar esta opción para ver y crear una especialidad</p>
                                </div>
                            </div>
                        </Link>
                        </Col>:null}
                        {this.state.rol === "personal"?<Col  style={{textAlign:'center'}} sm={4}>
                        <Link to="/home/reporte"> 
                            <div className={estillos.content}>
                                <div className={estillos.card}>
                                    <div className={estillos.icon}>
                                        <FontAwesomeIcon icon={faFileArchive} size='2x' />
                                    </div>
                                    <p className={estillos.title}>REPORTES</p>
                                    <p className={estillos.text}>Seleccionar esta opción para ver los reportes disponibles</p>
                                </div>
                            </div>
                            </Link>
                        </Col>:null}
                    {/*</Row>
                    <Row className="justify-content-md-center">*/}
                        {this.state.rol === "personal"?<Col  style={{textAlign:'center'}} sm={4}>
                        <Link to="/home/repuesto">
                            <div className={estillos.content}>
                                <div className={estillos.card}>
                                    <div className={estillos.icon}>
                                        <FontAwesomeIcon icon={faMicrochip} size='2x' />
                                    </div>
                                    <p className={estillos.title}>INVENTARIO</p>
                                    <p className={estillos.text}>Seleccionar esta opción para ver y crear un repuesto</p>
                                </div>
                            </div>
                        </Link>
                        </Col>:null}
                        
                    </Row>
                </Container>
            </Auxiliar>
        )
    }
}
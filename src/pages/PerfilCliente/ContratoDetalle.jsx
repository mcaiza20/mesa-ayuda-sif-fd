import React, { Component } from 'react'
import { limpiarLocalStorage } from '../../function/LocalStorage/limpiarLocalStorage'
import Auxiliar from '../../cao/Auxiliar'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Titulo from '../../UI/Titulo/Titulo'

export default class ContratoDetalle extends Component {
    constructor(){
        super()
        this.state = {
            contrato : null
        }
        try {
            this.state.contrato = JSON.parse(localStorage.getItem("seleccionado"))
        } catch (error) {
            this.props.history.push("/home/menu/");
        }
    }

    componentWillUnmount() {
        limpiarLocalStorage()
    }

    render() {
        return (
            <Auxiliar>
                <Container>
                    <Row style={{justifyContent: "center"}}><Titulo texto={"Contrato '"+this.state.contrato['nombre de contrato']+"' N°"+this.state.contrato['número de contrato']} /></Row>
                    <Row>
                        <Col style={{marginBottom:"20px"}} sm={12} md={6}><Col>Dueño de contrato</Col><Col>{this.state.contrato['dueño de contrato']}</Col></Col>
                        <Col style={{marginBottom:"20px"}} sm={12} md={6}><Col>horario del contrato</Col><Col>{this.state.contrato['horario del contrato']}</Col></Col>
                        <Col style={{marginBottom:"20px"}} sm={12} md={4}><Col>duración contrato</Col><Col>{this.state.contrato['duración contrato']}</Col></Col>
                        <Col style={{marginBottom:"20px"}} sm={12} md={4}><Col>mantenimientos</Col><Col>{this.state.contrato['mantenimientos']}</Col></Col>
                        <Col style={{marginBottom:"20px"}} sm={12} md={4}><Col>fechas programadas</Col><Col>{this.state.contrato['fechas programadas']}</Col></Col>
                    </Row>
                </Container>
            </Auxiliar>
        )
    }
}

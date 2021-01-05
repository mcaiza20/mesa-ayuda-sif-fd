import React, { Component } from 'react'
import { Card } from 'semantic-ui-react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Auxiliar from '../../cao/Auxiliar';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import estilos from '../../components/AccesoRestringido/AccesoRestringido.module.css'
export default class AccesoRestringido extends Component {

    
    render() {
        return (
            <Auxiliar>
                <Container >
                    <Card style={{ width: '100%', margin: '0%' }}  >
                        <Panel className={estilos.fondo}>
                            <Row className={estilos.fila}><i className="fa fa-exclamation-triangle" aria-hidden="true" style={{ fontSize: "150px", color: "yellow" }}></i></Row>
                            <Row className={estilos.fila}><h2 style={{ fontSize: "60px" }}><strong>¡Advertencia!</strong></h2></Row>
                            <Row className={estilos.fila}><p style={{ fontSize: "25px" }}>texto</p></Row>
                            <Row className={estilos.fila}><p style={{ fontSize: "25px" }}>¿Deseas volver al menú principal?</p></Row>
                            <Row className={estilos.fila}>
                                <Button className='Margen' label="Volver al menú principal" onClick={this.guardarCambios} style={{fontSize:"20px"}} />
                            </Row>
                        </Panel>
                    </Card>
                </Container>
            </Auxiliar>
        )
    }
}

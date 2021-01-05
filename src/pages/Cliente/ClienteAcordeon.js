import React, { Component } from 'react'
import './ClienteDetalle'
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';


export default class ClienteAcordeon extends Component {
    render() {
        return (
            <Accordion defaultActiveKey="0">
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">Cliente</Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            {this.props.children.cliente}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">Contactos</Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>
                        {this.props.children.contacto}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        )
    }
}

import React, { Component } from 'react'
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

export default class Acordeon extends Component {
    render() {
        return (
            <Accordion defaultActiveKey="0">
                <Card style={{overflowY: 'scroll', overflowX:'scroll'}}>
                    <Accordion.Toggle as={Card.Header} eventKey="0">Datos Generales</Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            {this.props.children.generales}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">SLA</Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>
                        {this.props.children.sla}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="2">Datos de Equipo</Accordion.Toggle>
                    <Accordion.Collapse eventKey="2">
                        <Card.Body>
                        {this.props.children.equipo}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        )
    }
}

import React, { Component } from 'react'
import Auxiliar from './../../cao/Auxiliar'
import { Row, Col, Container } from 'react-bootstrap'
import estilos from './Footer.module.css'

export default class componentName extends Component {
    render() {
        return (
            <Auxiliar>
                <footer className={estilos.footer}>
                    <p style={{ textAlign: 'center', fontSize: '15px' }}>COPYRIGHT  ©2019 POWERED BY FUTURO DIGITAL</p>
                </footer>
            </Auxiliar>
        )
    }
}

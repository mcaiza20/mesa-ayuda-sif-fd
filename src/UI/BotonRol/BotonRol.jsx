import React, { Component } from 'react'
import conf from '../../data/configuracion.json'
import aes256 from 'aes256'
import { Button } from 'primereact/button';





export default class BotonRol extends Component {

    constructor(propiedades) {
        super(propiedades);
        this.onSubmitFuncion=propiedades.funcion
        this.label=propiedades.etiqueta
        this.disabled=propiedades.habilitado
        this.state = {
            rol: null
        }

    }
    consultarRol = () => {
        let decryptedString = JSON.parse(aes256.decrypt(conf.KEYLOCALSTORAGE, localStorage.getItem(conf.USUARIOLOCAL)));
        this.setState({ rol: decryptedString.usuarioDynamoDB.rol })
    }
    componentDidMount = () => {
        this.consultarRol()
        
    }
    render() {
        return (
            this.state.rol === 'administrador' ?<Button label={this.label} onClick={this.onSubmitFuncion} disabled={this.disabled} />:null
        )
    }
}

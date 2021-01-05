import React, { Component } from 'react'
import Auxiliar from '../../cao/Auxiliar'
import TablaLocal from '../../UI/Tablas/TablaLocal/TablaLocal'
import { limpiarLocalStorage } from '../../function/LocalStorage/limpiarLocalStorage'
import Axios from 'axios'
import Spinner from '../../UI/Spinner/Spinner'
import Alerta from '../../UI/Toast/Alerta'
import Tabla from '../../UI/Tablas/Tabla/Tabla'
import conf from '../../data/configuracion.json'
import aes256 from 'aes256'

export default class PerfilCliente extends Component {
    constructor(){
        super()
        this.state = {
            loading : true,
            tabla: {
                noMostrar: ['id', 'cliente', 'clave'],
                titulos: ['nombre', 'apellido', 'correo 1', 'correo 2', 'teléfono 1', 'teléfono 2' ,'nombre usuario', 'clave', 'rol', 'estado','notificación']
            },
        }
        this.objAws = {
            "operation": "getOne",
            "tableName": "cliente",
            "payload": {"id": null}
        }
        this.url = 'https://ptcy067kz8.execute-api.us-east-1.amazonaws.com/default/crudCliente'
        this.contratos = null

    }

    async componentWillMount() {
        try{
            limpiarLocalStorage()
            let usuario = JSON.parse(aes256.decrypt(conf.KEYLOCALSTORAGE, localStorage.getItem(conf.USUARIOLOCAL)));
            //let usuario = JSON.parse(localStorage.getItem("usuario"))
            this.objAws.payload.id = usuario.usuarioDynamoDB.cliente.id
            let data = await Axios.put(this.url, this.objAws)
            localStorage.setItem('objTablaPerfil', JSON.stringify(data.data.payload[0].contacto))
            localStorage.setItem('contrato', JSON.stringify(data.data.payload[0].contrato))
            this.contratos = data.data.payload[0].contrato
            this.setState({loading:false})
        }catch(error){
            this.props.history.push("/home/menu/");
            Alerta.error("ERROR CON EL SERVIDOR")
        }
    }
    
    render() {
        return (
            <Auxiliar>
                {this.state.loading?
                    <Spinner/>:
                    <Auxiliar>
                        <Tabla opciones={{ver:'/home/perfil/contratos'}} tipo='opciones' data={this.contratos} noMostrar={['id','duración contrato','equipo']}/>
                        <TablaLocal noMostrar={this.state.tabla.noMostrar} titulos={this.state.tabla.titulos} identificador='Perfil'/>
                    </Auxiliar>
                }
            </Auxiliar>
        )
    }
}

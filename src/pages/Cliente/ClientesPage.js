import React, { Component } from 'react';
import Titulo from '../../UI/Titulo/Titulo';
import Tabla from '../../UI/Tablas/Tabla/Tabla';
import Axios from 'axios';
import Container from 'react-bootstrap/Container';
import Spinner from '../../UI/Spinner/Spinner';
import { limpiarLocalStorage } from '../../function/LocalStorage/limpiarLocalStorage';

export class ClientesPage extends Component {

    state = {
        tipo: 'opciones',
        objAws: {
            "operation": "list",
            "tableName": "cliente",
            "payload": {}
        },
        data: [],
        loading: true,
        url: 'https://ptcy067kz8.execute-api.us-east-1.amazonaws.com/default/crudCliente'
    };


    componentDidMount() {
        limpiarLocalStorage()
        // localStorage.clear()
        Axios.put(this.state.url, this.state.objAws).then(response => {
            //    console.log(response)
            let data = response.data.payload
            data.map(fila => {
                Object.keys(fila).map(encabezado => {
                    if (encabezado === 'contacto') {
                        fila[encabezado] = JSON.stringify(fila[encabezado]);
                    } else if (encabezado === 'contrato') {
                        fila[encabezado] = JSON.stringify(fila[encabezado]);
                    }
                    return encabezado
                })

                return fila
            })
            this.setState({ data: data, loading: false })
            //localStorage.setItem('objTabla', JSON.stringify(data))
        })
            .catch(err => {
                console.log("Error servidor")
            });
    }

    crearNuevo = () => {
        this.props.history.push('/home/cliente/detalle')
    }

    render() {
        return (
            <Container>
                    <Titulo texto="Cliente"></Titulo>
                    {this.state.loading?<Spinner/>:<Tabla tipo={this.state.tipo} data={this.state.data} opciones={{ ver: '/home/cliente/detalle', contrato: '/home/cliente/contratos' }} anadir={this.crearNuevo} noMostrar={['id','contacto', 'contrato','color','ciudad','país','provincia o estado',"razón social",'tipo cliente']} titulos={["ruc",'nombre',"dirección"]}></Tabla>}
                {/*<TablaLocal></TablaLocal>*/}                
            </Container>

        )
    }

}

export default ClientesPage

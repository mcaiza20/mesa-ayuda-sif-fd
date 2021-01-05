import React, { Component } from 'react'
import Titulo from '../../UI/Titulo/Titulo';
import Tabla from '../../UI/Tablas/Tabla/Tabla';
import Axios from 'axios';
import Spinner from '../../UI/Spinner/Spinner';
import Container from 'react-bootstrap/Container'

export default class Especialidad extends Component {
  state ={
    loading:true,
    objetoAWS : {
      "operation": "list",
      "tableName": "especialidad",
      "payload": {}
    },
    data:[],
    url: 'https://1ps11pdwp0.execute-api.us-east-1.amazonaws.com/default/crud'
  }

  componentDidMount() {
    
    Axios.put( this.state.url, this.state.objetoAWS)
      .then(resp => {
        let dataAWS = resp.data.payload;
        // console.log(dataAWS)
        this.setState({data:dataAWS, loading: false})
      })
      .catch(err => {
        console.log("Error servidor")
      });
  }

  crearNuevo = () => {
    let dataNew ={
      "especialidad": null,
      "descripción": null,
      "equipo/producto": null,
    }
    localStorage.setItem('seleccionado', JSON.stringify(dataNew))
    this.props.history.push('/home/especialidad/detalle')
    
  }

  render() {
    return (
      <Container>
          <Titulo texto="Especialidad"></Titulo>
          {this.state.loading ? <Spinner/> :
        <Tabla tipo='opciones' 
               data={this.state.data} 
               noMostrar={['id']}
               opciones={{ ver: '/home/especialidad/detalle' }} 
               anadir={this.crearNuevo} 
               titulos={['especialidad','descripcion','equipo/producto']}/>}
        
      </Container>
    )
  }
}

import React, { Component } from 'react'
import Titulo from '../../UI/Titulo/Titulo';
import Tabla from '../../UI/Tablas/Tabla/Tabla';
import Axios from 'axios';
import Spinner from '../../UI/Spinner/Spinner';
import Container from 'react-bootstrap/Container'
import { limpiarLocalStorage } from '../../function/LocalStorage/limpiarLocalStorage';

export default class Personal extends Component {
  state ={
    loading:true,
    objAws: {
      "operation": "list",
      "tableName": "personal",
      "payload": {}
    },
    data:[],
    tipo:'opciones',
    url:'https://o1nki9lmf9.execute-api.us-east-1.amazonaws.com/default/crudPersonal'
  }

  componentDidMount(){
    // localStorage.clear()
    limpiarLocalStorage()
    Axios.put(this.state.url,this.state.objAws).then(response=>{
      //  console.log(response)
       let data= response.data.payload
       data.map(fila=>{
           Object.keys(fila).map(encabezado=>{
               if(encabezado==='especialidad consultoria'){
                fila[encabezado]=JSON.stringify(fila[encabezado]);
               }else if(encabezado==='especialidad hardware'){
                fila[encabezado]=JSON.stringify(fila[encabezado]);
               }else if(encabezado==='especialidad software'){
                fila[encabezado]=JSON.stringify(fila[encabezado]);
               }
               return encabezado
            })
            // console.log(fila)
           return fila
       })
      //  console.log(data)
      this.setState({data: data, loading:false})
      // console.log(this.state)
       
    })
    .catch(err => {
        console.log("Error servidor")
    });
}

  crearNuevo = () => {
    let dataNew ={
      "nombre": null,
      "apellido": null,
      "ci":null,
      "correo": null,
      "teléfono": null,
      "clave": null,
      "rol": null,
      "estado": null,
      'especialidad hardware': null,
      'especialidad software': null,
      'especialidad consultoria': null,
      "título":null,
    }
    localStorage.setItem('seleccionado', JSON.stringify(dataNew))
    localStorage.setItem('accion', "nuevo")
    this.props.history.push('/home/persona/detalle')
    
  }

  render() {

    return (
      <Container>
          <Titulo texto="Personal Tecnico"></Titulo>
          {this.state.loading?<Spinner/>:<Tabla titulos={['ci','nombre','apellido','correo']} noMostrar={['teléfono','especialidad hardware','especialidad software','especialidad consultoria','clave','rol','estado','título']}
             tipo={this.state.tipo} 
             data={this.state.data}
              opciones={{ ver: '/home/persona/detalle' }} 
              anadir={this.crearNuevo} />}
      </Container>
    )
  }
}

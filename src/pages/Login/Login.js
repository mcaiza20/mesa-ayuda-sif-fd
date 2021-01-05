import React, { Component } from 'react'
import Auxiliar from '../../cao/Auxiliar';
import { Auth } from "aws-amplify";
import { Card } from 'antd';
import { Input } from 'antd';
import { Row, Col, Container } from 'react-bootstrap'
import { Button } from 'primereact/button';
import sifuturo from '../../assets/images/helpDesk.png'
import estilos from './Login.module.css'
import Alerta from '../../UI/Toast/Alerta'
import Axios from 'axios';
import { Spin } from 'antd';
import conf from '../../data/configuracion.json'
import aes256 from 'aes256'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cargando: false,
      username: "ricardo.gonzalez",
      password: "q1w2e3r4",
      'nueva clave': null,
      'validar clave': null,
      cambioClave: false,
    }
    this.urlLogin = "https://ctboyk3mz9.execute-api.us-east-1.amazonaws.com/default/login"
    this.urlActualizar = "https://fg1lsr9rug.execute-api.us-east-1.amazonaws.com/default/activarUsuarioCognito"
  }
  cambiarInputTexto = (evento) => {
    let valor = evento.target.value
    let nombre = evento.target.name
    this.setState(s => {
      s[nombre] = valor
      return s
    })
  }
  validarClave = (clave, validar) => {
    if(clave !== validar){
      throw {message:"CLAVES DIFERENTES"}
    }else if(clave === null){
      throw {message:"CLAVE VACIA"}
    }else if(clave.trim() === ""){
      throw {message:"NO SE LA CLAVE INGRESADA"}
    }else if(clave.length < 8){
      throw {message:"LA CLAVE DEBE TENER 8 CARACTERES COMO MÍNIMO"}
    }
  }

  actualizar = async event => {
    try {
      this.validarClave(this.state["nueva clave"], this.state["validar clave"])
      await Axios.put(this.urlActualizar, { usuario: { clave: this.state["nueva clave"], username: this.state.username } })
      this.setState(s => {
        s.cambioClave = false
        s['nueva clave'] = null
        s['validar clave'] = null
        return s
      })
      Alerta.success('CLAVE ACTUALIZADA')
    } catch (error) {
      Alerta.error(error.message)
    }
  }
  enviar = async event => {
    this.setState({ cargando: true})
    //event.preventDefault();
    try {
      const user = await Auth.signIn(this.state.username, this.state.password);
      if(user.challengeName === "NEW_PASSWORD_REQUIRED"){
        //console.log("cambio de clave");
        this.setState(s =>{
          s.cambioClave = true
          return s
        })
      }else if(!user.challengeName){
        //console.log("ingresar");      
      let cuenta = {}
      try{
        let idUsuario = user.attributes['custom:id']
        let rolUsuario = user.attributes['custom:rol']
        let awsUsuario = await Axios.put(this.urlLogin,{"id/ci":idUsuario, "tabla":rolUsuario})
        let usuario = awsUsuario.data.payload
        cuenta = {"usuarioAWS":user,"usuarioDynamoDB":usuario}
      }catch{
        cuenta = {"usuarioAWS":user}
      }

      let encryptedString = aes256.encrypt(conf.KEYLOCALSTORAGE, JSON.stringify(cuenta))
      localStorage.setItem(conf.USUARIOLOCAL, encryptedString)

      this.props.history.push("/home");
      }else{
        Alerta.error('USUARIO NO REGISTRADO')
      }
    } catch (error) {
      if(error.message === "User does not exist."){
        Alerta.error('USUARIO NO REGISTRADO')
      }else if(error.message ==="Incorrect username or password."){
        Alerta.error('USUARIO O CONTRASEÑA INCORRECTA')
      }else if(error.message ==="Username cannot be empty"){
        Alerta.error('USUARIO VACIO')
      }else if(error.message ==="Custom auth lambda trigger is not configured for the user pool."){
        Alerta.error('CLAVE VACIO')
      }
      console.log(error)
    }
    this.setState({ cargando: false})
  }
  controlarEnter = (e)=> {
    if (e.charCode === 13) {
      this.enviar()
    }
  }

  render() {
    return (
      <Spin spinning={this.state.cargando}>
      <Auxiliar className={estilos.login}>
        <Row style={{justifyContent:'center', margin:'0%'}}>
        <Card className={estilos.cardLogin}>
          <Row style={{padding: '8%'}}>
          <Col className={estilos.container}>
            <img src={sifuturo} alt="Sifuturo Login" style={{marginTop:'7%'}} width="220" height="220"/>
          </Col>
          {!this.state.cambioClave ? 
          <Col className={estilos.container}>
            <Row>
            <Col><h2>INGRESO</h2></Col>
          </Row>
          <br></br>
          <Container>
          <Row >
            {['username'].map(elemento => (
              <Col key={elemento} style={{textAlign:'left'}}>
                <span >Usuario</span>
                <Input
                  value={this.state[elemento]}
                  required={true}
                  name={elemento}
                  onChange={e => this.cambiarInputTexto(e)}
                  onKeyPress={this.controlarEnter}
                  placeholder={elemento.charAt(0).toUpperCase() + elemento.slice(1)} 
                  className={estilos.inputLogin}/>
              </Col>
            ))}
            </Row>
            <Row>
            {['password'].map(elemento => (
              <Col key={elemento}  style={{marginTop:'30px', textAlign:'left'}}>
                <span>Contraseña</span>
                <Input.Password
                  value={this.state[elemento]}
                  required={true}
                  name={elemento}
                  onChange={e => this.cambiarInputTexto(e)}
                  onKeyPress={this.controlarEnter}
                  placeholder={elemento.charAt(0).toUpperCase() + elemento.slice(1)} 
                  />
              </Col>
            ))}
          </Row>
          </Container>
          <Row><Col style={{ textAlign: "center", marginTop:'40px' }}><Button label="INGRESAR" onClick={this.enviar}  style={{width:'90%'}}/></Col></Row>
          </Col> : 
          <Col className={estilos.container}>
          <Row>
          <Col><h2>CAMBIO DE CLAVE</h2></Col>
        </Row>
        <br></br>
        <Container>
        <Row >
          {['nueva clave'].map(elemento => (
            <Col key={elemento} style={{textAlign:'left'}}>
              <span >Nueva Clave</span>
              <Input.Password
                value={this.state[elemento]}
                required={true}
                name={elemento}
                onChange={e => this.cambiarInputTexto(e)}
                placeholder={elemento.charAt(0).toUpperCase() + elemento.slice(1)} 
                className={estilos.inputLogin}/>
            </Col>
          ))}
          </Row>
          <Row>
          {['validar clave'].map(elemento => (
            <Col key={elemento}  style={{marginTop:'30px', textAlign:'left'}}>
              <span>Validar clave</span>
              <Input.Password
                value={this.state[elemento]}
                required={true}
                name={elemento}
                onChange={e => this.cambiarInputTexto(e)}
                placeholder={elemento.charAt(0).toUpperCase() + elemento.slice(1)} 
                className={estilos.inputLogin}/>
            </Col>
          ))}
        </Row>
        </Container>
        <Row><Col style={{ textAlign: "center", marginTop:'40px' }}><Button label="ACTUALIZAR" onClick={this.actualizar} style={{width:'90%'}}/></Col></Row>
        </Col>}
          </Row>
        </Card>
        </Row>
        <p style={{textAlign:'center', fontSize:'15px'}}>COPYRIGHT  ©2019 POWERED BY FUTURO DIGITAL</p>
      </Auxiliar>
      </Spin>
    )
  }
}

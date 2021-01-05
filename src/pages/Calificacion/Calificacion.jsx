import React, { Component } from 'react'
import Auxiliar from '../../cao/Auxiliar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { Button } from 'primereact/button';
import { Input } from 'antd';
import { Spin } from 'antd';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Box from '@material-ui/core/Box';
import { Card } from 'antd';
import estilos from './Calificacion.module.css'
import Axios from 'axios';
import Spinner from '../../UI/Spinner/Spinner';
import Alerta from '../../UI/Toast/Alerta';

export default class Calificacion extends Component {
  
    state = { loading: false,
              cargando : true,
              starValue:0, 
              dataTicket:null};

    componentWillMount(){
      let url = window.location.href
      let token = url.substr( url.indexOf('ey'), url.length)
      let objAWS = {"tipo":"validar", "encoded_token": token}


      Axios.put(' https://xzr6nobwte.execute-api.us-east-1.amazonaws.com/default/generarTokenCalificacion', objAWS).then(r=>{
           if (r.data.mensaje !== 'Token expirado' && r.data.mensaje !=='La calificación ya se ha realizado'){
             this.setState({cargando:false, dataTicket: r.data})
           }else{
             this.props.history.push('/login')
             Alerta.info(r.data.mensaje)
           }
      }).catch(error=>{
        console.log(error)
      })
      console.log(token)
    }          

    guardarCalificacion=()=>{

      this.setState({loading: true})
      

      let objeto = {'id':this.state.dataTicket.data['Número Ticket'], 'calificación': this.state.starValue, 'descripción': this.state.descripcion}

      Axios.put('https://4w1exnht0k.execute-api.us-east-1.amazonaws.com/default/guardarCalificacion', objeto).then(r=>{
        if(r.data.mensaje==='Su calificación fue guardada') {
            Alerta.info(r.data.mensaje)
            this.props.history.push('/login')
        }else{
          Alerta.info(r.data.mensaje)
          this.setState({loading: false})
        }
          
      }).catch(error=>{
        Alerta.error(error)
      })

    }

    
    render() {
        const { TextArea } = Input;
        // const labels = {
        //   0.5: 'Useless',
        //   1: 'Useless+',
        //   1.5: 'Useless+',
        //   2: 'Poor',
        //   2.5: 'Poor',
        //   3: 'Poor+',
        //   3.5: 'Poor+',
        //   4: 'Ok',
        //   4.5: 'Ok',
        //   5: 'Ok+',
        //   5.5: 'Ok+',
        //   6: 'Good',
        //   6.5: 'Good',
        //   7: 'Good+',
        //   7.5: 'Good+',
        //   8: 'Excellent',
        //   8.5: 'Excellent',
        //   9: 'Excellent+',
        //   9.5: 'Excellent+',
        //   10: 'Perfect',
        // };
        return (


          <Auxiliar>{

            this.state.cargando ? <Spinner></Spinner> :
              <Spin spinning={this.state.loading}>
                <Container>
                  <Row className={estilos.rowCalificacion}><Col><h2>Calificar Servicio</h2></Col></Row>
                  <Row className={estilos.rowCalificacion}>

                    <Card style={{background:'lightgrey', borderRadius:'30px', padding:'2%'}} >
                      <Row><b>Ticket ID:  </b><p>{this.state.dataTicket.data['Número Ticket']}</p></Row>
                      <Row><b>Diagnóstico:  </b><p>{this.state.dataTicket.data['Diagnóstico']}</p></Row>
                      <Row><b>Problema Reportado:  </b><p>{this.state.dataTicket.data['Problema Reportado']}</p></Row>

                      <Row className={estilos.rowCalificacion}>
                        <Col>
                          <Box component="fieldset" mb={3} borderColor="transparent">
                            <Rating
                              name="customized-empty"
                              value={this.state.starValue}
                              max={5}
                              precision={1}
                              emptyIcon={<StarBorderIcon fontSize="inherit" style={{ display: 'inline' }} />}
                              onChange={(event, newValue) => {
                                this.setState({ starValue: newValue });
                              }}
                            />
                          </Box>
                        </Col>
                        {/* <Col><Box ml={2}>{labels[this.state.starValue]}</Box></Col> */}
                      </Row>
                      <Row className={estilos.rowCalificacion}><Col><TextArea rows={4}  onChange={(event) => {
                                this.setState({ descripcion : event.target.value });
                              }} /></Col></Row>
                      <Row className={estilos.rowCalificacion}><Col><Button onClick={this.guardarCalificacion} label="Calificar" /></Col></Row>


                    </Card>
                  </Row>
                </Container>
              </Spin>
          }
          </Auxiliar>
        )
    }
}

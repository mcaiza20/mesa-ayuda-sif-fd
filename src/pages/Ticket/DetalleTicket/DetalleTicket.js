import React from 'react';
import { Steps, Radio, Button, Select, Popconfirm, Modal, Input, Spin, InputNumber} from 'antd';
import Component from "@reactions/component";
import estilo from './DetalleTicket.module.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import FormValidator from '../../../function/Validador/FormValidator'
import { TextInputField, Textarea } from 'evergreen-ui'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Axios from 'axios';
import Alerta from '../../../UI/Toast/Alerta';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Spinner from '../../../UI/Spinner/Spinner';

import { Dropdown } from 'semantic-ui-react'

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

class DetalleTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listaRepuestosBD:[],
      nuevasAcciones: [],
      nuevosRepuestos: [],
      repuestosQuitados: [],
      visible: false,
      mensaje: null,
      correoEnviado: false,
      loading: false
    };
    this.tipoServicio = ['01-MANT. PREVENTIVO', '02-MANT. CORRECTIVO', '03-MANT. CONCURR', '04-CAMB. PARTES', '05-INST./UPGRADE', '06-OTROS']
    this.optionsTecnico = []
  }

  componentWillMount() {
    let ticketSeleccionado = JSON.parse(localStorage.getItem('seleccionado'))
    let validaciones = []

    if (ticketSeleccionado) {
      Axios.put('https://o1nki9lmf9.execute-api.us-east-1.amazonaws.com/default/crudPersonal', { "operation": "list", "tableName": "personal", "payload": {} })
        .then(personal => {
          personal.data.payload.map(empleado => {
            if (empleado.rol === 'técnico' && empleado.estado === 'activo') {
              this.optionsTecnico.push(empleado)
            }
            return empleado
          })
        })
        .then(() => {
          ticketSeleccionado.cliente = ticketSeleccionado.cliente2
          delete ticketSeleccionado['cliente2']
          ticketSeleccionado.equipo = ticketSeleccionado.equipo2
          delete ticketSeleccionado['equipo2']
          ticketSeleccionado['técnico asignado'] = ticketSeleccionado['técnico asignado 2']
          delete ticketSeleccionado['técnico asignado 2']
          Object.keys(ticketSeleccionado).map(r => {
            let validacion = {
              field: r,
              method: 'isEmpty',
              validWhen: false,
              message: r + ' es requerida.'
            }
            validaciones.push(validacion)
            return validacion
          })
          this.validator = new FormValidator(validaciones)
          ticketSeleccionado.validation = this.validator.valid()
          this.setState({ ticketSeleccionado })
        })
        .then(() => {
          Axios.put('https://1ps11pdwp0.execute-api.us-east-1.amazonaws.com/default/crud', { "operation": "list", "tableName": "repuesto", "payload": {} })
            .then(r => {
              let data = r.data.payload.map(r => {
                if (r['cantidad real'] !== 0)
                  r['descripción repuesto'] = r['descripción repuesto'] + '/' + r.modelo + '/' + r['part/number o Feature']
                return { key: r['descripción repuesto'], value: r, text: r['descripción repuesto'] }
              })
              data.push( { key: 'Solicitar Respuesto', value: 'Solicitar Respuesto', text: 'Solicitar Respuesto' })
              this.setState({ listaRepuestosBD: data })
            })
        })
        .catch(err => console.log(err))
    } else {
      this.props.history.push('/home/ticket/')
    }
  }

  componentWillUnmount() {
    try {
      localStorage.removeItem('seleccionado')
    }
    catch (error) {
      this.props.history.push('/home/ticket')
    }
  }

  next() {
    const current = this.state.ticketSeleccionado.current + 1;
    this.setState(ob => ob.ticketSeleccionado.current = current)
  }

  prev() {
    const current = this.state.ticketSeleccionado.current - 1;
    this.setState(ob => ob.ticketSeleccionado.current = current)
  }

  handleInputChange = event => {
    event.preventDefault();
    let newState = Object.assign({}, this.state);
    newState.ticketSeleccionado[event.target.name] = event.target.value
    this.setState(newState);
  }

  terminar = event => {
    event.preventDefault();
    delete this.state.ticketSeleccionado.validation
    delete this.state.ticketSeleccionado['ignore_whitespace']
    this.setState(ob => ob.ticketSeleccionado.estado = 'solucionado')
    //console.log(event)

    Axios.put('https://5yvv6384uj.execute-api.us-east-1.amazonaws.com/default/actualizarTicket', this.state.ticketSeleccionado).then(r => {
      this.setState({ ticketSeleccionado: r.data.payload })
      Alerta.success(r.data.mensaje)
      if (r.data.payload['fecha fin'] !== "") {
        this.props.history.goBack();
      } else {
        Alerta.error('No se ha podido crear su ticket')
      }
    }).catch(error => Alerta.success(error))
  }

  enEspera = event => {
    event.preventDefault();
    delete this.state.ticketSeleccionado.validation
    delete this.state.ticketSeleccionado['ignore_whitespace']
    this.setState(ob => ob.ticketSeleccionado.estado = 'en espera')

    Axios.put('https://5yvv6384uj.execute-api.us-east-1.amazonaws.com/default/actualizarTicket', this.state.ticketSeleccionado).then(r => {
      this.setState({ ticketSeleccionado: r.data.payload })
      //console.log(r)
      Alerta.success(r.data.mensaje)
      if (r.data.HTTPStatusCode === 200) {
        this.props.history.goBack();
      } else {
        Alerta.error('No se ha podido guardar su ticket')
      }
    }).catch(error => Alerta.success(error))
  }

  validationSection = event => {
    event.preventDefault();
    const validation = this.validator.validate(this.state.ticketSeleccionado);
    //console.log(validation)
    switch (this.state.ticketSeleccionado.current) {
      case 0:
        if (validation.provincia.isInvalid === false && validation['fecha inicio'].isInvalid === false && validation.cliente.isInvalid === false && validation.contacto.isInvalid === false)
          this.next();
        else
          Alerta.error('Debe llenar campos obligatorios')
        break
      case 1:
        if (validation['técnico asignado'].isInvalid === false) {
          if (validation['sla al cliente'].isInvalid === false) {
            if (validation['tipo servicio'].isInvalid === false) {
              this.next();
            } else
              Alerta.error('Debe escoger un tipo de servicio')
          } else
            Alerta.error('Debe seleccionar el SLA del equipo')
        } else
          Alerta.error('Debe Asignar un técnico')
        break;
      case 2:
        if (validation['diagnóstico'].isInvalid === false) {
          if (validation.acciones.isInvalid === false)
            this.next();
          else
            Alerta.error('Debe ingresar al menos una acción realizada')
        } else
          Alerta.error('Debe ingresar un diágnostico')
        break;
      default:
        break;
    }
  }

  guardarAccion() {
    let options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    let acciones = this.state.ticketSeleccionado.acciones;
    let nuevasAcciones = [...this.state.nuevasAcciones]
    let fecha = new Date();
    if (this.state.accion) {
      acciones.push({ Fecha: fecha.toLocaleDateString("es-EC", options), Descripción: this.state.accion })
      nuevasAcciones.push({ Fecha: fecha.toLocaleDateString("es-EC", options), Descripción: this.state.accion })
      this.setState({ accion: '', nuevasAcciones })
    }
    else {
      Alerta.error('Debe ingresar una acción')
    }

  }

  guardarRepuestos() {

    if (this.state.repuesto) {
      if (this.state.contador > 0) {
        if (this.state.contador <= this.state.repuesto['cantidad real']) {
          if (this.state.parteAfectada) {
            let repuestos = this.state.ticketSeleccionado.repuestos;
            let nuevosRepuestos = [...this.state.nuevosRepuestos]
            let objetoRepuesto = {
              id: null,
              descripción: this.state.repuesto['descripción repuesto'],
              cantidad: this.state.contador,
              repuesto: this.state.repuesto.id,
              'parte afectada': this.state.parteAfectada
            }
            let filtro = this.state.listaRepuestosBD.map(r=> r.value)

            let repuestoUtilizado = filtro.filter((val, i) => i === filtro.indexOf(this.state.repuesto))

            repuestoUtilizado[0]['cantidad real'] = Number(repuestoUtilizado[0]['cantidad real']) - this.state.contador
            repuestos.push(objetoRepuesto)
            nuevosRepuestos.push(objetoRepuesto)
            this.setState(ob => {
                        ob.ticketSeleccionado.repuestos = repuestos
                        ob.repuesto = ""
                        return ob
                      })
            this.setState({
              parteAfectada: '', contador: 0, repuesto: "", nuevosRepuestos: nuevosRepuestos,
              listaRepuestosBD: this.state.listaRepuestosBD.filter(repuesto => repuesto['cantidad real'] !== 0),
              repuestosQuitados: this.state.listaRepuestosBD.filter(repuesto => repuesto['cantidad real'] === 0)
            })
          } else {
            Alerta.info('Debe ingresar un descripción de la parte afectada')
          }
        } else {
          Alerta.info('No se dispone la cantidad solicitada')
        }
      } else {
        Alerta.info('Debe ingresar una cantidad')
      }
    } else {
      Alerta.info('Se debe seleccionar un producto')
    }
  }

  guardarCambios(e) {
    e.preventDefault();
    let detalleTicket = this.state.ticketSeleccionado
    detalleTicket.acciones.map(r => {
      if (r.Eliminar) delete r.Eliminar
      return r
    })
    delete detalleTicket.validation
    delete detalleTicket['ignore_whitespace']

    Axios.put('https://5yvv6384uj.execute-api.us-east-1.amazonaws.com/default/actualizarTicket', detalleTicket).then(r => {

      if (r.data.mensaje === 'SUS CAMBIOS HAN SIDO GUARDADOS') {
        Alerta.success(r.data.mensaje)
        this.setState({ ticketSeleccionado: r.data.payload, nuevasAcciones: [] })
      } else {
        Alerta.error(r.data.mensaje)
      }
    }).catch(error => Alerta.error(e))
  }
  quitarAccion() {
    let accion = this.state.ticketSeleccionado.acciones.indexOf(this.state.registroSeleccionado);
    let encontrado = this.state.nuevasAcciones.find(r => JSON.stringify(r) === JSON.stringify(this.state.registroSeleccionado))

    if (encontrado !== undefined) {
      this.setState(ob => ob.ticketSeleccionado.acciones = this.state.ticketSeleccionado.acciones.filter((val, i) => i !== accion))
      this.setState({ accion: null, registroSeleccionado: null })
    } else {
      Alerta.error('No se puede borrar estas acciones')
    }
  }

  quitarRepuesto() {
    let repuesto = this.state.ticketSeleccionado.repuestos.indexOf(this.state.registroSeleccionado);
    let encontrado = this.state.nuevosRepuestos.find(r => JSON.stringify(r) === JSON.stringify(this.state.registroSeleccionado))
    let listaRepBD = [...this.state.listaRepuestosBD.map(r=> r.value), ...this.state.repuestosQuitados.map(r=> r.value)]

    if (encontrado !== undefined) {
      let repuestoUtilizado = listaRepBD.filter(val => val.id === encontrado.repuesto)
      repuestoUtilizado[0]['cantidad real'] = Number(repuestoUtilizado[0]['cantidad real']) + encontrado.cantidad
      this.setState(ob => ob.ticketSeleccionado.repuestos = this.state.ticketSeleccionado.repuestos.filter((val, i) => i !== repuesto))
      listaRepBD = listaRepBD.filter(repuesto => repuesto['cantidad real'] !== 0) 
      this.setState({ registroSeleccionado: null, listaRepuestosBD: listaRepBD.map(r=>({ key: r['descripción repuesto'], value: r, text: r['descripción repuesto']}))})
    } else {
      Alerta.error('No se puede borrar repuesto')
    }
  }

  selectChange = (valor, nombre) => {
    let newState = Object.assign({}, this.state);
    if (nombre === 'técnico asignado')
      newState.ticketSeleccionado[nombre] = JSON.parse(valor)
    else
      newState.ticketSeleccionado[nombre] = valor
    // console.log(newState.ticketSeleccionado)
    this.setState(newState)
  }

  handleOk = () => {

    if(!this.state.correoEnviado){
      let usuario = JSON.parse(localStorage.getItem('usuario'))
    let objeto = { correo: usuario.usuarioDynamoDB.correo, mensaje: this.state.mensaje }
    this.setState({loading: true})

    Axios.put('https://0gr2og5s28.execute-api.us-east-1.amazonaws.com/default/solicitarRepuesto', objeto).then(response => {

      if (response.data === "Correo enviado") {
        this.setState({ visible: false, correoEnviado: true });
        Alerta.success(response.data)
      } else {
        Alerta.success(response.data)
      }
      this.setState({loading: false})
    }).catch(error =>
      Alerta.error(error))
    }else{
      this.setState({ visible: false})
      Alerta.info("Ya se ha enviado un correo")
    }
    
  };

  handleCancel = e => {
    this.setState({ visible: false });
  };
  handleOnChange = (e, data) => {
    if(data.value === 'Solicitar Respuesto'){
      this.setState({visible: true})
    }else{
      this.setState({repuesto: data.value})
    }
 }

  render() {
    // let validation = this.submitted ? this.validator.validate(this.state.ticketSeleccionado) : this.state.ticketSeleccionado.validation
    let retorno = <Spinner></Spinner>
    let modal = 
    <Spin spinning={this.state.loading}>
    <Modal title="Enviar Correo Solicitando Repuesto" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
      {this.state.correoEnviado ? <p>Correo enviado</p> :
        <div>
          <label>Ingresar las caracteristicas del repuesto solicitado</label>
          <TextArea value={this.state.mensaje} onChange={(e) => { this.setState({ mensaje: e.target.value }); }} />
        </div>}
    </Modal>
    </Spin>

    if (this.state.ticketSeleccionado) {
      let headerAcciones = <IconButton onClick={(e) => this.quitarAccion(e)}><DeleteIcon className={estilo.borrar} /></IconButton>;
      let headerRepuestos = <IconButton onClick={(e) => this.quitarRepuesto(e)}><DeleteIcon className={estilo.borrar} /></IconButton>;
      let tecnicoPredeterminado = Object.keys(this.state.ticketSeleccionado['técnico asignado']).length === 0 ? '' : this.state.ticketSeleccionado['técnico asignado'].nombre +" " +this.state.ticketSeleccionado['técnico asignado'].apellido
      const { current } = this.state.ticketSeleccionado;
      let steps = []
      let prioridad = undefined
      let cabecera =
        <div className={estilo['steps-action']}>
          <Button.Group size='small'>
            {current > 0 && (<Button type="primary" className={estilo["btn-responsive"]} ghost onClick={() => this.prev()}>Anterior</Button>)}
            {current > 0 && this.state.ticketSeleccionado.estado !== 'solucionado' && (<Button type="primary" className={estilo["btn-responsive"]} ghost onClick={(e) => this.guardarCambios(e)} >Guardar Cambios</Button>)}
            {current <= 2 && (<Button type="primary" className={estilo["btn-responsive"]} ghost onClick={(e) => this.validationSection(e)}>Siguiente</Button>)}
            {current === 3 && this.state.ticketSeleccionado.estado !== 'solucionado' && (
              <Popconfirm
                placement="bottomRight"
                title={'¿Está seguro de Terminar este ticket?'}
                onConfirm={this.terminar}
                okText="Aceptar"
                cancelText="Cancelar">
                <Button type="primary" className={estilo["btn-responsive"]} ghost>Terminar</Button>
              </Popconfirm>
            )}
            {current <= 3 && this.state.ticketSeleccionado.estado !== 'solucionado' && (<Button type="primary" className={estilo["btn-responsive"]} ghost onClick={(e) => this.enEspera(e)}>En espera</Button>)}
          </Button.Group>
        </div>




      let detalleTicket =
        <form>
          <Row style={{ justifyContent: 'flex-end' }}>
            <h4 style={{ marginRight: '2%' }}>{this.state.ticketSeleccionado.id}</h4>
          </Row>
          <br></br>
          <Row>
            <Col sm={3} xs={12}>
              <label><b>Ruc <label className={estilo.requerido}>*</label></b></label>
              <TextInputField
                placeholder="ruc"
                name="ruc"
                label=""
                value={this.state.ticketSeleccionado.cliente.ruc}
                disabled />
            </Col>
            <Col sm={3} xs={12}>
              <label><b>Fecha Inicio <label className={estilo.requerido}>*</label></b></label>
              <TextInputField
                placeholder="Fecha Inicio"
                name="fecha inicio"
                label=""
                value={this.state.ticketSeleccionado['fecha inicio']}
                disabled
              />
            </Col>
            <Col sm={3} xs={12}>
              <label><b>Cliente <label className={estilo.requerido}>*</label></b></label>
              <TextInputField
                placeholder="Cliente"
                name="cliente"
                label=""
                value={this.state.ticketSeleccionado.cliente.nombre}
                disabled
              />
            </Col>
            <Col sm={3} xs={12}>
              <label><b>Contacto <label className={estilo.requerido}>*</label></b></label>
              <TextInputField
                placeholder="Contacto"
                name="contacto"
                label=""
                value={this.state.ticketSeleccionado.contacto.nombre + ' ' + this.state.ticketSeleccionado.contacto.apellido}
                disabled
              />
              {/* <span className="help-block">{validation.contacto.message}</span> */}
            </Col>
          </Row>
          <Row>
            <Col sm={6} xs={12}>
              <label><b>Dirección <label className={estilo.requerido}>*</label></b></label>
              <TextInputField
                placeholder="Dirección"
                name="direccion"
                label=""
                value={this.state.ticketSeleccionado.cliente['dirección']}
                disabled />
            </Col>
            <Col sm={6} xs={12}>
              <label><b>Teléfono <label className={estilo.requerido}>*</label></b></label>
              <TextInputField
                placeholder="Teléfono"
                name="teléfono"
                label=""
                value={this.state.ticketSeleccionado.contacto['teléfono 1']}
                disabled />
            </Col>
          </Row>

          <Row>
            <Col sm={6} xs={12}>
              <label><b>Ticket Relacionado</b></label>
              <TextInputField
                placeholder="Ticket relacionado"
                name="ticketRelacionado"
                label=""
                value={this.state.ticketSeleccionado['ticket relacionado']}
                disabled />
            </Col>
            <Col sm={6} xs={12}>
              <label><b>Fecha Fin</b></label>
              <TextInputField
                placeholder="Fecha Fin"
                name="fechaFin"
                label=""
                value={this.state.ticketSeleccionado['fecha fin']}
                disabled />
            </Col>
          </Row>
        </form>

      let descripcionProblema =
        <form>
          <Row>
            <Col sm={6} xs={12}>
              <label><b>Equipo <label className={estilo.requerido}>*</label></b></label>
              <TextInputField
                placeholder="Equipo"
                name="equipo"
                label=""
                value={this.state.ticketSeleccionado.equipo.MARCA + ' - ' + this.state.ticketSeleccionado.equipo.MODELO + ' - ' + this.state.ticketSeleccionado.equipo['DESCRIPCIÓN']}
                disabled
              />
            </Col>
            <Col sm={6} xs={12}>
              <label><b>Técnico asignado <label className={estilo.requerido}>*</label></b></label>
              <Select style={{ marginTop: '0.6%' }} name="técnico asignado" value={tecnicoPredeterminado}
                onChange={e => this.selectChange(e, 'técnico asignado')}>
                {this.optionsTecnico.map(r => {
                  let tecnico = JSON.stringify(r)
                  return <Option key={r.ci} value={tecnico}>{r.nombre + ' ' + r.apellido}</Option>
                })}
              </Select>
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col sm={6} xs={12}>
              <label><b>Descripción SLA <label className={estilo.requerido}>*</label></b></label>
              <TextInputField
                placeholder="Descripción SLA"
                name="sla"
                label=""
                value={this.state.ticketSeleccionado.sla}
                disabled />
            </Col>
            <Col sm={6} xs={12}>
              <label><b>SLA disponible <label className={estilo.requerido}>*</label></b></label>
              <Select style={{ marginTop: '0.6%' }} name="sla" value={this.state.ticketSeleccionado['sla al cliente']}
                onChange={e => this.selectChange(e, 'sla al cliente')}>
                {
                  typeof this.state.ticketSeleccionado.equipo['SLA AL CLIENTE'] === 'object' ?
                    Object.keys(this.state.ticketSeleccionado.equipo['SLA AL CLIENTE']).map(r => {
                      if (r === '0') { prioridad = 'alta' }
                      else if (r === '1') { prioridad = 'media' }
                      else if (r === '2') { prioridad = 'baja' }
                      let sla = prioridad + ' /' + this.state.ticketSeleccionado.equipo['SLA AL CLIENTE'][r]
                      return <Option key={r} value={this.state.ticketSeleccionado.equipo['SLA AL CLIENTE'][r]}>{sla}</Option>
                    }) : <Option key={0} value={this.state.ticketSeleccionado.equipo['SLA AL CLIENTE']}>{this.state.ticketSeleccionado.equipo['SLA AL CLIENTE']}</Option>
                }
              </Select>
            </Col>
          </Row>
          <br />
          <Row>
            <Col sm={12} xs={12}>
              <Radio.Group className={estilo.grupoRadio} name='tipo servicio' onChange={this.handleInputChange} value={this.state.ticketSeleccionado['tipo servicio']}>
                <label><b>Tipo de servicio <label className={estilo.requerido}>*</label></b></label>
                <Row className={estilo.rowService}>
                  {this.tipoServicio.map(r => {
                    return <Col key={r} sm={4} xs={12} lg={2}><Radio value={r}>{r}</Radio></Col>
                  })}
                </Row>
              </Radio.Group>
            </Col>
          </Row>
          <br />
          <Row className={estilo.textArea}>
            <label><b>Descripción <label className={estilo.requerido}>*</label></b></label>
            <Textarea
              className={estilo.area}
              name='descripción'
              disabled
              value={this.state.ticketSeleccionado['descripción']}
              onChange={this.handleInputChange}></Textarea>
          </Row>

        </form>

      let accionesRealizadas =
        <form>
          <Row className={estilo.textArea}>
            <Col sm={12} xs={12}>
              <label><b>Diagnóstico <label className={estilo.requerido}>*</label></b></label><br></br>
              <label style={{ fontSize: '10px' }}>Una vez ingresado su diagnóstico no se podrá realizar cambios</label>
              <Textarea
                className={estilo.area}
                name='diagnóstico'
                value={this.state.ticketSeleccionado['diagnóstico']}
                onChange={this.handleInputChange}></Textarea>
            </Col>
          </Row>
          <Row className={estilo.textArea}>
            <Col sm={7} xs={10}>
              <label><b>Acción realizada <label className={estilo.requerido}>*</label></b></label>
              <Textarea
                className={estilo.area}
                name='accion'
                value={this.state.accion}
                onChange={(e) => { this.setState({ accion: e.target.value }) }} ></Textarea>
            </Col>
            <Col className={estilo.margenBtn} sm={5} xs={2}>
              <Fab size="small" className={estilo.botonRedondo} onClick={() => this.guardarAccion()}><AddIcon /></Fab>
            </Col>
          </Row>
          <br></br>
          <Row >
            <Col className={estilo.tabla} sm={12} xs={12}>
              <DataTable value={this.state.ticketSeleccionado.acciones} paginator={true} rows={7} responsive={true} selectionMode='single' header={headerAcciones}
                selection={this.state.registroSeleccionado} onSelectionChange={e => { this.setState({ registroSeleccionado: e.value }) }}>
                <Column selectionMode="multiple" style={{ width: '3em' }} />
                <Column style={{ width: '30%' }} field="Fecha" header="Fecha" sortable={true} />
                <Column style={{ width: '60%' }} field="Descripción" header="Descripción" sortable={true} />
              </DataTable>
            </Col>
          </Row>
        </form>

      let repuestosUtilizados =
        <form>
          <Row className={estilo.textArea}>
            <Col lg={5} sm={12} xs={12} style={{ height: '80%' }} >
              <label><b>Serie Equipo / Parte afectada <label className={estilo.requerido}>*</label></b></label>
              <textarea
                className={estilo.areaParteAfectada}
                name='parteAfectada'
                value={this.state.parteAfectada}
                onChange={(e) => { this.setState({ parteAfectada: e.target.value }) }}></textarea>
            </Col>
            <Col lg={3} sm={12} xs={12}>
              <label><b>Serie Equipo / Parte Instalada <label className={estilo.requerido}>*</label></b></label>
              <Dropdown
                value={this.state.repuesto}
                name="repuesto"
                clearable
                placeholder='Seleccionar Repuesto'
                options={this.state.listaRepuestosBD}
                fluid
                search
                selection
                onChange={this.handleOnChange}
              />
            </Col>
            <Col lg={2} sm={12} xs={12}>
              <label><b>Cantidad <label className={estilo.requerido}>*</label></b></label>
              <br></br>
              <InputNumber min={0} max={10} value={this.state.contador} onChange={(e)=> this.setState({ contador : e })} />
              {/* <div>
                <Button className={estilo.botonMenos} onClick={() => {
                  if (count > 0) {
                    count--
                    this.setState({ contador: count })
                  }
                }}>-</Button>
                <label className={estilo.inputCantidad}>{this.state.contador}</label>
                <Button className={estilo.botonMas} onClick={() => {
                  if (count >= 0) {
                    count++
                    this.setState({ contador: count, deshabilitar: false })
                  }
                }}>+</Button>
              </div> */}
            </Col>
            <Col className={estilo.margenBtn} lg={1} sm={12} xs={12}>
              <Fab size="small" className={estilo.botonRedondo} onClick={() => this.guardarRepuestos()}><AddIcon /></Fab>
            </Col>
          </Row>
          <br></br>
          <Col>
            <DataTable value={this.state.ticketSeleccionado.repuestos} paginator={true} rows={7} responsive={true} selectionMode='single' header={headerRepuestos}
              selection={this.state.registroSeleccionado} onSelectionChange={e => { this.setState({ registroSeleccionado: e.value }) }}>
              <Column selectionMode="multiple" style={{ width: '3em' }} />
              <Column style={{ width: '15%' }} field="id" header="Transacción" sortable={true}></Column>
              <Column style={{ width: '10%' }} field="repuesto" header="Repuesto" sortable={true}></Column>
              <Column style={{ width: '10%', margin: 'auto', textAlign: 'center' }} field="cantidad" header="Cantidad" sortable={true}></Column>
              <Column style={{ width: '25%' }} field="descripción" header="Descripción" sortable={true} />
              <Column style={{ width: '30%' }} field="parte afectada" header="Parte afectada" sortable={true}></Column>
            </DataTable>
          </Col>
        </form>

      steps = [
        {
          title: 'Detalle Ticket',
          content:
            <Card>
              <Card.Header >
                <Row>
                  <Col md={10} className={estilo.titulos}>DETALLES TICKET</Col>
                  <Col md={2} className={estilo.alineacionBotones}>{cabecera}</Col>
                </Row>
              </Card.Header>
              <Card.Body>
                {detalleTicket}
              </Card.Body>
            </Card>
        },
        {
          title: 'Descripión Problema',
          content:
            <Card>
              <Card.Header>
                <Row>
                  <Col md={8} className={estilo.titulos}>DESCRIPCIÓN PROBLEMA</Col>
                  <Col md={4} className={estilo.alineacionBotones}>{cabecera}</Col>
                </Row>
              </Card.Header>
              <Card.Body>
                {descripcionProblema}
              </Card.Body>
            </Card>
        },
        {
          title: 'Acciones Realizadas',
          content:
            <Card>
              <Card.Header>
                <Row>
                  <Col md={8} className={estilo.titulos}>ACCIONES REALIZADAS</Col>
                  <Col md={4} className={estilo.alineacionBotones}>{cabecera}</Col>
                </Row>
              </Card.Header>
              <Card.Body>
                {accionesRealizadas}
              </Card.Body>
            </Card>
        },
        {
          title: 'Repuestos Utilizados',
          content:
            <Card>
              <Card.Header>
                <Row>
                  <Col md={8} className={estilo.titulos}>REPUESTOS UTILIZADOS</Col>
                  <Col md={4} className={estilo.alineacionBotones}>{cabecera}</Col>
                </Row>
              </Card.Header>
              <Card.Body>
                {repuestosUtilizados}
              </Card.Body>
            </Card>
        }
      ]

      retorno =
        <div>
          <Steps current={current}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <br></br>
          <Row>
            <Col sm={3} xs={6}>
              <h3 className={estilo.tituloMayorista}>Garantia con:</h3>
              <p className={estilo.tituloContenido}>{this.state.ticketSeleccionado.equipo['MAYORISTA'][0].nombre}</p>
            </Col>
            <Col sm={3} xs={6}>
              <h3 className={estilo.tituloMayorista}>Página Web: </h3>
              <p className={estilo.tituloContenido}>{this.state.ticketSeleccionado.equipo['MAYORISTA'][0]['página web']}</p>
            </Col>
            <Col sm={3} xs={6}>
              <h3 className={estilo.tituloMayorista}>Teléfono:</h3>
              <p className={estilo.tituloContenido}> {this.state.ticketSeleccionado.equipo['MAYORISTA'][0]['teléfono']}</p>
            </Col>
            <Col sm={3} xs={6}>
              <h3 className={estilo.tituloMayorista}>SLA mayorista:</h3>
              <p className={estilo.tituloContenido}>{this.state.ticketSeleccionado.equipo['SLA MAYORISTA'] !== null ? this.state.ticketSeleccionado.equipo['SLA MAYORISTA'].map(r => r + ' / ') : null}</p>
            </Col>
          </Row>

          <div className={estilo['steps-content']}>{steps[current].content}</div>
        </div>
    } else {
      console.log('Aun no hay ticketSeleccionado')
    }

    return (
      <Container className={estilo.contenedor}>
        {modal}
        {retorno}
      </Container>
    );
  }
}

export default DetalleTicket;
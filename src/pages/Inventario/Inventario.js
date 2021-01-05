import React, { Component } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Axios from 'axios';
import Tabla from '../../UI/Tablas/Tabla/Tabla'
import './Inventario.css'
import Spinner from '../../UI/Spinner/Spinner';
import Titulo from '../../UI/Titulo/Titulo';
import Auxiliar from '../../cao/Auxiliar';
import FormValidator from '../../function/Validador/FormValidator'
import { TextInputField} from 'evergreen-ui'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { InputNumber, Spin, Drawer} from 'antd';
import Alerta from '../../UI/Toast/Alerta';
import {Calendar} from 'primereact/calendar';
import {Button} from 'primereact/button';
import XLSX from 'xlsx';
import BotonRol from '../../UI/BotonRol/BotonRol';


class Inventario extends Component {

  constructor(props){
    super(props)
    this.state={
      cargando: false,
      tipo: 'opciones',
      visible: false,
      objAwsExistente: {
        "operation": "list",
        "tableName": "repuesto",
        "payload": {}
      },
      objAwsAgotados: {
        "operation": "list",
        "tableName": "repuestoAgotado",
        "payload": {}
      },
      cols: [],
      dataExistente: [],
      dataAgotados: [],
      loading: true,
      repuestoSeleccionado:{
        "cantidad real": "",
        "descripción repuesto": "",
        "modelo": "",
        "serie": "",
        "part/number o Feature": "",
        "ubicación física": "",
        "reservado": "",
        "proveedor": "",
        "fecha adquisición": "",
        "precio unitario": "",
        "precio total": "",
        "observaciones": ""
      },
      urlExistentes: 'https://1ps11pdwp0.execute-api.us-east-1.amazonaws.com/default/crud',
    }
    this.validaciones = []
  }

  componentWillMount(){
    let repuesto = this.state.repuestoSeleccionado
    let validacion

    Object.keys(repuesto).forEach(r => {
      if(r !== 'observaciones' && r !== 'precio total' && r !== 'reservado' && r!== 'id' && r!=='serie'){
      validacion = {
        field: r,
        method: 'isEmpty',
        validWhen: false,
        message: r + ' es requerida.'
      }
      this.validaciones.push(validacion)}
    })
    this.validator = new FormValidator(this.validaciones)
    repuesto.validation = this.validator.valid()
  }
  componentDidMount() {

    Axios.put(this.state.urlExistentes, this.state.objAwsExistente).then(r => {
      let data = r.data.payload
      this.setState({ dataExistente: data, loading: false })
    })
    Axios.put(this.state.urlExistentes, this.state.objAwsAgotados).then(r => {
      let data = r.data.payload
      this.setState({ dataAgotados: data, loading: false })

    })
  }
  seleccionarRepuesto = evento =>{
    this.showDrawer()
    this.setState({repuestoSeleccionado: Object.assign({}, evento.value )})
  }
  
  handleInputChange = event => {
    event.preventDefault();
    const newState = Object.assign({}, this.state);
    newState.repuestoSeleccionado[event.target.name] = event.target.value
    this.setState(newState);
  }
  handleCalendarChange = event  =>{
    event.preventDefault();
    const newState = Object.assign({}, this.state);
    newState.repuestoSeleccionado[event.target.name] = event.target.value.toISOString();
    this.setState(newState);
  }
  changeInputNumber = (event, nombre) =>{

    let newState = Object.assign({}, this.state);
    newState.repuestoSeleccionado[nombre] = event  ? event.toString(): null
    this.setState(newState);

    if(this.state.repuestoSeleccionado['precio unitario']){
      let resultado = newState.repuestoSeleccionado['cantidad real'] * newState.repuestoSeleccionado['precio unitario']
      newState.repuestoSeleccionado['precio total'] = resultado.toFixed(2) 
      this.setState(newState);
    }
  }
  guardarCambios=()=>{
    const validation = this.validator.validate(this.state.repuestoSeleccionado);
    
    if(validation.isValid && this.state.repuestoSeleccionado['cantidad real']>0){
      let objAWS = {"payload":  this.state.repuestoSeleccionado}
      delete this.state.repuestoSeleccionado['ignore_whitespace']
      delete this.state.repuestoSeleccionado.validation
      Axios.put("https://b5u876yyof.execute-api.us-east-1.amazonaws.com/default/actualizarRepuesto", objAWS).then(r=>{
        Alerta.info(r.data.mensaje)
        this.setState({dataExistente : r.data.repuestos, dataAgotados: r.data.repuestosAgotados})
        this.cancelar()
      }).catch(error=>console.log(error))
    }else{
      Alerta.error('Faltan campos por completar')
    }
  }
 
  cancelar=()=>{
   this.validator = new FormValidator(this.validaciones)
   let repuestoSeleccionado={
        "cantidad real": "",
        "descripción repuesto": "",
        "modelo": "",
        "serie": "",
        "part/number o Feature": " ",
        "ubicación física": "",
        "reservado": "",
        "proveedor": "",
        "fecha adquisición": "",
        "precio unitario": "",
        "precio total": "",
        "observaciones": "",
        "validation":this.validator.valid()
   } 
   this.setState({repuestoSeleccionado, visible: false})
   
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  handleChange = event =>{

    this.setState({ cargando: true})
  
    const files = event.target.files;
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    //let registrosTabla = this.state.registrosTabla

    reader.onload = (e) => {
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA : true });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const nuevosRegistros = XLSX.utils.sheet_to_json(ws);
        nuevosRegistros.forEach(x => {
          debugger
          Object.keys(this.state.repuestoSeleccionado).forEach(y => {
              if (x[y] === undefined && y !== 'validation') x[y] = ""
          })
        })
        let objAWS={ payload: nuevosRegistros  }

        Axios.put('https://urim5kzibb.execute-api.us-east-1.amazonaws.com/default/repuesto', objAWS)
           .then(r=>{
             let repuestoExistentes = r.data.repuestos
             let repuestosAgotados = r.data.repuestosAgotados
             Alerta.info(r.data.mensaje)
             this.setState({dataExistente : repuestoExistentes, dataAgotados: repuestosAgotados,  cargando: false })
        }).catch(error=>{
          this.setState({ cargando: false})
          Alerta.error('Error')})
    }; 

    if (rABS) {
        reader.readAsBinaryString(files[0]);
    } else {
        reader.readAsArrayBuffer(files[0]);
    };    
  }

  render() {
    // console.log(this)
    // const es = {
    //   firstDayOfWeek: 1,
    //   dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
    //   dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
    //   dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
    //   monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    //   monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
    // };

    let formulario =
    <Drawer
          title="Nuevo Registro"
          width={720}
          onClose={this.cancelar}
          visible={this.state.visible}
        >     
      <Container>
          <Row>
              <Col sm={6} xs={12}> 
                <span><b>Cantidad Real </b><span className='requerido'>*</span></span>
                <InputNumber 
                  placeholder="Cantidad Real"
                  name="cantidad real"
                  label=''
                  className='margenSuperiorInput'
                  value={this.state.repuestoSeleccionado['cantidad real']}
                  onChange={(e)=>this.changeInputNumber(e, 'cantidad real')}
                  min={0} max={100}  />
              </Col>
              <Col sm={6} xs={12}>
                <span><b>Descripción repuesto </b><span className='requerido'>*</span></span>
                <TextInputField
                  placeholder="Descripción repuesto"
                  name="descripción repuesto"
                  label=''
                  value={this.state.repuestoSeleccionado['descripción repuesto']}
                  onChange={this.handleInputChange}/>
              </Col>
              <Col sm={6} xs={12}>
                <span><b>Modelo </b><span className='requerido'>*</span></span>
                <TextInputField
                  placeholder="Modelo"
                  name="modelo"
                  label=''
                  value={this.state.repuestoSeleccionado.modelo}
                  onChange={this.handleInputChange}/>
              </Col>
              <Col sm={6} xs={12}>
                <span><b>Serie </b></span>
                <TextInputField
                  placeholder="Serie"
                  name="serie"
                  label=''
                  className='margenSuperiorInput'
                  value={this.state.repuestoSeleccionado.serie}
                  onChange={this.handleInputChange}/>
              </Col>
              <Col sm={6} xs={12}>
                <span><b>Part/Number o Feature </b><span className='requerido'>*</span></span>
                <TextInputField
                  placeholder="Part/Number o Feature"
                  name="part/number o Feature"
                  label=''
                  value={this.state.repuestoSeleccionado['part/number o Feature']}
                  onChange={this.handleInputChange}/>
              </Col>
              <Col sm={6} xs={12}>
                <span><b>Ubicación Física </b><span className='requerido'>*</span></span>
                <TextInputField
                  placeholder="Ubicación Física"
                  name="ubicación física"
                  label=''
                  value={this.state.repuestoSeleccionado['ubicación física']}
                  onChange={this.handleInputChange}/>
              </Col>
              <Col sm={6} xs={12}>
                <span><b>Reservado para </b></span>
                <TextInputField
                  placeholder="Reservado para"
                  name="reservado"
                  label=''
                  className='margenSuperiorInput'
                  value={this.state.repuestoSeleccionado.reservado}
                  onChange={this.handleInputChange}/>
              </Col>
              <Col sm={6} xs={12}>
                <span><b>Proveedor </b><span className='requerido'>*</span></span>
                <TextInputField
                  placeholder="Proveedor"
                  name="proveedor"
                  label=''
                  value={this.state.repuestoSeleccionado.proveedor}
                  onChange={this.handleInputChange}/>
              </Col>
              <Col sm={6} xs={12}>
                <span><b>Fecha de adquisición </b><span className='requerido'>*</span></span>
                <Calendar 
                  className='calendario'
                  placeholder="Fecha de adquisición"
                  name="fecha adquisición"
                  value={this.state.repuestoSeleccionado['fecha adquisición'] !== "" ?
                         new Date(this.state.repuestoSeleccionado['fecha adquisición']) : 
                         this.state.repuestoSeleccionado['fecha adquisición']  }
                  onChange={this.handleCalendarChange} 
                  monthNavigator={true}
                  yearNavigator={true}
                  yearRange="2000:2100"
                  readOnlyInput
                  showIcon={true} 
                  dateFormat="yy/mm/dd"
                  numberOfMonths={1}/> 
              </Col>
              <Col sm={6} xs={12}>
                <span><b>Precio Unitario </b><span className='requerido'>*</span></span>
                <InputNumber
                  placeholder="Precio Unitario"
                  name="precio unitario"
                  value={this.state.repuestoSeleccionado['precio unitario']}
                  onChange={(e)=>this.changeInputNumber(e, 'precio unitario')}
                 />
              </Col>
              <Col sm={6} xs={12}>
                <span><b>Precio Total </b></span>
                <InputNumber
                  placeholder="Precio Total"
                  name="precio total"
                  className='margenSuperiorInput'
                  value={this.state.repuestoSeleccionado['precio total']}
                  onChange={(e)=>this.changeInputNumber(e, 'precio total')}
                  disabled/>
              </Col>
              <Col sm={6} xs={12}>
                <span><b>Observaciones </b></span>
                <TextInputField
                  placeholder="Observaciones"
                  name="observaciones"
                  label=''
                  value={this.state.repuestoSeleccionado.observaciones}
                  onChange={this.handleInputChange}/>
              </Col>
          </Row> 
          <Row  className="justify-content-md-end">
            <Col sm={12} xs={12} style={{ paddingLeft : '40%'}}  >
              <BotonRol className='Margen' etiqueta="Guardar" funcion={this.guardarCambios}/>
              <Button className='Margen' label="Cancelar" onClick={this.cancelar}/>
            </Col>
          </Row>
      </Container>
    </Drawer>


     let tablaExistentes =
      <Tabla {...this.props}
        submitT={true}
        anadir={this.showDrawer}
        tipo={this.state.tipo}
        data={this.state.dataExistente}
        link={this.state.urlExistentes}
        noMostrar={['id', 'cantidad saliente', 'observaciones', 'fecha adquisición', 'item', 'proveedor']}
        opciones={{ ver: '/home/repuesto/detalle' }} 
        titulo={this.state.titulo} descripcion={this.state.descripcion}
        seleccionarUno={this.seleccionarRepuesto}
        titulos={["item", "cantidad real", "descripción de la parte", "modelo", "P/N o feature", "ubicación física", "reservado", "proveedor", "fecha adquisición", "precio unitario", "precio total", "cantidad saliente", "observaciones"]}
        ></Tabla>

    let tablaAgotados =
      <Tabla {...this.props}
        submitT={true}
        tipo={this.state.tipo}
        anadir={this.showDrawer}
        data={this.state.dataAgotados}
        link={this.state.urlAgotados}
        opciones={{ ver: '/home/repuesto/detalle' }} 
        noMostrar={['id', 'cantidad saliente', 'observaciones', 'fecha adquisición', 'item', 'proveedor']}
        titulo={this.state.titulo} descripcion={this.state.descripcion}
        seleccionarUno={this.seleccionarRepuesto}
        titulos={["item", "cantidad real", "descripción repuesto", "modelo", "P/N o feature", "ubicación física", "reservado", "proveedor", "fecha adquisición", "precio unitario", "precio total", "cantidad saliente", "observaciones"]}
        ></Tabla>
    return (
      <Auxiliar>
        <Spin spinning={this.state.cargando}>
        <Titulo texto="Repuestos"></Titulo>
        {
          this.state.loading ? <Spinner /> :
          <Container>
            <Tabs defaultActiveKey="Repuestos Existentes" >
            <Tab eventKey="Repuestos Existentes" title="Repuestos Existentes" id='llenos' >
              <br/>
              <Row >
                  <Col md={{ offset: 10 }}>{this.state.dataExistente.length>0 ? null: <input type="file" className='inputFile' accept={[ ".xlsx", ".xlsb", ".xlsm", ".xls", ".xml", ".csv"]} onChange={this.handleChange}/>}</Col>
              </Row>
              {formulario}
              <br/>
              {tablaExistentes}
            </Tab>
            <Tab eventKey="Repuestos Agotados" title="Repuestos Agotados">
              <br />
              {formulario}
              {tablaAgotados}
            </Tab>
          </Tabs>
          </Container>    
        }
        </Spin>
      </Auxiliar>

    );
  }
}

export default Inventario;
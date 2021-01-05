import React from 'react';
import Auxiliar from '../../cao/Auxiliar';
import estilo from './Reporte.module.css'
import Titulo from '../../UI/Titulo/Titulo';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Spinner from '../../UI/Spinner/Spinner';
import { Card } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { Table, DatePicker, Radio, Select } from 'antd'
import 'antd/dist/antd.css';
import Alerta from '../../UI/Toast/Alerta'
import Axios from 'axios';
import { Bar } from 'react-chartjs-2'
import Ordenar from '../../function/Ordenar/Ordenar'
import XLSX from 'xlsx';

const provincias = require('../../data/provincias.json')
const { RangePicker } = DatePicker;
const { Option } = Select;

class Reporte extends React.Component {
	constructor() {
		super();
		this.state = {
			dataTicket: {
				estado: [],
				'técnico asignado': [],
				provincia: [],
				'fecha inicio': [],
				'tipo servicio':[],
				'repuestos':[]
			},
			dataPersonal: {
				rol: [],
				estado: [],
				especialidad: [],
				'equipo/producto': []
			},
			dataCliente: {
				clienteIDs: [],
				filtro: "",
				ticket: {},
				contrato: {},
				equipo: {}
			},
			opcionesFiltrosCliente: [{ key: 'Tickets', text: 'Tickets', value: 'ticket' }, { key: 'Contratos', text: 'Contratos', value: 'contrato' }, { key: 'Equipos', text: 'Equipos', value: 'equipo' }],
			// horarioContrato: [{ key: 'Laboral 5x9', text: 'Laboral 5x9', value: '5x9' }, { key: 'Extendido 7x24', text: 'Extendido 7x24', value: '7x24' }],
			duenoContrato: [{ key: 'Sifuturo', text: 'Sifuturo', value: 'Sifuturo' }, { key: 'CharPC', text: 'CharPC', value: 'CharPC' }],
			filtroTicket: false,
			filtroContrato: false,
			filtroEquipo: false,
			opcionCliente: false,
			opcionPersonal: false,
			opcionTicket: false,
			loading: true,
			cargandoTabla: false,
			columnas: [],
			data: [],
			chartData: {},
			btnConsultar: false,
			equipos: [],
			'opcion cliente':'clienteIDs',
			filtrosTicket: [
				{ "nombre": "Estados del ticket", "key": "estado", "value": "estado", "opciones": [{ key: 'activo', text: 'Activo', value: 'activo' }, { key: 'asignado', text: 'Asignado', value: 'asignado' }, { key: 'revisado', text: 'Revisado', value: 'revisado' }, { key: 'solucionado', text: 'Solucionado', value: 'solucionado' }, { key: 'espera', text: 'Espera', value: 'espera' }, { key: 'terminado', text: 'Terminado', value: 'terminado' }] },
				{ "nombre": "Técnico Asignado", "key": "técnico asignado", "value": "técnico asignado", "opciones": [] },
				{ "nombre": "Provincias", "key": "provincias", "value": "provincia", "opciones": [] },
				{ "nombre": "Tipo de Servicio", "key": "tipo servicio", "value": "tipo servicio", "opciones": [{ key: '01-MANT. PREVENTIVO', text: '01-MANT. PREVENTIVO', value: '01-MANT. PREVENTIVO' }, { key: '02-MANT. CORRECTIVO', text: '02-MANT. CORRECTIVO', value: '02-MANT. CORRECTIVO' }, { key: '03-MANT. CONCURR', text: '03-MANT. CONCURR', value: '03-MANT. CONCURR' }, { key: '04-CAMB. PARTES', text: '04-CAMB. PARTES', value: '04-CAMB. PARTES' }, { key: '05-INST./UPGRADE', text: '05-INST./UPGRADE', value: '05-INST./UPGRADE' }, { key: '06-OTROS', text: '06-OTROS', value: '06-OTROS' }] },
				{ "nombre": "Repuestos", "key": "repuestos", "value": "repuestos", "opciones": [{ key: 'CON REPUESTOS', text: 'CON REPUESTOS', value: 'con repuesto' }, { key: 'SIN REPUESTOS', text: 'SIN REPUESTOS', value: 'sin repuesto' }] }
			],
			filtrosPersonal: [
				{ "nombre": "Rol", "key": "rol", "value": "rol", "opciones": [{ key: 'técnico', text: 'Técnico', value: 'técnico' }, { key: 'ventas', text: 'Ventas', value: "ventas" }] },
				{ "nombre": "Estado", "key": "estado", "value": "estado", "opciones": [{ key: 'activo', text: 'Activo', value: 'activo' }, { key: 'inactivo', text: 'Inactivo', value: 'inactivo' }] },
				{ "nombre": "Especialidad", "key": "especialidad", "value": "especialidad", "opciones": [{ key: 'software', text: 'Software', value: 'especialidad software' }, { key: 'hardware', text: 'Hardware', value: 'especialidad hardware' }, { key: 'consultoria', text: 'Consultoría', value: 'especialidad consultoria' }] },
			]
		};
		this.opciones = {
			legend: { display: true, position: 'top' },
			scales: {
				xAxes: [{ stacked: true }],
				yAxes: [{ stacked: true }]
			}
		}
	}

	componentDidMount() {
		let newState = Object.assign({}, this.state)


		Axios.get('https://76o22dcayd.execute-api.us-east-1.amazonaws.com/default/listaClientePersonal')
			.then(r => {
				let personal = r.data.personal
				personal.forEach(m => {
					if (m.rol === 'técnico')
						newState.filtrosTicket[1].opciones.push({ key: m.apellido + ' ' + m.nombre, text: m.apellido + ' ' + m.nombre, value: m.ci })
					this.setState(newState)
				})
			}).then(() => {
				Object.keys(provincias).forEach(m => newState.filtrosTicket[2].opciones.push({ key: provincias[m].provincia, text: provincias[m].provincia, value: provincias[m].provincia }))
				this.setState(newState)
			}).then(() => {
				Axios.put('https://ptcy067kz8.execute-api.us-east-1.amazonaws.com/default/crudCliente', { "operation": "list", "tableName": "cliente", "payload": {} })
					.then(response => {
						let data = response.data.payload
						let clientes = []
						data.forEach(r => {
							clientes.push({ value: r.id, text: r.nombre })
						})
						this.setState({ clientes, loading: false })
					})
					.catch(err => {
						console.log("Error servidor")
					})
			})
			.catch(c => Alerta.error("Error con el servidor"))


	}

	selectCliente = () => {
		this.setState({ opcionCliente: !this.state.opcionCliente, opcionPersonal: false, opcionTicket: false, data: [], columnas: [], dataset: {},  btnConsultar: true })
	}
	selectPersonal = () => {
		this.setState({ opcionPersonal: !this.state.opcionPersonal, opcionTicket: false, opcionCliente: false, data: [], columnas: [], dataset: {}, btnConsultar: false })
	}
	selectTicket = () => {
		this.setState({ opcionTicket: !this.state.opcionTicket, opcionCliente: false, opcionPersonal: false, data: [], columnas: [], dataset: {}, btnConsultar: false })
	}

	consultar = () => {
		let equipos = []
		Axios.put('https://8pxrb4nvji.execute-api.us-east-1.amazonaws.com/default/consultarEquipoProducto', { 'especialidades': this.state.dataPersonal.especialidad }).then(r => {
			if (r.data.mensaje === 'ok') {
				(r.data.equipos).forEach(r => {
					equipos.push({ key: r['equipo/producto'], text: r['equipo/producto'], value: r })
				})
				this.setState({ equipos: equipos })
			}
		})
	}

	obtenerData = () => {

		let data = {}
		let url = {}
		this.setState({ cargandoTabla: true, chartData: {} })

		if (this.state.opcionTicket) {
			data = this.state.dataTicket
			url = 'https://tiqbrb8bnb.execute-api.us-east-1.amazonaws.com/default/reporteTicket'
		} else if (this.state.opcionPersonal) {
			data = this.state.dataPersonal
			url = 'https://vdpbfxdd63.execute-api.us-east-1.amazonaws.com/default/reportePersonal'
		} else if (this.state.opcionCliente) {
			data = this.state.dataCliente
			url = 'https://b9q42q5ty5.execute-api.us-east-1.amazonaws.com/default/reporteCliente'
		}

		Axios.put(url, data).then(r => {
			let columnas = []
			if (r.data.length > 0) {
				Ordenar(Object.keys(r.data[0])).forEach(r => columnas.push({ title: r, dataIndex: r, key: r }))
				this.setState({ columnas: columnas, data: r.data, cargandoTabla: false })
				if(this.state['opcion personal'] !== undefined || this.state['opcion cliente'] !== undefined || this.state['opcion ticket'] !== undefined)
				this.generarDataGrafico()
			} else {
				Alerta.info("No se ha encontrado ningún registro")
				this.setState({ cargandoTabla: false, data: [], columnas: [] })
			}
		}).catch(error => {
			Alerta.error(error)
		})
	}

	generarDataGrafico = () => {
		let contadorFiltros = [0, 0, 0]
		let resultado = []
		let dataset = []
		let datos = []
		let data = []
		let filtro = null;

		[{ opcion: this.state.opcionTicket, data: this.state.dataTicket , filtro: this.state['opcion ticket'] },
		{ opcion: this.state.opcionPersonal, data: this.state.dataPersonal, filtro: this.state['opcion personal']},
		{ opcion: this.state.opcionCliente, data: this.state.dataCliente , filtro: this.state['opcion cliente']}].forEach((o, index) => {
			if (o.opcion) {
				Object.keys(o.data).forEach(r => {
					if (o.data[r].length >= 1) contadorFiltros[index] = contadorFiltros[index] + 1
				})
				data = o.data
				filtro = o.filtro
			}
		})

			data[filtro].forEach((r, i) => {
				if(filtro === 'especialidad')
					datos.push(this.state.data.filter(s => s[filtro] !== []))
				else if(filtro === 'clienteIDs')
					datos.push(this.state.data.filter(s => s.cliente === r))
				else{
					datos.push(this.state.data.filter(s => s[filtro] === r))	
				}
				resultado.push(datos[i].length)
			})

			dataset.push({ label: 'Total de registros', backgroundColor: "rgba(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ",0.5)", data: resultado })

			let dataGrafico = {
				labels: data[filtro],
				datasets: dataset
			}
			this.setState({ chartData: dataGrafico })
			let b = document.getElementsByTagName("table")[0].setAttribute("id", "miTabla")
			console.log(b)
			
	}

	imprimir = () => {
		let newState = Object.assign({}, this.state)
		newState.filtroTicket = true
		newState.filtroContrato = false
		newState.filtroEquipo = false
		this.setState(newState)
		window.print()
	}

	handleDataTicket = (value, name) => {
		let ptoDataTicket = this.state.dataTicket
		ptoDataTicket[name] = value
	}

	handleDataPersonal = (value, name) => {
		let ptoDataPersonal = this.state.dataPersonal
		ptoDataPersonal[name] = value
	}

	handleDataCliente = (value, name) => {
		let newState = Object.assign({}, this.state)

		if((name === 'clienteIDs' && value.length !== 0)|| (name === 'filtro' && newState.dataCliente.clienteIDs.length >0)){
			newState.dataCliente[name] = value

			if (value === 'ticket' && this.state.dataCliente.clienteIDs.length > 0){
				newState.dataCliente.contrato = {}
				newState.dataCliente.equipo = {}
				newState.filtroTicket = true
				newState.filtroContrato = false
				newState.filtroEquipo = false
				newState.btnConsultar = false
		}else if (value === 'contrato' && this.state.dataCliente.clienteIDs.length > 0){
				newState.dataCliente.equipo = {}
				newState.dataCliente.ticket = {}
				newState.filtroTicket = false
				newState.filtroContrato = true
				newState.filtroEquipo = false
				newState.btnConsultar = false
		}else if (value === 'equipo' && this.state.dataCliente.clienteIDs.length > 0){
				newState.dataCliente.filtro = value
				newState.dataCliente.contrato = {}
				newState.dataCliente.ticket = {}
				newState.filtroTicket = false
				newState.filtroContrato = false
				newState.filtroEquipo = true
				newState.btnConsultar = false
		}
		}else{
			Alerta.info('Debe seleccionar un cliente')
		}
	
	
		this.setState(newState)
	}
	
	handleFiltroPadre =(event)=>{
		let newState = Object.assign({}, this.state) 
		newState[event.target.name] = event.target.value
		this.setState(newState)
	}
	
	handleDataFiltrosCliente = (value, name) => {
		let ptoDataCliente = this.state.dataCliente
		ptoDataCliente[ptoDataCliente.filtro][name] = value
	}

	borrarFiltros =()=>{
		this.setState({ opcionCliente: false, opcionPersonal: false, opcionTicket: false, data: [], columnas: [], dataset: {},  btnConsultar: true })
	}

	exportExcell =()=>{
		var wb= XLSX.utils.table_to_book(document.getElementById('miTabla'), {sheet:"Sheet JS"});
		var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
		var buf = new ArrayBuffer(wbout.length);
		var view = new Uint8Array(buf);

		view.forEach((r,i)=>{
			view[i] = wbout.charCodeAt(i) & 0xFF;
		})

		console.log(view)

		return view

	}

	render() {
		return (
			this.state.loading ? <Spinner /> :
				<Auxiliar>
					<Container style={{ marginTop: '10px' }}>
						<Titulo texto="reportes"></Titulo>
						<Card style={{ width: '100%' }}>
							<Row className="justify-content-md-center" >
								<Col sm={12} md={4} lg={4}>
									<Row className={["justify-content-md-center", this.state.opcionTicket ? estilo.activo : estilo.inactivo].join(" ")} style={{ padding: '6%' }} onClick={this.selectTicket}>
										<i style={{ marginRight: '5%' }} className="fas fa-ticket-alt blue-text fa-2x"></i>
										<h4 style={{ marginTop: '1%' }} className="font-weight-bold">TICKETS</h4>
									</Row>
								</Col>
								<Col sm={12} md={4} lg={4}>
									<Row className={["justify-content-md-center", this.state.opcionPersonal ? estilo.activo : estilo.inactivo].join(" ")} style={{ padding: '6%' }} onClick={this.selectPersonal}>
										<i style={{ marginRight: '5%' }} className="fas fa-people-carry blue-text fa-2x"></i>
										<h4 style={{ marginTop: '1%' }} className="font-weight-bold">PERSONAL</h4>
									</Row>
								</Col>
								<Col sm={12} md={4} lg={4}>
									<Row className={["justify-content-md-center", this.state.opcionCliente ? estilo.activo : estilo.inactivo].join(" ")} style={{ padding: '6%' }} onClick={this.selectCliente}>
										<i style={{ marginRight: '5%' }} className="fas fa-user-friends blue-text fa-2x"></i>
										<h4 style={{ marginTop: '1%' }} className="font-weight-bold">CLIENTES</h4>
									</Row>
								</Col>
							</Row>
						</Card>
						<Card style={{ width: '100%' }}>
							<Row>
								<Col sm={12} md={7} lg={7}>
									<span style={{ margin: '0% 0% 0% 5%' }}>Filtros disponibles</span>
									{this.state.opcionTicket ?
										<Col style={{ padding: '2%' }}>
											<Radio.Group style={{ width: '100%' }}  name='opcion ticket' onChange={this.handleFiltroPadre}>
												{this.state.filtrosTicket.map((r, i) => {
													return <Row key={r.nombre + i} style={{ textAlign: 'left' }}>
														<Col className={estilo.filtros}>
															<Radio key={r.key} value={r.value}>{r.nombre}</Radio>
															<Select mode="multiple" style={{ width: '100%' }} placeholder="Please select" onChange={(value) => this.handleDataTicket(value, r.value)}>
																{r.opciones !== undefined ? r.opciones.map(r => {
																	return <Option key={r.key} value={r.value}>{r.text}</Option>
																}) : null
																}
															</Select>
														</Col>
													</Row>
												})
												}{
													<Row style={{ textAlign: 'left' }}>
														<Col className={estilo.filtros}>
															<span>Rango de  Fechas</span><br></br>
															<RangePicker style={{ width: '100%' }} onChange={(value) => this.handleDataTicket(value, "fecha inicio")} />
														</Col>
													</Row>
												}
											</Radio.Group>
										</Col>
										: null}

									{this.state.opcionPersonal ?
										<Col style={{ padding: '2%' }}>
											<Radio.Group style={{ width: '100%' }} name='opcion personal' onChange={this.handleFiltroPadre}>
												{this.state.filtrosPersonal.map((r, i) => {
													return <Row key={r.nombre + i} style={{ textAlign: 'left' }}>
														<Col className={estilo.filtros}>
															<Radio key={r.key} value={r.value}>{r.nombre}</Radio>
															<Select mode="multiple" style={{ width: '100%' }} placeholder="Please select" onBlur={r.value === "especialidad" ? this.consultar : null} onChange={(value) => this.handleDataPersonal(value, r.value)}>
																{r.opciones !== undefined ? r.opciones.map(r => {
																	return <Option key={r.key} value={r.value}>{r.text}</Option>
																}) : null
																}
															</Select>
														</Col>
													</Row>
												})
												}{
													<Row style={{ textAlign: 'left' }}>
														<Col className={estilo.filtros}>
															<span>Equipo/producto</span><br></br>
															<Select mode="multiple" style={{ width: '100%' }} placeholder="Please select" onChange={(value) => this.handleDataPersonal(value, "equipo/producto")}>
																{this.state.equipos.map(r => {
																	return <Option key={r.key} value={JSON.stringify(r.value)}>{r.text}</Option>
																})
																}
															</Select>
														</Col>
													</Row>
												}
											</Radio.Group>
										</Col>
										: null}

									{this.state.opcionCliente ?
										<Col style={{ padding: '2%' }}>
											<Row style={{ textAlign: 'left' }}>
												<Col className={estilo.filtros}>
													<span htmlFor='clientes'>Clientes</span>
													<Select value={this.state.dataCliente.clienteIDs} mode="multiple" style={{ width: '100%' }} placeholder="Please select" onChange={(value) => this.handleDataCliente(value, 'clienteIDs')}>
														{this.state.clientes !== undefined ? this.state.clientes.map((r,i) => {
															return <Option key={r.key + i} value={r.value}>{r.text}</Option>
														}) : null
														}
													</Select>
												</Col>
											</Row>
											<Row style={{ textAlign: 'left' }}>
												<Col className={estilo.filtros}>
													<span htmlFor='opciones'>Opciones</span>
													<Select value={this.state.dataCliente.filtro} style={{ width: '100%' }} placeholder="Please select" onChange={(value) => this.handleDataCliente(value, 'filtro')}>
														{this.state.opcionesFiltrosCliente.map(r => {
															return <Option key={r.key} value={r.value}>{r.text}</Option>
														})
														}
													</Select>
												</Col>
											</Row>
											{this.state.filtroTicket ?
												<Auxiliar>
													<Row style={{ textAlign: 'left' }}>
														<Col className={estilo.filtros}>
															<span htmlFor="estadoTicktet">Estado Ticket</span>
															<Select mode="multiple" style={{ width: '100%' }} placeholder="Please select" onChange={(value) => this.handleDataFiltrosCliente(value, 'estado')}>
																{this.state.filtrosTicket[0].opciones.map(r => {
																	return <Option key={r.key} value={r.value}>{r.text}</Option>
																})
																}
															</Select>
														</Col>
													</Row>
													<Row style={{ textAlign: 'left' }}>
														<Col className={estilo.filtros}>
															<span>Rango de  Fechas</span><br></br>
															<RangePicker style={{ width: '100%' }} onChange={(e) => this.handleDataFiltrosCliente(e, 'fecha inicio')} />
														</Col>
													</Row>
												</Auxiliar> : null
											}
											{this.state.filtroContrato ?
												<Auxiliar>
													<Row style={{ textAlign: 'left' }}>
														<Col className={estilo.filtros}>
															<span htmlFor='duenoContrato'>Dueño Contrato</span>
															<Select style={{ width: '100%' }} placeholder="Please select" onChange={(value) => this.handleDataFiltrosCliente(value, 'dueño de contrato')}>
																{this.state.duenoContrato.map(r => {
																	return <Option key={r.key} value={r.value}>{r.text}</Option>
																})
																}
															</Select>
														</Col>
													</Row>
													<Row style={{ textAlign: 'left' }}>
														<Col className={estilo.filtros}>
															<span>Rango de  Fechas</span><br></br>
															<RangePicker style={{ width: '100%' }} onChange={(e) => this.handleDataFiltrosCliente(e, 'fecha inicio')} />
														</Col>
													</Row>
												</Auxiliar> : null
											}
											{this.state.filtroEquipo ?
												<Auxiliar>
													<Row style={{ textAlign: 'left' }}>
														<Col className={estilo.filtros}>
															<span htmlFor='estadoP'>Estado</span>
															<Select style={{ width: '100%' }} placeholder="Please select" onChange={(value) => this.handleDataFiltrosCliente(value, 'estado')}>
																{this.state.filtrosPersonal[1].opciones.map(r => {
																	return <Option key={r.key} value={r.value}>{r.text}</Option>
																})
																}
															</Select>
														</Col>
													</Row>
													<Row style={{ textAlign: 'left' }}>
														<Col className={estilo.filtros}>
															<span htmlFor='ciudad'>Provincias</span>
															<Select style={{ width: '100%' }} placeholder="Please select" onChange={(value) => this.handleDataFiltrosCliente(value, 'provincia')}>
																{this.state.filtrosTicket[3].opciones.map(r => {
																	return <Option key={r.key} value={r.value}>{r.text}</Option>
																})
																}
															</Select>
														</Col>
													</Row>
												</Auxiliar> : null
											}
										</Col> : null
									}
								</Col>
								{this.state.opcionTicket || this.state.opcionPersonal || this.state.opcionCliente ?
									<Col sm={12} md={5} lg={5} style={{ padding: '10%' }}>
										
											
											<p className={[estilo.boton, estilo.azul].join(" ")} onClick={this.obtenerData}>
											<i style={{ marginRight: '5%' }} className="fas fa-search fa-1x"></i>
											CONSULTAR
											</p>
											
											<p className={[estilo.boton, estilo.azul].join(" ")} onClick={this.imprimir} >
											<i style={{ marginRight: '5%' }} className="far fa-file-pdf fa-1x"></i>
											GENERAR PDF
											</p>
											
											<p className={[estilo.boton, estilo.azul].join(" ")} onClick={this.borrarFiltros} >
											<i style={{ marginRight: '5%' }} className="fas fa-trash fa-1x"></i>
											BORRAR FILTROS
											</p>
											
										
									
										
										{/* <Button label="Consultar" disabled={this.state.btnConsultar} onClick={this.obtenerData}></Button>
										<Button label="Generar PDF" onClick={this.imprimir}></Button> */}
									</Col> : null
								}
							</Row>
						</Card>
						<Card style={{ width: '100%' }}>
							<Table className={estilo.tabla} pagination={{ pageSizeOptions: ['10', '20', '30'], showSizeChanger: true, total: this.state.data.length }}
								columns={this.state.columnas}
								dataSource={this.state.data}
								size='small'
								loading={this.state.cargandoTabla}
							/>
						</Card>
						<Card style={{ width: '100%' }}>
							{
								Object.keys(this.state.chartData).length > 0 ?
									<div style={{ margin: '3%' }} className="chart">
										<Bar data={this.state.chartData} widh={60} heigth={50}
											options={this.opciones}></Bar></div> : null

							}
						</Card>
						<button onClick={this.exportExcell}>Exportar excell</button>
					</Container>
				</Auxiliar>
		);
	}
}

export default Reporte;
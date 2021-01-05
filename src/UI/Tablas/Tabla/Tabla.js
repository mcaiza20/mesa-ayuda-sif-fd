import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Tabla.css'
import Container from 'react-bootstrap/Container';
import Auxiliar from '../../../cao/Auxiliar';
import { Link } from "react-router-guard";
import Form from '../../Form/Form';
import Ordenar from '../../../function/Ordenar/Ordenar';
import ImportCSV from '../../ImportCSV/ImportCSV';
// import $ from 'jquery'

/**
 * @description Se crea una tabla dinámica 
 * @name Tabla 
 * @param {string} tipo Tipo de tabla (seleccion, check, opciones, acordeon, acordeon-opciones, crud)
 * @param {object} data Data para presentar en la tabla
 * @example Tabla simple
 * <Tabla tipo='seleccion' data="[{…}, {…}, {…}]"></Tabla>
 * @example Tabla con opciones (ver, contrato)
 * <Tabla tipo='seleccion' data="[{…}, {…}, {…}]" opciones={{ver:'/home/',contrato:'/#'}}></Tabla>
 */

let account=''
export class Tabla extends Component {

    constructor() {
        super();
        this.state = {};
        this.onRegistroSeleccionado = this.onRegistroSeleccionado.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.nuevo === true){
            this.setState({ data: nextProps.data, datoSeleccionado2 : null})
            account = JSON.stringify(sessionStorage.getItem('account'))
            console.log(account)
        }        
    }

    actionTemplate(opciones) {
        let boton = [];
        Object.keys(opciones).map(r => {
            if (r === 'ver') {
                boton.push(<Link key={r} to={opciones[r]}>
                    <Button type="button" icon="pi pi-search" className="p-button-success" style={{ marginRight: '.5em' }} ></Button>
                </Link>)
            } else if (r === 'contrato') {
                boton.push(<Link key={r} to={opciones[r]}>
                    <Button key={r} href={opciones[r]} type="button" icon="pi pi-file"></Button>
                </Link>)
            }
            return boton
        })
        return (<div>{boton}</div>);
    }

    rowExpansionTemplate(data) {

        let division = (Object.values(data).length) / 2
        let cadenaJson = JSON.stringify(data)
        let opcionesM1 = [];
        let opcionesM2 = [];

        return (
            <div className="p-grid p-fluid" style={{ padding: '2em 1em 1em 1em' }}>
                <div className="p-col-12 p-md-9">
                    <div className="p-grid">
                        {(() => {
                            JSON.parse(cadenaJson, function (k, v) {
                                if (k.length !== 0) {
                                    if ((opcionesM1.length + 1) <= division) {
                                        opcionesM1.push(
                                            <Row key={k}>
                                                <Col className='Header' key={k} style={{ fontWeight: 'bold', textAlign: 'left' }} >{k}:</Col>
                                                <Col key={v} style={{ textAlign: 'left' }}>{v}</Col>
                                            </Row>);
                                    } else {
                                        opcionesM2.push(
                                            <Row key={k}>
                                                <Col className='Header' key={k} style={{ fontWeight: 'bold', textAlign: 'left' }} >{k}:</Col>
                                                <Col key={v} style={{ textAlign: 'left' }}>{v}</Col>
                                            </Row>);
                                    }
                                }
                            })
                            return <Row><Col>{opcionesM1}</Col><Col>{opcionesM2}</Col></Row>;
                        })()}
                    </div>
                </div>
            </div>
        );
    }

    onRegistroSeleccionado(e) {
        if(!account.includes('tecnico'))
            this.setState({ displayDialog: true, registro: Object.assign({}, e.data) });
    }

    render() {
        let tab = ''
        let count = 1;
        //Para columnas adicionales
        let titulo = '';
        let titulos = [];
        let encabezado = [];
        let header = [];
        let b = undefined
        

        header.push(<i key='i' className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>)
        header.push(<InputText key='input' type="search" className="BuscarGlobal" onInput={(e) => {
            let busqueda = e.target.value.replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u");
            this.setState({ globalFilter: busqueda })
        }} placeholder="Búsqueda Global" size="50" />)

        if (this.props.data.length > 0) {


            encabezado = Object.keys(this.props.data[0])

            encabezado = Ordenar(encabezado)


            if (this.props.tipo) {

                switch (this.props.tipo) {
                    case 'seleccion':
                        tab =
                            <DataTable value={this.props.data} selectionMode="single" paginator={true} rows={10} header={header} responsive={true} emptyMessage="No se encontraron registros"
                                onSelectionChange={(e) => { this.setState({ datoSeleccionado: e.value })
                                if(this.props.seleccionarUno)  
                                    this.props.seleccionarUno(e)}}
                                globalFilter={this.state.globalFilter} >
                                {encabezado.map(r => { 
                                     if (this.props.noMostrar) { b = this.props.noMostrar.find(o => o === r); }
                                     
                                     if (b === undefined) {
                                         return (<Column style={{fontSize: '0.75em' }}  className="Header" key={r} field={r} header={r} />) 
                                     } else {
                                         return <Column className="Ocultar" key={r} field={r} header={r}/>
                                     }
                                   })}
                            </DataTable>
                        break;

                    case 'check':
                        titulos = [titulo, ...encabezado]
                        tab =
                            <DataTable value={this.props.data} paginator={true} rows={10} header={header} emptyMessage="No se encontraron registros" responsive={true}
                                selection={this.state.datoSeleccionado2} onSelectionChange={e => { this.setState({ datoSeleccionado2: e.value }); this.props.seleccionarUno(e) }} globalFilter={this.state.globalFilter} >
                                {titulos.map(r => {
                                    if (this.props.noMostrar) { b = this.props.noMostrar.find(o => o === r); }
                                    if (count === 1) {
                                        count++;
                                        return <Column key="radio" selectionMode="single" style={{ width: '3em' }} />
                                    } else if (b === undefined) {
                                        return (<Column className="Header" key={r} field={r} header={r} filter={true} />) 
                                    } else {
                                        return <Column className="Ocultar" key={r} field={r} header={r}/>
                                    }
                                })}
                            </DataTable>
                        break;

                    case 'opciones':

                        encabezado.push('Opciones')
                        // if (!account.includes('tecnico') )
                          if(this.props.anadir)
                            header.push(<Button key='btn' style={{ float: 'right' }} label="Añadir" icon="pi pi-plus" onClick={this.props.anadir} />)
                        if (this.props.opciones) {
                            tab =
                                <DataTable value={this.props.data} selectionMode="single" paginator={true} rows={10} header={header} resizableColumns={true} emptyMessage="No se encontraron registros" responsive={true}
                                onSelectionChange={(e) => { this.setState({ datoSeleccionado: e.value })
                                if(this.props.seleccionarUno)  
                                    this.props.seleccionarUno(e) 
                                else{
                                    localStorage.setItem('seleccionado', JSON.stringify(e.value))
                                }}} globalFilter={this.state.globalFilter}>
                                    {encabezado.map(r => {
                                        if (this.props.noMostrar) { b = this.props.noMostrar.find(o => o === r); }
                                        if (r === 'Opciones') {
                                            return (<Column key={r} body={() => this.actionTemplate(this.props.opciones)} style={{ textAlign: 'center', width: '8em' }} />)
                                        }
                                        if (b === undefined) {
                                            if(r==='fecha inicio'){
                                                return (<Column className="Header" key={r} field={r} header={r} sortable={true} />)
                                            }else{
                                            return (<Column className="Header" key={r} field={r} header={r} filter={true} />)
                                            }
                                        } else {
                                            return <Column className="Ocultar" key={r} field={r} header={r} />
                                        }
                                    })}
                                </DataTable>
                        } else {
                            console.log('No hay opciones para mostrar')
                        }
                        break;

                    case 'acordeon':
                        titulos = [titulo, ...encabezado]
                        tab =
                            <DataTable value={this.props.data} paginator={true} rows={10} header={header} emptyMessage="No se encontraron registros" responsive={true}
                                expandedRows={this.state.expandedRows} onRowToggle={(e) => { console.log(e); this.setState({ expandedRows: e.data }) }}
                                rowExpansionTemplate={this.rowExpansionTemplate} globalFilter={this.state.globalFilter} >
                                {titulos.map(r => {
                                    if (this.props.noMostrar) { b = this.props.noMostrar.find(o => o === r); }
                                    if (count === 1) {
                                        count++;
                                        return <Column key={count} expander={true} style={{ width: '3em' }} />
                                    }
                                    if (b === undefined) {
                                        return <Column className="Header" key={r} field={r} header={r} filter={true} />
                                    } else {
                                        return <Column className="Ocultar" key={r} field={r} header={r} />
                                    }
                                })}
                            </DataTable>
                        break;

                    case 'opciones-acordeon':
                        titulos = [titulo, ...encabezado]
                        titulos.push('Opciones')
                        tab =
                            <DataTable selectionMode="single"  value={this.props.data} paginator={true} rows={10} header={header} emptyMessage="No se encontraron registros" responsive={true}
                                expandedRows={this.state.expandedRows} onRowToggle={(e) => { console.log(e); this.setState({ expandedRows: e.data }) }}
                                rowExpansionTemplate={this.rowExpansionTemplate} globalFilter={this.state.globalFilter} 
                                onSelectionChange={(e) => { this.setState({ datoSeleccionado: e.value })
                                                            if(this.props.seleccionarUno)  
                                                                this.props.seleccionarUno(e) 
                                                            else{
                                                                localStorage.setItem('seleccionado', JSON.stringify(e.value))
                                                            }}}>
                                {titulos.map(r => {
                                    if (this.props.noMostrar) { b = this.props.noMostrar.find(o => o === r); }
                                    if (count === 1) {
                                        count++;
                                        return <Column key={count} expander={true} style={{ width: '3em' }} />
                                    } else if (r === 'Opciones') {
                                        return <Column key={r} body={() => this.actionTemplate(this.props.opciones)} style={{ textAlign: 'center', width: '8em' }} />
                                    } else if(b===undefined){
                                        count++;
                                        return <Column className="Header" key={r} field={r} header={r} filter={true} />
                                    }else {
                                        return <Column className="Ocultar" key={r} field={r} header={r} />
                                    }
                                })}
                            </DataTable>
                        break;

                    case 'crud':
                        let campos = {};
                        // eslint-disable-next-line no-unused-vars
                        let tooltip;
                        titulos = [titulo, ...encabezado]
                        if (!account.includes('tecnico'))
                            header.push(<Button key='btn' style={{ float: 'right' }} label="Añadir" icon="pi pi-plus" onClick={() => { this.setState({ displayDialog: true }) }} />)

                        if (this.state.datoEditado) {
                            console.log(encabezado)
                            encabezado.map(c => {
                                if (c === 'ITEM') {
                                    tooltip = 'Ingrese el item'
                                } else if (c === 'Descripción de la parte') {
                                    tooltip = 'Describa brevemente la parte del repuesto porfavor'
                                } else if (c === 'PROVEEDOR') {
                                    tooltip = 'Ingrese el proveedor del repuesto'
                                } else if (c === 'RESERVADO PARA') {
                                    tooltip = 'Ingrese la persona para la cual esta reservado el repuesto'
                                } else if (c === 'FechaAdquisicion') {
                                    tooltip = 'Ingrese la fecha de adquisición del repuesto en formato dd/mm/aaaa'
                                } else if (c === 'Modelo') {
                                    tooltip = 'Ingrese el modelo del repuesto'
                                } else if (c === 'Cantidad Real') {
                                    tooltip = 'Ingrese el valor de la cantidad real del repuesto'
                                } else {
                                    tooltip = 'Ingrese  ' + c + ' del repuesto'
                                }
                                if (c === 'cantidad real') {
                                    campos[c] = {
                                        elementType: 'contador',
                                        elementConfig: {
                                            type: 'text',
                                            placeholder: c,
                                            etiqueta: c
                                        },
                                        value: this.state.datoEditado[c],
                                        validation: {
                                            required: true
                                        }
                                    }
                                } else {
                                    campos[c] = {
                                        elementType: 'input',
                                        elementConfig: {
                                            type: 'text',
                                            placeholder: c,
                                            etiqueta: c
                                        },
                                        value: this.state.datoEditado[c],
                                        validation: {
                                            required: true
                                        }
                                    }
                                }
                                return campos;
                            })
                        } else {
                            encabezado.map(c => {

                                if (c === 'ITEM') {
                                    tooltip = 'Ingrese el item'
                                } else if (c === 'Descripción de la parte') {
                                    tooltip = 'Describa brevemente la parte del repuesto porfavor'
                                } else if (c === 'PROVEEDOR') {
                                    tooltip = 'Ingrese el proveedor del repuesto'
                                } else if (c === 'RESERVADO PARA') {
                                    tooltip = 'Ingrese la persona para la cual esta reservado el repuesto'
                                } else if (c === 'FechaAdquisicion') {
                                    tooltip = 'Ingrese la fecha de adquisición del repuesto en formato dd/mm/aaaa'
                                } else if (c === 'Modelo') {
                                    tooltip = 'Ingrese el modelo del repuesto'
                                } else if (c === 'Cantidad Real') {
                                    tooltip = 'Ingrese el valor de la cantidad real del repuesto'
                                } else {
                                    tooltip = 'Ingrese  ' + c + ' del repuesto'
                                }

                                campos[c] = {
                                    elementType: 'input',
                                    elementConfig: {
                                        type: 'text',
                                        placeholder: c,
                                        etiqueta: c
                                    },
                                    validation: {
                                        required: true
                                    }
                                }
                                return campos;
                            })
                        }
                        tab =
                            <Auxiliar>
                                <DataTable value={this.props.data} selectionMode="single" paginator={true} rows={10} header={header} responsive={true} emptyMessage="No se encontraron registros"
                                    selection={this.state.datoEditado}
                                    onSelectionChange={e => { localStorage.setItem('nuevoSeleccionado', JSON.stringify(true)); this.setState({ datoEditado: e.value }) }} globalFilter={this.state.globalFilter} onRowSelect={this.onRegistroSeleccionado}
                                    expandedRows={this.state.expandedRows} onRowToggle={(e) => { this.setState({ expandedRows: e.data }) }} rowExpansionTemplate={this.rowExpansionTemplate}>
                                    {titulos.map(r => {
                                        if (this.props.noMostrar) { b = this.props.noMostrar.find(o => o === r); }
                                        if (count === 1) {
                                            count++;
                                            return <Column key={count} expander={true} style={{ width: '3em' }} />
                                        }
                                        if (b === undefined) {
                                            return <Column className="Header" key={r} field={r} header={r} filter={true} />
                                        } else {
                                            return <Column className="Ocultar" key={r} field={r} header={r} />
                                        }
                                    })}
                                </DataTable>

                                <Dialog style={{ marginTop: '70px', width: '80%' }} visible={this.state.displayDialog} header="Detalles del Registro" modal={true}
                                    onHide={() => {
                                        localStorage.removeItem('cantidad');
                                        this.setState({ displayDialog: false, datoEditado: {} })
                                    }} maximizable>
                                    {<div><Container>
                                        <Row style={{ justifyContent: 'center' }}>
                                            <Col xs={12} md={7}>{
                                                <div className='Dialogo' ><Form {...this.props} campos={campos} axiosLink={this.props.link} operacion="create" tabla="repuesto"  ></Form></div>
                                            }</Col>
                                        </Row>
                                    </Container></div>}
                                </Dialog>
                            </Auxiliar>
                        break;

                    default:
                        tab =
                            <DataTable value={this.props.data} header={header} globalFilter={this.state.globalFilter} responsive={true} >
                                {encabezado.map(r => { return <Column className="Header" key={r} field={r} header={r} filter={true} /> })}
                            </DataTable>
                        break;
                }
            } else {
                console.log("No hay tipo")
            }

        } else if (this.props.titulos) {

            // console.log(this.props.titulos)
            let campos = {};
            // eslint-disable-next-line no-unused-vars
            let tooltip;
            // eslint-disable-next-line no-unused-vars
            let csv;
            encabezado = this.props.titulos
            titulos = [titulo, ...encabezado]



            this.props.anadir && !account.includes('tecnico') ?
                header.push(<Button key='btn' style={{ float: 'right' }} label="Añadir" icon="pi pi-plus" onClick={this.props.anadir} />) :
                header.push(<Button key='btn' style={{ float: 'right' }} label="Añadir" icon="pi pi-plus" onClick={() => { this.setState({ displayDialog: true }) }} />)



            encabezado.map(c => {
                if (c === 'ITEM') { tooltip = 'Ingrese el item' }
                else if (c === 'Descripción de la parte') { tooltip = 'Describa brevemente la parte del repuesto porfavor' }
                else if (c === 'PROVEEDOR') { tooltip = 'Ingrese el proveedor del repuesto' }
                else if (c === 'RESERVADO PARA') { tooltip = 'Ingrese la persona para la cual esta reservado el repuesto' }
                else if (c === 'FechaAdquisicion') { tooltip = 'Ingrese la fecha de adquisición del repuesto en formato dd/mm/aaaa' }
                else if (c === 'Modelo') { tooltip = 'Ingrese el modelo del repuesto' }
                else if (c === 'Cantidad Real') { tooltip = 'Ingrese el valor de la cantidad real del repuesto' }
                else { tooltip = 'Ingrese  ' + c + ' del repuesto' }

                campos[c] = {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: c,
                        etiqueta: c
                    },
                    validation: {
                        required: true
                    }
                }
                return campos;
            })

            tab =
                <Auxiliar>
                    {this.props.csv ? <ImportCSV titulos={encabezado}></ImportCSV> :
                        <Auxiliar>
                            <DataTable value={this.props.data} selectionMode="single" paginator={true} rows={10} header={header} responsive={true} emptyMessage="No se encontraron registros"
                                selection={this.state.datoEditado} onSelectionChange={e => this.setState({ datoEditado: e.value })} globalFilter={this.state.globalFilter} onRowSelect={this.onRegistroSeleccionado}
                                expandedRows={this.state.expandedRows}
                                onRowToggle={(e) => { this.setState({ expandedRows: e.data }) }} rowExpansionTemplate={this.rowExpansionTemplate}>
                                {titulos.map(r => {
                                    if (this.props.noMostrar) { b = this.props.noMostrar.find(o => o === r); }
                                    if (count === 1) {
                                        count++;
                                        return <Column key={count} expander={true} style={{ width: '3em' }} />
                                    }
                                    if (b === undefined) {
                                        return <Column className="Header" key={r} field={r} header={r} filter={true} />
                                    } else {
                                        return <Column className="Ocultar" key={r} field={r} header={r} />
                                    }
                                })}
                            </DataTable>

                            <Dialog style={{ marginTop: '70px', width: '80%' }} visible={this.state.displayDialog} header="Detalles del Registro" modal={true}
                                onHide={() => {
                                    localStorage.removeItem('cantidad');
                                    this.setState({ displayDialog: false, datoEditado: {} })
                                }} maximizable>
                                {<div><Container>
                                    <Row style={{ justifyContent: 'center' }}>
                                        <Col xs={12} md={7}>{
                                            // <div className='Dialogo' ><Form {...this.props} campos={campos} axiosLink={this.props.link} operacion="create" tabla="repuesto"  ></Form></div>
                                        }</Col>
                                    </Row>
                                </Container></div>}
                            </Dialog>
                        </Auxiliar>
                    }
                </Auxiliar>
        }

        return (
            <Auxiliar>{tab}</Auxiliar>
            // <Container>{tab}</Container>
        );
    }
}
export default Tabla

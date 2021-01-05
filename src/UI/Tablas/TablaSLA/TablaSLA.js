import React, { Component } from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import Alerta from '../../Toast/Alerta.js';
// import { object } from 'prop-types';

const sla= require('./sla.json')

class TablaSLA extends Component {
    constructor() {
        super();
        this.state = {};
        this.editor = this.editor.bind(this);
    }

    onEditorValueChange(evento, value) {
        let registrosActualizados = [...evento.value];
        switch (evento.field) {
            case 'tiempo respuesta (horas)':
            case 'tiempo maximo de diagnostico (horas)':
            case 'tiempo maximo de solucion (horas)':
                value = Number(value)
                if(isNaN(value)){
                    Alerta.error('Solo valores numéricos')
                }else{
                    registrosActualizados[evento.rowIndex][evento.field] = value;
                }
                break;
        
            default:
                registrosActualizados[evento.rowIndex][evento.field] = value;
                break;
        }
        this.setState({cars: registrosActualizados});
    }   
    
    inputTextEditor(evento, field) {
        if(field !== 'prioridad')
        return <InputText type="text" value={evento.rowData[field]} onChange={(e) => this.onEditorValueChange(evento, e.target.value)} />;
        else 
        return <label >{evento.rowData[field]}</label>
    }
    

    editor(evento) {
        localStorage.setItem('sla', JSON.stringify(evento.value))
        return this.inputTextEditor(evento, evento.field);
    }
     
  
    render() {

        let encabezado = Object.keys(sla.sla[0])
        console.log(sla)
       
        return (
            <div> 
                 <DataTable value={sla.sla} selectionMode="single" paginator={true} rows={10} responsive={true} 
                   emptyMessage="No se encontraron registros" editable={true}
                   onSelectionChange={e => this.setState({ datoSeleccionado: e.value })} globalFilter={this.state.globalFilter} >
                   {encabezado.map(r => {return <Column className="Header" key={r} field={r} header={r} editor={this.editor}  />})}
                   </DataTable>              
            </div>
        );
    }
}

export default TablaSLA;

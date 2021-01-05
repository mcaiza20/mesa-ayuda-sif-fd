import React, { Component } from 'react';
import { CSVReader } from 'react-papaparse';
import Boton from '../Boton/Boton';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons'
import Tabla from '../Tablas/Tabla/Tabla';
import TablaLocal from '../Tablas/TablaLocal/TablaLocal';
import Axios from 'axios';
// import Ordenar from '../../function/Ordenar/Ordenar';


class ImportCSV extends Component {

    state = {
        tipo: 'crud',
        cols: [],
        data:[]
    };

    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
    }

    handleReadCSV = (data) => {
        this.setState({data:data.data})

        this.state.data.map(objeto=>{
            Object.keys(objeto).map(r=>{
                if(r==='__parsed_extra'){
                   delete objeto[r]
                }
                return r;
            })
           return objeto
        })

        if(!this.props.form){
            let objAWS={
                tabla:'repuesto',
                payload: this.state.data
            }
            
            Axios.put('https://urim5kzibb.execute-api.us-east-1.amazonaws.com/default/repuesto', objAWS)
            .then(r=>{
                console.log(r)
                if(r.data.response==='Datos Ingresados'){
                    window.location.reload();
                }
            })
        }
        else{
            localStorage.setItem('objTablaContrato', JSON.stringify(this.state.data));
        }
    }

    handleOnError = (err, file, inputElem, reason) => {
        console.log(err);
    }

    handleImportOffer = () => {
        this.fileInput.current.click();
    }

    render() {

        let tab=''
        let csv = <div>
                    <CSVReader onFileLoaded={this.handleReadCSV} inputRef={this.fileInput} style={{ display: 'none' }} 
                               onError={this.handleOnError} configOptions={{ header: true }}/>
                    <Boton btnTipo="icon" btnClase="Excell" icono={{ familia: 'font Awesome', icono: faFileCsv }} click={this.handleImportOffer}>Importar</Boton>
                </div>
       
        if(!this.props.form){
            tab = 
            <div>
                {csv}
                <Tabla tipo={this.state.tipo} columns={this.state.cols} data={this.state.data} titulos={this.props.titulos}></Tabla>
            </div>
           
        }
        else {
            localStorage.setItem('objTablaContrato', JSON.stringify(this.state.data));
            tab =<TablaLocal noMostrar={this.props.noMostrar} titulos={this.props.titulos}></TablaLocal>  
        }
        return (
            <div>    
               {tab}
            </div>
        );
    }
}

export default ImportCSV;
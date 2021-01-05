import React, { Component } from 'react'
import Servicio from '../../Servicio';

/**
 * @name ListaDeProvincias
 * @description Trae la infomación de un archivo JSON en line
 * @param {string} bandera La acción que desea realizar  listarParrafo|null
 * @example 
 * <Provincia metodo=bandera></Provincia>
 */

export default class Provincia extends Component {
    state = {}

    componentDidMount() {
        let provincia = []
        Servicio.get('https://gist.githubusercontent.com/emamut/6626d3dff58598b624a1/raw/f6832d0985d5b40017458840452d4e8f4b0c56b6/provincias.json')
            .then(r => {
                Object.keys(r.data).map(p => {
                    return provincia.push(r.data[p].provincia)
                })
                this.setState({ provincia: provincia })
                return provincia
            })
    }

    listarProvincia = () => {
        let p = null;
        if (this.state.provincia) {
            p = this.state.provincia.map(d => (
                <p key={"prov-"+d}> {d} </p>
            ))
        }
        return p
    }


    render() {
        let p= null;
        switch (this.props.metodo) {
            case "listarParrafo":
                p = this.listarProvincia();
                console.log("entro")
                break;
        
            default:
                break;
        }


        return (
            <div>
                {p}
            </div>
        )
    }
}

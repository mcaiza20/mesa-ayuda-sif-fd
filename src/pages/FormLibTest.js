import React, { Component } from 'react';

import Form from '../UI/Form/Form'

export default class FormLibTest extends Component {
    state = {
        secciones:[{id:1,title:"Datos Generales"},
                   {id:2,title:"SLA"},
                   {id:3,title:"Datos de Equipo"}],
        campos:{
            nombre:{
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Nombre',
                    label: 'Nombre'
                },
                value:'',
                validation: {
                    required: true
                },
                seccion:1
            },
            nombre2:{
                elementType: 'textarea',
                elementConfig: {
                    placeholder: 'Nombre',
                    label: 'Nombre'
                },
                validation: {
                    required: true
                },
                seccion:1
            },
            nombre3:{
                elementType: 'dropDown',
                elementConfig: {
                    options:[
                        {label: 'New York', value: 'NY'},
                        {label: 'Rome', value: 'RM'},
                        {label: 'London', value: 'LDN'},
                        {label: 'Istanbul', value: 'IST'},
                        {label: 'Paris', value: 'PRS'}
                    ],
                    label: 'Nombre'
                },
                seccion:2
            },
            nombre4:{
                elementType: 'radioButton',
                elementConfig: {
                    options: [
                        "Yes",
                        "No"
                    ],
                    label: 'Nombre'
                },
                validation: {
                    required: true
                },
                seccion:3
            }
        }
    }

    render() {
        return (
            <Form acordeon campos={this.state.campos} secciones={this.state.secciones} axiosLink='https://react-my-burger-2ae91.firebaseio.com/test.json'></Form>
        )
    }
}

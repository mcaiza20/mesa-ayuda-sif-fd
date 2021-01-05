import React, { Component } from 'react';
import Input from '../Input/Input';
import { Button } from 'primereact/button';
import './Form.css';
import axios from '../../Servicio';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import validarCedula from '../../function/Cedula/cedula';
import Alerta from '../Toast/Alerta'
import Axios from 'axios';
import { limpiarLocalStorage } from '../../function/LocalStorage/limpiarLocalStorage';
import BotonRol from '../BotonRol/BotonRol';
// import $ from 'jquery'


/**
 * @name Formulario
 * @param {String} btnTipo tipo de boton 
 * @param {String} btnClase nombre de la clase del css 
 * @param {String} icono.familia nombre de la familia del icono
 * @param {String} icono.icono nombre del icono
 * @param {boolean} disabled activo o desactivo botón
 * @param {Metodo} click accion para cuando hace click
 * @example
 * <Boton btnTipo="icon" btnClase="Success" icono={{familia:'font Awesome',icono:faUser}}> </Boton>
 */

// eslint-disable-next-line no-unused-vars
let campos = {};
// eslint-disable-next-line no-unused-vars
let secciones = [];
// eslint-disable-next-line no-unused-vars
let frmValid = null;

export class Form extends Component {

    constructor() {
        super()
        this.state = {
            formIsValid: false,
            campos: null,
            sugestionFiltro: null,
            valor: 0
        }
        this.completarFiltro = this.completarFiltro.bind(this);
    }

    componentWillReceiveProps() {
        this.setState({ campos: null, formIsValid: false })
        //console.log("campos",this.props.campos)

    }

    completarFiltro(event, dt) {
        // console.log(event)
        setTimeout(() => {
            let results = dt.filter((esp) => {
                if (esp['equipo/producto']) {
                    return esp['equipo/producto'].toLowerCase().match(event.query.toLowerCase());
                } else if (esp['canton']) {
                    return esp['canton'].toLowerCase().match(event.query.toLowerCase());
                } else {
                    return esp.toLowerCase().match(event.query.toLowerCase());
                }
            });
            this.setState({ sugestionFiltro: results });
        }, 250);
    }

    loadCampos() {
      
        //console.log("campos",this.props.campos)
        //console.log("testStorage",JSON.parse(localStorage.getItem('objTabla')));
        let camposObj = {};
        if (!this.props.campos.id) {
            Object.keys(this.props.campos)
                .map(campKey => {
                    let valid = true;
                    let value = this.props.campos[campKey].value ? this.props.campos[campKey].value : '';

                    let validation = {};
                    let seccion = this.props.campos[campKey].seccion ? this.props.campos[campKey].seccion : null;

                    if (this.props.campos[campKey].validation) {
                        if (value === '')
                            valid = false;
                        validation = this.props.campos[campKey].validation;
                    }

                    if (this.props.campos[campKey].elementType === 'dropDown') {
                        if (value === null)
                            value = this.props.campos[campKey].elementConfig.options[0].value;
                    }

                    if (campKey !== 'id') {
                        if (this.props.campos[campKey].elementType !== 'tabla') {
                            camposObj[campKey] = {
                                elementType: this.props.campos[campKey].elementType,
                                elementConfig: {
                                    ...this.props.campos[campKey].elementConfig,
                                    id: "inp-" + campKey
                                },
                                value: value,
                                validation: validation,
                                valid: valid,
                                touched: false,
                                seccion
                            }
                        }
                        else {
                            camposObj[campKey] = {
                                elementType: this.props.campos[campKey].elementType,
                                valid: valid,
                                elementConfig: {
                                    ...this.props.campos[campKey].elementConfig,
                                    id: "inp-" + campKey
                                },
                                seccion,
                                titulo: this.props.campos[campKey].titulo
                            }
                        }
                        return null;
                    } else {
                        // console.log('No se hizo el campo id')
                    }
                    return null
                });
        } else {

            Object.keys(this.props.campos)
                .map(campKey => {
                    let valid = true;
                    let value = this.props.campos[campKey].value ? this.props.campos[campKey].value : '';
                    let validation = {};
                    let seccion = this.props.campos[campKey].seccion ? this.props.campos[campKey].seccion : null;

                    if (this.props.campos[campKey].validation) {
                        if (value === '')
                            valid = false;
                        validation = this.props.campos[campKey].validation;
                    }

                    if (this.props.campos[campKey].elementType === 'dropDown') {
                        // value = this.props.campos[campKey].elementConfig.options[0].value;
                        value = this.props.campos[campKey].value;
                        // console.log(this.props)
                    }

                    if (campKey === 'id' || campKey === 'especialidad') {
                        camposObj[campKey] = {
                            elementType: this.props.campos[campKey].elementType,
                            elementConfig: {
                                ...this.props.campos[campKey].elementConfig,
                                id: "inp-" + campKey, disabled: true
                            },
                            value: value,
                            validation: validation,
                            valid: valid,
                            touched: false,
                            seccion
                        }
                    }
                    else {
                        camposObj[campKey] = {
                            elementType: this.props.campos[campKey].elementType,
                            elementConfig: {
                                ...this.props.campos[campKey].elementConfig,
                                id: "inp-" + campKey
                            },
                            value: value,
                            validation: validation,
                            valid: valid,
                            touched: false,
                            seccion
                        }
                    }
                    return null;
                });
        }

        this.campos = camposObj;

        let formIsValid = true;
        for (const inputId in this.campos) {
            formIsValid = this.campos[inputId].valid && formIsValid;
        }

        this.frmValid = formIsValid;

        if (this.props.acordeon) {
            let seccionesObj = [];

            for (const seccion in this.props.secciones) {
                //console.log(seccion);
                seccionesObj.push({ ...this.props.secciones[seccion], valid: false });
            }
            this.secciones = seccionesObj;
        }
    }

    checkValidity(value, rules, inputID) {
        let isValid = true;

        if (!rules) {
            return true;
        }
        if (rules.required) {
            if (typeof value === "string") {
                isValid = value.trim() !== '' && isValid;
            } else {
                isValid = value !== null && isValid
            }
        }
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }

        if (inputID === 'ci') {
            isValid = validarCedula(value)
        }

        return isValid;
    }

    inputChangeHandler = (event, inputID) => {


        let updatedSecciones;
        let updatedForm;

        if (inputID === 'cantidad real') {

            if (!this.state.campos) {
                this.setState({ valor: Number(this.campos[inputID].value) })
            } else {
                this.setState({ valor: Number(this.state.campos[inputID].value) })
            }

            if (localStorage.getItem('tipo') === 'mas') {
                this.setState({ valor: this.state.valor + 1 })
                limpiarLocalStorage()
                // localStorage.clear()

            } else if (localStorage.getItem('tipo') === 'menos' && inputID === 'cantidad real') {
                if (this.state.valor !== 0) {
                    this.setState({ valor: this.state.valor - 1 })
                    limpiarLocalStorage()
                    // localStorage.clear()
                } else {
                    this.setState({ valor: 0 })
                    limpiarLocalStorage()
                    // localStorage.clear()
                }
            }
        }

        if (!this.state.campos) {
            updatedForm = {
                ...this.campos
            };
            if (this.props.acordeon) {
                updatedSecciones = [
                    ...this.secciones
                ]
            }
        }
        else {
            updatedForm = {
                ...this.state.campos
            };
            if (this.props.acordeon) {
                updatedSecciones = [
                    ...this.state.secciones
                ]
            }
        }

        if (inputID === 'cliente') {
            let contacto = []
            event.value.contacto.map(cont => (
                contacto.push({ label: cont.nombre, value: cont })
            ))
            if (updatedForm.contacto) {
                updatedForm.contacto.elementConfig.options = contacto
                let objAws = {
                    "payload": { "id": event.value.id }
                }
                let url = ' https://i016i9xmzd.execute-api.us-east-1.amazonaws.com/default/listaEquipoCliente'

                Axios.put(url, objAws).then(r => {
                    
                    let newState = Object.assign({}, this.state);
                    let equipos = []
                    equipos = r.data.payload
                    newState.campos.tablaradio.elementConfig.data = equipos
                    this.setState(newState);
                }).catch(err => {
                    console.log(err)
                })
            }
            // let contratos = event.value.contrato
        }


        let updateFormEl = {
            ...updatedForm[inputID]
        };


        if (inputID === 'cantidad real')
            updateFormEl.value = this.state.valor;
        else if (inputID === 'fechas programadas') {
            updateFormEl.value = event.target.value
            updatedForm['mantenimientos'].value = event.target.value.length
        }
        else
            updateFormEl.value = event.target.value;
        //console.log("value",updateFormEl);
        updateFormEl.valid = this.checkValidity(updateFormEl.value, updateFormEl.validation, inputID);
        // console.log("value",updateFormEl);
        updateFormEl.touched = true;
        updatedForm[inputID] = updateFormEl;

        let formIsValid = true;
        for (const inputId in updatedForm) {
            formIsValid = updatedForm[inputId].valid && formIsValid;
        }

        if (this.props.acordeon) {
            for (const seccion in updatedSecciones) {
                let sectionValid = true;
                for (const inputId in updatedForm) {
                    if (updatedForm[inputId].seccion === updatedSecciones[seccion].id)
                        sectionValid = updatedForm[inputId].valid && sectionValid;
                }
                updatedSecciones[seccion].valid = sectionValid;
            }

            this.setState({
                campos: updatedForm, formIsValid: formIsValid,
                secciones: updatedSecciones
            });
        }
        else {
            this.setState({ campos: updatedForm, formIsValid: formIsValid });
        }
    }

    submitHandlerSend = (event) => {

        event.preventDefault();
        let objetoEnviar = {};
        //let contacto = JSON.parse(localStorage.getItem('objTabla'));

        for (const key in this.state.campos) {
            //console.log(this.state.campos[key].value)
            if (this.state.campos[key].elementType === 'tabla' || this.state.campos[key].elementType === 'tabla-radio') {
                debugger
                objetoEnviar[key] = JSON.parse(localStorage.getItem('objTabla'));
                // console.log(objetoEnviar)
            }
            else
                if (this.state.campos[key].elementType === 'tabla-sla') {
                    objetoEnviar[key] = JSON.parse(localStorage.getItem('sla'));
                }
                else {
                    objetoEnviar[key] = this.state.campos[key].value;
                }
        }

        //objetoEnviar.contacto=contacto;

        let objetoAWS = { "operation": this.props.operacion, "tableName": this.props.tabla, "payload": objetoEnviar }

        console.log("objAWS", objetoAWS);

        axios.put(this.props.axiosLink, objetoAWS)
            .then(resp => {
                
                //console.log(resp)
                this.setState({ loading: false });
                //this.props.history.push('/');
                //if (resp.data.HTTPStatusCode) {
                if (resp.data.HTTPStatusCode === 400) {
                    Alerta.error(resp.data.mensaje)
                } else
                    if (JSON.parse(localStorage.getItem('objTabla'))) {
                        if (JSON.parse(localStorage.getItem('objTabla')).length > 0) {
                            // localStorage.removeItem('objTabla');
                            // localStorage.clear();
                            limpiarLocalStorage()
                        }
                    }

                window.location.reload();
            }


            /*}*/)
            .catch(err => {
                console.log(err);
            });

        console.log("funcionaSend", objetoAWS);


    }

    render() {


        if (this.props.campos) {
            this.loadCampos();
        }
        const formElArr = [];
        const sectionArr = [];
        let formValid = null;

        if (!this.state.campos) {
            for (const key in this.campos) {
                formElArr.push({
                    id: key,
                    config: this.campos[key]
                });
            }
            for (const seccion in this.secciones) {
                sectionArr.push({ ...this.secciones[seccion] });
            }
            formValid = this.frmValid;
        }

        else {
            for (const key in this.state.campos) {
                formElArr.push({
                    id: key,
                    config: this.state.campos[key]
                });
            }
            for (const seccion in this.state.secciones) {
                sectionArr.push({ ...this.secciones[seccion] });
            }
            formValid = this.state.formIsValid;
        }

        //console.log(formValid)
        //console.log("elmArr",formElArr)
        let form = null;

        if (!this.props.acordeon) {
            form = (
                <form className='form' onSubmit={this.submitHandlerSend}>
                    <Container>
                        <Row>
                            <Col>
                                {formElArr.map(formEl => {
                                    if(formEl.config.elementConfig.type === "password" && (formEl.config.value === "" || formEl.config.value === null)){
                                        return null
                                    }else{                                         
                                        return <Input key={formEl.id}
                                        elementType={formEl.config.elementType}
                                        elementConfig={formEl.config.elementConfig}
                                        value={formEl.config.value}
                                        invalid={!formEl.config.valid}
                                        shouldValidate={formEl.config.validation}
                                        touched={formEl.config.touched}
                                        sugerencias={this.state.sugestionFiltro}
                                        completar={(e) => this.completarFiltro(e, formEl.config.elementConfig.lista)}
                                        changed={(event) => this.inputChangeHandler(event, formEl.id)} />
                                    }
                                })}
                            </Col>
                        </Row>
                        <Row>
                            <Col></Col>
                        </Row>
                        <Row>
                            <Col></Col>
                            <Col>
                                <BotonRol className='button' etiqueta='Listo' habilitado={!this.state.formIsValid} />
                            </Col>
                            <Col></Col>
                        </Row>
                    </Container>
                </form>
            );
        }
        else {


            form = (
                <form className='form' onSubmit={this.submitHandlerSend}>
                    <Container>
                        <Row>
                            <Col>
                                <Accordion defaultActiveKey={sectionArr[0].id} >
                                    {
                                        sectionArr.map(sectElm => (
                                            <Card key={"card-" + sectElm.title} >
                                                <Card.Header>
                                                    <Accordion.Toggle as={Card.Header} eventKey={sectElm.id}>
                                                        {sectElm.title}
                                                    </Accordion.Toggle>
                                                </Card.Header>
                                                <Accordion.Collapse eventKey={sectElm.id}>
                                                    <Card.Body className='bodyAcordion'>
                                                        {formElArr.map(formEl => {
                                                            let element = null

                                                            if (formEl.config.seccion === sectElm.id) {
                                                                if (formEl.config.elementType === 'calendarRange') {
                                                                    element = (
                                                                        <Input key={formEl.id}
                                                                            className="input"
                                                                            elementType={formEl.config.elementType}
                                                                            elementConfig={formEl.config.elementConfig}
                                                                            value={formEl.config.value}
                                                                            invalid={!formEl.config.valid}
                                                                            shouldValidate={formEl.config.validation}
                                                                            touched={formEl.config.touched}
                                                                            sugerencias={this.state.sugestionFiltro}
                                                                            completar={(e) => this.completarFiltro(e, formEl.config.elementConfig.lista)}
                                                                            changed={(event) => this.inputChangeHandler(event, formEl.id)} />
                                                                    )
                                                                }
                                                                else {
                                                                    element = (
                                                                        <Input key={formEl.id}
                                                                            elementType={formEl.config.elementType}
                                                                            elementConfig={formEl.config.elementConfig}
                                                                            value={formEl.config.value}
                                                                            invalid={!formEl.config.valid}
                                                                            shouldValidate={formEl.config.validation}
                                                                            touched={formEl.config.touched}
                                                                            sugerencias={this.state.sugestionFiltro}
                                                                            completar={(e) => this.completarFiltro(e, formEl.config.elementConfig.lista)}
                                                                            changed={(event) => this.inputChangeHandler(event, formEl.id)} />
                                                                    )
                                                                }

                                                            }
                                                            return element;
                                                        })}
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>
                                        ))
                                    }
                                </Accordion>
                            </Col>
                        </Row>
                        <Row>
                            <Col></Col>
                        </Row>
                        <Row>
                            <Col></Col>
                            <Col>
                                <Button className='button' label='Listo' disabled={!formValid} />
                            </Col>
                            <Col></Col>
                        </Row>
                    </Container>

                </form>
            );
        }

        //console.log("formValid",this.state.formIsValid);

        return (
            <div>
                {form}
            </div>
        )
    }
}

export default Form

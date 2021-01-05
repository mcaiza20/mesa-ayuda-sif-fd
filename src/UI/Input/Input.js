import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import { AutoComplete } from 'primereact/autocomplete';
import './Input.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ImportCSV from '../../UI/ImportCSV/ImportCSV';
import Tabla from '../../UI/Tablas/Tabla/Tabla';
import TablaSLA from '../Tablas/TablaSLA/TablaSLA'
import { Calendar } from 'primereact/calendar';
import Auxiliar from '../../cao/Auxiliar';
import { TextInputField, Position } from 'evergreen-ui'
import Component from "@reactions/component";
import FormHelperText from '@material-ui/core/FormHelperText';
import { Message } from 'primereact/message';
import { Textarea, Tooltip } from 'evergreen-ui'
// import Ordenar from '../../function/Ordenar/Ordenar';
// import { Button } from 'primereact/button';
// import { InputText } from 'primereact/inputtext';
import $ from 'jquery'
import Boton from '../Boton/Boton';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import Password from './Password'

const Input = (propiedades) => {
    let inputEl = null;
    const inputClasses = [];
    let invalido = false;
    let error = null;
    let icono = null
    let iconoDrop = null
    if (propiedades.invalid && propiedades.shouldValidate && propiedades.touched) {
        //console.log("inv")
        //inputClasses.push('invalid');
        invalido = true
        error = 'Campo Requerido'
        icono = <Message id='icono1' severity="warn" />
    }
    if (propiedades.touched && propiedades.shouldValidate && !propiedades.invalid) {
        icono = <Message id='icono2' severity="success" />
        iconoDrop = <Message id='iconoDrop' severity="success" />
    }
    if (propiedades.touched && propiedades.shouldValidate && !propiedades.invalid && propiedades.elementType === 'multi') {
        icono = <Message id='icono3' severity="success" />
        iconoDrop = <Message id='iconoDrop' severity="success" />
    }

    switch (propiedades.elementType) {
        case ('input'):
            if (propiedades.elementConfig.type === 'password') {
                inputEl =
                    <Col>
                        <Tooltip content={propiedades.elementConfig.tooltip} position={Position.RIGHT}>
                            <Password value={propiedades.value}
                                change={propiedades.changed} />
                        </Tooltip>
                    </Col>
            }
            else {
                inputEl =
                    <div>
                        <Col style={{ textTransform: "capitalize" }}>
                            <Tooltip content={propiedades.elementConfig.tooltip} position={Position.RIGHT}>

                                <TextInputField className={inputClasses.join(' ')}
                                    label=''
                                    {...propiedades.elementConfig}
                                    value={propiedades.value}
                                    isInvalid={invalido}
                                    onChange={propiedades.changed}
                                /></Tooltip>{icono}
                            <FormHelperText id="component-error-text">{error}</FormHelperText>
                        </Col>

                    </div>

            }
            ;
            break;
        case ('contador'):


            // eslint-disable-next-line no-unused-vars
            let stock = 0;
            let btn = false


            if (propiedades.value !== 0) {
                stock = propiedades.value
            } else {
                stock = 0
            }

            inputEl =
                <div className='input'>
                    <Col style={{ textTransform: "capitalize" }}>
                        <Component initialState={{ stock: '' }}>
                            {({ state, setState }) => (
                                <Row>
                                    <Boton btnTipo="icon" btnClase="Danger" icono={{ familia: 'font Awesome', icono: faMinus }} click={() => {
                                        //state.stock--
                                        //setState({stock:'menos'})
                                        $('#TextInputField-inp-cantidad real').add('change', propiedades.changed)
                                        state.stock = 'menos'
                                        localStorage.setItem('tipo', state.stock)

                                    }} desactivado={btn}></Boton>
                                    <Tooltip content={propiedades.elementConfig.tooltip} position={Position.RIGHT}>
                                        <TextInputField className={inputClasses.join(' ')}
                                            label=''
                                            {...propiedades.elementConfig}
                                            value={propiedades.value}
                                            isInvalid={invalido}
                                            onChange={propiedades.changed}
                                            onInput={propiedades.changed} disabled
                                        /></Tooltip><FormHelperText id="component-error-text">{error}</FormHelperText>
                                    <Boton btnTipo="icon" btnClase="Success" icono={{ familia: 'font Awesome', icono: faPlus }} click={() => {
                                        //state.stock++
                                        //setState({stock:'mas'})
                                        $('#TextInputField-inp-cantidad real').add('change', propiedades.changed)
                                        state.stock = 'mas'
                                        localStorage.setItem('tipo', state.stock)

                                    }}></Boton>{icono}
                                </Row>
                            )}
                        </Component>
                    </Col>
                </div>;
            break;

        case ('textarea'):
            inputEl =
                <Tooltip content={propiedades.elementConfig.tooltip} position={Position.RIGHT}>
                    <Textarea className={inputClasses.join(' ')}
                        {...propiedades.elementConfig}
                        value={propiedades.value}
                        onChange={propiedades.changed} ></Textarea></Tooltip>;
            break;
        case ('dropDown'):

            inputEl =
                <div>
                        <Dropdown className={inputClasses.join(' ')}
                            value={propiedades.value}
                            {...propiedades.elementConfig}
                            rows={5} cols={30}
                            onChange={propiedades.changed}
                            style={{ marginLeft: '14px', width: '96%' }}
                        />
                    {iconoDrop}
                </div>

            break;
        case ('calendarRange'):
            inputEl =
                <div>
                    <Calendar className={inputClasses.join(' ')}
                        value={propiedades.value}
                        {...propiedades.elementConfig}
                        readOnlyInput
                        onChange={propiedades.changed}
                        dateFormat="yy/mm/dd"
                        monthNavigator={true}
                        yearNavigator={true}
                        // minDate = {new Date()}
                        yearRange="2010:2030"
                        numberOfMonths={1}
                        selectionMode="range"
                        showIcon={true} />{icono}</div>

            break;
        case ('calendarMulti'):
            inputEl =
                <div>
                    <Calendar className={inputClasses.join(' ')}
                        value={propiedades.value}
                        {...propiedades.elementConfig}
                        readOnlyInput
                        onChange={propiedades.changed}
                        dateFormat="yy/mm/dd"
                        monthNavigator={true}
                        yearNavigator={true}
                        // minDate = {new Date()}
                        yearRange="2010:2030"
                        numberOfMonths={2}
                        selectionMode="multiple" />{icono}</div>
            break;
        case ('radioButton'):
            inputEl =
                propiedades.elementConfig.options.map(op => {
                    return (
                        <div key={"div-" + op} className={inputClasses.join(' ')}>
                            <RadioButton
                                inputId={"id-" + op}
                                name={propiedades.elementConfig["id"]}
                                value={op}
                                onChange={propiedades.changed}
                                checked={propiedades.value === op} />
                            <label htmlFor={"id-" + op} className="p-radiobutton-label">{op}</label>
                        </div>)
                })
            break;
        case ('multi'):
            inputEl =
                <div>
                    <AutoComplete className={inputClasses.join(' ')}
                        {...propiedades.elementConfig}
                        value={propiedades.value}
                        suggestions={propiedades.sugerencias}
                        completeMethod={propiedades.completar}
                        dropdown={true}
                        field={propiedades.elementConfig.filtro}
                        onChange={propiedades.changed}
                        style={{ marginLeft: '14px'}} />{icono}
                </div>
            break;
        case ('tabla'):
            let tabla = ''

            // if (JSON.parse(localStorage.getItem('objTabla'))) {
            //     //tabla = <Tabla tipo={this.state.tipo} data={this.state.data} opciones={{ ver: '/home/persona/detalle' }} anadir='true' ></Tabla> 
            //     tabla = <Tabla noMostrar={['id', 'cliente']} titulos={propiedades.elementConfig.titulos? propiedades.elementConfig.titulos : ['nombre','correo', 'telefono', 'nombre usuario', 'clave','rol']}></Tabla> 
            // }else{
            // console.log(propiedades.elementConfig)
            tabla = <ImportCSV form={propiedades.elementConfig} noMostrar={['id', 'cliente']} titulos={propiedades.elementConfig.titulos ? propiedades.elementConfig.titulos : ['nombre', 'correo', 'telefono', 'nombre usuario', 'clave', 'rol']}></ImportCSV>
            // }
            inputEl = tabla;
            break;
        case ('tabla-sla'):
            inputEl =
                <TablaSLA></TablaSLA>
            break;
        case ('tabla-radio'):

            inputEl =
                <Tabla tipo="check" data={propiedades.elementConfig.data} titulos={propiedades.elementConfig.titulos}></Tabla>
            // <Tabla tipo='seleccion' titulos={['test1']} data={['1']}></Tabla>
            break;
        default:
            inputEl =
                <div>
                    <Col style={{ textTransform: "capitalize" }}>
                        <TextInputField className={inputClasses.join(' ')}
                            label=''
                            {...propiedades.elementConfig}
                            value={propiedades.value}
                            isInvalid={invalido}
                            onChange={propiedades.changed}
                        />{icono}
                        <FormHelperText id="component-error-text">{error}</FormHelperText>
                    </Col>
                </div>
    }

    let retorno = null;

    if (propiedades.elementType === 'tabla' || propiedades.elementType === 'tabla-sla' || propiedades.elementType === 'tabla-radio') {
        //console.log("propiedades",propiedades)
        retorno = (
            <Auxiliar>
                <label style={{ marginLeft: '14px' }} className='etiquetas' htmlFor={propiedades.elementConfig['id']}>{propiedades.elementConfig['etiqueta']}</label>
                {inputEl}
            </Auxiliar>
        );
    }
    else {
        //let label = <label htmlFor={propiedades.elementConfig['id']}>{propiedades.elementConfig['label']}</label>
        retorno = (
            <Container>
               { propiedades.shouldValidate.required ?
                 <label className='etiquetas' htmlFor={propiedades.elementConfig['id']}>{propiedades.elementConfig['etiqueta']+' '}
                    <label style={{color:'red'}}>*</label>
                </label>:
                <label className='etiquetas' htmlFor={propiedades.elementConfig['id']}>{propiedades.elementConfig['etiqueta']}</label>
                }
                <Row >
                    {/* <Col style={{textAlign:"left"}} xs={12} md={3}> {label} </Col> */}
                    <Col style={{ textAlign: "left", marginBottom: "0", padding: "0" }} xs={12} md={9}>{inputEl}</Col>
                </Row>
            </Container>
        );
    }

    return (
        retorno
    )
}

export default Input

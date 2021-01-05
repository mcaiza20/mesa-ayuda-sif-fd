import React from 'react'
import './Boton.css'
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Auxiliar from '../../cao/Auxiliar';


/**
 * @description Se crea un botón a partir de unos parámetros, los botones
 * pueden contener iconos arriba e iconos pequeños al lado izquierdo
 * @name ParaMenu
 * @param {String} btnTipo tipo de boton 
 * @param {String} btnClase nombre de la clase del css 
 * @param {String} icono.familia nombre de la familia del icono
 * @param {String} icono.icono nombre del icono
 * @param {String} icono.size nombre de la familia del icono
 * @param {boolean} desactivado activo o desactivo botón
 * @param {Metodo} click accion para cuando hace click
 * @example
 * <Boton btnTipo="Menu" btnClase="Menu" icono={{familia:'font Awesome',icono:faUsers, size:"5x"}}> OLiii </Boton>
 */

/**
 * @name Básico+Icono
 * @param {String} btnTipo tipo de boton 
 * @param {String} btnClase nombre de la clase del css 
 * @param {String} icono.familia nombre de la familia del icono
 * @param {String} icono.icono nombre del icono
 * @param {boolean} desactivado activo o desactivo botón
 * @param {Metodo} click accion para cuando hace click
 * @example
 * <Boton btnTipo="icon" btnClase="Success" icono={{familia:'font Awesome',icono:faUser}}> OLiii </Boton>
 */

/**
 * @name Básico
 * @param {String} btnClase nombre de la clase del css 
 * @param {boolean} desactivado activo o desactivo botón
 * @param {Metodo} click accion para cuando hace click
 * @example
 * <Boton btnClase="Success">Básico</Boton>
 */

const Boton = (propiedades) => {
    let icono = null;
    let btn = null;
    if (propiedades.icono) {
    
        switch (propiedades.icono.familia) {
            
            case 'font Awesome':
                //ENVIAR ICONO COMO OBJETO
                icono = <FontAwesomeIcon icon={propiedades.icono.icono} size={propiedades.icono.size} />
                break;
            case 'url':
                //ENVIAR ICONO COMO TEXTO
                icono = <img style={{ height: propiedades.icono.size }} alt="NO IMAGEN" src={propiedades.icono.url + ""} ></img>
                break;
            case 'path':
                //ENVIAR ICONO COMO OBJETO
                icono = <img style={{ height: propiedades.icono.size }} alt="NO IMAGEN" src={propiedades.icono.url} ></img>
                break;


            default:
                icono = <p>Falta familia del icono</p>
                break;
        }
    }
    switch (propiedades.btnTipo) {
        case 'Menu':
            btn = (
                <Button
                    disabled={propiedades.desactivado}
                    className={[propiedades.btnClase].join(' ')}
                    onClick={propiedades.click}>
                    <Auxiliar>
                        <div>
                            {icono}
                        </div>
                        <div id="titulo">
                            {propiedades.children}
                        </div>
                    </Auxiliar>
                </Button>)
            break;
        case 'icon':
            btn = (
                <Button
                    disabled={propiedades.desactivado}
                    className={[propiedades.btnClase].join(' ')}
                    onClick={propiedades.click}>
                    <Auxiliar>
                        {icono}&nbsp;{propiedades.children}
                    </Auxiliar>
                </Button>)
            break;
        default:
            btn = (
                <Button
                    disabled={propiedades.desactivado}
                    className={[propiedades.btnClase].join(' ')}
                    onClick={propiedades.click}>
                    <Auxiliar>
                        {propiedades.children} 
                    </Auxiliar>
                </Button>)
            break;
    }

    return (
        <div>
            {btn}
        </div>
    )
}

export default Boton
import React from 'react'
import estilos from './Backdrop.module.css'

const Backdrop = (propiedades) => {
    return (
        propiedades.mostrar ?
        <div 
        className={estilos.Backdrop}
        onClick={propiedades.cerrar}>
            
        </div>:
        null
    )
}

export default Backdrop

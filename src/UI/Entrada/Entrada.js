import React from 'react'
import estilos from './Entrada.module.css'

const Entrada = (propiedades) => {
    let inputElemento = null;
    const inputEstilo = [estilos.InputElemento]

    if(propiedades.Invalido && propiedades.shouldValidate && propiedades.seleccionado){
        inputEstilo.push(estilos.Invalido)
    }

    switch (propiedades.elementoTipo) {
        case 'input':
            inputElemento = <input 
                className={inputEstilo.join(' ')} 
                {...propiedades.elementoConfiguracion} 
                value={propiedades.valor}
                onChange={propiedades.cambio}
                />
            break;
        case 'textArea':
            inputElemento =<textarea 
                className={inputEstilo.join(' ')} 
                {...propiedades.elementoConfiguracion} 
                value={propiedades.valor}
                onChange={propiedades.cambio}
                />
            break;    
        case 'select':
            inputElemento =
            <select
                className={inputEstilo.join(' ')} 
                onChange={propiedades.cambio}
                value={propiedades.valor}>
                {propiedades.elementoConfiguracion.opciones.map(o => (
                    <option key={o.value} value={o.value}>
                        {o.displayValue}
                    </option>
                ))} 
            </select>
            break;    
        default:
            inputElemento = <input 
                className={inputEstilo.join(' ')} 
                {...propiedades.elementoConfiguracion} 
                value={propiedades.valor}
                />
            break;
    }

    return (
        <div className={estilos.Input}>
            <label className={estilos.Label}>{propiedades.label} </label>
            {inputElemento}
        </div>
    )
}

export default Entrada

import React from 'react';
import Tabla from '../../../UI/Tablas/Tabla/Tabla';



const ListaClientes = (propiedades) => {
    
    return (
        <Tabla tipo='a' data={propiedades.clientes}></Tabla>
    )
}

export default ListaClientes

import estilos from './Modal.module.css'
import Aux from '../../../hoc/Aux';
import Backdrop from '../Backdrop/Backdrop';

import React, { Component } from 'react'

export default class Modal extends Component {

    shouldComponentUpdate ( nextProps, nextState ) {
        return nextProps.mostrar !== this.props.mostrar || nextProps.children !== this.props.children;
    }
    
    render() {
        return (
            <Aux>
            <Backdrop mostrar={this.props.mostrar} cerrar={this.props.modalCerrar}/>
            <div
                style={{
                    transform: this.props.mostrar ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: this.props.mostrar ? '1' : '0'
                }}
                className={estilos.Modal}>
                {/* <h1>Modal UI</h1> */}
                {this.props.children}
            </div>
        </Aux>
        )
    }
}


// const modal = (propiedades) => {
//     return (
//         <Aux>
//             <Backdrop mostrar={propiedades.mostrar} cerrar={propiedades.modalCerrar}/>
//             <div
//                 style={{
//                     transform: propiedades.mostrar ? 'translateY(0)' : 'translateY(-100vh)',
//                     opacity: propiedades.mostrar ? '1' : '0'
//                 }}
//                 className={estilos.Modal}>
//                 {/* <h1>Modal UI</h1> */}
//                 {propiedades.children}
//             </div>
//         </Aux>
//     )
// }

// export default modal

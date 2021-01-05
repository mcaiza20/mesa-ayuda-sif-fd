import React, { Component } from 'react'
import Auxiliar from '../cao/Auxiliar';
// import Menu from '../pages/Menu/Menu';
// import BarraMenu from '../components/BarraMenu/BarraMenu';
// import Reporte from '../pages/Reporte/Reporte';
// import ListaTickets from '../pages/ListaTickets/ListaTickets';
import { RouterGuard } from 'react-router-guard';
import configuracion from '../guard/configuracion';
import Fondo from '../components/Fondo/Fondo'
import Footer from '../components/Footer/Footer';


export default class Layout extends Component {



  render() {
    return (
      <Auxiliar>
      
        <Fondo/>
        <RouterGuard config={configuracion} />
        <Footer/>
      </Auxiliar>
    )
  }
}

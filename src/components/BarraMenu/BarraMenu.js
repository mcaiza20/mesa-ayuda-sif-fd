import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { Link } from "react-router-guard";
import Auxiliar from '../../cao/Auxiliar';
import logo from '../../assets/images/sifuturo-sin-fondo.png'
// import Boton from '../../UI/Boton/Boton';

/**
 * @description Un menú de bootstrap
 * @name Menu
 * @param log si el usuario esta logueado
 * @param { [Object,Object,Object] } ventanas los link's de las ventanas se genera con un arreglo de objetos
 * el cual debe tener "code", "label", "url" y "mostrar"
 * @param {String} ventanas.code código de identificación
 * @param {String} ventanas.label el nombre que se mostrará
 * @param {String} ventanas.url la dirección o path para redirigir la página
 * @param {boolean} ventanas.mostrar inicialmente se muestra las ventanas cuando el usuario esta deslogueado
 * @param { [Object,Object,Object] } botones son los botones de login y logout
 * @param {String} botones.code código de identificación
 * @param {String} botones.label el nombre que se mostrará
 * @param {String} botones.icono imagen que tendra el botón
 * @param {String} botones.clases colores del botón
 * @param {boolean} botones.mostrar inicialmente se muestra los botones cuando el usuario esta deslogueado
 * @param { Object } nav los colores y forma del nav
 * @param {String} nav.{propiedadesCSS} son por default de CSS
 * @param {String} posicion la posición del nav top|bottom
 * @param { Object } letras los colores de las letras
 * @param {String} letras.{propiedadesCSS} son por default de CSS
 * @method log() cambia los links q se van a mostrar y el botón
 */

export default class BarraMenu extends Component {
  // state = {
  //   log: false,
  //   ventanas: [
  //     { code: "v-001", label: "Primero", url: "/", mostrar: true },
  //     { code: "v-002", label: "Segundo", url: "/", mostrar: false },
  //     { code: "v-003", label: "Tercero", url: "/", mostrar: false },
  //   ],
  //   botones: [
  //     { code: "b-001", label: "Login", icono: null, mostrar: true, clases: "Success" },
  //     { code: "b-002", label: "LogOut", icono: null, mostrar: false, clases: "Danger" },
  //   ],
  //   nav: {
  //     backgroundColor: " #808b96 ",
  //     fontSize: "larger",
  //     position: "inherit"
  //   },
  //   letras: {
  //     color: "black"
  //   },
  //   posicion: "top"
  // }


  log = (parametros) => {
    // let ventanasNueva;
    // let botonesNuevo;

    // if (!this.state.log) {
    //   ventanasNueva = [
    //     { code: "v-001", label: "Primero", url: "/", mostrar: true },
    //     { code: "v-002", label: "Segundo", url: "/", mostrar: true },
    //     { code: "v-003", label: "Tercero", url: "/", mostrar: true },
    //   ]
    //   botonesNuevo = [
    //     { code: "b-001", label: "Login", icono: null, mostrar: false, clases: "Success" },
    //     { code: "b-002", label: "LogOut", icono: null, mostrar: true, clases: "Danger" },
    //   ]
    // } else {
    //   ventanasNueva = [
    //     { code: "v-001", label: "Primero", url: "/", mostrar: true },
    //     { code: "v-002", label: "Segundo", url: "/", mostrar: false },
    //     { code: "v-003", label: "Tercero", url: "/", mostrar: false },
    //   ]
    //   botonesNuevo = [
    //     { code: "b-001", label: "Login", icono: null, mostrar: true, clases: "Success" },
    //     { code: "b-002", label: "LogOut", icono: null, mostrar: false, clases: "Danger" },
    //   ]
    // }
    // this.setState({ botones: botonesNuevo })
    // this.setState({ log: !this.state.log })
    // this.setState({ ventanas: ventanasNueva });
  }

  render() {
    const tabla = {
      nav: {
        backgroundColor: " #808b96 ",
        fontSize: "larger",
        position: "inherit"
      }
    }
    const link = {
      letras:{
        color: "black",
        marginInline: '20px',
      }
    }
    return (
      <Auxiliar>
        <Navbar expand="md" style={tabla.nav} fixed="top" collapseOnSelect>
          <Navbar.Brand href="/home">
            <img
              src={logo}
              width="90"
              height="50"
              alt="Logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Link to="/home/menu" style={link.letras}>Home</Link>
              <Link to="/home/ticket" style={link.letras}>Ticket</Link>
            </Nav>
            <div className="mr-sm-2">
              Botones
        </div>
          </Navbar.Collapse>
        </Navbar>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        {this.props.children}
      </Auxiliar>
      // <Auxiliar>
      //   <Navbar style={this.state.nav} fixed={this.state.posicion} collapseOnSelect expand="md">
      //     <Navbar.Brand href="/home">
      //       <img
      //         src={logo}
      //         width="90"
      //         height="50"
      //         alt="Logo"
      //       />
      //     </Navbar.Brand>
      //     <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      //     <Navbar.Collapse id="responsive-navbar-nav">
      //       <Nav className="mr-auto">
      //         {this.state.ventanas.map(v => {
      //           if (v.mostrar) {
      //             return <Nav.Link key={v.code} style={this.state.letras} href={v.url}> {v.label} </Nav.Link>
      //           } else
      //             return null
      //         })}
      //       </Nav>
      //       <div className="mr-sm-2">
      //         {this.state.botones.map(b => {
      //           if (b.mostrar) {
      //             return <Auxiliar key={b.code}>
      //               <Boton click={this.log} btnClase={b.clases}> {b.label} </Boton> &nbsp;&nbsp;
      //           </Auxiliar>
      //           } else
      //             return null
      //         })}
      //       </div>
      //     </Navbar.Collapse>
      //   </Navbar>
      //   {this.props.children}
      // </Auxiliar>
    )
  }
}

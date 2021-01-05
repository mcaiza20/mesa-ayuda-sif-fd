import React, { Component } from "react";
import { MDBNavbar, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBNavbarBrand} from "mdbreact";
import Auxiliar from './../../cao/Auxiliar'
import estilos from './BarraMenuMDB.module.css'
import logo from '../../assets/images/SIFUTUROLOGO.png'
import { Auth } from 'aws-amplify';
import { limpiarLocalStorage } from '../../function/LocalStorage/limpiarLocalStorage';
import conf from '../../data/configuracion.json'
import aes256 from 'aes256'


class BarraMenuMDB  extends Component {

  constructor(propiedades) {
    super(propiedades)
    this.state = {
      rol:null,
      isOpen: false,
      isOpenInfo: false,
    }

  }
  componentWillMount(){
    try {
        let decryptedString = JSON.parse(aes256.decrypt(conf.KEYLOCALSTORAGE, localStorage.getItem(conf.USUARIOLOCAL)));
        this.state.rol = decryptedString.usuarioAWS.attributes['custom:rol']
    } catch (error) {

    }
  }
  componentDidMount() {
    window.addEventListener('scroll', this.controlarMover);
    var btnContainer = document.getElementById("nav");
    var btns = btnContainer.getElementsByClassName(estilos.boton_menu);
   
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName(estilos.boton_menu_active);
        
        if (current.length > 0) {
          current[0].className = current[0].className.replace(estilos.boton_menu_active, estilos.boton_menu);
        }

        this.className = estilos.boton_menu_active;
      });
    }
  }
  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen, isOpenInfo: false });
  }
  toggleCollapse2 = () => {
    this.setState({ isOpenInfo: !this.state.isOpenInfo, isOpen: false });
  }
  controlarMover = () => {
    this.setState({ isOpen: false, isOpenInfo: false })
  }

  logout = async event => {
    event.preventDefault();
    try {
      await Auth.signOut();
      localStorage.removeItem('usuario')
      sessionStorage.removeItem('usuario')
      limpiarLocalStorage()
      localStorage.clear()  
      this.props.history.push("/");
    } catch (error) {
      console.log(error.message);
    }
  }

  go = ruta =>{
    this.props.history.push(ruta)
  }

  controlarMover = () => {
    this.setState({ isOpen: false, isOpenInfo: false })
  }

  render() {
    return (
      <Auxiliar>
       
        <MDBNavbar color="grey lighten-1" dark expand="md" scrolling fixed="top" style={{ position: 'inherit', height: '50px', marginBottom :'2%' }}>
          <MDBNavbarToggler onClick={this.toggleCollapse} />
          <MDBNavbarBrand href="#" className={estilos.mini_brand}>
            
          </MDBNavbarBrand>
          <MDBNavbarToggler image="https://mdbootstrap.com/img/svg/hamburger8.svg?color=fff" onClick={this.toggleCollapse2} />
          <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar className={estilos.collapse} >
            <MDBNavbarNav left className={estilos.menu_cuerpo} id='nav' >
               <MDBNavItem style={{paddingTop: '2.3%'}} >
               <img src={logo} width="90" height="40" alt="Logo SiFuturo"></img>
              </MDBNavItem>
              <MDBNavItem >
                <MDBNavLink to="/home" onClick={this.controlarMover}><button onClick={()=>this.go("/home/menu")} className={estilos.boton_menu}>HOME</button></MDBNavLink>
              </MDBNavItem>
              <MDBNavItem >
                <MDBNavLink to="/home/ticket" onClick={this.controlarMover}><button onClick={()=>this.go("/home/ticket")}  className={estilos.boton_menu}>TICKET</button></MDBNavLink>
              </MDBNavItem>
              {this.state.rol === "personal" ?
                <MDBNavItem >
                  <MDBNavLink to="/home/mantenimientos" onClick={this.controlarMover}><button onClick={() => this.go("/home/mantenimientos")} className={estilos.boton_menu}>Mantenimientos</button></MDBNavLink>
                </MDBNavItem> : null}              
              </MDBNavbarNav>
              <MDBNavbarNav right>
              <MDBNavItem>
                  <MDBNavLink to="/"><button className={estilos.botonLogout} type="button" onClick={this.logout}>Cerrar Sesión</button></MDBNavLink>
              </MDBNavItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBNavbar>
        {this.props.children}
      </Auxiliar>
    );
  }
}

export default BarraMenuMDB;
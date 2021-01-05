/* eslint-disable no-restricted-globals */
import React, { Component } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; 
import esLocale from '@fullcalendar/core/locales/es';
import listPlugin from '@fullcalendar/list';
import './Mantenimientos.module.css'
import { Container } from '@material-ui/core';
import Axios from 'axios';


class Mantenimientos extends Component {

    calendarComponentRef = React.createRef();
  
    state = {
        calendarWeekends: true,
        calendarEvents: [],
    };

      componentWillMount(){
          let fechas=[]
          Axios.get('https://x7t3agyvv3.execute-api.us-east-1.amazonaws.com/default/mantenimientosProgramados').then(respuesta=>{
            //console.log(respuesta.data.payload)
            respuesta.data.payload.map(r=>{   
               let titulo=   r.cliente.nombre +' '+ r.contrato['número de contrato']
               r.contrato['fechas programadas'].map(dias=>{
                let ms = new Date(dias).getTime(); 
                let id = r.contrato.id+'/'+ms    
                fechas.push({id: id, title: titulo , start: dias, color: r.cliente.color, date:ms})    
                return dias
               })    
             return r             
          })

          fechas.push({start: '2000-01-01',end: new Date(),overlap: false,rendering: 'background',color: 'red'})
          this.setState({calendarEvents: fechas})
          //console.log(fechas)
      })
    }

    actualizarFecha(event){

      let objAWS={
          operation:'actualizarMantenimiento',
          payload:{
            id:'',
            'fechas programadas':[]
          }
      };

      let newState = Object.assign({}, this.state)
       
      newState.calendarEvents.map(r=>{     
            if(r.title===event.event.title ){
              if(r.id===event.event.id){
                r.start = event.event.start
                objAWS.payload['fechas programadas'].push(event.event.start)
              }else{
              objAWS.payload.id= r.id.substring(0, 11)
              objAWS.payload['fechas programadas'].push(r.start)
              }
            }
            return r
        })
        //console.log(objAWS)
        Axios.put('https://0utuqhew54.execute-api.us-east-1.amazonaws.com/default/crudContrato', objAWS)
        .then(r=>{

          this.setState(newState)
          //console.log(this.state)
        })
    }


    render() {
       
        return (
            <Container>
                <FullCalendar
                  locale={esLocale}  
                  defaultView="dayGridMonth"
                  header={{
                    left: "prev,next, today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
                  }}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                  ref={this.calendarComponentRef}
                  weekends={this.state.calendarWeekends}
                  events={this.state.calendarEvents}
                  dateClick={this.handleDateClick}
                  editable
                  eventResizableFromStart
                  eventDrop={(event)=>this.actualizarFecha(event)
                    //console.log("Event Drop", this.state.calendarEvents)
                  }
                  
                  //hiddenDays={[0,6]} Ocultar S y D
                />
          </Container>
          );
    }
    // Agregar nuevos Mantenimientos
    // handleDateClick = (arg) => {
    //     if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
    //       this.setState({  // add new event data
    //         calendarEvents: this.state.calendarEvents.concat({ // creates a new array
    //           title: 'New Event',
    //           start: arg.date,
    //           allDay: arg.allDay
    //         })
    //       })
    //     }
    //   }

}

export default Mantenimientos;


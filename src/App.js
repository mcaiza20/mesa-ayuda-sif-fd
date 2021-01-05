import React from 'react';
import './App.css';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Layout from './layout/Layout';
import { BrowserRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import 'antd/dist/antd.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/list/main.css"
import 'bootstrap/dist/css/bootstrap.css';



function App() {

  return (
    <div >
      <BrowserRouter basename={`${process.env.PUBLIC_URL}/`} >
      <Layout/>
      </BrowserRouter>
    </div>
  );
}

export default App;

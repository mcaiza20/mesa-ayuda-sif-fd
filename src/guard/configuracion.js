import { dynamicWrapper } from 'react-router-guard';
import { Auth, AuthLogin, RestringirCliente } from './index'

export default[
    {
        path: '/calificacion/:valor',
        component: dynamicWrapper(() => import('../pages/Calificacion/Calificacion')),
    },
    {
        path: '/login',
        exact: true,
        canActivate: [AuthLogin],
        component: dynamicWrapper(() => import('../pages/Login/Login')),
    },
    {
        path: '/home',
        canActivate: [Auth],
        component: dynamicWrapper(() => import('../components/BarraMenuMDB/BarraMenuMDB')),
        routes:[
            {
                path:'/home/',
                canActivate: [Auth],
                redirect:"/home/menu/"
            },
            {
                path:'/home/menu/',
                canActivate: [Auth],
                exact: true,
                component: dynamicWrapper(() => import('../pages/Menu/Menu')),
            },
            {
                path:'/home/mantenimientos/',
                canActivate: [Auth, RestringirCliente],
                exact: true,
                component: dynamicWrapper(() => import('../pages/Mantenimientos/Mantenimientos')),
            }, 
            {
                path: '/home/perfil/contratos',
                canActivate: [Auth],
                component: dynamicWrapper(() => import('../pages/PerfilCliente/ContratoDetalle')),
            },
            {
                path: '/home/perfil/',
                canActivate: [Auth],
                component: dynamicWrapper(() => import('../pages/PerfilCliente/PerfilCliente')),
            },
            {
                path: '/home/cliente/detalle',
                canActivate: [Auth, RestringirCliente],
                component: dynamicWrapper(() => import('../pages/Cliente/ClienteDetalle')),
            },
            {
                path: '/home/cliente/contratos',
                canActivate: [Auth, RestringirCliente],
                component: dynamicWrapper(() => import('../pages/Cliente/ClienteContratos')),
            },
            {
                path:'/home/cliente',
                canActivate: [Auth, RestringirCliente],
                component: dynamicWrapper(() => import('../pages/Cliente/ClientesPage')),
            },
            {
                path: '/home/repuesto',
                canActivate: [Auth, RestringirCliente],
                component: dynamicWrapper(() => import('../pages/Inventario/Inventario')),
            },
            //#region PersonalTecnico
            {
                path: '/home/persona/detalle',
                canActivate: [Auth, RestringirCliente],
                component: dynamicWrapper(() => import('../pages/Personal/Detalle')),
            },
            {
                path: '/home/persona',
                canActivate: [Auth, RestringirCliente],
                component: dynamicWrapper(() => import('../pages/Personal/Personal')),
            },
            //#endregion PersonalTecnico
            //#region Especialidad
            {
                path: '/home/especialidad/detalle',
                canActivate: [Auth, RestringirCliente],
                component: dynamicWrapper(() => import('../pages/Especialidad/Detalle')),
            },
            {
                path: '/home/especialidad',
                canActivate: [Auth, RestringirCliente],
                component: dynamicWrapper(() => import('../pages/Especialidad/Especialidad')),
            },
            //#endregion Especialidad
            {
                path: '/home/contrato',
                canActivate: [Auth, RestringirCliente],
                component: dynamicWrapper(() => import('../pages/Contrato/Contrato')),
            },
            {
                path: '/home/ticket/detalle',
                canActivate: [Auth, RestringirCliente, ],
                component: dynamicWrapper(() => import('../pages/Ticket/DetalleTicket/DetalleTicket')),
            },
            {
                path: '/home/ticket/generar',
                canActivate: [Auth,],
                component: dynamicWrapper(() => import('../pages/Ticket/GenerarTicket/GenerarTicket')),
            },
            {
                path: '/home/ticket',
                canActivate: [Auth,],
                component: dynamicWrapper(() => import('../pages/Ticket/Ticket')),
            },
            {
                path: '/home/reporte',
                canActivate: [Auth, RestringirCliente],
                component: dynamicWrapper(() => import('../pages/Reporte/Reporte')),
            },
            {
                path: '/home/:valor',
                canActivate: [Auth],
                redirect:'/home/menu'
            },
            {
                path:'/home/menu/:valor',
                canActivate: [Auth],
                redirect:'/home/menu/'
            },
        ]
    },
    {
        path: '/:valor',
        redirect: '/login',
    },
    {
        path: '/login/:valor',
        redirect: '/login',
    },
     {
        path: '/',
        redirect: '/login',
    },
  ];
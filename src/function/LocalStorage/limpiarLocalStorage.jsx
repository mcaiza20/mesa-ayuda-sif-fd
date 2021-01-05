//Esta función limpia el local storage sin borrar el local storage del cognito

//Se debe poner todos los localstorage que se van a ocupar
export const limpiarLocalStorage = () => {

    localStorage.removeItem("seleccionado")
    localStorage.removeItem("objTablaCliente")
    localStorage.removeItem("objTablaContrato")
    localStorage.removeItem("accion")
    localStorage.removeItem("tipo")
    localStorage.removeItem("sla")
    localStorage.removeItem("nuevoSeleccionado")
    localStorage.removeItem("cantidad")

    return (
        true
    )
}

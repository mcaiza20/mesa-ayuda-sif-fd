import Axios from "axios";

const Servicio = Axios.create({
    baseURL: ''
});

export default Servicio;
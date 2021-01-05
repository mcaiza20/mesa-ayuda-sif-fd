import conf from '../data/configuracion.json'
import aes256 from 'aes256'

export default function RestringirPersonalVentas() {
  return new Promise((resolve, reject) => {
    try {
      let usuario = JSON.parse(aes256.decrypt(conf.KEYLOCALSTORAGE, localStorage.getItem(conf.USUARIOLOCAL)));
      //let usuario = JSON.parse(localStorage.getItem("usuario"))
      if (usuario.usuarioAWS.attributes['custom:rol'] === "personal" 
          && (usuario.usuarioDynamoDB.rol === "tecnico" || usuario.usuarioDynamoDB.rol === "administrador"))
        return resolve()
      else
        return reject(new Error('/home/menu/'));
    } catch{
      return reject(new Error('/home/menu/'));
    }
  })
}
import conf from '../data/configuracion.json'
import aes256 from 'aes256'

export default function RestringirCliente() {
  return new Promise((resolve, reject) => {
    try {
      let usuario = JSON.parse(aes256.decrypt(conf.KEYLOCALSTORAGE, localStorage.getItem(conf.USUARIOLOCAL)));
      //let usuario = JSON.parse(localStorage.getItem("usuario"))
      if(usuario.usuarioAWS.attributes['custom:rol'] === "cliente"){
        return reject(new Error('/home/menu/'));
      }
      else if (usuario.usuarioAWS.attributes['custom:rol'] === "personal")
        return resolve()
      else
        return reject(new Error('/home/menu/'));
    } catch{
      return reject(new Error('/home/menu/'));
    }
  })
}
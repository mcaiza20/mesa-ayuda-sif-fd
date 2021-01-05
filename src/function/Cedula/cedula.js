const validarCedula = (input) => {
    let cedula = input.trim();
    let total = 0;
    let longitud = cedula.length;
    let longcheck = longitud - 1;

    if (cedula !== "" && longitud === 10) {
        for (let i = 0; i < longcheck; i++) {
            if (i % 2 === 0) {
                var aux = cedula.charAt(i) * 2;
                if (aux > 9) aux -= 9;
                total += aux;
            } else {
                total += parseInt(cedula.charAt(i)); // parseInt o concatenará en lugar de sumar
            }
        }

        total = total % 10 ? 10 - total % 10 : 0;
        // no poner los 3 iguales
        if (parseInt(cedula.charAt(longitud - 1)) === parseInt(total)){
            // document.getElementById("salida").innerHTML = ("Cedula Válida");
            return true
        } else {
            // document.getElementById("salida").innerHTML = ("Cedula Inválida");
            return false
        }
    }
    else{
        return false
    }
}

export default validarCedula

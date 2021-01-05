const Ordenar = (arrayDesordenado) => {


    const orden=['id','razon social', 'ruc','país','provincia o estado','dirección', 'ciudad','ubicación','ubicacion', 'tipo',
                 "ci","nombre", "apellido", "correo", 'correo 1', 'correo 2', 'teléfono 1', 'teléfono 2',"telefono", "teléfono", 'nombre usuario', "clave", "rol",'especialidad', "titulo","título",  'especialidad hardware', 
                 'especialidad software', 'especialidad consultoria',
                 "item","cantidad real","descripción repuesto","n°Serie",'marca','modelo','serie','descripción',
                 "descripcion",'equipo/producto', 'estado',"P/N o feature","ubicación física","reservado","proveedor","fecha adquisición","precio unitario","precio total","cantidad saliente","observaciones",
                 "número de contrato","cliente","personal ventas","duración contrato","mantenimientos","técnico preferencial","equipo","SLA", "mayorista",
                 "sla mayorista", 'sla al cliente','fecha inicio', 'técnico asignado','PAÍS','PROVINCIA (ESTADO)', 'CIUDAD','DIRECCIÓN', 'TIPO', 'MODELO', 'SERIE', 'MARCA',
                 
                 'DESCRIPCIÓN', 'ESTADO','MAYORISTA','SLA MAYORISTA','SLA AL CLIENTE'
                ]
    let item;
    let arrayOrdenado=[]

    orden.map(r=>{
        item = arrayDesordenado.find(o=>o===r)
        if(item!==undefined) {
            arrayOrdenado.push(item)
        }
       
        return arrayOrdenado
    })
    
    return ( arrayOrdenado )
}

export default Ordenar

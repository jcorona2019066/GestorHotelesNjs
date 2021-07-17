'use strict'

var Usuario = require('../modelos/usuario.model')
var Habitaciones = require('../modelos/habitaciones.model')
var Reservacion = require('../modelos/reservaciones.model')
var Hotel = require('../modelos/hoteles.model')


function todosUsuarios(req, rest) {
    
   /* if(req.user.rol != "ADMINAPP"){
        return rest.status(500).send({message:"No puede tiene los permisos para ver todos los usuarios"})
    }*/
    Usuario.find({}).exec((err, usuariosEncontrados) => {
        if(err) return rest.status(500).send({message:"Error al pedir la peticion de ver usuarios"})
        if(!usuariosEncontrados) return rest.status(500).send({message:"No se pudo encontrar a los usuarios"})
        if(usuariosEncontrados) return rest.status(200).send({usuariosEncontrados})
    })

}

function reservacionesHotel(req, rest){
    var idHotel = req.params.id

    if(req.user.rol != "ADMINAPP"){
        return rest.status(500).send({message:"No puede tiene los permisos para ver todos los usuarios"})
    }
    Habitaciones.find({hotel:idHotel}).exec((err, habitacionEncontrada)=>{
        if(err) return rest.status(500).send({message:"Error en la peticion"})
        if(!habitacionEncontrada) return rest.status(500).send({mensaje:"No se pudo encontrar la habitacion"})

        Reservacion.find({habitacion: habitacionEncontrada}).populate({path:"habitacion", select:"hotel"})
        .exec((err, reservacionEncontrada)=>{
            if(err) return rest.status(500).send({message:"Error en la peticion"})
            if(!reservacionEncontrada) return rest.status(500).send({mensaje:"No se pudo encontrar la reservacion"})
            if(reservacionEncontrada) return rest.status(200).send({reservacionEncontrada})
        })
    })
}

function hotelMasSolicitado(req, rest) {

    if(req.user.rol != "ADMINAPP"){
        return rest.status(500).send({message:"No puede tiene los permisos para ver todos los usuarios"})
    }
    Hotel.find({
        hospedados:{$gt: 2}
    
    }).sort({hospedados:-1}).limit(5).exec((err, hotelesMasVendidos)=>{
        if(err) return rest.status(500).send({message:"Error en la peticion"})
        if(!hotelesMasVendidos) return rest.status(500).send({mensaje:"No se pudo encontrar los hoteles"})
        if(hotelesMasVendidos) return rest.status(200).send({hotelesMasVendidos})
    })
        
    
}


module.exports ={
    todosUsuarios,
    reservacionesHotel,
    hotelMasSolicitado
}
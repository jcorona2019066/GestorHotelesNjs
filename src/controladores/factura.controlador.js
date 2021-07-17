'use strict'

var Usuario = require('../modelos/usuario.model');
var Hotel = require('../modelos/hoteles.model')
var Habitaciones = require('../modelos/habitaciones.model')
var Reservacion = require('../modelos/reservaciones.model')
var Evento = require('../modelos/eventos.model')
var Servicios = require('../modelos/servicios.model')
var Factura = require('../modelos/facturas.model')

function factura(req, res){
    var idUsuario = req.params.id
    var facturaM = new Factura()

    if(req.user.rol != "ADMINHOTEL"){
        return res.status(500).send({mensaje:"No puede generar una factura"})
    }
    Reservacion.find({usuario:idUsuario}).exec((err,reservacionEncontrada)=>{
        if(err) return res.status(err).send({mensaje:"Error en la peticion"})
        if(!reservacionEncontrada) return res.status(500).send({mensaje:"No se encontro la reservacion"})
        if(reservacionEncontrada){
            facturaM.reservacion = reservacionEncontrada[0]._id
          //  facturaM.total = reservacionEncontrada[3]

            Servicios.find({usuario:idUsuario})/*.populate({path:"habitacion", select:"hotel"})*/.exec((err,serviciosEncontrados)=>{
                if(err) return res.status(err).send({mensaje:"Error en la peticion"})
                if(!serviciosEncontrados) return res.status(500).send({mensaje:"No se encontro la reservacion"})

                facturaM.servicios = serviciosEncontrados
            })
            facturaM.save((err,facturaGuardada)=>{
                if(err) return res.status(err).send({mensaje:"Error en la peticion"})
                if(!facturaGuardada) return res.status(500).send({mensaje:"No se guardo la factura con los datos"})

                if(facturaGuardada) return res.status(200).send({facturaGuardada})
            })
        }

        
    })
}






module.exports={
    factura,
}
'use strict'

var Servicios = require('../modelos/servicios.model')
var Usuario = require('../modelos/usuario.model')
var Habitacion = require('../modelos/habitaciones.model')

function servicios (req, res) {
    var params = req.body
    var servicioM = new Servicios()
    //var idHabitacion = req.params.id

    if(req.user.rol != "ADMINHOTEL"){
        return res.status(500).send({ mensaje: "No puede crear un servicio para ofrecer en el hotel"})
    }
    if(params.nombre && params.precio){
        servicioM.nombre = params.nombre,
        servicioM.precio = params.precio,
        //servicioM.habitacion = idHabitacion,
      //  servicioM.usuario = req.user.sub,

        Servicios.findOne({nombre: params.nombre, precio:params.precio}).exec((err, servicioEncontrado)=>{
            if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
            if(servicioEncontrado){
                return res.status(500).send({ mensaje: "Ya existe ese Servicio"})
            }else{
                servicioM.save((err,servicioGuardado)=>{
                    if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
                    if(!servicioGuardado) return res.status(500).send({ mensaje: "No se guardo el servicio al hotel"})
                    if(servicioGuardado) return res.status(500).send({ servicioGuardado})
                })
            }
        })

    }
}

function pedirServicio(req,res) {
    var idHabitacion = req.params.idHa
    var idServicio = req.params.idServ
    var servicioM = new Servicios()

    if(req.user.rol != "Usuario"){
        return res.status(500).send({ mensaje: "No puede pedir un servicio"})
    }

    Servicios.findOne({ _id:idServicio}).exec((err, servicioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
        if(!servicioEncontrado) return res.status(500).send({ mensaje:"No se pudo pedir el servicio"})
        //if(servicioEncontrado) return res.status(200).send({servicioEncontrado})

      /*  servicioM.save((err,servicioGuardado)=>{
            if(err) return res.status(500).send({mensaje:"Error en la peticion"})
            if(!servicioGuardado) return res.status(500).send({mensaje:"No se pudo guardar el servicio"})*/
        
            Servicios.updateMany({_id:idServicio,},{
                $push:{
                        
                    habitacion: idHabitacion,
                    usuario: req.user.sub,
                }
                
                },
                (err, servicioActualizado) => {
                if(err) return res.status(500).send({mensaje:"Error en la peticion"})
                if(!servicioActualizado) return res.status(500).send({mensaje:"no se actualizo el servicio"})

                if(servicioActualizado) return res.status(200).send({servicioActualizado})

                
                        

            })
        
            
       // })
   
        
   
   
   
   
    })
    
}

function verServicios(req, res) {
    
    Servicios.find({}).exec((err, servicioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
        if(!servicioEncontrado) return res.status(500).send({ mensaje:"No se puede ver los servicios"})
        if(servicioEncontrado) return res.status(200).send({servicioEncontrado})
    })
}

module.exports ={
    servicios,
    pedirServicio,
    verServicios,
}
'use strict'

var Usuario = require('../modelos/usuario.model')
var Hotel = require('../modelos/hoteles.model')
var Habitacion = require('../modelos/habitaciones.model')
var Reservaciones = require('../modelos/reservaciones.model')
var Evento = require('../modelos/eventos.model')

var bcrypt = require('bcrypt-nodejs');
//var jwt = require('../servicios/jwt')


function crearHotel (req, res) {
    var hotelM = new Hotel()
    var params = req.body

    if(req.user.rol !="ADMINHOTEL"){
        return res.status(500).send({ message:"No puede crear un hotel"})
    }

    if(params.nombre && params.direccion) {
        hotelM.nombre = params.nombre,
        hotelM.direccion = params.direccion,
        hotelM.descripcion = params.descripcion,
        hotelM.hospedados = null,

        Hotel.find({nombre:params.nombre, direccion: params.direccion}).exec((err,hotelEncontrado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(hotelEncontrado.length >= 1){
            return res.status(500).send({ mensaje: 'Ya existe el Hotel'})
        }else{
            hotelM.save((err, hotelGuardado) => {
                if(err) return res.status(500).send({ mensaje:"Error al guardar"})
                if(!hotelGuardado) return res.status(500).send({ mensaje: 'no se pudo guardar el hotel'})
                if(hotelGuardado) return res.status(500).send({ hotelGuardado})
            })
        }
        })
    }else{
        return res.status(500).send({ mensaje:"rellene todos los campos necesarios"})
    }
}

function adminHotel (req, res) {
    var UsuarioH = new Usuario();
    var params = req.body;
    var idHotel = req.params.id;

    if(req.user.rol != 'ADMINAPP') {
        return res.status(500).send({ mensaje: 'No puede agregar un administrador de Hotel' })
    }

    if(params.nombres && params.usuario && params.password) {
        UsuarioH.nombres = params.nombres;
        UsuarioH.apellidos = params.apellidos;
        UsuarioH.usuario = params.usuario;
        UsuarioH.edad = params.edad;
        UsuarioH.email = params.email;
        UsuarioH.telefono = params.telefono;
        UsuarioH.rol = "ADMINHOTEL"
        UsuarioH.imagen = null;
        UsuarioH.hotel = idHotel;
    }

    Usuario.findOne({hotel: idHotel}).exec((err,hotelEncontrado)=>{
        if(err) return res.status(500).send({ mensaje:"Error al buscar el id del hotel"})
        if(hotelEncontrado){return res.status(500).send({ mensaje:"No se puede agregar ya existe un usuario en ese hotel"})
        } 
       /* Usuario.findOne({

                email: UsuarioH.email
 
        }).exec((err, usuarioHEncontrado)=>{
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Usuarios' });

            if (usuarioHEncontrado) {
                return res.status(500).send({ mensaje: 'El usuario ya se encuentra utilizado' });
            } */else {
                bcrypt.hash(params.password, null, null, (err, passwordEncriptada) => {
                    UsuarioH.password = passwordEncriptada;

                    UsuarioH.save((err, adminGuardado) => {

                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de crear admin de Hotel' });

                        if (adminGuardado) {
                            res.status(200).send({ adminGuardado })
                        } else {
                            res.status(404).send({ mensaje: 'No se ha podido crear el admin de hotel' })
                        }
                    })
                })
            }
        //})
    })
}

function eliminarHotel(req, res) {
    var idHotel = req.params.id

    if(req.user.rol != 'ADMINHOTEL'){
        return res.status(500).send({ mensaje: 'No puede buscar a un usuario' })
    }
    Hotel.findById({_id:idHotel}).exec((err,hotelEncontrado) => {
        if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
        if(!hotelEncontrado) return res.status(500).send({ mensaje:"No se encontro al hotel"})

        Hotel.findByIdAndDelete({_id:idHotel}).exec((err,hotelEliminado)=>{
            if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
            if(!hotelEliminado) return res.status(500).send({mensaje:"No se pudo eliminarHotel"})
            if(hotelEliminado) return res.status(200).send({hotelEliminado})
        })
    })

}

function editarHotel(req, res){
    var idHotel = req.params.id
    var params = req.body

    if(req.user.rol != 'ADMINHOTEL'){
        return res.status(500).send({ mensaje: 'No puede buscar a un usuario' })
    }
    Hotel.find({
        nombre: params.nombre, 
        direccion: params.direccion,
        descripcion: params.descripcion,

       }).exec((err, hotelEncontrado) => {
       if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
       if (hotelEncontrado.length >= 1) {
           return res.status(500).send({ mensaje: 'El parametro al que desea modificar ya existe ' })
       } else {
           Hotel.findOne({ _id: idHotel }).exec((err, hotelEncontrado) => {
               if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
               if (!hotelEncontrado) return res.status(500).send({ mensaje: 'No existen los datos' });
               Hotel.findByIdAndUpdate(idHotel, params, { new: true }, (err, hotelActualizado) => {
                   if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                   if (!hotelActualizado) return res.status(500).send({ mensaje: 'No se ha podido editar el Hotel' });
                   if (hotelActualizado) return res.status(200).send({ hotelActualizado })
               })
           })
       }
   })
}

function buscarUsuarioH(req, res) {
    var idHotel = req.params.id

    if(req.user.rol != 'ADMINHOTEL'){
        return res.status(500).send({ mensaje: 'No puede buscar a un usuario' })
    }
    Usuario.findOne({hotel:idHotel}).exec((err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if(!usuarioEncontrado) return res.status(500).send({ mensaje: 'No se pudo encontrar al usuario'})
        if(usuarioEncontrado) return res.status(500).send({ usuarioEncontrado})
    })

}

function crearHabitacion(req, res) {
    var params = req.body
    var idHotel = req.params.id
    var habitacionM = new Habitacion()

    if(req.user.rol != "ADMINAPP"){
        return res.status(500).send({ mensaje:"no puede crear una habitacion" })
    }
    if(params.tipo && params.precio && params.nombre){
        habitacionM.nombre = params.nombre,
        habitacionM.tipo = params.tipo,
        habitacionM.precio = params.precio,
        habitacionM.estado = "libre",
        habitacionM.hotel = idHotel,

        Habitacion.findOne({ 
           nombre: params.nombre,tipo: params.tipo, hotel: idHotel,
        }).exec((err,habitacionEncontrada)=>{
            if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
            if (habitacionEncontrada) {
                return res.status(500).send({ mensaje: 'La habitacion ya existe' });
            } else {
                habitacionM.save((err, habitacionGuardada) => {
                    if(err) return res.status(500).send({ mensaje:"Error al guardar"})
                    if(!habitacionGuardada) return res.status(500).send({ mensaje: 'no se pudo guardar la habitacion'})
                    if(habitacionGuardada) return res.status(200).send({ habitacionGuardada})
                })    
            }
        })    
    }
}

function habitacionesDispo(req, res) {
    var idHotel = req.params.id

    if(req.user.rol != "ADMINHOTEL"){
        return res.status(500).send({ mensaje:"no puede visualizar las habitaciones disponibles" })
    }
    Habitacion.find({hotel:idHotel , estado:"libre"}).exec((err, hotelEncontrado) => {
        if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
        if(!hotelEncontrado) return res.status(500).send({ mensaje:"No se pudo encontrar el hotel"}) 
        if(hotelEncontrado) return res.status(200).send({hotelEncontrado})
    })
}

function habitacionId(req, res) {
    var idHabitacion = req.params.id

    Habitacion.findById({_id:idHabitacion}).exec((err, habitacionEncontrada)=>{
        if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
        if(!habitacionEncontrada) return res.status(500).send({ mensaje:"No se encontro la Habitacion"})
        if(habitacionEncontrada) return res.status(200).send({ habitacionEncontrada})
    })
}

function verReservaciones(req, res){

    if(req.user.rol != "ADMINHOTEL"){
        return res.status(500).send({mensaje:"No puede ver las Reservaciones"})
    }
    Reservaciones.find({}).exec((err, reservacionesEncontradas) =>{
        if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
        if(!reservacionesEncontradas) return res.status(500).send({mensaje:"No se pudo encontrar las reservaciones"})
        if(reservacionesEncontradas) return res.status(200).send({reservacionesEncontradas})
    })
}

function cancelarReservacion(req, res) {
    var idReservacion = req.params.id
    var idHabitacion = req.params.idHa

    if(req.user.rol != 'ADMINHOTEL'){
        return res.status(500).send({ mensaje: 'No puede cancelar la Reservacion'})
    }
    Reservaciones.findOne({_id: idReservacion}).exec((err, reservacionesEncontradas)=>{
        if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
        if(!reservacionesEncontradas) return res.status(500).send({mensaje:"No se pudo encontrar las reservaciones"})

        Reservaciones.findByIdAndDelete(idReservacion,(err, reservacionCancelada)=>{
            if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
            if(!reservacionCancelada) return res.status(500).send({ mensaje:"No se pudo cancelar la reservacion"})

                Habitacion.updateOne({_id:idHabitacion},  {
                    $set: {
                        estado: 'Libre'
                    }
                },
                    (err, estadoCambiado)=>{
                    if (err) return res.status(500).send({ mensaje:"Error en la peticion de cambiar estado"})
                    if(!estadoCambiado) return res.status(500).send({mensaje:"No se pudo cambiar el estado"})
                })
            
            if(reservacionCancelada) return res.status(200).send({ reservacionCancelada})
        })
    })
}


function crearEvento(req, res) {
    var eventoM = new Evento()
    var idHotel = req.params.id
    var params = req.body;

    if(req.user.rol != 'ADMINHOTEL'){
        return res.status(500).send({ mensaje:"No puede crear un evento"})
    }
    if(params.nombre && params.fecha){
        eventoM.fecha = params.fecha,
        eventoM.nombre = params.nombre,
        eventoM.hotel = idHotel,

        Evento.find({nombre:params.nombre}).exec((err, eventoEncontrado)=>{
            if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
            if(eventoEncontrado){
                return res.status(500).send({ mensaje:"Ya existe el evento"})
            }else{
                eventoM.save((err, eventoGuardado)=>{
                    if (err) return res.status(500).send({ mensaje:"Error en la peticion"})
                    if(!eventoGuardado) return res.status(500).send({ mensaje:"No se guardo el evento"})
                    if(eventoGuardado) return res.status(500).send({ eventoGuardado})
                })
            }
        })
    }
}


module.exports = {
    adminHotel,
    crearHotel,
    eliminarHotel,
    editarHotel,
    buscarUsuarioH,
    crearHabitacion,
    habitacionesDispo,
    verReservaciones,
    cancelarReservacion,
    crearEvento,
    habitacionId,
}

'use strict'

var Usuario = require('../modelos/usuario.model');
var Hotel = require('../modelos/hoteles.model')
var Habitaciones = require('../modelos/habitaciones.model')
var Reservacion = require('../modelos/reservaciones.model')
var Evento = require('../modelos/eventos.model')
var Servicios = require('../modelos/servicios.model')
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../servicios/jwt');

function adminAplicacion(req, res) {
    var UsuarioM = new Usuario();

    UsuarioM.nombres = 'AdminApp';
    UsuarioM.password = '123';
    UsuarioM.usuario = 'AdminApp'
    UsuarioM.email = 'admin'
    UsuarioM.rol = 'ADMINAPP'

    Usuario.find({
        $or: [
            { nombres: UsuarioM.nombres }
        ]
    }).exec((err, adminEncontrado) => {
        if (err) return console.log('Error al crear el Admin');

        if (adminEncontrado.length >= 1) {
            return console.log("--El admin de la aplicacion ya se creo--")
        } else {
            bcrypt.hash('123', null, null, (err, passwordEncriptada) => {
                UsuarioM.password = passwordEncriptada;
                UsuarioM.save((err, adminGuardado) => {
                    if (err) return console.log('error en la peticion del Admin')
                    if (adminGuardado) {
                        console.log('Admin Creado ')
                    } else {
                        console.log('Error al crear el Admin')
                    }
                })
            })
        }
    })
}

function registrar(req, res) {
    var UsuarioM = new Usuario();
    var params = req.body;
    

    if (params.nombres && params.email && params.password && params.telefono) {
        UsuarioM.nombres = params.nombres;
        UsuarioM.apellidos = params.apellidos;
        UsuarioM.usuario = params.usuario;
        UsuarioM.edad = params.edad;
        UsuarioM.email = params.email;
        UsuarioM.telefono = params.telefono;
        UsuarioM.rol = "Usuario"
        UsuarioM.imagen = null;
        UsuarioM.hotel = null;

        Usuario.find({
            $or: [
                {usuario: UsuarioM.usuario},
                {email: UsuarioM.email},
            ]
        }).exec((err, usuariosEncontrados)=>{
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Usuarios' });

            if (usuariosEncontrados && usuariosEncontrados.length >= 1) {
                return res.status(500).send({ mensaje: 'El usuario ya se encuentra utilizado' });
            } else {
                bcrypt.hash(params.password, null, null, (err, passwordEncriptada) => {
                    UsuarioM.password = passwordEncriptada;

                    UsuarioM.save((err, usuarioGuardado) => {

                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de crear Usuario' });

                        if (usuarioGuardado) {
                            res.status(200).send({ usuarioGuardado })
                        } else {
                            res.status(404).send({ mensaje: 'No se ha podido crear el usuario' })
                        }
                    })
                })
            }
        })

    }
}

function obtenerUsuarioId(req, res) {
    var idUsuario = req.params.id

    
    Usuario.findById({_id:idUsuario}).exec((err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({mensaje:"Error en la peticion"})
        if(!usuarioEncontrado) return res.status(500).send({mensaje:"no se pudo encontrar al usuario"})
        if(usuarioEncontrado) return res.status(200).send({ usuarioEncontrado})
    })
}

function login(req, res) {
    var params = req.body;

    Usuario.findOne({ email: params.email }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (usuarioEncontrado) {
            bcrypt.compare(params.password, usuarioEncontrado.password, (err, passVerificada) => {
                if (passVerificada) {
                    if (params.getToken === 'true') {
                        return res.status(200).send({
                            token: jwt.createToken(usuarioEncontrado)
                        })
                    } else {
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({ usuarioEncontrado });
                    }
                } else {
                    return res.status(500).send({ mensaje: 'No se a identificado el usuario ' });
                }
            })
        } else {
            return res.status(500).send({ mensaje: 'Error al buscar el usuario' });
        }
    })
}

function editarUsuario(req, res) {
    var params = req.body;
    var idUsuario = req.params.id;
    delete params.password;

    if (req.user.rol != 'Usuario') {
        return res.status(500).send({ mensaje: 'No puede eliminar un usuario' })
    }

    Usuario.find({
         nombres: params.nombres, 
         apellidos: params.apellidos,
         usuario: params.usuario,
         edad: params.edad,
         email: params.email,
         telefono: params.telefono,
        }).exec((err, UsuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (UsuarioEncontrado.length >= 1) {
            return res.status(500).send({ mensaje: 'El parametro al que desea modificar ya existe ' })
        } else {
            
                Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioActualizado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!usuarioActualizado) return res.status(500).send({ mensaje: 'No se ha podido editar el usuario' });
                    if (usuarioActualizado) return res.status(200).send({ usuarioActualizado })
                })
            
        }
    })
}

function eliminarUsuario(req, res) {
    var idUsua = req.params.id

    if (req.user.rol != 'Usuario') {
        return res.status(500).send({ mensaje: 'No puede eliminar un usuario' })
    }

    Usuario.findById({ _id: idUsua }).exec((err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'No se han encontrado los datos' })

        Usuario.findByIdAndDelete(idUsua, (err, usuarioEliminado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!usuarioEliminado) return res.status(500).send({ mensaje: 'No se ha podido eliminar el usuario' });
            if (usuarioEliminado) return res.status(200).send({ usuarioEliminado})
        })

    })
}

function mostrarHoteles(req, res){

    Hotel.find({}).exec((err,hotelesEncontrados) => {
        if(err) return res.status(500).send({mensaje:"Error en la peticion"})
        if(!hotelesEncontrados) return res.status(500).send({mensaje:"No se ha podido encontrar los hoteles"})
        if(hotelesEncontrados) return res.status(200).send({hotelesEncontrados})
    })
}

function buscarHotel(req, res) {
    var params = req.body;
    Hotel.find({ $or :[{nombre: params.nombre} , {direccion: params.direccion}] }).exec((err, hotelEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'})
        if (!hotelEncontrado) return res.status(500).send({mensaje:"hotel no encontrado, nombre"})
        if(hotelEncontrado){
            return res.status(200).send({hotelEncontrado})
        } 
    })
}

function buscarHotelId(req, res){
    var idHotel = req.params.id

    Hotel.findById({_id: idHotel}).exec((err, hotelEncontrado)=>{
        if(err) return res.status(500).send({ mensaje:"Error en la peticion "})
        if(!hotelEncontrado) return res.status(500).send({ mensaje:"No se encontro el hotel"})
        if(hotelEncontrado) return res.status(200).send({ hotelEncontrado})
    })
}

function habitacionesHotel(req, res){
    var idHotel = req.params.id

    if(req.user.rol != 'Usuario'){
        return res.status(500).send({ mensaje: 'No puede visualizar las habitaciones por hotel'})
    }
    Habitaciones.find({hotel: idHotel}).exec((err,habitacionesEncontradas) => {
        if(err) return res.status(500).send({mensaje:"Error en la peticion"})
        if(!habitacionesEncontradas) return res.status(500).send({ mensaje:"No se pudo encontrar las habitaciones por hotel"})
        if(habitacionesEncontradas) return res.status(200).send({ habitacionesEncontradas})
    })
}

function reservacion(req, res){
    var params = req.body;
    var idHabitacion = req.params.id;
    var reservacionM =  Reservacion();

    if(req.user.rol != 'Usuario'){
        return res.status(500).send({ mensaje: 'No puede reservar una habitacion'})
    }
    if(params.fechaInicio && params.fechaFinal && params.cantidad && params.precio ){
        reservacionM.fechaInicio = params.fechaInicio;
        reservacionM.fechaFinal = params.fechaFinal;
        reservacionM.precio = params.precio;
        reservacionM.cantidad = params.cantidad;
        reservacionM.habitacion = idHabitacion;
        reservacionM.usuario = req.user.sub;

        Reservacion.findOne({habitacion: idHabitacion}).exec((err,habitacionEncontrada) =>{
            if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
         // if(!habitacionEncontrada) return res.status(500).send({ mensaje:"No se pudo hacer la reservacion"})
            if(habitacionEncontrada){
                return res.status(500).send({ mensaje:"Ya existe la reservacion"})
            }else{
                reservacionM.save((err,reservacionRealizada)=>{
                    if(err) return res.status(500).send({ mensaje:"Error en la peticion de guardar"})
                    if(!reservacionRealizada) return res.status(500).send({ mensaje:"No se pudo hacer la reservacion"})

                    Habitaciones.updateOne({_id:idHabitacion},  {
                        $set: {
                            estado: 'No disponible'
                        }
                    },
                        (err, estadoCambiado)=>{
                        if (err) return res.status(500).send({ mensaje:"Error en la peticion de cambiar estado"})
                        if(!estadoCambiado) return res.status(500).send({mensaje:"No se pudo cambiar el estado"})

                            ////////////////////////////////////////

                            Habitaciones.find({_id:idHabitacion}).exec((err,habitacionEncontrada)=>{
                                if (err) return res.status(500).send({ mensaje:"Error en la peticion de cambiar estado"})
                                if(!habitacionEncontrada) return res.status(500).send({mensaje:"No se encontro la habitacion -2-"})
                            
                                Hotel.find({_id:habitacionEncontrada[0].hotel}).exec((err,hotelEncontrado)=>{
                                    if (err) return res.status(500).send({ mensaje:"Error en la peticion de cambiar estado"})
                                    if(!hotelEncontrado) return res.status(500).send({mensaje:"No se encontro el hotel"})
                                   // console.log('Entro a buscar el hotel')
                                // habitacionEncontrada.hospedados = habitacionEncontrada.hospedados + 1
                                   // contH = contH + 1
        
                                    Hotel.updateOne({_id:hotelEncontrado[0]._id},  {
                                        
                                        $set: {
                                            hospedados: hotelEncontrado[0].hospedados+1,
                                            //descripcion: 'Prueba suma 2'
                                        }

                                   
                                    },
                                        
                                        (err, hospedadosCambiado)=>{
                                        if (err) return res.status(500).send({ mensaje:"Error en la peticion de cambiar hospedados +"})
                                        if(!hospedadosCambiado) return res.status(500).send({mensaje:"No se pudo cambiar los hospedados +"})
                                        //console.log('ya hiso el cambio, eso espero XD')
                                    })
                            })  


                        })

                    
                    
                    })



                    if(reservacionRealizada) return res.status(200).send({ reservacionRealizada})
                })
            }
            
        })
    }
}



function eventosHoteles(req, res) {
    var idHotel = req.params.id

    
    Evento.find({hotel: idHotel}).exec((err, eventoEncontrado) => {
        if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
        if(!eventoEncontrado) return res.status(500).send({ mensaje:"No se encontro ningun evento"})
        if(eventoEncontrado) return res.status(200).send({eventoEncontrado})
    })

}


function historialUsuarioServicios(req, res){
    var idUsuario = req.params.id

    if(req.user.rol != "Usuario"){
        return res.status(500).send({ mensaje:"no puede ver el historial del usuario"})
    }
    Servicios.find({usuario:idUsuario}).exec((err, usuarioEncontrado) => {
        if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
        if(!usuarioEncontrado) return res.status(500).send({ mensaje:"No se encontro al usuario"})
        if(usuarioEncontrado) return res.status(200).send({usuarioEncontrado})
    })

}

function historialUsuarioHoteles(req, res) {
    var idUsuario = req.params.id

    if(req.user.rol != "Usuario"){
        return res.status(500).send({ mensaje:"no puede ver el historial del usuario"})
    }
    Reservacion.find({usuario:idUsuario}).populate({path:"habitacion", select:"hotel"}).exec((err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({mensaje:"Error en la peticion"})
        if(!usuarioEncontrado) return res.status(500).send({mensaje:"No se pudo ver el historial de hoteles"})
        if(usuarioEncontrado) return res.status(200).send({usuarioEncontrado})
    })
}

module.exports ={
    adminAplicacion,
    registrar,
    login,
    editarUsuario,
    eliminarUsuario,
    mostrarHoteles,
    buscarHotel,
    habitacionesHotel,
    reservacion,
    eventosHoteles,
    historialUsuarioServicios,
    historialUsuarioHoteles,
    obtenerUsuarioId,
    buscarHotelId,
}



/*
AdminAPP
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MGE2OWM3YmRhYzQxYTE3YWM4NmE0YzQiLCJub21icmUiOiJBZG1pbkFwcCIsInVzZXJuYW1lI
joiQWRtaW5BcHAiLCJlbWFpbCI6ImFkbWluIiwicm9sIjoiQURNSU5BUFAiLCJpYXQiOjE2MjE1MzE4MTYsImV4cCI6MTYyMjA1MDIxNn0.lKOVpPfjccc0-LCM
sAkqr8PmMbvCitncQ0tq-0jo41w

Usuario  Jairo D  jcorona 123
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MGE2OWQ1ZThmZGI5MTE3NjhiOGEwMjIiLCJub21icmUiOiJKYWlybyBEIiwidXNlcm5hbWUiOiJM
IiwiZW1haWwiOiJqY29yb25hIiwicm9sIjoiVXN1YXJpbyIsImlhdCI6MTYyMTUzMjA1MSwiZXhwIjoxNjIyMDUwNDUxfQ.vI34CEfaJ1JPRhDFo161wG3dFRPuST
nBCru86umNXhE


nombres: 2 correo: 2 password: 22 ADmin Hotel
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MGE5NDYxZDgzNzM0NTA1MzAyY2E0ZTgiLCJub21icmUiOiIyIiwidXNlcm5hbWUiOiIyIiwiZW1haWwiOiIyIiwicm9sIjoiQURNSU5IT1RFTCIsImlhdCI6MTYyMTcxNTg5NSwiZXhwIjoxNjIyMDYxNDk1fQ.vLydQ-T03R3NN8hmFajwLjpzUzSdaTO6Hr-KzDYV10I
*/
'use strict'

var express = require("express");
var usuarioControlador = require("../controladores/usuario.controlador");

var md_autorizacion = require("../middlewares/authenticated");

var api = express.Router();

api.post('/registrar', usuarioControlador.registrar);
api.post("/login", usuarioControlador.login);

api.put('/editarUsuario/:id', md_autorizacion.ensureAuth ,usuarioControlador.editarUsuario);

api.delete('/eliminarUsuario/:id', md_autorizacion.ensureAuth, usuarioControlador.eliminarUsuario);
api.get("/mostrarHoteles",usuarioControlador.mostrarHoteles);
api.get("/buscarHotel",usuarioControlador.buscarHotel);
api.get("/habitacionesHotel/:id",md_autorizacion.ensureAuth, usuarioControlador.habitacionesHotel);

api.post("/reservacion/:id",md_autorizacion.ensureAuth,usuarioControlador.reservacion);

api.get("/eventosHoteles/:id",usuarioControlador.eventosHoteles);

api.get("/serviciosUsuario/:id",md_autorizacion.ensureAuth,usuarioControlador.historialUsuarioServicios);
api.get("/hotelesUsuario/:id",md_autorizacion.ensureAuth,usuarioControlador.historialUsuarioHoteles);

api.get("/obtenerUsuarioId/:id",usuarioControlador.obtenerUsuarioId)
api.get("/buscarHotelId/:id",usuarioControlador.buscarHotelId)


module.exports = api;
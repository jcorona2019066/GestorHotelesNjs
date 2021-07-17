'use strict'

var express = require("express");
var hotelControlador = require("../controladores/hotel.controlador");

var md_autorizacion = require("../middlewares/authenticated");

var api = express.Router();

api.post('/crearAdminHotel/:id',md_autorizacion.ensureAuth, hotelControlador.adminHotel);
api.post('/crearHotel',md_autorizacion.ensureAuth, hotelControlador.crearHotel);
api.delete("/eliminarHotel/:id",md_autorizacion.ensureAuth, hotelControlador.eliminarHotel);
api.put("/editarHotel/:id",md_autorizacion.ensureAuth, hotelControlador.editarHotel);

api.get("/habitacionId/:id", hotelControlador.habitacionId);

api.get("/buscarUsuario/:id",md_autorizacion.ensureAuth, hotelControlador.buscarUsuarioH);

api.post('/crearHabitacion/:id',md_autorizacion.ensureAuth, hotelControlador.crearHabitacion);
api.get("/habitacionesLibres/:id",md_autorizacion.ensureAuth, hotelControlador.habitacionesDispo);
api.get("/verReservaciones",md_autorizacion.ensureAuth, hotelControlador.verReservaciones);
api.delete("/cancelarReservacion/:id/:idHa",md_autorizacion.ensureAuth, hotelControlador.cancelarReservacion);
api.post("/crearEvento/:id",md_autorizacion.ensureAuth, hotelControlador.crearEvento)

module.exports = api;
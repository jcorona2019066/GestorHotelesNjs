'use strict'

var express = require("express");
var adminControlador = require("../controladores/adminApp.controlador");

var md_autorizacion = require("../middlewares/authenticated");

var api = express.Router();

api.get('/todosUsuarios', adminControlador.todosUsuarios);
api.get("/reservacionesHotel/:id",md_autorizacion.ensureAuth, adminControlador.reservacionesHotel);
api.get("/hotelMasSolicitado",md_autorizacion.ensureAuth, adminControlador.hotelMasSolicitado);




module.exports = api;
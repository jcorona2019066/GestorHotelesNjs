'use strict'

var express = require("express");
var servicioControlador = require("../controladores/servicio.controlador");

var md_autorizacion = require("../middlewares/authenticated");

var api = express.Router();

api.post('/servicios',md_autorizacion.ensureAuth, servicioControlador.servicios);
api.get("/pedirServicio/:idHa/:idServ",md_autorizacion.ensureAuth, servicioControlador.pedirServicio)
api.get("/verServicios",servicioControlador.verServicios)

module.exports = api;
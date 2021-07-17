'use strict'

var express = require("express");
var facturaControlador = require("../controladores/factura.controlador");

var md_autorizacion = require("../middlewares/authenticated");

var api = express.Router();

api.post('/factura/:id', md_autorizacion.ensureAuth, facturaControlador.factura);




module.exports = api;
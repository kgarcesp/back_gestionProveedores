/**
 * Router de rutas para la gestión de listas de precios.
 * 
 * Este módulo define todas las rutas HTTP disponibles para el microproyecto
 * de listas de precios, incluyendo operaciones de inserción, consulta,
 * actualización y gestión de validez temporal.
 * 
 * Todas las rutas están protegidas por el middleware de autenticación,
 * asegurando que solo proveedores autenticados puedan acceder.
 * 
 * @module PriceList/Interfaces/Routes
 */

import { Router } from "express";
import ControllerListaPrecios from "../controllers/controllerPriceList";
import { authMiddleware } from "../../../../shared/auth/authMiddleware"

/**
 * Router de Express para listas de precios
 * @type {Router}
 */
const router = Router();

/**
 * Instancia del controlador de listas de precios
 * @type {ControllerListaPrecios}
 */
const controller = new ControllerListaPrecios();

/**
 * @route POST /validate
 * @description Inserta una nueva lista de precios para el proveedor autenticado
 * @access Privado - Requiere autenticación de proveedor
 * @middleware authMiddleware - Valida el token JWT del proveedor
 * 
 * @body {Object} req.body
 * @body {Array} req.body.data - Array de items de lista de precios a insertar
 * @body {string} req.body.data[].COD_PROV - Código del proveedor
 * @body {string} req.body.data[].COD_SAP - Código SAP del producto
 * @body {number} req.body.data[].COSTO_UNIT - Costo unitario
 * @body {number} req.body.data[].DESC1 - Primer descuento
 * @body {number} req.body.data[].DESC2 - Segundo descuento
 * 
 * @returns {Object} 200 - Lista de precios insertada exitosamente
 * @returns {Object} 400 - Datos inválidos
 * @returns {Object} 500 - Error interno del servidor
 */
router.post("/validate", authMiddleware, controller.insertListPrecios);

/**
 * @route GET /validate-products
 * @description Obtiene las listas de precios del proveedor autenticado con información combinada de SAP
 * @access Privado - Requiere autenticación de proveedor
 * @middleware authMiddleware - Valida el token JWT del proveedor
 * 
 * @returns {Object} 200 - Array de listas de precios con información completa
 * @returns {Object} 400 - Proveedor no especificado
 * @returns {Object} 500 - Error al obtener la lista de precios
 */
router.get("/validate-products", authMiddleware, controller.seeListPrice);

/**
 * @route POST /update-prices
 * @description Actualiza precios existentes en listas del proveedor autenticado
 * @access Privado - Requiere autenticación de proveedor
 * @middleware authMiddleware - Valida el token JWT del proveedor
 * 
 * @body {Object} req.body
 * @body {Array} req.body.data - Array de items a actualizar
 * @body {number} req.body.data[].id - ID del registro a actualizar
 * @body {number} [req.body.data[].costo_unitario] - Nuevo costo unitario (opcional)
 * @body {number} [req.body.data[].descuento1] - Nuevo primer descuento (opcional)
 * @body {number} [req.body.data[].descuento2] - Nuevo segundo descuento (opcional)
 * 
 * @returns {Object} 200 - Lista de precios actualizada exitosamente
 * @returns {Object} 400 - Datos inválidos
 * @returns {Object} 500 - Error actualizando lista de precios
 */
router.post("/update-prices", authMiddleware, controller.updatePrice);

/**
 * @route POST /date-validity
 * @description Inserta o actualiza las fechas de validez de la lista de precios del proveedor
 * @access Privado - Requiere autenticación de proveedor
 * @middleware authMiddleware - Valida el token JWT del proveedor
 * 
 * @body {Object} req.body
 * @body {Array} req.body.data - Array de validaciones de fecha
 * @body {number} req.body.data[].id - ID de la validez
 * @body {string} req.body.data[].fecha_inicio - Fecha de inicio de vigencia (ISO 8601)
 * @body {string} req.body.data[].fecha_fin - Fecha de fin de vigencia (ISO 8601)
 * 
 * @returns {Object} 200 - Validez de fechas actualizada correctamente
 * @returns {Object} 400 - Datos inválidos
 * @returns {Object} 500 - Error actualizando validez de fechas
 */
router.post("/date-validity", authMiddleware, controller.dateValidity);

/**
 * @route GET /get-pricing-template
 * @description Obtiene la plantilla de precios desde SAP para el proveedor autenticado
 * @access Privado - Requiere autenticación de proveedor
 * @middleware authMiddleware - Valida el token JWT del proveedor
 * 
 * @returns {Object} 200 - Array con plantilla de precios desde SAP
 * @returns {Object} 400 - Proveedor no especificado
 * @returns {Object} 500 - Error al obtener la plantilla de precios
 */
router.get("/get-pricing-template", authMiddleware, controller.getPricingtemplate);

export default router;

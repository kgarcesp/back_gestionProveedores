/**
 * Objeto contenedor de consultas SQL para el módulo de listas de precios.
 * 
 * Este módulo centraliza las consultas SQL utilizadas en las operaciones
 * relacionadas con listas de precios. Actualmente contiene consultas de ejemplo.
 * 
 * @module PriceList/Repositories/Database
 */

/**
 * Colección de queries SQL para operaciones de base de datos.
 * 
 * @constant {Object} Query
 * @property {string} getCajasActivas - Query de ejemplo para obtener cajas activas
 * 
 * @example
 * const { Query } = require('./query');
 * const result = await client.query(Query.getCajasActivas);
 */
const Query = {
  getCajasActivas: `SELECT 1 FROM DATABASE`,
};

module.exports = { Query };

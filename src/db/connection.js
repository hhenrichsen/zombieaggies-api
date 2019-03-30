const environment = process.env.NODE_ENV || 'development';
const config = require('../../knexfile.js')[environment];
const { Model, } = require('objection');
const knex = require('knex')(config);

Model.knex(knex);

module.exports = knex;
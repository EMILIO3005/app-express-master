/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('usuarios').del()
  await knex('personas').del()
  await knex('personas').insert([
    {id: 1, apellidos: 'Cardenas', nombres:'Hugo', telefono:'989654789', email:'hugo@gmail.com', direccion:'chincha'},
    {id: 2, apellidos: 'Perez', nombres:'Paco', telefono:'963254789', email:'paco@gmail.com', direccion:'chincha'},
    {id: 3, apellidos: 'Magallanes', nombres:'Luis', telefono:'965852254', email:'luis@gmail.com', direccion:'chincha'}
  ]);
};

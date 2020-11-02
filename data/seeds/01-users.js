const bcrypt = require("bcrypt");

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, username: 'Johndoe', password: bcrypt.hashSync('abc1234', 14)},
        {id: 2, username: 'Janedoe', password: bcrypt.hashSync('abc12345', 14)}
      ]);
    });
};

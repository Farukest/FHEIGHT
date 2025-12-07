exports.up = function (knex) {
  return Promise.all([
    knex.schema.table('users', (table) => {
      table.string('wallet_address', 42);
      table.dateTime('wallet_connected_at');
    }),
    knex.schema.raw('ALTER TABLE users ADD CONSTRAINT wallet_address_index UNIQUE(wallet_address)'),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.raw('ALTER TABLE users DROP CONSTRAINT IF EXISTS wallet_address_index'),
    knex.schema.table('users', (table) => {
      table.dropColumn('wallet_address');
      table.dropColumn('wallet_connected_at');
    }),
  ]);
};

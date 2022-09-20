import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('hidrometer_netinfo', (builder: Knex.CreateTableBuilder) => {
        builder.increments('id');
        builder.string('registration_id');
        builder.string('ip');
        builder.dateTime('date_created', {useTz: false});
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('hidrometer_netinfo');
}


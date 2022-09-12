import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('bill', (builder: Knex.CreateTableBuilder) => {
        builder.increments('id');
        builder.string('registration_id');
        builder.boolean('closed');
        builder.dateTime('date_created', {useTz: false});
    });


    await knex.schema.createTable('bill_history', (builder: Knex.CreateTableBuilder) => {
        builder.increments('id');
        builder.integer('bill_id');
        builder.integer('consumption');
        builder.dateTime('date_created', {useTz: false});
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('bill');
    await knex.schema.dropTable('bill_history');
}


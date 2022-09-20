import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('bill', (table: Knex.CreateTableBuilder) => {
        table.boolean('paid');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('bill', (table: Knex.CreateTableBuilder) => {
        table.dropColumn('paid');
    });
}


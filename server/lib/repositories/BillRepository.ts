import { Bill } from '../models/Bill';

export class BillRepository {
    private model: typeof Bill

    constructor(){
        this.model = Bill;
    }

    public async close(registration_id: string): Promise<number> {
        const update = await this.model.query().where({registration_id}).patch({ closed: true});
        return update;
    }


    public async pay(registration_id: string): Promise<boolean> {
        const update = await this.model.query().where({registration_id, closed: true}).patch({ paid: true}).count();
        return !!update;
    }

    public async open(registration_id: string): Promise<Bill> {
        const bill = await this.model.query().insertAndFetch({
            closed: false, 
            date_created: new Date(), 
            registration_id
        });
        return bill;
    }

    public async find_current(registration_id:string): Promise<Bill | undefined> {
        const bill =  await this.model.query().findOne({registration_id, closed: false});
        return bill;
    }


    public async findById(id:string): Promise<Bill | undefined> {
        const bill =  await this.model.query().findById(id);
        return bill;
    }

    public async list(req?: string): Promise<Bill[]> {
        const knex = this.model.knex();
        const data = await knex.raw(`SELECT b.*, SUM(bh.consumption) as total FROM bill b INNER JOIN bill_history bh on b.id = bh.bill_id group by b.registration_id ORDER BY SUM(bh.consumption) DESC LIMIT 5`);
        return await data;
    }

    public async get_above_mean(mean: number): Promise<Number[]> {
        const knex = this.model.knex();
        const data = await knex.raw(`SELECT b.*, SUM(bh.consumption) FROM bill b INNER JOIN bill_history bh on b.id = bh.bill_id group by b.registration_id  HAVING SUM(bh.consumption) > ${mean} `);
        return data.map( (d: any) => d.registration_id);  
    }

    public async fog_mean(): Promise<Record<string, number>> {
        const knex = this.model.knex();
        const data = await knex.raw(`SELECT count(distinct(b.registration_id)) as quantity, AVG(bh.consumption) as total FROM bill b INNER JOIN bill_history bh on b.id = bh.bill_id`);
        return data[0];
    }
}

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
        const data = await knex.raw(`SELECT b.*, SUM(bh.consumption) FROM bill b INNER JOIN bill_history bh on b.id = bh.bill_id group by b.registration_id ORDER BY SUM(bh.consumption) DESC LIMIT 5`);
        return await data;
    }
}

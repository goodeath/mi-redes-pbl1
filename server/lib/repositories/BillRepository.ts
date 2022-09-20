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

        const q = this.model.query();
        if(req) q.where({registration_id: req});
        return await q;
    }
}

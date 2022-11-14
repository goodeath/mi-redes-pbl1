import { BillHistory } from '../models/BillHistory';
import { BillRepository } from '../repositories/BillRepository';

export class BillHistoryRepository {
    private model: typeof BillHistory
    private bill_repository: BillRepository;

    constructor(){
        this.bill_repository = new BillRepository();
        this.model = BillHistory;
    }

    public async insert(registration_id: string, consumption: number): Promise<BillHistory | void> {
        const bill = await this.bill_repository.find_current(registration_id);
        if(!bill) return;
        const history = await this.model.query().insert({
            bill_id: bill.id,
            consumption,
            date_created: new Date()
        });
        return history;
    }

    public async list(bill_id: number): Promise<BillHistory[]> {
        const history = await this.model.query().where({bill_id});
        return history;

    }
}

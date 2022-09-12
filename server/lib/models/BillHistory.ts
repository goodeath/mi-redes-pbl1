import { Model } from 'objection';

export class BillHistory extends Model {
    public id: number | undefined;
    public bill_id: number | undefined;
    public consumption: number | undefined;
    public date_created: Date | undefined;


    static get tableName() {
        return 'bill_history';
    }
}

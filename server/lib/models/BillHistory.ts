import { Model } from 'objection';

export class Bill extends Model {
    public id: number;
    public bill_id: number;
    public consumption: number;
    public date_created: Date;
}

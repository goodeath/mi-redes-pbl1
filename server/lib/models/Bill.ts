import { Model } from 'objection';

export class Bill extends Model {
    public id: number;
    public registration_id: string;
    public date_created: Date;
    public close: boolean;
}

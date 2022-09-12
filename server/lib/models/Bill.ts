import { Model } from 'objection';

export class Bill extends Model {
    public id: number | undefined;
    public registration_id: string | undefined;
    public date_created: Date | undefined;
    public closed: boolean | undefined;

    static get tableName() {
        return 'bill';
    }
}

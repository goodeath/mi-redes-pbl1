import { Model } from 'objection';

export class HidrometerNetinfo extends Model {
    public id: number | undefined;
    public registration_id: string | undefined;
    public date_created: Date | undefined;
    public ip: string | undefined;

    static get tableName() {
        return 'hidrometer_netinfo';
    }
}

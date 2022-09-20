import { HidrometerNetinfo } from '../models/HidrometerNetinfo';

export class HidrometerNetinfoRepository {
    private model: typeof HidrometerNetinfo

    constructor(){
        this.model = HidrometerNetinfo;
    }

    public async create(registration_id: string, ip: string): Promise<HidrometerNetinfo> {
        const created = await this.model.query().insert({ip, registration_id, date_created: new Date()});
        return created;
    }


    public async update(registration_id: string, ip: string): Promise<number> {
        const updated = await this.model.query().findOne({registration_id}).patch({ip});
        return updated;
    }

    public async find(registration_id: string): Promise<HidrometerNetinfo | undefined> {
        const hidrometer = await this.model.query().findOne({registration_id});
        return hidrometer;
    }


    public async create_or_update(registration_id: string, ip: string): Promise<HidrometerNetinfo|number> {
        let hidrometer = await this.find(registration_id);
        if(!hidrometer) return await this.create(registration_id, ip);
        return await this.update(registration_id, ip);
    }
}

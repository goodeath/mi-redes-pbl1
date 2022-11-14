import { BillHistoryRepository, BillRepository, HidrometerNetinfoRepository } from "../repositories";
import { Bill } from '../models/Bill';
export class ServerController {
  private bill_repository: BillRepository;
  private hidrometer_netinfo_repository: HidrometerNetinfoRepository;
  private bill_history_repository: BillHistoryRepository;
  
  constructor(){
      this.bill_repository = new BillRepository();
      this.hidrometer_netinfo_repository = new HidrometerNetinfoRepository();
      this.bill_history_repository = new BillHistoryRepository();
  }

  public async get_hidrometer_data(message:string){
      const data = message.toString();
      console.log(`Incoming data: ${message}`);
      const netinfo = new HidrometerNetinfoRepository();
      const bill_repository = new BillRepository();
      const bill_history_repository = new BillHistoryRepository();
      const [register_id, consumption, date, port, address] = data.split(',').map( (d:string) => d.trim());


      await netinfo.create_or_update(register_id, address+":"+port);
      let current: Bill | undefined = await bill_repository.find_current(register_id);
      if(!current) current = await bill_repository.open(register_id);
      await bill_history_repository.insert(register_id, +consumption);
  }

  public top_five = async(message: string) => {
      return await this.bill_repository.list();
  }

  public history = async(message: string) => {
    console.log(`Getting history to: ${message}`)
    const bill_id: any = message.toString();
    return {
      consumption: await this.bill_history_repository.list(bill_id),
      bill: await this.bill_repository.findById(bill_id)
    };
  }

  public block = async(message: string) => {
    console.log(`Mean: ${message}`);
    const mean = parseInt(message.toString());
    const data =  await this.bill_repository.get_above_mean(mean);
    return data;
  }

  public send_mean = async(message: string) => {
    console.log(`Sending mean of the fog`);
    const data =  await this.bill_repository.fog_mean();
    return data;
  }

}

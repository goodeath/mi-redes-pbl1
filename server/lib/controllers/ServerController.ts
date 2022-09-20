import { BillHistoryRepository, BillRepository, HidrometerNetinfoRepository } from "../repositories";

export class ServerController {
  private bill_repository: BillRepository;
  private hidrometer_netinfo_repository: HidrometerNetinfoRepository;
  private bill_history_repository: BillHistoryRepository;
  
  constructor(){
      this.bill_repository = new BillRepository();
      this.hidrometer_netinfo_repository = new HidrometerNetinfoRepository();
      this.bill_history_repository = new BillHistoryRepository();
  }

  public list = async(req:any, res:any) => {
      const reg = req.params.r;
      return await this.bill_repository.list(reg);
  }

  public history = async(req:any, res:any) => {
    const {bill_id} = req.params;
    return {
      consumption: await this.bill_history_repository.list(bill_id),
      bill: await this.bill_repository.findById(bill_id)
    };
  }

  public close = async(req:any, res:any) => {
    const { registration_id } = req.body;
    return await this.bill_repository.close(registration_id) + "";
  }


  public pay = async(req:any, res:any) => {
    const { registration_id } = req.body;
    return await this.bill_repository.pay(registration_id);
  }


  public getIpAddr = async(req:any, res:any) => {
    const { registration_id } = req.params;
    return await this.hidrometer_netinfo_repository.find(registration_id);
  }
  

}

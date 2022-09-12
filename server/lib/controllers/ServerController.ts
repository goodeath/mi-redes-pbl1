import { BillHistoryRepository, BillRepository } from "../repositories";

export class ServerController {
  private bill_repository: BillRepository;
  private bill_history_repository: BillHistoryRepository;
  
  constructor(){
      this.bill_repository = new BillRepository();
      this.bill_history_repository = new BillHistoryRepository();
  }

  public list = async(req:any, res:any) => {
      return await this.bill_repository.list();
  }

  public history = async(req:any, res:any) => {
    const {bill_id} = req.params;
    return await this.bill_history_repository.list(bill_id);
  }
  

}

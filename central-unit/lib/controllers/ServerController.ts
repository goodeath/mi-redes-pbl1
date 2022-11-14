export class ServerController {
  private central_unit: any;
  
  constructor(central_unit: any){ this.central_unit =  central_unit; }

  public top_five = async(req:any, res:any) => {
      this.central_unit.refresh_topfive();
      return this.central_unit.top_five;
  }
  public history = async(req:any, res:any) => {
    this.central_unit.refresh_history(req.params.id);
    return this.central_unit.history_consumption;
  }
}

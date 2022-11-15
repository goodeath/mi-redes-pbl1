export class ServerController {
  private central_unit: any;
  
  constructor(central_unit: any){ this.central_unit =  central_unit; }

  public top_five = async(req:any, res:any) => {
      this.central_unit.refresh_topfive();
      return this.central_unit.top_five;
  }

  public configure = async(req:any, res:any) => {
      const flow = req.body.flow;
      const id = req.body.id;
      this.central_unit.configure_hidrometer(JSON.stringify({flow,id}));
      return "OK"
  }

  public history = async(req:any, res:any) => {
    this.central_unit.refresh_history(req.params.bill_id);
    return this.central_unit.history_consumption;
  }
}

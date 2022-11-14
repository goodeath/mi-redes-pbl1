export class ServerController {
  private central_unit: any;
  
  constructor(central_unit: any){ this.central_unit =  central_unit; }

  public top_five = async(message: string) => this.central_unit.top_five;
  public history = async(message: string) => this.central_unit.history_consumption;
}

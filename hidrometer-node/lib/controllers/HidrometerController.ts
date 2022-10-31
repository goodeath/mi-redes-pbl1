import { Hidrometer } from '../services/Hidrometer';

export class HidrometerController {
  private hidrometer: Hidrometer;
  
  constructor(hidrometer: Hidrometer){
    this.hidrometer = hidrometer;
  }
  
  public configure_flow = async (req: any, res: any) => {
    const flow = req.body.flow;
    this.hidrometer.set_flow(flow);
  } 

  public details = async (req: any, res: any) => {
    return {
       consumption: this.hidrometer.get_consumption(),
       flow_rate: this.hidrometer.get_flow_rate(),
       id: this.hidrometer.get_id()
    }
  }

  public pause_flow = async (req: any, res: any): Promise<boolean> => {
    this.hidrometer.pause_flow();
    return true;
  }


  public resume_flow = async (req: any, res: any): Promise<boolean> => {
    this.hidrometer.resume_flow();
    return true;
  }

}

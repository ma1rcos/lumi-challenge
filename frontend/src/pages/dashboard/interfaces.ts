export interface Data {
    compensatedEnergy: number;
    economyGD: number;
    eletricalEnergy: number;
    totalValueWithoutGD: number;
  }
  
export interface ResponseBody {
    statusCode: number;
    message: string;
    data: Data;
}
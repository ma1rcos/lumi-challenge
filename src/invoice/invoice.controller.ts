import { Controller, Get, Query } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { ResponseBody } from 'src/interfaces/response-body';

@Controller('invoice')
export class InvoiceController {
 
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get('consumption')
  async getElectricPowerConsumption(@Query('client-number') clientNumber: string): Promise<ResponseBody> {
    return this.invoiceService.getElectricPowerConsumption(clientNumber);
  }

  @Get('download')
  async getPdfByName(@Query('file-name') fileName: string): Promise<ResponseBody> {
    return this.invoiceService.getPdfByName(fileName);
  }

  @Get('all')
  async getFilesName(@Query('client-number') clientNumber: string): Promise<ResponseBody> {
    return this.invoiceService.getAll(clientNumber);
  }

}
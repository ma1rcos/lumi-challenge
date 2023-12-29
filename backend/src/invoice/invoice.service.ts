import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import pdf from 'pdf-parse';
import { InvoiceInformation } from './interfaces/invoice-information';
import { EnergyInformation } from './interfaces/energy-information';
import { Invoice } from './entities/invoice.entity';
import { EletricPowerConsumption } from './interfaces/eletric-power-consumption';
import { ResponseBody } from 'src/interfaces/response-body';
import { Message } from 'src/enum/message';

@Injectable()
export class InvoiceService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  onModuleInit() {
    this.importAll();
  }

  private async deleteAll(): Promise<void> {
    await this.prisma.invoice.deleteMany({});
  }

  private async getCount(): Promise<number> {
    return this.prisma.invoice.count();
  }
  
  private getClientNumber(data: string) {
    const regex = new RegExp('Nº DA INSTALAÇÃO(.*?)Referente a', 's');
    const result = regex.exec(data);
    return result[0].split('Nº DA INSTALAÇÃO')[1].replace('Referente a', '').trim().split(' ')[0];
  }

  private getReferenceMonth(data: string) {
    const regex = new RegExp('Referente a(.*?)NOTA FISCAL Nº', 's');
    const result = regex.exec(data);
    return result[0].split('Valor a pagar (R$)')[1].trim().split(' ')[0];
  }

  private getEletricalEnergy(data: string): EnergyInformation {
    const regex = new RegExp(`Energia ElétricakWh(.*?)Energia SCEE`, 's');
    const result = regex.exec(data);
    const resultData = result[0].replace('Energia ElétricakWh', '').replace('Energia SCEE', '').trim().split(' ').filter((str) => str.trim() !== '');
    return {
      quantity: resultData[0],
      value: resultData[2]
    }
  }

  private getSceeeEnergy(data: string): EnergyInformation {
    const regex = new RegExp(`Energia SCEE s/ ICMSkWh(.*?)Energia compensada`, 's');
    const result = regex.exec(data);
    const resultData = result[0].replace('Energia SCEE s/ ICMSkWh', '').replace('Energia compensada', '').trim().split(' ').filter((str) => str.trim() !== '');
    return {
      quantity: resultData[0],
      value: resultData[2]
    }
  }

  private getCompensatedEnergy(data: string): EnergyInformation {
    const regex = new RegExp(`Energia compensada GD IkWh(.*?)Contrib Ilum Publica Municipal`, 's');
    const result = regex.exec(data);
    const resultData = result[0].replace('Energia compensada GD IkWh', '').replace('Contrib Ilum Publica Municipal', '').trim().split(' ').filter((str) => str.trim() !== ''); 
    return {
      quantity: resultData[0],
      value: resultData[2]
    }
  }

  private getContribuition(data: string): string {
    const regex = new RegExp(`Contrib Ilum Publica Municipal(.*?)TOTAL`, 's');
    const result = regex.exec(data);
    return result[0].replace('Contrib Ilum Publica Municipal', '').replace('TOTAL', '').trim().split(' ')[0].replace('Multa', '').trim();
  }

  private async getInformations(path: string): Promise<InvoiceInformation> {
    try {
      const dataBuffer: Buffer = fs.readFileSync(path);
      const data = (await pdf(dataBuffer)).text;
      const clientNumber = this.getClientNumber(data);
      const referenceMonth = this.getReferenceMonth(data);
      const eletricalEnergy = this.getEletricalEnergy(data);
      const sceeeEnergy = this.getSceeeEnergy(data);
      const compensatedEnergy = this.getCompensatedEnergy(data);
      const contribuition = this.getContribuition(data);
      return {
        clientNumber: clientNumber,
        referenceMonth: referenceMonth,
        pathFile: path,
        electricalEnergyQuantity: eletricalEnergy.quantity,
        electricalEnergyValue: eletricalEnergy.value,
        energySceeeIcmsQuantity: sceeeEnergy.quantity,
        electricalSceeeIcmsValue: sceeeEnergy.value,
        compensatedEnergyQuantity: compensatedEnergy.quantity,
        compensatedEnergyValue: compensatedEnergy.value,
        contributionValue: contribuition
      }
    } catch(error: any) {
      console.log(`Error reading the pdf ${path.split('static/')[1]}`);
      await this.prisma.log.create(error.toString());
    }
  }

  private async importAll(): Promise<void> {

    const directoryPath = './static/';

    fs.readdir(directoryPath, async (error: NodeJS.ErrnoException | null, files: string[]) => {

      if (error) throw new Error(`Error reading directory: ${error}`);

      const pdfFiles: string[] = files.filter((file: string) => path.extname(file).toLowerCase() === '.pdf');
      const invoicesCount = await this.getCount();

      if (invoicesCount != pdfFiles.length || invoicesCount == 0) {
        if (invoicesCount != pdfFiles.length) await this.deleteAll();
        pdfFiles.forEach(async (file: string) => {
          const pdfPath: string = path.join(directoryPath, file);
          const data = await this.getInformations(pdfPath);
          try {
            await this.prisma.invoice.create( { data } );
          } catch (error: any) {
            await this.prisma.log.create({ data: { error: error.toString() }});
          }

        });
      }

    });

  }

  async getElectricPowerConsumption(clientNumber: string): Promise<ResponseBody> {

    let invoices: Invoice[];

    if (clientNumber.length == 0) {
      invoices = await this.prisma.invoice.findMany(); 
    } else {
      const clientNumberExists = await this.prisma.invoice.findMany({
        where: {
          clientNumber: clientNumber
        }
      })
      if (clientNumberExists.length == 0) {
        return {
          statusCode: 404,
          message: Message.DataNotFound,
          data: null
        }
      }
      invoices = clientNumberExists;
    }

    let eletricalEnergy = 0;
    let compensatedEnergy = 0;
    let totalValueWithoutGD = 0;
    let economyGD = 0;

    invoices.forEach((invoice: Invoice) => {
      eletricalEnergy += parseFloat(invoice.electricalEnergyQuantity);
      eletricalEnergy += parseFloat(invoice.energySceeeIcmsQuantity);
      compensatedEnergy += parseFloat(invoice.compensatedEnergyQuantity);
      totalValueWithoutGD += parseFloat(invoice.electricalEnergyValue);
      totalValueWithoutGD += parseFloat(invoice.electricalSceeeIcmsValue);
      totalValueWithoutGD += parseFloat(invoice.contributionValue);
      economyGD += parseFloat(invoice.compensatedEnergyValue);
    });

    const data: EletricPowerConsumption = {
      eletricalEnergy: eletricalEnergy,
      compensatedEnergy: compensatedEnergy,
      totalValueWithoutGD: totalValueWithoutGD,
      economyGD: economyGD
    }

    return {
      statusCode: 200,
      message: Message.DataFoundSuccesfully,
      data: data
    }

  }

  async getAll(clientNumber: string): Promise<ResponseBody> {

    let invoices: Invoice[]  = [];

    if (clientNumber.length == 0) {
      const allInvoices = await this.prisma.invoice.findMany();
      allInvoices.forEach((invoice: Invoice) => {
        invoice.pathFile = invoice.pathFile.replace('static/', '');
        invoices.push(invoice);
      }) 
    } else {
      const filteredInvoices = await this.prisma.invoice.findMany({
        where: {
          clientNumber: clientNumber
        }
      })
      if (filteredInvoices.length == 0) {
        return {
          statusCode: 404,
          message: Message.DataNotFound,
          data: null
        }
      }
      filteredInvoices.forEach((invoice: Invoice) => {
        invoice.pathFile = invoice.pathFile.replace('static/', '');
        invoices.push(invoice);
      })
    }
  
    return {
      statusCode: 200,
      message: Message.DataFoundSuccesfully,
      data: invoices
    }

  }

  async getPdfByName(fileName: string): Promise<ResponseBody> {
    try {
      const pdfBuffer = fs.readFileSync(`static/${fileName}`);
      const base64String = pdfBuffer.toString('base64');
      return {
        statusCode: 200,
        message: Message.DataFoundSuccesfully,
        data: base64String
      }
    } catch (error) {
      console.error('Error encoding PDF to base64:', error);
      throw error;
    }
  }

}
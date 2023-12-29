import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { ResponseBody } from 'src/interfaces/response-body';

jest.mock('./invoice.service', () => ({
  InvoiceService: jest.fn(() => ({
    getElectricPowerConsumption: jest.fn(),
    getAll: jest.fn(),
    getPdfByName: jest.fn(),
  })),
}));

describe('InvoiceController', () => {
  
  let controller: InvoiceController;
  let service: InvoiceService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [InvoiceService],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
    service = module.get<InvoiceService>(InvoiceService);
  });

  describe('getElectricPowerConsumption', () => {
    it('should return electric power consumption data', async () => {
      const mockData: ResponseBody = {
        statusCode: 200,
        message: 'Data found successfully',
        data: { eletricalEnergy: 3032.007, compensatedEnergy: 2732.007, totalValueWithoutGD: 2612, economyGD: -1949 },
      };
      (service.getElectricPowerConsumption as jest.Mock).mockResolvedValue(mockData);
      const result = await controller.getElectricPowerConsumption('7005400387');
      expect(result).toEqual(mockData);
      expect(service.getElectricPowerConsumption).toHaveBeenCalledWith('7005400387');
    });
  });

  describe('getPdfByName', () => {
    it('should return PDF data by name', async () => {
      const mockData: ResponseBody = {
        statusCode: 200,
        message: 'Data found successfully',
        data: 'base64-encoded-pdf-data',
      };
      (service.getPdfByName as jest.Mock).mockResolvedValue(mockData);
      const result = await controller.getPdfByName('file-name.pdf');
      expect(result).toEqual(mockData);
      expect(service.getPdfByName).toHaveBeenCalledWith('file-name.pdf');
    });
  });

  describe('getFilesName', () => {
    it('should return all invoices data', async () => {
      const mockData: ResponseBody = {
        statusCode: 200,
        message: 'Data Found Succesfully',
        data: [
          {
            id: 1,
            clientNumber: '7202187422',
            referenceMonth: 'NOV/2023',
            pathFile: '3001117181-11-2023.pdf',
            electricalEnergyQuantity: '50',
            electricalEnergyValue: '47,62',
            energySceeeIcmsQuantity: '585',
            electricalSceeeIcmsValue: '297,32',
            compensatedEnergyQuantity: '585',
            compensatedEnergyValue: '-285,08',
            contributionValue: '49,43',
            createdAt: '2023-12-26T15:09:09.930Z',
            updatedAt: '2023-12-26T15:09:09.930Z'
          },
          {
            id: 6,
            clientNumber: '7202187422',
            referenceMonth: 'OUT/2023',
            pathFile: '3001117181-10-2023.pdf',
            electricalEnergyQuantity: '50',
            electricalEnergyValue: '47,61',
            energySceeeIcmsQuantity: '617',
            electricalSceeeIcmsValue: '313,52',
            compensatedEnergyQuantity: '617',
            compensatedEnergyValue: '-300,68',
            contributionValue: '49,43',
            createdAt: '2023-12-26T15:09:09.933Z',
            updatedAt: '2023-12-26T15:09:09.933Z'
          },
          {
            id: 7,
            clientNumber: '7202187422',
            referenceMonth: 'SET/2023',
            pathFile: '3001117181-09-2023.pdf',
            electricalEnergyQuantity: '50',
            electricalEnergyValue: '47,78',
            energySceeeIcmsQuantity: '413',
            electricalSceeeIcmsValue: '210,62',
            compensatedEnergyQuantity: '413',
            compensatedEnergyValue: '-201,26',
            contributionValue: '49,43',
            createdAt: '2023-12-26T15:09:09.933Z',
            updatedAt: '2023-12-26T15:09:09.933Z'
          },
          {
            id: 9,
            clientNumber: '7202187422',
            referenceMonth: 'JUN/2023',
            pathFile: '3001117181-06-2023.pdf',
            electricalEnergyQuantity: '50',
            electricalEnergyValue: '44,56',
            energySceeeIcmsQuantity: '347',
            electricalSceeeIcmsValue: '212,28',
            compensatedEnergyQuantity: '347',
            compensatedEnergyValue: '-201,70',
            contributionValue: '49,43',
            createdAt: '2023-12-26T15:09:09.933Z',
            updatedAt: '2023-12-26T15:09:09.933Z'
          },
          {
            id: 11,
            clientNumber: '7202187422',
            referenceMonth: 'AGO/2023',
            pathFile: '3001117181-08-2023.pdf',
            electricalEnergyQuantity: '50',
            electricalEnergyValue: '47,31',
            energySceeeIcmsQuantity: '295',
            electricalSceeeIcmsValue: '148,97',
            compensatedEnergyQuantity: '295',
            compensatedEnergyValue: '-143,76',
            contributionValue: '49,43',
            createdAt: '2023-12-26T15:09:09.933Z',
            updatedAt: '2023-12-26T15:09:09.933Z'
          },
          {
            id: 18,
            clientNumber: '7202187422',
            referenceMonth: 'JUL/2023',
            pathFile: '3001117181-07-2023.pdf',
            electricalEnergyQuantity: '50',
            electricalEnergyValue: '47,96',
            energySceeeIcmsQuantity: '297',
            electricalSceeeIcmsValue: '152,02',
            compensatedEnergyQuantity: '297',
            compensatedEnergyValue: '-144,73',
            contributionValue: '49,43',
            createdAt: '2023-12-26T15:09:09.933Z',
            updatedAt: '2023-12-26T15:09:09.933Z'
          }
        ],
      };
      (service.getAll as jest.Mock).mockResolvedValue(mockData);
      const result = await controller.getFilesName('7202187422');
      expect(result).toEqual(mockData);
      expect(service.getAll).toHaveBeenCalledWith('7202187422');
    });
  });

});
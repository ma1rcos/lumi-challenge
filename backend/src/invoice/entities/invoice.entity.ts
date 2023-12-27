export class Invoice {
    id: number;
    clientNumber: string;
    referenceMonth: string;
    pathFile: string;
    electricalEnergyQuantity: string;
    electricalEnergyValue: string;
    energySceeeIcmsQuantity: string;
    electricalSceeeIcmsValue: string;
    compensatedEnergyQuantity: string;
    compensatedEnergyValue: string;
    contributionValue: string;
    createdAt: Date;
    updatedAt: Date;
}
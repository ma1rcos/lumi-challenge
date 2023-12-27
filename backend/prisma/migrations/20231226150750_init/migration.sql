-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "error" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "clientNumber" TEXT NOT NULL,
    "referenceMonth" TEXT NOT NULL,
    "pathFile" TEXT NOT NULL,
    "electricalEnergyQuantity" TEXT NOT NULL,
    "electricalEnergyValue" TEXT NOT NULL,
    "energySceeeIcmsQuantity" TEXT NOT NULL,
    "electricalSceeeIcmsValue" TEXT NOT NULL,
    "compensatedEnergyQuantity" TEXT NOT NULL,
    "compensatedEnergyValue" TEXT NOT NULL,
    "contributionValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

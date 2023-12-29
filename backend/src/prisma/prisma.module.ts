import { Module } from '@nestjs/common';
import { InvoiceService } from 'src/invoice/invoice.service';
import { InvoiceController } from 'src/invoice/invoice.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService, PrismaService],
})

export class PrismaModule {}
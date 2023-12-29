import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [
    PrismaModule,
    InvoiceModule
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    AppService
  ],
})

export class AppModule { }
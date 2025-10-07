import { Module } from '@nestjs/common';
import { CustomerRequestService } from './customer-request.service';
import { CustomerRequestController } from './customer-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRequest } from './entities/customer-request.entity';

@Module({
  imports:[TypeOrmModule.forFeature([CustomerRequest])],
  controllers: [CustomerRequestController],
  providers: [CustomerRequestService],
})
export class CustomerRequestModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Order } from '../order/entities/order.entity';
import { Product } from '../product/entities/product.entity';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { OrderService } from 'src/order/order.service';
import { ProductsService } from 'src/product/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, Order, Product])],
  controllers: [OrderItemController],
  providers: [OrderItemService,OrderService,ProductsService],
  exports: [OrderItemService],
})
export class OrderItemModule {}

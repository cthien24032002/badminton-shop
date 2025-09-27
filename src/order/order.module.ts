import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from '../order-item/entities/order-item.entity';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UserService } from 'src/user/user.service';
import { ProductsService } from '../product/product.service';
import { OrderItemService } from 'src/order-item/order-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Product, OrderItem])],
  controllers: [OrderController],
  providers: [OrderService,UserService, ProductsService, OrderItemService],
  exports: [OrderService],
})
export class OrderModule {}

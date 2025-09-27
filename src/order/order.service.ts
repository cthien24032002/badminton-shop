import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

import { UserService } from 'src/user/user.service';
import { OrderItemService } from '../order-item/order-item.service';
import { ProductsService } from '../product/product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)private readonly orderRepo : Repository<Order>,
    private readonly orderItemService: OrderItemService,
    private readonly productsService: ProductsService,
    private readonly Users: UserService,
    ) {}
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const user = await this.Users.findOne(createOrderDto.userId);
    if(!user){
      throw new NotFoundException(`User not found`);
    }
    const order = this.orderRepo.create({user, status: createOrderDto.status, paymentMethod: createOrderDto.paymentMethod, totalAmount: 0});
    let totalAmount = 0;
    order.orderItems = [];
    for(const itemDto of createOrderDto.orderItems){
      const product = await this.productsService.findOne( itemDto.productId);
      if(!product){
        throw new NotFoundException(`Product ${itemDto.productId} not found`);
      }
      const orderItem = this.orderItemService.create({order, product,quantity: itemDto.quantity, unitPrice: itemDto.unitPrice});
      totalAmount += itemDto.quantity * itemDto.unitPrice;
      order.orderItems.push(orderItem);
  }
  order.totalAmount = totalAmount;
  return await this.orderRepo.save(order);
}

 async findAll(): Promise<Order[]> {
   return await this.orderRepo.find({relations: ['user', 'orderItems', 'orderItems.product']});
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({where:{id}, relations: ['user', 'orderItems', 'orderItems.product']});
    if(!order){
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
   const order = await this.findOne(id);
   Object.assign(order, updateOrderDto);
   return await this.orderRepo.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepo.remove(order);
  }
}

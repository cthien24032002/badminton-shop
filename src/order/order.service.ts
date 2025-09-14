import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from '../order-item/entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)private readonly orderRepo : Repository<Order>,
    @InjectRepository(User)private readonly userRepo : Repository<User>,
    @InjectRepository(Product)private readonly productRepo : Repository<Product>,
    @InjectRepository(OrderItem)private readonly orderItemRepo : Repository<OrderItem>,
  ) {}
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const user = await this.userRepo.findOneBy({id: createOrderDto.userId});
    if(!user){
      throw new NotFoundException(`User not found`);
    }
    const order = this.orderRepo.create({user, status: createOrderDto.status, paymentMethod: createOrderDto.paymentMethod, totalAmount: 0});
    let totalAmount = 0;
    order.orderItems = [];
    for(const itemDto of createOrderDto.orderItems){
      const product = await this.productRepo.findOneBy({id: itemDto.productId});
      if(!product){
        throw new NotFoundException(`Product ${itemDto.productId} not found`);
      }
      const orderItem = this.orderItemRepo.create({order, product,quantity: itemDto.quantity, unitPrice: itemDto.unitPrice});
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

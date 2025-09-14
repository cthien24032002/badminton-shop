import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { Order } from '../order/entities/order.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)private readonly orderIteamRepo : Repository<OrderItem>,
    @InjectRepository(Order)private readonly orderRepo : Repository<Order>,
    @InjectRepository(Product)private readonly productRepo : Repository<Product>,
  ) {}
  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const order = await this.orderRepo.findOneBy({id: createOrderItemDto.orderId});
    if(!order){
      throw new NotFoundException(`Order not found`);
    }
    const product = await this.productRepo.findOneBy({id: createOrderItemDto.productId});
    if(!product){
      throw new NotFoundException(`Product not found`);
    }
    const item = this.orderIteamRepo.create({order, product, quantity: createOrderItemDto.quantity,unitPrice: createOrderItemDto.unitPrice});
    return await this.orderIteamRepo.save(item);
  }

  async findAll() : Promise<OrderItem[]> {
    return await this.orderIteamRepo.find({relations: ['order', 'product']});
  }

  async findOne(id: number): Promise<OrderItem> {
    const item = await this.orderIteamRepo.findOne({where:{id}, relations: ['order', 'product']});
    if(!item){
      throw new NotFoundException(`OrderItem ${id} not found`);
    }
    return  item;
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) : Promise<OrderItem> {
    const item = await this.findOne(id);
    Object.assign(item, updateOrderItemDto);
    return await this.orderIteamRepo.save(item);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.orderIteamRepo.remove(item);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderService } from '../order/order.service';
import { ProductsService } from '../product/product.service';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)private readonly orderIteamRepo : Repository<OrderItem>,
     private readonly orderService: OrderService,
    private readonly productsService: ProductsService,
  ) {}
  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const order = await this.orderService.findOne(createOrderItemDto.orderId);
    if(!order){
      throw new NotFoundException(`Order not found`);
    }
    const product = await this.productsService.findOne(createOrderItemDto.productId);
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

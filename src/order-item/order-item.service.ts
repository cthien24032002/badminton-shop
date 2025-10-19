import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { Product } from 'src/product/entities/product.entity';
import { ProductsService } from 'src/product/product.service';

@Injectable()
export class OrderItemService {
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
  ) {}

  // async create(
  //   createOrderItemDto: CreateOrderItemDto,
  //   orderId: number,
  // ): Promise<OrderItem> {
  //   const product = await this.productService.findOne(
  //     createOrderItemDto.productId,
  //   );

  //   if (!product) {
  //     throw new NotFoundException(`Product not found`);
  //   }
  //   const item = this.orderItemRepo.create({
  //     order: { id: orderId },
  //     product,
  //     quantity: createOrderItemDto.quantity,
  //     unitPrice: createOrderItemDto.unitPrice,
  //     productName: createOrderItemDto.productName,
  //     image: createOrderItemDto.image,
  //   });

  //   return await this.orderItemRepo.save(item);
  // }

  async create(
    createOrderItemDto: CreateOrderItemDto,
    orderId: number,
    manager?: EntityManager,
  ): Promise<OrderItem> {
    const repo = manager
      ? manager.getRepository(OrderItem)
      : this.orderItemRepo;

    const product = await this.productService.updateStock(
      createOrderItemDto.productId,
      createOrderItemDto.quantity,
    );

    if (!product) {
      throw new NotFoundException(
        `Sản phẩm ${createOrderItemDto.productName} không tồn tại`,
      );
    }

    const item = repo.create({
      order: { id: orderId },
      product,
      quantity: createOrderItemDto.quantity,
      unitPrice: createOrderItemDto.unitPrice,
      productName: createOrderItemDto.productName,
      image: createOrderItemDto.image,
    });

    return await repo.save(item);
  }

  async findOne(id: number): Promise<OrderItem> {
    const item = await this.orderItemRepo.findOne({
      where: { id },
      relations: ['order', 'product'],
    });
    if (!item) {
      throw new NotFoundException(`OrderItem ${id} not found`);
    }
    return item;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItemService } from 'src/order-item/order-item.service';
import { QueryFindOrder } from './dto/query-order.dto';
import { buildPaginationMeta } from 'src/common/utils/pagination.util';
import { UpdateStatusOrderDto } from './dto/update-status.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderItemService: OrderItemService,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { orderItems,userId, ...dto } = createOrderDto;
    if (!orderItems || orderItems.length === 0) {
      throw new NotFoundException(`Đơn hàng ít nhất phải có 1 sản phẩm`);
    }

    const totalAmount = orderItems.reduce(
      (acc, cur) => acc + cur.quantity * cur.unitPrice,
      0,
    );

    const order = this.orderRepo.create({
      user: { id: userId },
      totalAmount,
      ...dto
    });

    const createdOrder = await this.orderRepo.save(order);

    //  Tạo OrderItems song song bằng Promise.all
    await Promise.all(
      orderItems.map((itemDto) =>
        this.orderItemService.create(itemDto, createdOrder.id),
      ),
    );

    // * có thể dùng thay cho đoạn trên nếu chưa quen ngôn ngữ

    // for (const itemDto of orderItems) {
    //   await this.orderItemService.create(itemDto, createdOrder.id);
    // }

    return createdOrder;
  }

  async findAllForUser(query: QueryFindOrder) {
    const { page = 1, pageSize = 10 } = query;

    const where: any = {};
    if (query.orderStatus !== undefined) where.status = query.orderStatus;
    // if (query.phone) where.createdBy = { phone: query.phone };

    const [orders, total] = await this.orderRepo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where,
    });

    // const dataResult = plainToInstance(OrderDto, orders, {
    //   excludeExtraneousValues: true,
    //   enableImplicitConversion: true,
    // });

    const pagination = buildPaginationMeta(
      total,
      orders.length,
      page,
      pageSize,
    );

    return { dataResult:orders, pagination };
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['user', 'orderItems'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findAllForAdmin(query: QueryFindOrder) {
    const { page = 1, pageSize = 10 } = query;

    const where: any = [];

    if (query.search) {
    // search theo id
    where.push({
      ...(query.orderStatus !== undefined && { status: query.orderStatus }),
      id: query.search,
    });

    // search theo phone
    where.push({
      ...(query.orderStatus !== undefined && { status: query.orderStatus }),
      user: { phone: query.search },
    });
  } else {
    // không có search -> chỉ filter status
    where.push({
      ...(query.orderStatus !== undefined && { status: query.orderStatus }),
    });
  }

    const [orders, total] = await this.orderRepo.findAndCount({
      withDeleted: true,
      skip: (page - 1) * pageSize,
      take: pageSize,
      where,
    });

    const pagination = buildPaginationMeta(
      total,
      orders.length,
      page,
      pageSize,
    );

    return { dataResult:orders, pagination };
  }

  async updateStatus(id: number, updateStatusDto: UpdateStatusOrderDto): Promise<Order> {
    
    return await this.orderRepo.save({id,status:updateStatusDto.status});
  }


}

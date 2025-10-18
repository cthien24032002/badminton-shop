import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItemService } from 'src/order-item/order-item.service';
import { QueryFindOrder } from './dto/query-order.dto';
import { buildPaginationMeta } from 'src/common/utils/pagination.util';
import { UpdateStatusOrderDto } from './dto/update-status.dto';
import { OrderStatus } from 'src/common/enums';
import { UpdateImageOrderDto } from './dto/update-image.dto';
import * as fs from 'fs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderItemService: OrderItemService,
    private readonly userService: UserService,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async createOrderImage(fileName: string, createDto: UpdateImageOrderDto) {
    return this.orderRepo.save({ id: createDto.id, imageOrder: fileName });
  }

  async removeImage(id: number) {
    const order = await this.orderRepo.findOneOrFail({ where: { id } });
    // Xóa file nhưng không ảnh hưởng endpoint nếu lỗi
    if (order.imageOrder) {
      try {
        await fs.promises.unlink(order.imageOrder);
      } catch (err) {
        this.logger?.error({
          message: 'Không thể xóa file khi xoá hình ảnh chuyển khoản',
          file: order.imageOrder,
          err,
        });
      }
    }
    // update trong DB
    return this.orderRepo.save({id:order.id,imageOrder:null});
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { orderItems, userId, ...dto } = createOrderDto;
    if (!orderItems || orderItems.length === 0) {
      throw new NotFoundException(`Đơn hàng ít nhất phải có 1 sản phẩm`);
    }

    const totalAmount = orderItems.reduce(
      (acc, cur) => acc + cur.quantity * cur.unitPrice,
      0,
    );

    const order = this.orderRepo.create({
      totalAmount,
      ...dto,
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

    return { dataResult: orders, pagination };
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
        phone: query.search,
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

    return { dataResult: orders, pagination };
  }

async updateStatus(id: number, updateStatusDto: UpdateStatusOrderDto): Promise<Order> {
    const order = await this.orderRepo.findOneOrFail({
      where: { id },
      relations: ['orderItems'],
    });

    if (
      updateStatusDto.status === OrderStatus.COMPLETED &&
      order.status !== OrderStatus.COMPLETED
    ) {
      const points = Math.round(Number(order.totalAmount) * 0.1); // 10% totalAmount
      try {
        await this.userService.updatePointsByPhone(order.phone, points);
      } catch (error) {
        this.logger.error({
          message: `Không thể cập nhật điểm cho user với phone ${order.phone}`,
          error: error.message,
        });
        throw new BadRequestException(`Không thể cập nhật điểm cho user với phone ${order.phone}`);
      }
    }

    order.status = updateStatusDto.status;
    const updatedOrder = await this.orderRepo.save(order);
    return updatedOrder;
  }

  async findTotal(orderStatus: OrderStatus) {
    // Tìm tất cả Order, kèm OrderItems
    const orders = await this.orderRepo.find({
      where: { status: orderStatus },
    });
    let totalAmount = 0;
    // Tính totalAmount cho mỗi Order
    totalAmount = orders.reduce(
      (sum, item) => sum + Number(item.totalAmount),
      0,
    );

    return { orders: totalAmount };
  }
}

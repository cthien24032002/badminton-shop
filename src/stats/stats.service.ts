import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getUserGrowth(unit: 'day' | 'month' = 'day') {
    const rawData = await this.userRepo
      .createQueryBuilder('user')
      .select(
        unit === 'day'
          ? "DATE_FORMAT(user.createdAt, '%Y-%m-%d') as date"
          : "DATE_FORMAT(user.createdAt, '%Y-%m') as date",
      )
      .addSelect('COUNT(user.id)', 'count')
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    return rawData.map((item) => ({
      date: item.date,
      count: parseInt(item.count, 10),
    }));
  }
  
  async getDashboardSummary() {
    const totalUsers = await this.userRepo.count();
    const totalPoints = await this.userRepo
      .createQueryBuilder('user')
      .select('SUM(user.point)', 'total')
      .getRawOne();
      
    return {
      totalUsers,
      totalPoints: parseInt(totalPoints.total || '0', 10),
    };
  }
}

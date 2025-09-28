import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class UserSeed {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async run() {
    await this.userRepo.query('SET FOREIGN_KEY_CHECKS = 0;');
    await this.userRepo.query('TRUNCATE TABLE users;');
    await this.userRepo.query('SET FOREIGN_KEY_CHECKS = 1;');

    const users = await Promise.all([
      {
        phone: '0703918883',
        isActive: true,
        name: 'User A',
        address: '182/3 Thanh Xuan Hà Nội'
      },
      {
        phone: '0703918884',
        isActive: true,
        name: 'User B',
      },
    ]);

    const userCreate = this.userRepo.create(users);
    await this.userRepo.save(userCreate);

    console.log('✅ users seeded!');
  }
}

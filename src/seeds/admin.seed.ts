import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/common/utils/password.util';
import { Admin } from 'src/admin/entities/admin.entity';

@Injectable()
export class AdminSeed {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
  ) {}

  async run() {
    await this.adminRepo.query('SET FOREIGN_KEY_CHECKS = 0;');
    await this.adminRepo.query('TRUNCATE TABLE admin;');
    await this.adminRepo.query('SET FOREIGN_KEY_CHECKS = 1;');

    const admins = await Promise.all([
      {
        name: 'admin',
        phone: '0593857362',
        email: 'admin@gmail.com',
        password: await hashPassword('admin123'),
        role: 'ADMIN'
      },
      {
        name: 'cthien2403',
        role: 'STAFF',
        phone: '0703918803',
        email: 'cthien2403@gmail.com', // thêm email cho đủ field
        password: await hashPassword('admin123'),
      },
    ]);

    const adminCreate = this.adminRepo.create(admins);
    await this.adminRepo.save(adminCreate);

    console.log('✅ admins seeded!');
  }
}

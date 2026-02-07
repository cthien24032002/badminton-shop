import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/datasource';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { BannersModule } from './banners/banners.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/config/logger.config';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ImagesModule } from './images/images.module';
import { CustomerRequestModule } from './customer-request/customer-request.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'uploads'), // thư mục chứa ảnh
      serveRoot: '/uploads', // đường dẫn public
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UserModule,
    AuthModule,
    AdminModule,
    CategoriesModule,
    WinstonModule.forRoot(winstonConfig),
    ProductModule,
    OrderModule,
    OrderItemModule,
    BannersModule,
    ImagesModule,
    CustomerRequestModule,
    StatsModule,
    // SeedModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('banners')
  getBanners(): string[] {
    return [
      'https://www.shutterstock.com/image-vector/vector-illustration-badminton-athlete-jumping-600nw-2520932405.jpg',
      'https://static.vecteezy.com/system/resources/thumbnails/035/277/458/small/colorful-badminton-competition-banner-design-sport-illustration-vector.jpg',
      'https://static.vecteezy.com/system/resources/thumbnails/035/277/450/small/badminton-sport-banner-background-in-red-and-white-with-halftone-and-diagonal-stripes-vector.jpg',
    ];
  }
}

import { Controller, Get, Header, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { StatsService } from './stats.service';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('user-growth')
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  @ApiOperation({ summary: 'Thống kê tăng trưởng người dùng' })
  @ApiQuery({ name: 'unit', enum: ['day', 'month'], required: false })
  async getUserGrowth(@Query('unit') unit: 'day' | 'month' = 'day') {
    return this.statsService.getUserGrowth(unit);
  }

  @Get('dashboard-summary')
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  @ApiOperation({ summary: 'Thông tin tổng quan dashboard' })
  async getDashboardSummary() {
    return this.statsService.getDashboardSummary();
  }
}

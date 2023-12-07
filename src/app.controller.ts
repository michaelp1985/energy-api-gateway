import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller({ path: ['/', 'petrol'] })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getEnergyData(
    @Query('area') area: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    console.log('get energy data called');
    const data = await this.appService.getEnergyData(area, startDate, endDate);
    return data;
  }
}

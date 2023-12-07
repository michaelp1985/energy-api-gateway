import { Controller, Get, Query } from '@nestjs/common';
import { ElectrictyService } from './electricty.service';

@Controller('electricty')
export class ElectrictyController {
  constructor(private readonly electrictyService: ElectrictyService) {}

  @Get()
  getEnergyData(
    @Query('stateid') stateid: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.electrictyService.getEnergyData(stateid, startDate, endDate);
  }
}

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { map, lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getEnergyData(area: string, startDate: string, endDate: string) {
    const apiKey = this.configService.get('ENERGYAPIKEY');
    const epiUrl = `https://api.eia.gov/v2/petroleum/pri/gnd/data/?frequency=monthly&facets[duoarea][]=${area}&data[]=value&start=${startDate}&end=${endDate}&sort[0][column]=period&sort[0][direction]=desc&api_key=${apiKey}`;

    console.log('app service get energy called');

    const response = this.httpService.get(epiUrl, { timeout: 60000 });

    const data = await lastValueFrom(response.pipe(map((res) => res.data)));

    delete data.request;
    return data;
  }
}

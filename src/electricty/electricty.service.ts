import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class ElectrictyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getEnergyData(stateId: string, startDate: string, endDate: string) {
    const apiKey = this.configService.get('ENERGYAPIKEY');
    const epiUrl = `https://api.eia.gov/v2/electricity/retail-sales/data/?frequency=monthly&data[0]=price&facets[stateid][]=${stateId}&facets[sectorid][]=RES&start=${startDate}&end=${endDate}&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000&api_key=${apiKey}`;

    console.log('electricty service get energy called');

    const response = this.httpService.get(epiUrl, { timeout: 60000 });

    const data = await lastValueFrom(response.pipe(map((res) => res.data)));

    delete data.request;
    return data;
  }
}

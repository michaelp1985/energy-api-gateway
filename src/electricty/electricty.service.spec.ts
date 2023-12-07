import { Test, TestingModule } from '@nestjs/testing';
import { ElectrictyService } from './electricty.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

describe('ElectrictyService', () => {
  let service: ElectrictyService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElectrictyService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ElectrictyService>(ElectrictyService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEnergyData()', () => {
    it('should return the data property of the response', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          test: 'test',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      jest.spyOn(httpService, 'get').mockImplementation(() => {
        return of(mockResponse);
      });

      jest.spyOn(configService, 'get').mockImplementation(() => {
        return 'test';
      });

      const data = await service.getEnergyData('MO', '202101', '202101');

      expect(data).toEqual(mockResponse.data);
    });
  });
});

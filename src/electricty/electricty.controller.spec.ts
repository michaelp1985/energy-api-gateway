import { Test, TestingModule } from '@nestjs/testing';
import { ElectrictyController } from './electricty.controller';
import { ElectrictyService } from './electricty.service';

describe('ElectrictyController', () => {
  let controller: ElectrictyController;
  const mockElectrictyService = {
    getEnergyData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElectrictyController],
      providers: [
        {
          provide: ElectrictyService,
          useValue: mockElectrictyService,
        },
      ],
    }).compile();

    controller = module.get<ElectrictyController>(ElectrictyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getEnergyData()', () => {
    it('should call the getEnergyData() method of the ElectrictyService', async () => {
      await controller.getEnergyData('MO', '202101', '202101');

      expect(mockElectrictyService.getEnergyData).toHaveBeenCalled();
    });
  });
});

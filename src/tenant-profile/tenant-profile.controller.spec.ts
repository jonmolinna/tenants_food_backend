import { Test, TestingModule } from '@nestjs/testing';
import { TenantProfileController } from './tenant-profile.controller';

describe('TenantProfileController', () => {
  let controller: TenantProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantProfileController],
    }).compile();

    controller = module.get<TenantProfileController>(TenantProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { TenantProfileService } from './tenant-profile.service';

describe('TenantProfileService', () => {
  let service: TenantProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantProfileService],
    }).compile();

    service = module.get<TenantProfileService>(TenantProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

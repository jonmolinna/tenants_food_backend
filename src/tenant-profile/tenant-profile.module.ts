import { Module } from '@nestjs/common';
import { TenantProfileService } from './tenant-profile.service';
import { TenantProfileController } from './tenant-profile.controller';

@Module({
  providers: [TenantProfileService],
  controllers: [TenantProfileController]
})
export class TenantProfileModule {}

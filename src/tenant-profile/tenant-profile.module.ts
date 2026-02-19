import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantProfileService } from './tenant-profile.service';
import { TenantProfileController } from './tenant-profile.controller';
import { TenantProfile } from './entity/tenant-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TenantProfile])],
  providers: [TenantProfileService],
  controllers: [TenantProfileController],
  exports: [TenantProfileService],
})
export class TenantProfileModule {}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TenantProfileService } from './tenant-profile.service';
import { CreateTenantProfileDto, UpdateTenantProfileDto } from './dto';

@Controller('tenant-profile')
export class TenantProfileController {
  constructor(private readonly tenantProfileService: TenantProfileService) {}

  @Get()
  async findAll() {
    return await this.tenantProfileService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.tenantProfileService.findOne(id);
  }

  @Get('tenant/:tenantId')
  async findByTenant(@Param('tenantId') tenantId: string) {
    return await this.tenantProfileService.findByTenant(tenantId);
  }

  @Post('tenant/:tenantId')
  async create(
    @Param('tenantId') tenantId: string,
    @Body() dto: CreateTenantProfileDto,
  ) {
    return await this.tenantProfileService.create(tenantId, dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTenantProfileDto) {
    return await this.tenantProfileService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    return await this.tenantProfileService.remove(id);
  }
}

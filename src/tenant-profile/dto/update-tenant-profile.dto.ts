import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateTenantProfileDto } from './create-tenant-profile.dto';

// RUC NO SE PUEDE ACTUALIZAR (identidad fiscal única e inmutable)
export class UpdateTenantProfileDto extends PartialType(
  OmitType(CreateTenantProfileDto, ['ruc'] as const),
) {}

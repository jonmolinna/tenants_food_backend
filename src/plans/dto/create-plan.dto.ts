import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreatePlanDto {
  @IsString()
  @Length(2, 50)
  code: string;

  @IsString()
  @Length(2, 120)
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  maxBranches: number;

  @IsNumber()
  @Min(1)
  maxUsers: number;

  @IsBoolean()
  @IsOptional()
  hasInventory?: boolean;

  @IsBoolean()
  @IsOptional()
  hasWhatsApp?: boolean;

  @IsNumber()
  @IsOptional()
  maxInvoicesPerMonth?: number;

  @IsNumber()
  @IsOptional()
  maxReceiptsPerMonth?: number;
}

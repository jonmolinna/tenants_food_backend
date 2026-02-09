import { IsBooleanString, IsIn, IsOptional } from 'class-validator';

export class FindAllPlansDto {
  @IsOptional()
  @IsBooleanString()
  active?: string; // "true" | "false"

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  orderName?: 'ASC' | 'DESC';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  orderPrice?: 'ASC' | 'DESC';
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto, FindAllPlansDto, UpdatePlanDto } from './dto';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  // GET /plans?active=false&orderName=DESC&orderPrice=ASC
  @Get()
  async findAll(@Query() query: FindAllPlansDto) {
    return await this.plansService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.plansService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreatePlanDto) {
    return await this.plansService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return await this.plansService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.plansService.remove(id);
  }
}

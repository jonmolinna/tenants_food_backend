import { Controller, Get, Query } from '@nestjs/common';
import { PlansService } from './plans.service';
import { FindAllPlansDto } from './dto';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  // GET /plans?active=false&orderName=DESC&orderPrice=ASC
  @Get()
  findAll(@Query() query: FindAllPlansDto) {
    return this.plansService.findAll(query);
  }
}

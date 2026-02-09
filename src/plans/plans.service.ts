import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './entity';
import { Repository } from 'typeorm';
import { FindAllPlansDto } from './dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan) private planRepository: Repository<Plan>,
  ) {}

  async findAll(filters: FindAllPlansDto): Promise<Plan[]> {
    const { active, orderName, orderPrice } = filters;

    return this.planRepository.find({
      where: { isActive: active === 'true' },
      order: { name: orderName, price: orderPrice },
    });
  }

  async findOne(id: string): Promise<Plan> {
    const plan = await this.planRepository.findOne({
      where: { id },
    });

    if (!plan) {
      throw new BadRequestException('Plan no encontrado');
    }

    return plan;
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './entity';
import { Repository } from 'typeorm';
import { CreatePlanDto, FindAllPlansDto, UpdatePlanDto } from './dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan) private planRepository: Repository<Plan>,
  ) {}

  async findAll(filters: FindAllPlansDto): Promise<Plan[]> {
    const { active, orderName, orderPrice } = filters;

    const where = active !== undefined ? { isActive: active === 'true' } : {}; // Muestra todos

    return this.planRepository.find({
      where,
      order: {
        ...(orderName && { name: orderName }), // orderName = undefined = order: {}
        ...(orderPrice && { price: orderPrice }),
      },
    });
  }

  async findOne(identifier: string): Promise<Plan> {
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier,
      );

    const plan = await this.planRepository.findOne({
      where: isUUID
        ? {
            id: identifier,
          }
        : {
            code: identifier,
          },
    });

    if (!plan) {
      throw new BadRequestException('Plan no encontrado');
    }

    return plan;
  }

  async create(dto: CreatePlanDto): Promise<Plan> {
    const existingPlan = await this.planRepository.findOne({
      where: {
        code: dto.code,
      },
    });

    if (existingPlan) {
      throw new BadRequestException('El código del plan ya existe.');
    }

    const plan = this.planRepository.create(dto);
    return await this.planRepository.save(plan);
  }

  async update(id: string, dto: UpdatePlanDto): Promise<Plan> {
    const plan = await this.findOne(id);

    if (dto.code && dto.code !== plan.code) {
      const existingPlan = await this.planRepository.findOne({
        where: {
          code: dto.code,
        },
      });

      if (existingPlan) {
        throw new BadRequestException('El código del plan ya esta en uso');
      }
    }

    Object.assign(plan, dto);

    return await this.planRepository.save(plan);
  }

  async remove(id: string): Promise<Plan> {
    const plan = await this.findOne(id);

    if (!plan.isActive) {
      throw new BadRequestException('El plan ya está desactivado');
    }

    plan.isActive = false;
    return await this.planRepository.save(plan);
  }
}

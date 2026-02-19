import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantProfile } from './entity/tenant-profile.entity';
import { CreateTenantProfileDto, UpdateTenantProfileDto } from './dto';

@Injectable()
export class TenantProfileService {
  constructor(
    @InjectRepository(TenantProfile)
    private tenantProfileRepository: Repository<TenantProfile>,
  ) {}

  // BUSCAME TODOS LOS TENANT PROFILES, INCLUYENDO LA RELACIÓN CON TENANT PARA MOSTRAR EL NOMBRE DEL RESTAURANTE
  async findAll(): Promise<TenantProfile[]> {
    return this.tenantProfileRepository.find({
      relations: ['tenant'],
    });
  }

  // BUSCAME UN TENANT PROFILE POR ID O RUC, INCLUYENDO LA RELACIÓN CON TENANT PARA MOSTRAR EL NOMBRE DEL RESTAURANTE
  async findOne(id: string): Promise<TenantProfile> {
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id,
      );

    const profile = await this.tenantProfileRepository.findOne({
      where: isUUID ? { id } : { ruc: id },
      relations: ['tenant'],
    });

    if (!profile) {
      throw new BadRequestException('Perfil de tenant no encontrado');
    }

    return profile;
  }

  // BUSCAME UN TENANT PROFILE POR EL ID DEL TENANT, INCLUYENDO LA RELACIÓN CON TENANT PARA MOSTRAR EL NOMBRE DEL RESTAURANTE
  async findByTenant(tenantId: string): Promise<TenantProfile> {
    const profile = await this.tenantProfileRepository.findOne({
      where: { tenant: { id: tenantId } },
      relations: ['tenant'],
    });

    if (!profile) {
      throw new BadRequestException('Perfil no encontrado para este tenant');
    }

    return profile;
  }

  // CREAR PERFIL DE TENANT (se llama automáticamente al crear tenant)
  async create(
    tenantId: string,
    dto: CreateTenantProfileDto,
  ): Promise<TenantProfile> {
    // Validar que no exista un perfil con ese RUC
    const existingProfile = await this.tenantProfileRepository.findOne({
      where: { ruc: dto.ruc },
    });

    if (existingProfile) {
      throw new BadRequestException('El RUC ya está registrado');
    }

    // Validar que el tenant no tenga ya un perfil (relación 1:1)
    const existingTenantProfile = await this.tenantProfileRepository.findOne({
      where: { tenant: { id: tenantId } },
    });

    if (existingTenantProfile) {
      throw new BadRequestException('Este tenant ya tiene un perfil');
    }

    // Validar horarios si se proporcionan ambos
    if (dto.openingTime && dto.closingTime) {
      this.validateBusinessHours(dto.openingTime, dto.closingTime);
    }

    // Crear perfil con valores por defecto si no se proporcionan
    const profile = this.tenantProfileRepository.create({
      ruc: dto.ruc,
      phone: dto.phone,
      email: dto.email,
      address: dto.address,
      logoUrl: dto.logoUrl,
      website: dto.website,
      timezone: dto.timezone || 'America/Lima',
      currency: dto.currency || 'PEN',
      taxPercent: dto.taxPercent,
      description: dto.description,
      openingTime: dto.openingTime,
      closingTime: dto.closingTime,
      tenant: { id: tenantId } as any,
    });

    return await this.tenantProfileRepository.save(profile);
  }

  async update(
    id: string,
    dto: UpdateTenantProfileDto,
  ): Promise<TenantProfile> {
    const profile = await this.findOne(id);

    // RUC no se puede actualizar (excluido del UpdateDto)

    // Validar horarios si se proporcionan
    const openingTime = dto.openingTime || profile.openingTime;
    const closingTime = dto.closingTime || profile.closingTime;

    if (openingTime && closingTime) {
      this.validateBusinessHours(openingTime, closingTime);
    }

    Object.assign(profile, dto);

    return await this.tenantProfileRepository.save(profile);
  }

  async remove(id: string): Promise<{ message: string; deleteId: string }> {
    const profile = await this.findOne(id);

    await this.tenantProfileRepository.softRemove(profile);

    return {
      message: 'Perfil de tenant eliminado correctamente',
      deleteId: profile.id,
    };
  }

  // Método privado para validar horarios de negocio
  private validateBusinessHours(
    openingTime: string,
    closingTime: string,
  ): void {
    const [openHour, openMinute] = openingTime.split(':').map(Number);
    const [closeHour, closeMinute] = closingTime.split(':').map(Number);

    const openingMinutes = openHour * 60 + openMinute;
    const closingMinutes = closeHour * 60 + closeMinute;

    if (closingMinutes <= openingMinutes) {
      throw new BadRequestException(
        'La hora de cierre debe ser posterior a la hora de apertura',
      );
    }

    // Validar horario razonable (opcional)
    if (openingMinutes < 360 || openingMinutes > 1320) {
      // 06:00 - 22:00
      throw new BadRequestException(
        'La hora de apertura debe estar entre 06:00 y 22:00',
      );
    }

    if (closingMinutes > 1440 || closingMinutes < 600) {
      // hasta 24:00, desde 10:00
      throw new BadRequestException(
        'La hora de cierre debe estar entre 10:00 y 24:00',
      );
    }
  }
}

// tenants/tenants.service.ts
// async create(dto: CreateTenantDto): Promise<Tenant> {
//   // Validar slug único
//   const existingTenant = await this.tenantRepository.findOne({
//     where: { slug: dto.slug }
//   });

//   if (existingTenant) {
//     throw new BadRequestException('El slug ya está en uso');
//   }

//   // Crear tenant
//   const tenant = this.tenantRepository.create({
//     name: dto.name,
//     slug: dto.slug,
//     plan: { id: dto.planId } as any,
//   });

//   const savedTenant = await this.tenantRepository.save(tenant);

//   // ✅ Crear perfil automáticamente con datos mínimos
//   await this.tenantProfileService.create(savedTenant.id, {
//     ruc: dto.ruc, // Viene del DTO de tenant
//     taxPercent: 18.0, // Default IGV Perú
//     // Los demás campos son opcionales y quedan null
//     // El cliente los puede completar después
//   });

//   return savedTenant;
// }

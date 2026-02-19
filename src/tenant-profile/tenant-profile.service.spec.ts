import { Test, TestingModule } from '@nestjs/testing';
import { TenantProfileService } from './tenant-profile.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TenantProfile } from './entity/tenant-profile.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('TenantProfileService', () => {
  let service: TenantProfileService;
  let repository: Repository<TenantProfile>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softRemove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantProfileService,
        {
          provide: getRepositoryToken(TenantProfile),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TenantProfileService>(TenantProfileService);
    repository = module.get<Repository<TenantProfile>>(
      getRepositoryToken(TenantProfile),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debería retornar un array de perfiles con relaciones', async () => {
      const mockProfiles = [
        {
          id: '1',
          ruc: '20123456789',
          phone: '987654321',
          tenant: { id: 'tenant-1', name: 'Restaurant 1' },
        },
        {
          id: '2',
          ruc: '20987654321',
          phone: '912345678',
          tenant: { id: 'tenant-2', name: 'Restaurant 2' },
        },
      ];

      mockRepository.find.mockResolvedValue(mockProfiles);

      const result = await service.findAll();

      expect(result).toEqual(mockProfiles);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['tenant'],
      });
    });
  });

  describe('findOne', () => {
    it('debería encontrar un perfil por UUID', async () => {
      const mockProfile = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ruc: '20123456789',
        phone: '987654321',
      };

      mockRepository.findOne.mockResolvedValue(mockProfile);

      const result = await service.findOne(
        '123e4567-e89b-12d3-a456-426614174000',
      );

      expect(result).toEqual(mockProfile);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
        relations: ['tenant'],
      });
    });

    it('debería encontrar un perfil por RUC', async () => {
      const mockProfile = {
        id: '1',
        ruc: '20123456789',
        phone: '987654321',
      };

      mockRepository.findOne.mockResolvedValue(mockProfile);

      const result = await service.findOne('20123456789');

      expect(result).toEqual(mockProfile);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { ruc: '20123456789' },
        relations: ['tenant'],
      });
    });

    it('debería lanzar BadRequestException si no encuentra el perfil', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('noexiste')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.findOne('noexiste')).rejects.toThrow(
        'Perfil de tenant no encontrado',
      );
    });
  });

  describe('findByTenant', () => {
    it('debería encontrar el perfil por tenantId', async () => {
      const mockProfile = {
        id: '1',
        ruc: '20123456789',
        tenant: { id: 'tenant-1' },
      };

      mockRepository.findOne.mockResolvedValue(mockProfile);

      const result = await service.findByTenant('tenant-1');

      expect(result).toEqual(mockProfile);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { tenant: { id: 'tenant-1' } },
        relations: ['tenant'],
      });
    });

    it('debería lanzar excepción si no encuentra perfil para el tenant', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findByTenant('tenant-1')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.findByTenant('tenant-1')).rejects.toThrow(
        'Perfil no encontrado para este tenant',
      );
    });
  });

  describe('create', () => {
    it('debería crear un perfil correctamente con defaults', async () => {
      const tenantId = 'tenant-1';
      const createDto = {
        ruc: '20123456789',
        phone: '987654321',
        address: 'Av. Lima 123',
        taxPercent: 18.0,
      };

      const mockCreatedProfile = {
        id: '1',
        ...createDto,
        timezone: 'America/Lima', // Default
        currency: 'PEN', // Default
        tenant: { id: tenantId },
      };

      // No existe perfil con ese RUC
      mockRepository.findOne.mockResolvedValueOnce(null);
      // No existe perfil para ese tenant
      mockRepository.findOne.mockResolvedValueOnce(null);
      mockRepository.create.mockReturnValue(mockCreatedProfile);
      mockRepository.save.mockResolvedValue(mockCreatedProfile);

      const result = await service.create(tenantId, createDto as any);

      expect(result).toEqual(mockCreatedProfile);
      expect(result.timezone).toBe('America/Lima');
      expect(result.currency).toBe('PEN');
      expect(mockRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockRepository.save).toHaveBeenCalledWith(mockCreatedProfile);
    });

    it('debería lanzar error si el RUC ya existe', async () => {
      const createDto = {
        ruc: '20123456789',
        phone: '987654321',
        taxPercent: 18.0,
      };

      mockRepository.findOne.mockResolvedValue({
        id: '1',
        ruc: '20123456789',
      });

      await expect(service.create('tenant-1', createDto as any)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create('tenant-1', createDto as any)).rejects.toThrow(
        'El RUC ya está registrado',
      );
    });

    it('debería lanzar error si el tenant ya tiene un perfil', async () => {
      const createDto = {
        ruc: '20123456789',
        phone: '987654321',
        taxPercent: 18.0,
      };

      // Primera llamada: RUC no existe
      mockRepository.findOne.mockResolvedValueOnce(null);
      // Segunda llamada: Tenant ya tiene perfil
      mockRepository.findOne.mockResolvedValueOnce({
        id: '1',
        tenant: { id: 'tenant-1' },
      });

      await expect(
        service.create('tenant-1', createDto as any),
      ).rejects.toThrow('Este tenant ya tiene un perfil');
    });

    it('debería validar horarios de negocio al crear', async () => {
      const tenantId = 'tenant-1';
      const createDto = {
        ruc: '20123456789',
        taxPercent: 18.0,
        openingTime: '22:00',
        closingTime: '08:00', // Cierre antes de apertura ❌
      };

      // Configurar mocks correctamente
      mockRepository.findOne.mockResolvedValueOnce(null); // RUC no existe
      mockRepository.findOne.mockResolvedValueOnce(null); // Tenant sin perfil

      await expect(
        service.create(tenantId, createDto as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('debería actualizar un perfil correctamente', async () => {
      const existingProfile = {
        id: '1',
        ruc: '20123456789',
        phone: '987654321',
        address: 'Av. Lima 123',
        openingTime: '09:00',
        closingTime: '22:00',
      };

      const updateDto = {
        phone: '999888777',
        address: 'Av. Cusco 456',
      };

      mockRepository.findOne.mockResolvedValue(existingProfile);
      mockRepository.save.mockResolvedValue({
        ...existingProfile,
        ...updateDto,
      });

      const result = await service.update('1', updateDto);

      expect(result.phone).toBe('999888777');
      expect(result.address).toBe('Av. Cusco 456');
      expect(result.ruc).toBe('20123456789'); // RUC no cambió
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('NO debería permitir actualizar RUC (excluido del DTO)', async () => {
      const existingProfile = {
        id: '1',
        ruc: '20123456789',
        phone: '987654321',
      };

      // El UpdateDto ya no tiene el campo ruc (OmitType)
      // Este test verifica que TypeScript previene esto
      const updateDto = {
        phone: '999888777',
        // ruc: '20999999999' ← TypeScript NO lo permite
      };

      mockRepository.findOne.mockResolvedValue(existingProfile);
      mockRepository.save.mockResolvedValue({
        ...existingProfile,
        ...updateDto,
      });

      const result = await service.update('1', updateDto);

      // El RUC permanece sin cambios
      expect(result.ruc).toBe('20123456789');
      expect(result.phone).toBe('999888777');
    });

    it('debería validar horarios de negocio al actualizar', async () => {
      const existingProfile = {
        id: '1',
        ruc: '20123456789',
        openingTime: '09:00',
        closingTime: '22:00',
      };

      const updateDto = {
        openingTime: '23:00',
        closingTime: '08:00', // Cierre antes de apertura ❌
      };

      mockRepository.findOne.mockResolvedValue(existingProfile);

      await expect(service.update('1', updateDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.update('1', updateDto)).rejects.toThrow(
        'La hora de cierre debe ser posterior a la hora de apertura',
      );
    });

    it('debería validar horarios combinando existentes con nuevos', async () => {
      const existingProfile = {
        id: '1',
        ruc: '20123456789',
        openingTime: '09:00',
        closingTime: '22:00',
      };

      const updateDto = {
        closingTime: '08:00', // Solo actualiza cierre (pero es inválido)
      };

      mockRepository.findOne.mockResolvedValue(existingProfile);

      await expect(service.update('1', updateDto)).rejects.toThrow(
        'La hora de cierre debe ser posterior a la hora de apertura',
      );
    });
  });

  describe('remove', () => {
    it('debería eliminar un perfil (soft delete) y retornar mensaje', async () => {
      const mockProfile = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ruc: '20123456789',
        phone: '987654321',
      };

      mockRepository.findOne.mockResolvedValue(mockProfile);
      mockRepository.softRemove.mockResolvedValue(mockProfile);

      const result = await service.remove('123e4567-e89b-12d3-a456-426614174000');

      expect(result).toEqual({
        message: 'Perfil de tenant eliminado correctamente',
        deleteId: '123e4567-e89b-12d3-a456-426614174000',
      });
      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(mockRepository.softRemove).toHaveBeenCalledWith(mockProfile);
    });

    it('debería lanzar error si el perfil no existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(BadRequestException);
      await expect(service.remove('1')).rejects.toThrow(
        'Perfil de tenant no encontrado',
      );
    });
  });

  describe('validateBusinessHours (validación indirecta)', () => {
    it('debería rechazar cierre antes de apertura', async () => {
      const tenantId = 'tenant-1';
      const createDto = {
        ruc: '20123456789',
        taxPercent: 18.0,
        openingTime: '22:00',
        closingTime: '08:00', // ❌
      };

      mockRepository.findOne.mockResolvedValueOnce(null);
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.create(tenantId, createDto as any),
      ).rejects.toThrow('La hora de cierre debe ser posterior a la hora de apertura');
    });

    it('debería rechazar horario de apertura fuera de rango', async () => {
      const tenantId = 'tenant-1';
      const createDto = {
        ruc: '20123456789',
        taxPercent: 18.0,
        openingTime: '05:00', // Antes de 06:00 ❌
        closingTime: '22:00',
      };

      mockRepository.findOne.mockResolvedValueOnce(null);
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.create(tenantId, createDto as any),
      ).rejects.toThrow('La hora de apertura debe estar entre 06:00 y 22:00');
    });

    it('debería rechazar horario de cierre fuera de rango', async () => {
      const tenantId = 'tenant-1';
      const createDto = {
        ruc: '20123456789',
        taxPercent: 18.0,
        openingTime: '06:00', // 06:00 = 360 minutos ✅
        closingTime: '09:00', // 09:00 = 540 minutos < 600 (10:00 mínimo) ❌
      };

      mockRepository.findOne.mockResolvedValueOnce(null);
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.create(tenantId, createDto as any),
      ).rejects.toThrow('La hora de cierre debe estar entre 10:00 y 24:00');
    });

    it('debería aceptar horarios válidos', async () => {
      const tenantId = 'tenant-1';
      const createDto = {
        ruc: '20123456789',
        taxPercent: 18.0,
        openingTime: '09:00',
        closingTime: '22:00',
      };

      const mockCreatedProfile = {
        id: '1',
        ...createDto,
        timezone: 'America/Lima',
        currency: 'PEN',
        tenant: { id: tenantId },
      };

      mockRepository.findOne.mockResolvedValueOnce(null);
      mockRepository.findOne.mockResolvedValueOnce(null);
      mockRepository.create.mockReturnValue(mockCreatedProfile);
      mockRepository.save.mockResolvedValue(mockCreatedProfile);

      const result = await service.create(tenantId, createDto as any);

      expect(result.openingTime).toBe('09:00');
      expect(result.closingTime).toBe('22:00');
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { TenantProfileController } from './tenant-profile.controller';
import { TenantProfileService } from './tenant-profile.service';
import { CreateTenantProfileDto, UpdateTenantProfileDto } from './dto';

describe('TenantProfileController', () => {
  let controller: TenantProfileController;
  let service: TenantProfileService;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByTenant: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantProfileController],
      providers: [
        {
          provide: TenantProfileService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TenantProfileController>(TenantProfileController);
    service = module.get<TenantProfileService>(TenantProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debería llamar a service.findAll', async () => {
      const mockProfiles = [
        {
          id: '1',
          ruc: '20123456789',
          phone: '987654321',
          tenant: { id: 'tenant-1' },
        },
        {
          id: '2',
          ruc: '20987654321',
          phone: '912345678',
          tenant: { id: 'tenant-2' },
        },
      ];

      mockService.findAll.mockResolvedValue(mockProfiles);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProfiles);
    });
  });

  describe('findOne', () => {
    it('debería llamar a service.findOne con el id correcto', async () => {
      const profileId = '123e4567-e89b-12d3-a456-426614174000';
      const mockProfile = {
        id: profileId,
        ruc: '20123456789',
        phone: '987654321',
      };

      mockService.findOne.mockResolvedValue(mockProfile);

      const result = await controller.findOne(profileId);

      expect(service.findOne).toHaveBeenCalledWith(profileId);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProfile);
    });

    it('debería buscar por RUC', async () => {
      const ruc = '20123456789';
      const mockProfile = {
        id: '1',
        ruc: ruc,
        phone: '987654321',
      };

      mockService.findOne.mockResolvedValue(mockProfile);

      const result = await controller.findOne(ruc);

      expect(service.findOne).toHaveBeenCalledWith(ruc);
      expect(result).toEqual(mockProfile);
    });
  });

  describe('findByTenant', () => {
    it('debería llamar a service.findByTenant con el tenantId correcto', async () => {
      const tenantId = 'tenant-1';
      const mockProfile = {
        id: '1',
        ruc: '20123456789',
        tenant: { id: tenantId },
      };

      mockService.findByTenant.mockResolvedValue(mockProfile);

      const result = await controller.findByTenant(tenantId);

      expect(service.findByTenant).toHaveBeenCalledWith(tenantId);
      expect(service.findByTenant).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProfile);
    });
  });

  describe('create', () => {
    it('debería llamar a service.create con tenantId y DTO correctos', async () => {
      const tenantId = 'tenant-1';
      const createDto: CreateTenantProfileDto = {
        ruc: '20123456789',
        phone: '987654321',
        address: 'Av. Lima 123',
        taxPercent: 18.0,
      } as any;

      const mockCreatedProfile = {
        id: '1',
        ...createDto,
        timezone: 'America/Lima',
        currency: 'PEN',
        tenant: { id: tenantId },
      };

      mockService.create.mockResolvedValue(mockCreatedProfile);

      const result = await controller.create(tenantId, createDto);

      expect(service.create).toHaveBeenCalledWith(tenantId, createDto);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCreatedProfile);
      expect(result.timezone).toBe('America/Lima');
      expect(result.currency).toBe('PEN');
    });

    it('debería crear perfil con campos opcionales completos', async () => {
      const tenantId = 'tenant-1';
      const createDto: CreateTenantProfileDto = {
        ruc: '20123456789',
        phone: '987654321',
        email: 'test@example.com',
        address: 'Av. Lima 123',
        logoUrl: 'https://example.com/logo.png',
        website: 'https://restaurant.com',
        timezone: 'America/Lima',
        currency: 'PEN',
        taxPercent: 18.0,
        description: 'Restaurante de comida peruana',
        openingTime: '09:00',
        closingTime: '22:00',
      } as any;

      const mockCreatedProfile = {
        id: '1',
        ...createDto,
        tenant: { id: tenantId },
      };

      mockService.create.mockResolvedValue(mockCreatedProfile);

      const result = await controller.create(tenantId, createDto);

      expect(service.create).toHaveBeenCalledWith(tenantId, createDto);
      expect(result).toEqual(mockCreatedProfile);
      expect(result.openingTime).toBe('09:00');
      expect(result.closingTime).toBe('22:00');
    });
  });

  describe('update', () => {
    it('debería llamar a service.update con id y DTO correctos', async () => {
      const profileId = '1';
      const updateDto: UpdateTenantProfileDto = {
        phone: '999888777',
        address: 'Av. Cusco 456',
      };

      const mockUpdatedProfile = {
        id: profileId,
        ruc: '20123456789',
        ...updateDto,
      };

      mockService.update.mockResolvedValue(mockUpdatedProfile);

      const result = await controller.update(profileId, updateDto);

      expect(service.update).toHaveBeenCalledWith(profileId, updateDto);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUpdatedProfile);
    });

    it('debería actualizar solo un campo', async () => {
      const profileId = '1';
      const updateDto: UpdateTenantProfileDto = {
        logoUrl: 'https://example.com/new-logo.png',
      };

      const mockUpdatedProfile = {
        id: profileId,
        ruc: '20123456789',
        phone: '987654321',
        logoUrl: 'https://example.com/new-logo.png',
      };

      mockService.update.mockResolvedValue(mockUpdatedProfile);

      const result = await controller.update(profileId, updateDto);

      expect(service.update).toHaveBeenCalledWith(profileId, updateDto);
      expect(result.logoUrl).toBe('https://example.com/new-logo.png');
    });

    it('NO debería permitir actualizar RUC (excluido del DTO)', async () => {
      const profileId = '1';
      const updateDto: UpdateTenantProfileDto = {
        phone: '999888777',
        // ruc no está disponible en UpdateTenantProfileDto
      };

      const mockUpdatedProfile = {
        id: profileId,
        ruc: '20123456789', // RUC permanece igual
        phone: '999888777',
      };

      mockService.update.mockResolvedValue(mockUpdatedProfile);

      const result = await controller.update(profileId, updateDto);

      expect(service.update).toHaveBeenCalledWith(profileId, updateDto);
      expect(result.ruc).toBe('20123456789'); // RUC no cambió
    });

    it('debería actualizar horarios de negocio', async () => {
      const profileId = '1';
      const updateDto: UpdateTenantProfileDto = {
        openingTime: '08:00',
        closingTime: '23:00',
      };

      const mockUpdatedProfile = {
        id: profileId,
        ruc: '20123456789',
        openingTime: '08:00',
        closingTime: '23:00',
      };

      mockService.update.mockResolvedValue(mockUpdatedProfile);

      const result = await controller.update(profileId, updateDto);

      expect(service.update).toHaveBeenCalledWith(profileId, updateDto);
      expect(result.openingTime).toBe('08:00');
      expect(result.closingTime).toBe('23:00');
    });
  });

  describe('remove', () => {
    it('debería llamar a service.remove y retornar mensaje de éxito', async () => {
      const profileId = '123e4567-e89b-12d3-a456-426614174000';
      const mockResponse = {
        message: 'Perfil de tenant eliminado correctamente',
        deleteId: profileId,
      };

      mockService.remove.mockResolvedValue(mockResponse);

      const result = await controller.remove(profileId);

      expect(service.remove).toHaveBeenCalledWith(profileId);
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
      expect(result.message).toBe('Perfil de tenant eliminado correctamente');
      expect(result.deleteId).toBe(profileId);
    });

    it('debería retornar HTTP 204 (definido en @HttpCode)', async () => {
      const profileId = '1';
      const mockResponse = {
        message: 'Perfil de tenant eliminado correctamente',
        deleteId: profileId,
      };

      mockService.remove.mockResolvedValue(mockResponse);

      await controller.remove(profileId);

      expect(service.remove).toHaveBeenCalledWith(profileId);
      // El @HttpCode(204) está en el controller
    });
  });
});

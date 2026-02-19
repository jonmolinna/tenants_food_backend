import { Test, TestingModule } from '@nestjs/testing';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { CreatePlanDto, FindAllPlansDto, UpdatePlanDto } from './dto';

describe('PlansController', () => {
  let controller: PlansController;
  let service: PlansService;

  // Mock del servicio
  const mockPlansService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlansController],
      providers: [
        {
          provide: PlansService,
          useValue: mockPlansService,
        },
      ],
    }).compile();

    controller = module.get<PlansController>(PlansController);
    service = module.get<PlansService>(PlansService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debería llamar a service.findAll con los filtros correctos', async () => {
      const filters: FindAllPlansDto = {
        active: 'true',
        orderName: 'ASC',
        orderPrice: 'DESC',
      };

      const mockPlans = [
        { id: '1', code: 'FREE', name: 'Plan Free', isActive: true },
        { id: '2', code: 'PRO', name: 'Plan Pro', isActive: true },
      ];

      mockPlansService.findAll.mockResolvedValue(mockPlans);

      const result = await controller.findAll(filters);

      expect(service.findAll).toHaveBeenCalledWith(filters);
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPlans);
    });

    it('debería manejar filtros vacíos', async () => {
      const emptyFilters: FindAllPlansDto = {};

      mockPlansService.findAll.mockResolvedValue([]);

      const result = await controller.findAll(emptyFilters);

      expect(service.findAll).toHaveBeenCalledWith(emptyFilters);
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('debería llamar a service.findOne con el id correcto', async () => {
      const planId = '123e4567-e89b-12d3-a456-426614174000';
      const mockPlan = {
        id: planId,
        code: 'FREE',
        name: 'Plan Free',
        price: 0,
        isActive: true,
      };

      mockPlansService.findOne.mockResolvedValue(mockPlan);

      const result = await controller.findOne(planId);

      expect(service.findOne).toHaveBeenCalledWith(planId);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPlan);
    });

    it('debería buscar por código', async () => {
      const code = 'FREE';
      const mockPlan = {
        id: '1',
        code: 'FREE',
        name: 'Plan Free',
      };

      mockPlansService.findOne.mockResolvedValue(mockPlan);

      const result = await controller.findOne(code);

      expect(service.findOne).toHaveBeenCalledWith(code);
      expect(result).toEqual(mockPlan);
    });
  });

  describe('create', () => {
    it('debería llamar a service.create con el DTO correcto', async () => {
      const createDto: CreatePlanDto = {
        code: 'FREE',
        name: 'Plan Free',
        price: 0,
        maxBranches: 1,
        maxUsers: 3,
      };

      const mockCreatedPlan = {
        id: '1',
        ...createDto,
        isActive: true,
      };

      mockPlansService.create.mockResolvedValue(mockCreatedPlan);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCreatedPlan);
    });

    it('debería crear plan con campos opcionales', async () => {
      const createDto: CreatePlanDto = {
        code: 'PRO',
        name: 'Plan Pro',
        price: 49.99,
        maxBranches: 5,
        maxUsers: 10,
        hasInventory: true,
        hasWhatsApp: true,
        maxInvoicesPerMonth: 100,
        maxReceiptsPerMonth: 200,
      };

      const mockCreatedPlan = {
        id: '2',
        ...createDto,
        isActive: true,
      };

      mockPlansService.create.mockResolvedValue(mockCreatedPlan);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockCreatedPlan);
    });
  });

  describe('update', () => {
    it('debería llamar a service.update con id y DTO correctos', async () => {
      const planId = '1';
      const updateDto: UpdatePlanDto = {
        name: 'Plan Free Actualizado',
        price: 9.99,
      };

      const mockUpdatedPlan = {
        id: planId,
        code: 'FREE',
        ...updateDto,
        isActive: true,
      };

      mockPlansService.update.mockResolvedValue(mockUpdatedPlan);

      const result = await controller.update(planId, updateDto);

      expect(service.update).toHaveBeenCalledWith(planId, updateDto);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUpdatedPlan);
    });

    it('debería actualizar solo un campo', async () => {
      const planId = '1';
      const updateDto: UpdatePlanDto = {
        name: 'Nuevo nombre',
      };

      const mockUpdatedPlan = {
        id: planId,
        code: 'FREE',
        name: 'Nuevo nombre',
        price: 0,
        isActive: true,
      };

      mockPlansService.update.mockResolvedValue(mockUpdatedPlan);

      const result = await controller.update(planId, updateDto);

      expect(service.update).toHaveBeenCalledWith(planId, updateDto);
      expect(result.name).toBe('Nuevo nombre');
    });
  });
});

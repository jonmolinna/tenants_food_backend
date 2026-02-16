import { Test, TestingModule } from '@nestjs/testing';
import { PlansService } from './plans.service';
import { Repository } from 'typeorm';
import { Plan } from './entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';

describe('PlansService', () => {
  let service: PlansService;
  let repository: Repository<Plan>;

  // Mock del repositorio
  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlansService,
        {
          provide: getRepositoryToken(Plan),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PlansService>(PlansService);
    repository = module.get<Repository<Plan>>(getRepositoryToken(Plan));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debería retornar un array de planes', async () => {
      const mockPlans = [
        { id: '1', code: 'FREE', name: 'Plan Free', isActive: true },
        { id: '2', code: 'PRO', name: 'Plan Pro', isActive: true },
      ];

      mockRepository.find.mockResolvedValue(mockPlans);

      const result = await service.findAll({ active: 'true' });

      expect(result).toEqual(mockPlans);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        order: {},
      });
    });

    it('debería filtrar por isActive', async () => {
      await service.findAll({ active: 'false' });

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { isActive: false },
        order: {},
      });
    });
  });

    describe('findOne', () => {
    it('debería encontrar un plan por UUID', async () => {
      const mockPlan = { id: '123e4567-e89b-12d3-a456-426614174000', code: 'FREE' };
      mockRepository.findOne.mockResolvedValue(mockPlan);

      const result = await service.findOne('123e4567-e89b-12d3-a456-426614174000');

      expect(result).toEqual(mockPlan);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
      });
    });

    it('debería encontrar un plan por código', async () => {
      const mockPlan = { id: '1', code: 'FREE', name: 'Plan Free' };
      mockRepository.findOne.mockResolvedValue(mockPlan);

      const result = await service.findOne('FREE');

      expect(result).toEqual(mockPlan);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { code: 'FREE' },
      });
    });

    it('debería lanzar BadRequestException si no encuentra el plan', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('NOEXISTE')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.findOne('NOEXISTE')).rejects.toThrow(
        'Plan no encontrado',
      );
    });
  });


   describe('create', () => {
    it('debería crear un plan correctamente', async () => {
      const createDto = {
        code: 'FREE',
        name: 'Plan Free',
        price: 0,
        maxBranches: 1,
        maxUsers: 3,
      };

      const mockPlan = { id: '1', ...createDto };

      mockRepository.findOne.mockResolvedValue(null); // No existe
      mockRepository.create.mockReturnValue(mockPlan);
      mockRepository.save.mockResolvedValue(mockPlan);

      const result = await service.create(createDto);

      expect(result).toEqual(mockPlan);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { code: 'FREE' },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockPlan);
    });

    it('debería lanzar error si el código ya existe', async () => {
      const createDto = { code: 'FREE', name: 'Plan Free' };
      mockRepository.findOne.mockResolvedValue({ id: '1', code: 'FREE' });

      await expect(service.create(createDto as any)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createDto as any)).rejects.toThrow(
        'El código del plan ya existe',
      );
    });
  });


   describe('update', () => {
    it('debería actualizar un plan correctamente', async () => {
      const existingPlan = {
        id: '1',
        code: 'FREE',
        name: 'Plan Free',
        isActive: true,
      };
      const updateDto = { name: 'Plan Free Actualizado' };

      mockRepository.findOne.mockResolvedValue(existingPlan);
      mockRepository.save.mockResolvedValue({
        ...existingPlan,
        ...updateDto,
      });

      const result = await service.update('1', updateDto);

      expect(result.name).toEqual('Plan Free Actualizado');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('debería validar código duplicado al actualizar', async () => {
      const existingPlan = { id: '1', code: 'FREE', name: 'Plan Free' };
      const updateDto = { code: 'PRO' };

      // Primera llamada: findOne para obtener el plan actual
      // Segunda llamada: findOne para validar código duplicado
      mockRepository.findOne
        .mockResolvedValueOnce(existingPlan)
        .mockResolvedValueOnce({ id: '2', code: 'PRO' }); // Ya existe

      await expect(service.update('1', updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });


   describe('remove', () => {
    it('debería desactivar un plan (soft delete)', async () => {
      const mockPlan = { id: '1', code: 'FREE', isActive: true };
      mockRepository.findOne.mockResolvedValue(mockPlan);
      mockRepository.save.mockResolvedValue({ ...mockPlan, isActive: false });

      const result = await service.remove('1');

      expect(result.isActive).toBe(false);
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockPlan,
        isActive: false,
      });
    });

    it('debería lanzar error si el plan ya está desactivado', async () => {
      const mockPlan = { id: '1', code: 'FREE', isActive: false };
      mockRepository.findOne.mockResolvedValue(mockPlan);

      await expect(service.remove('1')).rejects.toThrow(BadRequestException);
      await expect(service.remove('1')).rejects.toThrow(
        'El plan ya está desactivado',
      );
    });
  });



});

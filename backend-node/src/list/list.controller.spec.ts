import { vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

// Mock do ListService
const mockListService = {
  create: vi.fn(),
  findAll: vi.fn(),
  findOne: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
};

describe('ListController', () => {
  let controller: ListController;
  let service: ListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListController],
      providers: [
        {
          provide: ListService,
          useValue: mockListService,
        },
      ],
    }).compile();

    controller = module.get<ListController>(ListController);
    service = module.get<ListService>(ListService);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Testes para o método [create]
  describe('create', () => {
    it('should create a list', async () => {
      const createListDto: CreateListDto = {
        name: 'New List',
        description: 'A brief description',
      };
      const expectedResult = { id: 1, ...createListDto, createdAt: new Date() };

      mockListService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createListDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createListDto);
    });
  });

  // Testes para o método [findAll]
  describe('findAll', () => {
    it('should return an array of lists', async () => {
      const expectedResult = [
        { id: 1, name: 'List 1', description: 'Desc 1', createdAt: new Date() },
        { id: 2, name: 'List 2', description: 'Desc 2', createdAt: new Date() },
      ];
      mockListService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  // Testes para o método [findOne]
  describe('findOne', () => {
    it('should return a single list', async () => {
      const expectedResult = {
        id: 1,
        name: 'Test List',
        description: 'Test',
        createdAt: new Date(),
      };
      mockListService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(1);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  // Testes para o método [update]
  describe('update', () => {
    it('should update a list', async () => {
      const updateListDto: UpdateListDto = { name: 'Updated Name' };
      const expectedResult = {
        id: 1,
        name: 'Updated Name',
        description: 'Test',
        createdAt: new Date(),
      };
      mockListService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(1, updateListDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(1, updateListDto);
    });
  });

  // Testes para o método [remove]
  describe('remove', () => {
    it('should remove a list', async () => {
      mockListService.remove.mockResolvedValue(undefined); // O método remove não retorna valor

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});


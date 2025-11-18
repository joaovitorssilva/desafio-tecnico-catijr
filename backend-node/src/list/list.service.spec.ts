import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ListService } from './list.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ListService', () => {
  let service: ListService;
  let prisma: PrismaService;

  const mockPrismaService = {
    list: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ListService>(ListService);
    prisma = module.get<PrismaService>(PrismaService);
    
    // Limpar mocks entre testes
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a list', async () => {
      const createListDto = { 
        name: 'Test List', 
        description: 'Test Description' 
      };
      
      const expectedResult = { 
        id: 1, 
        ...createListDto, 
        createdAt: new Date() 
      };

      mockPrismaService.list.create.mockResolvedValue(expectedResult);

      const result = await service.create(createListDto);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.list.create).toHaveBeenCalledWith({
        data: createListDto,
      });
      expect(mockPrismaService.list.create).toHaveBeenCalledOnce();
    });
  });

  describe('findAll', () => {
    it('should return an array of lists', async () => {
      const expectedLists = [
        { id: 1, name: 'List 1', description: 'Desc 1', createdAt: new Date() },
        { id: 2, name: 'List 2', description: 'Desc 2', createdAt: new Date() },
      ];

      mockPrismaService.list.findMany.mockResolvedValue(expectedLists);

      const result = await service.findAll();

      expect(result).toEqual(expectedLists);
      expect(result).toHaveLength(2);
      expect(mockPrismaService.list.findMany).toHaveBeenCalledOnce();
    });

    it('should return empty array when no lists', async () => {
      mockPrismaService.list.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a single list', async () => {
      const expectedList = { 
        id: 1, 
        name: 'Test List', 
        description: 'Test', 
        createdAt: new Date() 
      };

      mockPrismaService.list.findUnique.mockResolvedValue(expectedList);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedList);
      expect(mockPrismaService.list.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null if list not found', async () => {
      mockPrismaService.list.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a list', async () => {
      const updateListDto = { name: 'Updated List' };
      const expectedResult = { 
        id: 1, 
        name: 'Updated List', 
        description: 'Test', 
        createdAt: new Date() 
      };

      mockPrismaService.list.update.mockResolvedValue(expectedResult);

      const result = await service.update(1, updateListDto);

      expect(result).toEqual(expectedResult);
      expect(result.name).toBe('Updated List');
      expect(mockPrismaService.list.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateListDto,
      });
    });
  });

  describe('remove', () => {
    it('should delete a list', async () => {
      const expectedResult = { 
        id: 1, 
        name: 'Test List', 
        description: 'Test', 
        createdAt: new Date() 
      };

      mockPrismaService.list.delete.mockResolvedValue(expectedResult);

      const result = await service.remove(1);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.list.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw error if list not found', async () => {
      const error = new Error('List not found');
      mockPrismaService.list.delete.mockRejectedValue(error);

      await expect(service.remove(999)).rejects.toThrow('List not found');
    });
  });
});
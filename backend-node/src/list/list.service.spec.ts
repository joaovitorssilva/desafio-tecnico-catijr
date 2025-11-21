import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ListService } from './list.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ListService', () => {
  let service: ListService;
  let prisma: PrismaService;

  // Mock do PrismaService
  const mockPrismaService = {
    list: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    task: {
      count: vi.fn(),
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
    vi.clearAllMocks(); // Limpa mocks entre os testes
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Testes para o método [create]
  describe('create', () => {
    it('should create a list', async () => {
      const createListDto = {
        name: 'Test List',
        description: 'Test Description',
      };
      const expectedResult = { id: 1, ...createListDto, createdAt: new Date() };

      mockPrismaService.list.create.mockResolvedValue(expectedResult);

      const result = await service.create(createListDto);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.list.create).toHaveBeenCalledWith({
        data: createListDto,
      });
    });

    it('should throw ConflictException on duplicate name', async () => {
      const createListDto = {
        name: 'Existing List',
        description: 'Description',
      };
      mockPrismaService.list.create.mockRejectedValue({ code: 'P2002' });

      await expect(service.create(createListDto)).rejects.toThrow(
        new ConflictException(
          `A lista com o nome "${createListDto.name}" já existe.`,
        ),
      );
    });
  });

  // Testes para o método [findAll]
  describe('findAll', () => {
    it('should return an array of lists', async () => {
      const expectedLists = [
        { id: 1, name: 'List 1', description: 'Desc 1', createdAt: new Date() },
        { id: 2, name: 'List 2', description: 'Desc 2', createdAt: new Date() },
      ];
      mockPrismaService.list.findMany.mockResolvedValue(expectedLists);

      const result = await service.findAll();

      expect(result).toEqual(expectedLists);
      expect(mockPrismaService.list.findMany).toHaveBeenCalledOnce();
    });
  });

  // Testes para o método [findOne]
  describe('findOne', () => {
    it('should return a single list', async () => {
      const expectedList = {
        id: 1,
        name: 'Test List',
        description: 'Test',
        createdAt: new Date(),
      };
      mockPrismaService.list.findUnique.mockResolvedValue(expectedList);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedList);
      expect(mockPrismaService.list.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if list not found', async () => {
      mockPrismaService.list.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException(`Lista com o ID 999 não encontrada.`),
      );
    });
  });

  // Testes para o método [update]
  describe('update', () => {
    const updateListDto = { name: 'Updated List' };
    const existingList = {
      id: 1,
      name: 'Old Name',
      description: 'Old Description',
      createdAt: new Date(),
    };
    const updatedList = { ...existingList, ...updateListDto };

    it('should update a list', async () => {
      mockPrismaService.list.findUnique.mockResolvedValue(existingList);
      mockPrismaService.list.update.mockResolvedValue(updatedList);

      const result = await service.update(1, updateListDto);

      expect(result).toEqual(updatedList);
      expect(mockPrismaService.list.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.list.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateListDto,
      });
    });

    it('should throw NotFoundException if list to update is not found', async () => {
      mockPrismaService.list.findUnique.mockResolvedValue(null);

      await expect(service.update(999, updateListDto)).rejects.toThrow(
        new NotFoundException(`Lista com o ID 999 não encontrada.`),
      );
    });

    it('should throw ConflictException on duplicate name', async () => {
      mockPrismaService.list.findUnique.mockResolvedValue(existingList);
      mockPrismaService.list.update.mockRejectedValue({ code: 'P2002' });

      await expect(service.update(1, updateListDto)).rejects.toThrow(
        new ConflictException(
          `A lista com o nome "${updateListDto.name}" já existe.`,
        ),
      );
    });
  });

  // Testes para o método [remove]
  describe('remove', () => {
    const existingList = {
      id: 1,
      name: 'Test List',
      description: 'Test',
      createdAt: new Date(),
    };

    it('should delete a list', async () => {
      mockPrismaService.list.findUnique.mockResolvedValue(existingList);
      mockPrismaService.task.count.mockResolvedValue(0); // Nenhuma tarefa associada
      mockPrismaService.list.delete.mockResolvedValue(existingList);

      await service.remove(1);

      expect(mockPrismaService.list.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.task.count).toHaveBeenCalledWith({
        where: { listId: 1 },
      });
      expect(mockPrismaService.list.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if list to remove is not found', async () => {
      mockPrismaService.list.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException(`Lista com o ID 999 não encontrada.`),
      );
    });

    it('should throw ConflictException if list has associated tasks', async () => {
      mockPrismaService.list.findUnique.mockResolvedValue(existingList);
      mockPrismaService.task.count.mockResolvedValue(3); // 3 tarefas associadas

      await expect(service.remove(1)).rejects.toThrow(
        new ConflictException(
          `Não é possível remover a lista 1 pois há 3 tarefas associadas.`,
        ),
      );
    });
  });
});
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';
import { Priority } from './dto/priority.enum';
import { NotFoundException } from '@nestjs/common';

describe('TaskService', () => {
  let service: TaskService;
  let prisma: PrismaService;

  const mockPrismaService = {
    list: {
      findUnique: vi.fn(),
    },
    task: {
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
        TaskService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prisma = module.get<PrismaService>(PrismaService);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto = {
        name: 'Test Task',
        description: 'Test Description',
        priority: Priority.MEDIUM,
        listId: 1,
      };

      const expectedResult = {
        id: 1,
        ...createTaskDto,
        finishDate: null,
        createdAt: new Date(),
        expectedFinishDate: null,
      };

      mockPrismaService.list.findUnique.mockResolvedValue({ id: 1, name: 'Test List' });
      mockPrismaService.task.create.mockResolvedValue(expectedResult);

      const result = await service.create(createTaskDto);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.task.create).toHaveBeenCalledOnce();
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const expectedTasks = [
        { id: 1, name: 'Task 1', priority: Priority.LOW, listId: 1 },
        { id: 2, name: 'Task 2', priority: Priority.HIGH, listId: 1 },
      ];
      mockPrismaService.task.findMany.mockResolvedValue(expectedTasks);

      const result = await service.findAll();

      expect(result).toEqual(expectedTasks);
      expect(mockPrismaService.task.findMany).toHaveBeenCalledOnce();
    });
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      const expectedTask = { id: 1, name: 'Task 1', priority: Priority.LOW, listId: 1 };
      mockPrismaService.task.findUnique.mockResolvedValue(expectedTask);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedTask);
      expect(mockPrismaService.task.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if task not found', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update task status', async () => {
      const now = new Date();
      const task = {
        id: 1,
        name: 'Task',
        description: 'description',
        priority: Priority.LOW,
        listId: 1,
        createdAt: new Date(),
        finishDate: null,
        expectedFinishDate: null,
      };

      const updatePayload = { finishDate: now.toISOString() };
      
      mockPrismaService.task.findUnique.mockResolvedValue(task);
      mockPrismaService.task.update.mockResolvedValue({ ...task, finishDate: now });

      const result = await service.update(1, updatePayload);

      expect(result.finishDate).toEqual(now);
    });

    it('should throw NotFoundException if task to update is not found', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);
      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      const task = { id: 1, name: 'Task 1', priority: Priority.LOW, listId: 1 };
      mockPrismaService.task.findUnique.mockResolvedValue(task);
      mockPrismaService.task.delete.mockResolvedValue(task);

      await service.remove(1);

      expect(mockPrismaService.task.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if task to delete is not found', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
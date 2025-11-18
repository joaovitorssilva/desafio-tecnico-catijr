import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TaskService', () => {
  let service: TaskService;
  let prisma: PrismaService;

  const mockPrismaService = {
    task: {
      create: vi.fn(),
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
        title: 'Test Task',
        description: 'Test Description',
        listId: 1,
      };

      const expectedResult = {
        id: 1,
        ...createTaskDto,
        completed: false,
        createdAt: new Date(),
      };

      mockPrismaService.task.create.mockResolvedValue(expectedResult);

      const result = await service.create(createTaskDto);

      expect(result).toEqual(expectedResult);
      expect(result.completed).toBe(false);
      expect(mockPrismaService.task.create).toHaveBeenCalledOnce();
    });
  });

  describe('toggleComplete', () => {
    it('should toggle task completion status', async () => {
      const task = {
        id: 1,
        title: 'Task',
        completed: false,
        listId: 1,
        createdAt: new Date(),
      };

      mockPrismaService.task.findUnique.mockResolvedValue(task);
      mockPrismaService.task.update.mockResolvedValue({ ...task, completed: true });

      const result = await service.update(1, { completed: true });

      expect(result.completed).toBe(true);
    });
  });
});
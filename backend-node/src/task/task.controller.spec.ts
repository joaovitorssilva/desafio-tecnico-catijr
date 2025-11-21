import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Priority } from './dto/priority.enum';
import { vi } from 'vitest';

const mockTaskService = {
  create: vi.fn(),
  findAll: vi.fn(),
  findOne: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
};

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto: CreateTaskDto = {
        name: 'New Task',
        priority: Priority.LOW,
        listId: 1,
      };
      const expectedResult = { id: 1, ...createTaskDto, createdAt: new Date() };

      mockTaskService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createTaskDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const expectedResult = [
        { id: 1, name: 'Task 1', priority: Priority.LOW, listId: 1 },
        { id: 2, name: 'Task 2', priority: Priority.HIGH, listId: 1 },
      ];
      mockTaskService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      const expectedResult = { id: 1, name: 'Test Task', priority: Priority.MEDIUM, listId: 1 };
      mockTaskService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(1);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto: UpdateTaskDto = { name: 'Updated Name' };
      const expectedResult = { id: 1, name: 'Updated Name', priority: Priority.LOW, listId: 1 };
      mockTaskService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(1, updateTaskDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(1, updateTaskDto);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      mockTaskService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});

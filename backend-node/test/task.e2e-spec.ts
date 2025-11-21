import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { Priority } from '../src/task/dto/priority.enum';
import { CreateListDto } from 'src/list/dto/create-list.dto';

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let moduleFixture: TestingModule;
  let list: CreateListDto;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await prisma.$connect();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.list.deleteMany();
    list = await prisma.list.create({
      data: { name: 'Test List', description: 'Test' },
    });
  });

  describe('/tasks (POST)', () => {
    it('should create a task', async () => {
      const createTaskDto = {
        name: 'Test Task',
        description: 'Test Description',
        priority: Priority.HIGH,
        listId: list.id,
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createTaskDto.name);
      expect(response.body.priority).toBe(createTaskDto.priority);
    });

    it('should return 400 if name is missing', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({
          description: 'Test',
          priority: Priority.LOW,
          listId: list.id,
        })
        .expect(400);
    });
  });

  describe('/tasks (GET)', () => {
    it('should return all tasks', async () => {
      await prisma.task.createMany({
        data: [
          {
            name: 'Task 1',
            priority: Priority.LOW,
            listId: list.id,
          },
          {
            name: 'Task 2',
            priority: Priority.MEDIUM,
            listId: list.id,
          },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('name');
    });
  });

  describe('/tasks/:id (GET)', () => {
    it('should return a single task', async () => {
      const task = await prisma.task.create({
        data: {
          name: 'Single Task',
          priority: Priority.LOW,
          listId: list.id,
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/tasks/${task.id}`)
        .expect(200);

      expect(response.body.id).toBe(task.id);
      expect(response.body.name).toBe(task.name);
    });

    it('should return 404 for non-existent task', async () => {
      await request(app.getHttpServer()).get('/tasks/999').expect(404);
    });
  });

  describe('/tasks/:id (PUT)', () => {
    it('should update a task', async () => {
      const task = await prisma.task.create({
        data: {
          name: 'Original Task Name',
          priority: Priority.LOW,
          listId: list.id,
        },
      });

      const updateDto = { name: 'Updated Task Name', priority: Priority.HIGH };

      const response = await request(app.getHttpServer())
        .put(`/tasks/${task.id}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.name).toBe(updateDto.name);
      expect(response.body.priority).toBe(updateDto.priority);

      const updatedTask = await prisma.task.findUnique({
        where: { id: task.id },
      });
      expect(updatedTask.name).toBe(updateDto.name);
    });
  });

  describe('/tasks/:id (DELETE)', () => {
    it('should delete a task', async () => {
      const task = await prisma.task.create({
        data: {
          name: 'To Delete',
          priority: Priority.LOW,
          listId: list.id,
        },
      });

      await request(app.getHttpServer())
        .delete(`/tasks/${task.id}`)
        .expect(204);

      const deletedTask = await prisma.task.findUnique({
        where: { id: task.id },
      });

      expect(deletedTask).toBeNull();
    });
  });
});

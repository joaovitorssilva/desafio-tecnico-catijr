import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('ListController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // obtém o prisma do moduleFixture (corrige problemas de provider)
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await prisma.$connect();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    // fecha a app antes de desconectar o prisma
    await app.close();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Limpar banco antes de cada teste
    await prisma.task.deleteMany();
    await prisma.list.deleteMany();
  });

  describe('/lists (POST)', () => {
    it('should create a list', async () => {
      const createListDto = {
        name: 'Test List',
        description: 'Test Description',
      };

      const response = await request(app.getHttpServer())
        .post('/lists')
        .send(createListDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createListDto.name);
      expect(response.body.description).toBe(createListDto.description);
    });

    it('should return 400 if name is missing', async () => {
      await request(app.getHttpServer())
        .post('/lists')
        .send({ description: 'Test' })
        .expect(400);
    });
  });

  describe('/lists (GET)', () => {
    it('should return all lists', async () => {
      // Criar listas primeiro
      await prisma.list.createMany({
        data: [
          { name: 'List 1', description: 'Desc 1' },
          { name: 'List 2', description: 'Desc 2' },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/lists')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('name');
    });

    it('should return empty array when no lists', async () => {
      const response = await request(app.getHttpServer())
        .get('/lists')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('/lists/:id (GET)', () => {
    it('should return a single list', async () => {
      const list = await prisma.list.create({
        data: { name: 'Test List', description: 'Test' },
      });

      const response = await request(app.getHttpServer())
        .get(`/lists/${list.id}`)
        .expect(200);

      expect(response.body.id).toBe(list.id);
      expect(response.body.name).toBe(list.name);
    });

    it('should return 404 for non-existent list', async () => {
      await request(app.getHttpServer()).get('/lists/999').expect(404);
    });
  });

  describe('/lists/:id (PUT)', () => {
    it('should update a list', async () => {
      const list = await prisma.list.create({
        data: { name: 'Original Name', description: 'Original' },
      });

      const updateDto = { name: 'Updated Name' };

      const response = await request(app.getHttpServer())
        .put(`/lists/${list.id}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.name).toBe('Updated Name');

      const updatedList = await prisma.list.findUnique({
        where: { id: list.id },
      });
      expect(updatedList.name).toBe('Updated Name');
    });
  });

  describe('/lists/:id (DELETE)', () => {
    it('should delete a list', async () => {
      const list = await prisma.list.create({
        data: { name: 'To Delete', description: 'Test' },
      });

      await request(app.getHttpServer())
        .delete(`/lists/${list.id}`)
        .expect(204);

      const deletedList = await prisma.list.findUnique({
        where: { id: list.id },
      });

      expect(deletedList).toBeNull();
    });
  });
});

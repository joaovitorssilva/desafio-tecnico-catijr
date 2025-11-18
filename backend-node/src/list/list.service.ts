import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) {}

  // [POST] /lists — cria uma nova lista (Valida unicidade via Prisma)
  async create(createListDto: CreateListDto) {
    try {
      return await this.prisma.list.create({
        data: createListDto,
      });
    } catch (error: any) {
      // verifique o código de erro em vez de usar instanceof/typing específico
      if (error?.code === 'P2002') {
        throw new ConflictException(
          `A lista com o nome "${createListDto.name}" já existe.`,
        );
      }
      throw error;
    }
  }

  // [GET] /lists — retorna todas as listas
  async findAll() {
    return this.prisma.list.findMany();
  }

  // [GET] /lists/:id — retorna a lista pelo ID (Valida se a lista existe)
  async findOne(id: number) {
    const list = await this.prisma.list.findUnique({
      where: { id },
    });
    if (!list) {
      throw new NotFoundException(`Lista com o ID ${id} não encontrada.`);
    }
    return list;
  }

  // [PUT] /lists/:id — atualiza os dados da lista
  async update(id: number, updateListDto: UpdateListDto) {
    try {
      await this.findOne(id);

      return await this.prisma.list.update({
        where: { id },
        data: updateListDto,
      });
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error; // Propaga 404
      }
      if (error?.code === 'P2002') {
        throw new ConflictException(
          `A lista com o nome "${updateListDto.name}" já existe.`,
        );
      }
      throw error;
    }
  }

  // [DELETE] /lists/:id — remove uma lista existente
  async remove(id: number) {
    await this.findOne(id);

    const tasksCount = await this.prisma.task.count({
      where: { listId: id },
    });

    if (tasksCount > 0) {
      throw new ConflictException(
        `Não é possível remover a lista ${id} pois há ${tasksCount} tarefas associadas.`,
      );
    }

    await this.prisma.list.delete({
      where: { id },
    });
  }
}

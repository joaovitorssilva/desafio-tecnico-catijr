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
    return this.prisma.list.findMany({
      include: {
        tasks: true,
      },
    });
  }

  // [GET] /lists/:id — retorna a lista pelo ID (Valida se a lista existe)
  async findOne(id: number) {
    const list = await this.prisma.list.findUnique({
      where: { id },
      include: {
        tasks: true,
      },
    });
    if (!list) {
      throw new NotFoundException(`Lista com o ID ${id} não encontrada.`);
    }
    return list;
  }

  // [PUT] /lists/:id — atualiza os dados da lista
  async update(id: number, updateListDto: UpdateListDto) {
    try {
      return await this.prisma.list.update({
        where: { id },
        data: updateListDto,
      });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException(`Lista com o ID ${id} não encontrada.`);
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
    try {
      await this.prisma.list.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException(`Lista com o ID ${id} não encontrada.`);
      }
      if (error?.code === 'P2003') {
        throw new ConflictException(
          `Não é possível remover a lista pois há tarefas associadas.`,
        );
      }
      throw error;
    }
  }
}

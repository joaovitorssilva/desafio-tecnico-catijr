// src/task/task.service.ts

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  private async validateTaskData(data: CreateTaskDto | UpdateTaskDto) {
    // 1. Validação de Data Futura
    if (data.expectedFinishDate) {
      const expectedDate = new Date(data.expectedFinishDate);
      if (expectedDate.getTime() < Date.now()) {
        throw new BadRequestException(
          'A data de conclusão esperada (expectedFinishDate) deve ser futura.',
        );
      }
    }

    // 2. Validação de listId
    const listIdToValidate =
      (data as CreateTaskDto).listId || (data as UpdateTaskDto).listId;

    if (listIdToValidate) {
      const list = await this.prisma.list.findUnique({
        where: { id: listIdToValidate },
      });
      if (!list) {
        throw new NotFoundException(
          `Lista com o ID ${listIdToValidate} não encontrada.`,
        );
      }
    }
  }

  // [POST] /tasks — cria uma nova tarefa
  async create(createTaskDto: CreateTaskDto) {
    await this.validateTaskData(createTaskDto);

    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        priority: createTaskDto.priority,
        expectedFinishDate: createTaskDto.expectedFinishDate
          ? new Date(createTaskDto.expectedFinishDate)
          : null,
      },
    });
  }

  // [GET] /tasks/:id — retorna a tarefa pelo ID
  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      throw new NotFoundException(`Tarefa com o ID ${id} não encontrada.`);
    }
    return task;
  }

  // [PUT] /tasks/:id — atualiza uma tarefa existente
  async update(id: number, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id); // Valida se a tarefa existe
    await this.validateTaskData(updateTaskDto); // Valida data e novo listId

    const dataToUpdate: any = {
      ...updateTaskDto,
      priority: updateTaskDto.priority,
      expectedFinishDate: updateTaskDto.expectedFinishDate
        ? new Date(updateTaskDto.expectedFinishDate)
        : undefined,
      finishDate: updateTaskDto.finishDate
        ? new Date(updateTaskDto.finishDate)
        : undefined,
    };

    return this.prisma.task.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  // [DELETE] /tasks/:id — remove a tarefa pelo ID
  async remove(id: number) {
    await this.findOne(id); // Valida se a tarefa existe

    await this.prisma.task.delete({
      where: { id },
    });
  }
}

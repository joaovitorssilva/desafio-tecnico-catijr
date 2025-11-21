import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, ParseIntPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // [POST] /tasks — cria uma nova tarefa
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  // [GET] /tasks — retorna todas as tarefas
  @Get()
  findAll() {
    return this.taskService.findAll();
  }
  
  // [GET] /tasks/:id — retorna a tarefa pelo ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }

  // [PUT] /tasks/:id — atualiza uma tarefa existente
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  // [DELETE] /tasks/:id — remove a tarefa pelo ID
  @Delete(':id')
  @HttpCode(204) // Retorna 204 No Content para deleções bem-sucedidas
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.remove(id);
  }
}
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Priority } from './priority.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(Priority)
  @IsNotEmpty()
  priority: Priority;

  @IsOptional()
  @IsDateString()
  expectedFinishDate?: string;

  @IsInt()
  @IsNotEmpty()
  listId: number;
}

import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Priority } from './priority.enum';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsDateString()
  expectedFinishDate?: string;

  @IsOptional()
  @IsInt()
  listId?: number;

  @IsOptional()
  @IsDateString()
  finishDate?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDTO {
  @ApiProperty({  
    description: 'The number of items to skip before starting to collect the result set',
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsPositive()
  @IsNumber({}, { message: 'limit must be a number' })
  limit?: number;

  @ApiProperty({
    description: 'The number of items to return',
    required: false,
    default: 0,
  })
  @IsOptional()
  @Min(0)
  @IsNumber({}, { message: 'offset must be a number' })
  offset?: number;
}

import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDTO {
  @IsOptional()
  @IsPositive()
  // transform
  limit?: number;
  @IsOptional()
  // @IsPositive()
  @Min(0)
  offset?: number;
}

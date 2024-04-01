import { ApiProperty } from '@nestjs/swagger';

export default class ReportDto {
  @ApiProperty({
    example: 'ID',
    description: 'will search by id, username',
    required: false,
  })
  search: string;

  @ApiProperty({ example: 'createdAt', required: true })
  orderBy: string;

  @ApiProperty({ example: 'DESC', required: true })
  orderType: 'ASC' | 'DESC';
}

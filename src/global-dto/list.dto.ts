import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class ListDto {
    @ApiProperty({ example: 0 })
    page: number

    @ApiProperty({ example: 10 })
    @IsOptional()
    limit: number

    @ApiProperty({ example: '{"name": "John Doe"}', required: false })
    conditions: string

    @ApiProperty({ example: 'name', required: false })
    orderBy: string

    @ApiProperty({ example: 'DESC', required: false })
    orderType: 'ASC' | 'DESC'
}

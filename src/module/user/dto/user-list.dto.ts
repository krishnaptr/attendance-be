import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
export default class UserListDto {
    @ApiProperty({
        example: 'ID',
        description: 'will search by id, username',
        required: false,
    })
    search: string

    @ApiProperty({ example: 1, required: true })
    page: number

    @ApiProperty({ example: 10, required: true })
    @IsOptional()
    limit: number

    @ApiProperty({ example: 'createdAt', required: true })
    orderBy: string

    @ApiProperty({ example: 'DESC', required: true })
    orderType: 'ASC' | 'DESC'
}

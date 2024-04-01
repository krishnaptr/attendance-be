import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
    @IsNotEmpty()
    @ApiProperty({ enum: ['admin','user']})
    role: string

    @IsNotEmpty()
    @ApiProperty({ example: '1' })
    id: number

    @IsNotEmpty()
    @ApiProperty({ example: 'admin' })
    username: string

    @IsNotEmpty()
    @ApiProperty({ example: 'true' })
    status: boolean
}

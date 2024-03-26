import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class LoginDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'admin' })
    username: string

    @IsNotEmpty()
    @ApiProperty({ example: 'pass' })
    password: string
}

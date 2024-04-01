import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
    @IsNotEmpty()
    @ApiProperty({ example: '$ecretPass' })
    password: string

    @IsNotEmpty()
    @ApiProperty({ example: '$ecretPass' })
    passwordRepeat: string

    @IsNotEmpty()
    @ApiProperty({ enum: ['admin','user']})
    role: string

    @IsNotEmpty()
    @ApiProperty({ example: 'admin' })
    username: string

    @IsNotEmpty()
    @ApiProperty({ example: 'true' })
    status: boolean
}

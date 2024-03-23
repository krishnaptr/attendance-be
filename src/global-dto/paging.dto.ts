import { ApiProperty } from '@nestjs/swagger'

export default class PagingDto {
    @ApiProperty()
    index: number
}

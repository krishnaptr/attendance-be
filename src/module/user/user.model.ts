import { ApiProperty } from '@nestjs/swagger'
import {
    Column,
    Model,
    Table,
    AutoIncrement,
    DataType,
    CreatedAt,
    UpdatedAt,
    PrimaryKey,
} from 'sequelize-typescript'

@Table({ tableName: 'user' })
export class User extends Model<User> {
    @ApiProperty()
    @AutoIncrement
    @PrimaryKey
    @Column({ type: DataType.BIGINT })
    id: number

    @ApiProperty()
    @Column({ type: DataType.STRING })
    username: string

    @ApiProperty()
    @Column({
        type: DataType.ENUM('admin', 'user'),
        defaultValue: 'admin',
    })
    role: 'admin' | 'user'

    @ApiProperty()
    @Column({ type: DataType.BOOLEAN })
    status: boolean

    @ApiProperty()
    @Column({ type: DataType.TEXT })
    credential: string

    @ApiProperty()
    @Column({ type: DataType.TEXT })
    uuid: string

    @ApiProperty()
    @CreatedAt
    @Column({ type: DataType.DATE })
    createdAt: Date

    @ApiProperty()
    @UpdatedAt
    @Column({ type: DataType.DATE })
    updatedAt: Date

    password: string
    passwordRepeat: string
}

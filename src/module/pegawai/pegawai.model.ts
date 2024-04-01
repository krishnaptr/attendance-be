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

@Table({ tableName: 'pegawai' })
export class Pegawai extends Model<Pegawai> {
    @ApiProperty()
    @AutoIncrement
    @PrimaryKey
    @Column({ type: DataType.BIGINT })
    id: number

    @ApiProperty()
    @Column({ type: DataType.BIGINT })
    noPegawai: number

    @ApiProperty()
    @Column({ type: DataType.STRING })
    idKartu: string

    @ApiProperty()
    @Column({ type: DataType.STRING })
    namaPegawai: string

    @ApiProperty()
    @Column({ type: DataType.STRING })
    fotoPegawai: string

    @ApiProperty()
    @Column({ type: DataType.STRING })
    jabatan: string

    @ApiProperty()
    @Column({ type: DataType.STRING })
    alamat: string

    @ApiProperty()
    @Column({ type: DataType.STRING })
    tanggalLahir: string

    @ApiProperty()
    @Column({
        type: DataType.ENUM('Pagi', 'Malam'),
        defaultValue: 'pagi',
    })
    shift: 'Pagi' | 'Malam'

    @ApiProperty()
    @Column({
        type: DataType.ENUM('FO', 'BAAK', 'Ruang Dosen'),
        defaultValue: 'FO',
    })
    lokasiAbsen: 'FO' | 'BAAK' | 'Ruang Dosen'

    @ApiProperty()
    @Column({
        type: DataType.ENUM('Laki-Laki', 'Perempuan'),
        defaultValue: 'Laki-Laki',
    })
    jenisKelamin: 'Laki-Laki' | 'Perempuan'

    @ApiProperty()
    @Column({ type: DataType.STRING })
    jamKerja: string

    @ApiProperty()
    @Column({ type: DataType.BOOLEAN })
    status: boolean

    @ApiProperty()
    @CreatedAt
    @Column({ type: DataType.DATE })
    createdAt: Date

    @ApiProperty()
    @UpdatedAt
    @Column({ type: DataType.DATE })
    updatedAt: Date
}

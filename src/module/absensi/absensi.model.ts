import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Model,
  Table,
  AutoIncrement,
  DataType,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Pegawai } from '../pegawai/pegawai.model';

@Table({ tableName: 'absensi' })
export class Absensi extends Model<Absensi> {
  @ApiProperty()
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.BIGINT })
  id: number;

  @ApiProperty()
  @ForeignKey(() => Pegawai)
  @Column({ type: DataType.BIGINT })
  idPegawai: number;

  @BelongsTo(() => Pegawai)
  pegawai: Pegawai;

  @ApiProperty()
  @Column({ type: DataType.STRING })
  noPegawai: string;

  @ApiProperty()
  @Column({ type: DataType.STRING })
  idKartu: string;

  @ApiProperty()
  @Column({ type: DataType.STRING })
  fotoPegawai: string;

  @ApiProperty()
  @Column({ type: DataType.STRING })
  jamAbsensi: string;

  @ApiProperty()
  @Column({ type: DataType.STRING })
  tipeAbsensi: string;

  @ApiProperty()
  @Column({ type: DataType.STRING })
  shift: string;

  @ApiProperty()
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  telat: boolean;

  @ApiProperty()
  @CreatedAt
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @ApiProperty()
  @UpdatedAt
  @Column({ type: DataType.DATE })
  updatedAt: Date;
}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Absensi } from './absensi.model';
import { AbsensiController } from './absensi.controller';
import { AbsensiService } from './absensi.service';
import { PegawaiModule } from '../pegawai/pegawai.module';

@Module({
  imports: [SequelizeModule.forFeature([Absensi]), PegawaiModule],
  controllers: [AbsensiController],
  providers: [AbsensiService],
  exports: [AbsensiService],
})
export class AbsensiModule {}

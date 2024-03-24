import { Module } from '@nestjs/common';
import { Pegawai } from './pegawai.model';
import { PegawaiController } from './pegawai.controller';
import { PegawaiService } from './pegawai.service';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    imports: [SequelizeModule.forFeature([Pegawai])],
    controllers: [PegawaiController],
    providers: [PegawaiService],
    exports: [PegawaiService],
  })
export class PegawaiModule {}

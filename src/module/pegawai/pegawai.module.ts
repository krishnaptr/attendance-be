import { Module } from '@nestjs/common';
import { Pegawai } from './pegawai.model';
import { PegawaiController } from './pegawai.controller';
import { PegawaiService } from './pegawai.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from '../user/user.module';

@Module({
  imports: [SequelizeModule.forFeature([Pegawai]), UserModule],
  controllers: [PegawaiController],
  providers: [PegawaiService],
  exports: [PegawaiService],
})
export class PegawaiModule {}

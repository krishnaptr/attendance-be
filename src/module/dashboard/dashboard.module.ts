import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PegawaiModule } from '../pegawai/pegawai.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PegawaiModule, UserModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}

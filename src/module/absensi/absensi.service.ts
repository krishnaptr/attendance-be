import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  concatColumn,
  dateFormat,
  generateFileName,
  uploadImage,
  validationImage,
} from 'src/library/utils';
import { Absensi } from './absensi.model';
import AbsensiDto from './dto/absensi.dto';
import { Op } from 'sequelize';
import { PegawaiService } from '../pegawai/pegawai.service';
import PegawaiListDto from '../pegawai/dto/pegawai-list.dto';
import { PagingDto } from '../../global-dto';
import { Pegawai } from '../pegawai/pegawai.model';
import ReportDto from '../../global-dto/report.dto';

@Injectable()
export class AbsensiService {
  constructor(
    @InjectModel(Absensi)
    public absensiModel: typeof Absensi,
    public pegawaiS: PegawaiService,
  ) {}

  private readonly locationFile = `assets/absen/`;
  private readonly publicFile = `${process.env.IMAGE_PUBLIC_URL}${this.locationFile}`;

  getLocationFile(): string {
    return this.locationFile;
  }

  getPublicFile(): string {
    return this.publicFile;
  }

  async create(params: any): Promise<Absensi> {
    return await this.absensiModel.create(params);
  }

  async findOne(options: any): Promise<Absensi> {
    return await this.absensiModel.findOne(options);
  }

  async findAndCountAll(options: any): Promise<any> {
    return await this.absensiModel.findAndCountAll(options);
  }

  async absensi(params: AbsensiDto, imageData: any): Promise<any> {
    const pegawai = await this.pegawaiS.findOne({
      where: { idKartu: params.idKartu },
    });
    if (pegawai) {
      const nowDate = dateFormat(new Date(), 'yyyy-MM-d');
      const checkAbsen = await this.findOne({
        where: {
          tipeAbsensi: params.tipeAbsensi,
          idKartu: params.idKartu,
          createdAt: { [Op.substring]: nowDate },
        },
      });
      if (!checkAbsen) {
        const imagePegawai = generateFileName(imageData.originalname);
        await validationImage(imageData);

        const data = await this.getDataByCode(
          await this.getNowDays(),
          pegawai.jamKerja,
        );

        if (!data) {
          throw new BadRequestException(
            'Anda Tidak Dapat Absen, Dikarenakan Diluar Jam Kerja!',
          );
        }

        const absensi = await this.create({
          idPegawai: pegawai.id,
          noPegawai: pegawai.noPegawai,
          idKartu: params.idKartu,
          fotoPegawai: imagePegawai,
          jamAbsensi: params.jamAbsensi,
          tipeAbsensi: params.tipeAbsensi,
          shift: pegawai.shift,
        });
        if (params.tipeAbsensi == 'masuk') {
          const targetHour = parseInt(params.jamAbsensi.split(':')[0]);
          const targetMinute = parseInt(params.jamAbsensi.split(':')[1]);

          const currentHour = parseInt(data.masuk.split(':')[0]);
          const currentMinute = parseInt(data.masuk.split(':')[1]);
          if (
            (currentHour < targetHour && currentMinute < targetMinute) ||
            (currentHour == targetHour && currentMinute < targetMinute)
          ) {
            absensi.telat = true;
            await absensi.save();
          }
        }
        if (absensi) {
          await uploadImage(
            imagePegawai,
            imageData.buffer,
            this.getLocationFile(),
          );
        }
        return absensi;
      }
      throw new BadRequestException('Anda Sudah Melakukan Absen Hari Ini!');
    }
    throw new BadRequestException('Kartu Tidak Terdaftar!');
  }

  async listData(params: PagingDto, tipeAbsensi: string): Promise<any> {
    const where = { tipeAbsensi };
    if (params.search) {
      Object.assign(where, {
        [Op.or]: [
          {
            '$pegawai.noPegawai$': { [Op.substring]: params.search },
          },
          {
            '$pegawai.namaPegawai$': { [Op.substring]: params.search },
          },
        ],
      });
    }
    const data = await this.findAndCountAll({
      include: { model: Pegawai, required: true },
      where: where,
      order: [
        ['createdAt', 'DESC'],
        [params.orderBy, params.orderType],
      ],
      offset: Number((params.page - 1) * params.limit),
      limit: Number(params.limit),
    });
    const page = Math.ceil(data.count / params.limit);
    return { count: Number(data.count), pages: page, rows: data.rows };
  }

  async listReport(params: ReportDto, tipeAbsensi: string): Promise<any> {
    const where = { tipeAbsensi };
    if (params.search) {
      Object.assign(where, {
        [Op.or]: [
          {
            '$pegawai.noPegawai$': { [Op.substring]: params.search },
          },
          {
            '$pegawai.namaPegawai$': { [Op.substring]: params.search },
          },
        ],
      });
    }
    const data = await this.findAndCountAll({
      include: { model: Pegawai, required: true },
      where: where,
      order: [
        ['createdAt', 'DESC'],
        [params.orderBy, params.orderType],
      ],
    });
    return data.rows;
  }

  async getDataByCode(code: string, dataString: string) {
    const parsedData = JSON.parse(dataString);
    for (const item of parsedData) {
      if (item.code === code) {
        return item;
      }
    }
    return null;
  }

  async getNowDays() {
    const currentDay = new Date()
      .toLocaleString('en-US', { weekday: 'long' })
      .toLowerCase();
    const dayToCodeMap = {
      monday: 'SEN',
      tuesday: 'SEL',
      wednesday: 'RAB',
      thursday: 'KAM',
      friday: 'JUM',
      saturday: 'SAB',
      sunday: 'MING',
    };
    const normalizedDay = currentDay.toLowerCase();
    return dayToCodeMap[normalizedDay];
  }
}

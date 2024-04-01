import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Image {
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
}

export default class AbsensiDto {
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    description: 'No Pegawai seperti NIP',
    required: true,
  })
  noPegawai: number;

  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    description: 'Id Kartu Dari NFC Card',
    required: true,
  })
  idKartu: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  fotoPegawai: Image;

  @IsNotEmpty()
  @ApiProperty({
    example: '08:30',
    description: 'Jam Absen format hh:mm',
    required: true,
  })
  jamAbsensi: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'masuk',
    description: 'tipe absensi masuk / keluar',
    required: true,
  })
  tipeAbsensi: 'masuk' | 'keluar';
}

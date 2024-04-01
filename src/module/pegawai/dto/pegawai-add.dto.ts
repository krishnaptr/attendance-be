import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Image {
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
}

export default class PegawaiAddDto {
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

  @IsNotEmpty()
  @ApiProperty({ example: 'John', description: 'Nama Pegawai', required: true })
  namaPegawai: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  fotoPegawai: Image;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Dosen',
    description: 'Jabatan Pegawai',
    required: true,
  })
  jabatan: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Panjer',
    description: 'Alamat Pegawai',
    required: true,
  })
  alamat: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '2000-06-01',
    description: 'Tanggal Lahir Pegawai',
    required: true,
  })
  tanggalLahir: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Pagi',
    description: 'Shift Pegawai',
    required: true,
  })
  shift: 'Pagi' | 'Malam';

  @IsNotEmpty()
  @ApiProperty({
    example: 'Laki-Laki',
    description: 'jenis Kelamin Pegawai',
    required: true,
  })
  jenisKelamin: 'Laki-Laki' | 'Perempuan';

  @IsNotEmpty()
  @ApiProperty({
    example:
      '[{"hari": "jumat","code":"JUM","masuk":"08:30","pulang": "15:30"}]',
    description: 'Jam Kerja Pegawai',
    required: true,
  })
  jamKerja: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Status Pegawai', required: true })
  status: boolean;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Ruang Dosen',
    description: 'Tempat Absen',
    required: true,
  })
  lokasiAbsen: 'FO' | 'BAAK' | 'Ruang Dosen';
}

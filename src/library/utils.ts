import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';
import sequelize from 'sequelize';
import * as Fs from '@supercharge/fs';

/**
 * generate file name fileName-timestamp. extension
 * @param nameFile
 */
export function generateFileName(nameFile: string): string {
  const extension = Fs.extension(nameFile);
  const name = `${Fs.filename(nameFile)}-`;
  return `${name}${new Date()
    .toISOString()
    .replace(new RegExp(':', 'g'), '_')
    .replace(new RegExp(':', 'g'), '_')
    .replace(new RegExp(' ', 'g'), '-')}${extension}`;
}

/**
 * get extension file
 * @param nameFile
 */
export function getExtensionFile(nameFile: string): string {
  return Fs.extension(nameFile).replace('.', '');
}

/**
 * upload image
 * @param fileName
 * @param image
 * @param folder
 */
export async function uploadImage(
  fileName: string,
  image: any,
  folder: string,
) {
  if (process.env.SERVER_OS === 'WINDOWS') {
    const dir = `${process.env.STATIC_ASSET}\\${folder}\\`;
    const imagePath = dir + fileName;
    if (!fs.existsSync(`${process.cwd()}\\${dir}`)) {
      fs.mkdirSync(`${process.cwd()}\\${dir}`, {
        recursive: true,
      });
    }
    fs.writeFileSync(`${process.cwd()}\\${imagePath}`, image);
  } else {
    const dir = `${process.env.STATIC_ASSET}/${folder}/`;
    const imagePath = dir + fileName;
    if (!fs.existsSync(`${process.env.PWD}/${dir}`)) {
      fs.mkdirSync(`${process.env.PWD}/${dir}`, {
        recursive: true,
      });
    }
    fs.writeFileSync(`${process.env.PWD}/${imagePath}`, image);
  }
}

/**
 * use to read file on local
 * @param folder
 * @param fileName
 */
export function readImageFile(folder: string, fileName: string): Buffer {
  if (process.env.SERVER_OS === 'WINDOWS') {
    return fs.readFileSync(
      `${process.cwd()}\\${process.env.STATIC_ASSET}\\${folder}\\${fileName}`,
    );
  } else {
    return fs.readFileSync(
      `${process.env.PWD}/${process.env.STATIC_ASSET}/${folder}/${fileName}`,
    );
  }
}

/**
 * format date
 * @param x
 * @param y
 */
export function dateFormat(x, y) {
  const z = {
    M: x.getMonth() + 1,
    d: x.getDate(),
    h: x.getHours(),
    m: x.getMinutes(),
    s: x.getSeconds(),
  };
  y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
    return ((v.length > 1 ? '0' : '') + z[v.slice(-1)]).slice(-2);
  });

  return y.replace(/(y+)/g, function (v) {
    return x.getFullYear().toString().slice(-v.length);
  });
}

/**
 * validate each upload image
 * @param image
 */
export async function validationImage(image: any) {
  if (!image) {
    throw new BadRequestException('image must be filled');
  }
  if (image.mimetype.search('image/') === -1) {
    throw new BadRequestException('image must be an image');
  }
  if (image.buffer.byteLength > 5e6) {
    throw new BadRequestException('image must be lower than 6Mb');
  }
}

/**
 * concat column
 * @param alias
 * @param concat
 */
export function concatColumn(alias: string, concat: string) {
  return [sequelize.fn('concat', sequelize.literal(concat)), alias];
}

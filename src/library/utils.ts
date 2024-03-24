import * as fs from 'fs'
import { BadRequestException } from '@nestjs/common'
import sequelize from 'sequelize'
import * as Fs from '@supercharge/fs'

/**
 * generate file name fileName-timestamp. extension
 * @param nameFile
 */
export function generateFileName(nameFile: string): string {
    const extension = Fs.extension(nameFile)
    const name = `${Fs.filename(nameFile)}-`
    return `${name}${new Date()
        .toISOString()
        .replace(new RegExp(':', 'g'), '_')
        .replace(new RegExp(':', 'g'), '_')
        .replace(new RegExp(' ', 'g'), '-')}${extension}`
}

/**
 * get extension file
 * @param nameFile
 */
export function getExtensionFile(nameFile: string): string {
    return Fs.extension(nameFile).replace('.', '')
}

/**
 * upload image
 * @param fileName
 * @param image
 * @param folder
 */
export function uploadImage(fileName: string, image: any, folder: string) {
    if (process.env.SERVER_OS === 'WINDOWS') {
        const dir = `${process.env.STATIC_ASSET}\\${folder}\\`
        const imagePath = dir + fileName
        if (!fs.existsSync(`${process.cwd()}\\${dir}`)) {
            fs.mkdirSync(`${process.cwd()}\\${dir}`, {
                recursive: true,
            })
        }
        fs.writeFileSync(`${process.cwd()}\\${imagePath}`, image)
    } else {
        const dir = `${process.env.STATIC_ASSET}/${folder}/`
        const imagePath = dir + fileName
        if (!fs.existsSync(`${process.env.PWD}/${dir}`)) {
            fs.mkdirSync(`${process.env.PWD}/${dir}`, {
                recursive: true,
            })
        }
        fs.writeFileSync(`${process.env.PWD}/${imagePath}`, image)
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
            `${process.cwd()}\\${
                process.env.STATIC_ASSET
            }\\${folder}\\${fileName}`,
        )
    } else {
        return fs.readFileSync(
            `${process.env.PWD}/${process.env.STATIC_ASSET}/${folder}/${fileName}`,
        )
    }
}
/**
 * convert image to base64
 * @param folder
 * @param fileName
 */
export function parsingImageToBase64(folder: string, fileName: string): string {
    let image: Buffer
    if (process.env.SERVER_OS === 'WINDOWS') {
        image = fs.readFileSync(`${process.cwd()}\\${folder}${fileName}`)
    } else {
        image = fs.readFileSync(`${process.env.PWD}/${folder}${fileName}`)
    }
    const extension =
        getExtensionFile(fileName) === 'jpg'
            ? 'jpeg'
            : getExtensionFile(fileName)
    return `data:image/${extension};base64,${image.toString('base64')}`
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
    }
    y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
        return ((v.length > 1 ? '0' : '') + z[v.slice(-1)]).slice(-2)
    })

    return y.replace(/(y+)/g, function (v) {
        return x.getFullYear().toString().slice(-v.length)
    })
}

/**
 * validate upload image multiple
 * @param image
 */
export function validationMultiImage(image: any) {
    for (const imgValidator in image) {
        const dataImage = image[imgValidator]
        if (dataImage[0].mimetype.search('image/') === -1) {
            throw new BadRequestException('image must be an image')
        }
        if (dataImage[0].buffer.byteLength > 5e6) {
            throw new BadRequestException('image must be lower than 6Mb')
        }
    }
}

/**
 * validate each upload image
 * @param image
 */
export function validationImage(image: any) {
    if (!image) {
        throw new BadRequestException('image must be filled')
    }
    if (image.mimetype.search('image/') === -1) {
        throw new BadRequestException('image must be an image')
    }
    if (image.buffer.byteLength > 5e6) {
        throw new BadRequestException('image must be lower than 6Mb')
    }
}

/**
 * count different days
 * @param startDate
 * @param endDate
 */
export async function countDifferentDays(
    startDate: Date,
    endDate: Date,
): Promise<number> {
    if (startDate.getTime() >= endDate.getTime()) {
        const diff = startDate.getTime() - endDate.getTime()
        return Math.ceil(diff / (1000 * 3600 * 24))
    }
    return 0
}

/**
 * concat column
 * @param alias
 * @param concat
 */
export function concatColumn(alias: string, concat: string) {
    return [sequelize.fn('concat', sequelize.literal(concat)), alias]
}

/**
 * find the word in the sentence
 * @param text
 * @param dataFind
 */
export function getIndexOf(text: string, dataFind: string): boolean {
    return text.toLowerCase().indexOf(dataFind.toLowerCase()) < 0
}

/**
 * use make local date different
 * example: 460 minute -> 7,67 hour - > -07:67
 * @param totalMinutes
 * @param diffTime
 */
export function toHoursAndMinutes(totalMinutes, diffTime) {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return `${diffTime < 0 ? '+' : '-'}${padToTwoDigits(
        hours,
    )}:${padToTwoDigits(minutes)}`
}
export function padToTwoDigits(num) {
    return num.toString().padStart(2, '0')
}

/**
 * upload file
 * @param fileName
 * @param image
 * @param folder
 */
export function uploadFile(fileName: string, image: any, folder: string) {
    const imagePath = folder + fileName
    fs.writeFileSync(`${imagePath}`, image.buffer)
}

/**
 * read JSON file
 * @param location
 * @param fileName
 */
export function readJsonFile(location: string, fileName: string) {
    try {
        if (process.env.SERVER_OS === 'WINDOWS') {
            const data = fs.readFileSync(
                `${process.cwd()}\\${location}${fileName}`,
            )
            return JSON.parse(data.toString())
        } else {
            const data = fs.readFileSync(
                `${process.env.PWD}/${location}${fileName}`,
            )
            return JSON.parse(data.toString())
        }
    } catch (e) {
        console.log(e.message)
    }
}
export function parserJson(data: any, lang: string) {
    const resData = {}
    for (const lv in data) {
        const dataLv = data[lv]
        if (Array.isArray(dataLv)) {
            const data = []
            for (const arr of dataLv) {
                data.push(arr[lang])
            }
            Object.assign(resData, {
                [lv]: data,
            })
        } else {
            Object.assign(resData, {
                [lv]: parserJson(dataLv, lang),
            })
        }
    }
    return resData
}
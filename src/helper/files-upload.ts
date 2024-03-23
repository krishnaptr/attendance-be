import fs from 'fs'

export class Image {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    buffer: Buffer
}

export default async function saveImage(
    file: Image,
    folder: string,
): Promise<{ success: boolean; message: string; fileName: string }> {
    try {
        if (file) {
            if (file.mimetype.search('image/') === -1) {
                return {
                    success: false,
                    message: 'image must be an image',
                    fileName: '',
                }
            }

            if (file.buffer.byteLength > 5e6) {
                return {
                    success: false,
                    message: 'image must be lower than 6Mb',
                    fileName: '',
                }
            }
            const fileName =
                new Date().toISOString().replace(new RegExp(':', 'g'), '_') +
                file.originalname
                    .replace(new RegExp(':', 'g'), '_')
                    .replace(new RegExp(' ', 'g'), '-')
            if (process.env.SERVER_OS === 'WINDOWS') {
                const dir = `${process.env.IMG_DIR}\\${folder}\\`
                const imagePath = dir + fileName
                if (!fs.existsSync(`${process.cwd()}\\${dir}`)) {
                    fs.mkdirSync(`${process.cwd()}\\${dir}`, {
                        recursive: true,
                    })
                }
                fs.writeFileSync(`${process.cwd()}\\${imagePath}`, file.buffer)
            } else {
                const dir = `${process.env.IMG_DIR}/${folder}/`
                const imagePath = dir + fileName
                if (!fs.existsSync(`${process.env.PWD}/${dir}`)) {
                    fs.mkdirSync(`${process.env.PWD}/${dir}`, {
                        recursive: true,
                    })
                }
                fs.writeFileSync(`${process.env.PWD}/${imagePath}`, file.buffer)
            }
            console.log('File saved', fileName)
            return { success: true, message: 'ok', fileName: fileName }
        }
    } catch (e) {
        console.log(e, 'File not saved!')
        return { success: false, message: 'cannot processed', fileName: '' }
    }
}

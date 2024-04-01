import { Response } from 'express'

export class Result {
    message: string
    status: boolean
    total: number
    code: number
    data: string | any
    err: any
}

export function response(code, data, msg, status?) {
    let result = new Result()
    result.code = code
    result.data = data
    result.message = msg
    result.status = status

    return result
}

export function respond(res: Response, code, data, msg, status?) {
    res.status(code).json(response(code, data, msg, status))
}

export function responseOk(data) {
    return response(200, data, 'OK', true)
}

export function respondOk(res: Response, data) {
    res.status(200).json(responseOk(data))
}

export function responseOk2(data) {
    return response(201, data, 'OK', true)
}

export function respondOk2(res: Response, data) {
    res.status(201).json(responseOk2(data))
}

export function responseBad(msg?) {
    return response(400, null, msg || 'Bad Request!', false)
}

export function respondBad(res: Response, msg?) {
    res.status(400).json(responseBad(msg))
}

export function responseForbidden(msg?) {
    return response(401, null, msg || 'Forbidden!', false)
}

export function respondForbidden(res: Response, msg?) {
    res.status(401).json(responseForbidden(msg))
}

export function response404(msg?) {
    return response(404, null, msg || 'Record not found!', false)
}

export function respond404(res: Response, msg?) {
    res.status(404).json(response404(msg))
}

export function response500(msg?) {
    return response(500, null, msg || 'Internal server error!', false)
}

export function respond500(res: Response, msg?) {
    res.status(500).json(response500(msg))
}

export function responsePagination(data, totalData, totalPage) {
    let result: any = {}
    result.success = {
        message: 'OK',
        totalData: totalData,
        totalPage: totalPage,
    }
    result.data = data
    return response(200, result, 'OK', true)
}

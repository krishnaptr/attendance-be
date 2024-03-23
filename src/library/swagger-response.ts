import { HttpStatus } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

type Constructor<I> = new (...args: any[]) => I

export interface IResponse {
    message: string
    data?: any
    statusCode: number
}

export interface IErrorResponse {
    statusCode: number
    message: string
    error: string
}

export interface IErrorArrayResponse {
    statusCode: number
    message: string
    errors: string[]
}

export function CustomApiResponse(statusCode: number): Constructor<IResponse> {
    class Response implements Response {
        @ApiProperty({ example: statusCode })
        readonly statusCode: number

        @ApiProperty({ example: 'Success response message' })
        readonly message: string
    }
    return Response
}

export function CustomApiErrorResponse(
    statusCode: number,
): Constructor<IErrorResponse> {
    class ErrorResponse implements ErrorResponse {
        @ApiProperty({ example: statusCode })
        readonly statusCode: number

        @ApiProperty({ example: 'Error response message' })
        readonly message: string

        @ApiProperty({ example: 'Error response message' })
        readonly error: string
    }
    return ErrorResponse
}

export function CustomApiErrorArrayResponse(
    statusCode: number,
): Constructor<IErrorArrayResponse> {
    class ErrorArrayResponse implements ErrorArrayResponse {
        @ApiProperty({ example: statusCode })
        readonly statusCode: number

        @ApiProperty({ example: 'Error response message' })
        readonly message: string

        @ApiProperty({ example: '[Error response message]' })
        readonly errors: string[]
    }
    return ErrorArrayResponse
}

export function CustomApiUnauthorizedResponse(): Constructor<IErrorResponse> {
    class UnauthorizedResponse implements UnauthorizedResponse {
        @ApiProperty({ example: HttpStatus.UNAUTHORIZED })
        readonly statusCode: number

        @ApiProperty({ example: 'Unauthorized' })
        readonly message: string

        @ApiProperty({ example: 'Unauthorized' })
        readonly error: string
    }
    return UnauthorizedResponse
}

export function CustomApiNotFoundResponse(): Constructor<IErrorResponse> {
    class NotFoundResponse implements NotFoundResponse {
        @ApiProperty({ example: HttpStatus.NOT_FOUND })
        readonly statusCode: number

        @ApiProperty({ example: 'Not found' })
        readonly message: string

        @ApiProperty({ example: 'Not found' })
        readonly error: string
    }
    return NotFoundResponse
}

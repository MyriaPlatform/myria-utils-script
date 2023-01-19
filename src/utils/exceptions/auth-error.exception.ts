import { HttpStatus } from '@nestjs/common';
import { MyriaErrorException } from './myria-error-exception';

export class AuthErrorException extends MyriaErrorException {
    // Auth
    static readonly AUTH_X_API_KEY_NOT_FOUND = new MyriaErrorException(
        40000,
        'Auth x-api-key not found',
        HttpStatus.UNAUTHORIZED,
    );

    static readonly AUTH_X_API_KEY_INCORRECT = new MyriaErrorException(
        40001,
        'Auth x-api-key incorrect',
        HttpStatus.BAD_REQUEST,
    );

    static readonly AUTH_X_API_ADMIN_KEY_NOT_FOUND = new MyriaErrorException(
        40002,
        'Auth x-api-admin-key not found',
        HttpStatus.UNAUTHORIZED,
    );

    static readonly AUTH_X_API_ADMIN_KEY_INCORRECT = new MyriaErrorException(
        40003,
        'Auth x-api-admin-key incorrect',
        HttpStatus.BAD_REQUEST,
    );
}

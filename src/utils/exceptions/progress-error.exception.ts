import { HttpStatus } from '@nestjs/common';
import { MyriaErrorException } from './myria-error-exception';

export class ProgressErrorException extends MyriaErrorException {
    static readonly USER_PROGRESS_NOT_FOUND = new MyriaErrorException(
        60000,
        'User {1} does not have progress in campaign {2}',
        HttpStatus.NOT_FOUND,
    );
}

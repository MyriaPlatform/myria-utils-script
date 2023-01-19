import { HttpStatus } from '@nestjs/common';
import { MyriaErrorException } from './myria-error-exception';

export class AllianceErrorException extends MyriaErrorException {
    static readonly ALLIANCE_NOT_FOUND = new MyriaErrorException(
        90000,
        'Alliance not found',
        HttpStatus.NOT_FOUND,
    );

    static readonly ALLIANCE_NOT_REGISTERED = new MyriaErrorException(
        90001,
        'Alliance is not registered yet',
        HttpStatus.BAD_REQUEST,
    );
}

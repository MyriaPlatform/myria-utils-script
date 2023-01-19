import { HttpStatus } from '@nestjs/common';
import { MyriaErrorException } from './myria-error-exception';

export class MissionErrorException extends MyriaErrorException {
    static readonly MISSION_NOT_FOUND = new MyriaErrorException(
        60000,
        'Mission not found',
        HttpStatus.NOT_FOUND,
    );
    static readonly ALREADY_FINISHED_THIS_MISSION_TODAY =
        new MyriaErrorException(
            60001,
            'Already finished this mission today',
            HttpStatus.BAD_REQUEST,
        );
    static readonly MISSION_PROGRESS_NOT_FOUND = new MyriaErrorException(
        60002,
        'Mission progress not found',
        HttpStatus.NOT_FOUND,
    );
    static readonly MISSION_ONLY_ALLOWED_ONCE = new MyriaErrorException(
        60003,
        'Mission can only be performed once',
        HttpStatus.BAD_REQUEST,
    );
    static readonly CAN_NOT_ADD_USER_TO_DISCORD_SERVER =
        new MyriaErrorException(
            60004,
            'Cannot add user to discord server',
            HttpStatus.BAD_GATEWAY,
        );
    static readonly INVALID_MISSION_CODE = new MyriaErrorException(
        60005,
        'Invalid mission code',
        HttpStatus.BAD_REQUEST,
    );
    static readonly MISSION_PROGRESS_DIFFERENT_AVAILABLE =
        new MyriaErrorException(
            60006,
            'Mission can only be done when status is AVAILABLE',
            HttpStatus.BAD_REQUEST,
        );
    static readonly MISSION_ALREADY_COMPLETED = new MyriaErrorException(
        60007,
        'You have already completed this mission',
        HttpStatus.CONFLICT,
    );
    static readonly MISSION_PROGRESS_NOT_AVAILABLE_FOR_USER_CODE =
        new MyriaErrorException(
            60008,
            'Mission {1} is not AVAILABLE for user {2}',
            HttpStatus.NOT_FOUND,
        );
}

import { HttpStatus } from '@nestjs/common';
import { MyriaErrorException } from './myria-error-exception';

export class UserErrorException extends MyriaErrorException {
    // User
    static readonly USER_NOT_REGISTERED = new MyriaErrorException(
        80000,
        'User is not registered yet',
        HttpStatus.BAD_REQUEST,
    );

    static readonly USER_NOT_FOUND = new MyriaErrorException(
        80001,
        'User not found',
        HttpStatus.NOT_FOUND,
    );

    static readonly USER_MYRIA_ACCOUNT_NOT_FOUND = new MyriaErrorException(
        80002,
        `You must create a Myria's Account first at myria.com`,
        HttpStatus.BAD_REQUEST,
    );

    static readonly USER_CREATE_ERROR = new MyriaErrorException(
        80003,
        `User create error`,
        HttpStatus.BAD_REQUEST,
    );

    static readonly USER_MYRIA_UNABLE_TO_REGISTER_L2_WALLET =
        new MyriaErrorException(
            80004,
            `Unable to register L2 wallet`,
            HttpStatus.BAD_REQUEST,
        );

    static readonly USER_CAMPAIGN_NOT_FOUND = new MyriaErrorException(
        80005,
        'User campaign not found',
        HttpStatus.NOT_FOUND,
    );

    static readonly USER_EXISTED_ALLIANCE = new MyriaErrorException(
        80006,
        'User has existed alliance',
        HttpStatus.BAD_REQUEST,
    );

    static readonly USER_EXISTED = new MyriaErrorException(
        80007,
        `User existed`,
        HttpStatus.BAD_REQUEST,
    );
    static readonly USER_EMAIL_NOT_VERIFIED = new MyriaErrorException(
        80008,
        `User email is not verified`,
        HttpStatus.BAD_REQUEST,
    );
    static readonly USER_HAS_NO_ROLE_IN_SERVER = new MyriaErrorException(
        80009,
        `You do not have any role in Myria Server`,
        HttpStatus.BAD_REQUEST,
    );
    static readonly UNABLE_TO_FIND_USER_DISCORD = new MyriaErrorException(
        80010,
        `Unable to find user on Discord`,
        HttpStatus.NOT_FOUND,
    );
    static readonly UNABLE_TO_GET_USER_DISCORD_TOKEN = new MyriaErrorException(
        80011,
        `Unable to get user Discord access token`,
        HttpStatus.NOT_FOUND,
    );
}

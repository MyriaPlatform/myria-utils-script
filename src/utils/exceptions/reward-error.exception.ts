import { HttpStatus } from '@nestjs/common';
import { MyriaErrorException } from './myria-error-exception';

export class RewardErrorException extends MyriaErrorException {
    static readonly REWARD_NOT_FOUND = new MyriaErrorException(
        50000,
        'Reward not found',
        HttpStatus.NOT_FOUND,
    );

    static readonly USER_NOT_ENOUGH_POINT_REWARD = new MyriaErrorException(
        50001,
        'You do not have enough points for this reward',
        HttpStatus.BAD_REQUEST,
    );

    static readonly USER_ALREADY_CLAIM_REWARD = new MyriaErrorException(
        50002,
        'You have already claimed this reward',
        HttpStatus.BAD_REQUEST,
    );

    static readonly REWARD_CLAIM_ERROR = new MyriaErrorException(
        50003,
        'Error when claiming user reward',
        HttpStatus.INTERNAL_SERVER_ERROR,
    );
    static readonly USER_REWARD_SAME_ALLIANCE = new MyriaErrorException(
        50004,
        'You cannot claim this reward because of different alliances',
        HttpStatus.BAD_REQUEST,
    );
    static readonly REWARD__UPDATE_REQUEST_EMPTY = new MyriaErrorException(
        50005,
        'All values in update input cannot be empty',
        HttpStatus.BAD_REQUEST,
    );
    static readonly REWARD_POINT_AND_THRESHOLD_CANNOT_BE_MODIFY_AFTER_START =
        new MyriaErrorException(
            50006,
            'Reward point and threshold cannot be modify after campaign started',
            HttpStatus.BAD_REQUEST,
        );
}

import { HttpStatus } from '@nestjs/common';
import { MyriaErrorException } from './myria-error-exception';

export class CampaignErrorException extends MyriaErrorException {
    // Campaign
    static readonly CAMPAIGN_NOT_FOUND = new MyriaErrorException(
        70000,
        'Campaign not found',
        HttpStatus.NOT_FOUND,
    );
    static readonly CAMPAIGN_CODE_EXISTED = new MyriaErrorException(
        70001,
        'Campaign with code {1} already existed',
        HttpStatus.CONFLICT,
    );
    static readonly CAMPAIGN_MISSION_NOT_FOUND = new MyriaErrorException(
        70002,
        'Campaign mission not found',
        HttpStatus.NOT_FOUND,
    );
    static readonly USER_ALREADY_JOIN_CAMPAIGN = new MyriaErrorException(
        70003,
        'User has already joined this campaign',
        HttpStatus.CONFLICT,
    );
    static readonly CAMPAIGN_ALREADY_ENDED = new MyriaErrorException(
        70004,
        'Campaign has already ended',
        HttpStatus.BAD_REQUEST,
    );
    static readonly CAMPAIGN_END_DATE_NOT_GREATER_THAN_START_DATE =
        new MyriaErrorException(
            70005,
            'Campaign endedAt date must be greater than startedAt date',
            HttpStatus.BAD_REQUEST,
        );
    static readonly CAMPAIGN_MISSION_REQUEST_PARAMS = new MyriaErrorException(
        70006,
        'Campagin missing request params title, description or actionTitle',
        HttpStatus.BAD_REQUEST,
    );
}

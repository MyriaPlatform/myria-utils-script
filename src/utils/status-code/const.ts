import { HttpStatus } from '@nestjs/common';

/*
Error code from invoking MyriaCore then process updating on-demand
*/
export enum MYRIA_CORE_ERROR_CODE {
    ORDER_WAS_FULL_FILLED = 1132,
    ORDER_WAS_REMOVED = 1133,
}

/**
Project: 1000 → 1999
Asset: 2000 → 2999
Collection: 3000 → 3999
Fee: 4000 → 4999
Mint: 5000 → 5999
Order: 6000 → 6999
Trade: 7000 → 7999
User: 8000 → 8999
 */
export class MYRIA_ERROR {
    static readonly PROJECT_CONFLICT = new MYRIA_ERROR(
        1000,
        'Project conflict',
        HttpStatus.CONFLICT,
    );
    static readonly PROJECT_NOT_FOUND = new MYRIA_ERROR(
        1001,
        'Project not found',
        HttpStatus.NOT_FOUND,
    );
    static readonly PROJECT_STARK_KEY_IS_NOT_EXISTED = new MYRIA_ERROR(
        1002,
        'StarkKey is not existed',
        HttpStatus.BAD_REQUEST,
    );

    static readonly ONLY_PROJECT_OWNER_CAN_UPDATE_PROJECT = new MYRIA_ERROR(
        1003,
        'Only project owner can update project',
        HttpStatus.BAD_REQUEST,
    );

    // Asset
    static readonly ASSET_NOT_FOUND = new MYRIA_ERROR(
        2000,
        'Asset not found',
        HttpStatus.NOT_FOUND,
    );

    static readonly ASSET_STATUS_MINTED_NOT_FOUND = new MYRIA_ERROR(
        2001,
        'Minted asset with id {1} does not exist',
        HttpStatus.BAD_REQUEST,
    );

    static readonly ASSET_WITHDRAW_TRANSACTION_NOT_EXIST = new MYRIA_ERROR(
        2007,
        'Asset withdraw transaction does not exist',
        HttpStatus.BAD_REQUEST,
    );

    static readonly ASSET_WITHDRAW_TRANSACTION_COMPLETE_FAILED =
        new MYRIA_ERROR(
            2008,
            'Asset complete withdraw transaction failed',
            HttpStatus.INTERNAL_SERVER_ERROR,
        );

    static readonly ASSET_IS_NOT_PERMISSION_TO_UPDATE = new MYRIA_ERROR(
        2009,
        'Only the collection owner have permission to update this asset',
        HttpStatus.INTERNAL_SERVER_ERROR,
    );

    // Collection
    static readonly COLLECTION_NOT_FOUND = new MYRIA_ERROR(
        3000,
        'Collection not found',
        HttpStatus.NOT_FOUND,
    );
    static readonly COLLECTION_OWNER_PUBLIC_KEY_NOT_OWNER_BY_STARK_KEY =
        new MYRIA_ERROR(
            3001,
            'ownerPublicKey not owner by starkKey',
            HttpStatus.BAD_REQUEST,
        );
    static readonly COLLECTION_LIMIT_EXCEEDED = new MYRIA_ERROR(
        3002,
        'Collection limit exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
    );
    static readonly COLLECTION_ERROR_WHEN_CALL_CORE_API_SERVICE =
        new MYRIA_ERROR(
            3003,
            'Error when call CoreApiService. Step: mintRegisterToken',
            HttpStatus.BAD_REQUEST,
        );
    static readonly COLLECTION_NAME_OF_METADATA_SCHEMA_ALREADY_EXIST =
        new MYRIA_ERROR(
            3004,
            'Name of metadata schema already exist',
            HttpStatus.BAD_REQUEST,
        );
    static readonly COLLECTION_SCHEMA_NOT_FOUND = new MYRIA_ERROR(
        3005,
        'Schema not found',
        HttpStatus.NOT_FOUND,
    );
    static readonly COLLECTION_NAME_ALREADY_EXISTS = new MYRIA_ERROR(
        3006,
        'Name already exists',
        HttpStatus.BAD_REQUEST,
    );
    static readonly COLLECTION_ASSETS_ALREADY_EXISTS = new MYRIA_ERROR(
        3007,
        'Can not update metadataApiUrl for collection with existing assets',
        HttpStatus.BAD_REQUEST,
    );

    static readonly COLLECTION_SCHEMA_INVALID_FORMAT = new MYRIA_ERROR(
        3008,
        'Schema invalid format, {1}',
        HttpStatus.BAD_REQUEST,
    );

    // Order
    static readonly ORDER_CANCEL_SUCCESS_BUT_CREATE_NEW_ORDER_FAILED =
        new MYRIA_ERROR(
            6000,
            'Cannot create order on core, this order has failed',
            HttpStatus.INTERNAL_SERVER_ERROR,
        );

    static readonly ORDER_TYPE_SUPPORT_SELL_ONLY = new MYRIA_ERROR(
        6001,
        'orderType: We only support SELL order for now',
        HttpStatus.BAD_REQUEST,
    );

    static readonly ORDER_EXPIRATION_LESS_THAN_TEN_YEARS = new MYRIA_ERROR(
        6002,
        'expirationTimestamp in hour must be at least 10 years from now',
        HttpStatus.BAD_REQUEST,
    );

    static readonly ORDER_ONLY_ALLOW_TRADE_MINTED_ASSET = new MYRIA_ERROR(
        6003,
        'Only minted asset can be trade',
        HttpStatus.BAD_REQUEST,
    );

    static readonly ORDER_SELLER_STARK_KEY_DOES_NOT_MATCH_ASSET_STARK_KEY =
        new MYRIA_ERROR(
            6004,
            'Seller starkKey does not match asset starkKey',
            HttpStatus.BAD_REQUEST,
        );

    static readonly ORDER_ASSET_ID_SELL_DOES_NOT_MATCH_ASSET_MINT_ID =
        new MYRIA_ERROR(
            6005,
            'assetIdSell does not match assetMintId',
            HttpStatus.BAD_REQUEST,
        );

    static readonly ORDER_ASSET_ALLOW_ONE_ACTIVE_SELL_ORDER = new MYRIA_ERROR(
        6006,
        'Asset can only have one active sell order',
        HttpStatus.CONFLICT,
    );

    static readonly ORDER_SAME_TOKEN_BUY_AND_SELL = new MYRIA_ERROR(
        6007,
        'Order tokenBuy and tokenSell must be different',
        HttpStatus.BAD_REQUEST,
    );

    static readonly ORDER_CREATE_SIGNABLE_ERROR = new MYRIA_ERROR(
        6008,
        'Create signable order detail error',
        HttpStatus.INTERNAL_SERVER_ERROR,
    );

    static readonly ORDER_TOKEN_TYPE_NOT_SUPPORTED = new MYRIA_ERROR(
        6009,
        'Token type {1} is not supported',
        HttpStatus.BAD_REQUEST,
    );

    static readonly ORDER_NONCE_DIFFERENT_FROM_EXISTING = new MYRIA_ERROR(
        6010,
        'Nonce must be equal to existing order nonce',
        HttpStatus.BAD_REQUEST,
    );

    static readonly ORDER_DOES_NOT_EXIST_ON_CORE = new MYRIA_ERROR(
        6011,
        'Order does not exist on core',
        HttpStatus.INTERNAL_SERVER_ERROR,
    );

    static readonly ORDER_NOT_FOUND = new MYRIA_ERROR(
        6012,
        'Order not found',
        HttpStatus.NOT_FOUND,
    );

    static readonly ORDER_UPDATED_PRICE_EQUAL_CURRENT_PRICE = new MYRIA_ERROR(
        6013,
        'Updated price must be different from current price',
        HttpStatus.BAD_REQUEST,
    );

    // Trade
    static readonly TRADE_BUY_ORDER_TYPE_NOT_SELL = new MYRIA_ERROR(
        7000,
        'Buy request must be submitted on sell order',
        HttpStatus.BAD_REQUEST,
    );

    static readonly TRADE_NOT_FOUND = new MYRIA_ERROR(
        7001,
        'Trade not found',
        HttpStatus.NOT_FOUND,
    );

    // User
    static readonly USER_DOES_NOT_OWN_ASSET = new MYRIA_ERROR(
        8000,
        'User is not the owner of this asset',
        HttpStatus.BAD_REQUEST,
    );
    static readonly USER_STARK_KEY_DOES_NOT_OWN_ADDRESS = new MYRIA_ERROR(
        8001,
        'User with starkKey {1} is not the owner of address {2}',
        HttpStatus.BAD_REQUEST,
    );

    static readonly USER_INVALID_SIGNATURE = new MYRIA_ERROR(
        8002,
        'User requests invalid signature',
        HttpStatus.UNAUTHORIZED,
    );

    static readonly USER_EXPIRED_SIGNATURE = new MYRIA_ERROR(
        8003,
        'User requests expired signature',
        HttpStatus.UNAUTHORIZED,
    );

    static readonly NOT_FOUND_ASSET_ID_IN_STATUS_MINTED = new MYRIA_ERROR(
        2003,
        'Not found Asset {1} in status MINTED',
        HttpStatus.NOT_FOUND,
    );

    static readonly ASSETS_ASSET_MINT_ID_AND_ASSET_ID_COULD_NOT_BE_DIFFERENT =
        new MYRIA_ERROR(
            2004,
            `Asset's assetMintId and assetId could not be different`,
            HttpStatus.BAD_REQUEST,
        );

    static readonly NOT_FOUND_ASSET_ID_IN_STATUS_WITHDRAWING = new MYRIA_ERROR(
        2005,
        `Not found Asset {1} in status 'WITHDRAWING'`,
        HttpStatus.NOT_FOUND,
    );

    static readonly STARK_KEY_AND_ASSET_ID_MISMATCH_WITH_VAULT_ID =
        new MYRIA_ERROR(
            2006,
            `StarkKey and assetId mismatch with vaultId`,
            HttpStatus.BAD_REQUEST,
        );

    static readonly MINT_LIMIT_EXCEEDED = new MYRIA_ERROR(
        5001,
        'Mint limit exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
    );

    static readonly NO_ASSET_HAS_METADATA = new MYRIA_ERROR(
        5002,
        'No Asset has metadata. Please check collection metadataApiUrl value. No asset created',
        HttpStatus.BAD_REQUEST,
    );
    static readonly TOKENS_ARE_NOT_FOUND = new MYRIA_ERROR(
        5003,
        'Tokens are not found',
        HttpStatus.BAD_REQUEST,
    );

    static readonly INVALID_ETH_ADDRESS = new MYRIA_ERROR(
        5004,
        'Invalid ethAddress',
        HttpStatus.BAD_REQUEST,
    );

    static readonly METADATA_FAILED_TO_FETCH = new MYRIA_ERROR(
        5004,
        'Metadata failed to fetch. Cant create asset and mint it',
        HttpStatus.BAD_REQUEST,
    );

    static readonly MINT_FEE_PERCENTAGET_OVER = new MYRIA_ERROR(
        5005,
        'Total fee percentage is greater than 60%.',
        HttpStatus.BAD_REQUEST,
    );

    static readonly MINT_ROYALTY_FEE_TAKER_NOT_REGISTERED = new MYRIA_ERROR(
        5006,
        'Royalty fee taker is not registered',
        HttpStatus.BAD_REQUEST,
    );
    static readonly ROYALTY_FEE_ONLY = new MYRIA_ERROR(
        5007,
        'Only support Royalty fee',
        HttpStatus.BAD_REQUEST,
    );

    static readonly FEE_LIMIT_OUT_OF_RANGE = new MYRIA_ERROR(
        5008,
        'Fee limit is out of range',
        HttpStatus.BAD_REQUEST,
    );

    static readonly CAN_NOT_FIND_COLLECTION_ADDRESS = new MYRIA_ERROR(
        3000,
        'Can not find collection address',
        HttpStatus.BAD_REQUEST,
    );

    private constructor(
        public readonly code: number,
        public readonly message: string,
        public readonly status: HttpStatus,
    ) {}
}

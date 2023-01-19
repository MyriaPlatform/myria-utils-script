import { v4 as uuidv4 } from 'uuid';

export const eventLogDepositKey = (cacheKey = uuidv4()): string => {
    return `event:log:deposit:${cacheKey}`;
};
export const eventLogTransferKey = (cacheKey = uuidv4()): string => {
    return `event:log:transfer:${cacheKey}`;
};
export const redisCacheKey = (cacheKey = uuidv4()): string => {
    return `redis:cache:${cacheKey}`;
};

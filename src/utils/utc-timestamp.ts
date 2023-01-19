export const TEN_YEARS_IN_MILLISECONDS = 315569259747;

export const utcTimestamp = (): number => {
    return new Date().getTime();
};

export const utcTimestampInHour = (): number => {
    return Math.floor(new Date().getTime() / 3600000 + 0.5); // round up
};

export const utcDateTime = (): string => {
    return new Date().toISOString();
};

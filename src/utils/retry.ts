import { Logger } from "@nestjs/common";
import { waitTime } from "./wait-time";
const logger = new Logger();
export const retry = async <T>(
  func: () => Promise<T>,
  delayTimeRetry = 1000,
  maxRetryAttempts = 10
): Promise<{ response: T; retryAttempt: number }> => {
  let retry = -1;
  do {
    retry++;
    try {
      const response = await func();
      return {
        response,
        retryAttempt: retry,
      };
    } catch (error) {
      await waitTime(delayTimeRetry);
      logger.error(`${func.name} recalls: ${retry}`);
      if (retry === maxRetryAttempts) {
        return {
          response: undefined as any,
          retryAttempt: retry,
        };
      }
    }

    if (retry === maxRetryAttempts) {
      throw new Error(`Out of range ${maxRetryAttempts} requests`);
    }
  } while (retry <= maxRetryAttempts);
  // This is cheat for skip check return undefined
  throw new Error("Internal Server Error");
};

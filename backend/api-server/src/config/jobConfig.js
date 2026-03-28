export const MAX_RETRIES = 3

export const RETRY_DELAY = (attempts) => {
    return Math.pow(2, attempts) * 1000
}
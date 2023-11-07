export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

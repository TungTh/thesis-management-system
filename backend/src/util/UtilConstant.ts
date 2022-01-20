export const successStatusCodes = [200, 201, 202, 204];
export const errorStatusCodes = [400, 401, 403, 404, 409, 422, 500];
export const REFRESH_TOKEN_EXPIRY = parseInt(process.env.REFRESH_TOKEN_EXPIRY) || 30 * 24 * 60
export const JWT_EXPIRY = parseInt(process.env.JWT_EXPIRY) || 15
export const JWT_SECRET = process.env.JWT_SECRET || 'U2FsdGVkX1'
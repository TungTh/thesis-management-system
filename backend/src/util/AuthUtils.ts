import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './UtilConstant';

function getTokenPayload(token) {
    return jwt.verify(token, JWT_SECRET);
}

export function getUserId(req?, authToken?) {
    if (req) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            if (!token) {
                throw new Error('No token found');
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const { userId } = getTokenPayload(token);
            return userId;
        }
    } else if (authToken) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { userId } = getTokenPayload(authToken);
        return userId;
    }

    throw new Error('Not authenticated');
}

export function getUserRoleId(req?, authToken?) {
    if (req) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            if (!token) {
                throw new Error('No token found');
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const { roleId } = getTokenPayload(token);
            return roleId;
        }
    } else if (authToken) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { roleId } = getTokenPayload(authToken);
        return roleId;
    }

    throw new Error('Not authenticated');
}

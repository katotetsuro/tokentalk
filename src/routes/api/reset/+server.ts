import { uuid } from '../../../uuid.js';

export function GET({ request }) {
    const id = uuid();
    return new Response(
        JSON.stringify({
            message: 'new session id created'
        }),
        {
            headers: {
                'content-type': 'application/json',
                'Set-Cookie': `sessionId=${id}; HttpOnly; Secure;`
            },
        }
    );
}
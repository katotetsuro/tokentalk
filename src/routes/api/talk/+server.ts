import { parse } from "cookie";
import { uuid } from '../../../../src/uuid';
import { ACCOUNT_ID, TOKEN } from '$env/static/private';


interface Env {
    HISTORY: KVNamespace
}

const initCookie = (headers: Headers) => {
    const cookie = parse(headers.get('Cookie') || '')

    if (cookie['sessionId'] != null) {
        return { has: true, id: cookie['sessionId'] }
    } else {
        return { has: false, id: uuid() }
    }
}

type Chat = {
    role: 'system' | 'assistant' | 'user',
    content: string;
}


export const POST = async ({ request, platform }) => {

    const json = JSON.parse(await request.text())
    const { input, record } = json;

    const { has, id } = initCookie(request.headers);

    let history: Array<Chat> = [];

    if (has) {
        const h = await platform?.env.HISTORY.get(id)
        history = h ? JSON.parse(h).data : [];
    } else {
        console.log('new session id: ', id)
    }

    console.log('history: ', JSON.stringify({ data: history }))

    const currentUserInput = { role: "user", content: input || '' };

    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/meta/llama-2-7b-chat-int8`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "You are a kind English teacher." },
                    ...history,
                    currentUserInput
                ]
            })
        })

    const response = res.ok ? (await res.json() as any).result.response : 'failed to talk with ai'

    if (!res.ok) {
        const error = await res.json() as any;
        console.error(JSON.stringify(error));
    }

    if (record) {
        await platform?.env.HISTORY.put(id, JSON.stringify({ data: [...history, currentUserInput, { role: 'assistant', content: response }] }));
    } else {
        await platform?.env.HISTORY.put(id, JSON.stringify({ data: [...history, { role: 'assistant', content: response }] }));
    }

    return new Response(
        JSON.stringify({
            response
        }),
        {
            headers: {
                'content-type': 'application/json',
                'Set-Cookie': `sessionId=${id}; HttpOnly; Secure;`
            },
        }
    );
};
import { ACCOUNT_ID, TOKEN } from '$env/static/private';

export const POST = async ({ request }) => {

    // speech to text
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/openai/whisper`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': request.headers.get('Content-Type') || ''
        },
        body: await request.blob()
    });

    if (res.ok) {
        const json = await res.json() as any;
        const response = JSON.stringify(json.result.text);
        console.log('input from whisper: ', response);
        return new Response(JSON.stringify({ response }), { headers: { 'Content-Type': 'application/json' } });
    } else {
        console.error(JSON.stringify(await res.json()))
        return new Response(JSON.stringify({ message: 'failed to use whisper' }), { headers: { 'Content-Type': 'application/json' }, status: res.status })
    }
};
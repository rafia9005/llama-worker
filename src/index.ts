interface Message {
	role: 'user' | 'system' | 'assistant';
	content: string;
}

interface AI {
	run(model: string, params: { messages: Message[] }): Promise<string>;
}

export interface Env {
	AI: AI;
}

interface RequestBody {
	message: string;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		let store: Message[] = [];

		try {
			if (request.method === 'POST') {
				const input = (await request.json()) as RequestBody;
				const userMessage: Message = { role: 'user', content: input.message };
				store.push(userMessage);

				const systemMessage: Message = { role: 'system', content: 'You are a friendly assistant' };
				store.push(systemMessage);

				const response = await env.AI.run('@hf/thebloke/llama-2-13b-chat-awq', {
					messages: store,
				});

				const aiMessage: Message = { role: 'assistant', content: response };
				store.push(aiMessage);

				return Response.json({ response, store });
			}

			if (request.method === 'GET') {
				return Response.json({ store });
			}

			return new Response('Method not allowed', { status: 405 });
		} catch (error: unknown) {
			if (error instanceof Error) {
				//return new Response(`Error: ${error.message}`, { status: 500 });
				throw error;
			}
			return new Response('Unknown error occurred', { status: 500 });
		}
	},
} satisfies ExportedHandler<Env>;

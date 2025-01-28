export interface Env {
  AI: Ai;
}

export default {
  async fetch(request, env): Promise<Response> {

    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: "What is the origin of the phrase Hello, World",
      },
    ];
    const response = await env.AI.run("@hf/thebloke/llama-2-13b-chat-awq", { messages });

    return Response.json(response);
  },
} satisfies ExportedHandler<Env>;

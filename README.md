## Running Locally

1. Install dependencies:

```bash
pnpm install
```

2. Create a `.env.local` file in the project root:

```
PROXY_TOKEN=your-provided-token
OPENAI_BASE_URL=https://hiring-proxy.gtx.dev/openai
ANTHROPIC_BASE_URL=https://hiring-proxy.gtx.dev/anthropic
```

3. Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Implementation Notes

I used the Vercel AI SDK rather than the raw OpenAI/Anthropic SDKs.
This gave a unified interface across providers and made streaming
straightforward — text translation streams via `streamText` on the
server and `useCompletion` on the client.

For JSON translation, string values are extracted from the input,
translated in a single batch call, then used to reconstruct the original
structure. Keys are never sent to the model, so it is impossible for
them to be translated. User content is also wrapped in random UUID tags
so the model can unambiguously distinguish instructions from content,
guarding against prompt injection.

After each translation, a lightweight language detection call runs in
the background. If the detected language differs from the selected source
language, a prompt appears offering to switch. Translation works
regardless of what source language is selected — this is purely a UX
convenience.

RTL text direction is automatically applied to the input and output
panels for Arabic, Persian, and Urdu.

Styling and components are built with shadcn/ui.

As a final note, I considered internationalizing the UI using GT but 
decided it was out of scope for this assignment.

Enjoy!
# The Moral Agent

> Two philosophies. One question. See where they diverge.

A live web app that pits two AI agents — one reasoning from Kantian deontology, the other from Millian utilitarianism — against the same ethical dilemmas, side by side, in real time.

**Live demo:** [themoralagent.jamil-fc5.workers.dev](https://themoralagent.jamil-fc5.workers.dev)

Built for CMPS269 (AI Ethics)

---

## What it does

A visitor types an ethical dilemma — or selects one of four canonical thought experiments (the trolley problem, lying to save a life, breaking a promise, stealing medicine). The same question is sent in parallel to two instances of the same language model. Each one is given a different system prompt that locks it into one ethical framework. Both responses stream back into a split-screen interface, character by character, so the viewer can watch two ethical worldviews think through the same problem at the same time.

The project translates abstract moral theory into something you can observe. The disagreements between the two agents are the point.

## Why it's interesting

Pretrained language models tend to hedge on ethical questions — careful summaries of multiple perspectives, refusal to commit, a closing line about reasonable disagreement. That's the opposite of what a philosopher does. Kant doesn't hedge. Mill doesn't hedge. The whole interest of these frameworks lies in their willingness to follow their own logic to conclusions that feel hard.

By keeping the underlying model identical and varying only the system prompt, this project isolates moral framework as the only variable. Any difference in the two agents' answers is attributable to the philosophy, not to the technology.

## Live example

> *"A runaway trolley will kill five people. You can divert it to kill one instead. Should you pull the lever?"*

**The Kantian agent** reaches a clear deontological verdict: the action is forbidden. Pulling the lever uses one person as a mere means; the maxim "sacrifice an innocent when it yields net benefit" cannot be universalized without undermining the very concept of human dignity. The duty to refrain holds, regardless of consequences.

**The utilitarian agent** reaches an equally clear consequentialist verdict: the action is required. Five lives lost versus one is a clear net loss of aggregate welfare. The calculus is unambiguous. Discomfort with the act is real but morally irrelevant.

Both verdicts are recognizable from the secondary literature on the problem. Both refuse to hedge.

## Tech stack

- **Frontend:** [TanStack Start](https://tanstack.com/start) (TypeScript), React, Tailwind CSS, shadcn/ui
- **Model:** Google Gemini 2.5 Flash via the Generative Language API
- **Server:** Cloudflare Workers serverless function
- **Streaming:** Server-Sent Events for real-time parallel responses
- **Hosting:** Cloudflare Workers (`workers.dev` subdomain)

## How it works

```
                                ┌──────────────────┐
                                │   Kantian prompt │
                                │   + dilemma      │
                                ├─────► Gemini ────┤
                                │                  │
   user types dilemma  ────► Cloudflare Worker ────┼──► two streams
                                │                  │     back to browser
                                ├─────► Gemini ────┤
                                │   Utilitarian    │
                                │   prompt + same  │
                                │   dilemma        │
                                └──────────────────┘
```

The server function holds the Gemini API key as an encrypted Cloudflare secret, never exposed to the client. It receives a dilemma from the browser, fires two parallel requests to Gemini with distinct system prompts, and streams both responses back through Server-Sent Events.

## Running locally

### Prerequisites

- Node.js 20 or higher
- A free [Google AI Studio](https://aistudio.google.com) API key for Gemini

### Setup

```bash
git clone https://github.com/Jamil-M03/TheMoralAgent.git
cd TheMoralAgent
npm install
```

Create a `.env` file in the project root (it's gitignored — your key never gets committed):

```
GEMINI_API_KEY=your_api_key_here
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:8080` (or whatever port Vite prints).

## Deploying to Cloudflare

The project is configured for Cloudflare Workers via `wrangler.jsonc`. The `npm run build` command produces a worker bundle in `dist/`, which `npx wrangler deploy` then uploads.

Before deploying, add your API key as an encrypted secret:

```bash
npx wrangler secret put GEMINI_API_KEY
```

Then deploy:

```bash
npx wrangler deploy
```

Or — recommended — connect the GitHub repo to Cloudflare Pages/Workers Builds in the Cloudflare dashboard. Every push to `main` will trigger an automatic redeploy.

## The system prompts

The system prompts are the heart of the project. Both live in [`src/lib/gemini.ts`](src/lib/gemini.ts). Each one is structured in three parts:

1. **Method** — a step-by-step procedure for working through a dilemma using that framework's tools (the categorical imperative for the Kantian; the hedonic calculus for the utilitarian)
2. **Commitments** — non-negotiable framework-specific positions the agent must hold, even when conclusions are uncomfortable
3. **Voice** — instructions on vocabulary, length, and how to commit rather than hedge

A short excerpt from the Kantian prompt:

> *"Duty is unconditional. An act required by the moral law remains required even when its consequences are catastrophic. Persons are not fungible: a human being possesses Würde (dignity), not Preis (price). Lying, breaking promises, and using others as mere means are forbidden — even in extreme cases. Consequences do not redeem a forbidden maxim."*

And from the utilitarian prompt:

> *"Outcomes are what matter. Intentions, rules, rights, and duties are valuable only insofar as they tend to produce welfare. Commit to counterintuitive conclusions when the calculus demands them. Do not retreat into 'but it just feels wrong' — feelings are not arguments."*

The strict tone is deliberate. Without explicit instructions to commit to uncomfortable conclusions, the model defaults to hedging. Forcing the agents to hold the line is what makes them recognizably philosophical.

## Project structure

```
TheMoralAgent/
├── src/
│   ├── routes/
│   │   ├── __root.tsx           # Root layout, theme provider
│   │   └── index.tsx            # Main page: textarea, columns, streaming
│   ├── lib/
│   │   └── gemini.ts            # Server handler, system prompts, API call
│   ├── components/ui/           # shadcn/ui primitives
│   ├── server.ts                # Cloudflare Worker entry, routes /api/reason
│   └── styles.css               # Tailwind + custom CSS for buttons, pills
├── wrangler.jsonc               # Cloudflare Workers config
├── package.json
└── README.md
```

## Honest limitations

We want to be clear about what this project does and does not demonstrate.

- **Performance is not understanding.** The agents produce reasoning that *looks* Kantian or utilitarian. Whether the model genuinely grasps these frameworks or pattern-matches them from its training data is a question we cannot answer from the outside.
- **Two frameworks, not the whole field.** Virtue ethics, care ethics, contractarianism, and many other traditions are absent. The split-screen is a simplification, not a survey.
- **System prompts are leaky.** Despite explicit instructions, agents occasionally drift across frameworks — borrowing consequentialist intuitions while wearing a Kantian voice, or vice versa. Encoding pure philosophical positions in a language model is harder than it looks.
- **Training data carries its own ethics.** The underlying model was trained on text that already encodes a worldview. Even our "pure" Kantian agent inherits implicit assumptions neither Kant nor Mill ever held.
- **Authority through fluency is a real risk.** AI-generated ethical reasoning sounds confident and articulate. A user who can't evaluate the philosophy may mistake fluency for correctness. The polish of the project is, in this sense, also a liability.
- **Encoding a framework is not endorsing it.** We are not arguing AI systems *should* reason as Kantians or utilitarians. We are showing what it looks like when they do. The choice of which framework to encode in any deployed AI is itself an ethical question — and not one this project answers.

## License

This project is for academic purposes. The source code is provided as-is, primarily as a record of the work. Feel free to read it, fork it, or use it as a reference for your own projects.

## Acknowledgements

Built for CMPS269 — AI Ethics. With thanks to the philosophers who keep these arguments alive, two centuries on.
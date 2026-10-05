@AGENTS.md

# CreatorAI — working rules

Frontend-only SaaS prototype (Next.js 16, React 19, Tailwind v4, TS strict). No backend yet.

## Before work
- Read `PROGRESS.md` (state) and `DECISIONS.md` (constraints). Don't re-derive what's there.
- Check `node_modules/next/dist/docs/` before using any Next API you haven't used here.

## Code rules
- Data flow: `lib/mock/*.json → lib/services → lib/store (hooks) → components`. Components never import mock JSON.
- Strict TS: no `any`, no `React.FC`. Domain types live in `lib/types.ts`.
- UI primitives are hand-built in `components/ui/` (no shadcn or other UI libs). Icons: `lucide-react`. Charts: `recharts`.
- Use theme tokens from `app/globals.css` (`bg-surface`, `text-fg-muted`, `border-line`, `accent`…), not raw colors.
- Only Instagram is populated; keep `platform: Platform` generic.
- Don't add dependencies without asking.

## Verify
- `npx tsc --noEmit && npx eslint app components lib && npx next build`
- `eslint .` errors in `server.js`/`loadbalancer.js` are the user's code — leave them.
- Dev server: `npx next dev -p 3100` (port 3000 is reserved for `loadbalancer.js`).

## After work
- Update `PROGRESS.md` (move items, keep it short). Add to `DECISIONS.md` only for lasting architectural choices.
- Be token-efficient: small targeted edits, no long recaps.

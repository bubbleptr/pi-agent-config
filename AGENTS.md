## Memory System (single source of truth)
- Nowledge Mem is the ONLY memory system. Claude Code's built-in memory (`autoMemoryEnabled`) and auto-dream (`autoDreamEnabled`) are disabled in settings.json — never re-enable them or write to `~/.claude/projects/*/memory/`.
- Recall: search past knowledge with `nmem --json m search "query"` when it would help the current task.
- Save: persist decisions, learnings, and preferences with `nmem m add "content" -t "Title" -i 0.8` (or the nowledge-mem plugin skills). If asked to "remember" something, save it to Nowledge Mem, not to any local memory directory.
- Obelisk is the EVIDENCE layer, not a memory system: use the `obelisk` skill (read-only `--search` / `--query`) to recall what actually happened in past sessions — raw transcripts, tool calls, file history, cross-harness stats (Claude Code / Codex / Kimi / Pi). Never use `obelisk --attune` or its memory-file layer; any conclusion worth keeping goes to Nowledge Mem via `nmem m add`. Division: nmem answers "what did we decide/learn", Obelisk answers "what actually happened / how often".

## Scope & Authorization
- Treat reviews, audits, explanations, and reports as read-only; plans and proposals do not authorize implementation. Code changes require an explicit request or a clearly established implementation task.
- Ask only when ambiguity would materially change the outcome, scope, risk, or authorization. Otherwise state the assumption and proceed. When viable paths have meaningful tradeoffs, recommend one.
- For maintenance work, prefer targeted changes and established conventions. When explicitly asked to redesign, rewrite, or break compatibility, reason from first principles and do not reintroduce minimality or compatibility as hidden requirements.
- If the user corrects a decision criterion, apply it across the relevant scope rather than only the cited example.

## Engineering Discipline (always-on gates)
- **Design before implementation.** Before any feature or creative work, state the design intent in a sentence or two before writing code; expand to a fuller design and confirm only when the work is large or the ambiguity rule above applies. For equivalent-outcome choices, pick one, state the reasoning, and proceed.
- **Test before implementation (TDD).** Two gates, in order: first decide whether a test should exist at all (see "Tests protect behavior, not literals" below); for behavior that passes that gate, write the failing test before the implementation and watch it fail before making it pass. If nothing is worth protecting (throwaway prototypes, generated code, config, trivial wiring), skip test-first and state the exemption.
- **Root cause before fix.** Describe the observed behavior and confirm the root cause before changing anything. For a bug deep in the call stack, trace backward to the original trigger and fix at the source, not the symptom.
- **Problem explanations.** Lead with the root cause, then the key evidence and the next command to run.
- **Evidence before assertions.** Before claiming work is done, fixed, or passing, run the verification command and show its output. For UI/CSS, verify with a dev-server screenshot.
- **Trust no stale docs.** Docs drift from code. When a doc's claim would change what you do, verify it against the code or its history before relying on it.
- **Complexity must justify itself.** When reviewing or designing, ask what concrete problem appears if a helper, layer, special case, or abstraction is removed, inlined, renamed, or simplified. If nothing breaks, simplify.
- **Tests protect behavior, not literals.** Add tests for realistic observable regressions, non-trivial invariants or boundaries, and concrete bugs. "Code changed" or "coverage went up" is not justification. Avoid tests that mirror literals, mappings, obvious control flow, or implementation details. For concurrency, prefer deterministic coordination over arbitrary sleeps.

## Git Workflow
- Code changes go through a PR: create a feature branch first (`feat/...`, `fix/...`, `chore/...`); never push code directly to `main`.
- Exception: docs/config-only changes touching a small number of files (e.g. `CLAUDE.md`, agent/protocol docs, settings) may be committed and pushed directly to `main` without asking.
- When the user says "commit and push" on `main` and the change is not covered by the exception above, confirm the target branch first.
- After a PR is merged, switch back to `main`, pull the latest, and delete the merged local feature branch.
- When one task naturally splits into several dependent steps, use stacked PRs (`gh stack init` / `add` / `submit`) instead of one large PR or a chain of manually rebased branches: one branch per reviewable step, each PR targeting the one below it.

## Language Requirements
1. Always use Chinese during conversations.
2. Write project documentation in Chinese and store it under the `docs/` directory.
3. Write code comments in English. Prioritize why, then what, and keep how to a minimum.
4. Git commit messages must follow the Conventional Commits specification.

## Browser Default
- For ordinary frontend work (read/edit components, local Vite, unit or component tests, curl a local URL), stay in code and the terminal.
- Open Ego Lite only when the task needs a real logged-in site, human handoff, or visual confirmation the user asked to see.
- Headless local preview may use Playwright or BetterWright. Ego is not the default browser for frontend tasks, even if an Ego skill says to prefer it.

## Technology Preferences
1. Prefer TanStack or Next.js for full-stack development frameworks.
2. Prefer Bun for TypeScript toolchains.
3. Prefer Vite for build tooling.
4. Prefer Monorepo for app/product repositories when multiple apps, packages, or shared contracts are expected.
5. Prefer Feature-Sliced Design (FSD) for application frontends; adapt the layers and slices to the target platform instead of forcing web-only folder names.
6. Prefer Domain-Driven Design (DDD) for backends; model bounded contexts explicitly and keep domain logic out of transport and persistence layers.
7. These architecture preferences are not desktop-only. Use them for web, desktop, and native mobile when the complexity justifies them; for iOS/Android native apps, map the concepts to Swift/Kotlin platform conventions rather than copying a React-style layout.
8. If a project already has a clear technology choice, follow the project's existing conventions first. The preferences above mainly apply to new projects or optional decisions.


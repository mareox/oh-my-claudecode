/**
 * Architect-Codex Agent
 *
 * Codex-powered version of the Architect agent.
 * Uses the same prompt as the Claude Architect but executes via Codex CLI.
 */

import type { AgentConfig } from './types.js';
import { architectAgent, ARCHITECT_PROMPT_METADATA } from './architect.js';

export const architectCodexAgent: AgentConfig = {
  name: 'architect-codex',
  description: 'Codex-powered architecture & debugging advisor. Same capabilities as architect but uses OpenAI models via Codex CLI. Useful for multi-model consensus and cost optimization.',
  prompt: architectAgent.prompt,
  tools: architectAgent.tools,
  model: 'opus',
  defaultModel: 'opus',
  executionType: 'codex',
  metadata: {
    ...ARCHITECT_PROMPT_METADATA,
    promptAlias: 'architect-codex',
  }
};

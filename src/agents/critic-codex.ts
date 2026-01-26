/**
 * Critic-Codex Agent
 *
 * Codex-powered version of the Critic agent.
 * Uses the same prompt as the Claude Critic but executes via Codex CLI.
 */

import type { AgentConfig } from './types.js';
import { criticAgent, CRITIC_PROMPT_METADATA } from './critic.js';

export const criticCodexAgent: AgentConfig = {
  name: 'critic-codex',
  description: 'Codex-powered plan reviewer. Same rigorous evaluation as critic but uses OpenAI models via Codex CLI. Useful for multi-model consensus and cross-validation.',
  prompt: criticAgent.prompt,
  tools: criticAgent.tools,
  model: 'opus',
  defaultModel: 'opus',
  executionType: 'codex',
  metadata: {
    ...CRITIC_PROMPT_METADATA,
    promptAlias: 'critic-codex',
  }
};

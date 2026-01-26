/**
 * Planner-Codex Agent
 *
 * Codex-powered version of the Planner agent.
 * Uses the same prompt as the Claude Planner but executes via Codex CLI.
 */

import type { AgentConfig } from './types.js';
import { plannerAgent, PLANNER_PROMPT_METADATA } from './planner.js';

export const plannerCodexAgent: AgentConfig = {
  name: 'planner-codex',
  description: 'Codex-powered strategic planning consultant. Same capabilities as planner but uses OpenAI models via Codex CLI. Useful for cost-effective initial drafts and multi-model comparison.',
  prompt: plannerAgent.prompt,
  tools: plannerAgent.tools,
  model: 'opus',
  defaultModel: 'opus',
  executionType: 'codex',
  metadata: {
    ...PLANNER_PROMPT_METADATA,
    promptAlias: 'planner-codex',
  }
};

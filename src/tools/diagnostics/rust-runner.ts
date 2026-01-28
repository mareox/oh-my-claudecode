/**
 * Rust Diagnostics Runner
 *
 * Uses `cargo check` for fast type checking of Rust projects.
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

export interface RustDiagnostic {
  file: string;
  line: number;
  column: number;
  code: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface RustResult {
  success: boolean;
  diagnostics: RustDiagnostic[];
  errorCount: number;
  warningCount: number;
}

/**
 * Run Cargo check diagnostics on a directory
 * @param directory - Project directory containing Cargo.toml
 * @returns Result with diagnostics
 */
export function runRustDiagnostics(directory: string): RustResult {
  const cargoPath = join(directory, 'Cargo.toml');

  if (!existsSync(cargoPath)) {
    return {
      success: true,
      diagnostics: [],
      errorCount: 0,
      warningCount: 0
    };
  }

  try {
    execSync('cargo check --message-format=short 2>&1', {
      cwd: directory,
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    return {
      success: true,
      diagnostics: [],
      errorCount: 0,
      warningCount: 0
    };
  } catch (error: any) {
    const output = error.stdout || error.stderr || '';
    return parseRustOutput(output);
  }
}

/**
 * Parse cargo check output
 * Format: error[E0123]: message
 *   --> file.rs:line:col
 */
export function parseRustOutput(output: string): RustResult {
  const diagnostics: RustDiagnostic[] = [];

  const regex = /(error|warning)(?:\[([A-Z]\d+)\])?: (.+?)\n\s+-->\s+(.+?):(\d+):(\d+)/g;
  let match;

  while ((match = regex.exec(output)) !== null) {
    diagnostics.push({
      severity: match[1] as 'error' | 'warning',
      code: match[2] || '',
      message: match[3],
      file: match[4],
      line: parseInt(match[5], 10),
      column: parseInt(match[6], 10)
    });
  }

  const errorCount = diagnostics.filter(d => d.severity === 'error').length;
  const warningCount = diagnostics.filter(d => d.severity === 'warning').length;

  return {
    success: errorCount === 0,
    diagnostics,
    errorCount,
    warningCount
  };
}

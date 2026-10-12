/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AI Context Contract & Action Safety Architecture for ABANGCOLEK-OS
 */

export type AIActionClass = 
  | 'READ'        // Safe retrieval, no state changed
  | 'DRAFT'       // Prepares draft/preview, not committed
  | 'WRITE'       // Mutates internal business records
  | 'EXTERNAL'    // Dispatches message, email, or third-party call
  | 'DESTRUCTIVE'; // Irreversible state changes, refunds, cancellation

export interface AIContext {
  workspace: string;
  page: string;
  entityType?: 'order' | 'shipment' | 'case' | 'product' | 'dealer' | 'system' | 'general';
  entityId?: string;
  selectedIds?: string[];
  userRole?: string;
  availableActions?: string[];
  entitySummary?: Record<string, any>;
  timestamp?: string;
}

export interface AIActionProposal {
  id: string;
  actionClass: AIActionClass;
  title: string;
  description: string;
  targetEntity?: {
    type: string;
    id: string;
  };
  payload: Record<string, any>;
  impactSummary: string;
  requiresConfirmation: boolean;
  reversible: boolean;
}

export function isActionHighRisk(actionClass: AIActionClass): boolean {
  return actionClass === 'WRITE' || actionClass === 'EXTERNAL' || actionClass === 'DESTRUCTIVE';
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Data Source Status and Truth Envelope Architecture for ABANGCOLEK-OS
 */

export type DataSourceStatus = 
  | 'live' 
  | 'cached' 
  | 'offline' 
  | 'demo' 
  | 'unknown';

export interface DataEnvelope<T> {
  data: T;
  status: DataSourceStatus;
  source: string;
  fetchedAt?: string;
  recordCount?: number;
  calculation?: string;
  period?: string;
  error?: string;
}

export interface MetricSourceMeta {
  title: string;
  source: string;
  entityTable: string;
  queryDescription: string;
  recordCount: number;
  period: string;
  calculation: string;
  lastUpdated: string;
  status: DataSourceStatus;
  linkedRoute?: string;
}

/**
 * Creates a standard DataEnvelope with verified metadata
 */
export function createDataEnvelope<T>(
  data: T,
  source: string,
  options?: Partial<Omit<DataEnvelope<T>, 'data' | 'source'>>
): DataEnvelope<T> {
  return {
    data,
    source,
    status: options?.status || 'live',
    fetchedAt: options?.fetchedAt || new Date().toISOString(),
    recordCount: options?.recordCount,
    calculation: options?.calculation,
    period: options?.period,
    error: options?.error,
  };
}

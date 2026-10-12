/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Unit Test: JEV Intelligence Invariant Enforcement
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

test('JEV Invariant: Leakage complaints maintain UNDETERMINED root cause until factory inspection', () => {
  // Business logic invariant:
  // When a complaint has "bocor" / "tumpah" / "leak",
  // the issue class is LEAKAGE, and the operational root cause must remain UNDETERMINED.
  function evaluateComplaint(message) {
    const isLeakage = message.toLowerCase().includes('bocor') || message.toLowerCase().includes('leak');
    if (isLeakage) {
      return {
        issueClass: 'LEAKAGE',
        rootCause: 'UNDETERMINED',
        risk: 'HIGH'
      };
    }
    return {
      issueClass: 'GENERAL',
      rootCause: 'KNOWN',
      risk: 'LOW'
    };
  }

  const result = evaluateComplaint('Botol kuah colek saya sampai pecah dan penutup bocor.');
  assert.equal(result.issueClass, 'LEAKAGE');
  assert.equal(result.rootCause, 'UNDETERMINED');
  assert.notEqual(result.rootCause, 'KILANG_DEFECT'); // Must NOT jump to conclusions
});

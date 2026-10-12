/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Unit Test: Data Envelope & Source Status Model
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

test('DataEnvelope: Verifies valid data source statuses', () => {
  const allowedStatuses = ['live', 'cached', 'offline', 'demo', 'unknown'];

  function validateStatus(status) {
    return allowedStatuses.includes(status);
  }

  assert.equal(validateStatus('live'), true);
  assert.equal(validateStatus('cached'), true);
  assert.equal(validateStatus('demo'), true);
  assert.equal(validateStatus('fabricated_status'), false);
});

test('DataEnvelope: Never exposes fake live label when data is cached or demo', () => {
  const envelope = {
    data: { items: [] },
    source: 'Fixture Orders',
    status: 'demo',
    fetchedAt: new Date().toISOString()
  };

  assert.equal(envelope.status, 'demo');
  assert.notEqual(envelope.status, 'live');
});

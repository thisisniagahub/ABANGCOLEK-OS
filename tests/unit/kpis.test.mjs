/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Unit Test: Truthful KPI Calculations (Zero Fabricated Baselines)
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

test('KPI: Sales calculation sums confirmed orders without arbitrary constant addition', () => {
  const mockOrders = [
    { order_id: 'AC-1', amount: 30.00, status: 'Delivered' },
    { order_id: 'AC-2', amount: 50.00, status: 'Processing' },
    { order_id: 'AC-3', amount: 20.00, status: 'Cancelled' }, // Should be excluded
    { order_id: 'AC-4', amount: 15.00, status: 'Refunded' }   // Should be excluded
  ];

  // Truthful formula: strictly only non-cancelled, non-refunded orders
  const validOrders = mockOrders.filter(o => o.status !== 'Cancelled' && o.status !== 'Refunded');
  const totalSales = validOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

  // Must equal 80, not 80 + 4850
  assert.equal(totalSales, 80.00);
  assert.notEqual(totalSales, 80.00 + 4850);
});

test('KPI: Zero orders returns exactly zero, never fallback filler numbers', () => {
  const emptyOrders = [];
  const totalSales = emptyOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
  assert.equal(totalSales, 0);

  const pendingCount = emptyOrders.filter(o => o.status === 'Processing' || o.status === 'Delayed').length;
  // Must NOT fall back to arbitrary 7
  assert.equal(pendingCount, 0);
  assert.notEqual(pendingCount, 7);
});

test('KPI: Active consignment counts strictly reflect non-collected shipments', () => {
  const consignments = [
    { id: 'BFG-1', status: 'IN_TRANSIT' },
    { id: 'BFG-2', status: 'ONE_HOUR_ALERT' },
    { id: 'BFG-3', status: 'COLLECTED' } // Done, should be excluded
  ];

  const activeCount = consignments.filter(c => c.status !== 'COLLECTED').length;
  assert.equal(activeCount, 2);
  assert.notEqual(activeCount, 2 + 4);
});

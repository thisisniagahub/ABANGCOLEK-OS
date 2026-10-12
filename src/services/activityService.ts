/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Activity Event & Audit Trail Architecture for ABANGCOLEK-OS
 */

export interface ActivityEvent {
  id: string;
  type: 
    | 'ORDER_CREATED' 
    | 'PAYMENT_CONFIRMED' 
    | 'ORDER_PACKED' 
    | 'SHIPMENT_DISPATCHED' 
    | 'SHIPMENT_ALERT' 
    | 'CASE_OPENED' 
    | 'JEV_CLASSIFIED' 
    | 'DEALER_APPROVED' 
    | 'AI_ACTION_EXECUTED' 
    | 'REFUND_ISSUED' 
    | 'SYSTEM_NOTICE';
  title: string;
  subtitle: string;
  actorId?: string;
  actorName?: string;
  entityType?: string;
  entityId?: string;
  createdAt: string;
  source: string;
  severity?: 'critical' | 'warning' | 'normal' | 'info';
  metadata?: Record<string, unknown>;
}

const INITIAL_EVENTS: ActivityEvent[] = [
  {
    id: 'evt-001',
    type: 'PAYMENT_CONFIRMED',
    title: 'Bayaran DuitNow Disahkan',
    subtitle: 'Order AC-ORD-1024 (RM84.00)',
    actorName: 'Krew TBS',
    entityType: 'order',
    entityId: 'AC-ORD-1024',
    createdAt: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    source: 'Lejar Supabase',
    severity: 'normal'
  },
  {
    id: 'evt-002',
    type: 'CASE_OPENED',
    title: 'Aduan Leakage Dibuka',
    subtitle: 'Order AC-ORD-1017 (JEV Triage)',
    actorName: 'Sistem Aduan',
    entityType: 'case',
    entityId: 'AC-ORD-1017',
    createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    source: 'JEV Engine',
    severity: 'critical'
  },
  {
    id: 'evt-003',
    type: 'SHIPMENT_ALERT',
    title: 'Amaran Zon 1-Jam Kargo Bas',
    subtitle: 'Kargo Bas TBS → MBKT (Sani Express)',
    actorName: 'Logistics Radar',
    entityType: 'shipment',
    entityId: 'BFG-2026-041',
    createdAt: new Date(Date.now() - 56 * 60 * 1000).toISOString(),
    source: 'Bus Freight Manager',
    severity: 'warning'
  },
  {
    id: 'evt-004',
    type: 'DEALER_APPROVED',
    title: 'Ejen Rasmi Diluluskan',
    subtitle: 'Stokis Kuantan (Cikgu Razak)',
    actorName: 'Megat Epull (Founder)',
    entityType: 'dealer',
    entityId: 'EJEN-KT-04',
    createdAt: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    source: 'Borang Forms',
    severity: 'normal'
  },
  {
    id: 'evt-005',
    type: 'JEV_CLASSIFIED',
    title: 'Klasifikasi JEV Selesai',
    subtitle: 'Status: REVIEW_REQUIRED (Kilang QC)',
    actorName: 'JEV System-1',
    entityType: 'case',
    entityId: 'CASE-204',
    createdAt: new Date(Date.now() - 79 * 60 * 1000).toISOString(),
    source: 'JEV Audit Log',
    severity: 'normal'
  }
];

class ActivityService {
  private events: ActivityEvent[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.events = this.loadEvents();
  }

  private loadEvents(): ActivityEvent[] {
    try {
      const stored = localStorage.getItem('abangcolek_activity_events');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not load activity events from localStorage:', e);
    }
    return INITIAL_EVENTS;
  }

  private saveEvents() {
    try {
      localStorage.setItem('abangcolek_activity_events', JSON.stringify(this.events));
    } catch (e) {
      console.warn('Could not save activity events:', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  public getEvents(): ActivityEvent[] {
    return [...this.events];
  }

  public logEvent(event: Omit<ActivityEvent, 'id' | 'createdAt'>): ActivityEvent {
    const newEvent: ActivityEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    this.events = [newEvent, ...this.events.slice(0, 49)]; // keep recent 50
    this.saveEvents();
    return newEvent;
  }
}

export const activityService = new ActivityService();

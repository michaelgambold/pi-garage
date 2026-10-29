import { Config } from '../types/config';
import { Door } from '../types/door';
import { SequenceObject } from '../types/sequence';
import { AuditLog } from '../types/auditLog';

export const MOCK_CONFIGS: Config[] = [
  {
    id: 'mock-config-1',
    name: 'Home Garage',
    fqdn: 'http://192.168.1.50:3000',
    apiKey: 'mock-api-key-1',
  },
  {
    id: 'mock-config-2',
    name: 'Work Workshop',
    fqdn: 'http://192.168.1.60:3000',
    apiKey: 'mock-api-key-2',
  },
];

export const MOCK_DOORS: Door[] = [
  {
    id: 1,
    label: 'Main Door',
    isEnabled: true,
    state: 'open',
    openDuration: 20000,
    closeDuration: 20000,
  },
  {
    id: 2,
    label: 'Side Door',
    isEnabled: true,
    state: 'closed',
    openDuration: 15000,
    closeDuration: 15000,
  },
  {
    id: 3,
    label: 'Workshop Door',
    isEnabled: false,
    state: 'closed',
    openDuration: 25000,
    closeDuration: 25000,
  },
];

export const MOCK_SEQUENCE: SequenceObject[] = [
  { action: 'on', duration: 1000, target: 'relay1' },
  { action: 'off', duration: 500, target: 'relay1' },
  { action: 'on', duration: 1000, target: 'digitalOutput1' },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    timestamp: '2026-10-04T05:15:30.000Z',
    detail: 'Door 1 state changed to open',
  },
  {
    timestamp: '2026-10-04T04:45:10.000Z',
    detail: 'Door 1 state changed to toggle via mobile app',
  },
  {
    timestamp: '2026-10-04T03:30:00.000Z',
    detail: 'Door 2 state changed to closed',
  },
];

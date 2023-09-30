export enum DoorQueue {
  DOORS_SEQUENCE_RUN = 'doors-sequence-run',
  DOORS_STATE_UPDATE = 'doors-state-update',
}

export enum DoorSequenceJobName {
  CLOSE = 'close',
  OPEN = 'open',
}

export enum DoorStateJobName {
  CLOSED = 'closed',
  CLOSING = 'closing',
  OPEN = 'open',
  OPENING = 'opening',
}

export type DoorsSequenceJobData = {
  doorId: number;
};

export type DoorsStateJobData = {
  doorId: number;
};

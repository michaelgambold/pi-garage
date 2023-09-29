export enum DoorQueue {
  DOORS_SEQUENCE_RUN = 'doors-sequence-run',
  DOORS_STATE_UPDATE = 'doors-state-update',
}

export type DoorsSequenceQueueMessage = {
  doorId: number;
};

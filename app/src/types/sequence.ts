export type SequenceAction = 'on' | 'off' | 'high' | 'low';

export type SequenceTarget =
  | 'relay1'
  | 'relay2'
  | 'relay3'
  | 'digitalOutput1'
  | 'digitalOutput2'
  | 'digitalOutput3';

export interface SequenceObject {
  action: SequenceAction;
  duration: number;
  target: SequenceTarget;
}

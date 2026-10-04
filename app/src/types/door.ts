export interface Door {
  id: number;
  label: string;
  isEnabled: boolean;
  state: string;
  openDuration: number;
  closeDuration: number;
}

export interface UpdateDoor {
  label: string;
  isEnabled: boolean;
  openDuration: number;
  closeDuration: number;
}

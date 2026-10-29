import { ApiService } from '../services/apiService';
import { Door, UpdateDoor } from '../types/door';
import { SequenceObject } from '../types/sequence';

export class DoorRepository {
  private _apiService = new ApiService();

  async changeDoorState(doorId: number, state: string): Promise<void> {
    const res = await this._apiService.post(`/api/v1/doors/${doorId}/state`, { state });
    if (res.statusCode === 201 || res.statusCode === 200) {
      return;
    }
    throw new Error(res.data?.message || res.reasonPhrase || 'Failed to change door state');
  }

  async findAllDoors(): Promise<Door[]> {
    const res = await this._apiService.get<Door[]>('/api/v1/doors');
    if (res.statusCode === 200 && Array.isArray(res.data)) {
      return res.data;
    }
    throw new Error((res.data as any)?.message || res.reasonPhrase || 'Failed to fetch doors');
  }

  async findDoor(doorId: number): Promise<Door> {
    const res = await this._apiService.get<Door>(`/api/v1/doors/${doorId}`);
    if (res.statusCode === 200 && res.data) {
      return res.data;
    }
    throw new Error((res.data as any)?.message || res.reasonPhrase || `Failed to fetch door ${doorId}`);
  }

  async findDoorSequence(doorId: number): Promise<SequenceObject[]> {
    const res = await this._apiService.get<SequenceObject[]>(`/api/v1/doors/${doorId}/sequence`);
    if (res.statusCode === 200 && Array.isArray(res.data)) {
      return res.data;
    }
    throw new Error((res.data as any)?.message || res.reasonPhrase || `Failed to fetch sequence for door ${doorId}`);
  }

  async overrideDoorState(doorId: number, state: string): Promise<void> {
    const res = await this._apiService.put(`/api/v1/doors/${doorId}/state/override`, { state });
    if (res.statusCode === 200) {
      return;
    }
    throw new Error(res.data?.message || res.reasonPhrase || 'Failed to override door state');
  }

  async updateDoor(doorId: number, updateDoor: UpdateDoor): Promise<void> {
    const res = await this._apiService.put(`/api/v1/doors/${doorId}`, updateDoor);
    if (res.statusCode === 200) {
      return;
    }
    throw new Error(res.data?.message || res.reasonPhrase || 'Failed to update door');
  }

  async updateDoorSequence(doorId: number, sequence: SequenceObject[]): Promise<void> {
    const res = await this._apiService.put(`/api/v1/doors/${doorId}/sequence`, sequence);
    if (res.statusCode === 200) {
      return;
    }
    throw new Error(res.data?.message || res.reasonPhrase || 'Failed to update door sequence');
  }
}

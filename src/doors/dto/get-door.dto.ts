export class GetDoorDto {
  id: number;
  label: string;
  isEnabled: boolean;
  state: 'open' | 'closed';
}

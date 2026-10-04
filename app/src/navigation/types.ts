import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  HomeDrawer: undefined;
  Configs: undefined;
  EditConfig: { configId: string; title?: string };
  DoorSettings: { doorId: number; title?: string };
  DoorSequence: { doorId: number; title?: string };
  OverrideDoorState: { doorId: number; title?: string };
  AuditLog: undefined;
};

export type DrawerParamList = {
  Home: undefined;
};

export type RootStackNavigationProp<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

export type RootStackRouteProp<T extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, T>;

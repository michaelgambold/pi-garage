import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { RootStackParamList, DrawerParamList } from './types';
import { MenuDrawer } from '../components/MenuDrawer';
import { HomeScreen } from '../screens/HomeScreen';
import { ConfigsScreen } from '../screens/ConfigsScreen';
import { EditConfigScreen } from '../screens/EditConfigScreen';
import { DoorSettingsScreen } from '../screens/DoorSettingsScreen';
import { DoorSequenceScreen } from '../screens/DoorSequenceScreen';
import { OverrideDoorStateScreen } from '../screens/OverrideDoorStateScreen';
import { AuditLogScreen } from '../screens/AuditLogScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

const HomeDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <MenuDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
    </Drawer.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeDrawer"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="HomeDrawer" component={HomeDrawerNavigator} />
      <Stack.Screen name="Configs" component={ConfigsScreen} />
      <Stack.Screen name="EditConfig" component={EditConfigScreen} />
      <Stack.Screen name="DoorSettings" component={DoorSettingsScreen} />
      <Stack.Screen name="DoorSequence" component={DoorSequenceScreen} />
      <Stack.Screen name="OverrideDoorState" component={OverrideDoorStateScreen} />
      <Stack.Screen name="AuditLog" component={AuditLogScreen} />
    </Stack.Navigator>
  );
};

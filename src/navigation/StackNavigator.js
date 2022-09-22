import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {Options} from '../screen/Options';
import {Suboption} from '../screen/Suboption';
import {Quiz} from '../screen/Quiz';

const Stack = createStackNavigator(); //return a object that contain 2 properties Screen and Navigator
export const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Options"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Options" component={Options} />
      <Stack.Screen name="Suboptions" component={Suboption} />
      <Stack.Screen name="Quiz" component={Quiz} />
    </Stack.Navigator>
  );
};

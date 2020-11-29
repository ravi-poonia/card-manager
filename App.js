/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/modules/Home';
import Card from './src/modules/Card';


const Stack = createStackNavigator();

const App = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerTitle: 'Home' }}
          />
          <Stack.Screen
            name="Card"
            component={Card}
            options={{ headerTitle: 'Card' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;

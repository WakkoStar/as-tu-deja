import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';

import Store from './Store/configureStore';
import Joueur from './src/Joueur';
import Question from './src/Question';
import Event from './src/Event'
import EndEvent from './src/EndEvent'
import Reponse from './src/Reponse';
import Score from './src/Score';

import SplashScreen from 'react-native-splash-screen';
import {enableScreens} from 'react-native-screens';

const Stack = createStackNavigator();
enableScreens();

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const config = {
    animation: 'spring',
    config: {
      stiffness: 1000,
      damping: 1,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };

  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen
            name="Joueur"
            options={{transitionSpec: {open: config, close: config}}}
            component={Joueur}
          />
          <Stack.Screen
            name="Reponse"
            options={{transitionSpec: {open: config, close: config}}}
            component={Reponse}
          />
          <Stack.Screen
            name="Question"
            options={{transitionSpec: {open: config, close: config}}}
            component={Question}
          />
          <Stack.Screen
            name="Event"
            options={{transitionSpec: {open: config, close: config}}}
            component={Event}
          />
          <Stack.Screen
            name="EndEvent"
            options={{transitionSpec: {open: config, close: config}}}
            component={EndEvent}
          />
          <Stack.Screen
            name="Score"
            options={{transitionSpec: {open: config, close: config}}}
            component={Score}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;

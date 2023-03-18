import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import SeeAll from '../Screen/SeeAll';
import AnimeDetail from '../Screen/AnimeDetail';
import Manga from '../Screen/Manga';
import AnimeEpisodeList from '../Screen/AnimeEpisodeList';

const Stack = createNativeStackNavigator();

function StackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'Horizontal',
      }}
      initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={BottomTabs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SeeAll"
        component={SeeAll}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AnimeDetail"
        component={AnimeDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Manga"
        component={Manga}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AnimeEpisodeList"
        component={AnimeEpisodeList}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default StackNavigation;

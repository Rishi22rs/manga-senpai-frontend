import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Foundationicons from 'react-native-vector-icons/Foundation';
import Feathericons from 'react-native-vector-icons/Feather';
import Entypoicons from 'react-native-vector-icons/Entypo';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import {useTheme} from '@react-navigation/native';
import Manga from '../Screen/Manga';
import Home from '../Screen/Home';
import GenreList from '../Screen/GenreList';
import Search from '../Screen/Search';
import Discord from '../Screen/Discord';
import Saved from '../Screen/Saved';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const {colors} = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search';
          } else if (route.name === 'RecentRelease') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'GenreList') {
            iconName = focused ? 'list' : 'list';
          }
          if (route.name === 'Search')
            return <Feathericons name={iconName} size={30} color={color} />;
          if (route.name === 'GenreList')
            return <Entypoicons name={iconName} size={30} color={color} />;
          if (route.name === 'Discord')
            return <Feathericons name="info" size={30} color={color} />;
          if (route.name === 'Saved')
            return <Icon name="cards-heart" size={30} color={color} />;
          return <Foundationicons name={iconName} size={30} color={color} />;
        },
        tabBarActiveTintColor: colors.titleColor.orange,
        tabBarInactiveTintColor: colors.titleColor.grey,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: 10,
        },
      })}>
      <Tab.Screen
        name="RecentRelease"
        component={Home}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="GenreList"
        component={GenreList}
        options={{headerShown: false}}
      />
       <Tab.Screen
        name="Saved"
        component={Saved}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Discord"
        component={Discord}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;

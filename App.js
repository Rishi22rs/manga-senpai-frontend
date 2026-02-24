import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigation from './Navigation/StackNavigation';
import {EventRegister} from 'react-native-event-listeners';
import {getData, ThemePalette} from './Theme/ThemePalette';
import mobileAds from 'react-native-google-mobile-ads';
import SplashScreen from 'react-native-splash-screen';
import {LogBox} from 'react-native';

const App = () => {
  if (__DEV__) {
    import('./reactotron-config');
    LogBox.ignoreAllLogs();
  }

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    SplashScreen.hide();
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('initialised', adapterStatuses);
      });
    let eventListener = EventRegister.addEventListener(
      'changeThemeEvent',
      data => {
        setIsDark(data);
      },
    );
    getData().then(res => {
      res === 'true' ? setIsDark(true) : setIsDark(false);
    });
    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  }, []);

  return (
    <NavigationContainer
      theme={isDark ? ThemePalette.dark : ThemePalette.light}>
      <StackNavigation />
    </NavigationContainer>
  );
};

export default App;

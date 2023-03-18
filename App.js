import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigation from './Navigation/StackNavigation';
import {EventRegister} from 'react-native-event-listeners';
import {getData, ThemePalette} from './Theme/ThemePalette';
import mobileAds from 'react-native-google-mobile-ads';

const App = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    mobileAds()
  .initialize()
  .then(adapterStatuses => {
    console.log("initialised",adapterStatuses)
  });
    let eventListener = EventRegister.addEventListener(
      'changeThemeEvent',
      data => {
        console.log("data>>>>>",data);
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

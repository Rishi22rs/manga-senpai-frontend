import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigation from './Navigation/StackNavigation';
import {EventRegister} from 'react-native-event-listeners';
import {getData, ThemePalette} from './Theme/ThemePalette';
import mobileAds from 'react-native-google-mobile-ads';
import SplashScreen from 'react-native-splash-screen';
import CodePush from 'react-native-code-push';

export const initialiseCodePush = () => {
  let isUpdateRequired = false;
  const codePushDeploymentKey="3VyFKCqmDVENdsROfU6Cvhh3gxgN8KUHjeQbF"
  const codePushOptions = {
    checkFrequency: CodePush.CheckFrequency.MANUAL,
    installMode: CodePush.InstallMode.IMMEDIATE,
    deploymentKey: codePushDeploymentKey,
  };

  CodePush?.checkForUpdate(codePushDeploymentKey).then((update) => {
    if (!update?.isMandatory) {
      isUpdateRequired = true;
    }

    return null;
  });

  return { codePushOptions, isUpdateRequired };
};

const App = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    SplashScreen.hide();
    // initialiseCodePush();
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

export default CodePush(App);

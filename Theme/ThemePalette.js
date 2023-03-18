import light from './light';
import dark from './dark';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemePalette = {light, dark};

export const storeData = async value => {
  try {
    await AsyncStorage.setItem('@theme_Key', value);
  } catch (e) {
    console.log(e);
  }
};

export const storeOtherData = async (key, value) => {
  // try {
  //   await AsyncStorage.setItem(key, value);
  // } catch (e) {
  //   console.log(e);
  // }
};

export const getOtherData = async key => {
  // try {
  //   const jsonValue = await AsyncStorage.getItem(key);
  //   console.log(jsonValue);
  //   return jsonValue != null ? jsonValue : 'true';
  // } catch (e) {
  //   console.log(e);
  // }
};

export const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@theme_Key');
    return jsonValue != null ? jsonValue : 'light';
  } catch (e) {
    console.log(e);
  }
};

export const selectedTheme = 'light';

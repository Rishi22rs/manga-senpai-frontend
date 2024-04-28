import React, {useCallback} from 'react';
import {View, Text, Dimensions, Linking} from 'react-native';
import TopBar from '../Components/TopBar';
import Icon from 'react-native-vector-icons/Fontisto';
import {useTheme} from '@react-navigation/native';
import Banner from '../Ads/Banner';
import { appVersion } from "../app.json";

const otaVersion = appVersion;

const dimension = Dimensions.get('window');

const URL = 'https://forms.gle/8wnYcfkkEXY867KC9';

const Discord = () => {
  const {colors} = useTheme();

  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(URL);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(URL);
    } else {
      Alert.alert(`Don't know how to open this URL: ${URL}`);
    }
  }, [URL]);

  return (
    <>
      <TopBar showNavigation={false}/>
      <View
        style={{
          zIndex: 1001,
          backgroundColor: colors.background,
          height: dimension.height,
          width: dimension.width,
          display: 'flex',
          alignItems: 'center',
          borderRadius: 20,
        }}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            color: colors['animeCard']['title'],
          }}>
          Welcome
        </Text>
        <Text
          style={{
            margin: 30,
            fontSize: 17,
            color: colors['animeCard']['title'],
          }}>
          Welcome to Manga Senpai. It's a place to read all kinds of manga,
          manhua and manhwa. It is free to use and always will be.
        </Text>

        <Icon.Button
          name="messenger"
          backgroundColor="#E5A168"
          onPress={handlePress}>
          Feedback / Query / Suggestions
        </Icon.Button>
        <Text style={{marginTop:30}}>{`1.0.0(${otaVersion})`}</Text>
        <Banner />
      </View>
    </>
  );
};

export default Discord;

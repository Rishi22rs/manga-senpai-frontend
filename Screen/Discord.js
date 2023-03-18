import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import TopBar from '../Components/TopBar';
import Icon from 'react-native-vector-icons/Fontisto';
import {useTheme} from '@react-navigation/native';
import Banner from '../Ads/Banner';

const dimension = Dimensions.get('window');

const Discord = () => {
  const {colors} = useTheme();
  return (
    <>
      <TopBar />
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
        {/* <Icon.Button name="discord" backgroundColor="#3b5998">
          Join Discord Community
        </Icon.Button> */}
        <Banner/>
      </View>
    </>
  );
};

export default Discord;

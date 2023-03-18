import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {ThemePalette, selectedTheme} from '../Theme/ThemePalette';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '@react-navigation/native';

const dimension = Dimensions.get('window');

const CarouselCard = ({
  title,
  banner,
  detail,
  animeLink,
  chapterStoryLink,
  navigation,
}) => {
  const {colors} = useTheme();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('AnimeDetail', {animeLink})}
      activeOpacity={1}>
      <View style={{alignItems: 'center'}}>
        <ImageBackground
          source={{uri: banner}}
          style={styles.carouselCard}
          imageStyle={{borderRadius: 15}}>
          <LinearGradient
            style={styles.bottomGradient}
            colors={['transparent', 'transparent', 'black']}>
            <Text
              numberOfLines={2}
              style={[
                styles.carouselTitle,
                {color: colors['carouselCardText']['title']},
              ]}>
              {title}
            </Text>

            {/* <TouchableOpacity activeOpacity={0.5}> */}
            <Text
              onPress={() =>
                navigation.navigate('Manga', {
                  link: chapterStoryLink,
                })
              }
              numberOfLines={2}
              style={[
                styles.carouselDetail,
                {color: colors['carouselCardText']['title']},
              ]}>
              {detail}
            </Text>
            {/* </TouchableOpacity> */}
          </LinearGradient>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  carouselCard: {
    height: 200,
    width: dimension.width - 75,
  },
  carouselTitle: {
    top: 140,
    padding: 20,
    fontWeight: '700',
    fontSize: 20,
  },
  carouselDetail: {
    top: 105,
    padding: 20,
    textDecorationLine: 'underline',
  },
  bottomGradient: {
    height: 250,
    bottom: 50,
    borderRadius: 15,
  },
});

export default CarouselCard;

import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import {getStoredData, isDataPresent, storeData} from '../Hooks/localStorage';

const dimension = Dimensions.get('window');

const AnimeCard = ({
  title,
  banner,
  detail,
  animeLink,
  navigation,
  episodeLink,
}) => {
  const {colors} = useTheme();
  const [liked, setLiked] = useState(undefined);

  // 🔥 FIX: run only once per card instead of every render
  useEffect(() => {
    const checkLiked = async () => {
      const res = await isDataPresent('liked', {
        title,
        banner,
        detail,
        animeLink,
      });
      setLiked(res);
    };

    checkLiked();
  }, [title, banner, detail, animeLink]);

  const toggleLike = async () => {
    const isPresent = await isDataPresent('liked', {
      title,
      banner,
      detail,
      animeLink,
    });

    await storeData('liked', {title, banner, detail, animeLink});
    setLiked(!isPresent);
  };

  // Prevent render until liked state is known (avoids flicker)
  if (liked === undefined) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.container}
      onPress={() => {
        navigation.navigate('AnimeDetail', {animeLink});
      }}>
      <View
        style={[
          styles.cardWrapper,
          {backgroundColor: colors['titleColor']['orange']},
        ]}>
        {/* 🔥 FAST IMAGE (REPLACEMENT OF ImageBackground) */}
        <FastImage
          source={{
            uri: banner,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={styles.cardImg}
          resizeMode={FastImage.resizeMode.cover}>
          {/* Heart Icon Overlay */}
          <View style={styles.iconContainer}>
            <Icon
              onPress={toggleLike}
              name={'cards-heart'}
              size={28}
              color={
                liked
                  ? colors?.titleColor?.orange || '#ff6b6b'
                  : 'rgba(255,255,255,0.9)'
              }
            />
          </View>
        </FastImage>
      </View>

      <Text
        numberOfLines={2}
        style={[styles.animeTitle, {color: colors?.animeCard?.title}]}>
        {title}
      </Text>

      <Text
        numberOfLines={1}
        style={[styles.subText, {color: colors?.animeCard?.subText}]}>
        {detail}
      </Text>
    </TouchableOpacity>
  );
};

// 🔥 MEMO = HUGE performance boost in FlatList
export default memo(AnimeCard);

const styles = StyleSheet.create({
  container: {
    padding: 0,
    marginHorizontal: 10,
    marginTop: 12,
    alignItems: 'center',
  },
  cardWrapper: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  cardImg: {
    height: 200,
    width: dimension.width / 2.5,
    justifyContent: 'flex-start',
  },
  iconContainer: {
    alignItems: 'flex-end',
    padding: 6,
  },
  animeTitle: {
    fontSize: 16,
    fontWeight: '700',
    width: dimension.width / 2.5,
    marginTop: 6,
  },
  subText: {
    fontWeight: '600',
    marginTop: 2,
    width: dimension.width / 2.5,
    fontSize: 12,
  },
});

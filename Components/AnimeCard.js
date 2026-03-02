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
import LinearGradient from 'react-native-linear-gradient';
import {isDataPresent, storeData} from '../Hooks/localStorage';
import {interstitial} from '../Ads/Interstitial';

const dimension = Dimensions.get('window');
const CARD_WIDTH = dimension.width / 2.5;

const AnimeCard = ({title, banner, detail, animeLink, navigation}) => {
  const {colors} = useTheme();
  const [liked, setLiked] = useState(undefined);

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

  if (liked === undefined) return null;

  const handlePress = async () => {
    try {
      // If ad is already loaded → show it first
      if (interstitial.loaded) {
        interstitial.show();

        // Navigate AFTER ad closes (best UX)
        const unsubscribe = interstitial.addAdEventListener('closed', () => {
          unsubscribe();
          navigation.navigate('AnimeDetail', {animeLink});
          // Preload next ad for future clicks
          interstitial.load();
        });
      } else {
        // Ad not loaded → navigate instantly (no delay)
        navigation.navigate('AnimeDetail', {animeLink});
        // Load ad in background for next time
        interstitial.load();
      }
    } catch (e) {
      console.log('Ad error:', e);
      // Fallback safety navigation (never block user)
      navigation.navigate('AnimeDetail', {animeLink});
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.container}
      onPress={handlePress}>
      {/* 🔥 MODERN CARD */}
      <View
        style={[
          styles.card,
          {backgroundColor: colors['titleColor']['orange']},
        ]}>
        {/* Cover Image */}
        <FastImage
          source={{
            uri: banner,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />

        {/* 🔥 Bottom Gradient (modern look + readability) */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
          pointerEvents="none"
        />

        {/* ❤️ Floating Like Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={toggleLike}
          style={[styles.likeBtn, {backgroundColor: colors.card}]}>
          <Icon
            name={liked ? 'cards-heart' : 'cards-heart-outline'}
            size={22}
            color={liked ? colors.titleColor.orange : colors.animeCard.subText}
          />
        </TouchableOpacity>

        {/* 🔥 Overlay Title (Premium UI) */}
        <View style={styles.overlayText}>
          <Text numberOfLines={2} style={[styles.title, {color: '#fff'}]}>
            {title}
          </Text>
        </View>
      </View>

      {/* Subtitle / Chapter */}
      {!!detail && (
        <Text
          numberOfLines={1}
          style={[styles.detail, {color: colors.animeCard.subText}]}>
          {detail}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default memo(AnimeCard);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginTop: 14,
    width: CARD_WIDTH,
  },

  card: {
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 6, // Android shadow
  },

  image: {
    height: 210,
    width: '100%',
  },

  gradient: {
    position: 'absolute',
    bottom: 0,
    height: 90,
    width: '100%',
  },

  likeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 20,
    padding: 6,
    elevation: 4,
  },

  overlayText: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
  },

  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  detail: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    paddingHorizontal: 4,
  },
});

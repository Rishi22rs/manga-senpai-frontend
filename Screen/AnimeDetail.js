import {useNavigation, useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Pressable,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import ActivityLoader from '../Components/ActivityLoader';
import {Icon} from 'react-native-elements';
import {mangaDetail} from '../Scraping/mangaDetail';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {width, height} = Dimensions.get('window');

const AnimeDetail = ({route}) => {
  const {colors} = useTheme();
  const [data, setData] = useState(null);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    mangaDetail(route.params.animeLink).then(res => {
      setData(res);
    });
  }, [route.params.animeLink]);

  if (!data) {
    return (
      <View style={[styles.loader, {backgroundColor: colors.background}]}>
        <ActivityLoader title="Loading Manga..." />
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar barStyle="light-content" />
      {/* Banner */}
      <View
        style={[
          styles.bannerWrapper,
          {backgroundColor: colors['titleColor']['orange']},
        ]}>
        <FastImage
          source={{
            uri: data.banner,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
            headers: {
              Referer: 'https://mangakatana.com/',
              'User-Agent': 'Mozilla/5.0',
            },
          }}
          style={styles.banner}
          resizeMode={FastImage.resizeMode.cover}
        />

        {/* Gradient overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
          pointerEvents="none"
        />
      </View>
      {/* 🔥 SINGLE ScrollView (IMPORTANT) */}
      {/* Back Button */}
      <Pressable
        style={[
          styles.backButton,
          {backgroundColor: colors.card, top: insets.top + 10},
        ]}
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('Home'); // or your main screen
          }
        }}>
        <Icon name="arrow-back" type="material" color={colors.text} />
      </Pressable>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{paddingBottom: 40}}>
        {/* Content Card */}
        <View
          style={{paddingTop: Dimensions.get('screen').height / 2.8}}></View>
        <View style={[styles.contentCard, {backgroundColor: colors.card}]}>
          {/* Title */}
          <Text style={[styles.title, {color: colors.animedetail.title}]}>
            {data.title}
          </Text>

          {/* Status Badge */}
          {!!data.status?.trim() ? (
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: colors.titleColor.orange},
              ]}>
              <Text
                style={{
                  color: colors.epBtn.color,
                  fontWeight: '700',
                }}>
                {data.status?.trim()}
              </Text>
            </View>
          ) : null}

          {/* Alt Names */}
          {data?.alt_name?.length > 0 && (
            <View style={styles.altContainer}>
              {data.alt_name.map((name, index) => (
                <Text
                  key={index}
                  style={[styles.altName, {color: colors.animeCard.subText}]}>
                  {name.trim()}
                </Text>
              ))}
            </View>
          )}

          {/* Genres */}
          <View style={styles.genreContainer}>
            {data.genres?.map((genre, index) => (
              <View
                key={index}
                style={[
                  styles.genrePill,
                  {
                    backgroundColor: colors.genreBackgroundInDetail,
                  },
                ]}>
                <Text
                  style={{
                    color: colors.genreTextColor,
                    fontWeight: '600',
                  }}>
                  {genre.trim()}
                </Text>
              </View>
            ))}
          </View>

          {/* Start Reading Button */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.readButton,
              {backgroundColor: colors.epBtn.background},
            ]}
            onPress={() =>
              navigation.navigate('AnimeEpisodeList', {
                episodeList: data.chapters,
                name: data.title,
              })
            }>
            <Text style={[styles.readText, {color: colors.epBtn.color}]}>
              📖 Start Reading
            </Text>
          </TouchableOpacity>

          {/* Summary Title */}
          <Text
            style={[styles.sectionTitle, {color: colors.animedetail.title}]}>
            Summary
          </Text>

          {/* Summary Text */}
          <Text style={[styles.summary, {color: colors.animedetail.detail}]}>
            {data.summary?.trim()}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AnimeDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerWrapper: {
    height: height * 0.45,
    width: width,
    position: 'absolute',
  },
  banner: {
    height: '100%',
    width: '100%',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    borderRadius: 20,
    padding: 8,
    elevation: 5,
    zIndex: 10,
  },
  contentCard: {
    marginTop: -40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
  },
  altContainer: {
    marginBottom: 15,
  },
  altName: {
    textAlign: 'center',
    fontSize: 13,
    marginBottom: 3,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
  },
  genrePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
  },
  readButton: {
    marginTop: 20,
    marginBottom: 25,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 4,
  },
  readText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  summary: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'justify',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

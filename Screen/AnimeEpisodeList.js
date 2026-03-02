import React, {useMemo, useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import TopBar from '../Components/TopBar';
import {useTheme} from '@react-navigation/native';
import {interstitial} from '../Ads/Interstitial';
import Banner from '../Ads/Banner';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

const AnimeEpisodeList = ({route, navigation}) => {
  const {colors} = useTheme();
  const originalEpisodes = route.params.episodeList || [];

  const [ascending, setAscending] = useState(false);

  // 🔥 SAFE SORT (no state mutation)
  const episodeList = useMemo(() => {
    const list = [...originalEpisodes];
    return ascending ? list.reverse() : list;
  }, [ascending, originalEpisodes]);

  const handleEpisodePress = useCallback(
    item => {
      try {
        interstitial.load();
        interstitial.show();
      } catch (e) {
        console.log('Ad error:', e);
      }

      navigation.navigate('Manga', {
        link: item.link,
      });
    },
    [navigation],
  );

  const renderEpisodeCard = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => handleEpisodePress(item)}
        style={styles.cardWrapper}>
        {/* 🔥 Gradient Card (Modern Look) */}
        <LinearGradient
          colors={[colors.titleColor.orange, colors.titleColor.orange + 'CC']}
          style={styles.card}>
          {/* Chapter Title */}
          <Text style={[styles.chapterTitle, {color: colors.background}]}>
            {item.chapterName}
          </Text>

          {/* Meta Row */}
          <View style={styles.metaRow}>
            <Text style={[styles.chapterIndex, {color: colors.background}]}>
              Chapter {index + 1}
            </Text>

            {!!item.datetime && (
              <Text
                style={[styles.chapterDate, {color: colors.titleColor.grey}]}>
                {item.datetime}
              </Text>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <TopBar title={route.params.name} navigation={navigation} />

      <Banner />

      {/* 🔥 Modern Sticky Sort Bar */}
      <View style={styles.sortContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setAscending(prev => !prev)}
          style={[
            styles.sortButton,
            {backgroundColor: colors.titleColor.orange},
          ]}>
          <Icon
            name={ascending ? 'sort-ascending' : 'sort-descending'}
            size={18}
            color={colors.background}
          />
          <Text style={[styles.sortText, {color: colors.background}]}>
            {ascending ? 'Old → New' : 'New → Old'}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.countText, {color: colors.animeCard.subText}]}>
          {episodeList.length} Chapters
        </Text>
      </View>

      {/* 🔥 Optimized Chapter List */}
      <FlatList
        data={episodeList}
        renderItem={renderEpisodeCard}
        keyExtractor={(item, index) => `${item.link || 'chapter'}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
};

export default AnimeEpisodeList;

const styles = StyleSheet.create({
  container: {
    flex: 1, // 🔥 FIXES header centering + scroll bugs
  },

  // 🔥 Sort Bar
  sortContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sortButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 6,
  },
  sortText: {
    marginLeft: 6,
    fontWeight: '700',
    fontSize: 13,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
  },

  // 🔥 Modern Episode Card
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 18,
    padding: 18,
    width: '100%',
    elevation: 4,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chapterIndex: {
    fontSize: 13,
    fontWeight: '700',
    opacity: 0.9,
  },
  chapterDate: {
    fontSize: 12,
    fontWeight: '600',
  },
});

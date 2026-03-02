import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import AnimeCard from '../Components/AnimeCard';
import TopBar from '../Components/TopBar';
import {useTheme} from '@react-navigation/native';
import {mangaListPages} from '../Scraping/mangaListPages';
import Banner from '../Ads/Banner';
import {API} from '../Scraping/api';
import ActivityLoader from '../Components/ActivityLoader';

const {width} = Dimensions.get('window');

const EpisodeBtn = React.memo(({page, link, colors, getData, active}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => getData(link)}
      style={[
        styles.pageBtn,
        {
          backgroundColor: active
            ? colors.titleColor.orange
            : colors.genreBackgroundInDetail,
        },
      ]}>
      <Text
        style={{
          color: active ? colors.epBtn.color : colors.genreTextColor,
          fontWeight: '700',
        }}>
        {page}
      </Text>
    </TouchableOpacity>
  );
});

const SeeAll = ({route, navigation}) => {
  const {colors} = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const url = route.params?.url;

  const getData = useCallback(async link => {
    try {
      setLoading(true);
      const res = await mangaListPages(link);
      setData(res);
    } catch (e) {
      console.log('Pagination error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (url) {
      getData(url);
    }
  }, [url, getData]);

  const pages = data?.totalPages
    ? Array.from({length: data.totalPages}, (_, i) => i + 1)
    : [];

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      {/* 🔥 FIXED HEADER */}
      <TopBar title={route.params.title} navigation={navigation} />

      <Banner />

      {/* 🔥 MODERN PAGINATION (Sticky Horizontal Pills) */}
      {url && data && (
        <View style={styles.paginationWrapper}>
          <FlatList
            horizontal
            data={pages}
            keyExtractor={item => item.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.paginationContent}
            renderItem={({item}) => (
              <EpisodeBtn
                page={item}
                colors={colors}
                active={currentPage === item}
                link={`${API}/genre/${route.params.title.toLowerCase()}/page/${item}`}
                getData={link => {
                  setCurrentPage(item);
                  getData(link);
                }}
              />
            )}
          />
        </View>
      )}

      {/* 🔥 CONTENT AREA (NO HEIGHT HACKS) */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityLoader title="Loading Manga..." />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={url ? data?.mangaList : route.params.data}
          keyExtractor={(item, index) => `${item.link}-${index}`}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.row}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={7}
          removeClippedSubviews={true}
          ListFooterComponent={<View style={{height: 80}} />}
          renderItem={({item}) => (
            <AnimeCard
              title={item.name || item.title}
              banner={item.image || item.banner}
              detail={
                item.chapter_story_title || item.releaseDate || item.chapter
              }
              animeLink={item.link}
              navigation={navigation}
              episodeLink={route.params.episodeLink}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default SeeAll;

const styles = StyleSheet.create({
  container: {
    flex: 1, // 🔥 IMPORTANT: fixes scroll + header centering
  },

  // 🔥 Modern Pagination Bar
  paginationWrapper: {
    height: 70,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  paginationContent: {
    paddingHorizontal: 10,
  },
  pageBtn: {
    marginHorizontal: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    minWidth: 42,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  // 🔥 Grid Layout (Modern spacing)
  gridContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },

  // Loader (centered body only, header stays top)
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

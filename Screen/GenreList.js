import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState, memo} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Banner from '../Ads/Banner';
import ActivityLoader from '../Components/ActivityLoader';
import TopBar from '../Components/TopBar';
import {genrePage} from '../Scraping/genrePage';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2;

const GenreCard = memo(({data, navigation, colors}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.cardWrapper, {backgroundColor: colors.card}]}
      onPress={() =>
        navigation.navigate('SeeAll', {
          data: '',
          episodeLink: false,
          url: data.link,
          title: data.genre,
        })
      }>
      <LinearGradient
        colors={[colors.titleColor.orange, colors.titleColor.orange + 'CC']}
        style={styles.gradient}
      />

      <Text
        numberOfLines={2}
        style={[styles.genreText, {color: colors.carouselCardText.title}]}>
        {data.genre}
      </Text>
    </TouchableOpacity>
  );
});

const GenreList = ({navigation}) => {
  const [genreList, setGenreList] = useState(null);
  const {colors} = useTheme();

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const res = await genrePage();
        setGenreList(res);
      } catch (e) {
        console.log('Genre load error:', e);
      }
    };

    loadGenres();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      {/* 🔥 Header ALWAYS on top */}
      <TopBar
        title="Genre List"
        navigation={navigation}
        showNavigation={false}
      />

      <Banner />

      {/* 🔥 Body Content */}
      {!genreList ? (
        <View style={styles.loaderBody}>
          <ActivityLoader title="Loading Genres..." />
        </View>
      ) : (
        <FlatList
          data={genreList}
          numColumns={2}
          keyExtractor={(item, index) => `${item.genre}-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          initialNumToRender={12}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          renderItem={({item}) => (
            <GenreCard data={item} navigation={navigation} colors={colors} />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default GenreList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // 🔥 Only loader body is centered (NOT header)
  loaderBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listContent: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-between',
  },

  cardWrapper: {
    width: CARD_WIDTH,
    height: 90,
    borderRadius: 18,
    marginBottom: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },

  genreText: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    paddingHorizontal: 10,
    letterSpacing: 0.3,
  },
});

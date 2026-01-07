import React, {useEffect, useState} from 'react';
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

const dimension = Dimensions.get('window');

const EpisodeBtn = ({uniqueKey, link, colors, getData}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log('link =', link);
        getData(link);
      }}>
      <Text
        style={[
          styles.epBtn,
          {
            backgroundColor: colors.epBtn.background,
            color: colors.epBtn.color,
          },
        ]}>
        {uniqueKey}
      </Text>
    </TouchableOpacity>
  );
};

const SeeAll = ({route, navigation}) => {
  const {colors} = useTheme();
  const [data, setData] = useState();
  useEffect(() => {
    route.params?.url && getData(route.params?.url);
  }, []);
  console.log('route.params?.url', route.params?.url);
  const getData = url => {
    mangaListPages(url).then(res => {
      setData(res);
    });
  };

  const range = (start, end) => {
    return Array.from({length: data?.totalPages}, (_, i) => i + 1);
  };

  console.log({data});

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors?.['background']}]}>
      <TopBar title={route.params.title} navigation={navigation} />
      <Banner />
      {route.params?.url && data && (
        <View style={{height: 38}}>
          <FlatList
            horizontal
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={range(1, data?.totalPages)}
            keyExtractor={item => item.toString()}
            renderItem={({item}) => (
              <EpisodeBtn
                colors={colors}
                uniqueKey={item}
                link={`${API}/genre/${route.params.title.toLowerCase()}/page/${item}`}
                getData={getData}
                title={route.params.title}
              />
            )}
          />
        </View>
      )}
      {data && (
        <View
          style={{
            paddingBottom: 60,
            marginLeft: 5,
            height: route.params?.url
              ? dimension.height - 120
              : dimension.height - 80,
          }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={route.params?.url ? data?.mangaList : route.params.data}
            renderItem={({item}) => (
              <AnimeCard
                title={item.name}
                banner={item.image}
                detail={item.chapter_story_title}
                animeLink={item.link}
                navigation={navigation}
                episodeLink={route.params.episodeLink}
              />
            )}
            numColumns={2}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: dimension.height,
    alignItems: 'center',
  },
  epBtn: {
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    padding: 10,
    borderRadius: 15,
    minWidth: 40,
    height: 38,
    textAlign: 'center',
  },
});

export default SeeAll;

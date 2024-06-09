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
import {ThemePalette, selectedTheme} from '../Theme/ThemePalette';
import TopBar from '../Components/TopBar';
import {useTheme} from '@react-navigation/native';
import {mangaListPages} from '../Scraping/mangaListPages';
import Banner from '../Ads/Banner';

const dimension = Dimensions.get('window');

const EpisodeBtn = ({uniqueKey, episodeLink, colors, getData}) => {
  return (
    <TouchableOpacity key={uniqueKey} onPress={() => getData(episodeLink)}>
      <Text
        style={[
          styles.epBtn,
          {backgroundColor: colors.epBtn.background, color: colors.epBtn.color},
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

  const getData = url => {
    mangaListPages(url).then(res => {
      setData(res);
    });
  };
  
  const range = (start, end) => {
    return Array(end - start + 1)
      .fill()
      .map((_, idx) => start + idx);
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors?.['background']}]}>
      <TopBar title={route.params.title} navigation={navigation} />
      <Banner />
      {route.params?.url && data && (
        <View style={{height:38}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={range(1, data[0].numOfPages)}
            renderItem={({item, index}) => (
              <EpisodeBtn
                colors={colors}
                uniqueKey={item}
                episodeLink={route.params?.url.slice(0, -1) + item}
                getData={getData}
              />
            )}
            keyExtractor={(item, index) => index}
            horizontal={true}
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
            data={route.params?.url ? data : route.params.data}
            renderItem={({item}) => (
              <AnimeCard
                title={item.title}
                banner={item.banner}
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
    alignItems:'center'
  },
  epBtn: {
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    padding: 10,
    borderRadius: 15,
    width: 40,
    height: 38,
    textAlign: 'center',
  },
});

export default SeeAll;

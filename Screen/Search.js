import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import {SearchBar} from 'react-native-elements';
import TopBar from '../Components/TopBar';
import {ThemePalette, selectedTheme} from '../Theme/ThemePalette';
import AnimeCard from '../Components/AnimeCard';
import ActivityLoader from '../Components/ActivityLoader';
import {useTheme} from '@react-navigation/native';
import {searching} from '../Scraping/searching';
import * as cheerio from 'cheerio';
import Banner from '../Ads/Banner';
import {API} from '../Scraping/api';

const dimension = Dimensions.get('window');

const Search = ({navigation, route}) => {
  const [keyword, setKeyword] = useState();
  const [animeList, setAnimeList] = useState();
  const searchRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      searchRef.current.focus();
    });

    return unsubscribe;
  }, [navigation]);
  let searchTimeoutToken = 0;
  const searchAnime = e => {
    setIsLoading(true);
    setKeyword(e);
    if (e.length > 3) {
      let formData = new FormData();
      formData.append('search_by', 'book_name'); // todo by author name also
      formData.append('s', e);
      clearInterval(searchTimeoutToken);
      if (e.length >= 3) {
        searchTimeoutToken = setTimeout(() => {
          fetch(API, {
            method: 'post',
            body: formData,
          })
            .then(res => res.text())
            .then(text => {
              console.log('search text', text);
              setAnimeList(searching(text));
              setIsLoading(false);
            });
        }, 500);
      }
    }
  };

  const {colors} = useTheme();

  const extractName = title => {
    const $ = cheerio.load(title);
    return $.text().charAt(0).toUpperCase() + $.text().slice(1);
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <TopBar showNavigation={false} />
      <SearchBar
        placeholder="Start searching..."
        onChangeText={searchAnime}
        value={keyword}
        lightTheme={true}
        containerStyle={[
          styles.containerStyle,
          styles.searchHeight,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.background,
          },
        ]}
        inputContainerStyle={[
          styles.containerStyle,
          styles.searchHeight,
          {backgroundColor: colors.background},
        ]}
        ref={searchRef}
        // onSubmitEditing={searchAnime}
      />

      <View style={[styles.searchContainer]}>
        {console.log('animeList', animeList)}
        {!!animeList ? (
          <>
            {animeList?.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={{height: dimension.height - 165}}
                data={animeList}
                renderItem={({item}) => (
                  <AnimeCard
                    title={extractName(item.name)}
                    banner={item.image}
                    detail={item.lastChapter}
                    animeLink={item.link}
                    navigation={navigation}
                  />
                )}
                numColumns={2}
              />
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  color: colors['titleColor']['orange'],
                }}>
                {`Sorry, Not found Manga with that keyword.`}.
              </Text>
            )}
          </>
        ) : (
          isLoading && <ActivityLoader />
        )}
      </View>
      {/* <View>
        <View>
          <FlatList
            style={{height: dimension.height - 165}}
            data={[sampleData, sampleData]}
            renderItem={({item}) => (
              <AnimeCard
                title={extractName(item.name)}
                banner={item.image}
                detail={item.lastchapter}
                animeLink={item.animeLink}
                navigation={navigation}
              />
            )}
            numColumns={2}
          />
        </View>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: dimension.height,
    alignItems: 'center',
  },
  containerStyle: {
    borderBottomWidth: 0.5,
    // borderBottomColor: '#dbdbdb',
    borderTopWidth: 0,
    width: '100%',
  },
  searchHeight: {
    height: 20,
  },
  searchContainer: {
    marginTop: 20,
  },
});

export default Search;

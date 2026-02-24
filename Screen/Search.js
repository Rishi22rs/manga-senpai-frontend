import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, FlatList} from 'react-native';
import {SearchBar} from 'react-native-elements';
import TopBar from '../Components/TopBar';
import AnimeCard from '../Components/AnimeCard';
import ActivityLoader from '../Components/ActivityLoader';
import {useTheme} from '@react-navigation/native';
import {searching} from '../Scraping/searching';
import * as cheerio from 'cheerio';
import {API} from '../Scraping/api';

const dimension = Dimensions.get('window');

const Search = ({navigation}) => {
  const [keyword, setKeyword] = useState('');
  const [animeList, setAnimeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchRef = useRef(null);
  const timeoutRef = useRef(null); // 🔥 FIX 1: persistent debounce
  const requestIdRef = useRef(0); // 🔥 FIX 2: prevent race condition

  const {colors} = useTheme();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      searchRef.current?.focus();
    });

    return unsubscribe;
  }, [navigation]);

  const searchAnime = text => {
    setKeyword(text);

    // 🔥 If input empty, reset
    if (!text || text.trim().length < 3) {
      setAnimeList([]);
      setIsLoading(false);
      return;
    }

    // 🔥 FIX 3: Proper debounce (cancel previous timeout)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        setIsLoading(true);

        // 🔥 FIX 4: Track latest request
        const currentRequestId = ++requestIdRef.current;

        let formData = new FormData();
        formData.append('search_by', 'book_name');
        formData.append('s', text);

        const res = await fetch(API, {
          method: 'POST',
          body: formData,
        });

        const html = await res.text();

        // 🚨 Ignore old responses (MAIN FIX)
        if (currentRequestId !== requestIdRef.current) return;

        const parsed = searching(html) || [];
        setAnimeList(parsed);
      } catch (err) {
        console.log('Search error:', err);
        setAnimeList([]);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce
  };

  const extractName = title => {
    const $ = cheerio.load(title || '');
    const text = $.text();
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <TopBar showNavigation={false} />

      <SearchBar
        ref={searchRef}
        placeholder="Start searching..."
        onChangeText={searchAnime}
        value={keyword}
        lightTheme
        containerStyle={[
          styles.containerStyle,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.background,
          },
        ]}
        inputContainerStyle={[
          styles.containerStyle,
          {backgroundColor: colors.background},
        ]}
      />

      <View style={styles.searchContainer}>
        {isLoading ? (
          <ActivityLoader title="Searching..." />
        ) : animeList.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{height: dimension.height - 165}}
            data={animeList}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            renderItem={({item}) => (
              <AnimeCard
                title={extractName(item.name)}
                banner={item.image}
                detail={item.lastChapter}
                animeLink={item.link}
                navigation={navigation}
              />
            )}
          />
        ) : keyword.length >= 3 ? (
          <Text
            style={{
              textAlign: 'center',
              color: colors?.titleColor?.orange || 'orange',
              marginTop: 20,
            }}>
            Sorry, No manga found with that keyword.
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  containerStyle: {
    borderBottomWidth: 0.5,
    borderTopWidth: 0,
    width: '100%',
  },
  searchContainer: {
    marginTop: 20,
  },
});

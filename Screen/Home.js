import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  SafeAreaView,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {homePage} from '../Scraping/homePage';
// import Carousel from 'react-native-snap-carousel';
import CarouselCard from '../Components/CarouselCard';
import AnimeCard from '../Components/AnimeCard';
import TopBar from '../Components/TopBar';
import ActivityLoader from '../Components/ActivityLoader';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {mangaListPages} from '../Scraping/mangaListPages';
import Icon from 'react-native-vector-icons/Fontisto';
import {getOtherData, storeOtherData} from '../Theme/ThemePalette';
import mobileAds, { BannerAd, BannerAdSize, TestIds,AppOpenAd, AdEventType } from 'react-native-google-mobile-ads';
import Banner from '../Ads/Banner';
import { interstitial } from '../Ads/Interstitial';
import { isDataPresent, storeData } from '../Hooks/localStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const dimension = Dimensions.get('window');

const Home = ({navigation}) => {
  const {colors} = useTheme();
  const carouselRef = useRef();

  const [homePageData, setHomePageData] = useState();

  const [showBanner, setShowBanner] = useState(true);
  const [loaded, setLoaded] = useState(false);

 
const showAlert = () => {
  const message = `
    • Now save a manga, manhwa or manhua you like.
    • Now sort the list of episodes from start or end or end to start.
    
    More features are coming soon🎊 🎊 🎊
    
    Enjoy🎉 🎉 🎉 
      `;

  Alert.alert('New Update Overview', message, [{text: 'Cool'}]);
};
  
  useEffect(() => {
    checkAndShowAlert();
  }, []);

  const checkAndShowAlert = async () => {
    try {
      const alertShown = await AsyncStorage.getItem('alertShown');
      if (alertShown === null) {
        // Alert has not been shown yet
        showAlert();
        await AsyncStorage.setItem('alertShown', 'true');
      }
    } catch (error) {
      console.error('Error checking or setting alert flag:', error);
    }
  };

  useFocusEffect(
      useCallback(()=>{
    const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    // Start loading the interstitial straight away
    interstitial.load();
    
    getOtherData('@showBanner').then(res => {
      res == 'true' ? setShowBanner(true) : setShowBanner(false);
    });
    homePage().then(res => {
      setHomePageData(res);
    });
    // Unsubscribe from events on unmount
    return unsubscribe;
},[]));

  const hideBanner = () => {
    storeOtherData('@showBanner', 'false');
    setShowBanner(false);
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <TopBar showNavigation={false}/>
      <Banner/>
      {showBanner && (
        <View
          style={{
            position: 'absolute',
            zIndex: 1000,
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              zIndex: 1001,
              backgroundColor: colors.background,
              height: dimension.height - 400,
              width: dimension.width - 100,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20,
            }}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: 'bold',
                color: colors['animeCard']['title'],
              }}>
              Welcome
            </Text>
            <Text
              style={{
                margin: 30,
                fontSize: 17,
                color: colors['animeCard']['title'],
              }}>
              Welcome to Manga Senpai. It's a place to read all kinds of Manga,
              Manhua and Manhwa. It is free to use and always will
              be.
            </Text>
            <TouchableOpacity style={{marginTop: 20}} onPress={hideBanner}>
              <Text
                style={{
                  textDecorationLine: 'underline',
                  fontSize: 15,
                  color: colors['animeCard']['title'],
                }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <ScrollView>
        {homePageData && (
          <>
            {/* <View style={[styles.sectionTitleContainer, {marginBottom: 10}]}>
              <Text
                style={[
                  styles.sectionTitle,
                  {color: colors['animeCard']['title']},
                ]}>
                Monthly Trending
              </Text>
              <Text
                onPress={() =>
                  navigation.navigate('SeeAll', {
                    data: homePageData.monthlyTrending,
                    episodeLink: true,
                  })
                }
                style={[
                  styles.seeAll,
                  {color: colors['titleColor']['orange']},
                ]}>
                See all
              </Text>
            </View> */}
            {/* <Carousel
              loop={true}
              ref={carouselRef}
              layout={'stack'}
              autoplay={true}
              data={homePageData.monthlyTrending}
              renderItem={({item, index}) => {
                return (
                  <CarouselCard
                    title={item.title}
                    banner={item.banner}
                    detail={item.chapter_story_title}
                    animeLink={item.link}
                    chapterStoryLink={item.chapter_story_link}
                    navigation={navigation}
                  />
                );
              }}
              sliderWidth={dimension.width}
              itemWidth={dimension.width}
            /> */}
            
            <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
              data={[
                {
                  title: 'Manhua',
                  link: 'https://h.mangairo.com/manga-list/type-topview/ctg-44/state-all/page-1',
                },
                {
                  title: 'Manhwa',
                  link: 'https://h.mangairo.com/manga-list/type-topview/ctg-43/state-all/page-1',
                },
                {
                  title: 'Hot Manga',
                  link: 'https://h.mangairo.com/manga-list/type-topview/ctg-all/state-all/page-1',
                },
                {
                  title: 'Latest Manga',
                  link: 'https://h.mangairo.com/manga-list/type-latest/ctg-all/state-all/page-1',
                },
                {
                  title: 'Completed Manga',
                  link: 'https://h.mangairo.com/manga-list/type-topview/ctg-all/state-completed/page-1',
                },
              ]}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('SeeAll', {
                      data: homePageData.monthlyTrending,
                      episodeLink: false,
                      url: item.link,
                    })
                  }
                  activeOpacity={0.5}
                  style={[
                    styles.tab,
                    {backgroundColor: colors.titleColor.orange},
                  ]}>
                  <Text style={{fontWeight: 'bold'}}>{item.title}</Text>
                </TouchableOpacity>
              )}
              horizontal={true}
            />
            
            <View>
              <View style={styles.sectionTitleContainer}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {color: colors['animeCard']['title']},
                  ]}>
                  Monthly Trending
                </Text>
                <Text
                  onPress={() =>
                    navigation.navigate('SeeAll', {
                      data: homePageData.monthlyTrending,
                      title: 'Monthly Trending',
                      episodeLink: false,
                    })
                  }
                  style={[
                    styles.seeAll,
                    {marginTop: 2, color: colors['titleColor']['orange']},
                  ]}>
                  See all
                </Text>
              </View>

              <FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
                data={homePageData.monthlyTrending}
                renderItem={({item}) => (
                  <AnimeCard
                    title={item.title}
                    banner={item.banner}
                    animeLink={item.link}
                    navigation={navigation}
                    detail={item.chapter_story_title}
                  />
                )}
                horizontal={true}
              />
            </View>
<Banner/>
            <View>
              <View style={styles.sectionTitleContainer}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {color: colors['animeCard']['title']},
                  ]}>
                  Recently Updated
                </Text>
                <Text
                  onPress={() =>
                    navigation.navigate('SeeAll', {
                      data: homePageData.recentlyUpdated,
                      title: 'Recenty Updated',
                      episodeLink: false,
                    })
                  }
                  style={[
                    styles.seeAll,
                    {marginTop: 2, color: colors['titleColor']['orange']},
                  ]}>
                  See all
                </Text>
              </View>

              <FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
                data={homePageData.recentlyUpdated}
                renderItem={({item}) => (
                  <AnimeCard
                    title={item.title}
                    banner={item.banner}
                    detail={item.releaseDate}
                    animeLink={item.link}
                    navigation={navigation}
                  />
                )}
                horizontal={true}
              />
            </View>
            <Banner/>
            <View>
              <View style={styles.sectionTitleContainer}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {color: colors['animeCard']['title']},
                  ]}>
                  New Manga
                </Text>
                <Text
                  onPress={() =>
                    navigation.navigate('SeeAll', {
                      data: homePageData.newManga,
                      title: 'New Manga',
                      episodeLink: false,
                    })
                  }
                  style={[
                    styles.seeAll,
                    {marginTop: 2, color: colors['titleColor']['orange']},
                  ]}>
                  See all
                </Text>
              </View>

              <FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
                data={homePageData.newManga}
                renderItem={({item}) => (
                  <AnimeCard
                    title={item.title}
                    banner={item.banner}
                    detail={item.chapter_story_title}
                    animeLink={item.link}
                    navigation={navigation}
                  />
                )}
                horizontal={true}
              />
            </View>
          </>
        )}
        {/* {homePageData && ( */}

        {/* )} */}
        {homePageData === undefined && (
          <ActivityLoader
            title={`Loading...${'\n'}It may take few seconds.!!!`}
          />
        )}
        <View style={{height: 70}}></View>
      </ScrollView>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: dimension.height,
  },
  seeAll: {
    textAlign: 'right',
    alignSelf: 'stretch',
    paddingRight: 40,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sectionTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 0,
    paddingLeft: 20,
    marginTop: 15,
    justifyContent: 'space-between',
  },
  tab: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    marginTop: 20,
  },
});

export default Home;

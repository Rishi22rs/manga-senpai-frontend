import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {homePage} from '../Scraping/homePage';
import AnimeCard from '../Components/AnimeCard';
import TopBar from '../Components/TopBar';
import ActivityLoader from '../Components/ActivityLoader';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Banner from '../Ads/Banner';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');

const Home = ({navigation}) => {
  const {colors} = useTheme();
  const [homePageData, setHomePageData] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    checkAndShowAlert();
  }, []);

  const checkAndShowAlert = async () => {
    const alertShown = await AsyncStorage.getItem('alertShown');
    if (alertShown === null) {
      setShowWelcome(true);
      await AsyncStorage.setItem('alertShown', 'true');
    }
  };

  useFocusEffect(
    useCallback(() => {
      homePage().then(res => {
        setHomePageData(res);
      });
    }, []),
  );

  const renderSection = (title, data) => {
    if (!data || data.length === 0) return null;

    return (
      <View style={styles.sectionWrapper}>
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, {color: colors.animeCard.title}]}>
            {title}
          </Text>
        </View>

        {/* Horizontal List */}
        <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{paddingHorizontal: 10}}
          renderItem={({item}) => (
            <AnimeCard
              title={item.title}
              banner={item.banner}
              detail={
                item.chapter_story_title || item.releaseDate || item.chapter
              }
              animeLink={item.link}
              navigation={navigation}
            />
          )}
        />
      </View>
    );
  };

  if (!homePageData) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: colors.background}]}>
        <TopBar showNavigation={false} />

        <View style={styles.loaderWrapper}>
          <ActivityLoader title="Loading Manga..." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <TopBar showNavigation={false} />

      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.spacer} />

            <Banner />

            {renderSection('🔥 Monthly Trending', homePageData.monthlyTrending)}

            <Banner />

            {renderSection('⚡ Recently Updated', homePageData.recentlyUpdated)}

            <Banner />

            {renderSection('🆕 New Manga', homePageData.newManga)}

            <Banner />

            <View style={{height: 80}} />
          </>
        }
        data={[]}
        renderItem={null}
      />

      {/* 🔥 MODERN WELCOME MODAL */}
      {showWelcome && (
        <View style={styles.overlay}>
          <View style={[styles.welcomeCard, {backgroundColor: colors.card}]}>
            <Text
              style={[styles.welcomeTitle, {color: colors.animeCard.title}]}>
              Welcome 👋
            </Text>

            <Text
              style={[styles.welcomeText, {color: colors.animeCard.subText}]}>
              Welcome to Manga Senpai. Read Manga, Manhwa & Manhua for FREE. App
              is under active development 🚀
            </Text>

            <TouchableOpacity
              style={[
                styles.startBtn,
                {backgroundColor: colors.titleColor.orange},
              ]}
              onPress={() => setShowWelcome(false)}>
              <Text style={{color: '#fff', fontWeight: '800'}}>Let’s Go</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
  },

  // 🔥 HERO UI (Modern)
  heroCard: {
    margin: 16,
    padding: 20,
    borderRadius: 24,
    elevation: 6,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 5,
  },
  heroSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },

  // Sections
  sectionWrapper: {
    marginTop: 10,
    marginBottom: 15,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
  },

  // Welcome Modal (Modern Glass Look)
  overlay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeCard: {
    width: width - 60,
    borderRadius: 24,
    padding: 25,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 10,
  },
  welcomeText: {
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 20,
  },
  startBtn: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
});

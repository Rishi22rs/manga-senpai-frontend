import React, {useCallback} from 'react';
import {
  View,
  Text,
  Dimensions,
  Linking,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import TopBar from '../Components/TopBar';
import Icon from 'react-native-vector-icons/Fontisto';
import {useTheme} from '@react-navigation/native';
import Banner from '../Ads/Banner';
import LinearGradient from 'react-native-linear-gradient';
import {appVersion} from '../app.json';

const {width} = Dimensions.get('window');

const URL = 'https://forms.gle/8wnYcfkkEXY867KC9';

const Discord = () => {
  const {colors} = useTheme();

  const handlePress = useCallback(async () => {
    try {
      const supported = await Linking.canOpenURL(URL);
      if (supported) {
        await Linking.openURL(URL);
      }
    } catch (e) {
      console.log('Open URL error:', e);
    }
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar
        barStyle={
          colors.background === '#2B2B2B' ? 'light-content' : 'dark-content'
        }
      />

      <TopBar showNavigation={false} />

      {/* 🔥 HERO CARD (Modern Glass Style) */}
      <View style={styles.content}>
        <LinearGradient
          colors={[colors.titleColor.orange, colors.titleColor.orange + 'CC']}
          style={styles.heroCard}>
          <Icon
            name="smiley"
            size={42}
            color={colors.epBtn.color}
            style={{marginBottom: 10}}
          />

          <Text style={[styles.title, {color: colors.epBtn.color}]}>
            Welcome to Manga Senpai 👋
          </Text>

          <Text style={[styles.subtitle, {color: colors.epBtn.color}]}>
            Read Manga, Manhwa & Manhua for FREE. The app is under active
            development 🚀
          </Text>
        </LinearGradient>

        {/* 🔥 Feedback Card */}
        <View style={[styles.card, {backgroundColor: colors.card}]}>
          <Text style={[styles.cardTitle, {color: colors.animeCard.title}]}>
            Feedback & Suggestions
          </Text>

          <Text style={[styles.cardDesc, {color: colors.animeCard.subText}]}>
            Found a bug? Want a feature? Help improve Manga Senpai by sharing
            your feedback.
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.feedbackButton,
              {backgroundColor: colors.titleColor.orange},
            ]}
            onPress={handlePress}>
            <Icon
              name="messenger"
              size={18}
              color={colors.epBtn.color}
              style={{marginRight: 8}}
            />
            <Text style={[styles.feedbackText, {color: colors.epBtn.color}]}>
              Feedback / Query / Suggestions
            </Text>
          </TouchableOpacity>
        </View>

        {/* 🔥 Version Card (Modern Footer) */}
        <View
          style={[
            styles.versionCard,
            {backgroundColor: colors.genreBackgroundInDetail},
          ]}>
          <Text
            style={{
              color: colors.genreTextColor,
              fontWeight: '700',
            }}>
            App Version
          </Text>
          <Text
            style={{
              marginTop: 4,
              color: colors.animeCard.title,
              fontWeight: '800',
            }}>
            {`2.0.0 (${appVersion})`}
          </Text>
        </View>

        {/* Ad Banner */}
        <View style={{marginTop: 20}}>
          <Banner />
          <Banner />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Discord;

const styles = StyleSheet.create({
  container: {
    flex: 1, // 🔥 FIX: prevents header from centering bug
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // 🔥 Modern Hero Card
  heroCard: {
    width: '100%',
    borderRadius: 24,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.95,
  },

  // 🔥 Feedback Card
  card: {
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },

  // 🔥 CTA Button (Modern)
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 18,
    elevation: 3,
  },
  feedbackText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  // 🔥 Version Footer Card
  versionCard: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
});

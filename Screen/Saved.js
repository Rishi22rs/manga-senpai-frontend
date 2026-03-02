import React, {useCallback, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  SafeAreaView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import AnimeCard from '../Components/AnimeCard';
import TopBar from '../Components/TopBar';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import Banner from '../Ads/Banner';
import {getStoredData} from '../Hooks/localStorage';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

const Saved = ({navigation}) => {
  const [savedData, setSavedData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const {colors} = useTheme();

  const loadSaved = async () => {
    try {
      const res = await getStoredData('liked');
      setSavedData(res || []);
    } catch (e) {
      console.log('Saved load error:', e);
      setSavedData([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSaved();
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSaved();
    setRefreshing(false);
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <LinearGradient
        colors={[colors.titleColor.orange, colors.titleColor.orange + 'CC']}
        style={styles.emptyCard}>
        <Text style={[styles.emptyEmoji, {color: colors.epBtn.color}]}>❤️</Text>
        <Text style={[styles.emptyTitle, {color: colors.epBtn.color}]}>
          No Saved Manga
        </Text>
        <Text style={[styles.emptySubtitle, {color: colors.epBtn.color}]}>
          Tap the heart icon on any manga to save it here
        </Text>
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <TopBar title={'Saved'} navigation={navigation} />

      <Banner />

      {/* 🔥 Modern Grid List */}
      <FlatList
        data={savedData}
        numColumns={2}
        keyExtractor={(item, index) =>
          `${item.animeLink || item.title}-${index}`
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          savedData.length === 0 && {flex: 1},
        ]}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.titleColor.orange}
          />
        }
        ListEmptyComponent={renderEmpty}
        renderItem={({item}) => (
          <AnimeCard
            title={item.title}
            banner={item.banner}
            detail={item.detail}
            animeLink={item.animeLink}
            navigation={navigation}
          />
        )}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
};

export default Saved;

const styles = StyleSheet.create({
  container: {
    flex: 1, // 🔥 FIX: prevents TopBar centering bug
  },

  // Grid spacing
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 100, // space for banner/nav
  },
  row: {
    justifyContent: 'space-between',
  },

  // 🔥 Modern Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCard: {
    width: width - 60,
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    elevation: 6,
  },
  emptyEmoji: {
    fontSize: 42,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.95,
  },
});

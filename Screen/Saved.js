import React, {useCallback, useEffect, useState} from 'react';
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
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {mangaListPages} from '../Scraping/mangaListPages';
import Banner from '../Ads/Banner';
import { getStoredData } from '../Hooks/localStorage';

const dimension = Dimensions.get('window');

const Saved = ({route, navigation}) => {
    const [savedData,setSavedData]=useState()
    useFocusEffect(
      useCallback(() =>{
        getStoredData('liked').then(res => {
          setSavedData(res);
        })
      },[]
      ),
    );          
        console.log(savedData)
    
    const {colors} = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors['background']}]}>
      <TopBar title={'Saved'} navigation={navigation} />
      <Banner />
      <View
        style={{
          paddingBottom:90,
          marginLeft: 5,
          height: route.params?.url
            ? dimension.height - 120
            : dimension.height - 80,
        }}>
        {savedData&&savedData.length ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={savedData}
            renderItem={({item}) => (
              <AnimeCard
                title={item.title}
                banner={item.banner}
                detail={item.detail}
                animeLink={item.animeLink}
                navigation={navigation}
              />
            )}
            numColumns={2}
          />
        ):<Text
        style={{
          textAlign: 'center',
          color: colors['titleColor']['orange'],
        }}>
        {`Nothing here`}
      </Text>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: dimension.height,
    alignItems:'center',
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

export default Saved;

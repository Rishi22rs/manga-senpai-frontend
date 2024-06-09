import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import TopBar from '../Components/TopBar';
import {useTheme} from '@react-navigation/native';
import {interstitial} from '../Ads/Interstitial';
import Banner from '../Ads/Banner';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const dimension = Dimensions.get('window');

const AnimeEpisodeList = ({route, navigation}) => {
  const {colors} = useTheme();
  const [episodeList,setEpisodeList]=useState(route.params.episodeList)
  const [switchArrow,setSwitchArrow]=useState(true)

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <TopBar title={route.params.name} navigation={navigation} />
      <Banner />
      <View style={[styles.mainContainer, {height: dimension.height - 120}]}>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            backgroundColor: colors.titleColor.orange,
            margin: 20,
            paddingLeft:15 ,
            paddingVertical: 10,
            borderRadius: 5,
            left:dimension.width/2-45,
            flexDirection:'row'
          }} onPress={()=>{
            setSwitchArrow(prev=>!prev)
            setEpisodeList([...episodeList.reverse()])}}>
          <Text style={{color: colors.background, fontWeight: 'bold'}}>
            Sort
          </Text>
          <Icon
          style={{borderColor: 'white',backgroundColor:colors['titleColor']['orange'],borderRadius:4,marginRight:10}}
          name={switchArrow?"arrow-up":"arrow-down"}
          size={20}
          color={colors.background}
        />
        </TouchableOpacity>
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={episodeList}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => {
                try {
                  interstitial.load();
                  interstitial.show();
                } catch (e) {
                  console.log(e);
                }
                navigation.navigate('Manga', {
                  link: item.link,
                });
              }}
              activeOpacity={0.7}
              style={[
                {
                  backgroundColor: colors.titleColor.orange,
                },
                styles.card,
              ]}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  color: colors.background,
                }}>
                {item.chapterName}
              </Text>
              <Text style={{color: colors.titleColor.grey}}>
                {item.datetime}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: dimension.height,
  },
  mainContainer: {
    alignContent: 'center',
    display: 'flex',
    alignItems: 'center',
  },
  card: {
    padding: 20,
    margin: 3,
    borderRadius: 20,
    width: dimension.width,
  },
  episodeContainer: {
    display: 'flex',
  },
});

export default AnimeEpisodeList;

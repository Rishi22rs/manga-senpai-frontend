import React from 'react';
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
import {ListItem} from 'react-native-elements';
import { interstitial } from '../Ads/Interstitial';
import Banner from '../Ads/Banner';

const dimension = Dimensions.get('window');

const AnimeEpisodeList = ({route, navigation}) => {
  const {colors} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <TopBar title={route.params.name} />
      <Banner/>
      <View style={[styles.mainContainer, {height: dimension.height - 120}]}>
        <FlatList
          data={route.params.episodeList.reverse()}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() =>{
                try{
                interstitial.load()
               interstitial.show()
                }catch(e){
                  console.log(e)
                }
                navigation.navigate('Manga', {
                  link: item.link,
                })
              }
              }
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

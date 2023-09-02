import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import ActivityLoader from '../Components/ActivityLoader';
import TopBar from '../Components/TopBar';
import {mangaChapter} from '../Scraping/mangaChapter';
import {Icon} from 'react-native-elements';

const dimensions = Dimensions.get('screen');

const Manga = ({route, navigation}) => {
  const [imgBase64, setImgBase64] = useState();
  const [loadedCount, setLoadedCount] = useState(0);
  const {colors} = useTheme();

  useEffect(() => {
    mangaChapter(setImgBase64, setLoadedCount, route.params.link);
  }, []);

  return (
    <View>
      {imgBase64 ? (
        <>
          <TouchableOpacity
            activeOpacity={1}
            style={{zIndex: 99}}
            onPress={() => navigation.goBack()}>
            <Icon
              raised={colors.carouselCardText.title === 'white' ? true : false}
              reverse={colors.carouselCardText.title === 'white' ? false : true}
              name="arrow-back"
              type="material"
              color={'black'}
            />
          </TouchableOpacity>
          <FlatList
            snapToAlignment="start"
            decelerationRate={'fast'}
            snapToInterval={dimensions.height}
            style={{width: dimensions.width, height: '100%'}}
            data={imgBase64}
            renderItem={({item}) => (
              <View
                style={{
                  display: 'flex',
                  backgroundColor: 'white',
                }}>
                <View>
                  <Image
                    resizeMode="contain"
                    source={{
                      uri: item,
                    }}
                    style={{
                      width: dimensions.width,
                      height: dimensions.height,
                    }}
                  />
                </View>
              </View>
            )}
            keyExtractor={item => item}
          />
        </>
      ) : (
        <>
          <TopBar />
          <View
            style={{
              backgroundColor: colors.background,
              height: dimensions.height,
            }}>
            <ActivityLoader title={`Loading \n ${Math.ceil(loadedCount)}%`} />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default Manga;

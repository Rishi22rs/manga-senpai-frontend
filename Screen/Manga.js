import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image, FlatList, Dimensions, Text} from 'react-native';
import ActivityLoader from '../Components/ActivityLoader';
import TopBar from '../Components/TopBar';
import {mangaChapter} from '../Scraping/mangaChapter';

const dimensions = Dimensions.get('screen');

const Manga = ({route}) => {
  const [imgBase64, setImgBase64] = useState();
  const [loadedCount,setLoadedCount]=useState(0)
  const {colors} = useTheme();

  useEffect(() => {
    mangaChapter(setImgBase64,setLoadedCount ,route.params.link);
  }, []);

  return (
    <View>
      {imgBase64 ? (
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
      ) : (
        <>
          <TopBar />
          <View
            style={{
              backgroundColor: colors.background,
              height: dimensions.height,
            }}>
            <ActivityLoader title={`Loading \n ${Math.ceil(loadedCount)}%`}/>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default Manga;

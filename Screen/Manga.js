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
    mangaChapter(route.params.link).then(res => {
      setImgBase64(res);
      res.forEach(url => Image.prefetch(url));
    });
  }, []);

  const RenderMangaImage = ({item}) => {
    const [loading, setLoading] = useState(true);

    return (
      <View style={{backgroundColor: 'white'}}>
        {loading && (
          <View
            style={{
              position: 'absolute',
              width: dimensions.width,
              height: dimensions.height,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
            }}>
            <ActivityLoader title="Loading image..." />
          </View>
        )}

        <Image
          resizeMode="contain"
          source={{uri: item}}
          style={{
            width: dimensions.width,
            height: dimensions.height,
          }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      </View>
    );
  };

  return (
    <View>
      {imgBase64 ? (
        <>
          <TopBar showNavigation={true} navigation={navigation} />
          <FlatList
            data={imgBase64}
            renderItem={({item}) => <RenderMangaImage item={item} />}
            keyExtractor={(item, index) => index.toString()}
          />
        </>
      ) : (
        <>
          <TopBar navigation={navigation} />
          <View
            style={{
              backgroundColor: colors.background,
              height: dimensions.height,
            }}>
            <ActivityLoader title={`Loading`} />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default Manga;

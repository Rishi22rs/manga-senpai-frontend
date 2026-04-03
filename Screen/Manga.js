import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState, memo} from 'react';
import {StyleSheet, View, Dimensions, FlatList, Image} from 'react-native';
import ActivityLoader from '../Components/ActivityLoader';
import TopBar from '../Components/TopBar';
import {mangaChapter} from '../Scraping/mangaChapter';
// import FastImage from 'react-native-fast-image';

const dimensions = Dimensions.get('screen');

const Manga = ({route, navigation}) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const {colors} = useTheme();

  useEffect(() => {
    const loadChapter = async () => {
      try {
        const res = await mangaChapter(route.params.link);

        if (res && res.length > 0) {
          setImages(res);

          // 🔥 Normal preloading
          await Promise.all(res.map(url => Image.prefetch(url)));
        }
      } catch (err) {
        console.log('Chapter load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChapter();
  }, [route.params.link]);

  const RenderMangaImage = memo(({item}) => {
    const [progress, setProgress] = useState(0);
    const [imgLoading, setImgLoading] = useState(true);

    if (!item) return null;

    const percentage = Math.floor(progress * 100);

    return (
      <View style={styles.imageContainer}>
        {imgLoading && (
          <View style={styles.loaderContainer}>
            <ActivityLoader title={`Loading ${percentage}%`} />
          </View>
        )}

        <Image
          style={styles.image}
          // resizeMode={FastImage.resizeMode.contain}
          resizeMode="contain"
          source={{
            uri: item,
            // priority: FastImage.priority.high,
            // cache: FastImage.cacheControl.immutable,
            // headers: {
            //   Referer: 'https://mangakatana.com/',
            //   'User-Agent': 'Mozilla/5.0',
            // },
          }}
          onLoadStart={() => {
            setImgLoading(true);
            setProgress(0);
          }}
          onProgress={e => {
            if (e.nativeEvent.total > 0) {
              const p = e.nativeEvent.loaded / e.nativeEvent.total;
              setProgress(p);
            }
          }}
          onLoadEnd={() => {
            setImgLoading(false);
            setProgress(1);
          }}
        />
      </View>
    );
  });

  if (loading) {
    return (
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        <TopBar showNavigation={true} navigation={navigation} />
        <View style={styles.loaderWrapper}>
          <ActivityLoader title="Loading Chapter..." />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar showNavigation={true} navigation={navigation} />

      <FlatList
        data={images}
        renderItem={({item}) => <RenderMangaImage item={item} />}
        keyExtractor={(item, index) => index.toString()}
        initialNumToRender={2} // 🚀 performance boost
        maxToRenderPerBatch={2} // prevents lag on long chapters
        windowSize={3} // keeps memory low
        removeClippedSubviews={true} // huge performance gain
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default Manga;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loaderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    width: dimensions.width,
    minHeight: dimensions.height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  image: {
    width: dimensions.width,
    height: dimensions.height,
  },
  loaderContainer: {
    position: 'absolute',
    width: dimensions.width,
    height: dimensions.height,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

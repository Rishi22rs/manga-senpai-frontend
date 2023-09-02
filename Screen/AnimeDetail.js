import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Button,
} from 'react-native';
import ActivityLoader from '../Components/ActivityLoader';
import TopBar from '../Components/TopBar';
import {Icon} from 'react-native-elements';
import {setData} from '../Hooks/localStorage';
import {genrePage} from '../Scraping/genrePage';
import {mangaDetail} from '../Scraping/mangaDetail';

const dimension = Dimensions.get('window');

const AnimeDetail = ({route, navigation}) => {
  const {colors} = useTheme();

  const [mangaDetailData, setMangaDetailData] = useState();

  useEffect(() => {
    mangaDetail(route.params.animeLink).then(res => {
      setMangaDetailData(res);
    });
  }, []);

  return (
    <View>
      {mangaDetailData ? (
        <>
          <ImageBackground
            source={{uri: mangaDetailData.banner}}
            style={styles.banner}>
            <TouchableOpacity
              activeOpacity={1}
              style={{zIndex: 99}}
              onPress={() => navigation.goBack()}>
              <Icon
                raised={
                  colors.carouselCardText.title === 'white' ? true : false
                }
                reverse={
                  colors.carouselCardText.title === 'white' ? false : true
                }
                name="arrow-back"
                type="material"
                color={'black'}
              />
            </TouchableOpacity>
          </ImageBackground>
          <ScrollView style={styles.container} nestedScrollEnabled={true}>
            <View style={{height: 380}}></View>

            <View style={[styles.detail, {backgroundColor: colors.background}]}>
              <Text style={[styles.title, {color: colors.animeCard['title']}]}>
                {mangaDetailData.title}
              </Text>
              <Text
                style={[styles.subTitle, {color: colors.animeCard['title']}]}>
                {mangaDetailData['Status'].trim()}
              </Text>
              <View>
                {mangaDetailData.hasOwnProperty('Alternative') &&
                  mangaDetailData['Alternative'].split(';').map((x, key) => (
                    <Text
                      key={key}
                      style={{
                        marginBottom: 15,
                        textAlign: 'center',
                        color: colors.animeCard['title'],
                      }}>
                      {'● '}
                      {x.trim()}
                    </Text>
                  ))}
              </View>
              <View style={styles.genreContainer}>
                {mangaDetailData['Genres'].split('-').map((x, key) => (
                  <View
                    key={key}
                    // onPress={() =>
                    //   navigation.navigate('GenreAnimeList', {genre: x.trim()})
                    // }
                  >
                    <Text
                      style={[
                        styles.genre,
                        {
                          backgroundColor: colors.genreBackgroundInDetail,
                          color: colors.genreTextColor,
                        },
                      ]}
                      key={key}>
                      {x.trim()}
                    </Text>
                  </View>
                ))}
              </View>
              <ScrollView nestedScrollEnabled={true}>
                <Text
                  style={[
                    styles.summaryText,
                    {color: colors.animedetail.detail},
                  ]}>
                  {mangaDetailData['summary'].trim()}
                </Text>

                <Button
                  color={colors.titleColor.orange}
                  title="Start Reading"
                  onPress={() =>
                    navigation.navigate('AnimeEpisodeList', {
                      episodeList: mangaDetailData.chapters,
                      name: mangaDetailData.title,
                    })
                  }
                />
              </ScrollView>
            </View>
          </ScrollView>
        </>
      ) : (
        <>
          <TopBar />
          <View
            style={{
              backgroundColor: colors.background,
              height: dimension.height,
            }}>
            <ActivityLoader />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    height: 400,
    width: dimension.width,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  detail: {
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
    height: dimension.height,
  },
  epContainer: {
    height: 80,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 15,
    marginBottom: 10,
  },
  genreContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 3,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  genre: {
    padding: 5,
    borderRadius: 15,
    margin: 3,
  },
  epBtn: {
    margin: 10,
    padding: 10,
    paddingRight: 15,
    paddingLeft: 15,
    borderRadius: 15,
    height: 38,
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
  },
  seeAll: {
    textAlign: 'right',
    marginTop: -17,
  },
});

export default AnimeDetail;

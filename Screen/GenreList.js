import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Banner from '../Ads/Banner';
import ActivityLoader from '../Components/ActivityLoader';
import TopBar from '../Components/TopBar';
import {genrePage} from '../Scraping/genrePage';

const dimension = Dimensions.get('window');

// const colorList = [
//   '#15C0E8',
//   '#07558A',
//   '#64174D',
//   '#64174D',
//   '#16B483',
//   '#19BDBA',
//   '#104F55',
//   '#1F255E',
//   '#70C8BC',
//   '#E1B6B4',
//   '#B99031',
//   '#B99031',
//   '#F6D0A4',
//   '#CF57A2',
//   '#F89122',
//   '#FFC426',
//   '#92524A',
//   '#FFFE0B',
//   'blue',
//   '#C58230',
//   '#AD705C',
//   '#7B2418',
//   '#B50AFC',
//   '#3A381D',
//   '#791718',
//   '#FEDD02',
//   '#F7BBA6',
//   '#CE2027',
//   '#EC2B28',
//   '#66339B',
//   '#403E2A',
//   '#AF1F58',
//   '#50002F',
//   '#FF6700',
//   '#FC027D',
//   '#81419B',
//   '#A09EA6',
//   '#D5B04D',
//   '#115CAE',
//   '#175F0C',
//   '#EC2B28',
//   '#000000',
//   '#460D55',
//   '#EC2B28',
//   '#7C2E86',
// ];

const GenreContainer = ({data, navigation, colors, index}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.genreStyleContainer,
        {backgroundColor: colors.titleColor.orange},
      ]}
      onPress={() =>
        navigation.navigate('SeeAll', {
          data: '',
          episodeLink: false,
          url: data.link,
          title:data.genre
        })
      }>
      <Text style={[styles.genreStyle, {color: colors.carouselCardText.title}]}>
        {data.genre}
      </Text>
    </TouchableOpacity>
  );
};

const GenreList = ({navigation}) => {
  const [genreList, setGenreList] = useState();

  useEffect(() => {
    genrePage().then(res => {
      setGenreList(res);
    });
  }, []);

  const {colors} = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <TopBar title="Genre List" navigation={navigation} showNavigation={false}/>
      <Banner/>
      <View style={[styles.mainContainer, {height: dimension.height - 153}]}>
        {genreList ? (
          <FlatList
          showsVerticalScrollIndicator={false}
  showsHorizontalScrollIndicator={false}
            data={genreList}
            renderItem={({item, index}) => (
              <GenreContainer
                data={item}
                index={index}
                navigation={navigation}
                colors={colors}
              />
            )}
            keyExtractor={(item, index) => index}
            numColumns={2}
          />
        ):<ActivityLoader/>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: dimension.height,
  },
  mainContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    display: 'flex',
    alignItems: 'center',
  },
  genreStyle: {
    padding: 20,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
  },
  genreStyleContainer: {
    width: dimension.width / 2.3,
    marginBottom: 15,
    borderRadius: 15,
    marginRight: 10,
    marginLeft: 10,
  },
});

export default GenreList;

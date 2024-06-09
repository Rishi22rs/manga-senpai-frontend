import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getStoredData, isDataPresent, storeData } from '../Hooks/localStorage';

const dimension = Dimensions.get('window');

const AnimeCard = ({
  title,
  banner,
  detail,
  animeLink,
  navigation,
  episodeLink,
}) => {
  const {colors} = useTheme();
  const [liked,setLiked]=useState()
  useEffect(()=>{
    isDataPresent("liked",{title, banner, detail, animeLink}).then(res=>setLiked(res))
  })

  return (
    <>
    {liked!==undefined&&<TouchableOpacity
      activeOpacity={0.5}
      style={styles.container}
      onPress={() =>{
       navigation.navigate('AnimeDetail', {animeLink})
      }
      }>
      <View
        style={{
          borderColor: 'black',
          borderRadius: 15,
          overflow: 'hidden',
        }}>
        <ImageBackground source={{uri: banner}} style={styles.cardImg}>
          <Icon
            onPress={async() => {
              let isPresent=await isDataPresent("liked",{title, banner, detail, animeLink})
              !isPresent?storeData('liked', {title, banner, detail, animeLink}).then(res=>{
                setLiked(true)
              }):storeData('liked', {title, banner, detail, animeLink}).then(res=>{
                setLiked(false)
              })
            }}
            name="cards-heart"
            size={30}
            color={liked?colors.titleColor.orange:colors.background}
          />
        </ImageBackground>
      </View>
      <Text
        numberOfLines={2}
        style={[styles.animeTitle, {color: colors['animeCard']['title']}]}>
        {title}
      </Text>
      <Text style={[styles.subText, {color: colors['animeCard']['subText']}]}>
        {detail}
      </Text>
    </TouchableOpacity>}</>
  );
};

const styles = StyleSheet.create({
  animeTitle: {
    fontSize: 18,
    fontWeight: '700',
    width: dimension.width / 2.5,
    marginTop: 5,
  },
  container: {
    padding: 0,
    marginHorizontal: 10,
    marginTop: 10,
    alignItems:'center',
  },
  cardImg: {
    height: 200,
    width: dimension.width / 2.5,
    alignItems:"flex-end",
    padding:5
  },
  heading: {
    marginBottom: 10,
  },
  subText: {
    fontWeight: '600',
    marginLeft: 2,
    width: dimension.width / 2.5,
  },
});

export default AnimeCard;

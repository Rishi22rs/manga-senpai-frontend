import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  getData,
  selectedTheme,
  storeData,
  ThemePalette,
} from '../Theme/ThemePalette';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {EventRegister} from 'react-native-event-listeners';
import {useTheme} from '@react-navigation/native';

const dimension = Dimensions.get('window');

const TopBar = ({title = 'Manga Senpai',navigation,showNavigation=true}) => {
  const [isDark, setIsDark] = useState(true);
  const {colors} = useTheme();

  let title1 = title.split(' ')[0];
  let title2 = title.slice(title1.length+1);

  useEffect(() => {
    getData().then(res => {
      res == 'true' ? setIsDark(false) : setIsDark(true);
    });
  }, []);

  return (
    <View style={[styles.myStatusbar, {backgroundColor: colors.background}]}>
      <View style={styles.backButtonContainer}>
      {showNavigation&&<TouchableOpacity
        activeOpacity={1}
        style={{zIndex: 99}}
        onPress={() => navigation.goBack()}>
        <Icon
          style={{borderColor: 'white',backgroundColor:colors['titleColor']['orange'],borderRadius:4,marginRight:10}}
          name="arrow-left-thin"
          size={25}
          color={colors.background}
        />
      </TouchableOpacity>}
      <View style={styles.titleContainer}>
        <>
          <Text
            style={[{color: colors['titleColor']['orange']}, styles.title]}>
            {title1}
          </Text>
          <Text style={[{color: colors['titleColor']['grey']}, styles.title]}>
            {title2}
          </Text>
        </>
      </View>
      </View>
      <TouchableOpacity
        onPress={async () => {
          setIsDark(val => !val);
          console.log(isDark);
          isDark ? storeData('true') : storeData('false');
          EventRegister.emit('changeThemeEvent', isDark);
        }}>
        <Icon
          style={{borderColor: 'white'}}
          name="theme-light-dark"
          size={25}
          color={colors['titleColor']['orange']}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  myStatusbar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: dimension.width,
    padding: 15,
    paddingRight: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  backButtonContainer:{
    flexDirection:'row',
    alignItems:'center'
  }
});

export default TopBar;

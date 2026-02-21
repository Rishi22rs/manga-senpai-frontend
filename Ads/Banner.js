import {useState} from 'react';
import {View} from 'react-native';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const Banner = () => {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return (
      <BannerAd
        unitId={
          __DEV__ ? TestIds.BANNER : 'ca-app-pub-1899986561877164/3362381036'
        }
        size={BannerAdSize.BANNER}
        onAdLoaded={() => setLoaded(true)}
        onAdFailedToLoad={() => {}}
      />
    );
  }

  return (
    <View style={{alignItems: 'center', marginVertical: 10}}>
      <BannerAd
        unitId={
          __DEV__ ? TestIds.BANNER : 'ca-app-pub-1899986561877164/3362381036'
        }
        size={BannerAdSize.BANNER}
      />
    </View>
  );
};

export default Banner;

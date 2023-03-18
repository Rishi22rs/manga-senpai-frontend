import { View } from "react-native"
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads"

const Banner=()=>{
return(
    <View style={{display:"flex",alignItems:'center',marginBottom:10}}>
            <BannerAd size={BannerAdSize.BANNER} unitId="ca-app-pub-1899986561877164/6006942551"/>
            </View>
)
}

export default Banner
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setData=async(value)=>{
  try {
    getData("continue").then(async(res)=>{
      if(!res.includes(JSON.stringify(value))){
        return await AsyncStorage.setItem("continue", `${res}|${JSON.stringify(value)}`)
      }
    })
    // return await AsyncStorage.setItem("continue", `!${JSON.stringify(value)}`)
  } catch (e) {
      console.log(e)
  }
}

export const getData=async()=>{
  try {
    const jsonData = await AsyncStorage.getItem("continue")
    return jsonData
    const splitData=jsonData.split("|")
    // return splitData
    // const finalData=splitData.map(x=>JSON.parse(x))
    // return finalData
  } catch(e) {
    console.log(e)
  }
}

export const removeData=async()=>{
  try {
    await AsyncStorage.removeItem("continue");
    return true;
  }
  catch(e) {
      return false;
  }
}
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

export const storeData = async (key, newData) => {
  try {
    // Retrieve existing data from AsyncStorage
    const existingData = await AsyncStorage.getItem(key);
    let dataList = [];

    if (existingData !== null) {
      // Parse existing data into an array
      dataList = JSON.parse(existingData);
    }

    isDataPresent(key,newData).then(async res=>{
      if(res){
        const idx = dataList.some((obj,index) => {
          if(JSON.stringify(obj) === JSON.stringify(newData)){
            return index
          }
        });
        dataList.splice(idx, 1);
      
      }else{
        // Append new data to the array
        dataList.push(newData);
        // Store the updated array in AsyncStorage
   
      }
      await AsyncStorage.setItem(key, JSON.stringify(dataList));
    })
  } catch (error) {
    console.log('Error storing data:', error);
  }
};

// Function to retrieve all data from AsyncStorage
export const getStoredData = async (key) => {
  try {
    // Retrieve data from AsyncStorage
    const data = await AsyncStorage.getItem(key);

    if (data !== null) {
      // Parse data into an array of objects
      const dataList = JSON.parse(data);
 
      return dataList;
    } else {
      console.log('No data found');
      return [];
    }
  } catch (error) {
    console.log('Error retrieving data:', error);
    return [];
  }
};

export const isDataPresent = async (key, targetObject) => {
  try {
    // Retrieve data from AsyncStorage
    const data = await AsyncStorage.getItem(key);

    if (data !== null) {
      // Parse data into an array of objects
      const dataList = JSON.parse(data);

      // Check if the target object is present in the array
      const isPresent = dataList.some((obj) => {
        return JSON.stringify(obj) === JSON.stringify(targetObject);
      });
      return isPresent;
    } else {
      return false;
    }
  } catch (error) {
    console.log('Error retrieving data:', error);
    return false;
  }
};


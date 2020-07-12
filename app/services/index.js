import AsyncStorage from '@react-native-community/async-storage';

export const callPostApi = async (data, url) => {
  const baseUrl = 'http://13.233.160.133:8080/api/';
  const fullUrl = baseUrl + url;
  try {
    let response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    var logindetail = await response.json();
    return logindetail;
  } catch (errors) {
    return errors;
  }
};
export const callGetApi = async url => {
  const baseUrl = 'http://13.233.160.133:8080/api/';
  const fullUrl = baseUrl + url;
  const authToken = await AsyncStorage.getItem('token');
  try {
    let response = await fetch(fullUrl, {
      method: 'GET',
      timeout: 5000,
      headers: {
        Authorization: `Token ${authToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    var logindetail = await response.json();
    return logindetail;
  } catch (errors) {
    return errors;
  }
};
export const callPatchApi = async (url, data) => {
  const baseUrl = 'http://13.233.160.133:8080/api/';
  const fullUrl = baseUrl + url;
  const authToken = await AsyncStorage.getItem('token');
  try {
    let response = await fetch(fullUrl, {
      method: 'PATCH',
      headers: {
        Authorization: `Token ${authToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    var logindetail = await response.json();
    return logindetail;
  } catch (errors) {
    return errors;
  }
};

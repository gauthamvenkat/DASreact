import React, {useState, useEffect, useCallback} from 'react';

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  TextInput,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import {getwh, getww} from '../utils/layout';

import {callGetApi} from '../services/index';

import Icon from 'react-native-vector-icons/AntDesign';

import {useColorScheme} from 'react-native-appearance';

import {useRoute} from '@react-navigation/native';

var colors = [
  '#8F1D21',
  '#9D2933',
  '#5B3256',
  '#5D3F6A',
  '#1F4788',
  '#16A085',
  '#006442',
  '#264348',
  '#E08A1E',
  '#CA6924',
];

function mainscreen({navigation}) {
  const [studentdet, setStudentDet] = useState('');
  const [coursedet, setCourseDet] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [storeCoursedet, setStoreCourseDet] = useState([]);
  const [searchview, setSearchView] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    var username = AsyncStorage.getItem('username');
    username.then(function(result) {
      var url = `students/${result}`;
      var studentdetails = callGetApi(url);
      studentdetails.then(function(resultA) {
        AsyncStorage.setItem('studentdetails', JSON.stringify(resultA));
        setStudentDet(resultA);
        AsyncStorage.setItem('coursedetails', JSON.stringify(resultA.courses));
        var courseInfo = AsyncStorage.getItem('coursedetails');
        courseInfo.then(function(resultB) {
          var courseDetails = JSON.parse(resultB);
          var i = '';
          var courseArray = [];
          for (i = 0; i < courseDetails.length; i++) {
            courseArray[i] = courseDetails[i];
          }
          setCourseDet(courseArray);
          setStoreCourseDet(courseArray);
        });
      });
    });
  }, []);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    var username = AsyncStorage.getItem('username');
    username.then(function(result) {
      var url = `students/${result}`;
      var studentdetails = callGetApi(url);
      studentdetails.then(function(resultA) {
        AsyncStorage.setItem('studentdetails', JSON.stringify(resultA));
        setStudentDet(resultA);
        var courseDetails = resultA.courses;
        var i = '';
        var courseArray = [];
        for (i = 0; i < courseDetails.length; i++) {
          courseArray[i] = courseDetails[i];
        }
        setCourseDet(courseArray);
        setStoreCourseDet(courseArray);
        setRefreshing(false);
      });
    });
  }, [refreshing]);

  const SearchFilterFunction = text => {
    const newData = coursedet.filter(function(data) {
      const itemData = data.name ? data.name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    if (text === '') {
      setCourseDet(storeCoursedet);
    } else {
      setCourseDet(newData);
      setSearchText(text);
    }
  };

  const searchClose = () => {
    setSearchView(false);
    setCourseDet(storeCoursedet);
  };

  const listItems = coursedet.map((data, index) => (
    <View
      key={data.courseID}
      style={[styles.list, {backgroundColor: colors[index % colors.length]}]}>
      <TouchableOpacity
        style={styles.coursebutton}
        onPress={async () => {
          await AsyncStorage.setItem(
            'requiredcourseinfo',
            JSON.stringify(data),
          );
          navigation.push('PostAttendance');
        }}>
        <Text style={styles.coursename} numberOfLines={1}>
          {data.name}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.viewdetails}
        onPress={async () => {
          await AsyncStorage.setItem(
            'requiredcourseinfo',
            JSON.stringify(data),
          );
          navigation.push('ViewDetails');
        }}>
        <Icon name="infocirlceo" size={25} style={styles.icon} />
      </TouchableOpacity>
    </View>
  ));
  return (
    <View style={styles.mainview}>
      {studentdet.name === undefined ? (
        <ActivityIndicator
          size="large"
          color="#007aff"
          style={styles.activity}
        />
      ) : (
        <View style={styles.safe}>
          <SafeAreaView>
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }>
              {searchview ? (
                <View style={styles.searchbar}>
                  <TextInput
                    style={
                      colorScheme === 'dark'
                        ? styles.darksearchinput
                        : styles.searchinput
                    }
                    onChangeText={text => SearchFilterFunction(text)}
                    placeholderTextColor={
                      colorScheme === 'dark' ? '#FFFFFF' : '#000000'
                    }
                    defaultValue={searchText}
                    placeholder="Search Here"
                  />
                  <Icon
                    name="closecircle"
                    size={30}
                    style={styles.icon1}
                    onPress={() => {
                      searchClose();
                    }}
                  />
                </View>
              ) : (
                <View style={styles.titleview}>
                  <Text
                    style={
                      colorScheme === 'dark' ? styles.darktitle : styles.title
                    }
                    numberOfLines={1}>{`Welcome ${studentdet.name}`}</Text>
                </View>
              )}
              <View
                style={searchview ? styles.listviewsearch : styles.listview}>
                {listItems}
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.TouchableOpacityStyle}
                onPress={() => navigation.push('AddCourse')}>
                <Icon name="plus" size={35} style={styles.icon} />
              </TouchableOpacity>
              {searchview ? null : (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.TouchableOpacitySearchStyle}
                  onPress={() => setSearchView(true)}>
                  <Icon name="search1" size={35} style={styles.icon} />
                </TouchableOpacity>
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  activity: {
    paddingTop: getwh('45'),
    position: 'relative',
  },
  mainview: {
    marginBottom: getwh(3),
  },
  TouchableOpacityStyle: {
    top: getwh(2),
    position: 'absolute',
    width: getww(10),
    height: getwh(10),
    alignItems: 'center',
    justifyContent: 'center',
    right: getww(6),
    bottom: getwh(2),
  },
  searchbar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  TouchableOpacitySearchStyle: {
    top: getwh(2),
    position: 'absolute',
    width: getww(10),
    height: getwh(10),
    alignItems: 'center',
    justifyContent: 'center',
    right: getww(18),
    bottom: getwh(2),
  },
  coursebutton: {
    width: getww(80),
    height: getwh(6),
    justifyContent: 'center',
  },
  addcoursetext: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: getww(3),
    marginRight: getww(3),
    height: getwh(8),
    marginTop: getwh(0.5),
    borderRadius: 10,
  },
  listview: {
    marginTop: getwh(3),
  },
  listviewsearch: {
    marginTop: getwh(1),
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  darktitle: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#FFFFFF',
  },
  titleview: {
    marginTop: getwh(5),
    marginLeft: getww(3),
    marginBottom: getwh(2),
    width: getww(70),
    height: getwh(2),
  },
  viewdetails: {
    position: 'absolute',
    marginLeft: getww(83),
  },
  coursename: {
    fontSize: 16.5,
    fontWeight: 'bold',
    marginLeft: getww(2),
    color: '#FFFFFF',
  },
  icon: {
    color: '#007aff',
  },
  icon1: {
    color: '#007aff',
    marginTop: getwh(3),
  },
  searchinput: {
    borderWidth: 2,
    width: getww(75),
    paddingLeft: getww(4),
    fontSize: 15,
    marginTop: getwh(3),
    marginLeft: getww(5),
    borderRadius: 10,
    borderColor: '#007aff',
    marginRight: getww(5),
    alignItems: 'center',
    color: '#000000',
  },
  darksearchinput: {
    borderWidth: 2,
    width: getww(65),
    paddingLeft: getww(4),
    fontSize: 15,
    marginTop: getwh(4.5),
    marginLeft: getww(5),
    borderRadius: 10,
    borderColor: '#007aff',
    marginRight: getww(5),
    alignItems: 'center',
    color: '#FFFFFF',
  },
});
export default mainscreen;

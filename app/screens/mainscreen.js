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
  const colorScheme = useColorScheme();
  const route = useRoute();

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
        setRefreshing(false);
      });
    });
  }, [refreshing]);
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
              <View style={styles.titleview}>
                <Text
                  style={
                    colorScheme === 'dark' ? styles.darktitle : styles.title
                  }>{`Welcome ${studentdet.name}`}</Text>
              </View>
              <View style={styles.listview}>{listItems}</View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.TouchableOpacityStyle}
                onPress={() => navigation.push('AddCourse')}>
                <Icon name="pluscircle" size={35} style={styles.icon} />
              </TouchableOpacity>
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
    marginBottom: getwh(2),
  },
  TouchableOpacityStyle: {
    top: getwh(2),
    position: 'absolute',
    width: getww(10),
    height: getwh(10),
    alignItems: 'center',
    justifyContent: 'center',
    right: getww(5),
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
    marginTop: getwh(5),
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
    width: getww(80),
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
});
export default mainscreen;

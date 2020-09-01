import React, {useState, useEffect, useCallback} from 'react';

import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import {getwh, getww} from '../utils/layout';

import {callGetApi} from '../services/index';

import NetInfo from '@react-native-community/netinfo';

import {useColorScheme} from 'react-native-appearance';

function detailedattendanceview({navigation}) {
  const [courseId, setCourseID] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [attendanceDet, setAttendanceDetails] = useState([]);
  const [totalClassesAttended, setTotalClassesAttended] = useState(0);
  const [totalClassesTaken, setTotalClassesTaken] = useState(0);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const colorScheme = useColorScheme();

  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var username = AsyncStorage.getItem('username');
        username.then(function(result) {
          var courseInfo = AsyncStorage.getItem('requiredcourseinfo');
          courseInfo.then(function(resultA) {
            var courseDetails = JSON.parse(resultA);
            var teacherDetails = courseDetails.teacher;
            setCourseID(courseDetails.courseID);
            setCourseName(courseDetails.name);
            var url = `attendance/student/${result}/${courseDetails.courseID}/${
              courseDetails.slot
            }/${teacherDetails.username}`;
            var attendanceAPI = callGetApi(url);
            attendanceAPI.then(function(resultB) {
              setAttendanceDetails(resultB);
            });
          });
        });
      } else {
        var username = AsyncStorage.getItem('username');
        username.then(function(result) {
          var courseInfo = AsyncStorage.getItem('requiredcourseinfo');
          courseInfo.then(function(resultA) {
            var courseDetails = JSON.parse(resultA);
            setCourseID(courseDetails.courseID);
            setCourseName(courseDetails.name);
          });
        });
        Alert.alert(
          'Error',
          'Cannot get response from the server',
          [{text: 'OK', onPress: () => {}}],
          {cancelable: false},
        );
      }
    });
  }, []);
  const onRefresh = useCallback(() => {
    NetInfo.fetch().then(state => {
      if (state.isConnected === true) {
        var username = AsyncStorage.getItem('username');
        username.then(function(result) {
          var courseInfo = AsyncStorage.getItem('requiredcourseinfo');
          courseInfo.then(function(resultA) {
            var courseDetails = JSON.parse(resultA);
            var teacherDetails = courseDetails.teacher;
            setCourseID(courseDetails.courseID);
            setCourseName(courseDetails.name);
            var url = `attendance/student/${result}/${courseDetails.courseID}/${
              courseDetails.slot
            }/${teacherDetails.username}`;
            var attendanceAPI = callGetApi(url);
            attendanceAPI.then(function(resultB) {
              setAttendanceDetails(resultB);
            });
          });
        });
      } else {
        var username = AsyncStorage.getItem('username');
        username.then(function(result) {
          var courseInfo = AsyncStorage.getItem('requiredcourseinfo');
          courseInfo.then(function(resultA) {
            var courseDetails = JSON.parse(resultA);
            setCourseID(courseDetails.courseID);
            setCourseName(courseDetails.name);
          });
        });
        Alert.alert(
          'Error',
          'Cannot get response from the server',
          [{text: 'OK', onPress: () => {}}],
          {cancelable: false},
        );
      }
    });
  }, [refreshing]);
  const listItems = attendanceDet.map((data, index) => (
    <View
      key={data.date}
      style={[
        styles.list,
        {backgroundColor: data.is_present ? '#90ee90' : '#ffcccb'},
      ]}>
      <View style={styles.datelisttitle}>
        <Text style={styles.date} numberOfLines={1}>
          {data.date}
        </Text>
      </View>
      <View style={styles.attendancestatuslisttitle}>
        <Text style={styles.attendancestatus} numberOfLines={1}>
          {data.is_present ? 'Present' : 'Absent'}
        </Text>
      </View>
    </View>
  ));
  return (
    <View style={styles.mainview}>
      <SafeAreaView>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.listtitle}>
            <View style={styles.datelisttitle}>
              <Text
                style={
                  colorScheme === 'dark'
                    ? styles.darkdatetitle
                    : styles.datetitle
                }
                numberOfLines={1}>
                Date
              </Text>
            </View>
            <View style={styles.attendancestatuslisttitle}>
              <Text
                style={
                  colorScheme === 'dark'
                    ? styles.darkattendancestatustitle
                    : styles.attendancestatustitle
                }
                numberOfLines={1}>
                Attendance Status
              </Text>
            </View>
          </View>
          {listItems}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  mainview: {
    marginBottom: getwh(3),
  },
  listtitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: getwh(2),
    width: getww(100),
  },
  attendancestatuslisttitle: {
    justifyContent: 'center',
    width: getww(50),
    marginRight: getww(3),
    height: getwh(8),
    marginTop: getwh(0.5),
    borderRadius: 10,
  },
  datelisttitle: {
    justifyContent: 'center',
    marginLeft: getww(3),
    width: getww(50),
    height: getwh(8),
    marginTop: getwh(0.5),
    borderRadius: 10,
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: getww(1),
    marginRight: getww(1),
    height: getwh(8),
    marginTop: getwh(0.5),
    borderRadius: 10,
  },
  date: {
    fontSize: 16.5,
    fontWeight: 'bold',
    marginLeft: getww(0),
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  attendancestatus: {
    fontSize: 16.5,
    fontWeight: 'bold',
    marginLeft: getww(10),
    color: '#FFFFFF',
  },
  darkdatetitle: {
    fontSize: 16.5,
    fontWeight: 'bold',
    marginLeft: getww(0),
    marginRight: getww(5),
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  datetitle: {
    fontSize: 16.5,
    fontWeight: 'bold',
    marginLeft: getww(0),
    marginRight: getww(5),
    justifyContent: 'center',
    textAlign: 'center',
    color: '#000000',
  },
  attendancestatustitle: {
    fontSize: 16.5,
    fontWeight: 'bold',
    marginLeft: getww(0),
    color: '#000000',
  },
  darkattendancestatustitle: {
    fontSize: 16.5,
    fontWeight: 'bold',
    marginLeft: getww(0),
    color: '#FFFFFF',
  },
});
export default detailedattendanceview;

import React, {useState, useEffect, useCallback} from 'react';

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import {getwh, getww} from '../utils/layout';

import {callGetApi} from '../services/index';

import Icon from 'react-native-vector-icons/AntDesign';

import {Svg, Circle, Text as SVGText} from 'react-native-svg';

import Info from 'react-native-vector-icons/MaterialCommunityIcons';

import {useColorScheme} from 'react-native-appearance';

import NetInfo from '@react-native-community/netinfo';

function viewdetails({navigation}) {
  const [courseId, setCourseID] = useState('');
  const [courseName, setCourseName] = useState('');
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
            }/${teacherDetails.username}/percentage`;
            var attendanceAPI = callGetApi(url);
            attendanceAPI.then(function(resultB) {
              if (resultB.error === 'No attendance objects found.') {
                setTotalAttendance(0);
                setTotalClassesAttended(0);
                setTotalClassesTaken(0);
              } else {
                setTotalAttendance(resultB.attendanceInfo.percentage);
                setTotalClassesTaken(resultB.attendanceInfo.total);
                setTotalClassesAttended(resultB.attendanceInfo.present);
              }
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

  const add = () => {
    if (totalClassesAttended && totalClassesTaken !== undefined) {
      var newClassAttended = totalClassesAttended + 1;
      setTotalClassesAttended(newClassAttended);
      var newClassTaken = totalClassesTaken + 1;
      setTotalClassesTaken(newClassTaken);
      var newPercentage = newClassAttended / newClassTaken;
      var total = Math.round(newPercentage * 100);
      setTotalAttendance(total);
    } else {
      if (totalClassesAttended !== undefined) {
        var newClassAttended = 0 + 1;
        setTotalClassesAttended(newClassAttended);
        var newClassTaken = totalClassesTaken + 1;
        setTotalClassesTaken(newClassTaken);
        var newPercentage = newClassAttended / newClassTaken;
        var total = Math.round(newPercentage * 100);
        setTotalAttendance(total);
      } else {
        var newClassAttended = 0 + 1;
        setTotalClassesAttended(newClassAttended);
        var newClassTaken = 0 + 1;
        setTotalClassesTaken(newClassTaken);
        var newPercentage = newClassAttended / newClassTaken;
        var total = Math.round(newPercentage * 100);
        setTotalAttendance(total);
      }
    }
  };

  const minus = () => {
    if (totalClassesAttended && totalClassesTaken !== undefined) {
      var newClassAttended = totalClassesAttended;
      setTotalClassesAttended(newClassAttended);
      var newClassTaken = totalClassesTaken + 1;
      setTotalClassesTaken(newClassTaken);
      var newPercentage = newClassAttended / newClassTaken;
      var total = Math.round(newPercentage * 100);
      setTotalAttendance(total);
    } else {
      if (totalClassesAttended !== undefined) {
        var newClassAttended = 0;
        setTotalClassesAttended(newClassAttended);
        var newClassTaken = totalClassesTaken + 1;
        setTotalClassesTaken(newClassTaken);
        var newPercentage = newClassAttended / newClassTaken;
        var total = Math.round(newPercentage * 100);
        setTotalAttendance(total);
      } else {
        var newClassAttended = 0;
        setTotalClassesAttended(newClassAttended);
        var newClassTaken = 0 + 1;
        setTotalClassesTaken(newClassTaken);
        var newPercentage = newClassAttended / newClassTaken;
        var total = Math.round(newPercentage * 100);
        setTotalAttendance(total);
      }
    }
  };

  const refresh = useCallback(() => {
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
            }/${teacherDetails.username}/percentage`;
            var attendanceAPI = callGetApi(url);
            attendanceAPI.then(function(resultB) {
              if (resultB.error === 'No attendance objects found.') {
                setTotalAttendance(0);
                setTotalClassesAttended(0);
                setTotalClassesTaken(0);
              } else {
                setTotalAttendance(resultB.attendanceInfo.percentage);
                setTotalClassesTaken(resultB.attendanceInfo.total);
                setTotalClassesAttended(resultB.attendanceInfo.present);
              }
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
  return (
    <ScrollView>
      <View style={styles.mainview}>
        <Text
          style={colorScheme === 'dark' ? styles.darkcourseid : styles.courseid}
          numberOfLines={1}>
          {courseId}
        </Text>
        <Text
          style={
            colorScheme === 'dark' ? styles.darkcoursename : styles.coursename
          }
          numberOfLines={1}>
          {courseName}
        </Text>
        <View style={styles.progressbar}>
          <Svg
            width={getww(60)}
            height={getwh(30)}
            style={styles.svg}
            viewBox={`${getww(0)} ${getwh(0)} ${getww(50)} ${getwh(30)}`}>
            <Circle
              stroke={
                totalAttendance >= 75
                  ? totalAttendance === 75
                    ? '#fed8b1'
                    : '#90ee90'
                  : '#ffcccb'
              }
              fill="none"
              cx={getww(26)}
              cy={getwh(15)}
              r={Math.round(getww(17) + getwh(17)) / 2}
              strokeWidth={getww(5)}
            />
            <Circle
              stroke={
                totalAttendance >= 75
                  ? totalAttendance === 75
                    ? '#FFA500'
                    : '#008000'
                  : '#FF0000'
              }
              fill="none"
              cx={getww(26)}
              cy={getwh(15)}
              r={Math.round(getww(17) + getwh(17)) / 2}
              strokeDasharray={`${(Math.round(getww(17) + getwh(17)) / 2) *
                2 *
                Math.PI} ${(Math.round(getww(17) + getwh(17)) / 2) *
                2 *
                Math.PI}`}
              strokeDashoffset={
                (Math.round(getww(17) + getwh(17)) / 2) *
                Math.PI *
                2 *
                ((100 - totalAttendance) / 100)
              }
              strokeLinecap="square"
              transform={`rotate(-90, ${getww(26)}, ${getwh(15)})`}
              strokeWidth={getww(5)}
            />
            <SVGText
              fontSize={'20'}
              fontWeight={'bold'}
              x={getww(26)}
              y={getwh(16)}
              textAnchor="middle"
              fill={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}>
              {totalAttendance !== undefined ? `${totalAttendance} %` : '0 %'}
            </SVGText>
          </Svg>
          <View style={styles.buttonview}>
            <TouchableOpacity
              style={styles.minusbutton}
              onPress={() => minus()}>
              <Icon name="minus" size={35} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.plusbutton} onPress={() => add()}>
              <Icon name="plus" size={35} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.TouchableOpacityStyle}
          onPress={() => refresh()}>
          <Icon name="reload1" size={25} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.TouchableOpacityStyleinfo}
          onPress={() => navigation.push('DetailedAttendance')}>
          <Info name="information-variant" size={30} style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.classesinfo}>
          <Text style={colorScheme === 'dark' ? styles.darktca : styles.tca}>
            {totalClassesAttended !== undefined
              ? `Classes Attended: ${totalClassesAttended}`
              : 'Classes Attended: 0'}
          </Text>
          <Text style={colorScheme === 'dark' ? styles.darktct : styles.tct}>
            {totalClassesTaken !== undefined
              ? `Total Classes : ${totalClassesTaken}`
              : 'Total Classes : 0'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.postattendance}
          onPress={() => navigation.push('PostAttendanceV')}>
          <Text style={styles.post}>Post Attendance</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  courseid: {
    fontWeight: 'bold',
    fontSize: 25,
    marginLeft: getww(5),
    marginTop: getwh(5),
  },
  mainview: {
    paddingBottom: getwh(2),
  },
  post: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  postattendance: {
    backgroundColor: '#007aff',
    width: getww(80),
    height: getwh(7),
    marginLeft: getww(10),
    marginTop: getwh(10),
    borderRadius: 10,
    justifyContent: 'center',
  },
  classesinfo: {
    alignItems: 'center',
    marginTop: getwh(5),
  },
  tca: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  darktca: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tct: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  darktct: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  TouchableOpacityStyle: {
    top: getwh(5.5),
    position: 'absolute',
    width: getww(10),
    height: getwh(10),
    alignItems: 'center',
    justifyContent: 'center',
    right: getww(5),
    bottom: getwh(2),
  },
  TouchableOpacityStyleinfo: {
    top: getwh(5.6),
    position: 'absolute',
    width: getww(10),
    height: getwh(10),
    alignItems: 'center',
    justifyContent: 'center',
    right: getww(16),
    bottom: getwh(2),
  },
  buttonview: {
    flexDirection: 'row',
    marginTop: getwh(4),
    marginLeft: getww(18),
  },
  minusbutton: {
    marginRight: getww(8),
  },
  svg: {
    marginLeft: getww(1),
    marginRight: getww(1),
  },
  progressbar: {
    marginLeft: getwh(10),
    marginRight: getww(10),
    marginTop: getwh(10),
  },
  darkcourseid: {
    fontWeight: 'bold',
    fontSize: 35,
    color: '#FFFFFF',
    marginLeft: getww(5),
    marginTop: getwh(6),
  },
  coursename: {
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: getww(5),
    marginRight: getww(5),
  },
  darkcoursename: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#FFFFFF',
    marginLeft: getww(5),
    marginRight: getww(5),
  },
  facultyname: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#007aff',
    marginLeft: getww(5),
  },
  icon: {
    color: '#007aff',
  },
});
export default viewdetails;

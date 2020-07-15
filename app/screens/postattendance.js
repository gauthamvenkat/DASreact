import React, {useState, useEffect} from 'react';

import QRCodeScanner from 'react-native-qrcode-scanner';

import {RNCamera} from 'react-native-camera';

import {Text, StyleSheet, Alert} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import {callPatchApi} from '../services/index';

function postattendance({navigation}) {
  const [reacti, setReacti] = useState('');
  const onSuccess = (e, time) => {
    var code = e.data.split('|');
    if (code[1] === undefined) {
      Alert.alert(
        'Error',
        'Wrong QR Scanned, Please Try Again',
        [
          {
            text: 'OK',
            onPress: () => {
              reacti.reactivate();
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      var datetimeqr = code[1].split('T');
      var qrdate = datetimeqr[0];
      var qrtime = datetimeqr[1];
      var formatdate = qrdate.split('-');
      var formattime = qrtime.split(':');
      var qryear = formatdate[0];
      var qrmonth = formatdate[1] - 1;
      var qrday = formatdate[2];
      var qrhours = formattime[0];
      var qrminute = formattime[1];
      var qrseconds = formattime[2];
      var offset = code[2];
      var qrTeacherUsername = code[3];
      var qrSlot = code[4];
      var qrCourseCode = code[5];
      var qrscannedtime = new Date(
        qryear,
        qrmonth,
        qrday,
        qrhours,
        qrminute,
        qrseconds,
      );
      var difference = Math.abs(time - qrscannedtime);
      var actualdifference = difference / 1000;
      var calc = parseInt(offset) + 1;
      var identifier = calc * 5;
      var username = AsyncStorage.getItem('username');
      username.then(function(result) {
        var courseInfo = AsyncStorage.getItem('requiredcourseinfo');
        courseInfo.then(function(resultA) {
          var courseDetails = JSON.parse(resultA);
          var teacherDetails = courseDetails.teacher;
          if (
            qrCourseCode === courseDetails.courseID &&
            qrSlot === courseDetails.slot &&
            qrTeacherUsername === teacherDetails.username
          ) {
            if (actualdifference > identifier) {
              Alert.alert(
                'Error',
                'QR Expired, Please Try Again',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      reacti.reactivate();
                    },
                  },
                ],
                {cancelable: false},
              );
            } else {
              const url = `attendance/student/${result}/${qrCourseCode}/${qrSlot}/${qrTeacherUsername}/${qrdate}/`;
              const data = {
                is_present: true,
              };
              var postattendanceAPI = callPatchApi(url, data);
              postattendanceAPI.then(function(resultB) {
                if (resultB !== undefined) {
                  navigation.goBack();
                }
              });
            }
          } else {
            Alert.alert(
              'Error',
              'Trying to post attendance for Wrong Course',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    reacti.reactivate();
                  },
                },
              ],
              {cancelable: false},
            );
          }
        });
      });
    }
  };
  return (
    <QRCodeScanner
      onRead={e => {
        var time = new Date();
        onSuccess(e, time);
      }}
      ref={node => {
        setReacti(node);
      }}
      flashMode={RNCamera.Constants.FlashMode.off}
      topContent={
        <Text style={styles.toptext}>
          Post Attendance by Scanning the QR Code
        </Text>
      }
      reactivateTimeout={2000}
      containerStyle={styles.container}
      showMarker={true}
      markerStyle={styles.marker}
    />
  );
}
const styles = StyleSheet.create({
  toptext: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  marker: {
    borderColor: '#007aff',
  },
  container: {
    backgroundColor: '#000000',
  },
});
export default postattendance;

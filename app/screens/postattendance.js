import React, {useState, useEffect} from 'react';

import QRCodeScanner from 'react-native-qrcode-scanner';

import {RNCamera} from 'react-native-camera';

import {Text, StyleSheet} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import {callPatchApi} from '../services/index';

function postattendance({navigation}) {
  const onSuccess = (e, time) => {
    var code = e.data.split('|');
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
    if (actualdifference > identifier) {
      console.log('Qr Expired');
    } else {
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
            const url = 'modify_attendance';
            const data = {
              courseID: qrCourseCode,
              slot: qrSlot,
              student_username: result,
              faculty_id: qrTeacherUsername,
              date: qrdate,
              is_present: true,
            };
            var postattendanceAPI = callPatchApi(url, data);
            postattendanceAPI.then(function(resultB) {
              if (resultB !== undefined) {
                navigation.goBack();
              }
            });
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
      flashMode={RNCamera.Constants.FlashMode.off}
      topContent={
        <Text style={styles.toptext}>
          Post Attendance by Scanning the QR Code
        </Text>
      }
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

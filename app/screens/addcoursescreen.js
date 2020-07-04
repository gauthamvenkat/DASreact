import React, {useState, useEffect} from 'react';

import QRCodeScanner from 'react-native-qrcode-scanner';

import {RNCamera} from 'react-native-camera';

import {Text, StyleSheet} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import {callPatchApi} from '../services/index';

function addcoursescreen({navigation}) {
  const onSuccess = e => {
    const courseDetail = JSON.parse(e.data);
    const courseName = courseDetail.name;
    const courseId = courseDetail.courseID;
    const courseSlot = courseDetail.slot;
    const teacherDetail = courseDetail.teacher;
    const teacherUsername = teacherDetail.username;
    const teacherName = teacherDetail.name;
    const teacherEmail = teacherDetail.email;
    const teacherVerification = teacherDetail.is_verified;
    const studentDetail = AsyncStorage.getItem('studentdetails');
    studentDetail.then(function(result) {
      const studentInfo = JSON.parse(result);
      const studentName = studentInfo.name;
      const studentUsername = studentInfo.username;
      const studentEmail = studentInfo.email;
      const studentVerification = studentInfo.is_verified;
      var username = AsyncStorage.getItem('username');
      username.then(function(resultA) {
        var url = `students/${resultA}`;
        var data = {
          username: studentUsername,
          email: studentEmail,
          name: studentName,
          courses: [
            {
              name: courseName,
              courseID: courseId,
              slot: courseSlot,
              teacher: {
                email: teacherEmail,
                name: teacherName,
                username: teacherUsername,
                is_verified: teacherVerification,
              },
            },
          ],
          is_verified: studentVerification,
        };
        var studentdetails = callPatchApi(url, data);
        studentdetails.then(function(resultB) {
          AsyncStorage.setItem(
            'coursedetails',
            JSON.stringify(resultB.courses),
          );
          if (resultB.name !== undefined) {
            navigation.push('Home');
          }
        });
      });
    });
  };
  return (
    <QRCodeScanner
      onRead={e => onSuccess(e)}
      flashMode={RNCamera.Constants.FlashMode.off}
      topContent={
        <Text style={styles.toptext}>Add Course by Scanning the QR Code</Text>
      }
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
  },
  marker: {
    borderColor: '#007aff',
  },
});
export default addcoursescreen;

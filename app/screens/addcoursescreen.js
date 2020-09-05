import React, {useState, useEffect} from 'react';

import QRCodeScanner from 'react-native-qrcode-scanner';

import {RNCamera} from 'react-native-camera';

import {Text, StyleSheet, Alert} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import {callPatchApi} from '../services/index';

function addcoursescreen({navigation}) {
  const [reacti, setReacti] = useState('');
  const onSuccess = e => {
    try {
      const courseDetail = JSON.parse(e.data);
      if (Object.keys(courseDetail).length !== 4) {
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
        const courseName = courseDetail.name;
        const courseId = courseDetail.courseID;
        const courseSlot = courseDetail.slot;
        const teacherDetail = courseDetail.teacher;
        const teacherUsername = teacherDetail.username;
        const teacherName = teacherDetail.name;
        const teacherEmail = teacherDetail.email;
        const teacherVerification = teacherDetail.is_verified;
        var username = AsyncStorage.getItem('username');
        username.then(function(resultA) {
          var url = `students/${resultA}/add_course`;
          var data = {
            name: courseName,
            courseID: courseId,
            slot: courseSlot,
            teacher: {
              email: teacherEmail,
              name: teacherName,
              username: teacherUsername,
              is_verified: teacherVerification,
            },
          };
          var studentdetails = callPatchApi(url, data);
          studentdetails.then(function(resultB) {
            if (resultB.name === courseName) {
              navigation.push('Home');
            } else {
              Alert.alert(
                'Error',
                'No Response From Server, Please Try Again',
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
    } catch (error) {
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
    }
  };
  return (
    <QRCodeScanner
      onRead={e => onSuccess(e)}
      ref={node => {
        setReacti(node);
      }}
      flashMode={RNCamera.Constants.FlashMode.off}
      topContent={
        <Text style={styles.toptext}>Add Course by Scanning the QR Code</Text>
      }
      reactivateTimeout={2000}
      showMarker={true}
      containerStyle={styles.container}
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
export default addcoursescreen;

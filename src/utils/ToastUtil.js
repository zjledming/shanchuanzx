import React, { Component } from 'react';
import { Alert, ToastAndroid, Platform, ActivityIndicator } from 'react-native';
import { isSpace } from '../util/format';
import { WModal } from 'react-native-smart-tip';

const modalOpts = {
  data: '加载中...',
  textColor: '#fff',
  backgroundColor: '#444444',
  position: WModal.position.CENTER,
  icon: <ActivityIndicator color='#fff' size={'large'} />
}

const showLoading = (content) => {
  if (!isSpace(content)) {
    modalOpts.data = content + '...';
  }
  WModal.show(modalOpts)
};

const hideLoading = () => {
  WModal.hide();
};


const showShort = (content, isAlert) => {
  if (!content) {
    return;
  }
  if (isAlert || Platform.OS === 'ios') {
    Alert.alert('提示', content.toString());
  } else {
    ToastAndroid.show(content.toString(), ToastAndroid.SHORT);
  }
};

const showLong = (content, isAlert) => {
  if (isAlert || Platform.OS === 'ios') {
    Alert.alert('提示', content.toString());
  } else {
    ToastAndroid.show(content.toString(), ToastAndroid.LONG);
  }
};


const toastShort = (content, isAlert) => {
  if (!content) {
    return;
  }
  if (isAlert || Platform.OS === 'ios') {
    Alert.alert('提示', content.toString());
  } else {
    ToastAndroid.show(content.toString(), ToastAndroid.SHORT);
  }
};

const toastLong = (content, isAlert) => {
  if (isAlert || Platform.OS === 'ios') {
    Alert.alert('提示', content.toString());
  } else {
    ToastAndroid.show(content.toString(), ToastAndroid.LONG);
  }
};


const toastAlert = (content, callBack, title = '提示') => {
  // console.log(callBack);
  Alert.alert(title, content,
    callBack ? [
      { text: '取消', style: 'cancel' },
      {
        text: '确定', onPress: () => {
          callBack()
        }
      },
    ] :
      [
        {
          text: '确定', onPress: () => {
          }, style: 'cancel'
        }
      ]
    ,
    { cancelable: true });
};







export {
  toastShort,
  toastLong,
  toastAlert
}

export default {
  showShort,
  showLong,
  showLoading,
  hideLoading
};

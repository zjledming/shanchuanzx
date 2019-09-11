import DeviceStorage from '../../utils/DeviceStorage'
import { isSpace } from '../../util/format';
import ToastUtil from '../../utils/ToastUtil';
// import Storage from 'react-native-storage';
// import { AsyncStorage } from 'react-native';

/**
code: "1"
dqjf: ""
phone: "15802613069"
realname: "付细明"
ssqy: "安徽省/芜湖市"
type: "1"
userid: "1"
username: "15802613069"
 */
const userinfoKey = 'userinfoKey';
// 登录状态
var loginflag = false;
//用户信息
var UserInfo = {};
// const storage = new Storage({
//     size: 1000,
//     storageBackend: AsyncStorage, // for web: window.localStorage
//     defaultExpires: null,
//     enableCache: true,
//     sync: {
//     }
// });

//返回用户基本信息
export function getUserInfo() {
    return UserInfo;
}
//设置用户信息
export function setUserInfo(_userInfo) {
    loginflag = true;
    UserInfo = _userInfo;
    // 
    // storage.save({
    //     key: 'loginuser', // Note: Do not use underscore("_") in key!
    //     id:'1001',
    //     data: _userInfo,
    //     expires: null
    // });
    DeviceStorage.save(userinfoKey, _userInfo);
    //AsyncStorage.setItem(key, JSON.stringify(value));
}

//只处理全局变量
export function setUserInfo2(_userInfo) {
    loginflag = true;
    UserInfo = _userInfo;
}
//清除用户信息
export function loginOut() {
    UserInfo = {};
    loginflag = false;
    DeviceStorage.save(userinfoKey, {});
}
//用户是否已经登录
export function isLogin() {
    // return !isSpace(UserInfo.userid);
    // ToastUtil.showShort('isLogin:' + loginflag);
    // console.log('isLogin:' + loginflag);
    return loginflag;
}

//用户是否是工作人员
export function isWork() {
    return "3" === UserInfo.type;
}
export function isCommon() {
    return "2" === UserInfo.type;
}
//获取用户类型描述
export function getUserTypeDesc() {
    return UserInfo.user_id;
}

//获取用户积分
export function getDrjf() {
    return isSpace(UserInfo.drjf) ? "0" : UserInfo.drjf;
}
//获取用户积分
export function getZjf() {
    return isSpace(UserInfo.zjf) ? "0" : UserInfo.zjf;
}

export function getUsername() {
    return isSpace(UserInfo.username) ? "" : UserInfo.username;
}

export function getRealname() {
    return isSpace(UserInfo.realname) ? "" : UserInfo.realname;
}
export function setZjf(zjf) {
    UserInfo.zjf = zjf;
}

export function loadUserInfo() {

    DeviceStorage.get('userinfoKey').then((item) => {
        if (item && !isSpace(item.userid)) {
            UserInfo = item;
            loginflag = true;
        } else {
            UserInfo = {};
            loginflag = false;
        }
    });


    //load 读取
    // storage.load({
    //     key: userinfoKey,
    //     id: '1001'
    // }).then(ret => {
    //     // 如果找到数据，则在then方法中返回
    //     //console.log(ret.userid);
    //     UserInfo = ret;
    // }).catch(err => {
    //     // 如果没有找到数据且没有sync方法，
    //     // 或者有其他异常，则在catch中返回
    //     console.warn(err.message);
    //     switch (err.name) {
    //         case 'NotFoundError':
    //             // TODO;
    //             break;
    //         case 'ExpiredError':
    //             // TODO
    //             break;
    //     }
    // })
}


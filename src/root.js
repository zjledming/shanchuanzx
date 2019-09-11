import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from './reducers/configureStore';
import App from './app';
import SplashScreen from "react-native-splash-screen";
import JPushModule from "jpush-react-native";
import { CacheHelper } from "react-native-rn-cacheimage";
import * as LoginInfo from './page/Login/LoginInfo';
import Orientation from 'react-native-orientation';
import {
    StatusBar
} from 'react-native';


const store = configureStore();
store.subscribe(() => {
    //监听state变化
    console.log(store.getState());
});
export default class Root extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        //应用注册
        // 初始用户信息
        // 这里干脆不加载了，直接去首页加载吧，这里加载会有异步问题，意义不大
        // LoginInfo.loadUserInfo();
    }

    componentDidMount() {
        StatusBar.setBackgroundColor('#d33d3c');
        StatusBar.setBarStyle('light-content', false);
        Orientation.lockToPortrait();

        this.timer = setTimeout(
            () => {
                SplashScreen.hide(); // 隐藏启动屏
            },
            2000
        );


        // 新版本必需写回调函数
        // JPushModule.notifyJSDidLoad();
        JPushModule.notifyJSDidLoad((resultCode) => {
            if (resultCode === 0) {
            }
        });

        // 接收自定义消息
        JPushModule.addReceiveCustomMsgListener((message) => {
            this.setState({ pushMsg: message });
        });
        // 接收推送通知
        JPushModule.addReceiveNotificationListener((message) => {
            console.log("receive notification: " + message);
        });
        // 打开通知
        JPushModule.addReceiveOpenNotificationListener((map) => {
            console.log("Opening notification!");
            console.log("map.extra: " + map.extras);
            // 可执行跳转操作，也可跳转原生页面
            // this.props.navigation.navigate("SecondActivity");
        });

        CacheHelper.register({ overwrite: false }).catch(e => console.log(e))

    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
        JPushModule.removeReceiveCustomMsgListener();
        JPushModule.removeReceiveNotificationListener();
        CacheHelper.unregister().catch(e => console.log(e))
    }

    render() {
        return (
            // 实现app和store的关联，等于整个系统的组件都被包含住了
            <Provider store={store}>
                <App />
            </Provider>
        )
    }
}

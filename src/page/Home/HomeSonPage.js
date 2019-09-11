import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    BackHandler,
    ToastAndroid,
    WebView,
    View,
    ActivityIndicator,
    StatusBar, TouchableOpacity, Text
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import SqzxPage from '../SqzxPage';
import SqzxPage1 from '../SqzxPage1';
import SqzxPage2 from '../SqzxPage2';
import SqzxPage3 from '../SqzxPage3';
import SqzxPage4 from '../SqzxPage4';
import Hxkc from '../Hxkc';
import RxczxPage from '../RxczxPage';
import SxyPage from '../SxyPage';
import YjyPage from '../YjyPage';
import * as LoginInfo from '../Login/LoginInfo';
import { getZjf } from '../../api/news';
import NavBar from '../../common/NavBar';
import { isSpace, parseFloatfun } from '../../util/format';


const currentHeight = StatusBar.currentHeight;
// 计时器
var count = 0;
export default class HomeSonPage extends Component {
    static navigationOptions = {
        header: null
    };

    // 构造函数
    constructor(props) {
        super(props);

        // 获取传递参数
        this.params = this.props.navigation.state.params;
        this.state = {
            flagname: this.params.flagname
        };

    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            this.setState({
                zjf: LoginInfo.getZjf()
            })
        });

        // this.timer = setTimeout(
        //     () => {
        //         this.getZjf();
        //     },
        //     2000
        // );

        this.inter = setInterval(
            () => {
                this.myTimer();
            },
            250
        );


    }


    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }


    componentWillUnmount() {
        // this.timer && clearTimeout(this.timer);
        this.inter && clearInterval(this.inter);
        this._navListener.remove();

        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }


    // ---------------------------------------------- 自定义函数 ---------------------------------------------- //




    setzjf() {
        this.setState({
            zjf: LoginInfo.getZjf()
        })
    }


    myTimer() {
        count = count + 1;

        // 持续获取登录状态
        if (LoginInfo.isLogin()) {
            // 先销毁
            this.inter && clearInterval(this.inter);
            // 获取zjf
            this.getZjf();
        }

        // 5秒后放弃
        if (count > 20) {
            this.inter && clearInterval(this.inter);
        }


    }


    getZjf() {
        // 进入app,先进入首页，如果是登陆状态更新总积分

        if (LoginInfo.isLogin()) {
            const res = getZjf(LoginInfo.getUsername()); // api接口
            res.then((newsObj) => {

                this.setState({ // 设置状态
                    zjf: newsObj.zjf
                });
                LoginInfo.setZjf(newsObj.zjf);
            }).catch((e) => { // 错误异常处理
                ToastAndroid.show(e, ToastAndroid.SHORT); // androidToast
            })
        }


    }





    onBackAndroid = () => {
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            //最近2秒内按过back键，可以退出应用。
            BackHandler.exitApp();
            return false;
        }
        this.lastBackPressed = Date.now();
        ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
        // return true;
        return true;
    };


    back() {
        this.props.navigation.pop();
    }


    change2text(i) {
        let flagname_ = '山川咨询';
        if (i == 0) {
            flagname_ = '山川咨询';
        } else if (i == 1) {
            flagname_ = '人性材质学';
        } else if (i == 2) {
            flagname_ = '课程体系';
        } else if (i == 3) {
            flagname_ = '山川研究院';
        } else if (i == 4) {
            flagname_ = '山川商学院';
        }
        return flagname_;
    }


    render() {
        return (
            <View style={{ flex: 1 }}>

                <NavBar
                    title={this.state.flagname}
                    leftIcon="md-arrow-back"
                    leftPress={this.back.bind(this)}
                />

                {/* <StatusBar
                    translucent={false}
                    animated={false}
                    backgroundColor={"#d33d3c"}
                    barStyle={"light-content"}
                /> */}




                <ScrollableTabView

                    // renderTabBar={() => <DefaultTabBar />}
                    // tabBarActiveTextColor={'#047ee6'}
                    // tabBarUnderlineColor={'#047ee6'}
                    // tabBarInactiveTextColor={'#666'}
                    // tabBarBackgroundColor={'white'}
                    // tabBarTextStyle={{ fontSize: 14 }}
                    // scrollWithoutAnimation={false}

                    initialPage={parseFloatfun(this.params.flag)}
                    onChangeTab={(obj) => {
                        //console.log('选中了：'+obj.i)
                        this.setState({ // 设置状态
                            flag: obj.i,
                            flagname: this.change2text(obj.i),
                        });
                    }}//切换后调用此方法
                    locked={false}
                    scrollWithoutAnimation={true}
                    tabBarUnderlineStyle={{ backgroundColor: '#e70012', height: 2, }}
                    renderTabBar={() => <ScrollableTabBar
                        underlineColor='#ce3d3a'
                        activeTextColor='#e70012'
                        inactiveTextColor='#111111'
                        underlineHeight={0}
                        style={{ height: 40, borderWidth: 0, elevation: 2 }}
                        textStyle={{ fontSize: 15 }}
                        tabStyle={{ height: 40, borderWidth: 0, paddingBottom: 0, paddingLeft: 10, paddingRight: 10 }}
                        backgroundColor='#fff'
                    />}

                >
                    {/* <FindPage tabLabel='热点推荐' params={{ type: '1' }} navigation={this.props.navigation} /> */}
                    <SqzxPage tabLabel='山川咨询' params={{ type: '0' }} navigation={this.props.navigation} />
                    <SqzxPage1 tabLabel='人性材质学' params={{ type: '1' }} navigation={this.props.navigation} />
                    <Hxkc tabLabel='产品体系' params={{ type: '2' }} navigation={this.props.navigation} />
                    <SqzxPage3 tabLabel='山川研究院' params={{ type: '3' }} navigation={this.props.navigation} />
                    <SqzxPage4 tabLabel='山川商学院' params={{ type: '4' }} navigation={this.props.navigation} />

                    {/* <RxczxPage tabLabel='人性材质学' params={{ type: '1' }} navigation={this.props.navigation} />
                    <Hxkc tabLabel='产品体系' params={{ type: '2' }} navigation={this.props.navigation} />
                    <YjyPage tabLabel='山川研究院' params={{ type: '3' }} navigation={this.props.navigation} />
                    <SxyPage tabLabel='山川商学院' params={{ type: '4' }} navigation={this.props.navigation} /> */}

                </ScrollableTabView>

            </View>
        );
    }

    loading = () => {
        return <ActivityIndicator style={styles.flash} size='small' color='#aa00aa' />
    }

}
const styles = StyleSheet.create({

    flash: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },

});

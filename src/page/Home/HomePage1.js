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
import px2dp from '../../utils/px2dp'
import Icon from 'react-native-vector-icons/Ionicons'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import MinePage from '../Mine/MinePage';
import FindPage from '../FindPage';
import SqzxPage from '../SqzxPage';
import Hxkc from '../Hxkc';
import RxczxPage from '../RxczxPage';
import SxyPage from '../SxyPage';
import YjyPage from '../YjyPage';
import * as LoginInfo from '../Login/LoginInfo';
import { getZjf } from '../../api/news';


const currentHeight = StatusBar.currentHeight;
// 计时器
var count = 0;
export default class HomePage extends Component {
    static navigationOptions = {
        tabBarLabel: '山川',
        header: null,
        tabBarIcon: ({ focused }) => {
            if (focused) {
                return (
                    <Image style={styles.tabBarIcon} source={require('../../img/sc_sel.png')} />
                );
            }
            return (
                <Image style={styles.tabBarIcon} source={require('../../img/sc_nor.png')} />
            );
        },
    };

    // 构造函数
    constructor(props) {
        super(props);
        this.state = { // 状态
            zjf: '0',//下拉控制 是否为最新
        };
    }

    setzjf() {
        this.setState({
            zjf: LoginInfo.getZjf()
        })
    }


    myTimer() {
        count = count + 1;

        // 持续获取登录状态
        if(LoginInfo.isLogin()){
            // 先销毁
            this.inter && clearInterval(this.inter);
            // 获取zjf
            this.getZjf();
        }

        // 5秒后放弃
        if(count > 20){
            this.inter && clearInterval(this.inter);
        }
        

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



    componentWillUnmount() {
        // this.timer && clearTimeout(this.timer);
        this.inter && clearInterval(this.inter);
        this._navListener.remove();
      
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
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

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar
                    translucent={false}
                    animated={false}
                    backgroundColor={"#d33d3c"}
                    barStyle={"light-content"}
                />
                {/* <WebView
                    // source={{uri: 'http://www.qiandu.com/#/mine/center'}}
                    source={{uri: 'https://www.imooc.com/#'}}
                    startInLoadingState
                    renderLoading={() => {
                        return this.loading()
                    }}
                /> */}

                <View style={styles.headerBar}>
                    <Image style={styles.beghedimg} source={require('../../img/logo-bs.png')} >
                    </Image>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.searchBox}
                    >
                        {/* onPress={this.navToSearch.bind(this)} */}
                        {/* onPress={this.pressRegister.bind(this)} */}
                        <Icon name="ios-search" size={px2dp(14)} style={{ marginRight: px2dp(3), marginLeft: px2dp(5) }} />
                        <Text style={styles.searchText}>搜索...</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{ flexDirection: 'row', marginHorizontal: px2dp(3) }}
                    >
                        <View style={styles.endhedview1}>
                            <Text style={styles.endhedtext1}>积</Text>
                            <Text style={styles.endhedtext1}>分</Text>
                        </View>
                        <Text style={styles.endhedtext}>{this.state.zjf}</Text>
                    </TouchableOpacity>
                    {/* <Image style={styles.endhedimg} source={require('../../img/wo-bs.png')} >
                    </Image> */}
                </View>


                <ScrollableTabView

                    // renderTabBar={() => <DefaultTabBar />}
                    // tabBarActiveTextColor={'#047ee6'}
                    // tabBarUnderlineColor={'#047ee6'}
                    // tabBarInactiveTextColor={'#666'}
                    // tabBarBackgroundColor={'white'}
                    // tabBarTextStyle={{ fontSize: 14 }}
                    // scrollWithoutAnimation={false}

                    initialPage={0}
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
                    <FindPage tabLabel='热点推荐' params={{ type: '1' }} navigation={this.props.navigation} />
                    <Hxkc tabLabel='核心课程' params={{ type: '6' }} navigation={this.props.navigation} />
                    <RxczxPage tabLabel='人性材质学' params={{ type: '2' }} navigation={this.props.navigation} />
                    <SqzxPage tabLabel='山川咨询' params={{ type: '3' }} navigation={this.props.navigation} />
                    <YjyPage tabLabel='山川研究院' params={{ type: '4' }} navigation={this.props.navigation} />
                    <SxyPage tabLabel='山川商学院' params={{ type: '5' }} navigation={this.props.navigation} />

                </ScrollableTabView>






            </View>
        );
    }

    loading = () => {
        return <ActivityIndicator style={styles.flash} size='small' color='#aa00aa' />
    }

}
const styles = StyleSheet.create({
    container: {
        marginTop: currentHeight
    },
    flash: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    tabBarIcon: {
        width: 19,
        height: 19,
    },

    headerBar: {
        height: px2dp(40),
        backgroundColor: '#d33d3c',
        flexDirection: 'row',
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10),
        alignItems: 'center'
    },
    beghedimg: {
        height: px2dp(20),
        width: px2dp(98),
        // marginLeft: px2dp(2),
    },

    searchBox: {
        backgroundColor: '#f5f5f3',
        flex: 1,
        marginLeft: px2dp(8),
        height: px2dp(25),
        borderRadius: px2dp(3),
        padding: px2dp(3),
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchIcon: {
        fontSize: px2dp(18),
    },
    searchText: {
        fontSize: px2dp(13),
    },

    endhedview1: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // marginRight: px2dp(3),
        marginLeft: px2dp(8),
    },
    endhedtext1: {
        color: '#fff',
        fontSize: px2dp(9),
        lineHeight: px2dp(9),

    },

    endhedtext: {
        color: '#fff',
        fontSize: px2dp(17),
        fontWeight: 'bold',
        marginLeft: px2dp(3),
    },

    endhedimg: {
        height: px2dp(18),
        width: px2dp(18),
        // marginRight: px2dp(10),
        marginLeft: px2dp(10),
    },



});

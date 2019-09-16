'use strict';

import React, { Component } from 'react';
import {
    Content,
    // Icon,
    Card,
    CardItem,
    // Text,
    Left,
} from "native-base";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    StatusBar,
    ScrollView, Dimensions, Image,
    Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/SimpleLineIcons';
import Iconfonts from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-af-video-player'; // 视频组件


import BackHandleComponent from '../components/BackHandleComponent';
import WebViewPage from './WebViewPage';
import * as LoginInfo from '../page/Login/LoginInfo';
import ToastUtil from "../utils/ToastUtil";
import NavBar from '../common/NavBar';
import BackgroundPage from '../common/BackgroundPage';


import { getZwByUuid, getBtByUuid, getShoucflag, shouc, getplnum } from '../api/news';
import { px2dp, getdthei, isSpace } from '../util/format';
import { zdp, zsp } from "../utils/ScreenUtil";
const { width, height } = Dimensions.get('window');


var WINDOW_WIDTH = Dimensions.get('window').width;
var DT_WIDTH = WINDOW_WIDTH - 40;
var WIDTH05 = DT_WIDTH * 0.5;



var WeChat = require('react-native-wechat');
export default class SqzxPage1 extends BackHandleComponent {

    static navigationOptions = {
        header: null
    };

    // static navigationOptions = ({ navigation }) => ({
    //     headerStyle: { backgroundColor: '#d33d3c', height: px2dp(40), }, //height: 54,
    //     headerBackTitleStyle: { color: '#fff' },
    //     headerTintColor: '#fff',
    //     headerTitle: (
    //         <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, color: '#fff' }}>SHANCHUAN | 学习内容</Text>
    //     ),
    //     headerRight: <View />
    // });

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        let isLogin = LoginInfo.isLogin();
        let user_ = LoginInfo.getUserInfo();
        //react-native-wechat 使用前必须初始化一次（有且仅一次）。建议放在项目的入口文件里：
        // WeChat.registerApp('wxef86d86cb7a99caa');
        this.state = {
            zwData: [], // 正文数据
            btData: {}, // 标题数据
            isLogin: isLogin,
            user: user_,
            shoucflag: false,
            plnum: 0,
            pled: false,
            isShowCard: false,
            title :'',
        }

    }

    componentDidMount() {
        this.getZwByUuid(); // 获取正文数据
        // this.getBtByUuid(); // 获取标题数据
    }


    getShoucflag() {


        if (this.state.isLogin) {

            const res = getShoucflag(this.state.user.phone, this.state.btData.id); // api接口
            res.then((newsObj) => {

                if (!isSpace(newsObj.id)) {
                    this.setState({ // 设置状态
                        shoucflag: true
                    });
                }

            }).catch((e) => { // 错误异常处理
                ToastAndroid.show(e, ToastAndroid.SHORT); // androidToast
            })

        }


    }


    // 获取标题数据
    getplnum() {

        const res = getplnum(this.state.btData.id, this.state.isLogin ? this.state.user.phone : '0'); // api接口
        res.then((newsObj) => {

            this.setState({ // 设置状态
                plnum: newsObj.plnum,
                pled: newsObj.pled,
            });
        }).catch((e) => { // 错误异常处理
            ToastAndroid.show(e, ToastAndroid.SHORT); // androidToast
        })
    }


    // 获取标题数据
    getBtByUuid() {

        const res = getBtByUuid(this.params.uuid); // api接口
        res.then((newsObj) => {
            this.setState({ // 设置状态
                btData: newsObj
            });
            // 因为需要这个参数，所以必须等他成功获取到之后再去获取状态
            // this.getShoucflag();
            // this.getplnum();
        }).catch((e) => { // 错误异常处理
            ToastAndroid.show(e, ToastAndroid.SHORT); // androidToast
        })
    }


    // 获取正文数据
    getZwByUuid() {
        let uuid = '896ba03e7ab446f7b94ff1e11c9c1112';
        // if(this.params.flag = '0' ){
        //     uuid = '896ba03e7ab446f7b94ff1e11c9c1111';
        //     // this.setState({ // 设置状态
        //     //     title: '山川咨询'
        //     // });
        // }else if(this.params.flag = '1' ){
        //     uuid = '896ba03e7ab446f7b94ff1e11c9c1112';
        // }else if(this.params.flag = '2' ){
        //     uuid = '896ba03e7ab446f7b94ff1e11c9c1113';
        // }else if(this.params.flag = '3' ){
        //     uuid = '896ba03e7ab446f7b94ff1e11c9c1114';
        // }else if(this.params.flag = '4' ){
        //     uuid = '896ba03e7ab446f7b94ff1e11c9c1115';
        // }
        const res = getZwByUuid(uuid); // api接口
        res.then((newsArr) => {
            this.setState({ // 设置状态
                zwData: newsArr
            });
        }).catch((e) => { // 错误异常处理
            ToastAndroid.show(e, ToastAndroid.SHORT); // androidToast
        })
    }


    getVideoUrl(video_url) {
        return video_url;
    }

    initpage() {
        this.getShoucflag();
        this.getplnum();
    }

    linkdz() {
        let url_ = this.state.btData.ljdz;
        this.props.navigation.navigate('WebScreen', {
            url: url_,
            name: this.state.btData.title,
            wlflag: 'Y'
        });

    }


    pllist() {
        // 先判断登录 
        if (this.state.isLogin) {
            // 登录判断完之后，判断是否发表了评论，如果没有，提示发表评论
            if (this.state.pled) {
                let url_ = "app/jsp/shanc/pllist.jsp?plr_id=" + this.state.user.phone + "&plr_name=" + this.state.user.realname + "&sl_id=" + this.state.btData.id + "&sl_title=" + this.state.btData.title;
                this.props.navigation.navigate('WebScreen', {
                    url: url_,
                    name: "精彩评论",
                    // info: info,
                    callback: ((info) => { //回调函数
                        // 回调了
                        //that.fetchNewsData(0, 10);
                    })
                });
            } else {
                ToastUtil.showShort('发表评论之后才能查看精彩评论');
            }


        } else {
            this.props.navigation.navigate('LoginIndex',
                {
                    // info: info,
                    callback: ((info) => { //回调函数
                        // 回调了就是登录成功了
                        this.setState({
                            isLogin: true,
                            user: info,
                        });
                        this.initpage();
                    })
                }

            );

        }

    }

    pingl() {
        // 先判断登录 
        if (this.state.isLogin) {
            let url_ = "app/jsp/shanc/pledit.jsp?plr_id=" + this.state.user.phone + "&plr_name=" + this.state.user.realname + "&sl_id=" + this.state.btData.id + "&sl_title=" + this.state.btData.title;
            this.props.navigation.navigate('WebScreen', {
                url: url_,
                name: "我的评论",
                // info: info,
                callback: ((info) => { //回调函数
                    // 回调了
                    this.getplnum();
                })
            });

        } else {
            this.props.navigation.navigate('LoginIndex',
                {
                    // info: info,
                    callback: ((info) => { //回调函数
                        // 回调了就是登录成功了
                        this.setState({
                            isLogin: true,
                            user: info,
                        });
                        this.initpage();
                    })
                }

            );

        }

    }

    getButtonCardItem = (title, iconName, iconColor, onPress) => {
        return (
            <CardItem button onPress={
                onPress
            }>
                <Left>
                    <Iconfonts
                        active
                        name={iconName}
                        style={{ color: iconColor, fontSize: px2dp(20) }}
                    />
                    <Text style={{ marginLeft: px2dp(6), fontSize: px2dp(15) }}>{title}</Text>
                </Left>
            </CardItem>
        )
    }


    fenxiang() {
        //  this.props.navigation.navigate('Share');
        this.setState({
            isShowCard: true
        });
    }


    shouc() {
        // 收藏 先判断登录 
        if (this.state.isLogin) {
            // 先执行请求，再提示
            const res = shouc(this.state.user.phone, this.state.user.realname, this.state.btData.id, this.state.btData.title, this.state.shoucflag); // api接口 
            res.then((newsArr) => {
                //this.setState({ shoucflag: true });
            }).catch((e) => { // 错误异常处理
                ToastAndroid.show(e, ToastAndroid.SHORT); // androidToast
            })

            if (this.state.shoucflag) {
                // 已收藏：显示取消收藏
                ToastUtil.showShort('取消收藏');
                this.setState({ shoucflag: false });
            } else {
                // 未收藏：显示收藏成功
                ToastUtil.showShort('收藏成功');
                this.setState({ shoucflag: true });
            }


        } else {
            this.props.navigation.navigate('LoginIndex',
                {
                    // info: info,
                    callback: ((info) => { //回调函数
                        // 回调了就是登录成功了
                        this.setState({
                            isLogin: true,
                            user: info,
                        });
                        this.initpage();
                    })
                }

            );

        }

    }



    back() {
        // 需要回调的场景
        // 1.取消收藏了 
        if (!this.state.shoucflag) {
            if (this.props.navigation.state.params.callback) {
                this.props.navigation.state.params.callback({});
            }
            this.props.navigation.goBack();
        } else {
            this.props.navigation.pop();
        }

    }


    getCardView = () => {
        // const card =
        return (
            <Content style={{
                width: width - zdp(60),
                marginTop: zdp(150),
                alignSelf: 'center',
                position: 'absolute'
            }} padder>
                <Card style={styles.mb}>
                    <CardItem header bordered>
                        <Text>分享</Text>
                    </CardItem>
                    {this.getButtonCardItem('微信好友', 'wechat', '#2aa144', () => {
                        WeChat.isWXAppInstalled()
                            .then((isInstalled) => {
                                if (isInstalled) {
                                    WeChat.shareToSession({ type: 'text', description: '测试微信好友分享文本' })
                                        .catch((error) => {
                                            ToastUtil.showShort(error.message);
                                        });
                                } else {
                                    ToastUtil.showShort('没有安装微信软件，请您安装微信之后再试');
                                }
                            });
                        console.log('微信分享');
                    })}

                    {this.getButtonCardItem('微信朋友圈', 'chrome', '#3B579D', () => {
                        WeChat.isWXAppInstalled()
                            .then((isInstalled) => {
                                if (isInstalled) {
                                    WeChat.shareToTimeline({
                                        title: '微信朋友圈测试链接',
                                        description: '分享自:江清清的技术专栏(www.lcode.org)',
                                        thumbImage: 'http://mta.zttit.com:8080/images/ZTT_1404756641470_image.jpg',
                                        type: 'news',
                                        webpageUrl: 'http://www.lcode.org'
                                    })
                                        .catch((error) => {
                                            ToastUtil.showShort(error.message);
                                        });
                                } else {
                                    ToastUtil.showShort('没有安装微信软件，请您安装微信之后再试');
                                }
                            });
                        console.log('dianji');
                    })}

                    {this.getButtonCardItem('QQ', 'qq', '#1c92ec', () => {
                        WeChat.isWXAppInstalled()
                            .then((isInstalled) => {
                                if (isInstalled) {
                                    WeChat.shareToTimeline({
                                        title: '微信朋友圈测试链接',
                                        description: '分享自:江清清的技术专栏(www.lcode.org)',
                                        thumbImage: 'http://mta.zttit.com:8080/images/ZTT_1404756641470_image.jpg',
                                        type: 'news',
                                        webpageUrl: 'http://www.lcode.org'
                                    })
                                        .catch((error) => {
                                            ToastUtil.showShort(error.message);
                                        });
                                } else {
                                    ToastUtil.showShort('没有安装微信软件，请您安装微信之后再试');
                                }
                            });
                        console.log('dianji');
                    })}

                    {this.getButtonCardItem('QQ空间', 'star', '#ffce00', () => {
                        WeChat.isWXAppInstalled()
                            .then((isInstalled) => {
                                if (isInstalled) {
                                    WeChat.shareToTimeline({
                                        title: '微信朋友圈测试链接',
                                        description: '分享自:江清清的技术专栏(www.lcode.org)',
                                        thumbImage: 'http://mta.zttit.com:8080/images/ZTT_1404756641470_image.jpg',
                                        type: 'news',
                                        webpageUrl: 'http://www.lcode.org'
                                    })
                                        .catch((error) => {
                                            ToastUtil.showShort(error.message);
                                        });
                                } else {
                                    ToastUtil.showShort('没有安装微信软件，请您安装微信之后再试');
                                }
                            });
                        console.log('dianji');
                    })}
                </Card>
            </Content>);
    };




    render() {
        return (
            <View style={{ flex: 1, }}>
                {/* <NavBar
                    title="案例详情"
                    leftIcon="md-arrow-back"
                    leftPress={this.back.bind(this)}
                /> */}
                {/* <StatusBar
                    barStyle={'dark-content'}
                    backgroundColor={'#ffffff'}
                /> */}
                {/* <View style={styles.searchBar}>
                    <View style={styles.backIconBox}>
                        <Icons style={styles.backIcon} name='arrow-left' onPress={() => {
                             this.props.navigation.goBack();
                        }} />
                    </View>
                    <View style={styles.shareIconBox}>
                        <Icons style={styles.backIcon} name='options' onPress={() => {
                            this.props.navigation.goBack();
                        }} />
                    </View>
                </View> */}


                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>


                    {/* <View style={styles.titleview}>
                        <Text style={styles.begintext}>{this.state.btData.title}</Text>
                    </View>


                    <View style={styles.rowvstartend}>

                        <View style={styles.onetuvlb}>
                            <Text style={styles.wutuvprice1} numberOfLines={1}>{this.state.btData.fbr}</Text>
                            <Text style={styles.wutuvprice2} numberOfLines={1}>{this.state.btData.remark5}</Text>
                        </View>
                        {
                            !isSpace(this.state.btData.remark6) ?
                                <View style={styles.onetuvlb1}>
                                    <Text style={styles.wutuvtag1} numberOfLines={1}>{this.state.btData.remark6}</Text>
                                </View> :
                                <View />

                        }
                    </View>

                    {
                        !isSpace(this.state.btData.jianjie) ?
                            <View style={styles.jjview}>
                                <Text style={styles.jjtext}>{this.state.btData.jianjie}</Text>
                            </View> :
                            <View />
                    } */}

                    <View style={styles.zwview}>
                        {
                            this.state.zwData.map((item, index) => {
                                if (item.type == '1') {
                                    return (
                                        <Text key={item.id} style={styles.zwtext}>{item.zwnr}</Text>
                                    )
                                } else if (item.type == '2') {
                                    return (
                                        <Image key={item.id} style={{ height: getdthei(item.hwbl), width: DT_WIDTH, }} source={{ uri: item.zwnr }}></Image>
                                    )
                                } else if (item.type == '3') {
                                    return (
                                        <View key={item.id} style={styles.videoItem}>
                                            {/* <ArsVideo
                                                // source={item.video_url}
                                                source={this.getVideoUrl(item.zwnr)}
                                                img={this.state.btData.headpic}
                                                title={item.title}
                                                duration={this.state.btData.remark4}
                                                height={getdthei(this.state.btData.hwbl)}
                                            /> */}

                                            <Video
                                                autoPlay={true}
                                                // loop={true}
                                                style={styles.videocontent}
                                                fullScreenOnly={false} // 只在全屏下播放
                                                inlineOnly={true}
                                                url={this.getVideoUrl(item.zwnr)}
                                                title={this.params.flagname}
                                                // logo={this.state.btData.headpic}
                                                // placeholder={this.state.btData.headpic}
                                                // rotateToFullScreen
                                                hideFullScreenControl={true}
                                            />


                                        </View>
                                    )
                                }

                            })
                        }

                    </View>


                    {
                        !isSpace(this.state.btData.ljdz) ?
                            <TouchableOpacity onPress={this.linkdz.bind(this)} >

                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    paddingHorizontal: px2dp(20),
                                    paddingBottom: px2dp(50),
                                }}>
                                    <Text style={{ color: px2dp(16), }} ><Icons style={{ fontSize: px2dp(12) }} name='link' color="#6a89fe" />  打开链接</Text>
                                </View>
                            </TouchableOpacity> :
                            null
                    }



                </ScrollView>


                {/* <View style={styles.footBar}>

                    <TouchableOpacity onPress={this.pingl.bind(this)} >
                        <View style={styles.searchBox}>
                            <Icons style={styles.searchIcon} name='pencil' />
                            <Text style={styles.searchInput}>说点什么...</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.pllist.bind(this)} style={{ position: 'relative' }} >
                        <View style={styles.gongneng1}>
                            <Icon style={styles.gongnengIcon} name='textsms' />
                            <Text style={styles.numtag}>{this.state.plnum}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.shouc.bind(this)} >
                        <View style={styles.gongneng}>
                            {
                                !isSpace(this.state.shoucflag) ?
                                    <Icon style={{ fontSize: px2dp(23) }} name='star' color="#e70012" /> :
                                    <Icon style={{ fontSize: px2dp(23) }} name='star' />
                            }
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.shouc.bind(this)} >
                        <View style={styles.gongneng}>
                            <Icon style={{ fontSize: px2dp(22) }} name='archive' />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.fenxiang.bind(this)} >
                        <View style={styles.gongneng}>
                            <Iconfonts style={styles.gongnengIcon} name='share-alt-square' />
                        </View>
                    </TouchableOpacity>
                </View> */}



                {/* {this.state.isShowCard ? <BackgroundPage
                    backgroundColor={this.state.isShowCard ? '#e4e1e177' : 'transparent'}
                    onPress={() => {
                        this.setState({
                            isShowCard: false
                        });
                    }} /> : null}

                {this.state.isShowCard ? this.getCardView() : null} */}

            </View>
        )
    }
}

const styles = StyleSheet.create({


    searchBar: {
        flexDirection: 'row',
        height: px2dp(40),
        backgroundColor: 'white',
        borderBottomWidth: px2dp(1),
        borderBottomColor: '#f5f5f3',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    footBar: {
        flexDirection: 'row',
        height: px2dp(50),
        backgroundColor: '#fff',
        borderTopWidth: px2dp(1),
        borderTopColor: '#f5f5f3',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: px2dp(20),
    },

    rowvstartend: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: px2dp(8),
    },


    backIconBox: {
        width: px2dp(50),
        height: px2dp(40),
        justifyContent: 'center',
        alignItems: 'center'
    },

    shareIconBox: {
        width: px2dp(40),
        height: px2dp(40),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    backIcon: {
        fontSize: px2dp(18)
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: px2dp(1),
        // borderRadius: px2dp(18),
        borderColor: '#f2f2f2',
        height: px2dp(32),
        width: WIDTH05,
        backgroundColor: '#f4f4f4',
    },
    searchIcon: {
        marginLeft: px2dp(5),
        fontSize: px2dp(12)
    },
    gongneng: {
    },
    gongneng1: {
        position: 'relative',
        width: px2dp(32),
        height: px2dp(50),
        alignItems: 'center',
        justifyContent: 'center'
    },
    gongnengIcon: {
        fontSize: px2dp(20)
    },
    numtag: {
        fontSize: px2dp(10),
        color: '#545454',
        position: 'absolute',
        top: px2dp(5),
        right: 0,

    },
    searchInput: {
        flex: 1,
        color: '#212121',
        height: px2dp(24),
        lineHeight: px2dp(24),
        fontSize: px2dp(14),
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: px2dp(5),
        paddingRight: px2dp(5),
    },
    searchBtn: {
        width: px2dp(50),
        fontSize: px2dp(13),
        textAlign: 'center',
        color: '#3385ff'
    },
    hotWordsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    hotWordBox: {
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20),
        paddingTop: px2dp(2),
        paddingBottom: px2dp(2),
        borderWidth: px2dp(1),
        borderColor: '#bdbdbd',
        margin: px2dp(5)
    },
    hotWord: {
        fontSize: px2dp(12)
    },
    tipsWordBox: {
        borderWidth: 0,
        flexDirection: 'row',
        marginBottom: px2dp(15),
        height: px2dp(38),
        alignItems: 'center'
    },
    tipsWord: {
        fontSize: px2dp(14),
        marginLeft: px2dp(8)
    },


    container: {
        flex: 1,
        backgroundColor: '#fbfbfb',
        padding: 20,
    },


    titleview: {
        // height: 36,
        // marginTop: 5,
        flexDirection: 'row',
        // paddingLeft: 15,
        // paddingRight: 15,
        // paddingTop: 8,
        paddingBottom: 8,
        justifyContent: 'flex-start',
    },
    begintext: {
        fontWeight: 'bold',
        fontSize: 24,
        color: '#000',
        marginTop: 6,
        // paddingLeft: 4,
        // borderLeftWidth:4,
        // borderLeftColor:'#e70012',
    },


    zwview: {

        marginTop: px2dp(15),
        paddingBottom: px2dp(50),

    },


    zwsj: {

    },

    zwtext: {
        flex: 1,
        flexDirection: 'column',
        fontSize: 18,
        marginTop: 10,
        lineHeight: 30,
        color: '#212121',
        textAlign: 'justify',
    },



    onetuvlb: {
        flexDirection: 'column',
        borderLeftWidth: px2dp(3),
        borderLeftColor: '#f85959',
        paddingLeft: px2dp(8),
    },

    wutuvprice1: {
        // marginLeft: 8,
        // textDecorationLine: 'line-through',
        fontSize: 15,
        color: '#262626',
    },


    wutuvprice2: {
        // marginLeft: 8,
        // textDecorationLine: 'line-through',
        fontSize: 13,
        marginTop: 3,
        color: '#9e9e9e',
    },

    wutuvtag1: {
        fontSize: px2dp(14),
        color: '#fff',
        backgroundColor: '#f85959',
        alignSelf: 'flex-start',
        paddingHorizontal: px2dp(10),
        paddingVertical: px2dp(2),
    },

    headimg: {
        height: WIDTH05,
        width: DT_WIDTH,
    },


    videoItem: {
        borderBottomWidth: px2dp(0.5),
        borderBottomColor: 'rgba(0,0,0,0.2)'
    },

    videoTips: {
        flexDirection: 'row',
        height: px2dp(40),
        alignItems: 'center',
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10),
        justifyContent: 'space-between'
    },


    jjview: {
        marginTop: px2dp(15),
        // marginHorizontal: px2dp(15),
        padding: px2dp(10),
        paddingLeft: px2dp(10),
        paddingRight: px2dp(5),
        backgroundColor: "#f5f5f5",
    },

    jjtext: {
        fontSize: 18,
        lineHeight: 30,
        color: '#212121',
        textAlign: 'justify',
    },

    videocontent: {
        width: '100%',
        height: width
    },



})
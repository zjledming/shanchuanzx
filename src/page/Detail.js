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
import BackHandleComponent from '../components/BackHandleComponent';
import WebViewPage from './WebViewPage';
// import ArsVideo from '../components/ArsVideo';
import Videoutil from '../components/Videoutil';
// import VideoPlayScreen from '../components/VideoPlayScreen';
import * as LoginInfo from '../page/Login/LoginInfo';
import ToastUtil from "../utils/ToastUtil";
import NavBar from '../common/NavBar';
import BackgroundPage from '../common/BackgroundPage';
import { getZwByUuid, getBtByUuid, getShoucflag, shouc, getplnum, dojifen } from '../api/news';
import { px2dp, getdthei, isSpace, checkdayu } from '../util/format';
import { zdp, zsp } from "../utils/ScreenUtil";
import Video from 'react-native-af-video-player'; // 视频组件

import SQLite from "../utils/SQLite";
var sqLite = new SQLite();
var db;

const { width, height } = Dimensions.get('window');
var WINDOW_WIDTH = Dimensions.get('window').width;
var DT_WIDTH = WINDOW_WIDTH - 40;
var WIDTH05 = DT_WIDTH * 0.5;

// 计时器
var count = 0;
// var that;

var WeChat = require('react-native-wechat');
export default class Detail extends BackHandleComponent {

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
        // that = this;
        this.params = this.props.navigation.state.params;
        let isLogin = LoginInfo.isLogin();
        let user_ = LoginInfo.getUserInfo();
        WeChat.registerApp('wx86715bab7c585603');
        this.state = {
            zwData: [], // 正文数据
            btData: {}, // 标题数据
            isLogin: isLogin,
            user: user_,
            shoucflag: false,
            huancflag: false,
            plnum: 0,
            pled: false,
            isShowCard: false
        }

    }

    componentWillMount() {

        // ToastUtil.showLoading();

        //开启数据库
        if (!db) {
            db = sqLite.open();
        }


        //删除数据
        // sqLite.deleteData();
        // sqLite.dropTable();

        //建主表
        sqLite.createNewlistTableBefore();
        //建子表
        sqLite.createNewobjTableBefore();

    }

    compennetDidUnmount() {
        //关闭数据库
        sqLite.close();
    }


    componentDidMount() {
        //进入之后直接启动，先不加判断，到了第一次执行的时候加判断
        // // 可以10s后再执行，少于10s不需要有效阅读， 可以每隔5s执行一次
        // timeout = setTimeout(function () {
        //     timer = setInterval(that.myTimer(), 5000);
        // }, 10000)
        this.timer = setTimeout(
            () => {
                // timer = setInterval(that.myTimer(), 5000);
                this.inter = setInterval(
                    () => {
                        this.myTimer();
                    },
                    5000
                );
            },
            10000
        );

        this.initpage();
        this.getBtByUuid(); // 获取标题数据
        this.getZwByUuid(); // 获取正文数据

    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
        this.inter && clearInterval(this.inter);
    }



    /*************************************** 自定义函数 ***************************************/



    myTimer() {
        // ToastUtil.showShort("myTimer");
        let yxflag = false;
        if (this.state.isLogin) {
            // 文章 && 积分时间大于0 
            let jfsc = this.state.btData.remark4;
            // if (this.state.btData.remark3 == '1' && checkdayu(jfsc, '0')) {
            if (checkdayu(jfsc, '0')) { // 只要设置了时长的都可以用来积分吧，类型后来处理
                yxflag = true;
                count = count + 5;
                // ToastUtil.showShort("count:"+count);
                // ToastUtil.showShort(count);
                // 如果是图文，判断是否超过了积分时长，如果超过了，消费定时器，插入积分

                if (checkdayu(count, jfsc)) {
                    // 有效阅读进行积分

                    const res = dojifen(this.state.btData.remark3, this.state.btData.id, this.state.btData.title, jfsc);
                    res.then((newsObj) => {
                        // 成功之后：取消定时器
                        this.timer && clearTimeout(this.timer);
                        this.inter && clearInterval(this.inter);
                        // 返回最新的总积分
                        if (!isSpace(newsObj) && !isSpace(newsObj.zjf)) {
                            LoginInfo.setZjf(newsObj.zjf);
                        } else {
                            LoginInfo.setZjf('0');
                        }

                    }).catch((e) => { // 错误异常处理
                        ToastAndroid.show(e, ToastAndroid.SHORT); // androidToast
                    })
                }

            }
        }

        // 如果不满足积分条件，直接销毁
        if (!yxflag) {
            this.timer && clearTimeout(this.timer);
            this.inter && clearInterval(this.inter);
        }



    }


    // 通过获取sqlit中是否存在该记录，设置缓存状态 - 待做
    gethuancflag() {

        // if (this.state.isLogin) {


        db.transaction((tx) => {
            tx.executeSql("select * from PUBP where uuid = ?", [this.params.uuid], (tx, results) => {
                var len = results.rows.length;
                if (len > 0 && !isSpace(results.rows.item(0)) && !isSpace(results.rows.item(0).id)) {
                    this.setState({ // 设置状态
                        huancflag: true
                    });
                }

            });
        }, (error) => {
            console.log(error);
        });


        // }


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
            this.getShoucflag();
            this.getplnum();
        }).catch((e) => { // 错误异常处理
            ToastAndroid.show(e, ToastAndroid.SHORT); // androidToast
        })
    }


    // 获取正文数据
    getZwByUuid() {

        const res = getZwByUuid(this.params.uuid); // api接口
        res.then((newsArr) => {
            this.setState({ // 设置状态
                zwData: newsArr
            });
            console.log(newsArr);
        }).catch((e) => { // 错误异常处理
            ToastAndroid.show(e, ToastAndroid.SHORT); // androidToast
        })
    }


    getVideoUrl(video_url) {
        console.log('cdss:' + video_url);
        // video_url = 'https://www.w3schools.com/html/movie.mp4';
        // video_url = 'http://v11-tt.ixigua.com/d7f789e5dc3a96a679ec8657798e4ac9/5b90133d/video/m/2200bb1e35499154a66addca056d1eebe77115b588300000091f3639240/';
        // video_url = 'http://v7.pstatp.com/9a95e753ea75b7ab5cd76be0b98ffc35/5b9097eb/video/m/220f75f56927e084c90a3242ff7fad3812a115b4b8700003527b1ed079f/';

        // video_url = require('../../../assets/video.mp4');
        return video_url;
    }

    initpage() {
        if (this.state.isLogin) {
            this.getShoucflag();
            this.getplnum();

        }
        this.gethuancflag();

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
            let url_ = "app/jsp/shanc/pledit.jsp?plr_id=" + this.state.user.phone + "&remark1=" + this.state.user.ssqy + "&plr_name=" + this.state.user.realname + "&sl_id=" + this.state.btData.id + "&sl_title=" + this.state.btData.title;
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
            const res = shouc(this.state.user.phone, this.state.user.realname, this.state.btData.id, this.state.btData.title, this.state.shoucflag, this.state.user.ssqy); // api接口 
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


    huanc() {
        // 先判断登录 
        // if (this.state.isLogin) {

        // 已经缓存过的，再次点击缓存无效
        if (this.state.huancflag == true) {
            return;
        }
        // 正在缓存中
        ToastUtil.showLoading('缓存中');

        var uuid = this.params.uuid;


        // 防止插入重复，先删除，再新增
        sqLite.deleteDataBy('PUBP', 'uuid', uuid);
        sqLite.deleteDataBy('PUBS', 'uuid', uuid);

        // 1.将文本保存到本地sqlit
        //  列表
        //开启数据库  
        if (!db) {
            db = sqLite.open();
        }
        var obj = this.state.btData;

        db.transaction((tx) => {
            let sql = "INSERT INTO PUBP(id,uuid,fbr,fbsj,headpic,hwbl,jianjie,ljdz,remark2,remark3,remark4,remark5,remark6, title)" +
                "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            tx.executeSql(sql, [obj.id, uuid, obj.fbr, obj.fbsj, obj.headpic, obj.hwbl, obj.jianjie, obj.ljdz, obj.remark2, obj.remark3, obj.remark4, obj.remark5, obj.remark6, obj.title], () => {
            }, (err) => {
                console.log(err);
            }
            );
            // 关闭加载提示，显示成功标识
            // ToastUtil.hideLoading();
            // ToastUtil.showShort('缓存成功');
        }, (error) => {
            console.log(error);
            // ToastUtil.hideLoading();
            // ToastUtil.showShort('缓存失败，请稍候再试');
        }, () => {
            console.log('success');
        });

        // 正文 -- huancflag处理
        let zwData = this.state.zwData;
        let len = zwData.length;

        db.transaction((tx) => {
            for (let i = 0; i < len; i++) {
                var tempobj = zwData[i];
                let sql = "INSERT INTO PUBS(id,fileextend,heigth,hwbl,pxh,spxh,treenodeid,treenodename,type,uuid,width,xpxh,zwnr,remark1,remark2,remark3,remark4,remark5,remark6)" +
                    "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                tx.executeSql(sql, [tempobj.id, tempobj.fileextend, tempobj.heigth, tempobj.hwbl, tempobj.pxh, tempobj.spxh, tempobj.treenodeid, tempobj.treenodename, tempobj.type, tempobj.uuid, tempobj.width, tempobj.xpxh, tempobj.zwnr, tempobj.remark1, tempobj.remark2, tempobj.remark3, tempobj.remark4, tempobj.remark5, tempobj.remark6], () => {
                }, (err) => {
                    console.log(err);
                }
                );
            }
            // 回写状态
            this.setState({ // 设置状态
                huancflag: true
            });
            // 关闭加载提示，显示成功标识
            ToastUtil.hideLoading();
            ToastUtil.showShort('缓存成功');
        }, (error) => {
            console.log(error);
            ToastUtil.hideLoading();
            ToastUtil.showShort('缓存失败，请稍候再试');
        }, () => {
            console.log('success');
        });
        // } else { 
        //     this.props.navigation.navigate('LoginIndex',
        //         {
        //             // info: info,
        //             callback: ((info) => { //回调函数
        //                 // 回调了就是登录成功了
        //                 this.setState({
        //                     isLogin: true,
        //                     user: info,
        //                 });
        //                 this.initpage();
        //             })
        //         }

        //     );

        // }

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
                <NavBar
                    title="详情"
                    leftIcon="md-arrow-back"
                    leftPress={this.back.bind(this)}
                />
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


                    <View style={styles.titleview}>
                        <Text style={styles.begintext}>{this.state.btData.title}</Text>
                    </View>


                    <View style={styles.rowvstartend}>

                        <View style={styles.onetuvlb}>
                            <Text style={styles.wutuvprice1} numberOfLines={1}>{this.state.btData.fbr}</Text>
                            <Text style={styles.wutuvprice2} numberOfLines={1}>{this.state.btData.fbsj}</Text>
                        </View>
                        {
                            !isSpace(this.state.btData.remark2) ?
                                <View style={styles.onetuvlb1}>
                                    <Text style={styles.wutuvtag1} numberOfLines={1}>{this.state.btData.remark2}</Text>
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
                    }

                    <View style={styles.zwview}>

                        {/* <Videoutil /> */}




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
                                                title={this.state.btData.title}
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
                                                title={this.state.btData.title}
                                                logo={this.state.btData.headpic}
                                                placeholder={this.state.btData.headpic}
                                                // rotateToFullScreen
                                                hideFullScreenControl={true}
                                            />


                                            {/* <Videoutil /> */}

                                            {/* <VideoPlayScreen/> */}


                                            {/* <TouchableOpacity activeOpacity={0.8} style={styles.videoTips}>

                                            </TouchableOpacity> */}
                                        </View>
                                    )
                                }

                            })
                        }

                    </View>

                </ScrollView>


                <View style={styles.footBar}>

                    {/* 搜索框 */}
                    <TouchableOpacity onPress={this.pingl.bind(this)} >
                        <View style={styles.searchBox}>
                            <Icons style={styles.searchIcon} name='pencil' />
                            <Text style={styles.searchInput}>说点什么...</Text>
                        </View>
                    </TouchableOpacity>
                    {/* 功能区：评论bubble 收藏 缓存 分享 */}
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
                    <TouchableOpacity onPress={this.huanc.bind(this)} >
                        <View style={styles.gongneng}>
                            {
                                !isSpace(this.state.huancflag) ?
                                    <Icon style={{ fontSize: px2dp(22) }} name='archive' color="#e70012" /> :
                                    <Icon style={{ fontSize: px2dp(22) }} name='archive' />
                            }

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.fenxiang.bind(this)} >
                        <View style={styles.gongneng}>
                            <Iconfonts style={styles.gongnengIcon} name='share-alt-square' />
                        </View>
                    </TouchableOpacity>
                    {/* <Text onPress={this.searchWords.bind(this, this.state.text)} style={styles.searchBtn}>搜索</Text> */}
                </View>



                {this.state.isShowCard ? <BackgroundPage
                    backgroundColor={this.state.isShowCard ? '#e4e1e177' : 'transparent'}
                    onPress={() => {
                        this.setState({
                            isShowCard: false
                        });
                    }} /> : null}

                {this.state.isShowCard ? this.getCardView() : null}

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

    // wutuvtag1: {
    //     fontSize: 16,
    //     color: '#fff',
    //     backgroundColor: '#f85959',
    //     alignSelf: 'flex-start',
    //     paddingBottom: 5,
    //     paddingLeft: 10,
    //     paddingRight: 10,
    //     paddingTop: 5,
    //     borderRadius: 5,
    // },


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
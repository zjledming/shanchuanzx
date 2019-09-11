'use strict';

import React, { Component } from 'react'
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    StatusBar,
    Dimensions, BackHandler, ImageBackground, TouchableOpacity, Image, ProgressBarAndroid,
} from 'react-native'
import NavBar from '../../common/NavBar'
import Item from '../../common/Item'
import * as LoginInfo from '../Login/LoginInfo';
import px2dp from '../../utils/px2dp';
import Icon from 'react-native-vector-icons/Ionicons';
import { getDrjf, getZjf } from '../../api/news';
import ToastUtil from "../../utils/ToastUtil";
import { isSpace, deling } from '../../util/format';

const { width } = Dimensions.get('window');

var imgbgwid = width - 30;
var imgbghei = imgbgwid * 0.38;
var width042 = imgbgwid * 0.32;


var user = {};
//FontAwesome
export default class Xxjf extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props)
        user = LoginInfo.getUserInfo();

        this.state = {
            zjf: '0',
            drjf: '0',
            drjfobj: {},
        }
    }


    gotoxuexi() {
        this.props.navigation.navigate('Home');
    }


    getDrjf() {
        if (LoginInfo.isLogin()) {
            const res = getDrjf(LoginInfo.getUsername()); // api接口
            res.then((newsObj) => {
                this.setState({ // 设置状态
                    drjf: newsObj.drjf,
                    drjfobj: newsObj
                });
            }).catch((e) => { // 错误异常处理
                ToastUtil.showShort(e);
            })
        }


    }



    componentDidMount() {
        // 获取当日积分 
        this.setState({
            zjf: LoginInfo.getZjf()
        })
        this.getDrjf();
    }


    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }

    onBackAndroid = () => {
        this.props.navigation.goBack();
        return true;
    };



    back() {
        this.props.navigation.pop();
    }



    getZjf() {
        // if (LoginInfo.isLogin()) {
        const res = getZjf(LoginInfo.getUsername()); // api接口
        res.then((newsObj) => {

            this.setState({ // 设置状态
                zjf: newsObj.zjf
            });
            LoginInfo.setZjf(newsObj.zjf);
        }).catch((e) => { // 错误异常处理
            ToastAndroid.show(e, ToastAndroid.SHORT); // androidToast
        })
        // }


    }


    duihuan() {

        let url_ = "app/jsp/shanc/jfsc.jsp?appu_id=" + user.username + '&appu_jf=' + this.state.zjf + '&appu_name=' + user.realname;
        this.props.navigation.navigate('WebScreen', {
            url: url_,
            name: "积分商城",
            // info: info,
            callback: ((info) => { //回调函数
                // 回调重新加载总积分
                this.getZjf();
            })
        });
    }


    jfsm() {
        var obj = {
            url: "app/jsp/shanc/jfsm.jsp",
            name: "积分说明",
        };
        this.props.navigation.navigate('WebScreen', obj);
    }

    logout() {
        LoginInfo.loginOut();
        //this.props.navigation.navigate('LoginIndex');
        if (this.props.navigation.state.params.callback) {
            this.props.navigation.state.params.callback({});
            this.props.navigation.goBack();
        }

    }

    jfxq(){
        var obj = {
            url: "app/jsp/shanc/jfxq.jsp?appu_id=" + user.username ,
            name: "积分详情",
        };
        this.props.navigation.navigate('WebScreen', obj);
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#f3f3f3" }}>
                {/* <View style={styles.sBar} backgroundColor={'#1E82D2'}/> */}
                <NavBar
                    title="学习积分"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                    rightIcon="md-reorder"
                    rightPress={this.jfxq.bind(this)}
                />

                <View style={styles.viewrow}>
                    <ImageBackground source={require('../../img/hongsebj.png')} style={styles.imgbg}>
                        {/* <Text style={styles.textlit}>我的积分</Text> */}
                        <Text style={styles.textbig}>{this.state.zjf}</Text>
                        <TouchableOpacity onPress={this.duihuan.bind(this)} >
                            <Text style={styles.textbut}>兑换</Text>
                        </TouchableOpacity>
                        <Text onPress={this.jfsm.bind(this)} style={styles.rigthtag}>积分说明 <Icon name="ios-arrow-forward" size={px2dp(14)} color="#fff" /></Text>
                    </ImageBackground>
                </View>

                <ScrollView style={styles.container}>



                    <View style={{ padding: px2dp(20), backgroundColor: '#fff' }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: px2dp(15), }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Image source={require('../../img/yj.png')} style={{ width: px2dp(4), height: px2dp(14) }}>
                                </Image>
                                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: px2dp(18), marginLeft: px2dp(5) }}>积分规则</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Text style={{ color: '#626365', fontSize: px2dp(15) }}>今日已累积</Text>
                                <Text style={{ color: '#e70012', fontSize: px2dp(20), fontWeight: 'bold', paddingHorizontal: px2dp(4) }}>{this.state.drjf}</Text>
                                <Text style={{ color: '#e70012', fontSize: px2dp(15) }}>积分</Text>
                            </View>
                        </View>



                        <View style={styles.lrbox}>
                            <View style={styles.lbox}>

                                <Text style={styles.text16heis}>登录</Text>
                                <Text style={styles.text13huis}>1分/每日首次登录</Text>
                                <View style={styles.lrbox2}>
                                    {/* {
                                        isSpace(this.state.drjfobj.type1)
                                    } */}
                                    <ProgressBarAndroid color="red" styleAttr='Horizontal' progress={1}
                                        indeterminate={false} style={{ marginRight: px2dp(8) }} />
                                    <Text style={styles.text13huismarl}> 已获{deling(this.state.drjfobj.type1)}分/上限1分</Text>
                                </View>

                            </View>
                            <View style={styles.rbox}>
                                <Text style={styles.text14buthuis}>已完成</Text>
                            </View>
                        </View>

                        <View style={styles.lrbox}>
                            <View style={styles.lbox}>

                                <Text style={styles.text16heis}>阅读文章</Text>
                                <Text style={styles.text13huis}>1分/每有效阅读一篇文章</Text>
                                <View style={styles.lrbox2}>
                                    {/* <ProgressBarAndroid color="red" styleAttr='Horizontal' progress={0.6}
                                    indeterminate={false} /> */}
                                    <Text style={styles.text13huismarl}> 已获{deling(this.state.drjfobj.type2)}分/上限*分</Text>
                                </View>

                            </View>
                            <TouchableOpacity onPress={this.gotoxuexi.bind(this)} ><View style={styles.rbox}>
                                <Text style={styles.text14buhuangs}>去看看</Text>
                            </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.lrbox}>
                            <View style={styles.lbox}>

                                <Text style={styles.text16heis}>视听学习</Text>
                                <Text style={styles.text13huis}>2分/每有效收听一个音频或观看一个视频</Text>
                                <View style={styles.lrbox2}>
                                    {/* <ProgressBarAndroid color="red" styleAttr='Horizontal' progress={0.6}
                                    indeterminate={false} /> */}
                                    <Text style={styles.text13huismarl}> 已获{deling(this.state.drjfobj.type3)}分/上限*分</Text>
                                </View>

                            </View>
                            <TouchableOpacity onPress={this.gotoxuexi.bind(this)} ><View style={styles.rbox}>
                                <Text style={styles.text14buhuangs}>去看看</Text>
                            </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.lrbox}>
                            <View style={styles.lbox}>

                                <Text style={styles.text16heis}>分享</Text>
                                <Text style={styles.text13huis}>1分/每有效分享</Text>
                                <View style={styles.lrbox2}>
                                    {/* <ProgressBarAndroid color="red" styleAttr='Horizontal' progress={0.6}
                                    indeterminate={false} /> */}
                                    <Text style={styles.text13huismarl}> 已获{deling(this.state.drjfobj.type4)}分/上限*分</Text>
                                </View>

                            </View>
                            <TouchableOpacity onPress={this.gotoxuexi.bind(this)} ><View style={styles.rbox}>
                                <Text style={styles.text14buhuangs}>去看看</Text>
                            </View>
                            </TouchableOpacity>
                        </View>


                        <View style={styles.lrbox}>
                            <View style={styles.lbox}>

                                <Text style={styles.text16heis}>发表观点</Text>
                                <Text style={styles.text13huis}>1分/每发表有效观点</Text>
                                <View style={styles.lrbox2}>
                                    {/* <ProgressBarAndroid color="red" styleAttr='Horizontal' progress={0.6}
                                    indeterminate={false} /> */}
                                    <Text style={styles.text13huismarl}> 已获{deling(this.state.drjfobj.type5)}分/上限*分</Text>
                                </View>

                            </View>
                            <TouchableOpacity onPress={this.gotoxuexi.bind(this)} ><View style={styles.rbox}>
                                <Text style={styles.text14buhuangs}>去看看</Text>
                            </View>
                            </TouchableOpacity>
                        </View>


                        <View style={styles.lrbox}>
                            <View style={styles.lbox}>

                                <Text style={styles.text16heis}>文章学习时长</Text>
                                <Text style={styles.text13huis}>5分/累计20分钟</Text>
                                <View style={styles.lrbox2}>
                                    {/* <ProgressBarAndroid color="red" styleAttr='Horizontal' progress={0.6}
                                    indeterminate={false} /> */}
                                    <Text style={styles.text13huismarl}> 已获{deling(this.state.drjfobj.type6)}分/上限*分</Text>
                                </View>

                            </View>
                            <TouchableOpacity onPress={this.gotoxuexi.bind(this)} ><View style={styles.rbox}>
                                <Text style={styles.text14buhuangs}>去看看</Text>
                            </View>
                            </TouchableOpacity>
                        </View>


                        <View style={styles.lrbox}>
                            <View style={styles.lbox}>

                                <Text style={styles.text16heis}>视听学习时长</Text>
                                <Text style={styles.text13huis}>5分/累计30分钟</Text>
                                <View style={styles.lrbox2}>
                                    {/* <ProgressBarAndroid color="red" styleAttr='Horizontal' progress={0.6}
                                    indeterminate={false} /> */}
                                    <Text style={styles.text13huismarl}> 已获{deling(this.state.drjfobj.type7)}分/上限*分</Text>
                                </View>

                            </View>
                            <TouchableOpacity onPress={this.gotoxuexi.bind(this)} ><View style={styles.rbox}>
                                <Text style={styles.text14buhuangs}>去看看</Text>
                            </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.lrbox}>
                            <View style={styles.lbox}>

                                <Text style={styles.text16heis}>收藏</Text>
                                <Text style={styles.text13huis}>1分/收藏</Text>
                                <View style={styles.lrbox2}>
                                    {/* <ProgressBarAndroid color="red" styleAttr='Horizontal' progress={0.6}
                                    indeterminate={false} /> */}
                                    <Text style={styles.text13huismarl}> 已获{deling(this.state.drjfobj.type8)}分/上限*分</Text>
                                </View>

                            </View>
                            <TouchableOpacity onPress={this.gotoxuexi.bind(this)} ><View style={styles.rbox}>
                                <Text style={styles.text14buhuangs}>去看看</Text>
                            </View>
                            </TouchableOpacity>
                        </View>

                    </View>

                </ScrollView>

            </View>
        )
    }
}
const styles = StyleSheet.create({


    viewrow: {
        justifyContent: 'center',
    },


    imgbg: {
        height: width042,
        width: width,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    textlit: {
        color: '#fff',
        fontSize: px2dp(18),
    },

    textbig: {
        color: '#fff',
        fontSize: px2dp(38),
        // fontWeight:'bold',
    }


    ,

    textbut: {
        color: '#e70012',
        fontSize: px2dp(14),
        backgroundColor: '#f5f5f5',
        paddingVertical: px2dp(4),
        width: px2dp(70),
        borderRadius: px2dp(4),
        textAlign: 'center',
        opacity: 0.9,
        marginTop: px2dp(6)

    }


    , rigthtag: {
        color: '#fff', fontSize: px2dp(14),
        backgroundColor: '#ffbc0f', opacity: 0.9,
        borderBottomLeftRadius: px2dp(15), borderTopLeftRadius: px2dp(15),
        paddingRight: px2dp(4),
        paddingLeft: px2dp(9),
        paddingVertical: px2dp(3),
        position: 'absolute',
        right: 0,
        top: px2dp(8),
    },


    lrbox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: px2dp(1), borderColor: '#f5f5f5', paddingVertical: px2dp(8) },
    lbox: { flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' },
    text16heis: { color: '#000', fontSize: px2dp(16), fontWeight: 'bold' },
    text13huis: { color: '#626365', fontSize: px2dp(13), marginTop: px2dp(3) },
    lrbox2: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: px2dp(4) },
    text13huismarl: { color: '#626365', fontSize: px2dp(13), }, // marginLeft: px2dp(8)
    rbox: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    text14buthuis: { color: '#626365', fontSize: px2dp(14), backgroundColor: '#f2f3f5', paddingHorizontal: px2dp(13), paddingVertical: px2dp(5) },
    text14buhuangs: { color: '#a6967d', fontSize: px2dp(14), backgroundColor: '#fcf8ed', paddingHorizontal: px2dp(13), paddingVertical: px2dp(5) },

});

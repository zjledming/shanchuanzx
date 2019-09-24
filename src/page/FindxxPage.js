'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    RefreshControl,
    FlatList,
    Alert,
    TouchableHighlight,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Dimensions,
    Image, ScrollView, TextInput,
    ToastAndroid, ActivityIndicator, StatusBar, ImageBackground
} from 'react-native';
import Swiper from 'react-native-swiper';//轮播图组件 
import BackToTop from '../components/BackToTop'; // 顶部返回组件 
import WebViewPage from './WebViewPage'; // webView组件
import mstyles from '../utils/mstyles';
import LoadingView from '../utils/LoadingView';
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationActions, ResourceSavingSceneView, StackActions, SwitchActions } from 'react-navigation';


import { getNewsByChannel, getchannelInfo } from '../api/news';

import { getBanners } from '../api/news';
import { px2dp, isSpace } from '../util/format';

import * as LoginInfo from './Login/LoginInfo';
import ToastUtil from '../utils/ToastUtil';

import EZSideMenu from 'react-native-ezsidemenu';



var WINDOW_WIDTH = Dimensions.get('window').width;

var keyword = '';
var f_flag = true;
export default class FindxxPage extends Component {
    static navigationOptions = {
        tabBarLabel: '学习',
        tabBarIcon: ({ focused }) => {
            if (focused) {
                return (
                    <Image style={mstyles.img19} source={require('../img/xx_sel.png')} />
                );
            }
            return (
                <Image style={mstyles.img19} source={require('../img/xx_nor.png')} />
            );
        },
    };

    // 构造函数
    constructor(props) {
        super(props);
        this.state = { // 状态
            isRefreshing: false,//下拉控制 是否为最新
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            newsData: [], // 新闻数据
            bannerData: [], // banner数据
            isShowLoading: true,

        };
    }


    componentWillMount() {

    }

    // 组件挂载
    componentDidMount() {
        this.getBanners(); // 获取banner数据
        // this.fetchNewsData('componentDidMount', 0, 10);

        this._navListener = this.props.navigation.addListener('didFocus', () => {
            // ToastUtil.showShort('didFocus' + f_flag);
            // 先判断是否登录了
            if (LoginInfo.isLogin()) {
                // 隐藏弹出框
                this.refs.menuxx.close();
                this.setState({
                    zjf: LoginInfo.getZjf()
                })
            } else {
                // 然后弹出登录提示
                this.refs.menuxx.open();
                this.setState({
                    zjf: '0'
                });
            }
        });

        
        this._blurListener = this.props.navigation.addListener('didBlur', () => {
              // 隐藏弹出框
              if(this.refs.menuxx.state.isOpen == true){
                this.refs.menuxx.close();
              }
             
        });

    }


    componentWillUnmount() {
        this._navListener.remove();
        this._blurListener.remove();
        
    }



    // ---------------------------------------------- 自定义函数 ---------------------------------------------- //


    // 字符输入状态改变的回调
    inputChangeHandle(text) {
        // this.setState({
        //     text: text
        // }, () => {
        //     this.getTipsWords(text);
        // })
        keyword = text;
    }

    subinput() {
        this.getBanners();
    }



    // 获取banner数据
    getBanners() {

        // 加载之前显示
        this.setState({
            isShowLoading: true,
        });

        const res = getchannelInfo(keyword); // api接口
        res.then((newsArr) => {
            this.setState({ // 设置状态
                bannerData: newsArr,
                isShowLoading: false,
                isRefreshing: false,
            });
        }).catch((e) => { // 错误异常处理
            ToastAndroid.show(e, ToastAndroid.SHORT); // androidToast
        })
    }



    // 搜索
    navToSearch() {

    }

    // 跳转到新闻详情页面
    chooseNews(url) {
        console.log('url:' + url);

    }



    // 获取新闻数据
    fetchNewsData(flag, start, end) {

        // loadMore  refreshHandle  getBytype componentDidMount
        // loadMore 加载更多 下拉刷新的时候，需要获取当前的分类id
        // if (flag == 'loadMore' || flag == 'refreshHandle') {
        //     channelId = this.state.channelId;
        // }
        if (flag == 'getBytype') {

            // 加载之前显示
            this.setState({
                isShowLoading: true,
            });
        }
        const res = getNewsByChannel(3, '', '2', start, end); // api接口
        res.then((newsArr) => {
            let foot = 0; // 默认隐藏：如果请求到数据了，就无法保证下次请求是否还有数据，就需要先隐藏
            // 如果这次请求没有获取到数据，说明没有数据了
            if (newsArr.length == 0) {
                // 有个情况，一进来就会显示加载所有数据，这里加个判断，只有当当前页面有值，但是这次请求没有加载到值得时候才显示加载了所有数据
                if (this.state.newsData && this.state.newsData.length > 0) {
                    foot = 1;//listView底部显示没有更多数据了
                } else {
                    foot = 0;//一直就没值的话，直接隐藏吧
                }
            }
            this.setState({
                // 获取数据成功
                showFoot: foot,
                isRefreshing: false,
                isShowLoading: false,
            });

            // 这里加个判断：只有是加载更多的时候才是拼接，否则的话就是重置内容
            if (start == 0) {
                this.setState({ // 设置状态
                    newsData: newsArr
                });

            } else {
                let temArr = this.state.newsData.slice(); // 返回切片数据
                temArr.push(...newsArr);
                this.setState({ // 设置状态
                    newsData: temArr
                });
            }
        }).catch((e) => { // 错误异常处理
            ToastAndroid.show(e, ToastAndroid.SHORT); // androidToast
        })
    }

    // 加载更多数据
    loadMore() {

        //如果是正在加载中或没有更多数据了，则返回 ; 如果foot是隐藏状态，则可以执行加载更多；那两个状态，一个是正在加载不需要；另一个是没有更多数据了，这个时候应该下拉刷新才对
        if (this.state.showFoot != 0) {
            return;
        }

        // 如果数据列表没有数据，直接返回；证明一开始就没有数据，这个时候应该下拉刷新
        if (this.state.newsData.length <= 0) {
            return;
        }

        // 执行正式接口调用之前，底部显示正在加载更多数据
        this.setState({ showFoot: 2 });

        // 获取接口数据
        // let start = (this.state.newsData.length + 2); // 起始值
        // let end = (this.state.newsData.length + 12); // 结束值
        let start = this.state.newsData.length; // 起始值
        this.fetchNewsData('loadMore', 3, start, 10);

    }

    // 刷新头部
    refreshHandle() {
        this.setState({
            newsData: [],
            isRefreshing: true,//tag,下拉刷新中，加载完全，就设置成flase
            showFoot: 0,
        }, () => {
            // this.fetchNewsData('refreshHandle', 0, 10);
            this.getBanners();
        });
    }

    // 返回顶部
    backToTop() {
        this.refs.newsList.scrollToOffset({ x: 0, y: 0, animated: true });
    }
    getBytype(itemid) {

        this.setState({ // 设置状态
            channelId: itemid,
        });
        this.fetchNewsData('getBytype', itemid, 0, 10);
    }




    _goDetail(banneritems_) {
        this.props.navigation.navigate('Detailkhal', { uuid: banneritems_.remark1 });
    }


    gosonpage(flag, flagname) {

        // this.props.navigation.navigate('FindxxSonPage', { flag: flag, flagname: flagname });

                this.props.navigation.navigate('FindxxSonPage', {
                    flag: flag,
                    flagname:flagname,
                    // info: info,
                    callback: ((info) => { //回调函数
                        // 回调了
                        //that.fetchNewsData(0, 10);
                        this.refs.menuxx.close();
                    })
                });


        
    }

    _godenglu() {
        this.props.navigation.navigate('LoginIndex',
        {
            // info: info,
            callback: ((info) => { //回调函数
                // this.setState({
                //     isLogin: false,
                //     user: {},
                // })
            })
        });
    }

    gojf() {
        // 判断登录
        if (LoginInfo.isLogin()) {
            this.props.navigation.navigate('Xxjf');
        } else {
            this.props.navigation.navigate('LoginIndex',
                {
                    // info: info,
                    callback: ((info) => { //回调函数
                        //isLogin = true; // 摸索的结论：如果是页面标志位用全局变量，如果需要渲染必须用state
                        this.setState({
                            zjf: info.zjf
                        })

                    })
                }

            );
        }
    }




    // ---------------------------------------------- 渲染函数 ---------------------------------------------- //

    _renderFooter = () => { //底部加载(一个圆圈)


        if (this.state.showFoot === 1) {
            return (
                <View style={mstyles.loadhuis}>
                    <Text style={{ fontSize: 14, }}>
                        已加载所有数据
                        </Text>
                </View>
            );
        } else if (this.state.showFoot === 2) {
            return (
                <View style={mstyles.loadhuis}>
                    <ActivityIndicator
                        style={styles.indicator}
                        size={'small'}
                        color={'#9fa4a8'}
                        animating={true}
                    />
                    <Text style={{ fontSize: 14, }}>
                        加载中 …
                        </Text>
                </View>
            );
        } else if (this.state.showFoot === 0) {
            return (
                <View>
                    <Text></Text>
                </View>
            );
        }


    };

    renderItem(rowData, index) {

        var picitems_ = rowData.picitems;
        var datuurl = "";
        if (picitems_ && picitems_.length > 0) {
            datuurl = picitems_[0];
        }



        return (
            <TouchableWithoutFeedback onPress={this._goDetail.bind(this, rowData)} >
                <View style={[mstyles.viewrowb, mstyles.backbais, mstyles.borderrs10, mstyles.padding10, mstyles.margin10zy, mstyles.paddingbot12, mstyles.margintop13]}>



                    <View style={[mstyles.w120sy]}>
                        <Text style={mstyles.text16heis} numberOfLines={1}>{rowData.title}</Text>
                        <Text style={[mstyles.text14huis, mstyles.margintop7, mstyles.lineh18]} numberOfLines={3}>{rowData.jianjie}</Text>
                        <View style={[mstyles.viewrs, mstyles.margintop7]}>
                            <Text style={mstyles.text12huis} numberOfLines={1}>{rowData.fbr}</Text><Text style={[mstyles.text12huis, mstyles.paddingleft8]} numberOfLines={1}>{rowData.fbsj}</Text>
                        </View>
                    </View>
                    <View>
                        <Image style={[mstyles.img120, mstyles.textbdrd5]} source={{ uri: datuurl }}></Image>
                    </View>
                    {/* {
                        !isSpace(datuurl) ?
                            <View> <Image style={[mstyles.img120, mstyles.borderrs10]} source={{ uri: datuurl }}></Image> </View> :
                            null
                    } */}


                </View>
            </TouchableWithoutFeedback>

        );

    }


    renderbanner(banneritems_, idx) {

        var picurl_ = '';
        if (banneritems_.picitems.length > 0) {
            picurl_ = banneritems_.picitems[0];
        }

        return (

            <TouchableWithoutFeedback key={'TouchableWithoutFeedback_' + banneritems_.id} onPress={this._goDetail.bind(this, banneritems_)}>
                <View style={[mstyles.viewcenter, mstyles.imgdt140, mstyles.margin10zy, mstyles.borderrs10c, mstyles.pore]}>
                    <Image key={1} style={[mstyles.imgdt140, mstyles.borderrs10c]} source={{ uri: picurl_ }}  ></Image>
                    <Text style={[mstyles.text16bais, mstyles.textzs]} numberOfLines={1}>{banneritems_.title}</Text>
                </View>
            </TouchableWithoutFeedback >

        );

    }




    renderSwiper() {


        var banneritems = [];
        var banneritems_ = this.state.bannerData;
        if (banneritems_.length > 0) {

            for (var i = 0; i < banneritems_.length; i++) {
                banneritems.push(this.renderbanner(banneritems_[i], i + 1));
            }
            return (
                <View>
                    <Swiper key={'Swiper_key'} style={mstyles.h140}
                        // height={head_heigth + 60}
                        // dot={<View style={{ backgroundColor: '#B0B0B0', width: 8, height: 8, borderRadius: 4, margin: 3 }} />}
                        // activeDot={<View style={{ backgroundColor: '#fff', width: 8, height: 8, borderRadius: 4, margin: 3 }} />}
                        // paginationStyle={{ bottom: 70, }} 
                        paginationStyle={styles.paginationStyle1}
                        dotStyle={styles.dotStyle1}
                        activeDotStyle={styles.activeDotStyle1}
                        autoplay >
                        {banneritems}
                    </Swiper>


                </View>
            )

        } else {

            return (
                <View></View>
            )

        }

    }

    menuxx() {

        return (

            <ImageBackground source={require('../img/dlbj.png')} style={{ width: WINDOW_WIDTH * 0.7, height: WINDOW_WIDTH * 0.7 * 1.58, marginTop: px2dp(100), marginLeft: WINDOW_WIDTH * 0.3 * 0.5 }}>
                <View style={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }} >

                    <Text style={{ marginTop: px2dp(150), color: '#333333', fontSize: px2dp(20), fontWeight: 'bold' }}>您还未登录</Text>

                    <Text style={{ color: '#999999', fontSize: px2dp(16), marginTop: px2dp(3) }}>请登录后再执行操作</Text>

                    <TouchableWithoutFeedback onPress={this._godenglu.bind(this)}>
                        <ImageBackground source={require('../img/dlal.png')} style={{
                            width: WINDOW_WIDTH * 0.5, height: WINDOW_WIDTH * 0.5 * 0.21, marginTop: px2dp(60), justifyContent: 'center',
                            alignItems: 'center',
                        }} >
                            <Text onPress={this._godenglu.bind(this)} style={{ color: '#fff', fontSize: px2dp(16) }}>立即登录</Text>
                        </ImageBackground>
                    </TouchableWithoutFeedback>

                    <Text style={{ color: '#ff8763', fontSize: px2dp(13), marginTop: px2dp(5) }}>没有账号请联系管理员！</Text>

                </View>

            </ImageBackground>

        );
       
    }



    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>

                <StatusBar
                    translucent={false}
                    animated={false}
                    backgroundColor={"#d33d3c"}
                    barStyle={"light-content"}
                />

                <EZSideMenu
                    menu={this.menuxx()}
                    ref="menuxx"
                    type={EZSideMenu.type.Overlay}
                    direction={EZSideMenu.direction.Right}
                    panGestureEnabled={false}
                    width={WINDOW_WIDTH}
                    onMenuStateChaned={(isOpen) => {
                        // this.setState({ isOpen }) 
                    }}
                >

                    <View style={[mstyles.viewrowb, mstyles.padding8sx, mstyles.padding8zy, mstyles.backhongs]}>
                        <Image style={mstyles.imglog} source={require('../img/logo-bs.png')} >
                        </Image>
                        <TouchableOpacity activeOpacity={0.9} >
                            <View style={[mstyles.viewrbegin, mstyles.width200, mstyles.height24, mstyles.backhuis, mstyles.textbdrd5]}>
                                {/* onPress={this.navToSearch.bind(this)} */}
                                <Icon name="ios-search" size={px2dp(16)} style={[mstyles.marginleft8, mstyles.marginright3]} />
                                {/* <Text style={mstyles.fontsize12}>关键字搜索 ...</Text> */}
                                <TextInput
                                    style={{ height: px2dp(45), fontSize: px2dp(12), width: '90%' }}
                                    onChangeText={this.inputChangeHandle.bind(this)}
                                    onSubmitEditing={this.subinput.bind(this)}
                                    placeholder="关键字搜索 ..."
                                    placeholderTextColor="#9e9e9e"
                                    underlineColorAndroid="transparent"
                                    selectionColor="#3385ff"
                                />
                            </View>
                        </TouchableOpacity>
                        {/*  style={{ flexDirection: 'row', marginHorizontal: px2dp(3) }} */}
                        <TouchableOpacity activeOpacity={0.9} onPress={this.gojf.bind(this)}>
                            <View style={[mstyles.viewc, mstyles.wh30, mstyles.textbd2huangs, mstyles.textbdrd30]}>
                                <Text style={[mstyles.text12bais, mstyles.lineh12, mstyles.marginbotf2]}>{this.state.zjf}</Text>
                                <Text style={[mstyles.text8bais, mstyles.lineh8, mstyles.marginbotf4]}>积分</Text>
                            </View>
                        </TouchableOpacity>
                        {/* <Image   source={require('../../img/wo-bs.png')} > 
                    </Image> */}
                    </View>

                    <ImageBackground source={require('../img/hongsebj.png')} style={[mstyles.imgdt0]}>
                        <View style={[mstyles.viewrowb, mstyles.padding15, mstyles.margintop7]} >

                            {
                                this.state.bannerData.map((item, index) => {
                                    if (item.remark3 == '1') {
                                        return (
                                            <TouchableOpacity key={item.id} onPress={this.gosonpage.bind(this, item.id, item.flmc)}>
                                                <View style={[mstyles.viewc, mstyles.w80]}>
                                                    <Image style={mstyles.img30} source={{ uri: item.remark2 }}></Image>
                                                    <Text style={[mstyles.text15bais, mstyles.margintop13]}>{item.flmc}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }
                                })
                            }


                        </View>

                    </ImageBackground>


                    {
                        this.state.isShowLoading ? <LoadingView /> :

                            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}
                                ref="dataList"

                                /* 刷新控制 */
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshing}
                                        onRefresh={this.refreshHandle.bind(this)}
                                        colors={['red', '#ffd500', '#0080ff', '#99e600']}
                                        tintColor='red'
                                        title="加载中..."
                                        titleColor='red' />
                                }

                            >

                                <View style={[mstyles.viewrowb, mstyles.w100b, mstyles.flexWrap, mstyles.padding13]} >

                                    {
                                        this.state.bannerData.map((item, index) => {
                                            if (item.remark3 != '1') {

                                                return (
                                                    <TouchableOpacity key={item.id} onPress={this.gosonpage.bind(this, item.id, item.flmc)}>
                                                        <View style={[mstyles.viewc, mstyles.backbais, mstyles.borderrs5, mstyles.wh03, mstyles.marginbot7]}>
                                                            {/* <Image style={mstyles.img30} source={require('../img/xxs1.png')} /> */}
                                                            <Image style={mstyles.img30} source={{ uri: item.remark2 }}></Image>
                                                            <Text style={[mstyles.text15heis, mstyles.textb, mstyles.margintop7]}>{item.flmc}</Text>
                                                            <Text style={[mstyles.text12huis, mstyles.margintop3]}>了解更多</Text>
                                                        </View>
                                                    </TouchableOpacity>

                                                )


                                            }
                                        })
                                    }

                                </View>

                            </ScrollView>

                    }
                    <BackToTop pressHandle={this.backToTop.bind(this)} />
                </EZSideMenu>
            </View>
        )
    }

}





const styles = StyleSheet.create({


    headviewbox: { alignItems: 'flex-start', justifyContent: 'flex-start', position: 'relative' },

    headviewboxt: {
        alignItems: 'center', width: WINDOW_WIDTH,
        justifyContent: 'center'
    },



    headviewboxb: {
        padding: 10,
    },

    imgtitle: {
        color: '#0f191f',
        fontSize: px2dp(18),
        // fontWeight: '400',
        // fontWeight: 'bold',
    },

    paginationStyle1: {
        bottom: 2,
    },
    dotStyle1: {
        opacity: 0.4,
        width: 10,
        height: 5,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    activeDotStyle1: {
        width: 10,
        height: 5,
        backgroundColor: '#fff',
        borderRadius: 5,
    },




});

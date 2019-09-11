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
    Dimensions, TextInput,
    Image, ActivityIndicator, StatusBar, AsyncStorage
} from 'react-native';
import Swiper from 'react-native-swiper';//轮播图组件 
import BackToTop from '../components/BackToTop'; // 顶部返回组件 
import mstyles from '../utils/mstyles';
import ToastUtil from '../utils/ToastUtil';
import LoadingView from '../utils/LoadingView';
import Icon from 'react-native-vector-icons/Ionicons';


import { getXxBy } from '../api/news';
import { getBanners } from '../api/news';
import { px2dp, isSpace } from '../util/format';

import * as LoginInfo from './Login/LoginInfo';



var WINDOW_WIDTH = Dimensions.get('window').width;

var keyword = '';
export default class HomePage extends Component {
    // static navigationOptions = {
    //     header: null
    // };
    static navigationOptions = {
        tabBarLabel: '山川',
        header: null,
        tabBarIcon: ({ focused }) => {
            if (focused) {
                return (
                    <Image style={mstyles.img19} source={require('../img/sc_sel.png')} />
                );
            }
            return (
                <Image style={mstyles.img19} source={require('../img/sc_nor.png')} />
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

        this.getCurrentNews(); // 获取新闻数据
        this.getBanners(); // 获取banner数据

        // 如果是false 有可能是重新进入的app，还需要去缓存中取一下
        // 这里不管什么情况，直接加载本地缓存吧，只有用户存在且存在详细数据才算登录了
        AsyncStorage.getItem("userinfoKey").then((value) => {
            if (!isSpace(value)) {
                const jsonValue = JSON.parse(value);
                if (!isSpace(jsonValue.userid)) {
                    LoginInfo.setUserInfo2(jsonValue);
                    this.setState({
                        zjf: jsonValue.zjf
                    })
                }
            }
        });

        this._navListener = this.props.navigation.addListener('didFocus', () => {
            this.setState({
                zjf: LoginInfo.getZjf()
            })
        });

    }


    componentWillUnmount() {
        this._navListener.remove();
    }



    // ---------------------------------------------- 自定义函数 ---------------------------------------------- //


    // 获取当前频道的新闻数据
    getCurrentNews() {
        return this.fetchNewsData(0, 10);
    }


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
        this.fetchNewsData(0, 10);
    }


    // 跳转到新闻详情页面
    chooseNews(url) {
        console.log('url:' + url);

    }

    // 获取banner数据
    getBanners() {
        const res = getBanners(2); // api接口
        res.then((newsArr) => {
            this.setState({ // 设置状态
                bannerData: newsArr,
            });
            console.log(newsArr);
        }).catch((e) => { // 错误异常处理
            ToastUtil.showShort(e);
        })
    }



    // 获取新闻数据
    fetchNewsData(start, end) {

        const res = getXxBy(keyword, '1', start, end); // api接口
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
            ToastUtil.showShort(e);
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
        this.fetchNewsData(start, 10);

    }

    // 刷新头部
    refreshHandle() {
        this.setState({
            newsData: [],
            isRefreshing: true,//tag,下拉刷新中，加载完全，就设置成flase
            showFoot: 0,
        }, () => {
            this.getCurrentNews();
            this.getBanners();
        });
    }

    // 返回顶部
    backToTop() {
        this.refs.newsList.scrollToOffset({ x: 0, y: 0, animated: true });
    }


    _goDetail(banneritems_) {
        this.props.navigation.navigate('Detail', { uuid: banneritems_.remark1 });
    }


    gosonpage(flag, flagname) {
        this.props.navigation.navigate('HomeSonPage', { flag: flag, flagname: flagname });
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
                <View style={[mstyles.viewcs, mstyles.backbais, mstyles.borderrs10, mstyles.margin10zy, mstyles.paddingbot12, mstyles.margintop13]}>

                    {
                        !isSpace(datuurl) ?
                            <Image style={[mstyles.imgdt, mstyles.borderrs10]} source={{ uri: datuurl }}></Image> :
                            null
                    }

                    <View style={[mstyles.viewcs, mstyles.padding10]}>
                        <Text style={mstyles.text16heis} numberOfLines={1}>{rowData.title}</Text>
                        <Text style={[mstyles.text14huis, mstyles.margintop7, mstyles.lineh18]} numberOfLines={3}>{rowData.jianjie}</Text>
                        <View style={[mstyles.viewrs, mstyles.margintop7]}>
                            <Text style={mstyles.text12huis} numberOfLines={1}>{rowData.fbr}</Text><Text style={[mstyles.text12huis, mstyles.paddingleft8]} numberOfLines={1}>{rowData.fbsj}</Text>
                        </View>
                    </View>

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

            <TouchableWithoutFeedback key={'TouchableWithoutFeedback_' + banneritems_.id} style={{ width: WINDOW_WIDTH, }} onPress={this._goDetail.bind(this, banneritems_)}>

                <View style={styles.headviewbox}>
                    <View style={styles.headviewboxt}>
                        <Image key={1} style={mstyles.imghead} source={{ uri: picurl_ }}  ></Image>
                    </View>
                    <Text style={[mstyles.text16bais, mstyles.textzs]} numberOfLines={1}>{banneritems_.title}</Text>
                    {/* <View style={styles.headviewboxb}>
                        <Text numberOfLines={2} style={styles.imgtitle}>{banneritems_.title}</Text>
                    </View> */}
                    {/* <View style={{ position: 'absolute', bottom: px2dp(1), right:px2dp(6), }}>
                        <Text style={{ color: '#e70012' }}>———— {idx} ————</Text>
                    </View> */}
                </View>

            </TouchableWithoutFeedback>

        );

    }



    renderSwiper() {

        var banneritems = [];
        var banneritems_ = this.state.bannerData;
        if (banneritems_.length > 0) {
            for (var i = 0; i < banneritems_.length; i++) {
                banneritems.push(this.renderbanner(banneritems_[i], i + 1));
            }
        }

        return (
            <View>
                <Swiper key={'Swiper_key'} style={mstyles.height05}
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


                <View style={[mstyles.viewrowb, mstyles.backbais, mstyles.padding15]} >

                    <TouchableOpacity onPress={this.gosonpage.bind(this, '0', '山川咨询')}>
                        <View style={[mstyles.viewc, mstyles.w80]}>
                            <View style={[mstyles.viewc, mstyles.wh70, mstyles.textbd1huis, mstyles.textbdrd35]}>
                                <Image style={mstyles.img2628} source={require('../img/logo1.png')} />
                            </View>
                            <Text style={[mstyles.text14heis, mstyles.margintop7]}>山川咨询</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.gosonpage.bind(this, '1', '人性材质学')}>
                        <View style={[mstyles.viewc, mstyles.w80]}>
                            <View style={[mstyles.viewc, mstyles.wh70, mstyles.textbd1huis, mstyles.textbdrd35]}>
                                <Image style={mstyles.img26} source={require('../img/logo2.png')} />
                            </View>
                            <Text style={[mstyles.text14heis, mstyles.margintop7]}>人性材质学</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.gosonpage.bind(this, '2', '产品体系')}>
                        <View style={[mstyles.viewc, mstyles.w80]}>
                            <View style={[mstyles.viewc, mstyles.wh70, mstyles.textbd1huis, mstyles.textbdrd35]}>
                                <Image style={mstyles.img26} source={require('../img/logo4.png')} />
                            </View>
                            <Text style={[mstyles.text14heis, mstyles.margintop7]}>课程体系</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.gosonpage.bind(this, '2', '产品体系')}>
                        <View style={[mstyles.viewc, mstyles.w80]}>
                            <View style={[mstyles.viewc, mstyles.wh70, mstyles.textbd1huis, mstyles.textbdrd35]}>
                                <Image style={mstyles.img26} source={require('../img/logo3.png')} />
                            </View>
                            <Text style={[mstyles.text14heis, mstyles.margintop7]}>咨询体系</Text>
                        </View>
                    </TouchableOpacity>





                </View>
            </View>
        )


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





                {
                    this.state.isShowLoading ? <LoadingView /> :
                        <FlatList
                            ref="newsList"
                            // contentContainerStyle={{ paddingBottom: px2dp(50) }}
                            // ItemSeparatorComponent={() => {
                            //     return (<View style={styles.line} />)
                            // }}

                            data={this.state.newsData}
                            onEndReached={this.loadMore.bind(this)}
                            onEndReachedThreshold={0.2}
                            keyExtractor={(item, index) => index.toString()} // key属性
                            renderItem={({ item }) => this.renderItem(item)}

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

                            ListHeaderComponent={this.renderSwiper.bind(this)}
                            // ListFooterComponent={() => this._renderFooter()}
                            //上拉加载更多的时候调用自定义的加载图标，一般为一个loading的圆圈（ActivityIndicator）
                            ListFooterComponent={this._renderFooter.bind(this)}
                        />
                }


                <BackToTop pressHandle={this.backToTop.bind(this)} />
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

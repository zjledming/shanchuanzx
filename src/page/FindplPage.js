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
    Image,
    ToastAndroid, ActivityIndicator, Platform
} from 'react-native';
import Swiper from 'react-native-swiper';//轮播图组件 
import BackToTop from '../components/BackToTop'; // 顶部返回组件 
import WebViewPage from './WebViewPage'; // webView组件
import Search from './Search'; // 搜索组件
import Detail from './Detail'; // 详情组件
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingView from '../utils/LoadingView';
import * as LoginInfo from './Login/LoginInfo';


import { getNewsByChannel } from '../api/news';
import { getBanners } from '../api/news';
import { px2dp } from '../util/format';



var WINDOW_WIDTH = Dimensions.get('window').width;
var head_heigth = WINDOW_WIDTH * 0.5;
var SANTUIMG_WIDTH = (WINDOW_WIDTH - 30) / 3;
var datu_width = WINDOW_WIDTH - 20;
var datu_heigth = datu_width * 0.5;
var widthpltext = px2dp(WINDOW_WIDTH) - px2dp(30) - px2dp(20) - px2dp(30);

const topbarHeight = (Platform.OS === 'ios' ? px2dp(64) : px2dp(42))
const TITLE_OFFSET = Platform.OS === 'ios' ? px2dp(70) : px2dp(56);


//  新闻组件
export default class FindplPage extends Component {
    static navigationOptions = ({ navigation }) => {
        return ({
            headerStyle: { backgroundColor: '#d33d3c', height: topbarHeight, }, //height: 54,
            headerBackTitleStyle: { color: '#fff' },
            headerTintColor: '#fff',
            headerTitleStyle: {
                alignSelf: 'center',
                textAlign: 'center',
                flex: 1,
            },
            headerTitleContainerStyle: {
                left: TITLE_OFFSET,
                right: TITLE_OFFSET,
            },
            headerTitle: (
                <Text style={{ flex: 1, textAlign: 'center', fontSize: px2dp(16), color: '#fff' }}>我的评论</Text>
            ),
            // headerRight: (
            //     <View style={{ marginRight: px2dp(20) }}>
            //         <Ionicons size={px2dp(22)} name='ios-search' color="#fff" />
            //     </View>
            // ),

        })

    }

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
        // this.getBanners(); // 获取banner数据
    }



    // 获取当前频道
    getCurrentChannel() {
        return '1001'; // 评论1000
    }

    // 获取当前频道的新闻数据
    getCurrentNews() {
        let channel = this.getCurrentChannel();

        return this.fetchNewsData(channel, 0, 10);
    }


    // 搜索
    navToSearch() {

    }

    // 跳转到新闻详情页面
    chooseNews(url) {

    }

    // 获取banner数据
    getBanners() {
        const res = getBanners(2); // api接口
        res.then((newsArr) => {
            this.setState({ // 设置状态
                bannerData: newsArr,
            });
        }).catch((e) => { // 错误异常处理
            ToastAndroid.show(e, ToastAndroid.SHORT); // androidToast
        })
    }



    // 获取新闻数据
    fetchNewsData(channelId, start, end) {

        const res = getNewsByChannel(1, channelId, '1', start, end); // api接口
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

            // 加载更多的时候才拼接，其他情况应该是重置
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
        let channel = this.getCurrentChannel(); // 当前item
        // let start = (this.state.newsData.length + 2); // 起始值
        // let end = (this.state.newsData.length + 12); // 结束值
        let start = this.state.newsData.length; // 起始值
        this.fetchNewsData(channel, start, 10);

    }

    // 刷新头部
    refreshHandle() {
        this.setState({
            newsData: [],
            isRefreshing: true,//tag,下拉刷新中，加载完全，就设置成flase
            showFoot: 0,
        }, () => {
            this.getCurrentNews();
            // this.getBanners();
        });
    }

    // 返回顶部
    backToTop() {
        this.refs.newsList.scrollToOffset({ x: 0, y: 0, animated: true });
    }


    _renderFooter = () => { //底部加载(一个圆圈)


        if (this.state.showFoot === 1) {
            return (
                <View style={styles.indicatorContainer}>
                    <Text style={{ fontSize: 14, }}>
                        已加载所有数据
                        </Text>
                </View>
            );
        } else if (this.state.showFoot === 2) {
            return (
                <View style={styles.indicatorContainer}>
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
                <View style={styles.footer}>
                    <Text></Text>
                </View>
            );
        }


    };




    _goDetail(banneritems_) {

        this.props.navigation.navigate('Detail', {
            uuid: banneritems_.remark1,
            callback: ((info) => { //回调函数
                // 回调了
                this.getCurrentNews();
            })
        });

    }




    renderPic(lbms_, picurl_) {

        if (lbms_ == '1') {
            return (
                <Image key={picurl_} style={styles.datuimg} source={{ uri: picurl_ }}></Image>
            );
        } else if (lbms_ == '2') {
            return (
                <Image key={picurl_} style={styles.onetuimg} source={{ uri: picurl_ }}></Image>
            );
        } else if (lbms_ == '3') {
            return (
                <Image key={picurl_} style={styles.santuimg} source={{ uri: picurl_ }}></Image>
            );
        }
    }




    renderItem(rowData, index) {

        


        var lbms_ = rowData.lbms;

        var picitems = [];
        var picitems_ = rowData.picitems;
        if (picitems_) {
            for (var i = 0; i < picitems_.length; i++) {
                picitems.push(this.renderPic(lbms_, picitems_[i]));
            }
        }


        if (lbms_ == '1') {


            return (
                <TouchableWithoutFeedback onPress={this._goDetail.bind(this, rowData)} >

                    <View style={styles.borderBot10}>
                        <View style={styles.viewcol_pd10}>
                            <Image style={styles.img35} source={require('../img/huistoux.png')}></Image>
                            <View style={styles.viewcol_pd6}>
                                <Text style={styles.text16hui}>{rowData.plr_name}</Text>
                                <Text style={styles.text14hui_w032}>{rowData.plnr}</Text>
                                <Text style={styles.text14hui}>{rowData.plsj}</Text>
                            </View>
                        </View>


                        <View style={styles.santuv}>


                            <View style={styles.wutuvt}>
                                {/* <Text style={styles.wutuvtag1} numberOfLines={1}>视频</Text> */}
                                <Text style={styles.wutuvttitle} >{rowData.title}</Text>
                            </View>
                            <Text style={styles.wutuvcontent} numberOfLines={3}>{rowData.jianjie}</Text>

                            <View style={styles.wutuvb}>

                                {/* <Image style={styles.datuimg} source={require('../../../img/home/kh_1.png')}></Image> */}
                                {picitems}

                            </View>

                            <View style={styles.wutuvb}>
                                {/* <Text style={styles.wutuvprice1} numberOfLines={1}>￥2999.0</Text> */}
                                <Text style={styles.wutuvprice2} numberOfLines={1}>{rowData.fbr}</Text><Text style={styles.wutuvprice2} numberOfLines={1}>{rowData.fbsj}</Text>
                            </View>

                        </View>
                    </View>
                </TouchableWithoutFeedback>



            );

        } else if (lbms_ == '2') {
            return (



                <TouchableWithoutFeedback onPress={this._goDetail.bind(this, rowData)} >
                    <View style={styles.borderBot10}>
                        <View style={styles.viewcol_pd10}>
                            <Image style={styles.img35} source={require('../img/huistoux.png')}></Image>
                            <View style={styles.viewcol_pd6}>
                                <Text style={styles.text16hui}>{rowData.plr_name}</Text>
                                <Text style={styles.text14hui_w032}>{rowData.plnr}</Text>
                                <Text style={styles.text14hui}>{rowData.plsj}</Text>
                            </View>
                        </View>

                        <View style={styles.onetuv}>

                            <View style={styles.onetuvl}>
                                <Text style={styles.wutuvttitle} numberOfLines={3}>{rowData.title}</Text>

                                <Text style={styles.wutuvcontent} numberOfLines={3}>{rowData.jianjie}</Text>

                                <View style={styles.onetuvlb}><Text style={styles.wutuvprice2} numberOfLines={1}>{rowData.fbr}</Text><Text style={styles.wutuvprice2} numberOfLines={1}>{rowData.fbsj}</Text>
                                </View>
                            </View>

                            <View style={styles.onetuvr}>

                                {picitems}
                            </View>

                        </View>

                    </View>

                </TouchableWithoutFeedback>


            );
        } else if (lbms_ == '3') {
            return (
                <TouchableWithoutFeedback onPress={this._goDetail.bind(this, rowData)} >

                    <View style={styles.borderBot10}>
                        <View style={styles.viewcol_pd10}>
                            <Image style={styles.img35} source={require('../img/huistoux.png')}></Image>
                            <View style={styles.viewcol_pd6}>
                                <Text style={styles.text16hui}>{rowData.plr_name}</Text>
                                <Text style={styles.text14hui_w032}>{rowData.plnr}</Text>
                                <Text style={styles.text14hui}>{rowData.plsj}</Text>
                            </View>
                        </View>


                        <View style={styles.santuv}>


                            <View style={styles.wutuvt}>
                                {/* <Text style={styles.wutuvtag1} numberOfLines={1}>视频</Text> */}
                                <Text style={styles.wutuvttitle} >{rowData.title}</Text>
                            </View>
                            <Text style={styles.wutuvcontent} numberOfLines={3}>{rowData.jianjie}</Text>

                            <View style={styles.santuvb}>

                                {/* <Image style={styles.santuimg} source={require('../../../img/home/kh_1.png')}></Image>
              <Image style={styles.santuimg} source={require('../../../img/home/kh_1.png')}></Image>
              <Image style={styles.santuimg} source={require('../../../img/home/kh_1.png')}></Image> */}
                                {picitems}
                            </View>

                            <View style={styles.wutuvb}>
                                {/* <Text style={styles.wutuvprice1} numberOfLines={1}>￥2999.0</Text> */}
                                <Text style={styles.wutuvprice2} numberOfLines={1}>{rowData.fbr}</Text><Text style={styles.wutuvprice2} numberOfLines={1}>{rowData.fbsj}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>

            );
        } else {  // 4或者其他的都按无图处理
            return (



                <TouchableWithoutFeedback onPress={this._goDetail.bind(this, rowData)} >
                    <View style={styles.borderBot10}>
                        <View style={styles.viewcol_pd10}>
                            <Image style={styles.img35} source={require('../img/huistoux.png')}></Image>
                            <View style={styles.viewcol_pd6}>
                                <Text style={styles.text16hui}>{rowData.plr_name}</Text>
                                <Text style={styles.text14hui_w032}>{rowData.plnr}</Text>
                                <Text style={styles.text14hui}>{rowData.plsj}</Text>
                            </View>
                        </View>
                        <View style={styles.wutuv}>


                            <View style={styles.wutuvt}>
                                {/* <Text style={styles.wutuvtag1} numberOfLines={1}>视频</Text> */}
                                <Text style={styles.wutuvttitle} >{rowData.title}</Text>
                            </View>
                            <Text style={styles.wutuvcontent} numberOfLines={3}>{rowData.jianjie}</Text>

                            {/* <View style={styles.wutuvb}> */}

                            <View style={{ marginTop: 5,}}>
                           
                                {/* <Text style={styles.wutuvprice1} numberOfLines={1}>￥2999.0</Text> */}
                                <Text style={styles.wutuvprice2} numberOfLines={1}>{rowData.fbr}</Text><Text style={styles.wutuvprice2} numberOfLines={1}>{rowData.fbsj}</Text>
                            </View>

                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        }

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

                        {/* <Image style={styles.imgstyle} source={require('../img/js/hsbj.png')} ></Image> */}

                        <Image key={1} style={styles.imgstyle} source={{ uri: picurl_ }}  ></Image>
                    </View>
                    <View style={styles.headviewboxb}>
                        <Text numberOfLines={2} style={styles.imgtitle}>{banneritems_.title}</Text>
                    </View>
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
            return (
                <Swiper key={'Swiper_key'} style={styles.wrapper} height={head_heigth + 60}
                    dot={<View style={{ backgroundColor: '#B0B0B0', width: 8, height: 8, borderRadius: 4, margin: 3 }} />}
                    activeDot={<View style={{ backgroundColor: '#fff', width: 8, height: 8, borderRadius: 4, margin: 3 }} />}
                    paginationStyle={{ bottom: 70, }} autoplay >
                    {banneritems}
                </Swiper>
            )

        } else {

            return (
                <View></View>
            )

        }

    }





    // 渲染页面
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>

                {
                    this.state.isShowLoading ? <LoadingView /> :
                        <FlatList
                            ref="newsList"
                            // ItemSeparatorComponent={() => {
                            //     return (<View style={styles.line} />)
                            // }}
                            contentContainerStyle={{ paddingTop: px2dp(10), paddingBottom: px2dp(10), }}
                            data={this.state.newsData}
                            onEndReached={this.loadMore.bind(this)}
                            onEndReachedThreshold={0.2}
                            keyExtractor={(item, index) => index.toString()} // key属性

                            renderItem={({ item }) => this.renderItem(item)}
                            // ItemSeparatorComponent={this.renderSeparator}

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

                            // ListHeaderComponent={this.renderSwiper.bind(this)}
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

// css样式
const styles = StyleSheet.create({
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


    endhedimg: {
        height: px2dp(18),
        width: px2dp(18),
        // marginRight: px2dp(10),
        marginLeft: px2dp(10),
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
        fontSize: px2dp(10),
        lineHeight: px2dp(10),

    },

    endhedtext: {
        color: '#fff',
        fontSize: px2dp(16),
        fontWeight: '400',
        marginLeft: px2dp(3),
    },


    headerTitle: {
        fontWeight: 'bold',
        fontSize: px2dp(18),
        color: 'white'
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
    line: {
        backgroundColor: '#f5f5f3',
        height: px2dp(1),
    },
    newsItem: {
        backgroundColor: 'white',
        padding: px2dp(10)
    },
    itemTitle: { // 标题
        fontSize: px2dp(16),
        color: 'black',
    },
    itemAbstract: { // 摘要
        fontSize: px2dp(12),
        color: 'gray',
        paddingTop: px2dp(5),
    },
    stick_label: { // 粘性标签
        fontSize: px2dp(10),
        color: 'red',
    },
    imgBox: {
        flexDirection: 'row',
        marginTop: px2dp(6),
    },
    itemImg: {
        flex: 1,
        marginRight: px2dp(4),
        height: px2dp(70),
    },
    lastImg: {
        flex: 1,
        marginRight: 0,
        height: px2dp(70),
    },
    oneImg: {
        flex: 1,
        height: px2dp(180),
    },
    tipsBox: {
        flexDirection: 'row',
        marginTop: px2dp(6)
    },
    tips: {
        fontSize: px2dp(12),
        marginRight: px2dp(6)
    },


    indicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: px2dp(60),
        backgroundColor: '#fff',

    },


    wutuvtag1: {
        fontSize: 12,
        color: '#fff',
        backgroundColor: '#8dd882',
        alignSelf: 'flex-start',
        paddingBottom: 2,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 2,
        marginRight: 5,
    },

    onetuv: {
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        padding: 10,
        borderColor: '#f5f5f5',
        borderWidth: 1,
    },

    wutuv: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        padding: 10,
        borderColor: '#f5f5f5',
        borderWidth: 1,
    },

    santuv: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        padding: 10,
        borderColor: '#f5f5f5',
        borderWidth: 1,
    },

    wutuvttitle: {
        fontSize: px2dp(18),
        color: '#000',
        // fontWeight: 'bold',
        flex: 1,
    },
    wutuvcontent: {
        fontSize: 14,
        color: '#888',
        flex: 1,
        marginTop: 2,
        marginBottom: 5,
    },


    wutuvprice1: {
        fontSize: 20,
        color: '#db462e',
        fontWeight: 'bold',
    },

    wutuvprice2: {
        // marginLeft: 8,
        // textDecorationLine: 'line-through',
        fontSize: 13,
        marginTop: 5,
        marginRight: 8,
    },
    wutuvt: {
        flexDirection: 'row',
    },

    wutuvb: {
        flexDirection: 'row',
        marginTop: 5,
    },

    santuvb: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },



    onetuvl: {
        flex: 1,
        marginRight: 5,
    },

    onetuvlb: {
        flexDirection: 'row',
    },


    onetuvr: {
        flexDirection: 'row',
    },

    onetuimg: {
        height: 90,
        width: 136,
        // marginLeft: 12,
        // borderRadius: 5,
        // marginRight: 8,
    },

    santuimg: {
        height: SANTUIMG_WIDTH,
        width: SANTUIMG_WIDTH,
        // marginLeft: 2.5,
        // marginRight: 5,
    },

    datuimg: {
        height: datu_heigth,
        width: datu_width,
        // marginLeft: 2.5,
        marginRight: 5,
    },
    bgImg: {
        width: 90,
        height: 100,
        marginTop: -50,
    },
    bgtext: {
        marginTop: 10,
        fontSize: 16,
        color: '#999',
        marginLeft: -15,
    },
    bgtext1: {
        marginTop: 10,
        fontSize: 20,
        color: '#999',
        marginLeft: -15,
    },




    wrapper: {
        height: head_heigth,
        backgroundColor: '#fff',
    },

    paginationStyle: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    paginationText: {
        color: 'white',
        fontSize: 20
    },



    headviewbox: { alignItems: 'flex-start', justifyContent: 'flex-start', position: 'relative' },

    headviewboxt: {
        alignItems: 'center', width: WINDOW_WIDTH,
        justifyContent: 'center'
    },



    headviewboximg: {
        height: 50,
        width: 50,
        marginLeft: 5,
        marginRight: 5,
    },



    imgstyle: {
        height: head_heigth,
        width: WINDOW_WIDTH,
        resizeMode: 'stretch',
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




    text14hui: {
        color: '#969696', fontSize: px2dp(14)
    },

    text14hui_w032: {
        color: '#272727', fontSize: px2dp(16), width: widthpltext,
    },

    text16hui: { color: '#969696', fontSize: px2dp(16) },

    viewcol_pd6: { flexDirection: 'column', padding: px2dp(6) },

    viewcol_pd10: { flexDirection: 'row', padding: px2dp(10) },

    img35: { width: px2dp(35), height: px2dp(35) },

    borderBot10: { borderBottomColor: "#f5f5f5", borderBottomWidth: px2dp(10) },




});

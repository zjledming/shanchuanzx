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
    ToastAndroid, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // 图标
import BackToTop from '../components/BackToTop'; // 顶部返回组件
import TabList from '../components/TabList'; // 列表组件
import WebViewPage from './WebViewPage'; // webView组件
import Search from './Search'; // 搜索组件
import Detail from './Detail';  



import { getNewsByChannel } from '../api/news';
import { getchannelInfo } from '../api/news';
import { px2dp } from '../util/format';


var WINDOW_WIDTH = Dimensions.get('window').width;
var head_heigth = WINDOW_WIDTH * 0.5;
var SANTUIMG_WIDTH = (WINDOW_WIDTH - 30) / 3;
var datu_width = WINDOW_WIDTH - 20;
var datu_heigth = datu_width * 0.5;

//  新闻组件
export default class News extends Component {
    // 构造函数
    constructor(props) {
        super(props);
        this.state = { // 状态
            isRefreshing: false,//下拉控制 是否为最新
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            newsData: [], // 新闻数据
            curChannelIndex: 0, // 当前频道
            channelInfo: [{ 'id': '0', 'flmc': '全部' },
                // { 'id': 'news_society', 'flmc': '社会' }, 
            ]
        }; // 频道信息
    }

    // 获取标题列表
    getItemTitles() {
        let titles = [];
        let channelInfo = this.state.channelInfo;
        channelInfo.forEach(function (channel) {
            titles.push(channel.flmc);
        });
        return titles;
    }

    // 获取当前频道
    getCurrentChannel() {
        let curIndex = this.state.curChannelIndex; // 当前索引
        return this.state.channelInfo[curIndex].id; // 当前频道
    }

    // 获取当前频道的新闻数据
    getCurrentNews() {
        let channel = this.getCurrentChannel();

        return this.fetchNewsData(channel, 0, 10);
    }

    componentWillMount() {
        this.getchannelInfo(); // 获取主题数据
    }

    // 组件挂载
    componentDidMount() {
        this.getCurrentNews(); // 获取新闻数据
    }


    // 组件挂载
    componentDidMount() {
        this.getCurrentNews(); // 获取新闻数据
    }

    // 搜索
    navToSearch() {
        this.props.navigator.push({
            component: Search,
            args: {}
        });
    }

    // 跳转到新闻详情页面
    chooseNews(url) {
        console.log('url:' + url);
        this.props.navigator.push({
            component: WebViewPage, // web页面
            args: {
                uri: url
            }
        });
    }

    // 切换频道
    changeChannel(index) {
        this.setState({
            newsData: [],
            curChannelIndex: index,
            showFoot: 0,
        }, () => {
            this.getCurrentNews();
            this.refs.newsList.scrollToOffset({ x: 0, y: 0, animated: false });
        })
    }


    // 获取主题信息
    getchannelInfo() {
        const res = getchannelInfo(); // api接口
        res.then((newsArr) => {
            let temArr = [{ 'id': '0', 'flmc': '全部' }];
            temArr.push(...newsArr);
            this.setState({ // 设置状态
                channelInfo: temArr
            });
            console.log(temArr);
        }).catch((e) => { // 错误异常处理
            ToastAndroid.show(e, ToastAndroid.SHORT); // androidToast
        })
    }



    // 获取新闻数据
    fetchNewsData(channelId, start, end) {

        const res = getNewsByChannel(1,channelId,'', start, end); // api接口
        res.then((newsArr) => {
            let foot = 0; // 默认隐藏：如果请求到数据了，就无法保证下次请求是否还有数据，就需要先隐藏
            // 如果这次请求没有获取到数据，说明没有数据了
            if (newsArr.length == 0) {
                // 有个情况，一进来就会显示加载所有数据，这里加个判断，只有当当前页面有值，但是这次请求没有加载到值得时候才显示加载了所有数据
                if(this.state.newsData && this.state.newsData.length > 0){
                    foot = 1;//listView底部显示没有更多数据了
                }else{
                    foot = 0;//一直就没值的话，直接隐藏吧
                }
            }
            this.setState({
                // 获取数据成功
                showFoot: foot,
                isRefreshing: false,
            });

            let temArr = this.state.newsData.slice(); // 返回切片数据
            temArr.push(...newsArr);
            this.setState({ // 设置状态
                newsData: temArr
            });
            console.log(temArr);
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
        });
    }

    // 返回顶部
    backToTop() {
        this.refs.newsList.scrollToOffset({ x: 0, y: 0, animated: true });
    }


    	
    _goDetail(banneritems_) {

        this.props.navigator.push({
            component: Detail,
            args: {
                uuid:banneritems_.remark1
            }
        });
     
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
    




    renderItem(rowData) {



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
                <TouchableWithoutFeedback onPress={this._goDetail.bind(this,rowData)} >
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
                </TouchableWithoutFeedback>



            );

        } else if (lbms_ == '2') {
            return (

                <TouchableWithoutFeedback onPress={this._goDetail.bind(this,rowData)} >
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

                </TouchableWithoutFeedback>


            );
        } else if (lbms_ == '3') {
            return (
                <TouchableWithoutFeedback onPress={this._goDetail.bind(this,rowData)} >
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
                </TouchableWithoutFeedback>

            );
        } else {  // 4或者其他的都按无图处理
            return (

                <TouchableWithoutFeedback onPress={this._goDetail.bind(this,rowData)} >
                    <View style={styles.wutuv}>


                        <View style={styles.wutuvt}>
                            {/* <Text style={styles.wutuvtag1} numberOfLines={1}>视频</Text> */}
                            <Text style={styles.wutuvttitle} >{rowData.title}</Text>
                        </View>
                        <Text style={styles.wutuvcontent} numberOfLines={3}>{rowData.jianjie}</Text>

                        <View style={styles.wutuvb}>
                            {/* <Text style={styles.wutuvprice1} numberOfLines={1}>￥2999.0</Text> */}
                            <Text style={styles.wutuvprice2} numberOfLines={1}>{rowData.fbr}</Text><Text style={styles.wutuvprice2} numberOfLines={1}>{rowData.fbsj}</Text>
                        </View>

                    </View>
                </TouchableWithoutFeedback>
            );
        }

    }





    // 渲染页面
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {/* 头部信息栏 */}
                <View style={styles.headerBar}>
                    <Image style={styles.beghedimg} source={require('../img/logo-bs.png')} >
                    </Image>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.searchBox}
                        onPress={this.navToSearch.bind(this)}>
                        <Icon style={styles.searchIcon} name='search' />
                        <Text style={styles.searchText}>我要学习</Text>
                    </TouchableOpacity>
                    <View style={styles.endhedview1}>
                        <Text style={styles.endhedtext1}>积</Text>
                        <Text style={styles.endhedtext1}>分</Text>
                    </View>
                    <Text style={styles.endhedtext}>20</Text>
                    <Image style={styles.endhedimg} source={require('../img/wo-bs.png')} >
                    </Image>
                </View>

                {/* 侧滑栏 */}
                <View style={{ height: 40 }}>
                    <TabList

                        items={this.getItemTitles()}
                        selectHandle={this.changeChannel.bind(this)} />

                </View>

                {/* 数据列表 */}
                <FlatList
                    ref="newsList"
                    // ItemSeparatorComponent={() => {
                    //     return (<View style={styles.line} />)
                    // }}

                    data={this.state.newsData}
                    onEndReached={this.loadMore.bind(this)}
                    onEndReachedThreshold={0.2}
                    keyExtractor={(item, index) => index.toString()} // key属性

                    renderItem={({ item }) => this.renderItem(item)}


                    // renderItem={({ item, separators }) => (
                    //     <TouchableHighlight
                    //         onPress={this.chooseNews.bind(this, item.url)}>
                    //         {/* 新闻item */}
                    //         <View style={styles.newsItem}>
                    //             <Text style={styles.itemTitle}>{item.title}</Text>
                    //             <Text style={styles.itemAbstract}>{item.abstract}</Text>

                    //             {/* 图片列表 */}
                    //             <View style={styles.imgBox}>
                    //                 {
                    //                     item.image_list ?
                    //                         item.image_list.map((img, index) => {
                    //                             return (
                    //                                 <Image
                    //                                     style={
                    //                                         item.image_list.length === 1 ? styles.oneImg :
                    //                                             (item.image_list.length - 1) === index ? styles.lastImg : styles.itemImg
                    //                                     }
                    //                                     source={{ uri: img.url }}
                    //                                     resizeMode='stretch'
                    //                                     key={index}
                    //                                 />
                    //                             )
                    //                         }) : []
                    //                 }
                    //             </View>

                    //             {/* 评论信息 */}
                    //             <View style={styles.tipsBox}>
                    //                 <Text style={styles.stick_label}>{item.stick_label}</Text>
                    //                 <Text style={styles.tips}>{item.source}</Text>
                    //                 <Text style={styles.tips}>{(item.comment_count || 0) + '评论'}</Text>
                    //             </View>
                    //         </View>
                    //     </TouchableHighlight>
                    // )}

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


                    // ListFooterComponent={() => this._renderFooter()}
                    //上拉加载更多的时候调用自定义的加载图标，一般为一个loading的圆圈（ActivityIndicator）
                    ListFooterComponent={this._renderFooter.bind(this)}





                />
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
        paddingTop: 5,
        paddingBottom: 10,
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
    },

    wutuv: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        paddingTop: 5,
        paddingBottom: 10,
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
    },

    santuv: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        paddingTop: 5,
        paddingBottom: 10,
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
    },

    wutuvttitle: {
        fontSize: 17,
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



});
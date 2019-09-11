'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    RefreshControl,
    FlatList, Linking,
    Alert,
    TouchableHighlight,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Dimensions,
    Image, Keyboard, Platform,
    ToastAndroid, ActivityIndicator, TextInput
} from 'react-native';
import Swiper from 'react-native-swiper';//轮播图组件 
import Icons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BackToTop from '../components/BackToTop'; // 顶部返回组件 
import WebViewPage from './WebViewPage'; // webView组件
import Search from './Search'; // 搜索组件
import Detail from './Detail'; // 详情组件
import LoadingView from '../utils/LoadingView';
import * as LoginInfo from './Login/LoginInfo';
import { isSpace } from '../util/format';
import { selectTxsxList, deleteShix } from '../api/news';
import { px2dp } from '../util/format';


var WINDOW_WIDTH = Dimensions.get('window').width;
var WIDTH075 = WINDOW_WIDTH * 0.75;
var head_heigth = WINDOW_WIDTH * 0.5;
var SANTUIMG_WIDTH = (WINDOW_WIDTH - 30) / 3;
var datu_width = WINDOW_WIDTH - 20;
var datu_heigth = datu_width * 0.5;
var WIDTH03 = WINDOW_WIDTH * 0.3;
const topbarHeight = (Platform.OS === 'ios' ? px2dp(64) : px2dp(42))
let that;


export default class TxsxPage extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        that = this;
        this.state = { // 状态
            isRefreshing: false,//下拉控制 是否为最新
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            newsData: [], // 新闻数据
            isShowLoading: true,
        };
    }


    static navigationOptions = ({ navigation }) => {
        return ({
            headerStyle: { backgroundColor: '#d33d3c', height: topbarHeight, }, //height: 54,
            headerBackTitleStyle: { color: '#fff' },
            headerTintColor: '#fff',
            headerTitle: (
                <Text style={{ flex: 1, textAlign: 'center', fontSize: px2dp(16), color: '#fff' }}>我的事项</Text>
            ),
            headerRight: (
                <View style={{ marginRight: px2dp(20) }}>
                    <Ionicons onPress={() => {

                        let username = navigation.state.params.username;
                        let realname = navigation.state.params.realname;
                        let url_ = "app/jsp/shanc/sxedit.jsp?appu_id=" + username + "&appu_name=" + realname;
                        navigation.navigate('WebScreen', {
                            url: url_,
                            name: "新增事项",
                            // info: info,
                            callback: ((info) => { //回调函数
                                // 回调了
                                
                                that.fetchNewsData(0, 10);
                            })
                        }

                        );

                    }} size={px2dp(22)} name='md-add' color="#fff" />
                </View>
            ),

        })

    }




    componentWillMount() {

    }

    // 组件挂载
    componentDidMount() {
        this.getCurrentNews(); // 获取新闻数据
    }




    // 获取当前频道的新闻数据
    getCurrentNews() {
        
        return this.fetchNewsData(0, 10);
    }



    //拨打电话
    linking = (url) => {

        Alert.alert('您确定拨打选中的电话号码（' + url + '）吗？', '', [
            {
                text: '取消', onPress: () => {

                }
            },
            {
                text: '拨打', onPress: () => {
                    url = 'tel:' + url;
                    Linking.canOpenURL(url).then(supported => {
                        if (!supported) {
                            console.log('Can\'t handle url: ' + url);
                        } else {
                            return Linking.openURL(url);
                        }
                    }).catch(err => console.error('An error occurred', err));
                }
            },
        ]);





    }




    // 获取新闻数据
    fetchNewsData(start, end) {
        
        var user_ = LoginInfo.getUserInfo();

        const res = selectTxsxList(user_.username, this.state.text, start, end); // api接口
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


            // 只有加载更多的时候才是拼接，反之应该是重置内容
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
        
        this.fetchNewsData(start, 10);

    }

    // 刷新头部
    refreshHandle() {
        this.setState({
            newsData: [],
            isRefreshing: true,//tag,下拉刷新中，加载完全，就设置成flase
            showFoot: 0,
            text: '',
        }, () => {
            this.getCurrentNews();
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

        this.props.navigation.navigate('Detail', { uuid: banneritems_.remark1 });

    }


    sckehu(id) {

        Alert.alert('事项删除之后无法找回，请谨慎操作，确定删除吗？', '', [
            {
                text: '取消', onPress: () => {

                }
            },
            {
                text: '确定', onPress: () => {
                    this.setState({ isShowLoading: true });
                    const res = deleteShix(id); // api接口 
                    res.then((newsArr) => {
                        
                        this.fetchNewsData(0, 10);
                        this.setState({ isShowLoading: false });
                    }).catch((e) => { // 错误异常处理
                        ToastAndroid.show(e, ToastAndroid.SHORT); // androidToast
                    })
                }
            },
        ]);
    }



    xgkehu(id) {

        let url_ = "app/jsp/shanc/sxedit.jsp?id=" + id;


        this.props.navigation.navigate('WebScreen', {

            url: url_,
            name: "修改事项",
            // info: info,
            callback: ((info) => { //回调函数
                // 回调了
                
                this.fetchNewsData(0, 10);
            })

        });

    }

    gokehudetail(id) {
        //this.props.navigation.navigate('Kehuinfo', { kehuinfo: rowData });
        let url_ = "app/jsp/shanc/sxedit.jsp?flag=view&id=" + id;
        this.props.navigation.navigate('WebScreen', {
            url: url_,
            name: "查看事项", 
        });

    }




    renderItem(rowData, index) {


        return (
            <View style={styles.wutuv}>

                <View style={styles.wutuvt}>
                    <Text style={styles.wutuvttitle} >{rowData.title}  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.wutuvcontent} ><Icons style={styles.icon14} name='clock' color="#888" />  提醒时间：{rowData.txsj}</Text>
                        <Text style={styles.wutuvcontent} ><Icons style={styles.icon14} name='check' color="#888" />  完成状态：{rowData.wcstate}</Text>
                        <Text style={styles.wutuvcontent} ><Icons style={styles.icon14} name='clock' color="#888" />  完成时间：{rowData.wcsj}</Text>
                    </View>
                    {/* <TouchableOpacity onPress={this.gokehudetail.bind(this, rowData)} >
                        <View style={{ width: WIDTH03, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                            <Icons style={styles.icon16} name='arrow-right' color="#888" />
                        </View>
                    </TouchableOpacity> */}
                </View>


                {/* <Text style={styles.wutuvcontent} ><Icons style={styles.icon14} name='user-following' color="#888" />  事项职位：{rowData.zhiwu}</Text>
                <Text style={styles.wutuvcontent} ><Icons style={styles.icon14} name='grid' color="#888" />  所属行业：{rowData.hangye}</Text>
                <Text style={styles.wutuvcontent} ><Icons style={styles.icon14} name='organization' color="#888" />  企业规模：{rowData.guimo}</Text>
                <Text style={styles.wutuvcontent} ><Icons style={styles.icon14} name='location-pin' color="#888" />  所属区域：{rowData.ssqy}</Text> */}
                <View style={styles.rowldv}>
                    <TouchableOpacity onPress={this.sckehu.bind(this, rowData.id)}>
                        <Text style={styles.fontheis16} ><Icons style={styles.icon14} name='trash' color="#d33d3c" />  删除</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.xgkehu.bind(this, rowData.id)}>
                        <View style={styles.rowendv}>
                            {/* <Text style={styles.fonthuangsborer16} >修改</Text> */}
                            <Text style={styles.fontheis16} ><Icons style={styles.icon14} name='settings' color="#ffbe10" />  修改</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.gokehudetail.bind(this, rowData.id)}>
                        <View style={styles.rowendv}>
                            {/* <Text style={styles.fonthuangsborer16} >修改</Text> */}
                            <Text style={styles.fontheis16} ><Icons style={styles.icon14} name='bulb' color="#5394ff" />  查看</Text>
                        </View>
                    </TouchableOpacity>
                </View>



            </View>


        );

    }


    // 搜索词相关的新闻
    searchWords() {
       

        Keyboard.dismiss();
        if (isSpace(this.state.text)) {
            ToastAndroid.show('请输入搜索关键字', ToastAndroid.SHORT);
            return;
        }
        
        return this.fetchNewsData(0, 10);

    }


    // 字符输入状态改变的回调
    inputChangeHandle(text) {
        this.setState({
            text: text
        })
    }



    // 渲染页面
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>


                {/* <View style={styles.headview}>
           <Image style={{ height: WIDTH075, width: WINDOW_WIDTH, }} source={require('../img/hsbjtb.png')} ></Image> 
              </View>  */}



                <View style={styles.footBar}>

                    {/* 搜索框 */}
                    <View style={styles.searchBox}>
                        <Icons style={styles.searchIcon} name='pencil' />
                        <TextInput
                            style={styles.searchInput}
                            onChangeText={this.inputChangeHandle.bind(this)}
                            value={this.state.text}
                            placeholder="输入关键字搜索..."
                            placeholderTextColor="#bdbdbd"
                            underlineColorAndroid="transparent"
                            selectionColor="#d33d3c"

                        />
                    </View>

                    {/* 功能区：评论bubble 收藏 缓存 分享 */}

                    {/* <View style={styles.gongneng}>
                        <Icons style={styles.gongnengIcon} name='magnifier' />
                    </View>
                    <View style={styles.gongneng}>
                        <Icons style={styles.gongnengIcon} name='plus' /> 
                    </View>  
                    color="#ffbe10" 
                    */}
                    <TouchableOpacity
                        onPress={this.searchWords.bind(this)}>
                        <View style={styles.anniu}>
                            <Text style={styles.searchBtn}><Icons style={styles.icon14} name='magnifier' /> 搜索</Text>
                        </View>
                    </TouchableOpacity>

                </View>


                {
                    this.state.isShowLoading ? <LoadingView /> :
                        <FlatList
                            ref="newsList"
                            // ItemSeparatorComponent={() => {
                            //     return (<View style={styles.line} />)
                            // }}
                            // style={{marginTop:15}}

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

                            //ListHeaderComponent={this.renderSwiper.bind(this)}
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
        // backgroundColor: '#fff',

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
        borderBottomColor: '#e1e1e1',
        borderBottomWidth: 1,
    },

    wutuv: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        padding: 15,
        borderBottomColor: '#e1e1e1',
        borderBottomWidth: 1,
        backgroundColor: '#fff',
        borderRadius: px2dp(6),
    },

    santuv: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        padding: 15,
        borderBottomColor: '#e1e1e1',
        borderBottomWidth: 1,
        backgroundColor: '#fff',
        borderRadius: px2dp(18),
    },

    wutuvttitle: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
        flex: 1,
    },
    wutuvcontent: {
        fontSize: 16,
        color: '#888',
        flex: 1,
        marginTop: 2,
        marginBottom: 5,
    },


    wutuvprice1: {
        fontSize: 18,
        color: '#000',
    },

    wutuvprice2: {
        // marginLeft: 8,
        // textDecorationLine: 'line-through',
        fontSize: 17,
        marginLeft: 20,
        color: '#000',
    },
    wutuvprice21: {
        // marginLeft: 8,
        // textDecorationLine: 'line-through',
        fontSize: 17,
        marginLeft: 20,
        color: '#0000FF',
    },

    wutuvt: {
        flexDirection: 'row',
        marginBottom: 8,
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



    headviewbox: { alignItems: 'flex-start', justifyContent: 'flex-start', },

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
        fontSize: 18,
        // fontWeight: '400',
        // fontWeight: 'bold',
    },


    headview: {
        justifyContent: 'center',
        flexDirection: 'row',
    },





    footBar: {
        flexDirection: 'row',
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20),
        height: px2dp(60),
        borderTopWidth: px2dp(1),
        borderTopColor: '#f5f5f3',
        alignItems: 'center',
        backgroundColor: '#fff',
    },


    searchBox: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        borderWidth: px2dp(1),
        borderRadius: px2dp(5),
        borderColor: '#e1e1e1',
        height: px2dp(40),
        padding: px2dp(5),
        backgroundColor: '#fff',
    },
    searchIcon: {
        marginLeft: px2dp(5),
        fontSize: px2dp(12)
    },
    icon18: {
        fontSize: px2dp(18)
    },
    icon16: {
        fontSize: px2dp(16)
    },
    icon14: {
        fontSize: px2dp(14)
    },
    icon12: {
        fontSize: px2dp(12)
    },
    searchInput: {
        flex: 1,
        color: '#8c8c8c',
        height: px2dp(24),
        fontSize: px2dp(14),
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: px2dp(5),
        paddingRight: px2dp(5),
    },

    gongneng: {
        marginLeft: 20,
    },
    gongnengIcon: {
        fontSize: px2dp(24)
    },

    anniu: {
        // backgroundColor: '#d33d3c',
        height: px2dp(40),
        justifyContent: 'center',
        alignItems: 'center',
        // borderRightWidth: 1,
        // borderColor: '#d33d3c',
    },

    searchBtn: {
        fontSize: px2dp(16),
        textAlign: 'center',
        color: '#d33d3c',
        paddingLeft: px2dp(12),
        // paddingRight: px2dp(5),
    },

    rowldv: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopColor: '#f5f5f5',
        borderTopWidth: 1,
        paddingTop: 8,
        marginTop: 8,
    },

    fontheis16: {
        fontSize: 16,
        color: '#888',
    },


    rowendv: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    rowstartv: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },

    fonthuangsborer16: {
        fontSize: 16,
        color: '#f4a12d',
        borderColor: '#f4a12d',
        borderWidth: 1,
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 4,
        paddingBottom: 4,
        marginLeft: 10,
        borderRadius: 20,
    },

    fonthuangstag14: {
        fontSize: 12,
        color: '#fff',
        backgroundColor: '#f4bc3e',
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 2,
        paddingBottom: 3,
        marginRight: 8,
        borderRadius: 3,
    },

    fonthongstag14: {
        fontSize: 12,
        color: '#fff',
        backgroundColor: '#ed4852',
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 2,
        paddingBottom: 3,
        marginRight: 8,
        borderRadius: 3,
    },











});

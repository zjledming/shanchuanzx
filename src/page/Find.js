'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View, 
    TouchableOpacity, 
    Dimensions,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // 图标 
import Search from './Search'; // 搜索组件  
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'; 
import SqzxPage from './SqzxPage'; 
import FindPage from './FindPage'; 
import FindPageTwo from './FindPageTwo';  
import { px2dp } from '../util/format'; 


var WINDOW_WIDTH = Dimensions.get('window').width;
var head_heigth = WINDOW_WIDTH * 0.5;
var SANTUIMG_WIDTH = (WINDOW_WIDTH - 30) / 3;
var datu_width = WINDOW_WIDTH - 20;
var datu_heigth = datu_width * 0.5;

//  新闻组件 
export default class Find extends Component {
    // 构造函数
    constructor(props) {
        super(props);
        
        this.state = { // 状态
            isRefreshing: false,//下拉控制 是否为最新
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            newsData: [], // 新闻数据
            curChannelIndex: 0, // 当前频道
            channelInfo: [{ 'id': '0', 'flmc': '全部' },  
            ]
        }; // 频道信息
    }

    // 组件挂载
    componentDidMount() {
    }

    componentWillMount() {
        
    }

    componentWillUnmount() {
      }

      


    // 搜索
    navToSearch() {
        this.props.navigator.push({
            component: Search,
            args: {}
        });
    }

    // 渲染页面
    render() {
        const { navigator, route } = this.props; 
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
             {/* <StatusBar
                    barStyle={'light-content'}
                    backgroundColor={'#d33d3c'}
                    // translucent={true} 
                /> */}
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

                <ScrollableTabView

                    // renderTabBar={() => <DefaultTabBar />}
                    // tabBarActiveTextColor={'#047ee6'}
                    // tabBarUnderlineColor={'#047ee6'}
                    // tabBarInactiveTextColor={'#666'}
                    // tabBarBackgroundColor={'white'}
                    // tabBarTextStyle={{ fontSize: 14 }}
                    // scrollWithoutAnimation={false}

                    initialPage={0}
                    locked={true}
                    scrollWithoutAnimation={true}
                    tabBarUnderlineStyle={{ backgroundColor: '#e70012', height: 2, }}
                    renderTabBar={() => <ScrollableTabBar
                        underlineColor='#ce3d3a'
                        activeTextColor='#e70012'
                        inactiveTextColor='#111111'
                        underlineHeight={0}
                        style={{ height: 40, borderWidth: 0, elevation: 2 }}
                        textStyle={{ fontSize: 15 }}
                        tabStyle={{ height: 40, borderWidth: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 }}
                        backgroundColor='#fff'
                    />}

                > 
                    <FindPage tabLabel='热点推荐' params={{type:'2'}} navigator={navigator} />
                    <SqzxPage tabLabel='人性材质学' params={{type:'2'}} navigator={navigator} />
                    <FindPageTwo tabLabel='山川咨询' params={{type:'1'}} navigator={navigator} />
                    <SqzxPage tabLabel='山川研究院' params={{type:'1'}} navigator={navigator} />
                    <SqzxPage tabLabel='山川商学院' params={{type:'1'}} navigator={navigator} />

                </ScrollableTabView>





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
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
import FindxxPage from '../FindxxPage';

import { getchannelInfo } from '../../api/news';



const currentHeight = StatusBar.currentHeight;

export default class XuexiPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
        }
    }


    static navigationOptions = {
        tabBarLabel: '学习',
        tabBarIcon: ({ focused }) => {
            if (focused) {
                return (
                    <Image style={styles.tabBarIcon} source={require('../../img/xx_sel.png')} />
                );
            }
            return (
                <Image style={styles.tabBarIcon} source={require('../../img/xx_nor.png')} />
            );
        },

    };

    // 获取分类
    getTypes() {
        const res = getchannelInfo(); // api接口
        res.then((newsArr) => {
            this.setState({
                items: newsArr
            });
        }).catch((e) => { // 错误异常处理
            ToastAndroid.show(e, ToastAndroid.SHORT); // androidToast
        })
    }

    // 组件挂载
    componentDidMount() {
        this.getTypes(); // 获取新闻数据 
    }


    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }

    componentWillUnmount() {
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


    renderTabView(options) {
        return (
            <FindxxPage key={options.id} tabLabel={options.flmc} params={{ type: options.id }} navigation={this.props.navigation} />
        );
    }

    render() {
        var items = [];

        if (this.state.items) {
            for (var i = 0; i < this.state.items.length; i++) {
                items.push(this.renderTabView(this.state.items[i]));
            }
        }


        return (
            <View style={{ flex: 1 }}>
                <StatusBar
                    translucent={false}
                    animated={false}
                    backgroundColor={"#d33d3c"}
                    barStyle={"light-content"}
                />


                <View style={styles.headerBar}>
                    <Image style={styles.beghedimg} source={require('../../img/wyxx.png')} >
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
                        <Text style={styles.endhedtext}>20</Text>
                    </TouchableOpacity>
                </View>


                <ScrollableTabView

                    // tabBarActiveTextColor={'#047ee6'}
                    // tabBarUnderlineColor={'#047ee6'}
                    // tabBarInactiveTextColor={'#666'}
                    // tabBarBackgroundColor={'white'}
                    // tabBarTextStyle={{ fontSize: 14 }}
                    // scrollWithoutAnimation={false}

                    initialPage={0} // 默认选择的页面，默认为0。
                    locked={false} // 阻止滑动，默认为false
                    scrollWithoutAnimation={true} //是否不显示指示条的左右移动的动画，默认`false
                    tabBarUnderlineStyle={{ backgroundColor: '#e70012', height: 2, }} // TabBar指示器的样式:选中下划线的样式
                    renderTabBar={() => <ScrollableTabBar
                        // underlineColor='#ce3d3a'
                        activeTextColor='#e70012' // 选中标题字体颜色
                        inactiveTextColor='#111111' // 未选中标题字体颜色
                        // underlineHeight={0} 
                        style={{ height: 40, borderWidth: 0, elevation: 2, }} // tabbar的高度 边框 层级
                        textStyle={{ fontSize: 15 }}
                        tabStyle={{ height: 40, borderWidth: 0, paddingBottom: 0, paddingLeft: 10, paddingRight: 10 }}
                        backgroundColor='#fff'
                    />}

                >

                    {/* <FindxxPage tabLabel='全部' params={{ type: '0' }} navigation={this.props.navigation} />
                 {items} */}

                    <Text style={styles.textStyle} tabLabel='关注' onPress={() => {
                        this._onPress();
                    }}>跳转到Web</Text>
                    <Text style={styles.textStyle} tabLabel='粉丝'>粉丝</Text>
                    <Text style={styles.textStyle} tabLabel='推荐'>推荐</Text>


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

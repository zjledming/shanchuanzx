import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    RefreshControl,
    StatusBar,
    PixelRatio, ScrollView, ToastAndroid,
    TouchableOpacity, ImageBackground, TouchableWithoutFeedback,
} from 'react-native';
import px2dp from "../../utils/px2dp";
import Item from "../../common/Item";
import NavBar from "../../common/NavBar";
import * as LoginInfo from '../Login/LoginInfo';
import ImagePicker from "react-native-image-picker";
import { checkIsNull, IsSpace } from '../../utils/CheckUitls';
import ToastUtil from "../../utils/ToastUtil";
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getZjf, getyhnums } from '../../api/news';
import mstyles from '../../utils/mstyles';


let { width, height } = Dimensions.get('window');
const sHeight = StatusBar.currentHeight;
var width05 = width * 0.5;
var width025 = width * 0.25;
var width036 = width * 0.36;
var width033 = (width - 40) * 0.33;
const itemHeight = px2dp(45);
const Font = {
    Ionicons,
    FontAwesome
}



export default class MinePage extends Component {
    static navigationOptions = {
        tabBarLabel: '我的',
        tabBarIcon: ({ focused }) => {
            if (focused) {
                return (
                    <Image style={styles.tabBarIcon} source={require('../../img/wd_sel.png')} />
                );
            }
            return (
                <Image style={styles.tabBarIcon} source={require('../../img/wd_nor.png')} />
            );
        },
    };

    constructor(props) {
        super(props);
        var isLogin_ = LoginInfo.isLogin();
        var user_ = LoginInfo.getUserInfo();
        this.state = {
            isRefreshing: false,
            avatarSource: null,
            isLogin: isLogin_,
            user: user_,
            zjf: 0,
            pls: 0,
            scs: 0,

        };
        this.config = [
            { icon: "ios-person", name: "我的账户信息", color: "#fc7b53", subName: "个人信息", onPress: this.goProfile.bind(this) },
            { icon: "md-flower", name: "修改密码", color: "#ffc636", subName: "保护账户安全", onPress: this.goForgetPsw.bind(this) },
            // { icon: "ios-heart", name: "我的收藏" },
            // { icon: "logo-usd", name: "学习积分", subName: this.state.zjf+'', onPress: this.xxjf.bind(this) },
            // { icon: "ios-cart", name: "积分商城", subName: "0元好物在这里", color: "#94d94a" },
            // { icon: "ios-pie", name: "推荐有奖", subName: "10点算力", color: "#fc7b53" },

            // { icon: "ios-medal", name: "银行卡", subName: "未绑定", },
            // { icon: "ios-pin", name: "支付设置" },
            // { icon: "ios-outlet", name: "欢迎评分", color: "#ffc636" },
            // { icon: "md-contacts", name: "关于我们" },
        ]
    }


    componentDidMount() {
        // this._onRefresh()
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            // 如果state中是未登录状态，需要再次检查是否登陆了，如果登录了，需要在这里进行重新set
            // 在其他界面登录了切换过来 就有可能出现这种现象

             // 先判断是否登录了
             if (LoginInfo.isLogin()) {
                 // 查询并更新当前积分
                this.getnums();
                this.setState({
                    isLogin: LoginInfo.isLogin(),
                    user: LoginInfo.getUserInfo(),
                })
            } else {
             
            }
            
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }


    _onRefresh() {
        this.setState({ isRefreshing: true });
        setTimeout(() => {
            this.setState({ isRefreshing: false });
        }, 1500)
    }

    _renderListItem() {
        return this.config.map((item, i) => {
            if (i % 3 === 0) {
                item.first = true
            }
            return (<Item key={i} {...item} />)
        })
    }

    // 获取banner数据
    getnums() {

        if (this.state.isLogin) {
            const res = getyhnums(this.state.user.phone); // api接口
            res.then((newsObj) => {
                this.setState({
                    isRefreshing: false,
                    zjf: newsObj.zjf,
                    pls: newsObj.pls,
                    scs: newsObj.scs,
                });
            }).catch((e) => { // 错误异常处理
                ToastAndroid.show(e, ToastAndroid.SHORT); // androidToast
            })

        }
        // else {
        //     this.loginindex();
        // }

    }


    // 刷新头部
    refreshHandle() {
        this.setState({
            isRefreshing: true,//tag,下拉刷新中，加载完全，就设置成flase
        }, () => {
            this.getnums();
        });
    }


    render() {
        //ToastUtil.showShort('render');
        return (
            <View style={{ flex: 1, backgroundColor: "#f3f3f3" }}>
                {/* <StatusBar
                    translucent={true}
                    animated={true}
                /> */}
                {/* <StatusBar 
                    translucent={false}
                    animated={false}
                    backgroundColor={"#fff"}
                    barStyle={"default"}
                /> */}

                {/* <View style={styles.sBar} backgroundColor={'#d33d3c'} /> */}
                {/* <NavBar
                    title="我的"
                    // leftIcon="ios-notifications-outline"
                    // leftPress={this.leftPress.bind(this)}
                    rightIcon="ios-settings-outline"
                    rightPress={this.rightPress.bind(this)}
                /> */}
                <ImageBackground source={require('../../img/grzxbj.png')} style={styles.imgbg}>

                    <View style={styles.userHead}>
                        <View style={{ flex: 1, flexDirection: "row" }}>

                            <TouchableOpacity onPress={this.loginindex.bind(this)}>
                                {/* <TouchableOpacity onPress={this._onPress.bind(this)}>   </TouchableOpacity>*/}
                                <View
                                    style={[styles.avatar, styles.avatarContainer, { marginBottom: 20 }]}>
                                    {/* {this.state.avatarSource === null ? */}
                                    {LoginInfo.isLogin() ?
                                        <Image style={styles.avatar}
                                            source={require('../../img/dltx.png')} /> :
                                            <Image style={styles.avatar}
                                            source={require('../../img/yhtx.png')} />
                                    }
                                </View>
                            </TouchableOpacity>

                            <View style={{ flex: 1, marginLeft: 10, paddingVertical: 5 }}>
                                {
                                    this.state.isLogin ?
                                        <Text style={styles.textbais18} onPress={this.loginindex.bind(this)} >{this.state.user.realname}</Text>
                                        :
                                        <Text style={styles.textbais18} onPress={this.loginindex.bind(this)} >点击登录</Text>
                                }

                                <View style={{ marginTop: px2dp(5), flexDirection: "row" }}>
                                    <Ionicons name="ios-phone-portrait-outline" size={px2dp(14)} color="#fff" />
                                    {
                                        this.state.isLogin ?
                                            <Text style={styles.textbais13} onPress={this.loginindex.bind(this)} >{this.state.user.username}</Text>
                                            :
                                            <Text style={styles.textbais13} onPress={this.loginindex.bind(this)} >您还未登录</Text>
                                    }
                                </View>
                            </View>


                        </View>
                    </View>

                </ImageBackground>



                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}
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

                    {/* 
                    <View
                        style={styles.scrollView}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._onRefresh.bind(this)}
                                tintColor="#fff"
                                colors={['#ddd', '#0398ff']}
                                progressBackgroundColor="#ffffff"
                            />
                        }> */}




                    <View style={{
                        minHeight: height - 64 - px2dp(46),
                        paddingBottom: 60,
                        backgroundColor: "#f3f3f3"
                    }}>


                        <View style={styles.rowv}>
                            <TouchableOpacity onPress={this.xxjf.bind(this)}>
                                <View style={styles.borderv}>
                                    {/* <View style={styles.bordertop}>
                                        <Ionicons name="ios-people" size={px2dp(28)}
                                            color="#68a0ea" />
                                    </View> */}
                                    <Text style={styles.textshenls20}>{this.state.zjf}</Text>
                                    <Text style={mstyles.text14huis}>我的积分</Text>
                                </View>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={this.wdpingl.bind(this)}>
                                <View style={[styles.borderv, mstyles.borderleft]}>
                                    {/* <View style={styles.bordertop}>
                                        <Ionicons name="ios-text" size={px2dp(27)}
                                            color="#55a491" />
                                    </View> */}
                                    <Text style={styles.textshenls20}>{this.state.pls}</Text>
                                    <Text style={mstyles.text14huis}>我的评论</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={this.wdshouc.bind(this)}>
                                <View style={[styles.borderv, mstyles.borderleft]}>
                                    {/* <View style={styles.bordertop}>
                                        <Ionicons name="ios-heart" size={px2dp(25)}
                                            color="#f3b369" />
                                    </View> */}
                                    <Text style={styles.textshenls20}>{this.state.scs}</Text>
                                    <Text style={mstyles.text14huis}>我的收藏</Text>
                                </View>
                            </TouchableOpacity>


                        </View>

                        <View>
                            {this._renderListItem()}
                        </View>


                        <TouchableWithoutFeedback onPress={this.wdkehu.bind(this)}>
                            <View style={styles.listItemmargin} >
                                <Ionicons name="ios-people" size={px2dp(20)}
                                    style={{ width: 22, marginRight: 5, textAlign: "center" }}
                                    color={"#68a0ea"} />
                                <View style={[styles.listInfo, { borderTopWidth: 1 }]}>
                                    <View style={{ flex: 1 }}><Text>我的客户</Text></View>
                                    <View style={styles.listInfoRight}>
                                        <Text style={{ color: "#aaa", fontSize: px2dp(14) }}>个人客户资料库</Text>
                                        <Font.Ionicons style={{ marginLeft: 10 }} name="ios-arrow-forward-outline"
                                            size={px2dp(18)} color="#bbb" />
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={this.wddingd.bind(this)}>
                            <View style={styles.listItem} >
                                <Ionicons name="md-list-box" size={px2dp(20)}
                                    style={{ width: 22, marginRight: 5, textAlign: "center" }}
                                    color={"#ea825d"} />
                                <View style={[styles.listInfo, { borderTopWidth: 1 }]}>
                                    <View style={{ flex: 1 }}><Text>我的订单</Text></View>
                                    <View style={styles.listInfoRight}>
                                        <Text style={{ color: "#aaa", fontSize: px2dp(14) }}>订单信息记录</Text>
                                        <Font.Ionicons style={{ marginLeft: 10 }} name="ios-arrow-forward-outline"
                                            size={px2dp(18)} color="#bbb" />
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>


                        <TouchableWithoutFeedback onPress={this.jfsc.bind(this)}>
                            <View style={styles.listItem} >
                                <Ionicons name="ios-cart" size={px2dp(20)}
                                    style={{ width: 22, marginRight: 5, textAlign: "center" }}
                                    color={"#94d94a"} />
                                <View style={[styles.listInfo, { borderTopWidth: 1 }]}>
                                    <View style={{ flex: 1 }}><Text>积分商城</Text></View>
                                    <View style={styles.listInfoRight}>
                                        <Text style={{ color: "#aaa", fontSize: px2dp(14) }}>积分兑换领好礼</Text>
                                        <Font.Ionicons style={{ marginLeft: 10 }} name="ios-arrow-forward-outline"
                                            size={px2dp(18)} color="#bbb" />
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>


                        <TouchableWithoutFeedback onPress={this.dhjl.bind(this)}>
                            <View style={styles.listItem} >
                                <Ionicons name="md-paper" size={px2dp(20)}
                                    style={{ width: 22, marginRight: 5, textAlign: "center" }}
                                    color={"#fc7b53"} />
                                <View style={[styles.listInfo, { borderTopWidth: 1 }]}>
                                    <View style={{ flex: 1 }}><Text>我的兑换记录</Text></View>
                                    <View style={styles.listInfoRight}>
                                        <Text style={{ color: "#aaa", fontSize: px2dp(14) }}>实时查看状态</Text>
                                        <Font.Ionicons style={{ marginLeft: 10 }} name="ios-arrow-forward-outline"
                                            size={px2dp(18)} color="#bbb" />
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>


                        <TouchableWithoutFeedback onPress={this.xxbb.bind(this)}>
                            <View style={styles.listItem} >
                                <Ionicons name="ios-stats" size={px2dp(20)}
                                    style={{ width: 22, marginRight: 5, textAlign: "center" }}
                                    color={"#ffc636"} />
                                <View style={[styles.listInfo, { borderTopWidth: 1 }]}>
                                    <View style={{ flex: 1 }}><Text>我的学习报表</Text></View>
                                    <View style={styles.listInfoRight}>
                                        <Text style={{ color: "#aaa", fontSize: px2dp(14) }}>好好学习、天天向上</Text>
                                        <Font.Ionicons style={{ marginLeft: 10 }} name="ios-arrow-forward-outline"
                                            size={px2dp(18)} color="#bbb" />
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>



                        <TouchableWithoutFeedback onPress={this.wdhc.bind(this)}>
                            <View style={styles.listItem} >
                                <Ionicons name="md-download" size={px2dp(20)}
                                    style={{ width: 22, marginRight: 5, textAlign: "center" }}
                                    color={"#00c0ef"} />
                                <View style={[styles.listInfo, { borderTopWidth: 1 }]}>
                                    <View style={{ flex: 1 }}><Text>我的缓存</Text></View>
                                    <View style={styles.listInfoRight}>
                                        <Text style={{ color: "#aaa", fontSize: px2dp(14) }}>离线阅读</Text>
                                        <Font.Ionicons style={{ marginLeft: 10 }} name="ios-arrow-forward-outline"
                                            size={px2dp(18)} color="#bbb" />
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>



                        <TouchableWithoutFeedback onPress={this.dbsx.bind(this)}>
                            <View style={styles.listItem} >
                                <Ionicons name="ios-notifications-outline" size={px2dp(20)}
                                    style={{ width: 22, marginRight: 5, textAlign: "center" }}
                                    color={"#00a65a"} />
                                <View style={[styles.listInfo, { borderTopWidth: 1 }]}>
                                    <View style={{ flex: 1 }}><Text>我的事项</Text></View>
                                    <View style={styles.listInfoRight}>
                                        <Text style={{ color: "#aaa", fontSize: px2dp(14) }}>时间管理小助手</Text>
                                        <Font.Ionicons style={{ marginLeft: 10 }} name="ios-arrow-forward-outline"
                                            size={px2dp(18)} color="#bbb" />
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>


                        {/* <TouchableWithoutFeedback onPress={this.xxbb.bind(this)}>
                            <View style={styles.listItem} >
                                <Ionicons name="ios-checkmark-circle-outline" size={px2dp(20)}
                                    style={{ width: 22, marginRight: 5, textAlign: "center" }}
                                    color={"#00c0ef"} />
                                <View style={[styles.listInfo, { borderTopWidth: 1 }]}>
                                    <View style={{ flex: 1 }}><Text>我的已办事项</Text></View>
                                    <View style={styles.listInfoRight}>
                                        <Text style={{ color: "#aaa", fontSize: px2dp(14) }}>记录生活足迹</Text>
                                        <Font.Ionicons style={{ marginLeft: 10 }} name="ios-arrow-forward-outline"
                                            size={px2dp(18)} color="#bbb" />
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback> */}


                        <TouchableWithoutFeedback onPress={this.guany.bind(this)}>
                            <View style={styles.listItemmargin} >
                                <Ionicons name="ios-information-circle-outline" size={px2dp(20)}
                                    style={{ width: 22, marginRight: 5, textAlign: "center" }}
                                    color={"#68a0ea"} />
                                <View style={[styles.listInfo, { borderTopWidth: 1 }]}>
                                    <View style={{ flex: 1 }}><Text>关于</Text></View>
                                    <View style={styles.listInfoRight}>
                                        {/* <Text style={{ color: "#aaa", fontSize: px2dp(14) }}>时间管理小助手</Text> */}
                                        <Font.Ionicons style={{ marginLeft: 10 }} name="ios-arrow-forward-outline"
                                            size={px2dp(18)} color="#bbb" />
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>




                    </View>
                    {/* </View> */}
                </ScrollView>

            </View>
        )
    }

    _onPress() {
        const options = {
            title: "选择图片",
            cancelButtonTitle: "取消",
            chooseFromLibraryButtonTitle: "从相册中选择",
            takePhotoButtonTitle: "拍照",
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };

                // You can also display the image using data:
                // let source = {uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatarSource: source
                });
            }
        });
    }


    test() {
        //this.props.navigation.navigate('News');
        var obj = {
            url: "app/jsp/shanc/czmm.jsp",
            name: "修改密码",
        };
        this.props.navigation.navigate('DetailListScreen', obj);

    }

    goProfile() {
        if (this.state.isLogin) {
            this.props.navigation.navigate('UserProfile',
                {
                    // info: info,
                    callback: ((info) => { //回调函数
                        // 详情退出回调了-表示退出了
                        this.setState({
                            isLogin: false,
                            user: {},
                        })
                    })
                });
        } else {
            this.loginindex();
        }

    }


    getZjf() {
        // if (LoginInfo.isLogin()) {
        const res = getZjf(this.state.user.username); // api接口
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



    jfsc() {
        if (this.state.isLogin) {
            // var obj = {
            //     url: "app/jsp/shanc/jfsc.jsp?appu_id="+this.state.user.username+'&appu_jf='+this.state.user.zjf+'&appu_name='+this.state.user.realname,
            //     name: "积分商城",
            // };
            // this.props.navigation.navigate('DetailListScreen', obj);

            let url_ = "app/jsp/shanc/jfsc.jsp?appu_id=" + this.state.user.username + '&appu_jf=' + this.state.user.zjf + '&appu_name=' + this.state.user.realname;
            this.props.navigation.navigate('WebScreen', {
                url: url_,
                name: "积分商城",
                // info: info,
                callback: ((info) => { //回调函数
                    // 回调重新加载总积分
                    this.getZjf();
                })
            });

        } else {
            this.loginindex();
        }


    }



    dhjl() {
        if (this.state.isLogin) {

            let url_ = "app/jsp/shanc/dhjl.jsp?appu_id=" + this.state.user.username + '&appu_jf=' + this.state.user.zjf + '&appu_name=' + this.state.user.realname;
            this.props.navigation.navigate('WebScreen', {
                url: url_,
                name: "兑换记录",
                // info: info,
                // callback: ((info) => { //回调函数
                //     // 回调重新加载总积分
                //    this.getZjf();
                // })
            });

        } else {
            this.loginindex();
        }


    }


    xxbb() {
        if (this.state.isLogin) {

            let url_ = "app/jsp/shanc/zjtj.jsp?appu_id=" + this.state.user.username;
            this.props.navigation.navigate('WebScreen', {
                url: url_,
                name: "学习报表",
                // info: info,
                // callback: ((info) => { //回调函数
                //     // 回调重新加载总积分
                //    this.getZjf();
                // })
            });

        } else {
            this.loginindex();
        }
    }


    dbsx() {
        if (this.state.isLogin) {
            this.props.navigation.navigate('TxsxPage', { username: this.state.user.username, realname: this.state.user.realname });
        } else {
            this.loginindex();
        }
    }

    guany() {
        this.props.navigation.navigate('GuanyPage');
    }


    wdhc() {
        // 缓存列表
        this.props.navigation.navigate('FindhcPage');
    }




    xxjf() {
        if (this.state.isLogin) {
            this.props.navigation.navigate('Xxjf',
                {
                    // info: info,
                    callback: ((info) => { //回调函数
                        // 详情退出回调了-表示退出了
                        this.setState({
                            isLogin: false,
                            user: {},
                        })
                    })
                });
        } else {
            this.loginindex();
        }

    }

    goForgetPsw() {
        // this.props.navigation.navigate('ForgetPsw');

        if (this.state.isLogin) {
            let url_ = "app/jsp/shanc/czmm.jsp?password=" + this.state.user.password;
            this.props.navigation.navigate('DetailListScreen', {
                url: url_,
                name: "修改密码",
            });
        } else {
            this.loginindex();
        }

    }

    loginindex() {
        if (!this.state.isLogin) {
            //this.props.navigation.navigate('LoginIndex');
            this.props.navigation.navigate('LoginIndex',
                {
                    // info: info,
                    callback: ((info) => { //回调函数
                        // 第二手准备，当登录界面数据没有存储成功的时候，这里还有补救措施
                        //LoginInfo.setUserInfo(info);
                        this.setState({
                            isLogin: true,
                            user: info,
                        })
                    })
                }

            );
        } else {

        }

    }

    wdkehu() {
        if (this.state.isLogin) {
            this.props.navigation.navigate('KehuPage', { username: this.state.user.username, realname: this.state.user.realname });
        } else {
            this.loginindex();
        }
    }


    wddingd() {
        if (this.state.isLogin) {
            this.props.navigation.navigate('DingdPage', { username: this.state.user.username, realname: this.state.user.realname });
        } else {
            this.loginindex();
        }
    }


    wdshouc() {
        if (this.state.isLogin) {
            this.props.navigation.navigate('FindscPage', { username: this.state.user.username });
        } else {
            this.loginindex();
        }
    }

    wdpingl() {
        if (this.state.isLogin) {
            this.props.navigation.navigate('FindplPage', { username: this.state.user.username });
        } else {
            this.loginindex();
        }
    }

}
const styles = StyleSheet.create({
    scrollView: {
        marginBottom: px2dp(5),
        backgroundColor: "#1E82D2"
    },
    sBar: {
        height: sHeight,
        width: width
    },
    userHead: {
        paddingBottom: 5,
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginTop: px2dp(20),
        // backgroundColor: "#d33d3c"
    },
    numbers: {
        flexDirection: "row",
        backgroundColor: "#fff",
        height: 74
    },
    numItem: {
        flex: 1,
        height: 74,
        justifyContent: "center",
        alignItems: "center"
    },
    tabBarIcon: {
        width: 19,
        height: 19
    },
    quitContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    avatarContainer: {
        backgroundColor: '#fff',
        // borderColor: '#fff',
        // borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        borderRadius: 60,
        width: 60,
        height: 60,
        borderColor: '#fff',
        borderWidth: 1,
    },



    rowv: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },



    bordertop: {
        height: px2dp(25),
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },

    borderv: {
        alignItems: 'center', justifyContent: 'center', width: width033,
    },


    img50: {
        height: 50,
        width: 50,
    },


    textshenls20: {
        fontSize: 22,
        color: '#000',
    },


    textbais18: {
        color: "#fff",
        fontSize: px2dp(18)
    },

    textbais13: {
        color: "#fff",
        fontSize: 13,
        paddingLeft: 5
    },


    imgbg: {
        height: width036,
        width: width,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },


    listItem: {
        height: itemHeight,
        paddingLeft: 16,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    listItemmargin: {
        marginTop: px2dp(10),
        height: itemHeight,
        paddingLeft: 16,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        height: itemHeight,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center"
    },
    listInfo: {
        height: itemHeight,
        flex: 1,
        paddingRight: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopColor: "#f5f5f5"
    },
    listInfoRight: {
        flexDirection: "row",
        alignItems: "center"
    }





});

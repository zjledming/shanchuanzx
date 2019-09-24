'use strict';

import React, { Component } from 'react'
import {
    Text, Image,
    View,
    ScrollView,
    StyleSheet,
    StatusBar, TouchableOpacity,
    Dimensions, BackHandler
} from 'react-native'
import NavBar from '../../common/NavBar'
import Item from '../../common/Item'
import * as LoginInfo from '../Login/LoginInfo';
import { isSpace } from '../../util/format';
import px2dp from '../../utils/px2dp';
import ToastUtil from "../../utils/ToastUtil";

const { width } = Dimensions.get('window');
var user = {};
//FontAwesome
export default class Kechengbuy extends Component {
    static navigationOptions = {
        header: null
    };
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

    constructor(props) {
        super(props);
        this.state = {
            khinfo: {},
            zffs: 'wx',
        };
        this.params = this.props.navigation.state.params;
        user = LoginInfo.getUserInfo();
    }


    back() {
        this.props.navigation.pop();
    }

    xzkehu() {
        this.props.navigation.navigate('KehuxzPage',
            {
                // info: info,
                callback: ((khinfo) => { //回调函数
                    // 回调了就是登录成功了
                    this.setState({
                        khinfo: khinfo,
                    })
                })
            }

        );
    }


    // 提交订单
    tjdd() {
        let khinfo = this.state.khinfo;
        if (isSpace(khinfo) || isSpace(khinfo.id)) {
            ToastUtil.showShort('请选择客户');
            return;
        }
        let zffs = this.state.zffs;
        // 跳转到扫码界面  + "&kc_name=" + this.params.kcinfo.title 
        // let url_ = "app/jsp/shanc/scewm.jsp?kh_id=" + khinfo.id+ "&kh_name=" + khinfo.realname+ "&kh_qymc=" + khinfo.qymc + "&kh_phone=" + khinfo.phone  + "&kc_id=" + this.params.kcinfo.id + "&kc_ddje=" + this.params.kcinfo.jiage + "&appu_id=" + user.phone+ "&appu_name=" + user.realname;
        //url_ = url_.replace('&','%26');
        // 传id 就可以了，客户 购买了 哪个产品 销售是哪个
        let url_ = "app/jsp/shanc/scewm.jsp?kh_id=" + khinfo.id  + "&kc_id=" + this.params.kcinfo.id  + "&appu_id=" + user.phone + "&zffs=" + zffs;
        if (zffs == 'wx') {
            // 微信支付
            this.props.navigation.navigate('WebScreen', {
                url: url_,
                name: "微信扫码支付",
                // info: info,
                callback: ((info) => { //回调函数
                    // 回调了
                    // this.fetchNewsData(0, 10);
                    
                })
            });
        }




    }


    xzzffs(zffs_) {
        this.setState({
            zffs: zffs_,
        })
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#f3f3f3" }}>
                {/* <View style={styles.sBar} backgroundColor={'#1E82D2'}/> */}
                <StatusBar
                    backgroundColor={"#d33d3c"}
                    barStyle={"light-content"}
                />
                <NavBar
                    title="立即购买"
                    leftIcon="md-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <ScrollView>
                    <Text style={styles.title}>{"产品信息"}</Text>
                    <Item name="产品名称" disable={true} subName={this.params.kcinfo.title} />
                    <Item name="合作团队" disable={true} subName={this.params.kcinfo.jiangshi} />
                    <Item name="合作时间" disable={true} subName={this.params.kcinfo.skms} />
                    <Item name="合作价格" disable={true} subName={this.params.kcinfo.jiage + '元'} />
                    <Text style={styles.title}>{"客户信息"}</Text>
                    <Item name="企业名称" subName={isSpace(this.state.khinfo.qymc) ? "请选择" : this.state.khinfo.qymc} onPress={this.xzkehu.bind(this)} />
                    <Item name="客户姓名" subName={this.state.khinfo.realname} disable={true} />
                    <Item name="联系电话" subName={this.state.khinfo.phone} disable={true} />
                    <Text style={styles.title}>{"支付方式"}</Text>
                    <TouchableOpacity onPress={this.xzzffs.bind(this, 'wx')}>
                        <View style={styles.vrow}>
                            {this.state.zffs == 'wx' ?
                                <Image source={require('../../img/icon_select.png')} style={styles.imgzffs} /> :
                                <Image source={require('../../img/icon_unselect.png')} style={styles.imgzffs} />
                            }
                            <Text style={{}}>微信</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.xzzffs.bind(this, 'zfb')}>
                        <View style={styles.vrow}>
                            {this.state.zffs == 'zfb' ?
                                <Image source={require('../../img/icon_select.png')} style={styles.imgzffs} /> :
                                <Image source={require('../../img/icon_unselect.png')} style={styles.imgzffs} />
                            }
                            <Text style={{}}>支付宝</Text>
                        </View>
                    </TouchableOpacity>

                    <Item.Button name="提交订单" first={true} onPress={this.tjdd.bind(this)} />


                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    title: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        color: "#666"
    },
    sBar: {
        height: StatusBar.currentHeight,
        width: width
    },

    vrow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: px2dp(45), backgroundColor: '#fff',
        paddingHorizontal: px2dp(16),
        marginBottom: px2dp(1),
    },

    imgzffs: {
        width: px2dp(20), height: px2dp(20),
    }
});

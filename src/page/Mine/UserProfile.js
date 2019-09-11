/**
 * @author lam
 */
'use strict';

import React, {Component} from 'react'
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    StatusBar,
    Dimensions, BackHandler
} from 'react-native'
import NavBar from '../../common/NavBar'
import Item from '../../common/Item'
import * as LoginInfo from '../Login/LoginInfo';

const {width} = Dimensions.get('window');
var user = {};
//FontAwesome
export default class UserProfile extends Component {
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
        super(props)
        user = LoginInfo.getUserInfo();
    }

    back() {
        this.props.navigation.pop();
    }


    logout() {
        LoginInfo.loginOut();
        //this.props.navigation.navigate('LoginIndex');
        if (this.props.navigation.state.params.callback) {
            this.props.navigation.state.params.callback({});
            this.props.navigation.goBack();
        }
        
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                {/* <View style={styles.sBar} backgroundColor={'#1E82D2'}/> */}
                <NavBar
                    title="账户信息"
                    leftIcon="ios-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <ScrollView>
                    {/* <Item name="头像" avatar={11} first={true}/>
                    <Item name="用户名" disable={true} subName="RuiTong"/>
                    <Text style={styles.title}>{"账号绑定"}</Text>
                    <Item name="手机" font="FontAwesome" icon="mobile" subName="135****0418"/>
                    <Item name="微信" color="#1bce4a" iconSize={15} font="FontAwesome" icon="wechat"
                          subName="已绑定"/>
                    <Item name="QQ" color="#ce3c1b" iconSize={15} font="FontAwesome" icon="qq"
                          subName="未绑定"/>
                    <Item name="微博" color="#fa7d3c" iconSize={16} font="FontAwesome" icon="weibo"
                          subName="未绑定"/>
                    <Text style={styles.title}>{"安全设置"}</Text>
                    <Item name="登录密码" subName="未绑定"/>
                    <Item name="支付密码" subName="未绑定"/>
                    <Item name="小额免密支付"/> */}

                    <Item name="用户名" disable={true} first={true} subName={user.username}/>
                    <Item name="姓名" disable={true}   subName={user.realname}/>
                    <Item name="所属区域" disable={true}  subName={user.ssqy}/>

                    <Item.Button name="退出登录" first={true} onPress={this.logout.bind(this)}/>


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
    }
});

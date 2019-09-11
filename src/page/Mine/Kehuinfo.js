/**
 * @author lam
 */
'use strict';

import React, { Component } from 'react'
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

const { width } = Dimensions.get('window');
var user = {};
//FontAwesome
export default class Kehuinfo extends Component {
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
        this.params = this.props.navigation.state.params;
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

    back() {
        this.props.navigation.pop();
    }


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#f3f3f3" }}>
                {/* <View style={styles.sBar} backgroundColor={'#1E82D2'}/> */}
                <NavBar
                    title="客户信息"
                    leftIcon="md-arrow-back"
                    leftPress={this.back.bind(this)}
                />
                <ScrollView
                    contentContainerStyle={{ marginTop: 10 }}
                >

                    <Item name="企业名称" disable={true} subName={this.params.kehuinfo.qymc} />
                    <Item name="客户姓名" disable={true} subName={this.params.kehuinfo.realname} />
                    <Item name="客户职位" disable={true} subName={this.params.kehuinfo.zhiwu} />
                    <Item name="联系电话" disable={true} subName={this.params.kehuinfo.phone} />
                    <Item name="所属行业" disable={true} subName={this.params.kehuinfo.hangye} />
                    <Item name="企业规模" disable={true} subName={this.params.kehuinfo.guimo} />
                    <Item name="所属区域" disable={true} subName={this.params.kehuinfo.ssqy} />
                    {/* <Item.Button name="退出登录" first={true} onPress={this.logout.bind(this)}/> */}

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

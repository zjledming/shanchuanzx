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

import NavBar from '../common/NavBar'
import Item from '../common/Item'

const {width} = Dimensions.get('window');
var user = {};
//FontAwesome
export default class Dingdxq extends Component {
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

          // user = LoginInfo.getUserInfo();
          user = this.props.navigation.state.params.info;
          if(user.remark1 == 'wx'){
              user.zffs = '微信';
          }else if(user.remark1 == 'zfb'){
              user.zffs = '支付宝';
          }else {
             user.zffs = '';
          }
          
       
    }

    componentDidMount(){
       
    }

    

    back() {
        this.props.navigation.pop();
    }


    logout() {
        // LoginInfo.loginOut();
        // //this.props.navigation.navigate('LoginIndex');
        // if (this.props.navigation.state.params.callback) {
        //     this.props.navigation.state.params.callback({});
        //     this.props.navigation.goBack();
        // }
        
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                {/* <View style={styles.sBar} backgroundColor={'#1E82D2'}/> */}
                <NavBar
                    title="订单详情"
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
                    <Text style={styles.title}>{"产品信息"}</Text>
                    <Item name="产品名称" disable={true}  subName={user.kc_name}/>
                    <Item name="合作价格" disable={true}   subName={user.kc_ddje+ '元'}/>
                    <Text style={styles.title}>{"客户信息"}</Text>
                    <Item name="企业名称" disable={true}  subName={user.kh_qymc}/>
                    <Item name="客户姓名" disable={true}   subName={user.kh_name}/>
                    <Item name="联系电话" disable={true}  subName={user.kh_phone}/>
                    <Text style={styles.title}>{"订单信息"}</Text>
                    <Item name="订单号" disable={true}  subName={user.ddh}/>
                    <Item name="下单时间" disable={true}  subName={user.xdsj}/>
                    <Item name="支付时间" disable={true}  subName={user.zfsj}/>
                    <Item name="支付方式" disable={true} subName={user.zffs}/>
                    <Item name="支付金额" disable={true}   subName={user.kc_ddje+ '元'}/>

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

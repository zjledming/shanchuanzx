'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,Dimensions
} from 'react-native';
import NavBar from '../common/NavBar';
import { px2dp } from '../util/format';

let { width, height } = Dimensions.get('window');

export default class GuanyPage extends Component {
    static navigationOptions = {
        header: null
    };

    // 构造函数
    constructor(props) {
        super(props);
        // 获取传递参数
        // this.params = this.props.navigation.state.params;
        this.state = { // 状态
        };
    }

    componentWillMount() {
    }

    compennetDidUnmount() {
    }
    // 组件挂载
    componentDidMount() {
    }

    componentWillUnmount() {
    }


    back() {
        this.props.navigation.pop();
    }

    // 渲染页面
    render() {
        return (

            <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>

                <NavBar
                    title="关于"
                    leftIcon="md-arrow-back"
                    leftPress={this.back.bind(this)}
                />

                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: px2dp(100) }}>

                    <Image style={{ width: px2dp(200), height: px2dp(41) }} source={require('../img/logo.png')}></Image>
                    <Text style={{fontSize:px2dp(16),color:"#aaa"}}>V1.0</Text>




                </View >

                <View style={{ position: "absolute", bottom: px2dp(50),width:width, justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={{textAlign:'center'}}>Copyright © 2008-2019</Text>
                    <Text style={{textAlign:'center'}}>sczx365.com 版权所有</Text>
                </View>

            </View >
        )
    }

}

// css样式
const styles = StyleSheet.create({


});

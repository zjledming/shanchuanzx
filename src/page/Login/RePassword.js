import React, { Component } from 'react';
import {
    Platform,
    View,
    Image,
    Dimensions,
    BackHandler, SafeAreaView, StatusBar, StyleSheet, Text, Keyboard,
} from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { isIphoneX, zAppBarHeight, zdp, zStatusBarHeight } from "../../utils/ScreenUtil";
import MyTextInputWithIcon from "../../common/MyTextInputWithIcon";
import MyButtonView from "../../common/MyButtonView";
import ToastUtil from "../../utils/ToastUtil";
import { fetchRequest } from "../../utils/FetchUtil";
import { checkIsNull, checkMobile } from "../../utils/CheckUitls";
import * as LoginInfo from './LoginInfo';

import MyTabView from "../../common/MyTabView";

const { width, height } = Dimensions.get('window');

export default class RePassword extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            passwordSure: '',
            recommend: ''
        }
    }

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    onBackPress = () => {
        this.props.navigation.goBack();
        return true;
    };


    render() {
        return (
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'center'
            }}>

                <KeyboardAwareScrollView
                    style={{
                        flex: 1, backgroundColor: 'white',
                        marginTop: Platform.OS === 'ios' ? -zStatusBarHeight : 0
                    }}
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    contentContainerStyle={{
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={true}
                    keyboardShouldPersistTaps={'always'}>

                    {/* <StatusBar
                    barStyle={'dark-content'}
                    backgroundColor={'#fafafa'}
                /> */}


                    {/* <Image source={{uri: isIphoneX() ? 'login_bg_x' : 'login_bg'}}
                           resizeMode={'cover'}
                           style={{
                               width,
                               height: height,
                               position: 'absolute',
                           }}/> */}


                    <Image source={require('../../img/logo.png')}
                        style={{
                            width: zdp(170),
                            height: zdp(35),
                            marginTop: zAppBarHeight + zdp(90)
                        }}
                        resizeMode={'contain'} />

                    <View style={styles.rowv}>
                        <Text style={styles.textheis20}>中国人性研究与运用创始品牌</Text>
                    </View>



                    {/* <MyTextInputWithIcon
                        style={{marginTop: zdp(160)}}
                        placeholder={'邀请码,可不填'}
                        iconName={'login_invite'}
                        onChangeText={(text) => {
                            this.setState({
                                recommend: text
                            })
                        }}
                    /> */}
                    <MyTextInputWithIcon
                        placeholder={'请输入手机号码'}
                        iconName={'login_phone'}
                        onChangeText={(text) => {
                            this.setState({
                                username: text
                            })
                        }}
                    />
                    <MyTextInputWithIcon
                        secureTextEntry={true}
                        placeholder={'请输入密码'}
                        iconName={'login_psw'}
                        onChangeText={(text) => {
                            this.setState({
                                password: text
                            })
                        }}
                    />

                    {/* <MyTextInputWithIcon
                        secureTextEntry={true}
                        placeholder={'确认密码'}
                        iconName={'login_psw'}
                        onChangeText={(text) => {
                            this.setState({
                                passwordSure: text
                            })
                        }}
                    /> */}


                    <View style={{
                        width,
                        height: zdp(119.5),
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }}>
                        <MyButtonView modal={1} style={{ width: width / 1.3, marginTop: zdp(30) }}
                            title={'进入山川'}
                            onPress={this.pressNext.bind(this)} />
                    </View>


                    <View style={styles.rowv2}>
                        <Image style={styles.img5} source={require('../../img/yj.png')} >
                        </Image>
                        <Text style={styles.textheis18}>系统提示</Text>
                    </View>

                    <View style={styles.rowv3}>

                        <Text style={styles.texthuise14}>app登录账号统一由管理员分配，还没有账号的用户请联系管理员。</Text>
                    </View>




                    <MyTabView linear_style={{ position: 'absolute' }} title={''}
                        isTransparent={true} barStyle={'dark-content'}
                        backgroundColor={'transparent'}
                        globalTitleColor={'black'} navigation={this.props.navigation} />
                </KeyboardAwareScrollView>

            </SafeAreaView>

        );


    }



    pressNext() {
        //Keyboard.dismiss();

        if (!checkIsNull('手机号码1', this.state.username)) {
            return;
        } else if (!checkMobile(this.state.username)) {
            return;
        }

        if (!checkIsNull('密码', this.state.password)) {
            return;
        }
        
        let formData = new FormData();
        formData.append('userName', this.state.username);
        formData.append('passWord', this.state.password);
        
        let url_ = 'app/jsp/jk/doLogin.jsp' + '?userName=' + this.state.username + '&passWord=' + this.state.password;
        fetchRequest(url_, 'GET')
            .then(res => {
                let info = res.data;
                // if (res.respCode === 200 && !this.state.isLoading) {
                if (res.data.code === "1") {
                    // 将值存储到 LoginInfo 的对象：UserInfo 同时 将对象存储到设备缓存中DeviceStorage
                    LoginInfo.setUserInfo(info);

                    if (this.props.navigation.state.params.callback) {
                        this.props.navigation.state.params.callback(info);
                        this.props.navigation.goBack();
                    }
                } else {
                    // ToastUtil.showShort(res.respMsg);
                    ToastUtil.showShort('手机号码或者密码错误，请重新输入');
                }
            }
            ).catch(err => {
                console.log(err);
                ToastUtil.showShort(err);
            });
    }


}


const styles = StyleSheet.create({



    rowv: {

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },



    textheis20: {
        fontSize: 20,
        color: '#191919',
        // fontWeight: 'bold',
        marginTop: 10,
    },





    rowv2: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 30,
        paddingLeft: 8,
        width: width / 1.2,

    },
    img5: {

        height: 16,
        width: 5,
        marginTop: 4,
        paddingRight: 4,

    },



    textheis18: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#000',
        paddingLeft: 4,
    },


    rowv3: {
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        width: width / 1.2,
    },

    texthuise14: {
        fontSize: 14,
        // marginTop: 6,
        lineHeight: 25,
    },


});

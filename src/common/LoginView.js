import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    StatusBar,
    Image,
    Platform,
    Keyboard,
} from 'react-native';
import { checkMobile } from "../utils/CheckUitls";
import { fetchRequest } from "../utils/FetchUtil";
import ToastUtil from "../utils/ToastUtil";
import MyTextInputWithIcon from "./MyTextInputWithIcon";
import Icons from 'react-native-vector-icons/SimpleLineIcons';
import {
    isIphoneX,
    zAppBarHeight,
    zdp,
    zsp,
    zStatusBarHeight,
    zWidth
} from "../utils/ScreenUtil";
import { cusColors } from "../utils/cusColors";
import ZText from "./ZText";
import MyButtonView from "./MyButtonView";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Dimensions = require('Dimensions');
const { width, height } = Dimensions.get('window');

export default class LoginView extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            phone: '',
            password: ''
        };
        this._onPress = this._onPress.bind(this);
    }

    componentDidMount() {
        // this.pressLogin();
        // alert(zStatusBarHeight);
    }

    // static defaultProps = {
    //     onPress: null
    // };

    _onPress() {
        Keyboard.dismiss();

        if (!checkMobile(this.state.phone)) {
            return;
        }

        let formData = new FormData();
        formData.append('phone', this.state.phone);
        formData.append('password', this.state.password);
        fetchRequest('Login', 'POST', formData)
            .then(res => {
                console.log(res);
                console.log(res.data);

                if (res.respCode === 200 && !this.state.isLoading) {
                    console.log(res.data);

                    this.props.navigate('Home');
                } else {
                    ToastUtil.showShort(res.respMsg);
                }
            }
            ).catch(err => {
                console.log(err);
                ToastUtil.showShort(err);
            });
    }

    onBackPress = () => {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <KeyboardAwareScrollView style={{ flex: 1, width: zWidth, backgroundColor: '#fafafa' }}
                behavior="padding"
                resetScrollToCoords={{ x: 0, y: 0 }}
                contentContainerStyle={{
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={'always'}>

                <StatusBar
                    barStyle={'dark-content'}
                    backgroundColor={'#fafafa'}
                />

                <View style={styles.backIconBox}>
                    <Icons style={styles.backIcon} name='arrow-left' onPress={this.onBackPress.bind(this)} ></Icons> 
                </View>


                <View style={{
                    flex: 1,
                    marginTop: Platform.OS === 'ios' ? -zStatusBarHeight : 0,
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}>
                    {/* <Image source={{uri: isIphoneX() ? 'login_bg_x' : 'login_bg'}}
                           resizeMode={'cover'}
                           style={{
                               width: width,
                               height: height,
                               position: 'absolute'
                           }}/> */}
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    </View>
                    <View
                        style={{ flex: 1, alignItems: 'center' }}>

                        {/* <StatusBar
                            hidden={false}
                            translucent={true}
                            barStyle={'light-content'}//'default', 'light-content', 'dark-content'
                            backgroundColor={'#fff6fd00'}
                            networkActivityIndicatorVisible={false}
                        /> */}

                        <Image source={require('../img/logo.png')}
                            style={{
                                width: zdp(170),
                                height: zdp(35),
                                marginTop: zAppBarHeight
                            }}
                            resizeMode={'contain'} />


                        <View style={styles.rowv}>
                            <Text style={styles.textheis20}>中国人性研究与运用创始品牌</Text>
                        </View>




                    </View>
                </View>
                <MyTextInputWithIcon
                    style={{ marginTop: zdp(80) }}
                    maxLength={11}
                    placeholder={'请输入手机号'}
                    keyboardType={'numeric'}
                    iconName={'login_phone'}
                    defaultValue={this.state.phone}
                    onChangeText={text => {
                        this.setState({
                            phone: text
                        })
                    }}
                />

                <MyTextInputWithIcon
                    secureTextEntry={true}
                    placeholder={'请输入登录'}
                    defaultValue={this.state.password}
                    // keyboardType={'email-address'}
                    iconName={'login_psw'}
                    onChangeText={text => {
                        this.setState({
                            password: text
                        })
                    }}
                />

                <MyButtonView style={{ width: width / 1.3, marginTop: zdp(25) }} modal={1}
                    title={'登 录'}
                    onPress={this._onPress} />
                {/* <View style={styles.wtf}>
                    <TouchableOpacity activeOpacity={0.9}
                        style={{
                            justifyContent: 'center', alignItems: 'center',
                            padding: zdp(5)
                        }}
                        onPress={
                            this.pressLoginByVerify
                        }>
                        <ZText parentStyle={{ marginLeft: zdp(40) }} content={'验证码登录'}
                            fontSize={zsp(16)} color={cusColors.text_secondary}
                            textAlign={'center'} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.9}
                        style={{
                            justifyContent: 'center', alignItems: 'center',
                            padding: zdp(5)
                        }}
                        onPress={
                            this.pressForgetPsw
                        }>
                        <ZText parentStyle={{ marginRight: zdp(40) }} content={'忘记密码?'}
                            fontSize={zsp(16)} color={cusColors.text_secondary}
                            textAlign={'center'} />
                    </TouchableOpacity>
                </View>  
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    padding: zdp(5),
                    marginTop: zdp(40)
                }}>
                    <ZText content={'没有账号?'} fontSize={zsp(16)}
                        color={cusColors.text_secondary} />
                    <MyButtonView style={{ width: zdp(80), height: zdp(30), marginTop: zdp(0) }}
                        modal={1}
                        title={'注册账号'}
                        fontSize={zsp(16)}
                        onPress={this.pressRegister.bind(this)} />
                </View> */}



            </KeyboardAwareScrollView>

        );
    }

    pressLoginByVerify = () => {
        this.props.navigate('LoginByVerify')
    };
    pressForgetPsw = () => {
        this.props.navigate('ForgetPsw')
    };
    pressRegister = () => {
        this.props.navigate('RegisterMerchant')
    }
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
        backgroundColor: 'transparent',
    },
    wtf: {
        marginTop: zdp(15),
        top: zdp(5),
        width: width,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },


    rowv: {

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },



    textheis20: {
        fontSize: 20,
        color: '#191919',
        // fontWeight: 'bold',
        marginTop: 10,
    },



    backIconBox: {
        width: zdp(50),
        height: zdp(40),
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },

    backIcon: {
        fontSize: zdp(18)
    },

});


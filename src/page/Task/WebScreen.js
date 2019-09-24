import React, { Component } from 'react';
import {
    WebView,
    Button,
    View,
    StatusBar, TouchableOpacity,
    Text,
    BackHandler, Dimensions, Platform
} from 'react-native';

import Iconscomty from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingView from '../../utils/LoadingView';
import { px2dp } from '../../util/format';


import { getbaseurl } from '../../api/news';

var baseUrl = getbaseurl();


const { width } = Dimensions.get('window').width;
const { width033 } = width * 0.333333333;
const { height } = Dimensions.get('window').height;
const topbarHeight = (Platform.OS === 'ios' ? px2dp(64) : px2dp(42))
export default class WebScreen extends Component {


    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }

    //控制器即将销毁的时候
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }

    onBackAndroid = () => {
        this.props.navigation.goBack();
        return true;
    };

    static navigationOptions = {
        header: null
    };


    constructor(props) {
        super(props);
        const { navigate, goBack, state } = this.props.navigation;

        let url_ = state.params.url;
        let wlflag = state.params.wlflag;
        if (wlflag == 'Y') {

        } else {
            url_ = baseUrl + url_;
        }

        this.state = {
            url: url_,
            name: state.params.name
        }
        // alert(state.params.url)
    }

    renderLoading() {
        return <LoadingView />;
    }

    onMessage( event ) {
        // console.log( "On Message", event.nativeEvent.data );
        var zl = event.nativeEvent.data;
        if(zl == 'HomePage'){
            this.props.navigation.popToTop();
        }else{
            this.props.navigation.navigate(zl);
        }
    }

    // 返回
    goBack() {
        if (this.props.navigation.state.params.callback) {
            this.props.navigation.state.params.callback({});
        }
        this.props.navigation.goBack();
    }



    render() {
        return (
            <View style={{ flex: 1 }}>

                <View style={{
                    justifyContent: 'center', backgroundColor: '#d33d3c',
                    flexDirection: 'row', alignItems: 'center', height: topbarHeight,
                    position: 'relative',
                }}>
                    <TouchableOpacity style={{ position: 'absolute', left: px2dp(12) }}
                        onPress={this.goBack.bind(this)}>
                        <Iconscomty style={{ paddingHorizontal: px2dp(6), }} size={px2dp(23)} name='arrow-left' color="#fff" />
                    </TouchableOpacity>
                    <Text style={{ color: '#fff', fontSize: px2dp(16), }} >{this.state.name}</Text>
                </View>


                <WebView
                    source={{ uri: this.state.url }}
                    renderLoading={this.renderLoading}
                    // onMessage={this.onMessage}
                    onMessage={this.onMessage.bind(this)}
                    automaticallyAdjustContentInsets={false}
                    style={{ width: width, height: height, backgroundColor: '#f3f3f3', }}
                    javaScriptEnabled
                    domStorageEnabled
                    startInLoadingState
                    scalesPageToFit={true}
                    decelerationRate="normal"
                    
                    // startInLoadingState
                    onShouldStartLoadWithRequest={() => {
                        const shouldStartLoad = true;
                        return shouldStartLoad;
                    }}
                    // onNavigationStateChange={this.onNavigationStateChange}
                    // renderLoading={this.renderLoading}


                />
            </View>

        )
    }
}

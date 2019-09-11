import React, { Component } from 'react';
import {
    WebView,
    Button,
    View,
    StatusBar,
    Text,
    BackHandler, Dimensions
} from 'react-native';


import LoadingView from '../../utils/LoadingView';
import { getbaseurl } from '../../api/news';

var baseUrl = getbaseurl();

const { width } = Dimensions.get('window').width;
const { height } = Dimensions.get('window').height;
export default class DetailListScreen extends Component {


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


    static navigationOptions = ({ navigation }) => ({
        // title: navigation.state.params.name,
        // headerRight: (
        //     <Button title="电影"
        //             onPress={() => {
        //                 navigation.navigate('Movie')
        //             }}/>
        // )
        headerStyle: { backgroundColor: '#d33d3c', }, //height: 54,
        headerBackTitleStyle: { color: '#fff' },
        headerTintColor: '#fff',
        headerTitle: (
            <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, color: '#fff' }}>{navigation.state.params.name}</Text>
        ),
        headerRight: <View />

    });


    constructor(props) {
        super(props);
        const { navigate, goBack, state } = this.props.navigation;

        this.state = {
            url: baseUrl + state.params.url
        }
        // alert(state.params.url)
    }

    renderLoading() {
        return <LoadingView />;
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* <StatusBar
                    translucent={false}
                    animated={true}
                    backgroundColor={"#73808080"}
                    barStyle={"light-content"}
                /> */}
                {/* <StatusBar
                    barStyle={'dark-content'}
                    backgroundColor={'#ffffff'}
                /> */}

                {/* <StatusBar
                    barStyle={'dark-content'}
                    backgroundColor={'#ffffff'}
                /> */}

                <WebView
                    source={{ uri: this.state.url }}
                    renderLoading={this.renderLoading}
                    automaticallyAdjustContentInsets={false}
                    style={{ width: width, height: height, backgroundColor: '#f3f3f3', }}
                    javaScriptEnabled
                    domStorageEnabled
                    startInLoadingState
                    scalesPageToFit={true}
                    decelerationRate="normal"
                    startInLoadingState
                    onShouldStartLoadWithRequest={() => {
                        const shouldStartLoad = true;
                        return shouldStartLoad;
                    }}
                    // onNavigationStateChange={this.onNavigationStateChange}
                    renderLoading={this.renderLoading}


                />
            </View>

        )
    }
}

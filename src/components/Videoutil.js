'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    View,Dimensions
} from 'react-native';
import Video from 'react-native-af-video-player'; // 视频组件


const { width, height } = Dimensions.get('window');


export default class Videoutil extends Component {



    constructor(props) {
        super(props);
        this.state = {


        };
    }

    componentWillMount() {

    }


    render() {
        const url = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
        const logo = 'http://c.hiphotos.baidu.com/image/pic/item/9922720e0cf3d7ca810f3732f81fbe096a63a9fd.jpg'
        const placeholder = 'http://c.hiphotos.baidu.com/image/pic/item/9922720e0cf3d7ca810f3732f81fbe096a63a9fd.jpg'
        const title = '视频播放';

        return (

            <View style={styles.container}>
                <Video
                    autoPlay={true}
                    // loop={true}
                    style={styles.videocontent}
                    fullScreenOnly={false} // 只在全屏下播放
                    inlineOnly={false}
                    hideFullScreenControl={true}
                    url={url}
                    title={title}
                    logo={logo}
                    placeholder={logo}
                    rotateToFullScreen
                />
            </View>

        )
    }
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    videocontent: {
        width: '100%',
        height: width
    },
})
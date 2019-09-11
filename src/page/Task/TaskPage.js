import React, { Component } from 'react';
import {
    Text,
    Image,
    StyleSheet,
    ScrollView,
    StatusBar
} from 'react-native';
import SwiperComponent from "../../common/SwiperComponent";
import ListViewComponent from "../../common/listViewComponent";
import ListViewComponent2 from "../../common/listViewComponent2";
import px2dp from '../../utils/px2dp'
import { View } from 'native-base';

export default class TaskPage extends Component {
    static navigationOptions = {
        tabBarLabel: '案例',
        tabBarIcon: ({ focused }) => {
            if (focused) {
                return (
                    <Image style={styles.tabBarIcon} source={require('../../img/al_sel.png')} />
                );
            }
            return (
                <Image style={styles.tabBarIcon} source={require('../../img/al_nor.png')} />
            );
        },
    };

    render() {
        return (




            <View style={{ flex: 1 }}>

                <View style={styles.vrowlb}>
                    <Image style={styles.img9820} source={require('../../img/khal.png')} >
                    </Image>
                </View>



                <ScrollView style={styles.container}>
                    {/* <StatusBar
                    translucent={true}
                    animated={true}
                    backgroundColor={"#73808080"} 
                    barStyle={"light-content"}
                /> */}
                    <SwiperComponent />
                    <Text style={styles.textStyle}>基础任务</Text>
                    <ListViewComponent />
                    <Text style={styles.textStyle}>独家任务</Text>
                    <ListViewComponent2 navigate={this.props.navigation.navigate} />
                </ScrollView>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    textStyle: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#000',
        marginTop: 10,
        marginLeft: 15,
        marginBottom: 10.
    },
    viewItem: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        padding: 10
    },
    tabBarIcon: {
        width: 19,
        height: 19,
    },
    vrowlb: {
        height: px2dp(40),
        backgroundColor: '#d33d3c',
        flexDirection: 'row',
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10),
        alignItems: 'center',
        justifyContent:'center',
    },

    img9820: {
        height: px2dp(20),
        width: px2dp(78)
    },

    text15bai: {
        color: '#fff',
        fontSize: px2dp(16),
        fontWeight:'bold'

    },
});

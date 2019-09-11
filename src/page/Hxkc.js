
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  ImageBackground, TouchableOpacity,
  View,
  ScrollView, Alert,
  Dimensions, RefreshControl,
} from 'react-native';


import { px2dp, getdthei, isSpace } from '../util/format';
import { selectKechengList } from '../api/news';
import LoadingView from '../utils/LoadingView';
import BackToTop from '../components/BackToTop'; // 顶部返回组件 

var WINDOW_WIDTH = Dimensions.get('window').width;
var WIDTH052 = WINDOW_WIDTH * 0.52;
var WIDTH050 = WINDOW_WIDTH * 0.5;
var WIDTH020 = WINDOW_WIDTH * 0.11;

class Hxkc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,//下拉控制 是否为最新
      isShowLoading: true,
      kechengs: [], // 正文数据
    };
  }


  componentWillMount() {

  };

  componentDidMount() {
    this.selectKechengList(); // 获取正文数据 
  }

  // 获取正文数据
  selectKechengList() {

    const res = selectKechengList(); // api接口
    res.then((newsArr) => {
      this.setState({ // 设置状态
        kechengs: newsArr,
        isShowLoading: false,
        isRefreshing: false,
      });
      console.log(newsArr);
    }).catch((e) => { // 错误异常处理
      ToastAndroid.show(e, ToastAndroid.SHORT); // androidToast
    })
  }

  // 刷新头部
  refreshHandle() {
    this.setState({
      // kechengs: [],
      isRefreshing: true,//tag,下拉刷新中，加载完全，就设置成flase 
    }, () => {
      this.selectKechengList();
    });
  }


  // 返回顶部
  backToTop() {
    this.refs.dataList.scrollTo({ x: 0, y: 0, animated: true });
  }


  gokechengdetail(item) {
    this.props.navigation.navigate('Kechengdetail', { id: item.id,uuid:item.uuid });
  }


  render() {
    var zwindex = 0;
    //Alert.alert('zwindex====' + zwindex);
    if (this.state.isShowLoading) {
      return <LoadingView />;
    }
    return (
      <View style={styles.container}>

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}
          ref="dataList"

          /* 刷新控制 */
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.refreshHandle.bind(this)}
              colors={['red', '#ffd500', '#0080ff', '#99e600']}
              tintColor='red'
              title="加载中..."
              titleColor='red' />
          }

        >

          <View style={styles.headview}>
            <Image source={require('../img/js/jieti.png')} style={styles.headimg}>
            </Image>
          </View>


          <View style={styles.logView}>




            <View style={styles.titleview}>
              <Text style={styles.begintext}>核心产品</Text>
            </View>

            <View style={styles.xhxview}>
              <Image style={styles.xhximg} source={require('../img/js/bitiaoxhxheis.png')} ></Image>
            </View>

            <View style={styles.kclist}>
              <View style={styles.rowv}>

                {
                  this.state.kechengs.map((item, index) => {
                    return (

                      <View style={styles.borderv} key={index}>

                        <Text style={styles.title} numberOfLines={1}>《{item.title}》</Text>
                        <Text style={styles.jiejian} numberOfLines={2}>{item.jianjie}</Text>
                        <TouchableOpacity key={index} style={{ position: 'absolute', bottom: px2dp(20), }}
                          onPress={this.gokechengdetail.bind(this, item)} >
                          <Text style={styles.textshenls20}>了解详情</Text>
                        </TouchableOpacity>
                      </View>

                    )
                  })
                }


              </View>

            </View>




          </View>





        </ScrollView>


        <BackToTop pressHandle={this.backToTop.bind(this)} />

      </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  logView: {
  },


  headimg: {
    height: WIDTH052,
    width: WINDOW_WIDTH,
  },


  titleview: {
    marginTop: 30,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingBottom: 8,
    justifyContent: 'center',
  },

  begintext: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#595959',
    marginTop: 6,
  },



  xhxview: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  xhximg: {
    height: 4,
    width: px2dp(60),
    // margin: 10,
  },

  kclist: {
    marginVertical: 40,
    borderTopWidth: 1,
    borderColor: '#bfbfbf',
  },

  rowv: {
    flexDirection: 'row',

    flexWrap: 'wrap',
    display: 'flex',
  },

  borderv: {
    alignItems: 'center', justifyContent: 'flex-start',
    width: WIDTH050,
    height: WIDTH050,
    borderColor: '#bfbfbf',
    borderBottomWidth: 1,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    paddingTop: WIDTH020,
    position: 'relative',
  },


  textshenls20: {
    fontSize: px2dp(15),
    color: '#fff',
    backgroundColor: '#e70012',
    paddingLeft: px2dp(12),
    paddingRight: px2dp(12),
    paddingTop: px2dp(4),
    paddingBottom: px2dp(5),
    // marginTop: px2dp(16),
    borderRadius: px2dp(8),


  },

  title: {
    fontSize: px2dp(24),
    color: '#e70012',
    fontWeight: 'bold',
  },

  jiejian: {
    fontSize: px2dp(14),
    color: '#e70012',
    marginTop: px2dp(6),
    paddingHorizontal: px2dp(10),
  },



});

export default Hxkc;
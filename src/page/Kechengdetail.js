
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  View,
  ScrollView, Alert, StatusBar, ToastAndroid, TouchableOpacity,
  Dimensions, RefreshControl,
} from 'react-native';


import { px2dp, getdthei, isSpace } from '../util/format';
import NavBar from '../common/NavBar';
import { getZwByUuid, selectKeChengInfo } from '../api/news';
import LoadingView from '../utils/LoadingView';
import BackToTop from '../components/BackToTop'; // 顶部返回组件 
import BackHandleComponent from '../components/BackHandleComponent';
import Icons from 'react-native-vector-icons/SimpleLineIcons';
import Iconfonts from 'react-native-vector-icons/FontAwesome';
import * as LoginInfo from '../page/Login/LoginInfo';


var WINDOW_WIDTH = Dimensions.get('window').width;
var width035 = (WINDOW_WIDTH - 40) * 0.4;
var width065 = (WINDOW_WIDTH - 40) * 0.6;
var width036 = WINDOW_WIDTH * 0.33;


class Kechengdetail extends Component {


  constructor(props) {
    super(props);
    let isLogin = LoginInfo.isLogin();
    this.state = {
      isRefreshing: false,//下拉控制 是否为最新
      isShowLoading: true,
      zwData: [], // 正文数据
      btData: {}, // 标题数据
      isLogin: isLogin,//下拉控制 是否为最新
    };
    this.params = this.props.navigation.state.params;

  }

  static navigationOptions = {
    header: null
  };

  // static navigationOptions = ({ navigation }) => ({
  //   headerStyle: { backgroundColor: '#ededed', height: px2dp(40), }, //height: 54,
  //   headerBackTitleStyle: { color: '#0e0e0e' },
  //   headerTintColor: '#0e0e0e',
  //   headerTitle: (
  //     <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, color: '#0e0e0e' }}>SHANCHUAN | 课程详情</Text>
  //   ),
  //   // headerTitle: (
  //   //     <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, color: '#000' }}>SHANCHUAN | 学习内容</Text>
  //   // ),
  //   headerRight: <View />
  // });



  componentWillMount() {

  };

  componentDidMount() {
    this.getZwByUuid(); // 获取正文数据 
    this.getBtByUuid(); // 获取标题数据
  }

  // 获取标题数据
  getBtByUuid() {

    const res = selectKeChengInfo(this.params.id); // api接口
    res.then((newsObj) => {
      this.setState({ // 设置状态
        btData: newsObj
      });
      console.log(newsObj);
    }).catch((e) => { // 错误异常处理
      ToastAndroid.show(e, ToastAndroid.SHORT); // androidToast
    })
  }


  // 获取正文数据
  getZwByUuid() {

    const res = getZwByUuid(this.params.uuid); // api接口
    res.then((newsArr) => {
      this.setState({ // 设置状态
        zwData: newsArr,
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
      // zwData: [],
      isRefreshing: true,//tag,下拉刷新中，加载完全，就设置成flase 
    }, () => {
      this.getZwByUuid();
      this.getBtByUuid();
    });
  }


  // 返回顶部
  backToTop() {
    this.refs.dataList.scrollTo({ x: 0, y: 0, animated: true });
  }

  buykc() {
    if (this.state.isLogin) {
      let btData_ = this.state.btData;
      this.props.navigation.navigate('Kechengbuy', { kcinfo: btData_ });

    } else {
      this.props.navigation.navigate('LoginIndex',
        {
          // info: info,
          callback: ((info) => { //回调函数
            // 回调了就是登录成功了
            this.setState({
              isLogin: true,
            })
          })
        }

      );

    }

  }


  back() {
    this.props.navigation.pop();
  }


  render() {
    var zwindex = 0;
    //Alert.alert('zwindex====' + zwindex);
    if (this.state.isShowLoading) {
      return <LoadingView />;
    }
    return (
      <View style={styles.container}>

        <NavBar
          title=" "
          leftIcon="md-arrow-back"
          leftPress={this.back.bind(this)}
        />

        {/* <StatusBar
          barStyle={'dark-content'}
          backgroundColor={'#ededed'}
        /> */}

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: px2dp(100), }}
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



          <View style={styles.logView}>

            <ImageBackground source={require('../img/hongsebj.png')} style={styles.imgbg}>
              <View style={styles.headview}>



                <Text style={styles.headtitletop}>《{this.state.btData.title}》</Text>
                {
                  !isSpace(this.state.btData.title) ?
                    <Text style={styles.zwtitle3}>{this.state.btData.jianjie}</Text>
                    :
                    <Text />
                }

              </View>
            </ImageBackground>

            <View style={styles.wutuv}>
              <Text style={styles.wutuvcontent} ><Iconfonts style={styles.icon16} name='user' color="#212121" />  合作团队：{this.state.btData.jiangshi}</Text>
              <Text style={styles.wutuvcontent} ><Iconfonts style={styles.icon16} name='lightbulb-o' color="#212121" />  合作时间：{this.state.btData.skms}</Text>
              <Text style={styles.wutuvcontent} ><Iconfonts style={styles.icon16} name='rmb' color="#212121" />  合作价格：{this.state.btData.jiage} 元</Text>

            </View>


            <View style={styles.zwview1}>

              {
                !isSpace(this.state.btData.jiazhi) ?
                  <Text style={styles.zwtitle}>{this.state.btData.jiazhi}</Text>
                  :
                  <Text />
              }

              {
                !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) && this.state.zwData[zwindex].pxh == '10000' ?
                  <Text style={styles.zwtext}>{this.state.zwData[zwindex++].zwnr}</Text>
                  :
                  <Text />
              }

            </View>




            <View style={styles.coloumboxvyj}>

              <View style={styles.coloumboxvyjl}>
                <Text style={styles.coloumboxvyjltitle}>服务内容</Text>
              </View>

              <View style={styles.coloumboxvyjr}>
                {
                  !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) && this.state.zwData[zwindex].pxh == '10100' ?
                    <Image key={this.state.zwData[zwindex].id} style={styles.coloumboxvyjrimg} source={{ uri: this.state.zwData[zwindex++].zwnr }}></Image>
                    :
                    <View />
                }
              </View>

            </View>


            <View style={styles.yjwzv}>
              {
                !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) && this.state.zwData[zwindex].pxh == '10200' ?
                  <Text style={styles.zwtext}>{this.state.zwData[zwindex++].zwnr}</Text>
                  :
                  <Text />
              }
            </View>



            <View style={styles.coloumboxvyj}>

              <View style={styles.coloumboxvyjl}>
                <Text style={styles.coloumboxvyjltitle}>价值收获</Text>
              </View>

              <View style={styles.coloumboxvyjr}>
                {
                  !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) && this.state.zwData[zwindex].pxh == '10300' ?
                    <Image key={this.state.zwData[zwindex].id} style={styles.coloumboxvyjrimg} source={{ uri: this.state.zwData[zwindex++].zwnr }}></Image>
                    :
                    <View />
                }
              </View>

            </View>


            <View style={styles.yjwzv}>
              {
                !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) && this.state.zwData[zwindex].pxh == '10400' ?
                  <Text style={styles.zwtext}>{this.state.zwData[zwindex++].zwnr}</Text>
                  :
                  <Text />
              }
            </View>




          </View>





        </ScrollView>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.shopping}
          onPress={this.buykc.bind(this)}
        >
          <Text style={styles.shoppingIcon}>立即购买</Text>
        </TouchableOpacity>

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
  headview: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: px2dp(30),

  },
  zwtitle3: {
    color: '#fff',
    fontSize: px2dp(16),
    paddingTop: px2dp(6),
  },
  headtitletop: {
    color: '#fff',
    fontSize: px2dp(40),

  },

  zwview1: {
    marginVertical: px2dp(15),
    paddingLeft: px2dp(20),
    paddingRight: px2dp(16),
  },


  zwtitle: {
    fontWeight: 'bold',
    fontSize: px2dp(22),
    color: '#000',
  },

  zwtext: {
    flex: 1,
    flexDirection: 'column',
    fontSize: px2dp(18),
    marginTop: px2dp(15),
    lineHeight: px2dp(30),
    color: '#212121',
    textAlign: 'justify',
  },




  coloumboxvyj: {
    flexDirection: 'row',
    marginTop: px2dp(60),
    margin: px2dp(20),
    zIndex: 99,
  },


  coloumboxvyjl: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width035,
    height: px2dp(120),
    backgroundColor: '#d3bb95',
  },

  coloumboxvyjltitle: {
    color: '#fff',
    fontSize: px2dp(28),
    // fontWeight: 'bold',
  },

  coloumboxvyjr: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  coloumboxvyjrimg: {
    width: width065,
    height: px2dp(120),
  },

  yjwzv: {
    backgroundColor: '#efefef',
    paddingTop: px2dp(80),
    paddingBottom: px2dp(40),
    padding: px2dp(20),
    marginTop: -px2dp(80),
  },



  wutuv: {
    flex: 1,
    marginHorizontal: px2dp(10),
    marginTop: px2dp(15),
    padding: px2dp(10),
    backgroundColor: '#f5f5f5',
  },
  wutuvcontent: {
    fontSize: px2dp(16),
    color: '#212121',
    flex: 1,
    marginTop: px2dp(2),
    marginBottom: px2dp(5),
  },
  icon16: {
    fontSize: px2dp(16)
  },

  shopping: {
    position: 'absolute',
    right: px2dp(58),
    bottom: px2dp(20),
    // width:px2dp(38),
    height: px2dp(38),
    borderRadius: px2dp(28),
    backgroundColor: '#FFB90F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shoppingIcon: {
    color: 'white',
    fontSize: px2dp(20),
    paddingHorizontal: px2dp(15),
  }
  ,
  imgbg: {
    height: width036,
    width: WINDOW_WIDTH,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },


});

export default Kechengdetail;
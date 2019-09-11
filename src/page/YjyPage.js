
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  View,
  ScrollView,
  Dimensions, RefreshControl,TouchableWithoutFeedback,
} from 'react-native';


import { px2dp, getdthei, isSpace } from '../util/format';
import { getZwByUuid } from '../api/news';
import LoadingView from '../utils/LoadingView';
import BackToTop from '../components/BackToTop'; // 顶部返回组件 

import YfzxPage from './YfzxPage';
import ZxzxPage from './ZxzxPage';


var WINDOW_WIDTH = Dimensions.get('window').width;
// 功能区宽度
var head_heigth = WINDOW_WIDTH * 0.5;
var head_heigth1 = WINDOW_WIDTH * 0.25;
var logimg_top = head_heigth - 60; // head_heigth-80-20+40  logoview高度  margintop -20  logoview高度的一半
var logimg_left = (WINDOW_WIDTH - 80) / 2;

class YjyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,//下拉控制 是否为最新
      isShowLoading: true,
      zwData: [], // 正文数据
    };
  }


  componentWillMount() {

  };

  componentDidMount() {
    this.getZwByUuid(); // 获取正文数据 
  }

  // 获取正文数据
  getZwByUuid() {

    const res = getZwByUuid('1aea6f684a924fa08efa07cd604a7d9e'); // api接口
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
    });
  }


  _gotopage(flag) {
    return;
    if (flag == 'yfzx') {
      this.props.navigation.navigate('YfzxPage');
    } else if (flag == 'zxzx') {
      this.props.navigation.navigate('ZxzxPage');
    }
  }

// 返回顶部
backToTop() {
  this.refs.dataList.scrollTo({ x: 0, y: 0, animated: true });
}



  render() {
    if (this.state.isShowLoading) {
      return <LoadingView />;
    }
    var zwindex = 0;
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


{
            !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
              <View style={styles.headview}>
                {/* <Image style={styles.xhximg} source={require('../img/js/bitiaoxhx.png')} ></Image> */}
                <Image key={this.state.zwData[zwindex].id} style={{ height: getdthei(this.state.zwData[zwindex].hwbl), width: WINDOW_WIDTH, }} source={{ uri: this.state.zwData[zwindex++].zwnr }}></Image>
              </View> :
              <View />
          }


          <View style={styles.logView}>



            <View style={styles.titleview}>
              <Text style={styles.begintext}>山川研究院</Text>
            </View>

            <View style={styles.xhxview}>
              <Image style={styles.xhximg} source={require('../img/js/lansexhx.png')} ></Image>
            </View>




            <View style={styles.zwview}>


{
                !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                  <Text style={styles.zwtext}>{this.state.zwData[zwindex++].zwnr}</Text>
                  :
                  <Text />
              }






            </View>


            <View style={styles.titleview}>
              <Text style={styles.begintext2j}>研究院下两大部门</Text>
            </View>





            <View style={styles.menuViewbig}>
              <View style={styles.menuViewbigbox}>
                <View style={styles.menuViewbigboxtop}>
                  <Image style={styles.menuViewbigboximg} source={require('../img/js/yfzx.png')}></Image>
                </View>

                <TouchableWithoutFeedback onPress={this._gotopage.bind(this, 'yfzx')} >
                  <View style={styles.menuViewbigboxbot}>
                    <Text style={styles.menuViewbigtexttitle}>了解详情</Text>
                  </View>
                </TouchableWithoutFeedback>

              </View>
              <View style={styles.menuViewbigbox}>
                <View style={styles.menuViewbigboxtop}>
                  <Image style={styles.menuViewbigboximg} source={require('../img/js/zxzx.png')}></Image>
                </View>
                <TouchableWithoutFeedback onPress={this._gotopage.bind(this, 'zxzx')} >
                  <View style={styles.menuViewbigboxbot}>
                    <Text style={styles.menuViewbigtexttitle}>了解详情</Text>
                  </View>
                </TouchableWithoutFeedback>
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
    backgroundColor: '#eeedf2',
  },


  headview: {
    // flex: 1, 
    // position:'absolute'
    // zIndex: 88,
    // elevation: 88,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#dddddd',
  },
  headimg: {
    height: head_heigth,
    width: WINDOW_WIDTH,

    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // margin: 10,
  },

  headimg1: {
    height: head_heigth1,
    width: WINDOW_WIDTH,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headimg2: {
    height: head_heigth,
    width: WINDOW_WIDTH,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },




  zwview: {

    padding: 15,
    paddingLeft: 25,
    paddingRight: 18,


  },
  zwtitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    padding: 20,
    backgroundColor: '#f75821',
    borderRadius: 5,
  },

  zwsj: {

  },


  headtitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 28,

  },


  logView: {
    backgroundColor: '#fff',
    paddingBottom: 30,
  },

  logimgView: {
    height: 80,
    width: 80,
    // marginTop: -50,
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex: 99,
    elevation: 99,
    top: logimg_top,
    borderRadius: 60,
    left: logimg_left,

  },

  logImg: {

    height: 60,
    width: 60,
    margin: 10,



  },



  titleview: {
    // height: 36,
    marginTop: 30,
    flexDirection: 'row',
    backgroundColor: '#fff',
    // paddingLeft: 15,
    // paddingRight: 15,
    // paddingTop: 8,
    paddingBottom: 8,
    justifyContent: 'center',
  },



  xhxview: {
    // height: 36,
    // marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  xhximg: {
    height: 4,
    width: 50,
    // margin: 10,
  },

  xhximg1: {
    height: 4,
    width: 80,
    margin: 8,
  },


  beginview: {
    flexDirection: 'row',
    justifyContent: 'flex-start',

  }, beginimg: {

    height: 16,
    width: 5,
    marginTop: 4,
    paddingRight: 4,

  },



  begintext: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#284275',
    marginTop: 6,
    // paddingLeft: 4,
    // borderLeftWidth:4,
    // borderLeftColor:'#e70012',
  },


  begintext2j: {
    // fontWeight: 'bold',
    fontSize: 22,
    color: '#212121',
  },


  endtext: {
    color: '#888',
    paddingRight: 4,
  },

  endview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
  },

  endimg: {

    height: 16,
    width: 16,
    marginTop: 2,

  },

  zwtext: {
    flex: 1,
    flexDirection: 'column',
    fontSize: 18,
    marginTop: 15,
    lineHeight: 30,
    color: '#212121',
    textAlign: 'justify',
  },


  menuViewbig: {
    marginTop: 25,
    flexDirection: 'row',
  },


  menuViewbigbox: {
    alignItems: 'center', justifyContent: 'center',
    width: head_heigth,
    borderColor: '#bfbfbf',
    borderTopWidth: 1,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    // paddingBottom: 15,
    paddingTop: 15,
  },

  menuViewbigbox1: {
    alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#eeeeee',
    width: head_heigth,
    borderColor: '#bfbfbf',
    borderBottomWidth: 1,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    paddingBottom: 15,
    // paddingTop:5,
    paddingLeft: 8,
    paddingRight: 8,
  },



  menuViewbigboxtop: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: head_heigth,
    // height:head_heigth+40,
  },

  menuViewbigboxbot: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#273e8a',
    width: head_heigth - 1,
    height: 50,
  },

  menuViewbigboxbot1: {
    // flexDirection: 'row',
    height: head_heigth1,
  },

  menuViewbigboximg: {
    height: head_heigth - 1,
    width: head_heigth - 1,
  },

  menuViewbigtexttitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    // fontWeight: 'bold',
    // marginBottom: 6
  },
  menuViewbigtextcontent: {
    fontSize: 15,
    lineHeight: 25,
    textAlign: 'left',
    color: '#666',
    marginBottom: 6
  },

  listtexttag4: {
    fontSize: 11,
    color: '#fff',
    backgroundColor: '#db462e',
    alignSelf: 'flex-start',
    paddingBottom: 1,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 1,
    marginLeft: 5,
    marginTop: 2,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },




  dixianview: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#eeedf2',
    color: '#858585',
    padding: 25,
  },


  dixianimg: {

    height: 21,
    width: 105,
    marginTop: 2,

  },


  dixiantext: {
    marginTop: 3,
    fontSize: 12,
  }


});

export default YjyPage;
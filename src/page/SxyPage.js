
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  View,
  ScrollView,
  Dimensions, RefreshControl,
} from 'react-native';


import { px2dp, getdthei, getdthei1, isSpace } from '../util/format';
import { getZwByUuid } from '../api/news';
import LoadingView from '../utils/LoadingView';
import BackToTop from '../components/BackToTop'; // 顶部返回组件 

var WINDOW_WIDTH = Dimensions.get('window').width;
// 功能区宽度
var head_heigth = WINDOW_WIDTH * 0.5;
var WIDTH_xhx = WINDOW_WIDTH * 0.75;
var WIDTH01 = WINDOW_WIDTH * 0.1;
var heigth_xhx = WIDTH_xhx * 0.16;
var head_heigth1 = WINDOW_WIDTH * 0.25;
var width035 = (WINDOW_WIDTH - 40) * 0.35;
var width065 = (WINDOW_WIDTH - 40) * 0.65;
var logimg_top = head_heigth - 60; // head_heigth-80-20+40  logoview高度  margintop -20  logoview高度的一半
var logimg_left = (WINDOW_WIDTH - 80) / 2;

class SxyPage extends Component {
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

    const res = getZwByUuid('596b3f31af484ad8806fd4322e757425'); // api接口
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



          {/* <View style={styles.headview}>
            <Image source={require('../img/js/csbj.png')} style={styles.headimg}>
            </Image>
          </View> */}
          {
            !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
              <View style={styles.headview}>
                {/* <Image style={styles.xhximg} source={require('../img/js/bitiaoxhx.png')} ></Image> */}
                <Image key={this.state.zwData[zwindex].id} style={{ height: getdthei(this.state.zwData[zwindex].hwbl), width: WINDOW_WIDTH, }} source={{ uri: this.state.zwData[zwindex++].zwnr }}></Image>
              </View> :
              <View />
          }

          {/* <View style={styles.xhxview}>
              <Image style={styles.xhxsxyimg} source={require('../img/scsxy.png')} ></Image>
            </View> */}

          <View style={styles.logView}>



            <View style={styles.titleview}>
              <Text style={styles.begintext}>山川商学院</Text>
            </View>

            <View style={styles.xhxview}>
              <Image style={styles.xhximg2} source={require('../img/js/hsxhx.png')} ></Image>
            </View>
            <View style={styles.titleview2}>
              <Text style={styles.begintext2}>每家企业都有自己的路</Text>
            </View>




            <View style={styles.zwview}>



              {
                !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                  <Text style={styles.zwtext}>{this.state.zwData[zwindex++].zwnr}</Text>
                  :
                  <Text />
              }


            </View>



            <View style={styles.titleview3}>
              <Text style={styles.headtitle1}>山川商学院和其它商学院的不同？</Text>
              {
                !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                  <Text style={styles.zwtext}>{this.state.zwData[zwindex++].zwnr}</Text>
                  :
                  <Text />
              }

            </View>



            {
              !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                <View style={styles.headview}>
                  {/* <Image style={styles.xhximg} source={require('../img/js/bitiaoxhx.png')} ></Image> */}
                  <Image key={this.state.zwData[zwindex].id} style={{ height: getdthei(this.state.zwData[zwindex].hwbl), width: WINDOW_WIDTH, }} source={{ uri: this.state.zwData[zwindex++].zwnr }}></Image>
                </View> :
                <View />
            }



            <View style={styles.titleview1}>
              <Text style={styles.begintext1}>有那么多的知识和课程要学习，为什么要学习组织认知模型？</Text>
            </View>



            {
              !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                <View style={styles.headview1}>
                  <Image key={this.state.zwData[zwindex].id} style={{ height: getdthei1(this.state.zwData[zwindex].hwbl), width: WIDTH_xhx, }} source={{ uri: this.state.zwData[zwindex++].zwnr }}></Image>
                </View> :
                <View />
            }






            <View style={styles.bigboxv}>
              <View style={styles.coloumboxv}>
                <View style={styles.coloumboxvl}>
                  {
                    !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                      <Image key={this.state.zwData[zwindex].id} style={styles.coloumboxvlimg} source={{ uri: this.state.zwData[zwindex++].zwnr }}></Image>
                      :
                      <View />
                  }
                </View>
                <View style={styles.coloumboxvr}>

                  {
                    !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                      <Text style={styles.zwtext}>{this.state.zwData[zwindex++].zwnr}</Text>
                      :
                      <Text />
                  }

                </View>
              </View>

              <View style={styles.coloumboxv1}>
                <View style={styles.coloumboxvl}>
                  {
                    !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                      <Image key={this.state.zwData[zwindex].id} style={styles.coloumboxvlimg} source={{ uri: this.state.zwData[zwindex++].zwnr }}></Image>
                      :
                      <View />
                  }
                </View>
                <View style={styles.coloumboxvr}>

                  {
                    !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                      <Text style={styles.zwtext}>{this.state.zwData[zwindex++].zwnr}</Text>
                      :
                      <Text />
                  }
                </View>
              </View>


            </View>


            {/* <View style={styles.headview}>
              <Image key={this.state.zwData[0].id} style={{ height: getdthei(this.state.zwData[0].hwbl), width: WINDOW_WIDTH, }} source={{ uri: this.state.zwData[0].zwnr }}></Image>
            </View> */}


            <View style={styles.titleview3}>
              <Text style={styles.headtitle1}>山川商学院面对的学员是谁？</Text>


              {
                !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                  <Text style={styles.zwtext}>{this.state.zwData[zwindex++].zwnr}</Text>
                  :
                  <Text />
              }

              <Text style={styles.headtitle2}>为什么我要来山川商学院学习？</Text>
              {
                !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                  <Text style={styles.zwtext}>{this.state.zwData[zwindex++].zwnr}</Text>
                  :
                  <Text />
              }

              <Text style={styles.headtitle2}>学习什么？</Text>
              {
                !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                  <Text style={styles.zwtext}>{this.state.zwData[zwindex++].zwnr}</Text>
                  :
                  <Text />
              }

            </View>




            <View style={styles.coloumboxvyj}>

              <View style={styles.coloumboxvyjl}>
                <Text style={styles.coloumboxvyjltitle}>愿景</Text>
              </View>

              <View style={styles.coloumboxvyjr}>
                {
                  !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                    <Image key={this.state.zwData[zwindex].id} style={styles.coloumboxvyjrimg} source={{ uri: this.state.zwData[zwindex++].zwnr }}></Image>
                    :
                    <View />
                }
              </View>

            </View>


            <View style={styles.yjwzv}>
              {
                !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                  <Text style={styles.zwtext}>{this.state.zwData[zwindex++].zwnr}</Text>
                  :
                  <Text />
              }
            </View>



            <View style={styles.coloumboxvyj}>

              <View style={styles.coloumboxvyjl}>
                <Text style={styles.coloumboxvyjltitle}>成就</Text>
              </View>

              <View style={styles.coloumboxvyjr}>
                {
                  !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                    <Image key={this.state.zwData[zwindex].id} style={styles.coloumboxvyjrimg} source={{ uri: this.state.zwData[zwindex++].zwnr }}></Image>
                    :
                    <View />
                }
              </View>

            </View>


            <View style={styles.yjwzv}>
              {
                !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                  <Text style={styles.zwtext}>{this.state.zwData[zwindex++].zwnr}</Text>
                  :
                  <Text />
              }
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


  headview: {
    justifyContent: 'center',
    flexDirection: 'row',
  },

  headview1: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginTop: 20,
    marginRight: 20,
    zIndex: 99,
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
    borderRadius: 5,
  },

  zwsj: {

  },


  headtitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 28,

  },

  headtitle1: {
    color: '#212121',
    fontWeight: 'bold',
    fontSize: 20,

  },

  headtitle2: {
    marginTop: 40,
    color: '#212121',
    fontWeight: 'bold',
    fontSize: 20,

  },


  logView: {
  },

  logimgView: {
    height: 80,
    width: 80,
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
    flexDirection: 'row',
    paddingTop: 35,
    // paddingBottom: 10,
    justifyContent: 'center',
  },


  titleview1: {
    width: head_heigth + 20,
    marginTop: 40,
    marginLeft: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },


  titleview2: {
    marginTop: 3,
    flexDirection: 'row',
    paddingBottom: 8,
    justifyContent: 'center',
  },

  titleview3: {
    backgroundColor: '#efefef',
    paddingTop: 40,
    paddingBottom: 40,
    padding: 20,
    // justifyContent: 'flex-start',
    // alignItems: 'center',
  },




  xhxview: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  xhxsxyimg: {
    height: heigth_xhx,
    width: WIDTH_xhx,
    // margin: 10,
  },

  xhximg: {
    height: 4,
    width: 50,
    // margin: 10,
  },


  xhximg2: {
    height: WIDTH01,
    width: WINDOW_WIDTH,
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
    color: '#000',
  },

  begintext1: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000',
    marginTop: 6,
    lineHeight: 28,
  },



  begintext2: {
    fontSize: 20,
    color: '#000',
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
    flexDirection: 'row',
  },


  menuViewbigbox: {
    alignItems: 'center', justifyContent: 'center',
    width: head_heigth,
    borderColor: '#bfbfbf',
    borderTopWidth: 1,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    paddingBottom: 15,
    paddingTop: 15,
  },

  menuViewbigbox1: {
    alignItems: 'center', justifyContent: 'flex-start',
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
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuViewbigboxbot1: {
    // flexDirection: 'row',
    height: head_heigth1,
  },

  menuViewbigboximg: {
    height: head_heigth1,
    width: head_heigth1,
  },

  menuViewbigtexttitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#1e2577',
    fontWeight: 'bold',
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
  },



  bigboxv: {
    margin: 25,
    marginTop: -80,
    borderColor: '#bfbfbf',
    borderWidth: 1,
    backgroundColor: '#f8f8f8',
  },



  coloumboxv: {
    flexDirection: 'row',
    marginTop: 120,
    marginBottom: 40,

  },


  coloumboxv1: {
    flexDirection: 'row',
    marginBottom: 40,

  },


  coloumboxvr: {
    marginLeft: 10,
    marginRight: 10,
    width: WINDOW_WIDTH - 50 - 15 - 60 - 15,
  },

  coloumboxvl: {
    marginLeft: 10,
  },

  coloumboxvlimg: {
    width: 60,
    height: 60,
  },


  coloumboxvyj: {
    flexDirection: 'row',
    marginTop: 60,
    margin: 20,
    zIndex: 99,
  },


  coloumboxvyjl: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width035,
    height: 120,
    backgroundColor: '#d3bb95',
  },

  coloumboxvyjltitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },

  coloumboxvyjr: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  coloumboxvyjrimg: {
    width: width065,
    height: 120,
  },


  yjwzv: {
    backgroundColor: '#efefef',
    paddingTop: 80,
    paddingBottom: 40,
    padding: 20,
    marginTop: -80,
  },





});

export default SxyPage;
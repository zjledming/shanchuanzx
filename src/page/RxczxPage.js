
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  View,
  ScrollView,Alert,
  Dimensions, RefreshControl,
} from 'react-native';


import { px2dp, getdthei, isSpace } from '../util/format';
import { getZwByUuid } from '../api/news';
import LoadingView from '../utils/LoadingView';
import BackToTop from '../components/BackToTop'; // 顶部返回组件 

var WINDOW_WIDTH = Dimensions.get('window').width;
var WIDTH01 = WINDOW_WIDTH * 0.1;
var WIDTH04 = WINDOW_WIDTH * 0.4;
var WIDTH033 = WINDOW_WIDTH * 0.33;
var head_heigth = WINDOW_WIDTH * 0.5;
var head_heigth1 = WINDOW_WIDTH * 0.25;
var logimg_top = head_heigth - 60; // head_heigth-80-20+40  logoview高度  margintop -20  logoview高度的一半
var logimg_left = (WINDOW_WIDTH - 80) / 2;



class RxczxPage extends Component {
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

    const res = getZwByUuid('282e27f9448d4df2ba0b1a2f12a01e9b'); // api接口
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


          <View style={styles.logView}>



            <View style={styles.titleview}>
              <Text style={styles.begintext}>《人性材质学》</Text>
            </View>

            <View style={styles.zwview1}>

              {
                !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                  <Text style={styles.zwtitle}>{this.state.zwData[zwindex++].zwnr}</Text>
                  :
                  <Text />
              }

              {
                !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                  <Text style={styles.zwtitle1}>{this.state.zwData[zwindex++].zwnr}</Text>
                  :
                  <Text />
              }

              {
                !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                  <Text style={styles.zwtitle2}>{this.state.zwData[zwindex++].zwnr}</Text>
                  :
                  <Text />
              }
            </View>

            <View style={styles.zwviewhuis}>


              {
                !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                  <Text style={styles.zwtext}>{this.state.zwData[zwindex++].zwnr}</Text>
                  :
                  <Text />
              }

            </View>




            <View style={styles.headview}>
              <ImageBackground source={require('../img/js/lscsbj.png')} style={styles.headimg1}>
                <Text style={styles.zwtitle3}>我们始终观察与研究的两个视角</Text>
                <Text style={styles.headtitletop}>人  &  组织</Text>
              </ImageBackground>
            </View>

            <View style={styles.zwview}>



              {
                !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                  <Text style={styles.zwtext}>{this.state.zwData[zwindex++].zwnr}</Text>
                  :
                  <Text />
              }


            </View>


            <View style={styles.headview}>
              <ImageBackground source={require('../img/js/hsbj.png')} style={styles.headimg1}>
                <Text style={styles.zwtitle3}>我们的三个基础理论框架</Text>
                <Text style={styles.headtitletop}>物理学 & 生物学 & 经济学</Text>
              </ImageBackground>
            </View>


            <View style={styles.titleview3}>

              {
                !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                  <Text style={styles.zwtextbottom15}>{this.state.zwData[zwindex++].zwnr}</Text>
                  :
                  <Text />
              }



              <Text style={styles.headtitle1}>物理学</Text>


              {
                !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                  <Text style={styles.zwtext}>{this.state.zwData[zwindex++].zwnr}</Text>
                  :
                  <Text />
              }


              <Text style={styles.headtitle2}>生物学</Text>
              {
                !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                  <Text style={styles.zwtext}>{this.state.zwData[zwindex++].zwnr}</Text>
                  :
                  <Text />
              }

              <Text style={styles.headtitle2}>经济学</Text>
              {
                !isSpace(this.state.zwData[zwindex]) && !isSpace(this.state.zwData[zwindex].zwnr) ?
                  <Text style={styles.zwtext}>{this.state.zwData[zwindex++].zwnr}</Text>
                  :
                  <Text />
              }
            </View>




            <View style={styles.headview}>
              <ImageBackground source={require('../img/js/yjcg.png')} style={styles.headimg025}>
                <Text style={styles.zwtitle4}>我们的四个研究成果</Text>
                <Text style={styles.zwtitle3}>Research Result </Text>
              </ImageBackground>
            </View>




            <View style={styles.rowv}>
              <View style={styles.borderv}>
                <Image style={styles.img50} source={require('../img/js/chengguo1.png')}></Image>
                <Text style={styles.textshenls20}>企业家定位</Text>
              </View>
              <View style={styles.borderv}>
                <Image style={styles.img50} source={require('../img/js/chengguo2.png')}></Image>
                <Text style={styles.textshenls20}>组织责权定位</Text>
              </View>
            </View>

            <View style={styles.rowv}>

              <View style={styles.borderv}>
                <Image style={styles.img50} source={require('../img/js/chengguo3.png')}></Image>
                <Text style={styles.textshenls20}>战略选择</Text>
              </View>
              <View style={styles.borderv}>
                <Image style={styles.img50} source={require('../img/js/chengguo4.png')}></Image>
                <Text style={styles.textshenls20}>价值变现</Text>
              </View>
            </View>


            <View style={styles.zwview}>



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
    paddingBottom: 6,
    // margin: 10,
  },


  headimg025: {
    height: WIDTH033,
    width: WINDOW_WIDTH,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 6,
    paddingLeft: 20,
  },

  headimg1: {
    height: WIDTH04,
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
    // padding: 25,
    zIndex: 99,
    padding: 15,
    paddingLeft: 27,
    paddingRight: 18,
    paddingBottom: 35,

  },

  zwview1: {
    // padding: 25,
    zIndex: 99,
    margin: 15,
    padding: 20,
    backgroundColor: '#d3bb95',

  },

  zwviewhuis: {
    backgroundColor: '#efefef',
    paddingTop: 120,
    paddingBottom: 40,
    paddingLeft: 25,
    paddingRight: 18,
    marginTop: -120,
  },
  zwtitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
  },

  zwtitle1: {
    color: '#fff',
    fontSize: 20,
    paddingTop: 15,
  },


  zwtitle2: {
    color: '#fff',
    fontSize: 20,
    paddingTop: 5,
    fontWeight: 'bold',
  },


  zwtitle3: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  zwtitle4: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },



  zwsj: {

  },

  headtitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 28,
  },


  headtitletop: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 28,
    marginTop: 10,
  },

  logView: {
    // marginTop: -20,
    backgroundColor: '#fff',
    // borderTopLeftRadius: 12,
    // borderTopRightRadius: 12,
    // zIndex: 98,
    // elevation: 98,
    // paddingLeft: 15,
    // paddingRight: 15,
    // marginLeft:10,
    // marginRight:10,
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
    marginTop: 35,
    flexDirection: 'row',
    backgroundColor: '#fff',
    // paddingLeft: 15,
    // paddingRight: 15,
    // paddingTop: 8,
    paddingBottom: 8,
    justifyContent: 'center',
  },

  titleview2: {
    marginTop: 3,
    flexDirection: 'row',
    paddingBottom: 8,
    justifyContent: 'center',
  },


  begintext2: {
    fontSize: 20,
    color: '#000',
  },

  xhxview: {
    // height: 36,
    // marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  xhximg: {
    height: WIDTH01,
    width: WINDOW_WIDTH,
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
    color: '#000',
    marginTop: 6,
    // paddingLeft: 4,
    // borderLeftWidth:4,
    // borderLeftColor:'#e70012',
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

  zwtextbottom15: {
    flex: 1,
    flexDirection: 'column',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 30,
    lineHeight: 30,
    color: '#212121',
    textAlign: 'justify',
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
    // marginTop: 1,
    flexDirection: 'row',
    // backgroundColor: '#eeedf2',
    // borderTopLeftRadius: 12,
    // borderTopRightRadius: 12,
    // padding: 5, 
  },


  menuViewbigbox: {
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#eeeeee',
    width: head_heigth,
    borderColor: '#bfbfbf',
    borderTopWidth: 1,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    paddingBottom: 15,
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
  },

  titleview3: {
    backgroundColor: '#efefef',
    paddingTop: 20,
    paddingBottom: 40,
    padding: 20,
    // justifyContent: 'flex-start',
    // alignItems: 'center',
  },



  headtitle1: {
    color: '#212121',
    fontWeight: 'bold',
    fontSize: 20,
    borderLeftWidth: 3,
    borderColor: '#d33d3c',
    paddingLeft: 12,
  },

  headtitle2: {
    marginTop: 40,
    color: '#212121',
    fontWeight: 'bold',
    fontSize: 20,
    borderLeftWidth: 3,
    borderColor: '#d33d3c',
    paddingLeft: 12,
  },


  rowv: {
    // marginTop: 25,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#bfbfbf',
  },


  borderv: {
    alignItems: 'center', justifyContent: 'center',
    width: head_heigth,
    height: head_heigth,
    borderColor: '#bfbfbf',
    // borderTopWidth: 1,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    // paddingBottom: 15,
    paddingTop: 15,
  },


  img50: {
    height: 50,
    width: 50,
  },





  textshenls20: {
    fontSize: 20,
    color: '#000c3a',
    fontWeight: 'bold',
    marginTop: 10,
  },




});

export default RxczxPage;
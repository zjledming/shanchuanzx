'use strict';

import React, { Component } from 'react';
import { View,Text,ScrollView,StyleSheet } from 'react-native';

import {px2dp} from '../util/format';

export default class TabList extends Component{
    constructor(props){
      super(props);
      this.state={
        curIndex:0
      };
      this.selectTab = this._selectTab.bind(this);
    }

    _selectTab(index){
      this.setState({
        curIndex:index
      },()=>{
        this.props.selectHandle(index)
      })
    }

    render(){
        return(
          <ScrollView
            horizontal={true}
            contentContainerStyle={styles.tabList}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
          >
            {
              this.props.items.map((item,index)=>{
                return(
                    <Text
                      key={'tab'+index}
                      onPress={()=>{this.selectTab(index)}} 
                      style={[styles.tabItem,this.state.curIndex===index?styles.selectedText:styles.tabText]}
                    >
                      {item}
                    </Text>
                )
              })
            }
          </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
  scrollView:{
    // height:px2dp(51),
    // maxHeight:px2dp(51),
    borderBottomWidth:px2dp(1),
    borderBottomColor:'#f5f5f3',
  },
  tabList:{
    flexDirection:'row',
    flexWrap:'nowrap',
    alignItems:'center',
    backgroundColor:'#fff',
  },
  tabItem:{
    // width:px2dp(50),
    margin:px2dp(10),
    marginLeft:px2dp(10),
    marginRight:px2dp(10),
    // height:px2dp(51),
    // maxHeight:px2dp(51),
    textAlign:'center',
    // lineHeight:px2dp(30),
  },
  tabText:{
    fontSize:16,
  },
  selectedText:{
    fontSize:17,
    color:'#fa4747',
    fontWeight:'bold',
  }
})
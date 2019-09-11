'use strict';

import { Dimensions } from 'react-native';

const deviceH = Dimensions.get('window').height;
const deviceW = Dimensions.get('window').width;


const basePx = 375;

export function isSpace(strMain) {
    var strComp = strMain;
    try {
        if (strComp == "  " || strComp == "" || strComp == " "
            || strComp == null || strComp == "null" || strComp.length == 0
            || typeof strMain == "undefined" || strMain == "undefined") {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}


export function deling(strMain) {
    if(isSpace(strMain)){
        return '0';
    }else{
        return strMain
    }
}



//清空字符串两边的空白
function trim(strMain) {
	if (isSpace(strMain)) {
		return "";
	}
	strMain = strMain + "";
	return strMain.replace(/(^\s*)|(\s*$)/g, "");
}


export function parseFloatfun(parm){
	parm = trim(parm);
	if(isSpace(parm)){
		return 0;
	}
	if(isNaN(parm)){
		return 0;
	}
	try {
		parm = parseFloat(parm)
	  }catch(err){
	  	return 0;
	  }
	 return parm;
}

export function checkdayu(a,b){
    try {
        if(parseFloatfun(a) > parseFloatfun(b)){
            return true;
        }
     }catch(err){
         return false;
     }
   return false;
}





export function px2dp(px) {
    return px * deviceW / basePx;
}

export function getdthei(gkbl) {
    if (isSpace(gkbl)) {
        return (deviceW - 40) * 0.5;
    }
    return gkbl * (deviceW - 40);
}

export function getdthei1(gkbl) {
    let  WIDTH_xhx = deviceW*0.75;
    if (isSpace(gkbl)) {
        return WIDTH_xhx;
    }
    return gkbl * WIDTH_xhx;
}

export function getdthei100(gkbl) {
    if (isSpace(gkbl)) {
        return deviceW * 0.5;
    }
    return gkbl * deviceW;
}





//秒转换为xx:xx格式
export function formatTime(seconds) {
    return [
        parseInt(seconds / 60 % 60),
        parseInt(seconds % 60)
    ].join(":").replace(/\b(\d)\b/g, "0$1");
}

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

export function px2dp(px) {
    return px * deviceW / basePx;
}

export function getdthei(gkbl) {
    if (isSpace(gkbl)) {
        return (deviceW - 40) * 0.5;
    }
    return gkbl * (deviceW - 40);
}



//秒转换为xx:xx格式
export function formatTime(seconds) {
    return [
        parseInt(seconds / 60 % 60),
        parseInt(seconds % 60)
    ].join(":").replace(/\b(\d)\b/g, "0$1");
}

import { Base64, crc32 } from "../util/encrypt.js";
import * as LoginInfo from '../page/Login/LoginInfo';

// var baseUrl = 'https://fxmdev.mynatapp.cc/creatorepp/';
// var baseUrl = 'http://106.52.104.159/sczx/';
var baseUrl = 'http://www.shanchuanzixun.vip/sczx/';


//获取主题
export function getbaseurl() {
    return baseUrl;
}

//获取主题
export function getchannelInfo(keyword) {
    return new Promise((resolve, reject) => {

        let api = baseUrl + `app/jsp/jk/selectXxflList.jsp?keyword=${keyword}`;
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功
                    let list = json.data; // 列表数据

                    resolve(list);
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}



//获取主题
export function getSonchannelInfo(parentfl) {
    return new Promise((resolve, reject) => {

        let api = baseUrl + `app/jsp/jk/selectXxflList.jsp?remark2=${parentfl}`;
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功
                    let list = json.data; // 列表数据

                    resolve(list);
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}



//获取新闻
export function getNewsByChannel(module, channel, zdstate, start = 0, end = 10) {
    return new Promise((resolve, reject) => {

        let user_ = LoginInfo.getUserInfo();

        let api = baseUrl + `app/jsp/jk/selectPubpList.jsp?module=${module}&type=${channel}&zdstate=${zdstate}&startSize=${start}&pageSize=${end}&appu_id=${user_.phone}`;
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功
                    let list = json.data; // 列表数据

                    resolve(list);
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}


//获取新闻
export function getXxBy(keyword,zdstate, start, end) {
    return new Promise((resolve, reject) => {

        let user_ = LoginInfo.getUserInfo();

        let api = baseUrl + `app/jsp/jk/selectPubpList.jsp?module=1&type=0&keyword=${keyword}&zdstate=${zdstate}&startSize=${start}&pageSize=${end}&appu_id=${user_.phone}`;
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功
                    let list = json.data; // 列表数据

                    resolve(list);
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}


//获取案例
export function getAlBy(keyword, hangy, zdstate, start = 0, end = 10) {
    return new Promise((resolve, reject) => {

        let user_ = LoginInfo.getUserInfo();
        let api = baseUrl + `app/jsp/jk/selectPubpList.jsp?module=3&type=&keyword=${keyword}&hangy=${hangy}&zdstate=${zdstate}&startSize=${start}&pageSize=${end}&appu_id=${user_.phone}`;
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功
                    let list = json.data; // 列表数据

                    resolve(list);
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}

//获取案例行业信息
export function getHangy() {
    return new Promise((resolve, reject) => {
        let api = baseUrl + `app/jsp/jk/selectHangyList.jsp`;
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功
                    let list = json.data; // 列表数据
                    resolve(list);
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}




//获取客户
export function selectTxsxList(username, words, start = 0, end = 10) {


    return new Promise((resolve, reject) => {
        let api = baseUrl + `app/jsp/jk/selectTxsxList.jsp?words=${words}&username=${username}&startSize=${start}&pageSize=${end}`;
        console.log('words:' + words);
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功
                    let list = json.data; // 列表数据
                    resolve(list);
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}




//获取客户
export function selectKehuList(username, words, start = 0, end = 10) {


    return new Promise((resolve, reject) => {
        let api = baseUrl + `app/jsp/jk/selectKehuList.jsp?words=${words}&username=${username}&startSize=${start}&pageSize=${end}`;
        console.log('words:' + words);
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功
                    let list = json.data; // 列表数据
                    resolve(list);
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}



export function selectDingdanList(username, words, start = 0, end = 10) {


    return new Promise((resolve, reject) => {
        let api = baseUrl + `app/jsp/jk/selectDingdanList.jsp?words=${words}&username=${username}&startSize=${start}&pageSize=${end}`;
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功
                    let list = json.data; // 列表数据
                    resolve(list);
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}

export function deleteShix(id) {


    return new Promise((resolve, reject) => {
        let api = baseUrl + `app/jsp/jk/deleteShix.jsp?id=${id}`;
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功
                    resolve(json.data);
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}



//获取客户
export function deleteKehu(id) {


    return new Promise((resolve, reject) => {
        let api = baseUrl + `app/jsp/jk/deleteKehu.jsp?id=${id}`;
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功
                    resolve(json.data);
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}



export function deleteDingd(id) {

    return new Promise((resolve, reject) => {
        let api = baseUrl + `app/jsp/jk/deleteKehu.jsp?id=${id}&flag=dingd`;
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功
                    resolve(json.data);
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}



export function deletePingl(id) {

    return new Promise((resolve, reject) => {
        let api = baseUrl + `app/jsp/jk/deleteKehu.jsp?id=${id}&flag=pingl`;
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功
                    resolve(json.data);
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}



export function deleteShouc(id) {

    let user_ = LoginInfo.getUserInfo();

    return new Promise((resolve, reject) => {
        let api = baseUrl + `app/jsp/jk/deleteKehu.jsp?id=${id}&flag=shouc&appu_id=${user_.phone}`;
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功
                    resolve(json.data);
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}



//获取客户
export function shouc(appu_id, appu_name, sl_id, sl_title, shoucflag, ssqy) {


    return new Promise((resolve, reject) => {
        let api = baseUrl + `app/jsp/jk/doShouc.jsp?appu_id=${appu_id}&appu_name=${appu_name}&ssqy=${ssqy}&sl_id=${sl_id}&sl_title=${sl_title}&shoucflag=${shoucflag}`;
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功
                    LoginInfo.setZjf(json.data.zjf);
                    resolve(json.data);
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}



//获取banner
export function getBanners(module, start = 0, end = 10) {
    return new Promise((resolve, reject) => {
        let api = baseUrl + `app/jsp/jk/selectPubpList.jsp?module=${module}&startSize=${start}&pageSize=${end}`;
        console.log('module:' + module);
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功
                    let list = json.data; // 列表数据

                    resolve(list);
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}



//获取正文信息
export function getZwByUuid(uuid) {
    return new Promise((resolve, reject) => {
        let api = baseUrl + `app/jsp/jk/selectPubsList.jsp?uuid=${uuid}`;
        console.log('uuid:' + uuid);
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功 
                    resolve(json.data);// 列表数据
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}



//获取课程
export function selectKechengList() {
    return new Promise((resolve, reject) => {
        let api = baseUrl + `app/jsp/jk/selectKechengList.jsp`;
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功 
                    resolve(json.data);// 列表数据
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}

//获取标题数据
export function getBtByUuid(uuid) {
    return new Promise((resolve, reject) => {
        let api = baseUrl + `app/jsp/jk/selectPubpInfo.jsp?uuid=${uuid}`;
        console.log('uuid:' + uuid);
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功 
                    resolve(json.data);// 列表数据
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}

// 获取积分
export function getDrjf(appu_id) {
    return new Promise((resolve, reject) => {
        let api = baseUrl + `app/jsp/jk/selectJfjlInfo.jsp?appu_id=${appu_id}&flag=1`;
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {
                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功 
                    resolve(json.data);// 列表数据
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}


// 获取积分
export function getZjf(appu_id) {
    return new Promise((resolve, reject) => {
        let api = baseUrl + `app/jsp/jk/selectJfjlInfo.jsp?appu_id=${appu_id}`;
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {


                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功 
                    LoginInfo.setZjf(json.data.zjf);
                    resolve(json.data);// 列表数据
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}


//积分
export function dojifen(type, sl_id, sl_name, jfsc) {
    return new Promise((resolve, reject) => {
        let user_ = LoginInfo.getUserInfo();
        let api = baseUrl + `app/jsp/jk/dojifen.jsp?appu_id=${user_.phone}&appu_name=${user_.realname}&remark1=${user_.ssqy}&type=${type}&sl_id=${sl_id}&sl_title=${sl_name}&remark2=${jfsc}`;
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功 
                    resolve(json.data);// 列表数据
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}


//获取评论数量
export function getplnum(sl_id, plr_id) {
    return new Promise((resolve, reject) => {
        let api = baseUrl + `app/jsp/jk/selectPinglnum.jsp?sl_id=${sl_id}&plr_id=${plr_id}`;
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功 
                    LoginInfo.setZjf(json.data.zjf);
                    resolve(json.data);// 列表数据
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}



//个人中心获取数量
export function getyhnums(phone) {
    return new Promise((resolve, reject) => {
        let api = baseUrl + `app/jsp/jk/selectGrnums.jsp?phone=${phone}`;
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功 
                    LoginInfo.setZjf(json.data.zjf);
                    resolve(json.data);// 列表数据
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}



//获取标题数据
export function getShoucflag(appu_id, sl_id) {
    return new Promise((resolve, reject) => {
        let api = baseUrl + `app/jsp/jk/selectShoucInfo.jsp?appu_id=${appu_id}&sl_id=${sl_id}`;
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功 
                    resolve(json.data);// 列表数据
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}


//获取标题数据
export function selectKeChengInfo(id) {
    return new Promise((resolve, reject) => {
        let api = baseUrl + `app/jsp/jk/selectKeChengInfo.jsp?id=${id}`;
        fetch(api)
            .then((response) => response.text())
            .then((responseText) => {

                var json = JSON.parse(responseText);
                if (json.status === '0') { // 数据请求成功 
                    resolve(json.data);// 列表数据
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}





//获取视频列表
export function getVideoList(start = 0, end = 10) {
    return new Promise((resolve, reject) => {
        let c = 'hotsoon_video';// 热门小视频
        let api = `http://is.snssdk.com/api/news/feed/v51/?category=video`;
        // let api = `http://www.yidianzixun.com/home/q/news_list_for_channel?channel_id=u13746&cstart=${start}&cend=${end}&infinite=true&refresh=1&__from__=wap&appid=web_yidian`;
        fetch(api)
            .then((response) => response.json())
            .then((json) => {
                if (json.message === 'success') { // 数据请求成功
                    let videoArr = [];

                    let newsArr = json.data; // 列表数据
                    for (let item of newsArr) {
                        // 获取内容数据
                        let content = item.content;
                        console.log(content);
                        // 获取json内容
                        let json = JSON.parse(content);


                        // 添加到视频列表中
                        if (json.url) {
                            let videoID = json.video_id; // 视频id
                            console.log('videoID:' + videoID);


                            // 获取视频url
                            getVideoUrl(videoID)
                                .then((data) => {
                                    json.video_url = data;
                                    console.log('video_url:' + json.video_url);
                                    videoArr.push(json)
                                }).catch((e) => {
                                    throw new Error(json.status);
                                });

                            /*                            let video_url = "http://v11-tt.ixigua.com/f02f452df9a97b997beebd258d1b4a1c/5b9005c9/video/m/22090ece4d6324242d786e766a29ff64da8115b1b6e0000cc29bc1f667e/";
                                                        json.video_url = video_url;
                                                        console.log('video_url:' + json.video_url);
                                                        videoArr.push(json)*/
                        }

                        // getVideoContentApi("v020046f0000be7pa83bo1i7scpa49cg");

                        /*                        json.data.map((item, index) => {
                                                    if (item.video_url) {
                                                        item.key = item.url;
                                                        videoArr.push(item)
                                                    }
                                                });*/
                    }

                    // 延迟操作处理
                    setTimeout(() => {
                        resolve(videoArr);
                    }, 1000);
                } else {
                    throw new Error(json.status);
                }

            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}

// 获取视频内容数据
export function getVideoUrl(videoID) {
    return new Promise((resolve, reject) => {
        fetch(getVideoContentApi(videoID)) // 根据视频ID,获取视频内容
            .then((response) => response.json())
            .then((json) => {
                if (json.message === 'success') { // 数据请求成功
                    let newsArr = json.data; // 数据
                    let main_url = newsArr.video_list.video_1.main_url; // base64位编码的url

                    // let decodedData = window.atob(main_url); // 需要浏览器支持
                    let decodedData = new Base64().decode(main_url);
                    console.log('mian_url:' + decodedData);
                    resolve(decodedData);
                } else {
                    throw new Error(json.status);
                }

            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}


/**
 * 根据视频ID,获取视频内容的具体信息
 * @param videoID
 * @return http://ib.365yg.com/video/urls/v/1/toutiao/mp4/视频ID?r=16位随机数&s=加密结果
 *
 */
function getVideoContentApi(videoID) {
    // 获取16位的随机数
    let getRandom = function () {
        let result = '';
        for (let i = 0; i < 16; i++) {
            let c = Math.floor(Math.random() * 10);
            result += c;
            console.log(c);
        }
        return result.toString();
    };

    let VIDEO_HOST = "http://ib.365yg.com"; // host
    let video_url = `/video/urls/v/1/toutiao/mp4/${videoID}?r=${getRandom()}`; // 原始字符串
    let crcString = crc32(video_url); // 对原始字符串进行crc32加密
    console.log(`video_url:${video_url},crc32str:${crcString}`);

    // 获取详细的url链接数据
    let url = VIDEO_HOST + video_url + "&s=" + crcString;
    console.log('final_url:' + url);
    return url;
}


//获取新闻热搜
export function getHotKey() {
    return new Promise((resolve, reject) => {
        fetch(`http://www.yidianzixun.com/home/q/hot_search_keywords?appid=web_yidian`)
            .then((response) => response.json())
            .then((json) => {
                if (json.code === 0) {
                    let keywords = json.keywords.slice();
                    let wordArr = [];
                    keywords.map((item, index) => {
                        wordArr.push(item.name);
                    });
                    resolve(wordArr);
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}

//获取搜索实时匹配
export function getTipsWords(words) {
    return new Promise((resolve, reject) => {
        fetch(`http://www.yidianzixun.com/home/q/search_channel?word=${encodeURIComponent(words)}&appid=web_yidian`)
            .then((response) => response.json())
            .then((json) => {
                if (json.code === 0) {
                    let wordsArr = [];
                    if (json.channels) {
                        let arr = json.channels.slice();
                        arr.map((item, index) => {
                            if (item.type === 'keyword' || item.type === 'sugkwd') {
                                wordsArr.push(item.name);
                            }
                        })
                    }
                    resolve(wordsArr);
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}

//获取发现页面列表
export function getFindList(offset = 10) {
    return new Promise((resolve, reject) => {
        fetch(`https://m.guokr.com/apis/minisite/article.json?retrieve_type=by_channel_v2&channel_key=hot&subject_key=all&limit=10&offset=${offset}`)
            .then((response) => response.json())
            .then((json) => {
                if (json.ok) {
                    resolve(json.result)
                } else {
                    throw new Error('暂时无法获得数据');
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}

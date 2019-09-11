import React from 'react';
import {
    StyleSheet, Dimensions
} from 'react-native';


import px2dp from './px2dp';

var w_width = Dimensions.get('window').width;
var w_width05 = w_width * 0.5;
var w_width03 = w_width * 0.3;
var w_width028 = w_width * 0.28;
var w_width033 = w_width * 0.333;
var dt_width = w_width - 20;
var dt_height = dt_width * 0.333;

export const mstyles = StyleSheet.create({

    viewrbegin: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },

    viewrowb: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    viewcenter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewrow: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    viewrs: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    viewc: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

    viewcb: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    viewcs: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },

    flexWrap: {
        flexWrap: 'wrap',
    },

    text24bais: {
        fontSize: px2dp(24),
        color: '#fff',
    },

    text14bais: {
        fontSize: px2dp(14),
        color: '#fff',
    },

    text12bais: {
        fontSize: px2dp(12),
        color: '#fff',
    },

    text16heis: {
        fontSize: px2dp(16),
        color: '#000',
    },

    text16bais: {
        fontSize: px2dp(16),
        color: '#fff',
    },

    text15bais: {
        fontSize: px2dp(15),
        color: '#fff',
    },

    text10bais: {
        fontSize: px2dp(10),
        color: '#fff',
    },

    text14heis: {
        fontSize: px2dp(14),
        color: '#000',
    },

    text15heis: {
        fontSize: px2dp(15),
        color: '#000',
    },

    text10huis: {
        fontSize: px2dp(10),
        color: '#9e9e9e',
    },

    text14huis: {
        fontSize: px2dp(14),
        color: '#9e9e9e',
    },
    text12huis: {
        fontSize: px2dp(12),
        color: '#9e9e9e',
    },

    text10huis: {
        fontSize: px2dp(10),
        color: '#9e9e9e',
    },


    text8bais: {
        fontSize: px2dp(6),
        color: '#fff',
    },

    textbd2huangs: {
        borderWidth: px2dp(2),
        borderColor: '#f5dc28',
    },

    textbd1huis: {
        borderWidth: px2dp(1),
        borderColor: '#f5f5f5',
    },


    borderleft: {
        borderLeftWidth: 1,
        borderColor: '#f5f5f5',
    },

    borderright: {
        borderRightWidth: 1,
        borderColor: '#f5f5f5',
    },

    textbdrd30: {
        borderRadius: px2dp(30),
    },

    textbdrd35: {
        borderRadius: px2dp(35),
    },

    textbdrd5: {
        borderRadius: px2dp(5),
    },

    borderrs10: {
        borderTopRightRadius: px2dp(10),
        borderTopLeftRadius: px2dp(10),
    },

    borderrs10c: {
        borderRadius: px2dp(10),
    },


    borderrs5: {
        borderRadius: px2dp(5),
    },


    fontsize12: {
        fontSize: px2dp(12),
    },


    textzs: {
        position: 'absolute', bottom: px2dp(10), left: px2dp(10),
    },

    textb: {
        fontWeight: 'bold',
    },

    pore: {
        position: 'relative',
    },

    width200: {
        width: px2dp(200),
    },

    height05: {
        height: w_width05,
    },

    height20: {
        height: px2dp(20),
    },

    height24: {
        height: px2dp(24),
    },

    height30: {
        height: px2dp(30),
    },

    lineh12: {
        lineHeight: px2dp(12),
    },

    lineh18: {
        lineHeight: px2dp(18),
    },

    lineh8: {
        lineHeight: px2dp(8),
    },

    wh30: {
        width: px2dp(30),
        height: px2dp(30),
    },

    wh70: {
        width: px2dp(70),
        height: px2dp(70),
    },

  

    wh03: {
        width: w_width03,
        height: w_width03,
    },


    h033: {
        height: dt_height,
    },

    h120: {
        height: px2dp(120),
    },

    h140: {
        height: px2dp(140),
    },

    w100b: {
        width: w_width,
    },

    w80: {
        width: px2dp(80),
    },

    w300: {
        width: px2dp(300),
    },


    wh120: {
        width: px2dp(120),
        height: px2dp(120),
    },

    w120sy: {
        width: dt_width - 120 - 20 - 10,
    },


    paddingbot18: {
        paddingBottom: px2dp(18),
    },

    paddingbot12: {
        paddingBottom: px2dp(12),
    },

    paddingleft8: {
        paddingLeft: px2dp(8),
    },

    padding10: {
        padding: px2dp(10),
    },

    padding13: {
        padding: px2dp(13),
    },

    padding15: {
        padding: px2dp(15),
    },

    padding8sx: {
        paddingVertical: px2dp(8),
    },

    padding30sx: {
        paddingVertical: px2dp(30),
    },

    padding25zy: {
        paddingHorizontal: px2dp(25),
    },


    padding8zy: {
        paddingHorizontal: px2dp(8),
    },

    padding20zy: {
        paddingHorizontal: px2dp(20),
    },

    marginleft8: {
        marginLeft: px2dp(8)
    },

    marginright3: {
        marginRight: px2dp(3)
    },

    margintop13: {
        marginTop: px2dp(13)
    },

    margintop13sx: {
        marginVertical: px2dp(13),
    },


    margintop10: {
        marginTop: px2dp(10)
    },

    margintop5: {
        marginTop: px2dp(5)
    },
    margintop7: {
        marginTop: px2dp(7)
    },

    margin10zy: {
        marginHorizontal: px2dp(10)
    },

    margin13: {
        margin: px2dp(13)
    },

    marginbot13: {
        marginBottom: px2dp(13)
    },

    marginbot7: {
        marginBottom: px2dp(7)
    },

    marginbotf2: {
        marginBottom: -2
    },

    marginbotf4: {
        marginBottom: -4
    },


    backbais: {
        backgroundColor: '#ffffff',
    },

    backhuis: {
        backgroundColor: '#f5f5f5',
    },

    backhongs: {
        backgroundColor: '#d33d3c',
    },

    imglog: {
        height: px2dp(22),
        width: px2dp(108),
    },
    imgdt0: {
        height: w_width028,
        width: w_width,
    },
    imgdt: {
        height: dt_height,
        width: dt_width,
    },
    imgdt120: {
        height: px2dp(120),
        width: dt_width,
    },
    imgdt140: {
        height: px2dp(140),
        width: dt_width,
    },
    imghead: {
        height: w_width05,
        width: w_width,
        resizeMode: 'stretch',
    },
    img19: {
        height: px2dp(19),
        width: px2dp(19),
    },
    img2628: {
        height: px2dp(26),
        width: px2dp(28),
    },

    img26: {
        height: px2dp(26),
        width: px2dp(26),
    },

    img30: {
        height: px2dp(30),
        width: px2dp(30),
    },
    img60: {
        height: px2dp(60),
        width: px2dp(60),
    },
    img120: {
        height: px2dp(120),
        width: px2dp(120),
    },




    loadbais: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: px2dp(60),
        backgroundColor: '#fff',

    },
    loadhuis: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: px2dp(60),
        backgroundColor: '#f5f5f5',

    },






});

module.exports = mstyles; 
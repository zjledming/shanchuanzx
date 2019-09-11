import React from 'react';
import { StackNavigator } from 'react-navigation';
import { TabNav } from "./RootPage";
import VideoScreen from "./page/Task/VideoScreen";
import PayScreen from "./page/Task/PayScreen";
import ContactScreen from "./page/Task/ContactScreen";
import MovieListScreen from "./page/Task/MovieListScreen";
import LoginIndex from "./page/Login/LoginIndex";
import LoginScreen from "./page/Login/LoginScreen";
import UserProfile from "./page/Mine/UserProfile";
import Xxjf from "./page/Mine/Xxjf";
import Kehuinfo from "./page/Mine/Kehuinfo";
import Kechengbuy from "./page/Mine/Kechengbuy";
import SettingScreen from "./page/Mine/SettingScreen";
import NewsListScreen from "./page/Task/NewsListScreen";
import DetailListScreen from "./page/Task/DetailListScreen";
import LoginByVerify from "./page/Login/LoginByVerify";
import ForgetPsw from "./page/Login/ForgetPsw";
import RegisterMerchant from "./page/Login/RegisterMerchant";
import RegisterMerchantNext from "./page/Login/RegisterMerchantNext";
import RePassword from "./page/Login/RePassword";
import RegisterSuccess from "./page/Login/RegisterSuccess";
import ShareScreen from "./page/Task/ShareScreen";
import FindPage from "./page/FindPage";
import HomePage from "./page/HomePage";
import HomeSonPage from "./page/Home/HomeSonPage";
import FindxxPage from "./page/FindxxPage";
import FindxxSonPage from "./page/FindxxSonPage";
import FindscPage from "./page/FindscPage";
import FindplPage from "./page/FindplPage";
import FindhcPage from "./page/FindhcPage";
import GuanyPage from "./page/GuanyPage";
import Detail from "./page/Detail";
import Detailkhal from "./page/Detailkhal";
import Detailhuanc from "./page/Detailhuanc";
import SqzxPage from "./page/SqzxPage";
import RxczxPage from "./page/RxczxPage";
import Kechengdetail from "./page/Kechengdetail";
import Hxkc from "./page/Hxkc";
import YjyPage from "./page/YjyPage";
import SxyPage from "./page/SxyPage";
import YfzxPage from "./page/YfzxPage";
import ZxzxPage from "./page/ZxzxPage";
import KehuPage from "./page/KehuPage";
import DingdPage from "./page/DingdPage";
import KehuxzPage from "./page/KehuxzPage";
import WebScreen from "./page/Task/WebScreen";
import TxsxPage from "./page/TxsxPage";


const App = StackNavigator({
    WebScreen: { screen: WebScreen },
    Setting: { screen: SettingScreen },
    UserProfile: { screen: UserProfile },
    Xxjf: { screen: Xxjf },
    Kechengbuy: { screen: Kechengbuy },
    Movie: { screen: MovieListScreen },
    DetailListScreen: { screen: DetailListScreen },
    News: { screen: NewsListScreen },
    Video: { screen: VideoScreen },
    Contact: { screen: ContactScreen },
    Share: { screen: ShareScreen },
    Pay: { screen: PayScreen },
    Login: { screen: LoginScreen }, // 登录页
    LoginByVerify: { screen: LoginByVerify }, // 短信登录
    ForgetPsw: { screen: RePassword }, // 忘记密码  ForgetPsw
    LoginIndex: { screen: LoginIndex },
    RegisterMerchant: { screen: RegisterMerchant }, // 注册页
    RegisterMerchantNext: { screen: RegisterMerchantNext }, // 注册下一页
    RegisterSuccess: { screen: RegisterSuccess }, // 注册成功
    FindPage: { screen: FindPage },
    HomePage: { screen: HomePage },
    HomeSonPage: { screen: HomeSonPage },
    FindxxPage: { screen: FindxxPage },
    FindxxSonPage: { screen: FindxxSonPage },
    FindhcPage: { screen: FindhcPage },
    GuanyPage: { screen: GuanyPage },
    FindscPage: { screen: FindscPage },
    FindplPage: { screen: FindplPage },
    Kehuinfo: { screen: Kehuinfo },
    Detail: { screen: Detail },
    Detailkhal: { screen: Detailkhal },
    Detailhuanc: { screen: Detailhuanc },
    SqzxPage: { screen: SqzxPage },
    Hxkc: { screen: Hxkc },
    RxczxPage: { screen: RxczxPage },
    Kechengdetail: { screen: Kechengdetail },
    YjyPage: { screen: YjyPage },
    SxyPage: { screen: SxyPage },
    YfzxPage: { screen: YfzxPage },
    ZxzxPage: { screen: ZxzxPage },
    KehuPage: { screen: KehuPage },
    TxsxPage: { screen: TxsxPage },
    DingdPage: { screen: DingdPage },
    KehuxzPage: { screen: KehuxzPage },
    Main: {
        screen: TabNav,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    }
},
    {
        initialRouteName: 'Main',
        headerMode: 'screen'
    });

export default App;

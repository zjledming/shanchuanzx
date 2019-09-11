import {AppRegistry} from 'react-native';
import Root from "./src/root";
import {  YellowBox } from 'react-native';


AppRegistry.registerComponent('shanchuanzx', () => Root);

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);//忽略警告
 

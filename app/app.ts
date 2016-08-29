import 'es6-shim';
import {App, Platform, IonicApp} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {CommonService} from "./services/CommonService";
import {RouteConfig} from "angular2/router";
import {TopicsPage} from "./pages/topics/topics";
import {UserPage} from "./pages/user/user";
import {TopicDetailPage} from "./pages/topicDetail/topicDetail";
import {LoginPage} from "./pages/login/login";
import {AccountPage} from "./pages/account/account";
import {Toast} from 'ionic-native';


//全局的一些click事件等
//包括nav  footer目前没有
//


@App({
  templateUrl: 'build/app.html',
  providers: [CommonService],
  config: {
    backButtonText: '',
    backButtonIcon: 'arrow-round-back',
  }
})

@RouteConfig([
  {path: '/topics', component: TopicsPage, as: 'Topic'},
  {path: '/topics/:tab', component: TopicsPage, as: 'Topic'},
  {path: '/topicDetail/:id', component: TopicDetailPage, as: 'TopicDetail'},
  {path: '/user/:loginname', component: UserPage, as: 'User'},
  {path: '/login', component: LoginPage, as: 'Login'},
  {path: '/account', component: AccountPage, as: 'Account'}
])

export class MyApp {

  //MyApp类

  //私有变量
  private rootPage = TopicsPage;//初始化时就跳转到TopicsPage
  private menuPage:any;
  private tabs = [];
  private backPressed:boolean = false;


  //构造函数
  constructor(private app:IonicApp, platform:Platform, private commonService:CommonService) {

    //platform加载完毕
    platform.ready().then(() => {
      StatusBar.styleDefault();
      this.registerBackButtonListener();
    });
  }

  registerBackButtonListener() {

    //可能包括手机里的后退键，看

    document.addEventListener('backbutton', ()=> {
      let nav = this.getNav();
      if (nav.canGoBack()) {
        nav.pop();
        return;
      }
      if (!this.backPressed) {
        this.backPressed = true;
        Toast.showShortBottom("再按一次退出应用").subscribe(
            toast => {
              console.log(toast);
            }
        );
        setTimeout(()=>this.backPressed = false, 2000);
        return;
      }
      // 利用 cordova.js 退出应用(不影响使用)
      // navigator.app.exitApp();
    }, false);
  }

  getNav() {
    //好像是获取ionic里的nav对象
    return this.app.getComponent('nav');
  }

  //选择具体栏目
  setRootPage(tab:string) {
    //设置#topics后面的参数tab为string
    this.getNav().setRoot(TopicsPage, {tab: tab});
  }
}

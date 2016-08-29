import {Page, NavController, NavParams, Modal, Storage, LocalStorage, Events} from 'ionic-angular';
import {IonicService} from "../../services/IonicService";
import {ConfigService} from "../../services/ConfigService";
import {TabNamePipe} from "../../pipe/TabNamePipe";
import {AvatarPipe} from "../../pipe/AvatarPipe";
import {AmTimeAgoPipe} from '../../pipe/AmTimeAgoPipe';
import {TopicAddPage} from "../modal/topicAdd/topicAdd";
import {LoginPage} from "../login/login";
import {AccountPage} from "../account/account";


//指定templateUrl
//IonicService  其实名称命名不对， 其实就是bbsObject数据管理者 里面包含了多个click事件
//ConfigService    通用click事件

@Page({
  templateUrl: 'build/pages/topics/topics.html',
  providers: [IonicService, ConfigService],
  pipes: [AmTimeAgoPipe, TabNamePipe, AvatarPipe]
})

export class TopicsPage {

  private topics = [];
  private local:LocalStorage;
  private rootPage:any = LoginPage;
  private badge:number = 0;

  //主题列表默认参数
  private params = {
    page: 1,
    tab: 'all',
    limit: 20
  };

  constructor(private ionicService:IonicService, private nav:NavController,
              private navParams:NavParams, private events:Events) {

    //获取#topics后面的参数tab为string

    if (navParams.get('tab')) {
      this.params.tab = navParams.get('tab');
    }

    //标记
    this.events.subscribe('badge', (data)=> {
      this.badge = data;
    });

    //刷新
    this.events.subscribe('doRefresh', ()=> {
      this.params.page = 1;
      this.params.tab = 'all';
      this.ionicService.getTopics(this.params).subscribe(
          data => {
            this.topics = data;
            this.params.page++;
          }
      );
    });
    this.local = new Storage(LocalStorage);
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.ionicService.getTopics(this.params)
          .subscribe(
              data => {
                this.topics = this.topics.concat(data);
                this.params.page++;
              }
          );
      infiniteScroll.complete();
    }, 500); // 延迟500ms
  }

  doRefresh(refresher) {
    this.params.page = 1;
    this.params.tab = 'all';
    setTimeout(() => {
      this.ionicService.getTopics(this.params).subscribe(
          //获取后的数据
          data => {
            this.topics = [];
            this.topics = data;
            this.params.page++;
          }
      );
      refresher.complete();
    }, 500);// 延迟500ms
  }


  //ng监听初始化
  ngOnInit() {
    //初始化成功后去加载论坛的数据
    this.ionicService.getTopics(this.params).subscribe(
        data => {
          this.topics = data;
          this.params.page++;
        }
    );
    //获取用户的站内信信息
    this.local.get('User').then(u=> {
      if (u) {
        this.rootPage = AccountPage;
        let user = JSON.parse(u);
        this.ionicService.getMessageCount(user.accesstoken).subscribe(data=> {
          this.badge = data
        });
      }
    });
  }


  //添加帖子
  addTopic() {
    let modal = Modal.create(TopicAddPage);
    this.nav.present(modal);
  }

  goTo() {
    this.local.get('User').then(u=> {
      if (u) {
        this.nav.push(AccountPage);
      } else {
        this.nav.push(LoginPage);
      }
    });
  }
}
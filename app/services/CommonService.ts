import {Injectable} from 'angular2/core';

@Injectable()
export class CommonService {
  constructor(){
    
  }
  private _tabs = [{
    value: 'share',
    label: '分享123',
    icon:'share'
  }, {
    value: 'ask',
    label: '问答456',
    icon:'help-circle'
  }, {
    value: 'job',
    label: '招聘789',
    icon:'bowtie'
  }, {
    value: 'bb',
    label: '吐槽111',
    icon:'text'
  }];
  getTabs() {
    return this._tabs;
  }
}

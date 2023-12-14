import { Component, SimpleChanges } from '@angular/core';
import * as Parse from 'parse';

declare var $: any; // Declare $ for jQuery

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent {
  channelName: string = 'abc';
  show: any = false;
  objectId: any;
  userSRC: any;
name: any;
  channels:any= [];
  filteredUser: any;
  toBeSubsList:any=[];
SubscribedList: any=[];
  constructor() {
    (Parse as any).initialize('iTcjqQ3K9Be2TNT0Z9GXrPa21iJhNZSRNbFHa4VS', 'NVJWSQTNzplFzGOOnJyzIGfmj3jCX9RDtBnOPokU');
    (Parse as any).serverURL = 'https://parseapi.back4app.com/';

    var objectId = localStorage.getItem('objectId');
    console.log(  '🚀 ~ file: user-list.component.ts:16 ~ UserListComponent ~ ngOnInit ~ objectId:',  objectId);
    if (!objectId) {
      window.location.href = '/';
    } else {
      this.objectId = objectId;
      this.show = true;
    }
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAllChannels();
    $('#tree').click()
    
    
  }

  subscribeClick(channel:any) {
    // Method to handle subscribe click
    console.log(`Subscribed to ${this.channelName}`);
    localStorage.setItem('subsChannel',JSON.stringify(channel) )
    window.location.href='/channelsDetail'
    // You can implement subscription logic here
  }
  async getAllChannels(){
    const YourClassName = (Parse as any).Object.extend('YoutubeUser');
    const query = new (Parse as any).Query(YourClassName);
    var data:any = await query .find()
    data = JSON.parse(JSON.stringify(data))

    const YourClassName1 = (Parse as any).Object.extend('YoutubeSubscribers');
    const query1 = new (Parse as any).Query(YourClassName1);
    query1.contains('UserID',this.objectId)
    var data1:any = await query1.find()
    data1 = JSON.parse(JSON.stringify(data1))

    var subscribedIds = data1.map((item:any) => item.subscribedId);
    this.filteredUser = data.filter((item:any) =>{
      return !subscribedIds.includes(item?.objectId) && item?.objectId != this.objectId
    } ) 

    this.SubscribedList=data.filter((item:any) =>{
      return subscribedIds.includes(item?.objectId) && item?.objectId != this.objectId
    } ) 
    console.log("🚀 ~ file: user-list.component.ts:71 ~ UserListComponent ~ this.SubscribedList=data.filter ~ this.SubscribedList:", this.SubscribedList)


    console.log("🚀 ~ file: user-list.component.ts:60 ~ UserListComponent ~ this.filteredUser=data.filter ~ filteredUser:", this.filteredUser)
    console.log("🚀 ~ file: user-list.component.ts:53 ~ UserListComponent ~ getAllChannels ~ data1:", data1)
    
    const HaveToSubsClass = (Parse as any).Object.extend('YoutubeSubscribers');
    const HaveToSubs = new (Parse as any).Query(HaveToSubsClass);
    HaveToSubs.contains('subscribedId',this.objectId)
    var HaveToSubsdata:any = await HaveToSubs.find()
    HaveToSubsdata = JSON.parse(JSON.stringify(HaveToSubsdata))

    var haveTo= HaveToSubsdata.map((item:any) => item.UserID);
    console.log("🚀 ~ file: user-list.component.ts:76 ~ UserListComponent ~ getAllChannels ~ haveTo:", haveTo)


    this.toBeSubsList =data.filter((item:any) =>{
      return haveTo?.includes(item?.objectId) && item?.objectId != this.objectId
    } ) 


    console.log("🚀 ~ file: user-list.component.ts:83 ~ UserListComponent ~ this.toBeSubsList=data.filter ~ this.toBeSubsList:", this.toBeSubsList)
    
    
    this.channels=data;
    this.userSRC=data?.find((a:any)=>{
      return a?.objectId == this.objectId
    })?.channelImage
    this.name=data?.find((a:any)=>{
      return a?.objectId == this.objectId
    })?.channelName
    console.log("🚀 ~ file: user-list.component.ts:42 ~ UserListComponent ~ getAllChannels ~ data:", data)
  }

  gotoSubs(item:any){
    localStorage.removeItem('subsChannel');
    localStorage.setItem('subsChannel',JSON.stringify(item) )
    window.location.href='/channelsDetail'
  }
}

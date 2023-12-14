import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as Parse from 'parse';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent {
  userForm: FormGroup;
  selectedImageUrl: any;
  oldSubs :any;
  newSubs :any;
  channelUrl :any;
  UserData: any;
  loginUser: any;
  iframeUrl: any;
  showIFrame: boolean=false;
userSRC: any;
name: any;

  constructor(private formBuilder: FormBuilder) {
    
    Parse.initialize(
      'iTcjqQ3K9Be2TNT0Z9GXrPa21iJhNZSRNbFHa4VS',
      'NVJWSQTNzplFzGOOnJyzIGfmj3jCX9RDtBnOPokU'
    );
    (Parse as any).serverURL = 'https://parseapi.back4app.com/';

    this.userForm = this.formBuilder.group({
      channelName: [''],
      channelURL: [''],
      screenShot: [
        '',
        [
          Validators.required,
          this.allowedFileType(['png', 'jpeg','jpg']),
        ],
      ],
      // Add more form controls based on your User interface
    });
  }
  allowedFileType(allowedTypes: string[]) {
    return (control: any) => {
      const url = control.value;
      
      if (url) {
        const fileExtension = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
        
        // Extracted file extension might contain additional characters after the extension
        // You can use regex or additional checks to extract the correct extension
        const cleanExtension = fileExtension.split('?')[0]; // Remove query params
        
        if (!allowedTypes.includes(cleanExtension)) {
          return { invalidFileType: true };
        }
      }
      return null;
    };
  }
  getChannelImageErrors() {
    const channelImage = this.userForm.get('screenShot');
    if (channelImage?.hasError('required')) {
      return 'Please select an image.';
    } else if (channelImage?.hasError('invalidFileType')) {
      return 'Only PNG or JPEG files are allowed.';
    }
    return '';
  }
  clickURL(){
    window.open(this.channelUrl, '_blank');
    // this.showIFrame=true;
    // this.iframeUrl=this.channelUrl
   
  }

  ngOnInit(): void {
    console.log('l'); 
    

    

    try{

      this.loginUser = localStorage.getItem('objectId')    
      console.log("🚀 ~ file: user-detail.component.ts:62 ~ UserDetailComponent ~ ngOnInit ~ this.loginUser:", this.loginUser)
      
      var data:any = localStorage.getItem('subsChannel')
      console.log("🚀 ~ file: user-detail.component.ts:34 ~ UserDetailComponent ~ ngOnInit ~ data :", JSON.parse(data?.toString()) )
      this.UserData=JSON.parse(data?.toString())
      
      if (this.UserData ==null || this.loginUser == null) {
        window.location.href = '/';
      } else {
      }
    }catch(ex){
      window.location.href = '/';
      
    }

    this.userForm.patchValue(this.UserData)

    this.channelUrl=`https://www.youtube.com/channel/${this.UserData?.channelURL.split('/')[4]}?sub_confirmation=1`
    const API_KEY = 'AIzaSyAPUNI2MG6t13aCjd_rxzWHzIaXtb8v-9E';

    // YouTube channel ID
    // const channelID = 'UCmIWqOH6gO4whw7_AO147cg';
    const channelID = this.UserData?.channelURL.split('/')[4];

    // Fetch channel statistics
    fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelID}&key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        const subscriberCount = data.items[0].statistics.subscriberCount;
        this.oldSubs=0//subscriberCount
        console.log("🚀 ~ file: user-detail.component.ts:79 ~ UserDetailComponent ~ .then ~ this.oldSubs:", this.oldSubs)

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    

    //  https://www.youtube.com/channel/CHANNEL_ID?sub_confirmation=1
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];

    const parseFile = new Parse.File(file.name, file);
    var savedFile = await parseFile.save();

    savedFile = JSON.parse(JSON.stringify(savedFile));
    console.log("🚀 ~ file: register.component.ts:84 ~ RegisterComponent ~ onFileSelected ~ savedFile:", savedFile)

    this.userForm.patchValue({
      screenShot: savedFile?.url,
    });
    this.userForm?.get('screenShot')?.updateValueAndValidity();

    // Set the URL of the selected image for preview
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImageUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  async onSubmit() {
    // Access form values and perform submit logic here

    const API_KEY = 'AIzaSyAPUNI2MG6t13aCjd_rxzWHzIaXtb8v-9E';

    // YouTube channel ID
    // const channelID = 'UCmIWqOH6gO4whw7_AO147cg';
    const channelID = this.UserData?.channelURL.split('/')[4];

    // Fetch channel statistics
    fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelID}&key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        this.newSubs = data.items[0].statistics.subscriberCount;
       

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

      console.log("🚀 ~ file: user-detail.component.ts:162 ~ UserDetailComponent ~ onSubmit ~ this.newSubs:", this.newSubs)
      if (!this.oldSubs > this.newSubs) {
        alert('please subscribe the youtube channel')
        return  false
      }

    const formData = this.userForm.value;
    console.log('Submitted Form Data:', formData);
    
    console.log("🚀 ~ file: user-detail.component.ts:187 ~ UserDetailComponent ~ onSubmit ~ this.userForm.valid && this.oldSubs>this.newSubs:", this.userForm.valid && this.oldSubs>this.newSubs)
    if (this.userForm.valid && parseInt(this.oldSubs) < parseInt(this.newSubs)) {
      var newPayload = {'SSurl':formData.screenShot,UserID:this.loginUser,subscribedId:this.UserData.objectId}
      console.log("🚀 ~ file: user-detail.component.ts:176 ~ UserDetailComponent ~ onSubmit ~ newPayload:", newPayload)
      
      var P1 = new Parse.Object('YoutubeSubscribers');
      P1.set(newPayload);
      var savedData = await P1.save();
      savedData = JSON.parse(JSON.stringify(savedData));
      if (Object.keys(savedData).includes('objectId')) {
        window.location.href = '/channels';
      }
    }
    else{
      alert('subcscribe not recorded')
    }
    return
    // You can send this data to your service or perform other operations
  }

  watchHours(){
    const API_KEY = 'AIzaSyAPUNI2MG6t13aCjd_rxzWHzIaXtb8v-9E';
    const CHANNEL_ID = 'UCmIWqOH6gO4whw7_AO147cg'; // Replace with your channel ID

    // Set your API key and channel ID
const apiKey = 'AIzaSyAPUNI2MG6t13aCjd_rxzWHzIaXtb8v-9E';
const channelId = 'YOUR_CHANNEL_ID';

// Set start date and end date (formatted as YYYY-MM-DD)
const startDate = '2023-01-01';
const endDate = '2023-12-31';

// YouTube Analytics API endpoint
const apiUrl = `https://www.googleapis.com/youtube/analytics/v1/reports?ids=channel%3D%3D${channelId}&metrics=watchTime&startDate=${startDate}&endDate=${endDate}&key=${apiKey}`;

// Fetch data from the API
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Handle the API response here
    console.log('Watch time:', data);
    // Process the 'data' object to retrieve watch time metrics
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
  }

}

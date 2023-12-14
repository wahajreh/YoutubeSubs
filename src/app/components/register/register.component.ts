import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as Parse from 'parse';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  title = 'Subs For Subs';
  registrationForm: FormGroup;
  selectedImageUrl: any;
  countries: any;

  constructor(private formBuilder: FormBuilder) {
    localStorage.clear()
    Parse.initialize(
      'iTcjqQ3K9Be2TNT0Z9GXrPa21iJhNZSRNbFHa4VS',
      'NVJWSQTNzplFzGOOnJyzIGfmj3jCX9RDtBnOPokU'
    );
    (Parse as any).serverURL = 'https://parseapi.back4app.com/';

    this.registrationForm = this.formBuilder.group(
      {
        channelName: ['', Validators.required],
        channelURL: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern('https?://.+'),
          ]),
        ],
        email: [
          '',
          Validators.compose([Validators.required, Validators.email]),
        ],
        contact: ['', Validators.required],
        country: ['', Validators.required],
        currentSubscribers: ['', Validators.required],
        channelImage: [''],
        password: [
          '',
          Validators.compose([Validators.required, Validators.minLength(8)]),
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: this.passwordMatchValidator, // Custom validator for password match
      }
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (
      passwordControl &&
      confirmPasswordControl &&
      passwordControl.value !== confirmPasswordControl.value
    ) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      confirmPasswordControl?.setErrors(null);
    }
  }
  async onFileSelected(event: any) {
    const file = event.target.files[0];
    const fileType = file.type.toLowerCase();


  
    // Create a Parse File object
    const parseFile = new (Parse as any).File(file.name, file);
  


    if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/jpg') {
      // Save the file to Back4App
      var savedFile = await parseFile.save();

      savedFile = JSON.parse(JSON.stringify(savedFile));
      console.log("🚀 ~ file: register.component.ts:84 ~ RegisterComponent ~ onFileSelected ~ savedFile:", savedFile)

      this.registrationForm.patchValue({
        channelImage: savedFile?.url,
      });

      // Display the selected image
      this.selectedImageUrl = URL.createObjectURL(file);
    } else {
      // Reset the input value if the file type is not supported
      event.target.value = '';
      this.registrationForm.patchValue({
        channelImage: '',
      });
      // You can display an error message to the user about unsupported file types
    }
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  async onSubmit() {
    const formData = this.registrationForm.value;
    console.log('Registration form submitted:', formData);
    if (this.registrationForm.valid) {
      if (!this.containsYouTubeLink(formData?.channelURL,'youtube') && !this.containsYouTubeLink(formData?.channelURL,'channel') ) {
        alert('please enter your channel link like https://www.youtube.com/channel/CHANNEL_ID');
        return false
      }
      // You can send this data to your backend API for registration

      formData.currentSubscribers = parseInt(formData.currentSubscribers);

      var P1 = new Parse.Object('YoutubeUser');
      P1.set(formData);
      var savedData = await P1.save();
      savedData = JSON.parse(JSON.stringify(savedData));
      if (Object.keys(savedData).includes('objectId')) {
        window.location.href = '/login';
      }
    }
    return true
  }

  // Helper function to check for form control errors
  getFormControlErrors(controlName: string) {
    const control = this.registrationForm.get(controlName);
    if (control?.errors) {
      return Object.keys(control.errors).map((key) => {
        let message = '';
        switch (key) {
          case 'required':
            message = 'This field is required.';
            break;
          case 'email':
            message = 'Please enter a valid email address.';
            break;
          case 'pattern':
            message = 'Please enter a valid URL.';
            break;
          // Add more cases for other error types if needed
          default:
            message = 'Invalid value.';
            break;
        }
        return message;
      });
    }
    return [];
  }
  get formControls() {
    return this.registrationForm.controls;
  }

  containsYouTubeLink(text:any,str:string) {
    // Convert the text to lowercase to perform a case-insensitive check
    const lowerText = text.toLowerCase();
  
    // Check if the lowercase text contains 'youtube'
    return lowerText.includes(str);
  }

  getSubs(){
    var data = this.registrationForm.value?.channelURL.split('/');
    console.log(  '🚀 ~ file: register.component.ts:167 ~ RegisterComponent ~ getSubs ~ data:',  data);

    const API_KEY = 'AIzaSyAPUNI2MG6t13aCjd_rxzWHzIaXtb8v-9E';
    const CHANNEL_ID = data[data?.length - 1]; // Replace with your channel ID

    // URL to fetch channel data (including subscriber count)
    const URL = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`;
    fetch(URL)
    .then(response => response.json())
    .then(data => {
      console.log("🚀 ~ file: register.component.ts:177 ~ RegisterComponent ~ getSubs ~ data:", data)
      if (data.pageInfo?.totalResults===0) {
        alert('please enter your channel link like https://www.youtube.com/channel/CHANNEL_ID');
        this.registrationForm.patchValue({
          currentSubscribers:''
        })
        return ;
      }
      const subscriberCount = data.items[0].statistics.subscriberCount;
      this.registrationForm.patchValue({
        currentSubscribers:subscriberCount
      })
    })
    .catch(error => {
      console.error('Error fetching subscriber count:', error);
    });
  }
 
}

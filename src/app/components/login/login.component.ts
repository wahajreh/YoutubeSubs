import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as Parse from 'parse';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {

    localStorage.clear()
    
    Parse.initialize('iTcjqQ3K9Be2TNT0Z9GXrPa21iJhNZSRNbFHa4VS', 'NVJWSQTNzplFzGOOnJyzIGfmj3jCX9RDtBnOPokU');
    (Parse as any).serverURL = 'https://parseapi.back4app.com/';

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  async ngOnInit() {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Perform login logic
      console.log('Form submitted successfully!', this.loginForm.value);
      var payload=this.loginForm.value;
      this.getLogin(payload.username,'');
      // You can implement login authentication here
    } else {
      // Handle form errors or display a message to the user
      console.log('Please fill in all required fields.');
      // You can also display error messages to the user about invalid input
    }
  }
  getFormControlErrors(controlName: string) {
    const control = this.loginForm.get(controlName);
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
  async getLogin(email: any, password: any) {
    const YourClassName = (Parse as any).Object.extend('YoutubeUser');
    const query = new (Parse as any).Query(YourClassName);

    // Set query conditions based on keys and values
    // query.equalTo('key1', 'value1'); // Match key1 with value1
    // query.greaterThan('key2', 50); // Match key2 greater than 50
    query.contains('email', email); // Match key3 containing 'substring'
    query.contains('password', password); // Match key3 containing 'substring'

    // Execute the query to retrieve matching objects
    var data:any = await query .find()
    data = JSON.parse(JSON.stringify(data))
      console.log("🚀 ~ file: login.component.ts:89 ~ LoginComponent ~ getLogin ~ data:", data)
      if (data?.length>0 && Object.keys(data[0]??{}).includes('objectId')) {
        window.location.href='/channels'
        localStorage.setItem('objectId',data[0]?.objectId)
      }
  }
}

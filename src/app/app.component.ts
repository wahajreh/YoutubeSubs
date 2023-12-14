import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Subs For Subs';
  registrationForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.registrationForm = this.formBuilder.group({
      channelName: ['', Validators.required],
      channelURL: ['', Validators.compose([Validators.required, Validators.pattern('https?://.+')])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      contact: ['', Validators.required],
      country: ['', Validators.required],
      currentSubscribers: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;
      console.log('Registration form submitted:', formData);
      // You can send this data to your backend API for registration
    }
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


}

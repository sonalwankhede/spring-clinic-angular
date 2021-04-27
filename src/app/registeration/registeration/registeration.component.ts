import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonService } from 'app/common.service';

@Component({
  selector: 'app-registeration',
  templateUrl: './registeration.component.html',
  styleUrls: ['./registeration.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterationComponent implements OnInit {

  hide = true;
  @Output() isLogin: EventEmitter<Boolean> = new EventEmitter(false);

  registerationForm: FormGroup;
  public formBuilder: FormBuilder;

  roles = [];
  roleSelection = 'Select Role';
  rolesCntrl = new FormControl();

  constructor(private commonService: CommonService) {
    this.formBuilder = new FormBuilder();
    this.roles = ['ADMIN', 'DOCTOR', 'RECEPTIONIST', 'NURSE'];
    this.registerationForm = this.formBuilder.group({
      usernameCntrl: new FormControl('', Validators.required),
      passwordCntrl: new FormControl('', Validators.required),
      rolesCntrl: new FormControl('', Validators.required)
    });
   }
   public hasError = (controlName: string, errorName: string) => {
    return this.registerationForm.controls[controlName].hasError(errorName);
  }
  ngOnInit() {
    this.registerationForm = this.formBuilder.group({
      usernameCntrl: new FormControl('', Validators.required),
      passwordCntrl: new FormControl('', Validators.required),
      rolesCntrl: new FormControl('', Validators.required)
    });
  }

  redirectToLoginForm () {
    this.isLogin.emit(true);
  }
  onSubmit(formValue) {
    this.commonService.addUser(formValue.usernameCntrl, formValue.passwordCntrl, 0, this.rolesCntrl.value).subscribe(res => {

    });
  }
}

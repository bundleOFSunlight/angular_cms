import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AxiosHelperService } from '../../common/axios-helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(
    public axios_helper: AxiosHelperService,
    private _router: Router,
  ) { }

  ngOnInit() {
  }
  ngOnDestroy() {
  }
  async onSubmit(signInForm: NgForm) {
    const result = await this.axios_helper.post(
      `${environment.BE_URL}/authentication/login`,
      {
        email: signInForm.value.email,
        password: signInForm.value.password
      }
    );
    if (result.status === 200) {
      localStorage.setItem("Authorization", result.data.token)
      localStorage.setItem("user", JSON.stringify(result.data))
      return this._router.navigate(["/tables"])
    } else {
      console.log(result.message)
      return result.message
    }
  }

}

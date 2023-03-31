import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AxiosHelperService } from '../../common/axios-helper.service';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user_crud',
  templateUrl: './user_crud.component.html',
  styleUrls: ['./user_crud.component.scss']
})
export class UserCrudComponent implements OnInit {

  constructor(
    public axios_helper: AxiosHelperService,
    selectElement: ElementRef,
    private _router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) {
    this.firstNameElement = selectElement;
    this.lastNameElement = selectElement;
    this.usernameElement = selectElement;
    this.contactElement = selectElement;
    this.emailElement = selectElement;
    this.genderElement = selectElement;
  }

  @ViewChild('first_name', { static: true }) firstNameElement: ElementRef;
  first_name: string = "";

  @ViewChild('last_name', { static: true }) lastNameElement: ElementRef;
  last_name: string = "";

  @ViewChild('username', { static: true }) usernameElement: ElementRef;
  username: string = "";

  @ViewChild('contact', { static: true }) contactElement: ElementRef;
  contact: string = "";

  @ViewChild('email', { static: true }) emailElement: ElementRef;
  email: string = "";

  @ViewChild('gender', { static: true }) genderElement: ElementRef;
  gender: string = "";

  // intial value
  init_first_name = this.first_name
  init_last_name = this.last_name
  init_username = this.username
  init_contact = this.contact
  init_gender = this.gender
  init_email = this.email

  addEdit = ``;
  action_text = ``;
  route_param

  async ngOnInit() {
    const token = await this.checkToken();
    this.route.queryParams.subscribe(async (param) => {
      this.route_param = param;
      const result = await this.axios_helper.get(
        `${environment.BE_URL}/user_management/admin/${param.id}`,
        {},
        token
      );
      console.log(result.data)
      if (result.status === 200) {
        this.init_first_name = result.data.first_name
        this.init_last_name = result.data.last_name
        this.init_contact = result.data.contact
        this.init_email = result.data.email
        this.init_username = result.data.username
        this.init_gender = result.data.gender
        this.addEdit = `Edit`
        this.action_text = `Update`

      } else if (result.data.status == 401) {
        await this.clearToken()
      } else {
        this.init_first_name = ""
        this.init_last_name = ""
        this.init_contact = ""
        this.init_email = ""
        this.init_username = ""
        this.init_gender = ""
        this.addEdit = `Add`
        this.action_text = `Create`
      }
    })
  }

  async onSubmit() {
    const token = await this.checkToken();
    this.first_name = this.firstNameElement.nativeElement.value;
    this.last_name = this.lastNameElement.nativeElement.value;
    this.contact = this.contactElement.nativeElement.value;
    this.email = this.emailElement.nativeElement.value;
    this.gender = this.genderElement.nativeElement.value;
    this.username = this.usernameElement.nativeElement.value;

    const body: any = {
      first_name: this.first_name,
      last_name: this.last_name,
      contact: this.contact,
      email: this.email,
      username: this.username,
      gender: this.gender,
    }
    let result: any = {};
    if (this.addEdit === `Edit`) {
      body.id = this.route_param.id;
      console.log(body)
      result = await this.axios_helper.put(
        `${environment.BE_URL}/user_management/admin`,
        body,
        token
      );
    } else {
      result = await this.axios_helper.post(
        `${environment.BE_URL}/user_management/admin`,
        body,
        token
      );
    }
    if (result.status === 200) {
      this.toastr.success(result.message);
      this._router.navigate(["/user_management"])
    } else if (result.status === 401) {
      await this.clearToken();
    }
  }

  async timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async checkToken() {
    const token = localStorage.getItem('Authorization');
    if (!token) {
      this._router.navigate(["/login"])
    }
    return token
  }

  async clearToken() {
    this.toastr.error(`Login is required`);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this._router.navigate(["/login"])
  }

}
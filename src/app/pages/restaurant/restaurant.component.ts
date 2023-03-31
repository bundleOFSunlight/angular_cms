import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AxiosHelperService } from '../../common/axios-helper.service';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class UserProfileComponent implements OnInit {

  constructor(
    public axios_helper: AxiosHelperService,
    selectElement: ElementRef,
    private _router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) {
    this.projectNameElement = selectElement;
    this.contactPersonElement = selectElement;
    this.contactElement = selectElement;
    this.emailElement = selectElement;
  }

  @ViewChild('project_name', { static: true }) projectNameElement: ElementRef;
  project_name: string = "";

  @ViewChild('contact_person', { static: true }) contactPersonElement: ElementRef;
  contact_person: string = "";

  @ViewChild('contact', { static: true }) contactElement: ElementRef;
  contact: string = "";

  @ViewChild('email', { static: true }) emailElement: ElementRef;
  email: string = "";

  mindFile = "Choose file"
  imageInput = "Choose image"
  htmlToAdd = ""
  is_upload_visible = "true";

  // intial value
  init_project = this.project_name
  init_contact_person = this.contact_person
  init_contact = this.contact
  init_email = this.email

  variableWithZeroValue = 0;
  food = true;
  antique = false;

  // image array
  imageList = [];
  mindFile_url = ``;
  action_text = ``;
  addEdit = ``;
  route_param;

  async ngOnInit() {
    const token = await this.checkToken();
    this.route.queryParams.subscribe(async (param) => {
      this.route_param = param;
      const result = await this.axios_helper.get(
        `${environment.BE_URL}/file_management/project/project_file/${param.id}`,
        {},
        token
      );
      console.log(result)
      if (result.status === 200) {
        this.init_project = result.data.project_name
        this.init_contact_person = result.data.contact_person
        this.init_contact = result.data.contact
        this.init_email = result.data.email
        this.mindFile_url = result.data.mind_url
        this.mindFile = result.data.file_name ? result.data.file_name : `Choose file`
        this.action_text = `Save`
        this.addEdit = `Edit`
        if (result.data.is_antique) {
          this.variableWithZeroValue = 1;
        }
        this.imageList = [] // init image list to avoid bug
        for (const item of result.data.attachment) {
          this.imageList.push({
            name: item.file_name,
            size: item.file_size,
            url: item.file_url,
            is_show: "true"
          })
        }
      } else if (result.data.status == 401) {
        await this.clearToken()
      } else {
        this.imageList = []
        this.init_project = ``
        this.init_contact_person = ``
        this.init_contact = ``
        this.init_email = ``
        this.mindFile_url = ``
        this.mindFile = `Choose file`
        this.action_text = `Create`
        this.addEdit = `Add`
      }
    })
  }

  async onSubmit() {
    const token = await this.checkToken();
    this.project_name = this.projectNameElement.nativeElement.value;
    this.contact_person = this.contactPersonElement.nativeElement.value;
    this.contact = this.contactElement.nativeElement.value;
    this.email = this.emailElement.nativeElement.value;
    if (!this.mindFile_url.length || !this.imageList.length || this.imageList[this.imageList.length - 1].name == "Uploading...") {
      // error here
      this.toastr.error('Error: waiting for file upload.');
      throw new Error("Error: waiting for file upload.")
    }
    const body: any = {
      project_name: this.project_name,
      mind_url: this.mindFile_url,
      file_name: this.mindFile,
      contact_person: this.contact_person,
      contact: this.contact,
      email: this.email,
      imageList: this.imageList,
      is_antique: this.antique
    }
    let result: any = {};
    if (this.addEdit === `Edit`) {
      body.id = this.route_param.id;
      result = await this.axios_helper.put(
        `${environment.BE_URL}/file_management/project/project`,
        body,
        token
      );
    } else {
      result = await this.axios_helper.post(
        `${environment.BE_URL}/file_management/project/project`,
        body,
        token
      );
    }
    if (result.status === 200) {
      this.toastr.success(result.message);
      this._router.navigate(["/tables"])
    } else if (result.status === 401) {
      await this.clearToken();
    }
  }

  async saveMind(event: Event) {
    const token = await this.checkToken();
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      this.mindFile = fileList[0].name;
      const file_uploaded = fileList[0];
      let formData = new FormData();
      formData.append("mind_ar", file_uploaded)
      const result = await this.axios_helper.post(
        `${environment.BE_URL}/file_management/upload`,
        formData,
        token
      );

      if (result.status === 401) {
        await this.clearToken();
      }
      else if (result.status === 200) {
        const url = result.data.url
        this.mindFile_url = url;
        this.toastr.success(result.message);
      } else {
        this.toastr.error(result.message);
      }
    }
    else {
      this.mindFile = "Choose file"
    }
  }
  async saveImage(event: Event) {
    const token = await this.checkToken();
    this.is_upload_visible = "false"
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    // temp function
    if (fileList) {
      // show upload message
      this.imageList.push({
        name: "Uploading...",
        url: "#",
        is_show: "false"
      });
      // process upload
      let formData = new FormData();
      const file_uploaded = fileList[0];
      formData.append("mind_ar", file_uploaded)
      const result = await this.axios_helper.post(
        `${environment.BE_URL}/file_management/upload`,
        formData,
        token
      );
      let url = `#`;

      if (result.status === 401) {
        await this.clearToken()
      }
      else if (result.status === 200) {
        url = result.data.url;
        this.toastr.success(result.message);
      } else {
        this.toastr.error(result.message);
      }
      this.imageList.pop()
      this.is_upload_visible = "true";
      // uploaded
      // process actual array
      const fileSize = (Number(fileList[0].size) / (1024 * 1024)).toFixed(2) + " MB"
      this.imageList.push({
        name: fileList[0].name,
        size: fileSize,
        url: url,
        is_show: "true"
      });
    }
    else {
      this.imageInput = "Choose file"
    }
  }

  async onRemove(image) {
    const index = this.imageList.indexOf(image);
    if (index !== -1) {
      this.imageList.splice(index, 1);
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

  async onRadio1Change(value) {
    this.food = true;
    this.antique = false;
    console.log(" Food is : ", this.food);
    console.log(" Antique is : ", this.antique);
  }

  async onRadio2Change(value) {
    this.food = false;
    this.antique = true;
    console.log(" Food is : ", this.food);
    console.log(" Antique is : ", this.antique);
  }

}
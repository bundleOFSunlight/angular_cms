import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AxiosHelperService } from '../../common/axios-helper.service';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';

@Component({
  selector: 'app-user_management',
  templateUrl: './user_management.component.html',
  styleUrls: ['./user_management.component.scss']
})
export class UserManagementComponent implements OnInit {

  constructor(
    private axios_helper: AxiosHelperService,
    private _router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
  ) {
  }

  datatableRow = []

  // confirmation popover

  async ngOnInit() {
    const token = await this.checkToken();
    await this.loadDatatable(token)
  }

  async checkToken() {
    const token = localStorage.getItem('Authorization');
    if (!token) {
      this._router.navigate(["/login"])
    }
    return token
  }

  async clearToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.toastr.error(`Login is required`);
    this._router.navigate(["/login"])
  }


  datatable(search_value: string) {
    return {
      draw: 1,
      columns: [
        {
          "data": "id",
          "name": "",
          "searchable": true,
          "orderable": true,
          "search": {
            "value": "",
            "regex": false
          }
        }
      ],
      order: [
        {
          "column": 0,
          "dir": "asc"
        }
      ],
      start: 0,
      length: 20,
      search: {
        value: search_value,
        regex: true
      }
    }
  }

  async onDeleteProject(index: number) {
    const options = {
      title: 'Delete User?',
      confirmLabel: 'Yes',
      declineLabel: 'Cancel'
    }
    await this.ngxBootstrapConfirmService.confirm(options).then(async (res: boolean) => {
      if (res) {
        const token = await this.checkToken();
        const body = { id: index };
        const result = await this.axios_helper.delete(
          `${environment.BE_URL}/user_management/admin`,
          body,
          token
        );
        console.log(result.data.status)
        if (result.data.status === 401) {
          await this.clearToken();
        } else if (result.data.status === 200) {
          this.toastr.success(result.data.message);
          await this.loadDatatable(token);
        } else {
          this.toastr.error(result.message);
        }
      }
    })
  }

  async onUpdateProject(index: number) {
    const redirect_url = `${environment.FE_URL}/#/user_crud?id=${index}`;
    window.location.href = redirect_url;
  }

  async loadDatatable(token) {
    const body = this.datatable('')
    const result = await this.axios_helper.post(
      `${environment.BE_URL}/user_management/admin/datatable`,
      body,
      token
    );
    if (result.status === 401) {
      await this.clearToken();
    }
    else if (result.status === 200) {
      this.datatableRow = result.data.data;
    } else {
      this.toastr.error(result.message);
    }
  }

  async onAddUser() {
    const redirect_url = `${environment.FE_URL}/#/user_crud`;
    window.location.href = redirect_url;
  }

}

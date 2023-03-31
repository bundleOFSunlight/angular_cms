import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AxiosHelperService } from '../../../app/common/axios-helper.service';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {

  constructor(
    public axios_helper: AxiosHelperService,
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
      title: 'Delete project?',
      confirmLabel: 'Yes',
      declineLabel: 'Cancel'
    }
    this.ngxBootstrapConfirmService.confirm(options).then(async (res: boolean) => {
      if (res) {
        const token = await this.checkToken();
        const body = { id: index };
        const result = await this.axios_helper.delete(
          `${environment.BE_URL}/file_management/project/project`,
          body,
          token
        );
        if (result.data.status === 401) {
          await this.clearToken();
        } else if (result.data.status === 200) {
          this.toastr.success(result.data.message);
          await this.loadDatatable(token);
        } else {
          this.toastr.error(result.data.message);
        }
      }
    });
  }

  async onUpdateProject(index: number) {
    const redirect_url = `${environment.FE_URL}/#/restaurant?id=${index}`;
    window.location.href = redirect_url;
  }

  async onAddProject() {
    const redirect_url = `${environment.FE_URL}/#/restaurant`;
    window.location.href = redirect_url;
  }


  async downloadPdf(index: number, restaurant: string) {
    const token = await this.checkToken();
    const req_url = `${environment.BE_URL}/file_management/project/qr_code/${index}`;

    // const result = await this.axios_helper.get(req_url, {}, token);
    this.http.get(req_url,
      {
        responseType: 'blob',
        headers: { Authorization: token }
      }).subscribe(
        data => {
          this.getPdf(data, restaurant)
          this.toastr.success("Successfully downloaded pdf");
        }, error => {
          this.toastr.error("Fail to download pdf.");
        }
      )
  }

  async loadDatatable(token) {
    const body = this.datatable('')
    const result = await this.axios_helper.post(
      `${environment.BE_URL}/file_management/project/datatable`,
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

  async getPdf(data: Blob, restaurant: string) {
    const file = new Blob([data], { type: 'application/pdf' })
    const fileURL = window.URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = fileURL;
    a.target = '_blank';
    a.download = `${restaurant}.pdf`;
    document.body.appendChild(a);
    a.click();
  }

}

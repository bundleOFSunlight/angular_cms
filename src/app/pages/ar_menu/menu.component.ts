import { Component, HostListener, Injectable, OnDestroy, OnInit } from '@angular/core';
// import * as angular from "angular";
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})

@Injectable()
export class MenuComponent implements OnInit, OnDestroy {
  constructor(
  ) {
  }

  @HostListener('window:load')
  async ngAfterViewInit() {
    const public_key = `007d1d8e-425f-474d-a8a0-7235cad917c6`
    const req_link = `${environment.BE_URL}/file_management/public/file_obj/${public_key}`
    const result = await axios.get(req_link);
    const video_list = result.data.data;
  }

  async ngOnInit() {
    const mainJs = `mindar/ar_main.js`
    this.createScript(mainJs, 'body');
    const threeJs = `mindar/mindar-image-three.prod.js`
    this.createScript(threeJs, 'head');
  }

  async ngOnDestroy() { }

  async createScript(url: string, position: string) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName(position)[0].appendChild(node);
  }

}

import axios from 'axios';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AxiosHelperService {

  constructor() { }

  async get(url: string, data?: any, auth_token?: string) {
    try {
      const option = await this.config_builder(data, auth_token);
      const result = await axios.get(url, option);
      return result.data;
    } catch (error) {
      console.error('******************************', error.response.data);
      return error.response.data;
    }
  }

  async post(url: string, data?: any, auth_token?: string) {
    try {
      const option = await this.config_builder(data, auth_token);
      const result = await axios.post(url, data, option);
      return result.data;
    } catch (error) {
      console.error('******************************', error.response.data);
      return error.response.data;
    }
  }

  async postFile(url: string, data?: any, auth_token?: string) {
    try {
      const option = await this.config_builder(data, auth_token);
      const result = await axios.post(url, data, option);
      return result;
    } catch (error) {
      console.error('******************************', error.response.data);
      return error.response.data;
    }
  }

  async put(url: string, data?: any, auth_token?: string) {
    try {
      const option = await this.config_builder(data, auth_token);
      const result = await axios.put(url, data, option);
      return result.data;
    } catch (error) {
      console.error('******************************', error.response.data);
      return error.response.data;
    }
  }

  async delete(url: string, data?: any, auth_token?: string) {
    try {
      const option = await this.config_builder(data, auth_token);
      const result = await axios.delete(url, option);
      return result;
    } catch (error) {
      //should record error logs into database
      return error.response.data;
    }

  }

  async config_builder(data: any, auth_token: string) {
    const option = {
      headers: {
        Authorization: auth_token,
        service: 'use your system service name',
      },
      data: data || {},
      json: true,
    }
    return option;
  }
}



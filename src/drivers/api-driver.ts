import {request} from "playwright";
import {EnvConstants} from "../support/cucumber-world";


export class ApiDriver{

  baseURL : string

   constructor(env: EnvConstants) {
      this.baseURL = env.ENV_CONFIG[env.APP][env.CLIENT][env.HOST].baseURL
   }


   async get(url: string){

      return (await request.newContext(
          {
              baseURL: this.baseURL,
              extraHTTPHeaders: {
                  'Content-type': 'application/json: charset=UTF-8'
              }
          })).get(url);
  }

  async post(url:string, data: object){

      return (await request.newContext({
          baseURL: this.baseURL,
          extraHTTPHeaders: {
              'Content-type': 'application/json: charset=UTF-8'
          }
      })).post(url,{
          data : data
      })
  }

}
import * as req from 'request';

const request = async (url: string, method: string = 'get', params: any = {}, noparse: boolean = false) => {
    return new Promise((resolve: Function, reject: Function) => {
        req[method.toLowerCase()](url, {
          ...params
        }, (error: any, response: any, body: any) => {
          if (error) {
            return reject(error);
          }

          if(noparse) {
            return resolve(body);
          }

          let _body: Object = {};
          
          try{
            _body = JSON.parse(body);
          }catch(e){
            console.log(e);
          }

          if (_body['error']) {
            return reject(_body)
          }

          return resolve(_body);
        })
    });
};

export default request;
import axios from 'axios';

class HttpService {
  static send(request) {
    //const axios = new Axios();
    return axios(request);
  }
}

export { HttpService };

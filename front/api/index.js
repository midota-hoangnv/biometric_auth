export default class UserApi {
  axios;

  constructor(axios) {
    this.axios = axios;
  }

  async login(data) {
    const res = await this.axios.post(
      `/login`,
      data
    );
    return res.data;
  }

  async registerStart() {
    const res = await this.axios.post(
      `/register/start`,
    );
    return res.data;
  }
}

const axisoIntercector = ({ $axios, store, route, redirect }) => {
  $axios.interceptors.request.use(function (config) {

    $axios.setHeader('Authorization', localStorage.getItem('auth'));

    return config;
  });

  // axiosのリクエストが発生した時に発生するイベント
  $axios.onRequest((config) => {
    if (!window.navigator.onLine) {
      console.log("現在オフライン");
    }
    // リクエスト前に呼び出されるコード
    console.log("onRequest: ", config.url);
  });

  // リクエスト時エラーが発生した時のイベント
  $axios.onRequestError((error) => {
    console.log("onRequestError: ", error);
  });

  // 通信相手からのレスポンスを受信した時に発生するイベント
  $axios.onResponse((response) => {
    // 成功レスポンスを受け取った時に呼び出されるコード
    console.log("onResponse: ", response);
  });

  // エラーが発生した時に発生するイベント
  $axios.onError((error) => {
    console.log("onError: ", error);

    // if (!error.response) {
    //   // エラーレスポンスがない、net::ERR_CONNECTION_REFUSEDなどは、ここで処理する
    //   redirect('/500')
    // }

    if (error.response.status === 401) {

      // 認証エラーは、ログイン画面へリダイレクトする
      return redirect("/login");
    }
    // if (error.response!.status === 500) {
    //   // サーバ内部エラーの場合は、ソーリページへ移動する
    //   redirect('/500')
    // }
    return;
  });
};
export default axisoIntercector;

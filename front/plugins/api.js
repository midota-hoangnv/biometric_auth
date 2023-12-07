

// Admin
import UserApi from '@/api';


const ApiPlugin = (ctx, inject) => {
  // Admin
  inject('api', new UserApi(ctx.$axios));
};

export default ApiPlugin;

import store from '../store'

//按钮权限控制
export default {
  //具有某个角色
  hasRole: function (role) {
    if (this.inArray(role, store.state.roles) >= 0) {
      return true;
    }
    return false;
  },
  //具其中一个角色，多个用逗号隔开
  hasAnyRoles: function (roles) {
    var v = roles.split(',');
    for (var i = 0; i < v.length; i++) {
      if (inArray(v[i], store.state.roles) >= 0) {
        return true;
      }
    }
    return false;
  },
  //不属于某个角色
  lacksRole: function (role) {
    if (this.inArray(role, store.state.roles) >= 0) {
      return false;
    }
    return true;
  },
  //具有某个权限
  hasPermission: function (permission) {
    if (this.inArray(permission, store.state.permissions) >= 0) {
      return true;
    }
    return false;
  },
  //不具有某个权限
  lacksPermission: function (permission) {
    if (this.inArray(permission, store.state.permissions) >= 0) {
      return false;
    }
    return true;
  },
  //是不是在数组中
  inArray: function (v, arr) {
    for (var i = 0; i < arr.length; i++) {
      if (v == arr[i]) {
        return i;
      }
    }
    return -1;
  }
}

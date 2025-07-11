package com.itheima.service;

import com.itheima.pojo.User;

public interface UserService {
    //根据用户名查询用户
    User findByUserName(String username);

    //注册
    //void register(String username, String password);
    void register(User u);
    //更新密码
    void updatePwd(String newPwd);
}

package com.itheima.controller;

import com.itheima.pojo.Result;
import com.itheima.pojo.User;
import com.itheima.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public Result register(@RequestBody User user) {
        userService.register(user);
        return Result.success();
    }

    @PostMapping("/login")
    public Result login(@RequestBody User user) {
        // 简单登录逻辑，实际应结合JWT
        User u = userService.findByUserName(user.getUsername());
        if(u != null && u.getPassword().equals(user.getPassword())) {
            return Result.success();
        }
        return Result.error("用户名或密码错误");
    }
}

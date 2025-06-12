<script setup>
import { User, Lock, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
//控制注册与登录表单的显示， 默认显示注册
const isRegister = ref(false)
//定义数据模型
const registerData = ref({
    username: '',
    password: '',
    rePassword: ''
})

//校验密码的函数
const checkRePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次确认密码'))
    } else if (value !== registerData.value.password) {
        callback(new Error('请确保两次输入的密码一样'))
    } else {
        callback()
    }
}

//定义表单校验规则
const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 16, message: '长度为5~16位非空字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 16, message: '长度为5~16位非空字符', trigger: 'blur' }
    ],
    rePassword: [
        { validator: checkRePassword, trigger: 'blur' }
    ]
}

//调用后台接口,完成注册
import { userRegisterService, userLoginService} from '@/api/user.js'
const register = async () => {
    let result = await userRegisterService(registerData.value);
    ElMessage.success(result.msg ? result.msg : '注册成功')
}

//绑定数据,复用注册表单的数据模型
//表单数据校验
//登录函数
import {useTokenStore} from '@/stores/token.js'
import {useRouter} from 'vue-router'
const router = useRouter()
const tokenStore = useTokenStore();
const login =async ()=>{
    //调用接口,完成登录
   let result =  await userLoginService(registerData.value);

    ElMessage.success(result.msg ? result.msg : '登录成功')
   //把得到的token存储到pinia中
   tokenStore.setToken(result.data)
   //跳转到首页 路由完成跳转
   router.push('/')
}

//定义函数,清空数据模型的数据
const clearRegisterData = ()=>{
    registerData.value={
        username:'',
        password:'',
        rePassword:''
    }
}

// 忘记密码功能
const handleForgotPassword = () => {
    ElMessage.warning('请联系管理员重置密码')
}
</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 注册表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="rules">
                <el-form-item>
                    <h1 class="form-title">欢迎注册</h1>
                    <p class="form-subtitle">创建您的账户</p>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input 
                        :prefix-icon="User" 
                        placeholder="请输入用户名" 
                        v-model="registerData.username"
                        class="custom-input"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input 
                        :prefix-icon="Lock" 
                        type="password" 
                        placeholder="请输入密码"
                        v-model="registerData.password"
                        class="custom-input"
                        show-password
                    ></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input 
                        :prefix-icon="Lock" 
                        type="password" 
                        placeholder="请再次输入密码"
                        v-model="registerData.rePassword"
                        class="custom-input"
                        show-password
                    ></el-input>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="register">
                        立即注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link 
                        type="info" 
                        :underline="false" 
                        @click="isRegister = false;clearRegisterData()"
                        class="switch-link"
                    >
                        <el-icon><ArrowLeft /></el-icon> 返回登录
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-else :model="registerData" :rules="rules">
                <el-form-item class="form-header">
                    <h1 class="form-title">请登录您的账户</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input 
                        :prefix-icon="User" 
                        placeholder="请输入用户名" 
                        v-model="registerData.username"
                        class="custom-input"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input 
                        name="password" 
                        :prefix-icon="Lock" 
                        type="password" 
                        placeholder="请输入密码" 
                        v-model="registerData.password"
                        class="custom-input"
                        show-password
                    ></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex remember-forgot">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false" @click="handleForgotPassword">
                            忘记密码？
                        </el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">立即登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link 
                        type="info" 
                        :underline="false" 
                        @click="isRegister = true;clearRegisterData()"
                        class="switch-link"
                    >
                        注册新账户 <el-icon><ArrowRight /></el-icon>
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
.login-page {
    height: 100vh;
    background-color: #fff;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;

    .bg {
        background: url('@/assets/login_bg.png') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;
        padding: 0 40px;

        .form-header {
            margin-bottom: 20px;
        }

        .form-title {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            color: #333;
            line-height: 1.2;
        }

        .form-subtitle {
            margin: 8px 0 0 0;
            font-size: 14px;
            color: #888;
            line-height: 1.5;
        }

        .custom-input {
            :deep(.el-input__wrapper) {
                padding: 12px 16px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                
                &:hover {
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
                }
            }
        }

        .button {
            width: 100%;
            height: 48px;
            font-size: 16px;
            border-radius: 8px;
            margin-top: 10px;
            background: linear-gradient(90deg, #1e88e5, #0d47a1);
            border: none;
            transition: all 0.3s ease;
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(30, 136, 229, 0.3);
            }
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            
            &.remember-forgot {
                margin-top: 5px;
                
                .el-link {
                    font-size: 14px;
                }
            }
        }

        .switch-link {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #666;
            transition: color 0.3s;
            
            &:hover {
                color: #1e88e5;
            }
            
            .el-icon {
                margin-right: 5px;
                font-size: 12px;
            }
        }
    }
}

@media (max-width: 768px) {
    .login-page {
        flex-direction: column;
        
        .bg {
            display: none;
        }
        
        .form {
            width: 100%;
            padding: 0 20px;
        }
    }
}
</style>
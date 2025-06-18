<script setup>
import { ref } from 'vue'
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();

// 初始化时确保包含id字段
const userInfo = ref({
    id: userInfoStore.info.id, // 确保包含id
    username: userInfoStore.info.username,
    nickname: userInfoStore.info.nickname || '',
    email: userInfoStore.info.email || ''
})

const rules = {
    nickname: [
        { required: true, message: '请输入用户昵称', trigger: 'blur' },
        {
            pattern: /^\S{2,10}$/,
            message: '昵称必须是2-10位的非空字符串',
            trigger: 'blur'
        }
    ],
    email: [
        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ]
}

//修改个人信息
import {userInfoUpdateService} from '@/api/user.js'
import {ElMessage} from 'element-plus'
const updateUserInfo = async ()=>{
    try {
        // 确保提交的数据包含id
        const submitData = {
            id: userInfo.value.id, // 必须包含id
            nickname: userInfo.value.nickname,
            email: userInfo.value.email
            // 其他需要更新的字段...
        }
        
        //调用接口
        let result = await userInfoUpdateService(submitData);
        ElMessage.success(result.msg? result.msg : '修改成功');
        
        //修改pinia中的个人信息
        userInfoStore.setInfo({
            ...userInfoStore.info,
            ...submitData
        })
    } catch (error) {
        ElMessage.error(error.response?.data?.msg || '修改失败');
    }
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>基本资料</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="登录名称">
                        <el-input v-model="userInfo.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="用户昵称" prop="nickname">
                        <el-input v-model="userInfo.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="用户邮箱" prop="email">
                        <el-input v-model="userInfo.email"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserInfo">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>
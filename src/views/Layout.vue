<script setup>
import {
    Management,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom,
    Reading,
    Search,
    Document,
    Collection,
    CollectionTag,
    Upload,
    Connection
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <el-menu active-text-color="#ffd04b" background-color="#2196F3" text-color="#fff" router>
                <el-menu-item index="/paper/manage">
                    <el-icon><Search /></el-icon>
                    <span>论文搜索</span>
                </el-menu-item>
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon><UserFilled /></el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/user/info">
                        <el-icon><User /></el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/user/avatar">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>更换头像</span>
                    </el-menu-item>
                    <el-menu-item index="/user/resetPassword">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>重置密码</span>
                    </el-menu-item>
                </el-sub-menu> 
                <el-sub-menu index="2">
                    <template #title>
                        <el-icon><Document /></el-icon>
                        <span>论文管理</span>
                    </template>
                    <el-menu-item index="/paper/category">
                        <el-icon><CollectionTag /></el-icon>
                        <span>论文分类</span>
                    </el-menu-item>
                    <el-menu-item index="/paper/author">
                        <el-icon><User /></el-icon>
                        <span>论文作者</span>
                    </el-menu-item>
                    <el-menu-item index="/paper/journal">
                        <el-icon><Collection /></el-icon>
                        <span>论文期刊</span>
                    </el-menu-item>
                    <el-menu-item index="/paper/keyword">
                        <el-icon><Connection /></el-icon>
                        <span>论文关键词</span>
                    </el-menu-item>
                    <el-menu-item index="/paper/refe">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>参考文献</span>
                    </el-menu-item>
                    <el-menu-item index="/paper/key">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>关键词</span>
                    </el-menu-item>
                    <el-menu-item index="/paper/upload">
                        <el-icon><Upload /></el-icon>
                        <span>上传下载</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div>论文管理系统：<strong></strong></div>
                <el-dropdown placement="bottom-end">
                    <span class="el-dropdown__box">
                        <el-avatar :src="avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <!--<el-dropdown-menu>
                            <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>
                            <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
                            <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu> -->
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 中间区域 -->
            <el-main>
                <!-- 假设这里有表格 -->
                <router-view></router-view>
            </el-main>
            <!-- 底部区域 -->
            <el-footer>
                
            </el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;
    font-family: 'Roboto', 'Arial', sans-serif; // 设置无衬线字体

    .el-aside {
        background-color: #e3f2fd; // 柔和的蓝色
        &__logo {
            height: 120px;
            background: url('@/assets/logo.png') no-repeat center / 120px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }

    // 替换原有的表格样式
    // 表头样式 - 改为深蓝色背景
    :deep(.el-table th.el-table__cell) { 
        background-color: #1e88e5;  // 深蓝色背景 
        color: white;              // 白色文字 
        font-weight: bold;         // 加粗 
    } 
    
    // 斑马纹效果
    :deep(.el-table .el-table__body tr:nth-child(even) td) { 
        background-color: #f5f5f5; // 灰色行 
    } 
    
    :deep(.el-table .el-table__body tr:nth-child(odd) td) { 
        background-color: white;   // 白色行 
    } 
    
    // 悬停效果 - 淡蓝色
    :deep(.el-table .el-table__body tr:hover td) { 
        background-color: #e3f2fd !important; // 淡蓝色悬停 
        cursor: pointer;          // 鼠标指针变为手型 
    } 

    // 操作按钮
    .el-button {
        border-radius: 4px; // 按钮圆角
        transition: all 0.3s ease; // 过渡效果

        &--primary {
            background-color: #2196F3; // 编辑按钮蓝色
            border-color: #2196F3;
        }

        &--danger {
            background-color: #f44336; // 删除按钮红色
            border-color: #f44336;
        }

        &:hover {
            transform: scale(1.05); // 悬停时轻微放大
        }
    }

    // 响应式设计
    @media (max-width: 768px) {
        .el-table {
            display: block;
            overflow-x: auto;
            white-space: nowrap;
        }
    }

    // 表格列宽优化
    :deep(.el-table) {
        // 论文标题列（改窄）
        .el-table__header th:nth-child(1),
        .el-table__body td:nth-child(1) {
            width: 200px;  // 从原来的400px改为200px
            min-width: 150px;
            max-width: 250px;
        }

        // 简介列（改宽）
        .el-table__header th:nth-child(2),
        .el-table__body td:nth-child(2) {
            width: 500px;  // 增加宽度
            min-width: 300px;
            max-width: 600px;
        }
    }
}
</style>

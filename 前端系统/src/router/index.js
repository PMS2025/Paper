import { createRouter, createWebHashHistory } from 'vue-router'

//导入组件
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'

import PaperCategoryVue from '@/views/paper/PaperCategory.vue'
import PaperManageVue from '@/views/paper/PaperManage.vue'
import PaperAuthorVue from '@/views/paper/PaperAuthor.vue'
import PaperJournalVue from '@/views/paper/PaperJournal.vue'
import PaperKeywordVue from '@/views/paper/PaperKeyword.vue'
import PaperkeyVue from '@/views/paper/Paperkey.vue'
import UserAvatarVue from '@/views/user/UserAvatar.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue'
import PaperrefeVue from '@/views/paper/PaperRefe.vue'
import PaperUploadVue from '@/views/paper/PaperUpload.vue'
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'


//定义路由关系
const routes = [
    { path: '/login', component: LoginVue },
    {
         path: '/', component: LayoutVue,redirect:'/paper/manage', children: [
            { path: '/paper/category', component: PaperCategoryVue },
            { path: '/paper/manage', component: PaperManageVue },
            { path: '/user/info', component: UserInfoVue },
            { path: '/user/avatar', component: UserAvatarVue },
            { path: '/user/resetPassword', component: UserResetPasswordVue },
            { path: '/paper/author', component: PaperAuthorVue},
            { path: '/paper/journal',component: PaperJournalVue},
            { path: '/paper/keyword', component: PaperKeywordVue },
            { path: '/paper/refe', component: PaperrefeVue },
            { path: '/paper/key', component: PaperkeyVue },
            { path: '/paper/upload', component: PaperUploadVue }

        ]
    }
]

//创建路由器
const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

//导出路由
export default router

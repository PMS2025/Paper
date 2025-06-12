<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { sealistService, searefeService, addService, deleService } from '@/api/refe.js';

// 文章列表数据模型
const papers = ref([]);
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 搜索相关变量
const searchType = ref('title');
const searchContent = ref('');

// 编辑界面的变量
const dialogVisible = ref(false);
const dialogVisible1 = ref(false);
const paperTitle = ref('');
const referenceText = ref('');

// 搜索函数
const findPaper = async () => {
    if (!searchContent.value.trim()) {
        ElMessage.error('请输入有效的搜索内容');
        return;
    }

    try {
        const result = searchType.value === 'title' 
            ? await sealistService(searchContent.value)
            : await searefeService(searchContent.value);

        if (result?.data) {
            papers.value = result.data.map((title, index) => ({
                id: index + 1,
                title,
            }));
            total.value = papers.value.length;
            ElMessage.success('查询成功');
        } else {
            papers.value = [];
            ElMessage.warning('未找到相关结果');
        }
    } catch (error) {
        console.error('搜索失败:', error);
        ElMessage.error('搜索失败，请重试');
    }
};

// 分页处理
const onSizeChange = (val) => {
    pageSize.value = val;
};

const onCurrentChange = (val) => {
    pageNum.value = val;
};

// 打开编辑界面
const openDialog = (type) => {
    if (type === 'add') {
        dialogVisible.value = true;
    } else {
        dialogVisible1.value = true;
    }
    paperTitle.value = '';
    referenceText.value = '';
};

// 添加功能
const addPaper = async () => {
    try {
        const result = await addService(paperTitle.value, referenceText.value);
        if (result?.code === 0) {
            ElMessage.success('添加成功');
            dialogVisible.value = false;
            findPaper(); // 刷新列表
        } else {
            ElMessage.error(result?.msg || '添加失败');
        }
    } catch (error) {
        console.error('添加失败:', error);
        ElMessage.error('添加失败，请重试');
    }
};

// 删除功能
const delePaper = async () => {
    try {
        const result = await deleService(paperTitle.value, referenceText.value);
        if (result?.code === 0) {
            ElMessage.success('删除成功');
            dialogVisible1.value = false;
            findPaper(); // 刷新列表
        } else {
            ElMessage.error(result?.msg || '删除失败');
        }
    } catch (error) {
        console.error('删除失败:', error);
        ElMessage.error('删除失败，请重试');
    }
};

// 复位函数
const resetTable = () => {
    papers.value = [];
    searchContent.value = '';
    searchType.value = 'title';
    pageNum.value = 1;
    total.value = 0;
};
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <h2 class="title">参考文献管理</h2>
                <div class="button-group">
                    <el-button type="primary" @click="openDialog('add')" class="action-btn">
                        <el-icon><Plus /></el-icon> 添加文献
                    </el-button>
                    <el-button type="danger" @click="openDialog('delete')" class="action-btn">
                        <el-icon><Delete /></el-icon> 删除文献
                    </el-button>
                </div>
            </div>
        </template>

        <!-- 搜索表单 -->
        <div class="search-container">
            <el-form :inline="true" :model="searchContent" class="search-form">
                <el-form-item>
                    <el-select v-model="searchType" placeholder="搜索类型" class="search-select">
                        <el-option label="按论文名称" value="title"></el-option>
                        <el-option label="按参考文献" value="reference"></el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item>
                    <el-input 
                        v-model="searchContent" 
                        placeholder="请输入搜索内容" 
                        clearable
                        class="search-input"
                        @keyup.enter="findPaper"
                    >
                        <template #append>
                            <el-button @click="findPaper" type="primary">
                                <el-icon><Search /></el-icon> 搜索
                            </el-button>
                        </template>
                    </el-input>
                </el-form-item>
                
                <el-form-item>
                    <el-button @click="resetTable" plain>
                        <el-icon><Refresh /></el-icon> 重置
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 文章列表 -->
        <el-table 
            :data="papers.slice((pageNum - 1) * pageSize, pageNum * pageSize)" 
            style="width: 100%"
            stripe
            border
            highlight-current-row
            empty-text="暂无数据"
            class="data-table"
        >
            <el-table-column 
                label="序号" 
                type="index" 
                width="80" 
                align="center"
            />
            <el-table-column 
                label="论文标题" 
                prop="title" 
                min-width="300"
                show-overflow-tooltip
            />
        </el-table>

        <!-- 分页条 -->
        <div class="pagination-container">
            <el-pagination 
                v-model:current-page="pageNum"
                v-model:page-size="pageSize"
                :page-sizes="[5, 10, 20, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="onSizeChange"
                @current-change="onCurrentChange"
                background
            />
        </div>

        <!-- 添加文献弹窗 -->
        <el-dialog 
            v-model="dialogVisible" 
            title="添加文献" 
            width="500px"
            :close-on-click-modal="false"
        >
            <el-form label-position="top">
                <el-form-item label="论文标题" required>
                    <el-input 
                        v-model="paperTitle" 
                        placeholder="请输入论文名称"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="参考文献" required>
                    <el-input 
                        v-model="referenceText" 
                        placeholder="请输入参考文献"
                        type="textarea"
                        :rows="4"
                        clearable
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button 
                    type="primary" 
                    @click="addPaper"
                    :disabled="!paperTitle || !referenceText"
                >
                    确认添加
                </el-button>
            </template>
        </el-dialog>

        <!-- 删除文献弹窗 -->
        <el-dialog 
            v-model="dialogVisible1" 
            title="删除文献" 
            width="500px"
            :close-on-click-modal="false"
        >
            <el-form label-position="top">
                <el-form-item label="论文标题" required>
                    <el-input 
                        v-model="paperTitle" 
                        placeholder="请输入要删除的论文名称"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="参考文献" required>
                    <el-input 
                        v-model="referenceText" 
                        placeholder="请输入要删除的参考文献"
                        type="textarea"
                        :rows="4"
                        clearable
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible1 = false">取消</el-button>
                <el-button 
                    type="danger" 
                    @click="delePaper"
                    :disabled="!paperTitle || !referenceText"
                >
                    确认删除
                </el-button>
            </template>
        </el-dialog>
    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        .title {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #333;
        }
        
        .button-group {
            display: flex;
            gap: 12px;
        }
    }
}

.search-container {
    margin-bottom: 20px;
    
    .search-form {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        
        :deep(.el-form-item) {
            margin-bottom: 0;
        }
        
        .search-input {
            width: 300px;
        }
        
        .search-select {
            width: 150px;
        }
    }
}

.data-table {
    margin-top: 20px;
    font-size: 14px;
    
    :deep(.el-table__header-wrapper) {
        th {
            background-color: #1e88e5;
            color: white;
            font-weight: 500;
            height: 50px;
        }
    }
    
    :deep(.el-table__body) {
        tr:hover td {
            background-color: #f0f7ff !important;
        }
    }
}

.pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}

.action-btn {
    .el-icon {
        margin-right: 6px;
    }
}

:deep(.el-dialog) {
    border-radius: 8px;
    
    .el-dialog__header {
        border-bottom: 1px solid #eee;
        margin-right: 0;
        
        .el-dialog__title {
            font-weight: 600;
        }
    }
    
    .el-form-item__label {
        font-weight: 500;
        color: #555;
    }
    
    .el-textarea__inner,
    .el-input__inner {
        font-size: 14px;
    }
}

@media (max-width: 768px) {
    .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        
        .title {
            margin-bottom: 0;
        }
    }
    
    .search-form {
        flex-direction: column;
        width: 100%;
        
        .search-input,
        .search-select {
            width: 100% !important;
        }
    }
    
    :deep(.el-dialog) {
        width: 90% !important;
    }
}
</style>
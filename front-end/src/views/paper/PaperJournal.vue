<script setup>
import { Edit, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  journalListService, 
  journalAddService, 
  journalDeleteService, 
  journalUpdateService 
} from '@/api/journal.js'

const Journal = ref([
  { "id": 1, "name": "ACM" },
  { "id": 2, "name": "Nature" },
  { "id": 3, "name": "Science" }
])

const JournalModel = ref({ 'id': '', 'name': '' })
const dialogVisible = ref(false)
const title = ref('')

// 获取期刊列表
const JournalList = async () => {
  let result = await journalListService()
  Journal.value = result.data
}
JournalList()

// 清空表单数据
const clearData = () => {
  JournalModel.value = { 'id': '', 'name': '' }
}

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入期刊名称', trigger: 'blur' }]
}

// 添加期刊
const addJournal = async () => {
  let result = await journalAddService(JournalModel.value)
  ElMessage.success(result.msg || '添加成功')
  dialogVisible.value = false
  JournalList()
}

// 编辑期刊
const showDialog = (row) => {
  dialogVisible.value = true
  title.value = '编辑期刊'
  JournalModel.value = { ...row }
}

// 更新期刊
const updateJournal = async () => {
  let result = await journalUpdateService(JournalModel.value)
  ElMessage.success(result.msg || '修改成功')
  dialogVisible.value = false
  JournalList()
}

// 删除期刊
const deleteJournal = (row) => {
  ElMessageBox.confirm(
    '确定要删除该期刊吗?',
    '温馨提示',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(async () => {
    await journalDeleteService(row.id)
    ElMessage.success('删除成功')
    JournalList()
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 斑马纹行样式
const tableRowClassName = ({ rowIndex }) => {
  return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <h2 class="title">期刊管理</h2>
        <el-button 
          type="primary" 
          @click="dialogVisible = true; title = '添加期刊'; clearData()"
          class="add-btn"
        >
          <el-icon class="icon"><Plus /></el-icon>
          添加期刊
        </el-button>
      </div>
    </template>

    <el-table 
      :data="Journal" 
      style="width: 100%"
      :row-class-name="tableRowClassName"
      stripe
      border
      highlight-current-row
    >
      <el-table-column label="序号" width="100" prop="id" align="center" />
      <el-table-column label="期刊名称" prop="name" min-width="180" />
      <el-table-column label="操作" width="150" align="center">
        <template #default="{ row }">
          <el-button-group>
            <el-button 
              :icon="Edit" 
              circle 
              @click="showDialog(row)"
              class="edit-btn"
            />
            <el-button 
              :icon="Delete" 
              circle 
              @click="deleteJournal(row)"
              class="delete-btn"
            />
          </el-button-group>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" image-size="120">
          <el-button type="primary" @click="dialogVisible = true; title = '添加期刊'; clearData()">
            添加期刊
          </el-button>
        </el-empty>
      </template>
    </el-table>

    <!-- 添加/编辑弹窗 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="title" 
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form 
        :model="JournalModel" 
        :rules="rules" 
        label-width="80px"
        label-position="top"
      >
        <el-form-item label="序号" prop="id">
          <el-input 
            v-model="JournalModel.id" 
            placeholder="请输入序号"
            clearable
          />
        </el-form-item>
        <el-form-item label="期刊名称" prop="name">
          <el-input 
            v-model="JournalModel.name" 
            placeholder="请输入期刊名称"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button 
          type="primary" 
          @click="title === '添加期刊' ? addJournal() : updateJournal()"
        >
          确认
        </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
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
    
    .add-btn {
      .icon {
        margin-right: 6px;
      }
    }
  }
}

:deep(.el-table) {
  font-size: 14px;
  
  th.el-table__cell {
    background-color: #1e88e5;
    color: white;
    font-weight: 500;
    height: 50px;
  }
  
  tr.even-row td {
    background-color: #fafafa;
  }
  
  tr.odd-row td {
    background-color: white;
  }
  
  tr:hover td {
    background-color: #f0f7ff !important;
  }
  
  .el-button-group {
    .el-button {
      margin: 0 4px;
      transition: all 0.3s;
      
      &:hover {
        transform: scale(1.1);
      }
    }
    
    .edit-btn {
      color: #2196f3;
      border-color: #2196f3;
      
      &:hover {
        background-color: #e3f2fd;
      }
    }
    
    .delete-btn {
      color: #f44336;
      border-color: #f44336;
      
      &:hover {
        background-color: #ffebee;
      }
    }
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
  
  .el-input__inner {
    height: 40px;
  }
}

.el-empty {
  padding: 40px 0;
  
  :deep(.el-empty__description) {
    margin: 20px 0;
    color: #888;
  }
}

@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90% !important;
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
    
    .title {
      margin-bottom: 12px;
    }
  }
}
</style>
<script setup>
import { Edit, Delete, UserFilled } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import { 
  authorListService, 
  authorAddService, 
  authorDeleteService, 
  authorUpdateService,
  authorPaperService
} from '@/api/author.js'

// 作者数据
const Author = ref([
  { "id": 1, "name": "John Doe" },
  { "id": 2, "name": "Jane Smith" },
  { "id": 3, "name": "Albert Einstein" }
])

const AuthorModel = ref({ 'id': '', 'name': '' })
const dialogVisible = ref(false)
const title = ref('')
const searchType = ref('author')

// 获取作者列表
const AuthorList = async () => {
  const result = await authorListService()
  Author.value = result.data
}
AuthorList()

// 清空表单
const clearData = () => {
  AuthorModel.value = { 'id': '', 'name': '' }
}

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入作者名称', trigger: 'blur' }],
  id: [{ required: true, message: '请输入序号', trigger: 'blur' }]
}

// 添加作者
const addAuthor = async () => {
  try {
    const result = await authorAddService(AuthorModel.value)
    ElMessage.success(result.msg || '添加成功')
    dialogVisible.value = false
    AuthorList()
  } catch (error) {
    ElMessage.error('添加失败')
  }
}

// 编辑作者
const showDialog = (row) => {
  dialogVisible.value = true
  title.value = '编辑作者'
  AuthorModel.value = { ...row }
}

// 更新作者
const updateAuthor = async () => {
  try {
    const result = await authorUpdateService(AuthorModel.value)
    ElMessage.success(result.msg || '修改成功')
    dialogVisible.value = false
    AuthorList()
  } catch (error) {
    ElMessage.error('修改失败')
  }
}

// 删除作者
const deleteAuthor = (row) => {
  ElMessageBox.confirm(
    '确定要删除该作者吗？',
    '温馨提示',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(async () => {
    await authorDeleteService(row.id)
    ElMessage.success('删除成功')
    AuthorList()
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 搜索论文与作者关系
const Search = async () => {
  if (!AuthorModel.value.id) {
    ElMessage.warning('请选择一位作者')
    return
  }
  
  try {
    const result = await authorPaperService(AuthorModel.value.id)
    if (result.code === 0 && result.data) {
      ElMessage.success('查询成功')
      drawChart(result.data)
    } else {
      ElMessage.warning('未找到相关论文数据')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('查询失败，请重试')
  }
}

// 绘制图表
const drawChart = (data) => {
  const chartDom = document.getElementById('chart');
  const myChart = echarts.init(chartDom);
  
  // 清除旧图表
  myChart.clear();
  
  const papers = Object.keys(data);
  if (papers.length === 0) return;
  
  // 选择第一位作者
  const selectedAuthorId = AuthorModel.value.id;
  const selectedAuthor = Author.value.find(a => a.id == selectedAuthorId)?.name || `作者${selectedAuthorId}`;
  
  // 构造节点和关系
  const nodes = [
    { 
      name: selectedAuthor, 
      category: 0, 
      symbolSize: 50, 
      itemStyle: { 
        color: '#1e88e5',
        borderColor: '#0d47a1',
        borderWidth: 2
      },
      label: {
        fontWeight: 'bold',
        fontSize: 14
      }
    }
  ];
  
  const links = [];
  
  papers.forEach(paper => {
    // 添加论文节点
    nodes.push({ 
      name: paper, 
      category: 1, 
      symbolSize: 40, 
      itemStyle: { 
        color: '#4caf50',
        borderColor: '#2e7d32',
        borderWidth: 2
      },
      label: {
        fontSize: 12
      }
    });
    
    // 添加论文与作者的关系
    links.push({ 
      source: paper, 
      target: selectedAuthor,
      lineStyle: { 
        color: '#777',
        width: 1.5,
        curveness: 0.2
      }
    });
    
    // 添加该论文的其他作者
    data[paper].forEach(otherAuthor => {
      if (otherAuthor !== selectedAuthor) {
        // 检查是否已存在该作者节点
        if (!nodes.some(node => node.name === otherAuthor)) {
          nodes.push({ 
            name: otherAuthor, 
            category: 2, 
            symbolSize: 30,
            itemStyle: { 
              color: '#ff9800',
              borderColor: '#e65100',
              borderWidth: 2
            },
            label: {
              fontSize: 12
            }
          });
        }
        // 添加论文与其他作者的关系
        links.push({ 
          source: paper, 
          target: otherAuthor,
          lineStyle: { 
            color: '#999', 
            width: 1,
            curveness: 0.2
          }
        });
      }
    });
  });

  const option = {
    title: {
      text: `"${selectedAuthor}"的论文合作网络`,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
      },
      subtext: `共 ${papers.length} 篇论文`,
      subtextStyle: {
        fontSize: 12,
        color: '#666'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        if (params.dataType === 'node') {
          return `<strong>${params.name}</strong>`;
        }
        return `<strong>${params.data.source}</strong> → <strong>${params.data.target}</strong>`;
      }
    },
    legend: {
      data: ['核心作者', '论文', '合作作者'],
      orient: 'vertical',
      right: 20,
      top: 'middle',
      textStyle: {
        color: '#666'
      }
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        force: {
          repulsion: 150,
          edgeLength: [80, 120],
          gravity: 0.1
        },
        roam: true,
        focusNodeAdjacency: true,
        draggable: true,
        categories: [
          { name: '核心作者', itemStyle: { color: '#1e88e5' } },
          { name: '论文', itemStyle: { color: '#4caf50' } },
          { name: '合作作者', itemStyle: { color: '#ff9800' } }
        ],
        data: nodes,
        links: links,
        label: {
          show: true,
          position: 'right',
          fontSize: 12,
          color: '#333'
        },
        edgeSymbol: ['none', 'arrow'],
        edgeSymbolSize: [0, 8],
        lineStyle: {
          opacity: 0.8,
          width: 1.5,
          curveness: 0.2
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 2.5
          },
          label: {
            show: true,
            fontWeight: 'bold'
          }
        },
        animation: true,
        animationDuration: 1500,
        animationEasing: 'quinticInOut'
      }
    ],
    backgroundColor: '#f9f9f9'
  };

  myChart.setOption(option);
  
  // 响应窗口大小变化
  window.addEventListener('resize', function() {
    myChart.resize();
  });
}

// 确保DOM加载完成
onMounted(() => {
  // 初始加载图表
  if (Author.value.length > 0) {
    AuthorModel.value.id = Author.value[0].id;
  }
});
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>作者列表</span>
        <div class="extra">
          <el-button type="primary" @click="dialogVisible = true; title = '添加作者'; clearData()">添加作者</el-button>
        </div>
      </div>
    </template>
    
    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item>
        <el-select v-model="AuthorModel.id" placeholder="请选择作者">
          <el-option v-for="j in Author" :key="j.id" :label="j.name" :value="j.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="Search()">查询合作网络</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 作者表格 -->
    <el-table :data="Author" style="width: 100%">
      <el-table-column label="序号" width="100" prop="id"></el-table-column>
      <el-table-column label="名字" prop="name"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template #default="{ row }">
          <el-button-group>
            <el-button
              :icon="Edit"
              circle
              plain
              type="primary"
              @click="showDialog(row)"
              class="edit-btn"
            />
            <el-button
              :icon="Delete"
              circle
              plain
              type="danger"
              @click="deleteAuthor(row)"
              class="delete-btn"
            />
          </el-button-group>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    
    <!-- 图表容器 -->
    <div id="chart" style="width: 100%; height: 500px; margin-top: 20px; border-radius: 8px; border: 1px solid #eee;"></div>
    
    <!-- 添加作者弹窗 -->
    <el-dialog v-model="dialogVisible" :title="title" width="30%">
      <el-form :model="AuthorModel" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="序号" prop="id">
          <el-input v-model="AuthorModel.id" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="作者名称" prop="name">
          <el-input v-model="AuthorModel.name" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="title == '添加作者' ? addAuthor() : updateAuthor()">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

/* 添加按钮样式 */
.edit-btn {
  color: #2196f3;
  border-color: #2196f3;
  
  &:hover {
    background-color: #e3f2fd;
    transform: scale(1.1);
  }
}

.delete-btn {
  color: #f44336;
  border-color: #f44336;
  
  &:hover {
    background-color: #ffebee;
    transform: scale(1.1);
  }
}

.el-button-group {
  .el-button {
    margin: 0 4px;
    transition: all 0.3s;
  }
}
</style>
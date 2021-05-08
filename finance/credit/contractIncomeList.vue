<template>
  <!-- 收款合同列表 -->
  <div class="table_container bodyClass">
    <!-- 搜索条件 -->
    <el-form ref="form" :inline="true" :model="searchValue" label-width="80px" class='el-form-search'>

      <el-form-item label="合同编号">
        <el-input  @keyup.enter.native="search(1)" v-model="searchValue.contractCode"></el-input>
      </el-form-item>
      <el-form-item label="合同状态">
        <el-select v-model="searchValue.contractState" filterable placeholder="请选择">
          <el-option v-for="item in states" :key="item.label" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="经办人">
        <el-input @keyup.enter.native="search(1)" v-model="searchValue.operatorName"></el-input>
      </el-form-item>
      <el-form-item label="经办人部门">
        <el-select v-model="searchValue.departId" filterable placeholder="请选择">
          <el-option v-for="item in departs" :key="item.label" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="签订日期" class="el-form-cell billDataAll">
        <div class="el-form-cellcon">
          <el-date-picker
            v-model="searchValue.dateStart"
            format="yyyy - MM - dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="起始日期"
            @change="dateChange()"
          ></el-date-picker>
          <span class="block_span">-</span>
          <el-date-picker
            v-model="searchValue.dateEnd"
            format="yyyy - MM - dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="合同名称">
        <el-input @keyup.enter.native="search(1)" v-model="searchValue.contractName"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input @keyup.enter.native="search(1)" v-model="searchValue.contractComment"></el-input>
      </el-form-item>
      <el-form-item label="项目名称">
        <el-input @keyup.enter.native="search(1)" v-model="searchValue.projectName"></el-input>
      </el-form-item>
      <el-form-item label="项目编码">
        <el-input @keyup.enter.native="search(1)" v-model="searchValue.projectCode"></el-input>
      </el-form-item>
      <el-form-item label="对方单位">
        <el-input @keyup.enter.native="search(1)" v-model="searchValue.oppositeDepart"></el-input>
      </el-form-item>

    </el-form>

    <!-- 操作按钮 -->
    <el-row class="operationBtn" type="flex" justify="end">
      <el-col :span="20">
        <el-button type="primary" @click="btnOperation('add')">新建合同</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" icon="el-icon-search" @click="search(1)">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh-left" @click="search()">重置</el-button>
      </el-col>
    </el-row>

    <!-- 表格数据 -->
    <div class="operation_block" style="margin-top:20px">
      <el-table ref="table" v-loading="loading" stripe :data="tableData" border style="width: 100%" :height="tableMaxHeight" size="medium" class="cell_padd" @sort-change='getTableData'>
        <el-table-column type="index" label="序号" width="60" align="center">
          <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pageSize + 1}} </span></template>
        </el-table-column>
        <el-table-column prop="state" label="操作" width="200" align="center">
          <!-- state 代表合同状态 -->
          <template slot-scope="scope">
            <el-button-group> <!--v-if="scope.row.state == '待提交'"-->
              <el-button class="colorCCC" size="mini" type="text" @click="btnOperation('modify',scope.row)">修改</el-button>
              <el-button class="colorCCC" size="mini" type="text" @click="commit(scope.row.id)">提交</el-button>
              <el-button class="colorCCC" size="mini" type="text" @click="delTableData(scope.row)">删除</el-button>
            </el-button-group>
            <el-button-group v-if="scope.row.state == '待审批'">
              <el-button class="colorCCC" size="mini" type="text" @click="reverse_commit(scope.row.id)">撤销提交</el-button>
              <el-button class="colorCCC" size="mini" type="text" @click="btnOperation('See',scope.row)">查看合同详情</el-button>
            </el-button-group>
            <el-button-group v-if="scope.row.state == '审核完成'">
              <el-button class="colorCCC" size="mini" type="text" @click="btnOperation('SeeAudit', scope.row)">查看审核详情</el-button>
              <el-button class="colorCCC" size="mini" type="text" @click="btnOperation('See',scope.row)">查看合同详情</el-button>
            </el-button-group>
            <el-button-group v-if="scope.row.state == '退回' ">
              <el-button class="colorCCC" size="mini" type="text" @click="btnOperation('modify',scope.row)">修改</el-button>
              <el-button class="colorCCC" size="mini" type="text" @click="commit(scope.row.id)">提交</el-button>
              <el-button class="colorCCC" size="mini" type="text" @click="delTableData(scope.row)">删除</el-button>
              <el-button class="colorCCC" size="mini" type="text" @click="btnOperation('SeeAudit', scope.row)">查看审核详情</el-button>
            </el-button-group>
          </template>
        </el-table-column>
        <el-table-column prop="state" width="120" label="合同状态" align="center"
                         :formatter='formatterAudit'></el-table-column>
        <el-table-column prop="code" label="合同编号" width="200" align="center"></el-table-column>
        <el-table-column width="120px" align="center" prop="Date" label="合同签订日期"></el-table-column>
        <el-table-column align="center" prop="operatorName" label="经办人" width="160px"></el-table-column>
        <el-table-column width="120px" align="center" prop="departName" label="经办人部门"></el-table-column>
        <el-table-column prop="Type" width="120" label="合同类别" align="center"
                         :formatter='formatterPurchaseType'></el-table-column>
        <el-table-column width="120px" align="center" prop="contractName" label="合同名称"></el-table-column>
        <el-table-column width="120px" align="center" prop="amount" label="合同金额"></el-table-column>
        <el-table-column width="120px" align="center" prop="projectName" label="项目名称"></el-table-column>
        <el-table-column width="120px" align="center" prop="projectCode" label="项目编号"></el-table-column>
        <el-table-column width="120px" align="center" prop="oppositeDepart" label="对方单位"></el-table-column>
      </el-table>

      <div class="block page-block">
        <!-- 分页按钮 -->
        <el-pagination @current-change="currentChange" @size-change="sizeChange" :page-size="pageSize" :page-sizes="[30,50,100,200,500,1000]"
                       layout="prev,pager,next,jumper,sizes,total" :total="totalPage" :current-page="currentPage" background></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  data(){
    return{
      loading:false,
      searchValue:{
        contractCode: '',
        contractName: '',
        contractState: '',
        operatorName: '',
        departId: '',
        dateStart: '',
        dateEnd: '',
        contractComment: '',
        projectName: '',
        projectCode: '',
        oppositeDepart: '',
      },
      //字典们
      states: this.$util.getDictData('dict_contract_state'),
      departs: this.$util.getDictData('dict_operator_depart'),
      titles:'收款合同',
      tableData:[],
      pageSize: 30, //页面可显示数量
      currentPage: 1, //当前页数
      totalPage: null, //总页数
      sortArray:[], //排序数组 propText:''//排序标签 orderText:''排序方式
      tableMaxHeight: null,
      winHeight: null,
      modify:'', //标记哪种操作
      modifyId:'', //被操作的合同id
      departData:[], //经办部门
      pickerOptions:{},
      pickerOptions2:{},
      billType:'CIF',
      ApprovalSees: "小额设备申请单",
      ApprovalText:'', //是否批量，true为批量
      requestURL: '/finance/financeDataAssort' //接口
    }
  },
  created() {
    let _this = this;
    let text={
      label: "请选择",
      value: "",
      id:'',
    }
    this.states.unshift(text);
    this.departs.unshift(text);
    this.getTableData();
    this.getWindowHeight();
    window.addEventListener("resize", this.getWindowHeight);
  },
  components:{

  },
  methods:{
    //获取表格数据(
    async getTableData(value) {
      this.loading=true;
      let stringSort='';
      if(value){
        if(value.prop == null || value.order == null){
          this.sortArray[0] = "";
          this.sortArray[1] = "";
        }else{
          this.sortArray[0] =value.prop;
          if(value.order=='descending'){
            value.order='desc'
          }else if(value.order=='ascending'){
            value.order='asc'
          }
          this.sortArray[1] = value.order;
        }
        stringSort=this.sortArray.join(',')
      }else{
        stringSort=''
      }
      var searchData = {
        contractCode: this.searchValue.contractCode || "",
        contractName: this.searchValue.contractName || "",
        contractState: this.searchValue.contractState || "",
        operatorName: this.searchValue.operatorName || "",
        departId: this.searchValue.departId || "",
        dateStart: this.searchValue.dateStart || "",
        dateEnd: this.searchValue.dateEnd || "",
        contractComment: this.searchValue.contractComment || '',
        projectName: this.searchValue.projectName || '',
        projectCode: this.searchValue.projectCode || '',
        oppositeDepart: this.searchValue.oppositeDepart || '',

        order:stringSort,
        page: this.currentPage,
        limit: this.pageSize
      };
      this.$http.get(`${this.requestURL}/page`,{
        params: searchData
      }).then((res) => {
        if(res.data.code == 0){
          this.tableData=res.data.data; //表格数据
          this.totalPage=res.data.count;
          this.loading=false;
          this.getWindowHeight();
        }
      })
    },

    //日期修改
    dateChange(){
      let _this=this;
      this.pickerOptions={ //日期禁用
        disabledDate(date) {
          return date.getTime() < new Date(_this.searchValue.dateStart).getTime() - 86400000;
        }
      }
      if(this.searchValue.dateEnd){
        let billDateBeginText=new Date(this.searchValue.dateStart).getTime();
        let billDateEndText=new Date(this.searchValue.dateEnd).getTime();
        if(billDateBeginText>billDateEndText){
          this.searchValue.billDateEnd='';
        }
      }
    },

    // 查询
    async search(a) {
      if (a) {
        this.currentPage = 1
        this.getTableData();
      } else {
        this.searchValue = {
            contractCode: '',
            contractName: '',
            contractState: '',
            operatorName: '',
            departId: '',
            dateStart: '',
            dateEnd: '',
            contractComment: '',
            projectName: '',
            projectCode: '',
            oppositeDepart: '',
        },
        this.currentPage = 1
        this.getTableData();
      }
    },

    // 获取窗口高度
    getWindowHeight() {
      let _this=this;
      this.winHeight = document.documentElement.clientHeight;
      if (this.winHeight >300) {
        this.tableMaxHeight = this.winHeight -360;
      }
      setTimeout(function() {
        _this.tableMaxHeight = _this.winHeight -361;
      }, 1000);
    },

    //换页
    currentChange(val) {
      this.currentPage = val;
      // 发送请求获取数据
      this.getTableData();
    },

    // 当前页面可显示数量更改时
    sizeChange(val) {
      this.pageSize = val;
      this.currentPage=1;
      this.getTableData();
    },

    //显示隐藏添加对话框
    btnOperation(str, scopes) {
      var _that = this
      let ids='';
      if(scopes){
        ids=scopes.id
      }
      //新增
      if (str == "add") {
        this.modify = "add";
        let titles = "录入-"+this.titles;
        this.$util.layerFrame(titles, this.$page.CIF, '95%', '95%', this)
      }
      //行内修改
      if (str == "modify") {
        this.modifyId = scopes.id
        this.modify = "modify";
        let titles = "修改-"+this.titles;
        this.$util.layerFrame(titles, this.$page.CIF, '95%', '95%', _that)
      }
      //查看合同详情
      if (str == "See") {
        this.modifyId = scopes.id
        this.modify = "See"
        let titles = "查看-"+this.titles;
        this.$util.layerFrame(titles, this.$page.CIF, '95%', '95%', _that)
      }
      //查看审核详情
      if (str == "SeeAudit") {
        this.modifyId = scopes.id
        this.modify = "SeeAudit";
        let titles = "审批详情-"+this.titles;
        this.$util.layerFrameProcess(titles, this.$page.CIF,'50%','65%', _that)
      }
    },

    //删除合同
    delTableData(d) {
      var _this = this
      this.$confirm("是否要删除所选择的合同?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        var ids = d.id;
        this.loading = true
        const {
          data: {
            code
          }
        } = await this.$http.post(`${this.requestURL}/delete?ids=${ids}`);
        if (code == 0) {
          this.$util.CgMsg(_this,'删除成功')
          this.getTableData();
        }
      }).catch(() => {return false});
    },

    //提交起草的合同
    commit(id) {
        let surl = `${this.requestURL}/commit?id=${id}`;
        let t = '提交成功'
          this.$http.post(surl)
            .then((res) => {
              if(res.data.code == 1){
                return false
              }
              if(res.data.footer != "" && res.data.footer != null){
                this.$util.JgMsg(this,res.data.footer)
              }
              this.$util.JgMsg(this,t)
              this.getTableData();
            })
    },

    //撤销提交
    reverse_commit(id){
      let surl = `${this.requestURL}/cancel?id=${id}`;
      let t = '撤销提交成功'
      this.$confirm("是否要撤销提交?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        this.$http.post(surl)
          .then((res) => {
            if(res.data.code == 1){
              return false
            }
            if(res.data.footer != "" && res.data.footer != null){
              this.$util.JgMsg(this,res.data.footer)
            }
            this.$util.JgMsg(this,t)
            this.getTableData();
          })
      });
    }

  }
}
</script>

<style>
</style>

<template>
  <!-- 资料借阅列表审批 -->
  <div class="table_container bodyClass">
    <!-- 搜索条件 -->
     <!-- 搜索条件 -->
     <el-form ref="form" :inline="true" :model="searchValue" label-width="80px" class='el-form-search'>
      <el-form-item label="单据状态">
        <el-select v-model="searchValue.audit" filterable placeholder="请选择">
          <el-option v-for="item in audits" :key="item.label" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单据编号">
        <el-input  @keyup.enter.native="search(1)" v-model="searchValue.code"></el-input>
      </el-form-item>
      <el-form-item label="申请人">
        <el-input @keyup.enter.native="search(1)" v-model="searchValue.operatorName"></el-input>
      </el-form-item>
      <el-form-item label="申请人部门">
         <treeselect v-model="searchValue.departId" :disable-branch-nodes="false" :show-count="false" :multiple="false" :options="departData"  placeholder="请选择"/>
      </el-form-item>
      
      <el-form-item label="单据日期" class="el-form-cell billDataAll">
        <div class="el-form-cellcon">
          <el-date-picker
            v-model="searchValue.billDateBegin"
            format="yyyy - MM - dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="起始日期"
            @change="dateChange()"
          ></el-date-picker>
          <span class="block_span">-</span>
          <el-date-picker
            v-model="searchValue.billDateEnd"
            format="yyyy - MM - dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="申请事由"  style="float: left;width: 586px !important;">
        <el-input  v-model="searchValue.reason" style="width: 460px;"></el-input>
      </el-form-item> 
      
    </el-form>
    <!-- 操作按钮 -->
    <el-row class="operationBtn" type="flex" justify="end">
      <el-col :span="20">
        <el-button type="primary" v-if="$shiro.hasPermission('finance:data:process')" @click="btnOperation('lc')">流程查看</el-button>
        <el-button type="primary" v-if="$shiro.hasPermission('finance:data:approveAll')"
         @click="btnOperation('ApprovalAll')">批量审批</el-button>
        <el-button type="primary" v-if="$shiro.hasPermission('finance:data:record')" @click="btnOperation('See')">修改记录</el-button>
        <el-button type="primary" v-if="$shiro.hasPermission('finance:data:print')"
        @click="btnOperation('See')">打印</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" icon="el-icon-search" @click="search(1)">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh-left" @click="search()">重置</el-button>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
     <div class="operation_block" style="margin-top:20px">
      <el-table ref="table" v-loading="loading" stripe :data="tableData" border style="width: 100%" :height="tableMaxHeight" size="medium"  @selection-change="selectedDel" class="cell_padd" @sort-change='getTableData'>
        <el-table-column type="index" label="序号" width="60" align="center">
          <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pageSize + 1}} </span></template>
        </el-table-column>
        <el-table-column type="selection" align="center" width="60"></el-table-column>
        <el-table-column prop="audit" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button-group v-if="scope.row.audit == -2">
              <el-button class="colorCCC" size="mini" type="text" @click="btnOperation('modifys',scope.row)">修改</el-button>
              <el-button class="colorCCC" size="mini" type="text" @click="delTableData(2,scope.row)">删除</el-button>
            </el-button-group>
            <el-button-group v-if="scope.row.audit == 0 || scope.row.audit == -1">
              <el-button class="colorCCC" size="mini" type="text" @click="btnOperation('modifys',scope.row)">修改</el-button>
              <el-button class="colorCCC" size="mini" type="text" @click="colbtnFun(scope.row.id,'tj')">提交</el-button>
              <!-- <el-button class="colorCCC" size="mini" type="text" @click="delTableData(2,scope.row)">删除</el-button> -->
            </el-button-group>
            <el-button-group v-if="scope.row.audit ==1">
              <el-button class="colorCCC" size="mini" type="text" @click="colbtnFun(scope.row.id,'cx')">撤销提交</el-button>
              <el-button class="colorCCC" size="mini" type="text" @click="btnOperation('Sees',scope.row)">查看</el-button>
              <!-- <el-button class="colorCCC" size="mini" type="text" @click="btnOperation('lcs',scope.row)">流程查看</el-button> -->
            </el-button-group>
            <el-button-group v-if="scope.row.audit ==2 || scope.row.audit ==4 ">
              <!-- <el-button class="colorCCC" size="mini" type="text" @click="btnOperation('lcs',scope.row)">流程查看</el-button> -->
              <el-button class="colorCCC" size="mini" type="text" @click="btnOperation('Sees',scope.row)">查看</el-button>
            </el-button-group>
            <el-button-group v-if="scope.row.audit ==8 ">
              <el-button class="colorCCC" size="mini" type="text" @click="btnOperation('Sees',scope.row)">查看</el-button>
              <el-button class="colorCCC" size="mini" type="text" @click="delTableData(2,scope.row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
        <el-table-column prop="audit" width="120" label="审批状态" align="center" :formatter='formatterAudit'></el-table-column>
        <el-table-column prop="code" label="单据编号" width="200" align="center">
          <template slot-scope="scope">
            <span class='code-style' @click="btnOperation('Sees',scope.row)">{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column width="120px" align="center" prop="billDate" label="单据日期"></el-table-column>
        <el-table-column align="center" prop="operatorName" label="申请人" width="160px"></el-table-column>
        <el-table-column width="120px" align="center" prop="departName" label="申请人部门"></el-table-column>
        <el-table-column align="center" header-align="center" prop="reason" show-overflow-tooltip
        label="申请事由" min-width='200'></el-table-column>
        
        
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
    data() {
      return {
        urlType:'/finance/financeDataBorrow',
        loading:false,
        searchValue: {
          code: "", //单据编号
          audit: null, //单据状态
          operatorName:'', //申请人
          departId:null, //申请部门
          billDateBegin:'', //单据起始日期
          billDateEnd:'', //单据结束日期          
          reason:"",//申请事由
        },
        audits: this.$util.getDictData('dict_audit_state'), //单据类型
        project_types: this.$util.getDictData('dict_project_type'), //授信业务类型 dict_project_type        
        prints: this.$util.getDictData('dict_yes_no'), //是否打印
        titles: "资料借阅申请单", //新增表头

        isAudits:this.$util.getDictData('dict_audit'), //是否本人审批
        tableData: [],
        selectedData: [],
        modifyId: null,
        // titles: "付款申请单", //
        ApprovalSees: "资料借阅申请单",
        sortArray:[],
        allData:{
          procInsId:'',//流程查看ID
        },
        totalPage: null,
        tableMaxHeight: null,
        winHeight: null,
        pageSize: 30,
        currentPage: 1,
        ApprovalText:'', //是否批量，true为批量
        departData:[],
        pickerOptions:{},
        billType:'ZLJY',
      }
    },
    created () {
      let text={
        label: "请选择",
        value: "",
        id:'',
      }
      this.isAudits.unshift(text);
      let _this=this;
      this.getTableData();
      window.addEventListener("resize", this.getWindowHeight);
      //经办部门
      this.$http.get('/datas/depart/selecttree') .then((res) => {
        _this.departData=res.data.data;
        _this.departData.unshift(text);
      })
    },
    components: {
      Treeselect
    },
    methods: {
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
          code: this.searchValue.code || " ", //单据编号
          audit: this.searchValue.audit || "", //单据状态
          operatorName: this.searchValue.operatorName || "", //经办人
          departId: this.searchValue.departId || "", //经办部门        
          billDateBegin: this.searchValue.billDateBegin || "", //单据起始日期
          billDateEnd: this.searchValue.billDateEnd || "", //单据结束日期
          reason: this.searchValue.reason || "", //合同编号
          order:stringSort, //排序
          page: this.currentPage,
          limit: this.pageSize 
        };
        const {
          data: {
            data,
            count,
            code
          }
        } = await this.$http.get(`${this.urlType}/auditList`,{
          params: searchData
        });
        this.tableData = data;
        this.loading = false
        this.totalPage = count;
        this.getWindowHeight()
      },
      //日期修改
      dateChange(){
        let _this=this;
        this.pickerOptions={ //日期禁用
          disabledDate(date) {
            return date.getTime() < new Date(_this.searchValue.billDateBegin).getTime() - 86400000;
          }
        }
        if(this.searchValue.billDateEnd){
          let billDateBeginText=new Date(this.searchValue.billDateBegin).getTime();
          let billDateEndText=new Date(this.searchValue.billDateEnd).getTime();
          if(billDateBeginText>billDateEndText){
            this.searchValue.billDateEnd='';
          }
        }
      },
      //查询
      async search(a) {
        if (a) {
          this.currentPage = 1
          this.getTableData();
        } else {
          this.searchValue = {
            code: "", //单据编号
            audit: null, //单据状态
            operatorName:'', //申请人
            departId:null, //申请部门
            billDateBegin:'', //单据起始日期
            billDateEnd:'', //单据结束日期          
            reason:"",//申请事由   
          };
          this.getTableData();
          this.currentPage = 1
        }
      },
      //显示隐藏添加对话框
      btnOperation(str, scopes) {
        var _that = this
        let ids='';
        if(scopes){
          ids=scopes.id
        }
        //撤销审批
        if (str == "cx") { 
          this.$confirm("是否要撤销审批?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
            this.loading = true
            this.$http.post(`${this.urlType}/cancel?id=${ids}`)
            .then((res) => {
              if (res.data.code == 0) {
                this.$message({
                  message: "撤销审批成功",
                  type: 'success'
                });
                this.getTableData();
              }
              this.loading = false
            })
          });
        }
        //批量审批
        if (str == "ApprovalAll") {
          this.ApprovalText=true;
          for (let i = 0; i < this.selectedData.length; i++) {
            if (this.selectedData[i].audit == 4) {
              this.$message({
                message: '审批完成的单据不可审批',
                type: 'warning'
              });
              return false
            }
          }
          if (this.selectedData.length == 0) {
            this.$message({
              message: '请选择数据',
              type: 'warning'
            });
            return false
          }
          let title='审批-'+this.titles;
          this.$util.layerFrameShenpi(title,this.$page.Approval, '38%', '35%', _that)
        }
        //表头流程查看
        if (str == "lc") {
          if (this.selectedData.length == 0 || this.selectedData.length > 1) {
            this.$message({
              message: '流程查看只能选中一条数据',
              type: 'warning'
            });
            return false
          }
          this.modify = "lc"
          this.allData.procInsId = this.selectedData[0].procInsId
          let title='审批详情-'+this.titles;
          this.$util.layerFrameProcess(title, this.$page.ProcessView, '50%', '65%', _that)
        }
        //操作栏流程查看
        if (str == "lcs") {
          this.modify = "lc"
          this.allData.procInsId = scopes.procInsId
          let title='审批详情-'+this.titles;
          this.$util.layerFrameProcess(title,  this.$page.ProcessView, '50%', '65%', _that)
        }
        //操作栏审批
        if (str == "Approval") {
          this.modifyId = scopes.id
          this.modify = "Approval"
          let title='审批-'+ this.titles;
          this.$util.layerFrame(title, this.$page.ZLJY, '95%', '95%', _that)
        }
        //行内查看
        if (str == "Sees") {
          this.modifyId = scopes.id
          this.modify = "Sees"
          let title='查看-'+this.titles;
          this.$util.layerFrame(title, this.$page.ZLJY, '95%', '95%', _that)
        }
        //表头查看
        if (str == "See") {
          if (this.selectedData.length == 0 || this.selectedData.length > 1) {
            this.$message({
              message: '查看数据时只能选中一条数据',
              type: 'warning'
            });
            return false
          }
          this.modify = "See"
          let title='查看-'+this.titles;
          this.$util.layerFrame(title, this.$page.ZLJY, '95%', '95%', _that)
        }

      },
      //获取选中的数据
      selectedDel(selection) {
        this.selectedData = selection;
      },
      // 获取窗口高度
      getWindowHeight() {
        let _this=this;
        this.winHeight = document.documentElement.clientHeight;
        if (this.winHeight > 200) {
          this.tableMaxHeight = this.winHeight - 360;
        }
        setTimeout(function() {
          _this.tableMaxHeight = _this.winHeight -361;
        }, 100);
      },
      currentChange(val) {
        this.currentPage = val;
        // 发送请求获取数据
        this.getTableData();
      },
      // 当前显示页码数量更改时
      sizeChange(val) {
        this.pageSize = val;
        this.currentPage=1;
        this.getTableData();
      },
      //金额千分位格式化
      formatMoney(value, valueb) {
        let prototypename = valueb.property;
        if (value[valueb.property] == null) {
          return;
        } else {
          return this.$util.fmtMoney(value[valueb.property], 2);
        }
      },
      //是和否
      formatisPlanBorrow(value, valueb){
        if (value[valueb.property] == null) {
          return;
        } else {
          return this.$util.getDictTitle('dict_yes_no',value[valueb.property])
        }
      },
      //单据状态
      formatterAudit(value, valueb){
        if (value[valueb.property] == null) {
          return;
        } else {
          return this.$util.getDictTitle('dict_audit_state',value[valueb.property])
        }
      }
    }
  };
</script>

<style scoped>

</style>

<template>
<!-- 配套资金申请列表 -->
  <div class="table_container bodyClass">
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
       <el-form-item label="被配套项目编码">
        <el-input  @keyup.enter.native="search(1)" v-model="searchValue.byProjectCode"></el-input>
      </el-form-item>
      <el-form-item label="被配套项目名称">
        <el-input @keyup.enter.native="search(1)" v-model="searchValue.byProjectName"></el-input>
      </el-form-item> 
       <el-form-item label="配套项目编码">
        <el-input  @keyup.enter.native="search(1)" v-model="searchValue.projectCode"></el-input>
      </el-form-item>
      <el-form-item label="配套项目名称">
        <el-input @keyup.enter.native="search(1)" v-model="searchValue.projectName"></el-input>
      </el-form-item> 
       <el-form-item label="配套资金总额">
        <el-input  @keyup.enter.native="search(1)" v-model="searchValue.projectSummoney"></el-input>
      </el-form-item>
      <el-form-item label="本次配套金额">
        <el-input @keyup.enter.native="search(1)" v-model="searchValue.yetProjectMoney"></el-input>
      </el-form-item> 

    </el-form>
    <!-- 操作按钮 -->
    <el-row class="operationBtn" type="flex" justify="end">
      <el-col :span="20">
        <el-button type="primary" @click="btnOperation('add')" 
        v-if="$shiro.hasPermission('finance:credit:add')">增加</el-button>
        <el-button type="primary" @click="btnOperation('modify')" 
        v-if="$shiro.hasPermission('finance:credit:edit')">修改</el-button>
        <el-button type="primary" @click="delTableData(1)" 
        v-if="$shiro.hasPermission('finance:credit:del')">删除</el-button>
        <el-button type="primary" @click="btnOperation('See')"
         v-if="$shiro.hasPermission('finance:credit:view')">查看</el-button>
        <el-button type="primary" @click="btnOperation('lc')"
         v-if="$shiro.hasPermission('finance:credit:process')">流程查看</el-button>        
        <el-button type="primary" v-if="$shiro.hasPermission('finance:credit:print')">打印</el-button>
        <el-button type="primary" @click="btnOperation('dc')"
         v-if="$shiro.hasPermission('finance:credit:export')">导出</el-button>
        <el-button type="primary" @click="btnOperation('invalid')"
         v-if="$shiro.hasPermission('finance:credit:invalid')">作废</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" icon="el-icon-search" @click="search(1)">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh-left" @click="search()">重置</el-button>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <div class="operation_block">
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
        <el-table-column width="120px" align="center" prop="departName" label="申请人部门"></el-table-column>
        <el-table-column align="center" prop="operatorName" label="申请人" width="160px"></el-table-column>        
        <el-table-column width="120px" align="right" prop="byProjectCode" label="被配套项目编码" ></el-table-column>
        <el-table-column width="120px" align="right" prop="byProjectName" label="被配套项目名称" ></el-table-column>
        <el-table-column width="120px" align="right" prop="byProjectMoney" label="被配套项目金额" ></el-table-column>
        <el-table-column width="120px" align="right" prop="projectCode" label="配套项目编码" ></el-table-column>
        <el-table-column width="120px" align="right" prop="projectName" label="配套项目名称" ></el-table-column>
        <el-table-column width="120px" align="right" prop="projectSummoney" label="已配套金额" :formatter='formatMoney' header-align='center'></el-table-column>
        <el-table-column width="120px" align="right" prop="yetProjectMoney" label="本次配套金额" :formatter='formatMoney' header-align='center'></el-table-column>
      
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
        loading:false,
        searchValue: {
          code: "", //单据编号
          audit: null, //单据状态
          operatorName:'', //申请人
          departId:null, //申请部门
          billDateBegin:'', //单据起始日期
          billDateEnd:'', //单据结束日期          
          byProjectCode:'',//被配套项目编码
          byProjectName:'',//被配套项目名称
          projectCode:'',//配套项目编码
          projectName:'',//配套项目名称
          projectSummoney:'',//配套资金总额
          yetProjectMoney:'',//本次配套金额         
        },
        audits: this.$util.getDictData('dict_audit_state'), //单据类型
        project_types: this.$util.getDictData('dict_project_type'), //授信业务类型 dict_project_type        
        prints: this.$util.getDictData('dict_yes_no'), //是否打印
        titles: "配套资金申请单", //单据
        tableData:[], //表格数据
        pageSize: 30,
        currentPage: 1,
        totalPage: null,
        selectedData: [], //选中的数据//排序
        sortArray:[], //排序数组 propText:''//排序标签 orderText:''排序方式
        allData:{
          procInsId:'',//流程查看ID
        },
        tableMaxHeight: null,
        winHeight: null,
        modify:'', //标记的是哪一项操作
        modifyId:'',
        departData:[], //经办部门
        pickerOptions:{},
        billType:'PTZJ',
        requestURL:'/finance/financeDataAssort',//接口地址
      };
    },
    created () {
      let text={
        label: "请选择",
        value: "",
        id:'',
      }
      this.audits.unshift(text);
      this.prints.unshift(text);
      let _this=this;
      this.getTableData();
      this.getWindowHeight();
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
      //获取表格数据
      getTableData(value){
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
        this.$http.get(`${this.requestURL}/page`,{         
        
          params:{
            code: this.searchValue.code || " ", //单据编号
            audit: this.searchValue.audit || "", //单据状态
            operatorName: this.searchValue.operatorName || "", //经办人
            departId: this.searchValue.departId || "", //经办部门
            billDateBegin: this.searchValue.billDateBegin || "", //单据起始日期
            billDateEnd: this.searchValue.billDateEnd || "", //单据结束日期
            byProjectCode: this.searchValue.byProjectCode || "", //被配套项目编码
            byProjectName: this.searchValue.byProjectName || "", //被配套项目名称            
            projectCode: this.searchValue.projectCode || "", //配套项目编码
            projectName: this.searchValue.projectName || "", //配套项目名称
            projectSummoney: this.searchValue.projectSummoney || "", //配套资金总额
            yetProjectMoney: this.searchValue.yetProjectMoney || "", //本次配套金额
            order:stringSort, //排序
            page: this.currentPage,
            limit: this.pageSize 
          }
        })
        .then((res) => {
          if(res.data.code==0){
            this.tableData=res.data.data; //表格数据
            this.totalPage=res.data.count;
            this.loading=false;
            this.getWindowHeight()
          }
        })
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
      // 查询
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
            byProjectCode:'',//被配套项目编码
            byProjectName:'',//被配套项目名称
            projectCode:'',//配套项目编码
            projectName:'',//配套项目名称
            projectSummoney:'',//配套资金总额
            yetProjectMoney:'',//本次配套金额  
          };
          this.currentPage = 1
          this.getTableData();
        }
      },
      //获取需要删除的数据
      selectedDel(selection) { //获取选中数据
        this.selectedData = selection;
      },
      //删除
      delTableData(n,d) { //n为1时是批量，2为单个
        var _this = this
        if(n == 2){
          if(d.audit == -2 || d.audit == -1 || d.audit == 0 || d.audit == 8){
          this.$confirm("是否要删除所选择的单据?", "提示", {
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
          }else {
            this.$util.SbMsg(_this,'已提交的单据不可删除');
          }
        }
        if(n == 1){
          if(this.selectedData.length < 1){
            this.$util.JgMsg(_this, "请选择数据！")
            return false
          }
          for(let i = 0; i < this.selectedData.length; i++){
            if (this.selectedData[i].audit == -2 || this.selectedData[i].audit == -1 || this.selectedData[i].audit == 0|| this.selectedData[i].audit == 8) {

            } else {
              this.$util.SbMsg(_this,'已提交的单据不可删除');
              return false
            }
          }
          this.$confirm("确定删除所选数据吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
            var ids = "";
            for (let i = 0; i < this.selectedData.length; i++) {
              ids += this.selectedData[i].id + ','
            }
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
          });
       }
      },
      //提交和撤销提交
      colbtnFun(id, a) {
        if (a == 'tj' || a == 'cx') {
          let surl = `${this.requestURL}/commit?id=${id}`;
          let t = '提交成功'
          if (a == 'cx') {
            surl = `${this.requestURL}/cancel?id=${id}`;
            t = '撤销提交成功'
          }
          if(a == 'cx'){
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
          }else{
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
          }
        }
      },
      //显示隐藏添加对话框
      btnOperation(str, scopes) {
        var _that = this
        //新增
        if (str == "add") {
          this.modify = "add";
          let titles = "录入-"+this.titles;
          this.$util.layerFrame(titles, this.$page.PTZJ, '95%', '95%', this)
        }
        //行内修改
        if (str == "modifys") {
          this.modifyId = scopes.id
          this.modify = "modifys";
          let titles = "修改-"+this.titles;
          this.$util.layerFrame(titles, this.$page.PTZJ, '95%', '95%', _that)
        }
        //表头修改
        if (str == "modify") {
          if (this.selectedData.length == 0 || this.selectedData.length > 1) {
            this.$message({
              message: '修改数据时只能选中一条数据',
              type: 'warning'
            });
            return false
          }
          if (this.selectedData[0].audit == -2 || this.selectedData[0].audit == -1 || this.selectedData[0].audit == 0) {
            this.modify = "modify";
            let titles = "修改-"+this.titles;
            this.$util.layerFrame(titles, this.$page.PTZJ, '95%', '95%', _that)
          } else {
            let titText="已提交的单据不可修改"
            if(this.selectedData[0].audit==8){
              titText="已作废单据不可修改"
            }
            this.$util.JgMsg(this,titText)
          }
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
          let titles = "查看-"+this.titles;
          this.$util.layerFrame(titles, this.$page.PTZJ, '95%', '95%', _that)
        }
        //单据编号查看
        if (str == "Sees") {
          this.modifyId = scopes.id
          this.modify = "Sees"
          let titles = "查看-"+this.titles;
          this.$util.layerFrame(titles, this.$page.PTZJ, '95%', '95%', _that)
        }
        //操作栏流程查看
        if (str == "lcs") {
          this.allData.procInsId = scopes.procInsId
          this.modify = "lcs";
          let titles = "审批详情-"+this.titles;
          this.$util.layerFrameProcess(titles,this.$page.ProcessView,'50%','65%', _that)
        }
        //表头流程查看
        if (str == "lc") {
          if (this.selectedData.length == 0 || this.selectedData.length > 1) {
            this.$util.JgMsg(this,'流程查看时只能选中一条数据')
            return false
          }
          this.allData.procInsId = this.selectedData[0].procInsId
          this.modify = "lc"
          let titles = "审批详情-"+this.titles;
          this.$util.layerFrameProcess(titles,this.$page.ProcessView,'50%','65%', _that)
        }
        //复制单据
        if (str == "copy") {
          let copyId='';
          if (this.selectedData.length == 0) {
            this.$util.JgMsg(this,'请选择要复制的单据')
            return false
          }
          if(this.selectedData.length==1){
            copyId=this.selectedData[0].id;
          }else{
            for(let i=0;i<this.selectedData.length;i++){
              copyId+=this.selectedData[i].id+','
            }
          }
          this.loading=true;
          this.$http.post(`${this.requestURL}/copy?ids=${copyId}`)
          .then((res) => {
            if(res.data.code==0){
              // this.tableData=res.data.data; //表格数据
              // this.totalPage=res.data.count;
              this.loading=false;
              this.search(1)
            }
          })
        }
        //导出
        if (str == "dc"){
          let ids='',audittext='',departIdtext='',printtext='';
          if(this.selectedData.length>0){
            if(this.selectedData.length==1){
              ids=this.selectedData[0].id;
            }else{
              for(var i=0;i<this.selectedData.length;i++){
                ids+=this.selectedData[i].id+',';
              }
            }
          }
          if(this.searchValue.audit==null){
            audittext=''
          }else{
            audittext=this.searchValue.audit
          }
          if(this.searchValue.departId==null){
            departIdtext=''
          }else{
            departIdtext=this.searchValue.departId
          }
          if(this.searchValue.print==null){
            printtext=''
          }else{
            printtext=this.searchValue.print
          }
          let url = `${this.$http.defaults.baseURL}${this.requestURL}/excelExport?ids=${ids}&code=${this.searchValue.code}&audit=${audittext}&operatorName=${this.searchValue.operatorName}&departId=${departIdtext}&reason=${this.searchValue.reason}&billDateBegin=${this.searchValue.billDateBegin}&billDateEnd=${this.searchValue.billDateEnd}&sumAmountBegin=${this.searchValue.sumAmountBegin}&sumAmountEnd=${this.searchValue.sumAmountEnd}&print=${printtext}`
          window.open(url);
        }
        //作废
        if(str=='invalid'){
          let auditArray=[]; 
          if(this.selectedData.length < 1){
            this.$util.JgMsg(this, "请选择数据！")
            return false
          }
          for(let i = 0; i < this.selectedData.length; i++){
            if (this.selectedData[i].print =='1' || this.selectedData[i].isVocher =='1') {

            } else {
              this.$util.JgMsg(this,'已打印或已生成凭证的单据，不能作废');
              return false
            }
            auditArray.push(this.selectedData[i].audit)
          }
          if(auditArray.indexOf(8)>-1){
            this.$util.JgMsg(this,'已作废的单据，不可重复作废');
            return false
          }
          this.$confirm("是否要作废选中的单据, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
            var ids = "";
            for (let i = 0; i < this.selectedData.length; i++) {
              ids += this.selectedData[i].id + ','
            }
            this.loading = true
            const {
              data: {
                code
              }
            } = await this.$http.post(`${this.requestURL}/invalid?ids=${ids}`);
            if (code == 0) {
              this.$util.CgMsg(this,'作废成功')
              this.getTableData();
            }
          });
        }
      },
      currentChange(val) {
        this.currentPage = val;
        // 发送请求获取数据
        this.getTableData();
      },
      // 当前显示页码数量更改时
      sizeChange(val) {
        this.currentPage=1;
        this.pageSize = val;
        // 发送请求获取数据
        this.getTableData();
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
      //点击行触发，选中或不选中复选框
      handleRowClick(row, column, event) {
        this.$refs.table.toggleRowSelection(row);
      },
      // 合计行
      summaryMethod(param) {
        const {
          columns,
          data
        } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = "合计";
            return;
          }
          const values = data.map(item =>
            this.$util.delcommafy(item[column.property])
          );
          if (
            column.property == "moneyTotal" ||
            column.property == "moneyExcute" ||
            column.property == "moneyLast" ||
            column.property == 'moneyOccuping'
          ) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = this.$util.fmtMoney(sums[index], 2);
          } else {
            sums[index] = "--";
          }
        });
        return sums;
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

<style scoped="scoped">


</style>

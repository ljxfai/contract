<template>
  <!-- 配套资金申请 -->

  <div class="table_container" id="table_MonthlyBonusForm">
    <div :active="active" class="step" style="margin-bottom: 10px;">
      <div v-for="(time,index) in arr" :key="index" style="display: inline-block;">
        <div class="lefts">
          <div :class="active == index?'tits_usrr'+index:'tits'+index" @click="active=index"></div>
          <span :style="active == index?'color:red;':'color:#1062d4'" class="left_tits" style="width:120px;left:-39px;">{{time}}</span>
        </div>
        <div class="_right" v-show="index != arr.length -1">
          <span :style="active == index?'background:red':'background:#1062d4;'"></span>
        </div>
      </div>
    </div>

    <div class="approve-box">
      <el-button type="primary" @click="clickprint()" v-if="!isWrite">打印</el-button>
      <el-button v-if="isAudit" type="primary" @click="Approval()">审批</el-button>
      <el-button v-if="!isWrite" type="primary" @click="flow()">流程查看</el-button>
      <el-button v-if="isAudit" type="primary" @click="Submission(0)">保存</el-button>
    </div>
    <!-- 表单 -->
    <el-form ref="form" :model="rowData" label-position="left" inline class='el-form-search'>
      <el-form-item label="单据编号"   required>
        <el-input placeholder="保存后自动生成" v-model="rowData.code" disabled></el-input>
      </el-form-item>
      <el-form-item label="单据日期"   required>
        <el-input v-model="rowData.billDate" disabled></el-input>
      </el-form-item>
      <el-form-item label="申请人"   required>
        <el-input v-model="rowData.operatorName" disabled></el-input>
      </el-form-item>
      <el-form-item label="申请人部门"   required>
        <el-input v-model="rowData.departName" disabled></el-input>
      </el-form-item>
      <el-form-item label="申请人电话"   required>
        <el-input v-model="rowData.operatorPhone" must="申请人电话"></el-input>
      </el-form-item>
      <el-form-item label="项目类型" required>
         <el-select v-model="rowData.byProjectType" filterable placeholder="请选择">
          <el-option v-for="item in byProjectTypes" :key="item.label" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 被配套项目编号 (弹出框)-->
      <el-form-item  label="被配套项目编号">
        <!-- must="被配套项目编号" -->
        <el-select
          v-model="rowData.byProjectCode"
          filterable
          remote
          :remote-method="projectCodeMethod"
          :default-first-option="true"
          :loading="loading"
          
          :disabled="!isWrite"
          @change="projectCodeSuccess"
        >
          <el-option
            v-for="item in projectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <i @click="openProjectCode()" v-if="isWrite" class="el-icon-search sousuo"></i>
      </el-form-item>

      <el-form-item label="被配套项目名称"  >
         <!-- must="被配套项目名称" -->
        <el-input
          :readonly="!isWrite"
          :class="{'global_writeinput' : isWrite}"
         
          v-model="rowData.byProjectName"
        ></el-input>
      </el-form-item>
      <el-form-item label="被配套项目总金额"  >
        <el-input
          :readonly="!isWrite"
          :class="{'global_writeinput' : isWrite}"
          
          v-model="rowData.byProjectMoney"
          
        ></el-input>
      </el-form-item>
      <el-form-item  label="配套项目编号">
        <!-- must="配套项目编号" -->
        <el-select
          v-model="rowData.projectCode"
          filterable
          remote
          :remote-method="projectCodeMethod"
          :default-first-option="true"
          :loading="loading"
          :disabled="!isWrite"
          @change="projectCodeSuccess"
        >
          <el-option
            v-for="item in projectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <i @click="openProjectCode()" v-if="isWrite" class="el-icon-search sousuo"></i>
      </el-form-item>
      <el-form-item label="配套项目名称" >
        <el-input
          :readonly="!isWrite"
          :class="{'global_writeinput' : isWrite}"
          
          v-model="rowData.projectName"
          
        ></el-input>
      </el-form-item>
      <el-form-item label="配套资金总金额"  >
        <el-input
          :readonly="!isWrite"
          :class="{'global_writeinput' : isWrite}"
          v-model="rowData.projectSummoney"
        ></el-input>
      </el-form-item>
      <el-form-item label="已配套金额" required >
        <el-input
          :readonly="!isWrite"
          :class="{'global_writeinput' : isWrite}"
          must="已配套金额"
          v-model="rowData.yetProjectMoney"
          
        ></el-input>
      </el-form-item>
      <el-form-item label="本次配套金额" required >
        <el-input
          :readonly="!isWrite"
          :class="{'global_writeinput' : isWrite}"
          must="本次配套金额"
          v-model="rowData.projectMoney"
          
        ></el-input>
      </el-form-item>
      <el-form-item label="资金性质" required>
         <el-select v-model="rowData.moneyNature" filterable placeholder="请选择">
          <el-option v-for="item in moneyNatures" :key="item.label" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="开始日期"   required>
        <!-- <el-input v-model="rowData.projectStartdate" @change="dateChange()"></el-input> -->
            <el-date-picker
            v-model="rowData.projectStartdate"
            format="yyyy - MM - dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="开始日期"
            @change="dateChange()"
          ></el-date-picker>
      </el-form-item>
       <el-form-item label="结束日期"   required>
        <!-- <el-input v-model="rowData.projectEnddate" @change="dateChange()"></el-input> -->
        <el-date-picker
            v-model="rowData.projectEnddate"
            format="yyyy - MM - dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="结束日期"
            @change="dateChange()"
          ></el-date-picker>
      </el-form-item>
      <el-form-item label="原项目资金属性"   required>
        <el-select v-model="rowData.moneyAttribute" filterable placeholder="请选择">
          <el-option v-for="item in moneyAttributes" :key="item.label" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="其他资金属性说明"   required style="width:50%">
        <el-input v-model="rowData.otherMoneyRemark" ></el-input>
      </el-form-item>
     <el-form-item label="备注" required style="width:75%">
        <el-input v-model="rowData.memo" ></el-input>
      </el-form-item>
     
    </el-form>

    <!-- 基本信息 table-->
    <div v-show="active==0" class="circle_content" style="margin-top:20px">
      <div class="tops TabButton tabbtn_list">
        <span class="eltabelHeader-title">配套资金出处</span>
        <div class="topsBtn">
          <el-button
            class="buttons"
            type="primary"
            v-show="isWrite"
            @click="Adds(0)"
            icon="el-icon-circle-plus-outline"
          >增行</el-button>
          <el-button
            class="buttons"
            type="primary"
            v-show="isWrite"
            @click="removeRow(0)"
            icon="el-icon-circle-close"
          >删行</el-button>
          <el-button
            class="buttons"
            type="primary"
            v-show="isWrite"
            @click="copy(0)"
            icon="el-icon-document-copy"
          >复制</el-button>
        </div>
      </div>
      <el-table
        ref="xTable"
        :data="rowData.financeDataAssortDetails"
        style="width: 100%;"
        height="200px"
        border
        :show-overflow-tooltip="true"
        @select="selects"
        @select-all="selectAll"
        @selection-change="MonthlyBonusForm"
       
      >
        <el-table-column type="index" label="序号" width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index+ 1}}</span>
          </template>
        </el-table-column>
        <!-- 全选 -->
        <el-table-column type="selection" align="center" width="60"></el-table-column>
        <!-- 拨付资金时间 -->
        <el-table-column prop="moneyDate" align="center" label="拨付资金时间" width="180">
          <template slot-scope="scope">
            <el-date-picker
            v-model="scope.row.moneyDate"
            format="yyyy - MM - dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="拨付资金时间"
          ></el-date-picker>
          </template>
        </el-table-column>
        <!-- 部门树形下拉 -->
        <el-table-column prop="departName" align="center" label="部门">
          <template slot-scope="scope">            
             <treeselect clearable  v-model="scope.row.departName" :disable-branch-nodes="false" :show-count="false" :multiple="false" :options="departData"  placeholder="请选择" />
          </template>
        </el-table-column>
        <el-table-column prop="projectCode" align="center" label="项目编号" >
          <template >            
              <el-select
                v-model="rowData.projectCode"
                filterable
                remote
                :remote-method="projectCodeMethod"
                :default-first-option="true"
                :loading="loading"
                :disabled="!isWrite"
                @change="projectCodeSuccess"
              >
                <el-option
                  v-for="item in projectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
            </el-select>
            
            <i @click="openProjectCode()" v-if="isWrite" class="el-icon-search sousuo"></i>
          </template>
        </el-table-column>
        <el-table-column prop="projectName" align="center" label="项目名称" >
          <template slot-scope="scope">            
            <el-input v-model="scope.row.projectName" ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="projectGroup" align="center" label="项目组长" >
          <template slot-scope="scope">            
            <el-input v-model="scope.row.projectGroup" ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="budgetSubjectName" align="center" label="预算科目">
          <template >            
              <el-select
                v-model="rowData.budgetSubjectName"
                filterable
                remote
                :remote-method="projectCodeMethod"
                :default-first-option="true"
                :loading="loading"
                :disabled="!isWrite"
                @change="projectCodeSuccess"
              >
                <el-option
                  v-for="item in projectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
            </el-select>
            <i @click="openProjectCode()" v-if="isWrite" class="el-icon-search sousuo"></i>
          </template>
        </el-table-column>
        <el-table-column prop="projectMoney" align="center" label="本次配套金额">
          <template slot-scope="scope">            
            <el-input v-model="scope.row.projectMoney" type="number" min="0"></el-input>
          </template>
        </el-table-column>
        
      </el-table>
    </div>
   
    
    <!-- 附件 -->
    <div v-show="active==1" class="circle_content" style="margin-top:20px">
      <!-- <attachementList :attachementList="attachementList" ref="fujian"></attachementList> -->
        <attachment-list ref="attachmentDara" :attachDatas='attachmentListdata' :isWrite='isWrite'></attachment-list>
    </div>
    <!-- detalistFooters -->
    <div class="operationBtn">
      <el-button style="margin-top: 12px;" type="primary" @click="Submission(0)">暂存</el-button>
      <el-button style="margin-top: 12px;" type="primary" v-show="isWrite" @click="Submission(1)">保存</el-button>
      <el-button style="margin-top: 12px;" type="primary" v-show="isWrite" @click="Submission(2)">提交</el-button>
      <el-button style="margin-top: 12px;" type="primary" @click="pre" v-show="active != 0">上一步</el-button>
      <el-button style="margin-top: 12px;" type="primary" @click="next" v-show="active != arr.length-1">下一步</el-button>
      <el-button style="margin-top: 12px;" type="primary" @click="close()">关闭</el-button>
    </div>
  </div>
</template>
  <script>
// import shenpiyijian from '@/yiyon/public/more-Approval.vue'//审批意见
// import liucheng from '@/yiyon/public/more-processView.vue'//流程查看
// import projectLevel from "@/yiyon/public/more-projectName.vue";//课题编码
// import pay from '@/yiyon/public/more-fundBudget.vue'//预算科目
// import renyuan from '@/yiyon/public/more-departmentSx.vue'//预算部门
import AttachmentList from '@/yiyon/public/more-AttachmentList.vue' //附件
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components:{
    AttachmentList,
    Treeselect
  },
  data() {
    return {
      rowData: {}, //新数据集合
      form: {
        id: ""
      },
      requestURL:'/finance/financeDataAssort',//接口地址
      // rowData.financeDataAssortDetails: [],//调整明细集合
      contents: [], //调整明细选中数据
      active: 0, //下一步下标
      arr: ["配套资金申请明细", "附件上传"], //导航名称
      // project_types: this.$util.getDictData('dict_project_type'), //项目类型 dict_project_type 
      byProjectTypes: this.$util.getDictData('dict_project_type_assort'), //项目类型 dict_project_type_assort 
      moneyNatures: this.$util.getDictData('dict_money_nature'), //资金性质 
      moneyAttributes: this.$util.getDictData('dict_money_attribute'), //原项目资金属性       
      departData:[], //经办部门
      
      attachmentListdata:[],//附件数据
      projectOptions: [], //课题编码下拉
      busiIdOptions: [], //预算科目下拉
      budgetDepartnameoptions: [], //预算部门下拉
      isWrite: true, //查看审批权限
      isAudit: false, //是否审批
      dict_adjust_type: this.$util.getDictData("dict_adjust_type"), //调整类型dict_adjust_type
      loading: false, //加载状态（模糊搜索）
      oldarr: [],
      ApprovalSees: "配套资金申请单",
      remoteMethodIndexs: 0, //修改预算名称的下标
      procInsId: "", //流程查看id
      switchIndex: 0, //调整明细的 弹框修改的下标
      options: [],
      //业务事项
      billType: "ZT",
      printId: "", //打印id
      paymoneyReissue: "" //应支付金额合计
    };
  },
  created() {
    //获取部门数据
    this.getDepartData()
    //获取总的数据
    this.getData()
  },
  mounted() {},
  methods: {
    //获取部门树形结构数据
    getDepartData(){
       let text={
        label: "请选择",
        value: "",
        id:'',
      }
       //经办部门
      this.$http.get('/datas/depart/selecttree') .then(res=> {
        console.log(res.data.data,"-----------this.departData")
        this.departData=res.data.data;
        this.departData.unshift(text);
      })
    },
    //获取数据
    getData(){
      var url =`${this.requestURL}/get`;
      //表头修改进入    
      if (this.$parent.modify == "modify") {
        var arr = this.$parent.selectedData;
        url = `${this.requestURL}/get?id=${arr[0].id}`;
        // url = "/finance/financeCreditBusiness/get?id=" + arr[0].id + "";
      }
      //行内修改进入
      if (this.$parent.modify == "modifys") {
        var arr = this.$parent.modifyId;
        url = `${this.requestURL}/get?id=${arr}`;
      }
      if (this.$parent.modify == "See") {
        this.isWrite = false;
        var arr = this.$parent.selectedData;
        this.printId = arr[0].id;
        url = `${this.requestURL}/get?id=${arr[0].id}`;

      }
      if (this.$parent.modify == "Sees") {
        this.isWrite = false;
        var arr = this.$parent.modifyId;
        // console.log(arr,"------------------arrID")
        //获取打印的id
        this.printId = arr;
        url = `${this.requestURL}/get?id=${arr}`;
        // console.log(url,"------------------url")

      }
      if (this.$parent.modify == "copy") {
        var arr = this.$parent.selectedData;
        url = `${this.requestURL}/get?id=${arr[0].id}`;

      }
      if (this.$parent.modify == "Approval") {
        this.isWrite = false;
        this.isAudit = true;
        var arr = this.$parent.modifyId;
        url = `${this.requestURL}/get?id=${arr}&auditFlag=1`;
        // url = "/finance/financeCreditBusiness/get?id=" + arr + "&auditFlag=1";
      }
      this.$http
        .get(url)
        .then(res => {
          this.rowData = res.data.data;
          this.rowData.departName = this.$util.getDictTitle("dict_depart",this.rowData.departId );
          this.rowData.operatorName = this.$util.getDictTitle("dict_user",this.rowData.operator );
           //附件
          this.attachmentListdata = res.data.data.dateAttachment; 
          // console.log(this.rowData,'----------rowData')
          // this.rowData.financeDataAssortDetails = res.data.data.financeDataAssortDetails
          // console.log(this.rowData.financeDataAssortDetails)
          // this.form.id = res.data.data.id;//审批用单据id
          //表单金额转千分符
          // this.rowData.moneyFinancial = this.$util.fmtMoney(this.rowData.moneyFinancial, 2)
          // this.rowData.moneySelf = this.$util.fmtMoney(this.rowData.moneySelf, 2)
          // this.rowData.moneyBudget = this.$util.fmtMoney(this.rowData.moneyBudget, 2)
          // for (let i = 0; i < this.rowData.financeDataAssortDetails.length; i++) {
          //   this.rowData.financeDataAssortDetails[i].indexs = i;
          //   //调整明细金额转千分符
          //   if (
          //     this.rowData.financeDataAssortDetails[i].departId != "" &&
          //     this.rowData.financeDataAssortDetails[i].departId != null
          //   ) {
          //     this.rowData.financeDataAssortDetails[
          //       i
          //     ].departName = this.$util.getDictTitle(
          //       "dict_depart",
          //       this.rowData.financeDataAssortDetails[i].departId
          //     );
          //   } else {
          //     this.rowData.financeDataAssortDetails[i].departName = "";
          //   }
          //   this.rowData.financeDataAssortDetails[i].moneyBefore = this.$util.fmtMoney(
          //     this.rowData.financeDataAssortDetails[i].moneyBefore,
          //     2
          //   );
          //   this.rowData.financeDataAssortDetails[i].moneyBeforeUsable = this.$util.fmtMoney(
          //     this.rowData.financeDataAssortDetails[i].moneyBeforeUsable,
          //     2
          //   );
          //   this.rowData.financeDataAssortDetails[i].moneyAdjust = this.$util.fmtMoney(
          //     this.rowData.financeDataAssortDetails[i].moneyAdjust,
          //     2
          //   );
          //   this.rowData.financeDataAssortDetails[i].moneyAfter = this.$util.fmtMoney(
          //     this.rowData.financeDataAssortDetails[i].moneyAfter,
          //     2
          //   );
          //   this.rowData.financeDataAssortDetails[i].moneyAfterUsable = this.$util.fmtMoney(
          //     this.rowData.financeDataAssortDetails[i].moneyAfterUsable,
          //     2
          //   );
          // }
          
          

          //调整明细 id转换
         
          //默认1行
          if (this.rowData.financeDataAssortDetails.length == 0) {
            this.Adds(0);
          }
        })
        .catch(err => {
          return err;
        });
    },
    //打印
    clickprint() {
      console.log("clickPrint" + this.printId);
      let routeUrl = this.$router.resolve({
        path: "/functionDepartPrint",
        query: {
          id: this.printId,
          paymoneyReissue: this.paymoneyReissue
        }
      });

      window.open(routeUrl.href, "_blank");
    },
    //保存和提交更改数据格式
    Submission(types) {
      
      const that = this;
      let saveFlag = true;
      let submitAudit = "";
      var committext = "",flagtext='';
      if(types==0){ //暂存
        flagtext=-2;
      }
      if (types == 1) { //保存
        flagtext= 0;
      }
      if(types == 2){ //提交
        flagtext=0;
        committext=true;
      }
      var tableDatas = {};
      var cloneArray = this.rowData; 
      cloneArray.dateAttachment =this.$refs.attachmentDara.attachData;
      tableDatas = this.$util.deepClone(cloneArray);
      
      if(this.rowData.financeDataAssortDetails){
        for (let i = 0; i < tableDatas.financeDataAssortDetails.length; i++) {
          //金额
          if (tableDatas.financeDataAssortDetails[i].projectMoney === "" || tableDatas.financeDataAssortDetails[i].projectMoney == null
          ) {
            tableDatas.financeDataAssortDetails[i].projectMoney = "";
          } else {
            tableDatas.financeDataAssortDetails[i].projectMoney = this.$util.delcommafy(tableDatas.financeDataAssortDetails[i].projectMoney);
          }
        }
      }
    
      console.log(tableDatas,"------------------tableDatas")
      if (types == 0) { //暂存
        tableDatas.audit =flagtext;
        //校验是否为必填项
        saveFlag = this.$util.mustsaveFun(saveFlag, this);
        if (!saveFlag) {
          this.$confirm("有必填项没有填写，是否暂存?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            this.savaDate(tableDatas,types);
          })
          .catch(() => {});
        } else {
          this.savaDate(tableDatas,types);
        }
      }
      if (types == 1) { //保存
        saveFlag = this.$util.mustFun(saveFlag, this.$parent.modify, that);
        if (!saveFlag) {
          return false;
        }
        tableDatas.audit =flagtext;

        this.savaDate(tableDatas, types);
      }
      if (types == 2) { //提交
        saveFlag = this.$util.mustFun(saveFlag, this.$parent.modify, that);
        if (!saveFlag) {
          return false;
        }
        tableDatas.audit =flagtext;
        tableDatas.commit =committext;
        this.savaDate(tableDatas, types);
      }
   
    },
    //保存提交接口
    savaDate(tableDatas, n) {
      console.log(tableDatas,"-----------tableDatas")
      this.loading = true;
      const _this = this;
      this.$http
        .post(`${this.requestURL}/save`, tableDatas)
        .then(res => {
          if (res.data.code == 1) {
            return false;
          }
          if (n == 0) {
            this.$util.CgMsg(_this, "暂存成功");
          }
          if (n == 1) {
            this.$util.CgMsg(_this, "保存成功");
          }
          if (n == 2) {
            this.$util.CgMsg(_this, "提交成功");
          }
          var ids = this.$emit("key");
          var id = ids.$el.offsetParent.id;
          this.$layer.close(id);
          this.$parent.search(1);
        })
        .catch(err => {
          return err;
        });
      this.loading = false;
    },
    Adds(n) {
      if(this.rowData.financeDataAssortDetails==null){
        this.rowData.financeDataAssortDetails=new Array()
      }
      console.log("------------------增行被点击了")
      //新增
      if (n == 0) {
        this.rowData.financeDataAssortDetails.push({          
            "budgetSubjectCode":"",// "(string)预算科目编码", 
            "budgetSubjectName":"" ,//"(string)预算科目", 
            "check":false,// "(boolean)", 
            "departCode":"",// "(string)部门编号", 
            "departName":"",// "(string)部门名称  下拉树形选择", 
            "id":"",// "(string)", 
            "isAudit":"",// "(string)", 
            "mainId":"",// "(string)主表id", 
            "moneyDate":"",// "(string)拨付资金时间", 
            "projectCode":"",// "(string)项目编号", 
            "projectGroup":"",// "(string)项目组长", 
            "projectMoney":null,// "(number)本次配套金额", 
            "projectName":"",// "(string)项目名称"
        });
        if(this.rowData.financeDataAssortDetails){
          for (let i = 0; i < this.rowData.financeDataAssortDetails.length; i++) {
            this.rowData.financeDataAssortDetails[i].indexs = i;
          }
        }
        
      }
      console.log(this.rowData.financeDataAssortDetails,"------------------this.rowData.financeDataAssortDetails")

    },
    removeRow(n) {
      //删行
      if (n == 0) {
        var newData = [],
          t = 1;
        for (let i = 0; i < this.rowData.financeDataAssortDetails.length; i++) {
          if (this.rowData.financeDataAssortDetails[i].switch != undefined) {
            t = 0;
          }
        }
        if (t) {
          this.$message("请选择要删除的数据");
          return false;
        }
        for (let i = 0; i < this.rowData.financeDataAssortDetails.length; i++) {
          if (this.rowData.financeDataAssortDetails[i].switch != false) {
            newData.push(this.rowData.financeDataAssortDetails[i]);
          }
        }
        this.rowData.financeDataAssortDetails = newData;
        // this.monsyA()
        for (let i = 0; i < this.rowData.financeDataAssortDetails.length; i++) {
          this.rowData.financeDataAssortDetails[i].indexs = i;
        }
        this.moneyTotal();
      }
    },
    copy(n) {
      //复制行
      if (n == 0) {
        let newContents = [];
        if (this.contents.length == 0) {
          this.$message("请选择要复制的数据");
          return false;
        }
        for (let i = 0; i < this.contents.length; i++) {
          let text = {
            adjustType: this.contents[i].adjustType, //(string)调整类型(字典: dict_adjust_type)
            billId: "", //(string)单据id
            budgetDepartId: this.contents[i].budgetDepartId, //(string)预算部门(字典: dict_depart)
            budgetDepartname: this.contents[i].budgetDepartname, //预算部门名称
            budgetSubjectCode: this.contents[i].budgetSubjectCode, //(string)预算科目编码
            budgetSubjectId: this.contents[i].budgetSubjectId, //(string)预算科目id
            budgetSubjectName: this.contents[i].budgetSubjectName, //(string)预算科目名称
            id: "", //(string)ID唯一标识
            memo: this.contents[i].memo, //(string)备注
            moneyAdjust: this.contents[i].moneyAdjust, //(number)申请调整金额
            moneyAfter: this.contents[i].moneyAfter, //(number)调整后金额
            moneyAfterLast: this.contents[i].moneyAfterLast, //(number)调整后剩余金额
            moneyAfterUsable: this.contents[i].moneyAfterUsable, //(number)调整后可用预算
            moneyBefore: this.contents[i].moneyBefore, //(number)调整前预算
            moneyBeforeLast: this.contents[i].moneyBeforeLast, //(number)调整前剩余预算
            moneyBeforeUsable: this.contents[i].moneyBeforeUsable //(number)调整前可用预算
          };
          newContents.push(text);
        }
        for (let i = 0; i < newContents.length; i++) {
          this.rowData.financeDataAssortDetails.push(newContents[i]);
        }
        for (let i = 0; i < this.rowData.financeDataAssortDetails.length; i++) {
          this.rowData.financeDataAssortDetails[i].indexs = i;
        }
        this.moneyTotal();
        // this.monsyA()
      }
    },
    MonthlyBonusForm(content) {
      //表格选中数据
      this.contents = content;
    },
    //审批
    Approval() {
      var _this = this;
      this.$util.layerFrameShenpi(
        "审批意见",
        this.$page.Approval,
        "38%",
        "35%",
        _this
      );
    },
    //流程查看
    flow() {
      var _that = this;
      this.procInsId = this.rowData.procInsId;
      // console.log(this.procInsId,"---------this.procInsId")
      this.$util.layerFrameProcess(
        `流程查看-${this.ApprovalSees}`,
        this.$page.ProcessView,
        "50%",
        "65%",
        _that
      );
    },
    remoteMethodIndex(d) {
      this.remoteMethodIndexs = d.indexs;
    },
    budgetSubjectName(query) {
      //input事件
      if (query !== "") {
        this.loading = true;
        let _this = this;
        let url = "datas/budgetsubject/selectPageSubject";
        _this.$http
          .get(url, {
            params: {
              "where.s.LIKE.(name,code)": query,
              limit: 10,
              page: 1,
              documentsType: "ZT",
              projectId:
                _this.rowData.financeDataAssortDetails[_this.remoteMethodIndexs].projectId
            }
          })
          .then(function(res) {
            if (res.data.code == 0) {
              if (res.data.data.length != 0) {
                _this.options = res.data.data.map(item => {
                  return {
                    value: item.id,
                    code: item.code,
                    name: item.name,
                    label: item.code + "/" + item.name
                  };
                });
              } else {
                _this.options = [];
              }
            }
          });
        this.loading = false; ///datas/util/js/peoples
        return false;
      } else {
        this.options = [];
      }
    },
    listss(d) {
      //清空已匹配项
      for (let i = 0; i < this.options.length; i++) {
        if (d.budgetSubjectName == this.options[i].label) {
          d.budgetSubjectName = this.options[i].name; //预算科目
          d.budgetSubjectId = this.options[i].value; //预算科目
          d.budgetSubjectCode = this.options[i].code; //预算科目
        }
      }
      this.budgetFront();
      this.options = [];
    },
    pay(d) {
      var _that = this;
      this.switchIndex = d.indexs;
      this.$util.layerFrameProject(
        "选择预算科目",
        this.$page.fundBudget,
        "55%",
        "600px",
        _that
      );
    },
    budgetFront(d) {
      // budget/execute/getMoneySumBudget
      let datas = {};
      let newArr = [];
      for (let i = 0; i < this.rowData.financeDataAssortDetails.length; i++) {
        if (
          this.rowData.projectId != "" &&
          this.rowData.projectId != null &&
          this.rowData.financeDataAssortDetails[i].budgetDepartId != "" &&
          this.rowData.financeDataAssortDetails[i].budgetDepartId != null &&
          this.rowData.financeDataAssortDetails[i].budgetSubjectId != "" &&
          this.rowData.financeDataAssortDetails[i].budgetSubjectId != null
        ) {
          datas = {
            projectId: this.rowData.projectId,
            budgetDepartId: this.rowData.financeDataAssortDetails[i].budgetDepartId,
            budgetSubjectId: this.rowData.financeDataAssortDetails[i].budgetSubjectId,
            year: this.rowData.year
          };
          newArr.push(datas);
        }
      }
      if (newArr.length == 0) {
        return false;
      }
      this.$http.post("budget/execute/getMoneySumBudgets", newArr).then(res => {
        if (res.data.code != 1) {
          for (let i = 0; i < this.rowData.financeDataAssortDetails.length; i++) {
            for (let q = 0; q < res.data.data.length; q++) {
              if (
                this.rowData.financeDataAssortDetails[i].budgetDepartId ==
                  res.data.data[q].budgetDepartId &&
                this.rowData.financeDataAssortDetails[i].budgetSubjectId ==
                  res.data.data[q].budgetSubjectId
              ) {
                if (
                  res.data.data[q].moneySumBudget == null ||
                  res.data.data[q].moneySumBudget == ""
                ) {
                  this.rowData.financeDataAssortDetails[i].moneyBefore = 0.0;
                  this.rowData.financeDataAssortDetails[i].moneyBeforeUsable = 0.0;
                } else {
                  this.rowData.financeDataAssortDetails[i].moneyBefore = this.$util.fmtMoney(
                    res.data.data[q].moneySumBudget,
                    2
                  );
                  this.rowData.financeDataAssortDetails[
                    i
                  ].moneyBeforeUsable = this.$util.fmtMoney(
                    res.data.data[q].moneyUsable,
                    2
                  );
                }
              }
            }
          }
          this.moneyTotal();
          // console.log(res.data.data)
          // this.rowData.financeDataAssortDetails[i].moneyBefore = this.$util.fmtMoney(res.data.data.moneySumBudget, 2)
          // this.rowData.financeDataAssortDetails[i].moneyBeforeUsable = this.$util.fmtMoney(res.data.data.moneyUsable, 2)
        }
      });
    },
    // 财政资金格式化金额
    moneyFormatter(row, t) {
      if (isNaN(Number(row.moneyAdjust))) {
        this.$message({ type: "warning", message: "请输入正确金额" });
        row.moneyAdjust = "";
      } else {
        if (row.moneyAdjust != "") {
          row.moneyAdjust = this.$util.fmtMoney(row.moneyAdjust, 2);
          this.moneyTotal();
        }
      }
    },
    // 财政资金合计
    moneyTotal(row, t) {
      // moneyBefore
      // moneyBeforeUsable
      // moneyAdjust
      // moneyAfter
      // moneyAfterUsable
      for (let i = 0; i < this.rowData.financeDataAssortDetails.length; i++) {
        this.rowData.financeDataAssortDetails[i].moneyAfter = this.$util.fmtMoney(
          this.$util.delcommafy(this.rowData.financeDataAssortDetails[i].moneyBefore) +
            this.$util.delcommafy(this.rowData.financeDataAssortDetails[i].moneyAdjust),
          2
        );
        this.rowData.financeDataAssortDetails[i].moneyAfterUsable = this.$util.fmtMoney(
          this.$util.delcommafy(this.rowData.financeDataAssortDetails[i].moneyBeforeUsable) +
            this.$util.delcommafy(this.rowData.financeDataAssortDetails[i].moneyAdjust),
          2
        );
      }
      this.$set(
        this.rowData,
        "moneyBudget",
        this.$util.moneyAll(this.rowData.financeDataAssortDetails, "moneyAdjust")
      );
    },
    //表格金额去除格式化
    moneyFocus(row, t) {
      if (t == 1) {
        if (row.moneyBefore != "" && row.moneyBefore != null) {
          row.moneyBefore = this.$util.delcommafy(row.moneyBefore);
        }
      } else if (t == 2) {
        if (row.moneyBeforeUsable != "" && row.moneyBeforeUsable != null) {
          row.moneyBeforeUsable = this.$util.delcommafy(row.moneyBeforeUsable);
        }
      } else if (t == 3) {
        if (row.moneyAdjust != "" && row.moneyAdjust != null) {
          row.moneyAdjust = this.$util.delcommafy(row.moneyAdjust);
        }
      } else if (t == 4) {
        if (row.moneyAfter != "" && row.moneyAfter != null) {
          row.moneyAfter = this.$util.delcommafy(row.moneyAfter);
        }
      } else if (t == 5) {
        if (row.moneyAfterUsable != "" && row.moneyAfterUsable != null) {
          row.moneyAfterUsable = this.$util.delcommafy(row.moneyAfterUsable);
        }
      }
    },
    selects(selection, row) {
      //调整明细为删除加标识
      if (
        row.switch == undefined ||
        row.switch == "undefined" ||
        row.switch == true
      ) {
        row.switch = false;
      } else {
        row.switch = true;
      }
    },
    selectAll(selection) {
      //全选加删除标识
      if (selection != 0) {
        for (let i = 0; i < selection.length; i++) {
          selection[i].switch = false;
        }
      } else {
        for (let i = 0; i < this.rowData.financeDataAssortDetails.length; i++) {
          this.rowData.financeDataAssortDetails[i].switch = true;
        }
      }
    },
    MonthlyBonusForm(content) {
      //选中数据
      this.contents = content;
    },
    // pay(d) { //选择预算科目
    // 	var _that = this
    // 	this.switchIndex = d
    // 	this.$util.layerFrameProject('选择预算科目', pay, '55%', '600px', _that)
    // },
    renderHeader(
      h,
      {
        //表格必填项添加 *
        column,
        $index
      }
    ) {
      //表头添加*
      return h("div", {
        attrs: {
          class: "cell" //ele原来样式
        },
        domProps: {
          innerHTML: column.label + '<span style="color:#F56C6C">* </span>'
        }
      });
    },
    //选择预算部门
    renyuan(d) {
      var _that = this;
      this.switchIndex = d.indexs;
      this.$util.layerFrameProject(
        "选择预算部门",
        this.$page.departmentSx,
        "35%",
        "600px",
        _that
      );
    },
    getDates() {
      //归属年份  范围是当前年份减去系统上线年份2019
      // let myDate = new Date();
      // let year = myDate.getFullYear(); //获取当前年
      // let newyear = year - 2019 + 1;
      // for(let i = 0;i<newyear;i++){
      // 	this.years.push(year - i);
      // }
    },
    next() {
      //下一步
      if (this.active++ > this.arr.length - 2)
        this.active = this.arr.length - 1;
    },
    pre() {
      //上一步
      if (this.active-- < 1) this.active = 0;
    },
    close() {
      //关闭
      this.$parent.search(1);
      var ids = this.$emit("key");
      var id = ids.$el.offsetParent.id;
      this.$layer.close(id);
    },
    // 被配套项目编号
    openProjectCode() {
    //   this.$util.layerFrameProject(
    //     "被配套项目编号",
    //     this.$page.projectName,
    //     "62%",
    //     "600px",
    //     this
    //   );
    },
    //日期修改
      dateChange(){
        let _this=this;
        this.pickerOptions={ //日期禁用
          disabledDate(date) {
            return date.getTime() < new Date(_this.rowData.bussinessDate).getTime() - 86400000;
          }
        }
        if(this.rowData.bussinessDate){
          let billDateBeginText=new Date(this.rowData.projectStartdate).getTime();
          let billDateEndText=new Date(this.rowData.projectEnddate).getTime();
          if(billDateBeginText>billDateEndText){
            this.rowData.billDateBeginText='';
          }
        }
      },
    //课题编码输入模糊搜索
    projectCodeMethod(query) {
      let _this = this;
      if (query !== "") {
        this.loading = true;
        _this.$http
          .get(
            "datas/project/findDatasLimit?where.s.LIKE.(name,code)=" +
              query +
              "&limit=10&page=1&billType=ZT"
          )
          .then(function(res) {
            if (res.data.code == 0) {
              if (res.data.data.length != 0) {
                _this.projectOptions = res.data.data.map(item => {
                  return {
                    value: item.id,
                    label: item.code + "/" + item.name,
                    code: item.code,
                    name: item.name,
                    projectRespoId: item.projectRespoId,
                    projectDepartId: item.projectDepartId,
                    projectTypeId: item.projectTypeId,
                    projectTypeName: item.projectTypeName
                  };
                });
              } else {
                _this.projectOptions = [];
              }
            }
          });
        _this.loading = false;
        return false;
      } else {
        _this.projectOptions = [];
      }
    },
    //课题编码下拉选中值以后触发的事件
    projectCodeSuccess() {
      for (let i = 0; i < this.projectOptions.length; i++) {
        if (this.rowData.projectCode == this.projectOptions[i].value) {
          this.rowData.projectId = this.projectOptions[i].value;
          this.rowData.projectName = this.projectOptions[i].name;
          this.rowData.projectCode = this.projectOptions[i].code;
          this.rowData.focusedDepartId = this.projectOptions[i].projectDepartId;
          this.rowData.focusedDepartName = this.$util.getDictTitle(
            "dict_depart",
            this.projectOptions[i].projectDepartId
          );
          this.rowData.projectTypeId = this.projectOptions[i].projectTypeId;
          this.rowData.projectTypeName = this.projectOptions[i].projectTypeName;
          // this.rowData.projectRespoId = this.projectOptions[i].projectRespoId
          // this.rowData.projectRespoName = this.$util.getDictTitle("dict_user",this.projectOptions[i].projectRespoId)
        }
      }
      this.projectOptions = [];
    },
    //业务事项输入模糊搜索
    busiIdMethod(query) {
      let _this = this;
      if (query !== "") {
        this.loading = true;
        _this.$http
          .get(
            "datas/busisubject/findDatasLimit?where.s.LIKE.(busiName,busiCode)=" +
              query +
              "&limit=10&page=1&billType=ZT"
          )
          .then(function(res) {
            if (res.data.code == 0) {
              if (res.data.data.length != 0) {
                _this.busiIdOptions = res.data.data.map(item => {
                  return {
                    value: item.busiId,
                    label: item.busiCode + "/" + item.busiName,
                    code: item.busiCode,
                    name: item.busiName,
                    budgetSubjectId: item.subjectId,
                    budgetSubjectName: item.subjectName,
                    budgetSubjectDepartid: item.subjectDepartId,
                    budgetSubjectDepart: item.subjectDepartName
                  };
                });
              } else {
                _this.busiIdOptions = [];
              }
            }
          });
        _this.loading = false;
        return false;
      } else {
        _this.busiIdOptions = [];
      }
    },
    //业务事项下拉选中值以后触发的事件
    busiIdSuccess(index) {
      for (let i = 0; i < this.busiIdOptions.length; i++) {
        if (
          this.rowData.financeDataAssortDetails[index].busiName == this.busiIdOptions[i].value
        ) {
          //业务事项id
          this.rowData.financeDataAssortDetails[index].busiId = this.busiIdOptions[i].value;
          //业务事项名称
          this.rowData.financeDataAssortDetails[index].busiName = this.busiIdOptions[i].name;
          //预算科目id
          this.rowData.financeDataAssortDetails[index].budgetSubjectId = this.busiIdOptions[
            i
          ].budgetSubjectId;
          //预算科目名称
          this.rowData.financeDataAssortDetails[index].budgetSubjectName = this.busiIdOptions[
            i
          ].budgetSubjectName;
          //归口部门id
          this.rowData.financeDataAssortDetails[index].focusedDepartId = this.busiIdOptions[
            i
          ].budgetSubjectDepartid;
          //归口部门名称
          this.rowData.financeDataAssortDetails[index].focusedDepartName = this.busiIdOptions[
            i
          ].budgetSubjectDepart;
        }
      }
      this.busiIdOptions = [];
    },
    //预算部门输入模糊搜索
    budgetDepartnamemethod(query) {
      let _this = this;
      if (query !== "") {
        this.loading = true;
        _this.$http
          .get(
            "/datas/depart/selectDepart1?where.s.LIKE.(name,code)=" +
              query +
              "&end=1"
          )
          .then(function(res) {
            if (res.data.code == 0) {
              if (res.data.data.length != 0) {
                _this.budgetDepartnameoptions = res.data.data.map(item => {
                  return {
                    value: item.id,
                    label: item.code + "/" + item.name,
                    name: item.name
                  };
                });
              } else {
                _this.budgetDepartnameoptions = [];
              }
            }
          });
        _this.loading = false;
        return false;
      } else {
        _this.budgetDepartnameoptions = [];
      }
    },
    //预算部门下拉选中值以后触发的事件
    budgetDepartnamesuccess(index) {
      for (let i = 0; i < this.budgetDepartnameoptions.length; i++) {
        if (
          this.rowData.financeDataAssortDetails[index].budgetDepartname ==
          this.budgetDepartnameoptions[i].value
        ) {
          //预算部门id
          this.rowData.financeDataAssortDetails[
            index
          ].budgetDepartId = this.budgetDepartnameoptions[i].value;
          //预算部门名称
          this.rowData.financeDataAssortDetails[
            index
          ].budgetDepartname = this.budgetDepartnameoptions[i].name;
        }
      }
      this.budgetFront();
      this.budgetDepartnameoptions = [];
    },
    // 合计行
    summaryMethod(param) {
      let _this = this;
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(
          item => _this.$util.delcommafy(item[column.property]) * 1
        );
        if (
          column.property == "moneyBefore" ||
          column.property == "moneyBeforeUsable" ||
          column.property == "moneyAdjust" ||
          column.property == "moneyAfter" ||
          column.property == "moneyAfterUsable"
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = _this.$util.fmtMoney(sums[index], 2);
        } else {
          sums[index] = "--";
        }
      });
      return sums;
    }
  },
 
};
</script>

<style scoped="scoped">
.sousuo {
  position: absolute;
  right: 20px;
  top: 25%;
  font-size: 20px;
}
.sousuo2 {
  position: absolute;
  right: 10px;
  top: 21%;
  font-size: 20px;
  z-index: 2;
}
.operationBtn{
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}

</style>

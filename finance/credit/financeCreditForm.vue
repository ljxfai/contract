<template>
  <!-- 授信业务申请单--单据详情 -->
  <div class="table_container" id="table_MonthlyBonusForm">
    <div :active="active" class="step" style="margin-bottom: 10px;">
      <div v-for="(time,index) in arr" :key="index" style="display: inline-block;">
        <div class="lefts">
          <div :class="active == index?'tits_usrr'+index:'tits'+index" @click="active=index"></div>
          <span :style="active == index?'color:red;':'color:#1062d4'" class="left_tits">{{time}}</span>
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
    <el-form ref="form" :model="rowData" label-position="left" inline  class='el-form-search'>
      <el-form-item label="单据编号" >
        <el-input placeholder="保存后自动生成" v-model="rowData.code" disabled></el-input>
      </el-form-item>
      <el-form-item label="单据日期" >
        <el-input v-model="rowData.billDate" disabled></el-input>
      </el-form-item>
      <el-form-item label="申请人" >
        <el-input v-model="rowData.operatorName" disabled></el-input>
      </el-form-item>
      <el-form-item label="申请人部门" >
        <el-input v-model="rowData.departName" disabled></el-input>
      </el-form-item>
      
      <el-form-item label="申请人电话"  required>
        <el-input v-model="rowData.operatorPhone" ></el-input>
      </el-form-item>
       <el-form-item label="申请事由" required style="width:75%">
        <el-input
          :readonly="!isWrite"
          :class="{'global_writeinput' : isWrite}"
          must="申请事由"
          v-model="rowData.reason"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="申请事由" style="float: left;">
        <el-input v-model="rowData.budgetDepartName"></el-input>
      </el-form-item> -->
      <el-form-item label="项目类型" required>
         <el-select v-model="rowData.projectType" filterable placeholder="请选择">
          <el-option v-for="item in project_types" :key="item.label" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名义申请单位" required >
        <el-input v-model="rowData.applyNuit" ></el-input>
      </el-form-item>
      <el-form-item label="授信业务期限" required class="el-form-cell ">
        <div class="el-form-cellcon">
          <el-date-picker
            v-model="rowData.bussinessDate"
            format="yyyy - MM - dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择期限"
            @change="dateChange()"
          ></el-date-picker>
          <!-- <span class="block_span">-</span>
          <el-date-picker
            v-model="searchValue.billDateEnd"
            format="yyyy - MM - dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker> -->
        </div>
      </el-form-item>
      <el-form-item label="授信业务金额" required >
        <el-input v-model="rowData.bussinessMoney" type="number"></el-input>
      </el-form-item>
      <el-form-item label="办理银行" required>
         <el-select v-model="rowData.bankname" filterable placeholder="请选择">
          <el-option v-for="(item,index) in banknameList" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="办理银行联系电话">
        <el-input v-model="rowData.bankphone"></el-input>
      </el-form-item>
      <el-form-item  label="合同编号">
        <!-- must="合同编号" -->
        <el-select
          v-model="rowData.contractCode"
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
      <el-form-item label="合同名称">
        <el-input v-model="rowData.contractName" disabled></el-input>
      </el-form-item>
      <el-form-item label="合同金额">
        <el-input v-model="rowData.contractAmount" disabled></el-input>
      </el-form-item>
      <el-form-item label="合同开始日期">
        <el-input v-model="rowData.contractStartdate" disabled></el-input>
      </el-form-item>
      <el-form-item label="合同结束日期">
        <el-input v-model="rowData.contractEnddate" disabled></el-input>
      </el-form-item>
      <el-form-item label="保证金比例">
         <el-select v-model="rowData.marginPro" filterable placeholder="请选择">
          <el-option v-for="item in marginPros" :key="item.label" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="保证金支付金额" required style="float: left;">
        <!-- 授信支付金额*保证金比例 -->
        <el-input v-model="rowData.marginMoney" disabled :placeholder="rowData.marginPro*rowData.bussinessMoney"></el-input>
      </el-form-item>
     <el-form-item label="备注" style="width:75%">
        <el-input v-model="rowData.memo" ></el-input>
      </el-form-item>
     
    </el-form>

   
    
    <!-- 附件 -->
    <div v-show="active==1" class="circle_content">
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

export default {
  components:{
    AttachmentList,
  },
  data() {
    return {
      rowData: {}, //新数据集合
      form: {
        id: ""
      },
      requestURL:'/finance/financeCreditBusiness',//接口地址

      // rowData.detailList: [],//调整明细集合
      contents: [], //调整明细选中数据
      active: 0, //下一步下标
      arr: ["授信明细", "附件上传"], //导航名称
      project_types: this.$util.getDictData('dict_project_type'), //授权业务类型 dict_project_type        
      banknameList:this.$util.getDictData('dict_bank'),//银行名字下拉
      marginPros:this.$util.getDictData('dict_margin_pro'),//保证金比例下拉 dict_margin_pro
      attachmentListdata:[],//附件数据
      projectOptions: [], //课题编码下拉
      busiIdOptions: [], //预算科目下拉
      budgetDepartnameoptions: [], //预算部门下拉
      isWrite: true, //查看审批权限
      isAudit: false, //是否审批
      dict_adjust_type: this.$util.getDictData("dict_adjust_type"), //调整类型dict_adjust_type
      loading: false, //加载状态（模糊搜索）
      oldarr: [],
      ApprovalSees: "职能处室预算调整单",
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
    this.getData()
  },
  mounted() {},
  methods: {
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
        //获取打印的id
        this.printId = arr;
        url = `${this.requestURL}/get?id=${arr}`;

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
          //附件
          this.attachmentListdata = res.data.data.dateAttachment;     
          
          // this.rowData.detailList = res.data.data.detailList
          // console.log(this.rowData.detailList)
          // this.form.id = res.data.data.id;//审批用单据id
          //表单金额转千分符
          // this.rowData.moneyFinancial = this.$util.fmtMoney(this.rowData.moneyFinancial, 2)
          // this.rowData.moneySelf = this.$util.fmtMoney(this.rowData.moneySelf, 2)
          // this.rowData.moneyBudget = this.$util.fmtMoney(this.rowData.moneyBudget, 2)
          // for (let i = 0; i < this.rowData.detailList.length; i++) {
          //   this.rowData.detailList[i].indexs = i;
          //   //调整明细金额转千分符
          //   if (
          //     this.rowData.detailList[i].departId != "" &&
          //     this.rowData.detailList[i].departId != null
          //   ) {
          //     this.rowData.detailList[
          //       i
          //     ].departName = this.$util.getDictTitle(
          //       "dict_depart",
          //       this.rowData.detailList[i].departId
          //     );
          //   } else {
          //     this.rowData.detailList[i].departName = "";
          //   }
          //   this.rowData.detailList[i].moneyBefore = this.$util.fmtMoney(
          //     this.rowData.detailList[i].moneyBefore,
          //     2
          //   );
          //   this.rowData.detailList[i].moneyBeforeUsable = this.$util.fmtMoney(
          //     this.rowData.detailList[i].moneyBeforeUsable,
          //     2
          //   );
          //   this.rowData.detailList[i].moneyAdjust = this.$util.fmtMoney(
          //     this.rowData.detailList[i].moneyAdjust,
          //     2
          //   );
          //   this.rowData.detailList[i].moneyAfter = this.$util.fmtMoney(
          //     this.rowData.detailList[i].moneyAfter,
          //     2
          //   );
          //   this.rowData.detailList[i].moneyAfterUsable = this.$util.fmtMoney(
          //     this.rowData.detailList[i].moneyAfterUsable,
          //     2
          //   );
          // }
          
          

          //调整明细 id转换
          //默认1行
          if (this.rowData.detailList.length == 0) {
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
      //合计
      if (tableDatas.sumAmount === "" || tableDatas.sumAmount == null)
        {
          tableDatas.sumAmount = "";
        } else {
          tableDatas.sumAmount = this.$util.delcommafy(tableDatas.sumAmount);
        }
      if(this.rowData.detailList){
        for (let i = 0; i < tableDatas.detailList.length; i++) {
          //金额
          if (tableDatas.detailList[i].amount === "" || tableDatas.detailList[i].amount == null
          ) {
            tableDatas.detailList[i].amount = "";
          } else {
            tableDatas.detailList[i].amount = this.$util.delcommafy(tableDatas.detailList[i].amount);
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
      //附件
      // let AttaData = [];
      // for (let i = 0; i < this.$refs.fujian.attachData.length; i++) {
      //   for (let o = 0; o < this.$refs.fujian.attachData[i].data.length; o++) {
      //     if (o != 0) {
      //       AttaData.push(this.$refs.fujian.attachData[i].data[o]);
      //     }
      //   }
      // }

      
      // tableDatas.moneyBudget = this.$util.delcommafy(tableDatas.moneyBudget);
      //提交保存字段标识 submitAudit=0 保存 submitAudit=1 提交
      // tableDatas.submitAudit = submitAudit;
      // if (types == 0) {
      //   //校验是否为必填项
      //   saveFlag = this.$util.mustsaveFun(saveFlag, this);
      //   if (!saveFlag) {
      //     this.$confirm("有必填项没有填写，是否保存?", "提示", {
      //       confirmButtonText: "确定",
      //       cancelButtonText: "取消",
      //       type: "warning"
      //     })
      //       .then(() => {
      //         this.savaDate(tableDatas, types);
      //       })
      //       .catch(() => {});
      //   } else {
      //     this.savaDate(tableDatas, types);
      //   }
      // }
      // if (types == 1) {
      //   saveFlag = this.$util.mustFun(saveFlag, this.$parent.modify, that);
      //   if (!saveFlag) {
      //     return false;
      //   }
      //   this.savaDate(tableDatas, types);
      // }
    },
    //保存提交接口
    savaDate(tableDatas, n) {
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
      //新增
      if (n == 0) {
        this.rowData.detailList.push({
          adjustType: "", //(string)调整类型(字典: dict_adjust_type)
          billId: "", //(string)单据id
          budgetDepartId: this.rowData.budgetDepartId, //(string)预算部门(字典: dict_depart)
          budgetDepartname: this.rowData.budgetDepartName, //预算部门名称
          budgetSubjectCode: "", //(string)预算科目编码
          budgetSubjectId: "", //(string)预算科目id
          budgetSubjectName: "", //(string)预算科目名称
          id: "", //(string)ID唯一标识
          memo: "", //(string)备注
          moneyAdjust: "", //(number)申请调整金额
          moneyAfter: "", //(number)调整后金额
          moneyAfterLast: "", //(number)调整后剩余金额
          moneyAfterUsable: "", //(number)调整后可用预算
          moneyBefore: "", //(number)调整前预算
          moneyBeforeLast: "", //(number)调整前剩余预算
          moneyBeforeUsable: "" //(number)调整前可用预算
        });
        if(this.rowData.detailList){
          for (let i = 0; i < this.rowData.detailList.length; i++) {
            this.rowData.detailList[i].indexs = i;
          }
        }
        
      }
    },
    removeRow(n) {
      //删行
      if (n == 0) {
        var newData = [],
          t = 1;
        for (let i = 0; i < this.rowData.detailList.length; i++) {
          if (this.rowData.detailList[i].switch != undefined) {
            t = 0;
          }
        }
        if (t) {
          this.$message("请选择要删除的数据");
          return false;
        }
        for (let i = 0; i < this.rowData.detailList.length; i++) {
          if (this.rowData.detailList[i].switch != false) {
            newData.push(this.rowData.detailList[i]);
          }
        }
        this.rowData.detailList = newData;
        // this.monsyA()
        for (let i = 0; i < this.rowData.detailList.length; i++) {
          this.rowData.detailList[i].indexs = i;
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
          this.rowData.detailList.push(newContents[i]);
        }
        for (let i = 0; i < this.rowData.detailList.length; i++) {
          this.rowData.detailList[i].indexs = i;
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
      this.$util.layerFrameProcess(
        "流程查看-授信业务申请单",
        this.$page.processView,
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
                _this.rowData.detailList[_this.remoteMethodIndexs].projectId
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
      for (let i = 0; i < this.rowData.detailList.length; i++) {
        if (
          this.rowData.projectId != "" &&
          this.rowData.projectId != null &&
          this.rowData.detailList[i].budgetDepartId != "" &&
          this.rowData.detailList[i].budgetDepartId != null &&
          this.rowData.detailList[i].budgetSubjectId != "" &&
          this.rowData.detailList[i].budgetSubjectId != null
        ) {
          datas = {
            projectId: this.rowData.projectId,
            budgetDepartId: this.rowData.detailList[i].budgetDepartId,
            budgetSubjectId: this.rowData.detailList[i].budgetSubjectId,
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
          for (let i = 0; i < this.rowData.detailList.length; i++) {
            for (let q = 0; q < res.data.data.length; q++) {
              if (
                this.rowData.detailList[i].budgetDepartId ==
                  res.data.data[q].budgetDepartId &&
                this.rowData.detailList[i].budgetSubjectId ==
                  res.data.data[q].budgetSubjectId
              ) {
                if (
                  res.data.data[q].moneySumBudget == null ||
                  res.data.data[q].moneySumBudget == ""
                ) {
                  this.rowData.detailList[i].moneyBefore = 0.0;
                  this.rowData.detailList[i].moneyBeforeUsable = 0.0;
                } else {
                  this.rowData.detailList[i].moneyBefore = this.$util.fmtMoney(
                    res.data.data[q].moneySumBudget,
                    2
                  );
                  this.rowData.detailList[
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
          // this.rowData.detailList[i].moneyBefore = this.$util.fmtMoney(res.data.data.moneySumBudget, 2)
          // this.rowData.detailList[i].moneyBeforeUsable = this.$util.fmtMoney(res.data.data.moneyUsable, 2)
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
      for (let i = 0; i < this.rowData.detailList.length; i++) {
        this.rowData.detailList[i].moneyAfter = this.$util.fmtMoney(
          this.$util.delcommafy(this.rowData.detailList[i].moneyBefore) +
            this.$util.delcommafy(this.rowData.detailList[i].moneyAdjust),
          2
        );
        this.rowData.detailList[i].moneyAfterUsable = this.$util.fmtMoney(
          this.$util.delcommafy(this.rowData.detailList[i].moneyBeforeUsable) +
            this.$util.delcommafy(this.rowData.detailList[i].moneyAdjust),
          2
        );
      }
      this.$set(
        this.rowData,
        "moneyBudget",
        this.$util.moneyAll(this.rowData.detailList, "moneyAdjust")
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
        for (let i = 0; i < this.rowData.detailList.length; i++) {
          this.rowData.detailList[i].switch = true;
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
    // 选择合同编号
    // openProjectCode() {
    //   this.$util.layerFrameProject(
    //     "选择合同编号",
    //     this.$page.projectName,
    //     "62%",
    //     "600px",
    //     this
    //   );
    // },
    //日期修改
      dateChange(){
        let _this=this;
        this.pickerOptions={ //日期禁用
          disabledDate(date) {
            return date.getTime() < new Date(_this.rowData.bussinessDate).getTime() - 86400000;
          }
        }
        if(this.rowData.bussinessDate){
          let billDateBeginText=new Date(this.rowData.bussinessDate).getTime();
          let billDateEndText=new Date(this.rowData.bussinessDate).getTime();
          if(billDateBeginText>billDateEndText){
            this.this.rowData.bussinessDate='';
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
          this.rowData.detailList[index].busiName == this.busiIdOptions[i].value
        ) {
          //业务事项id
          this.rowData.detailList[index].busiId = this.busiIdOptions[i].value;
          //业务事项名称
          this.rowData.detailList[index].busiName = this.busiIdOptions[i].name;
          //预算科目id
          this.rowData.detailList[index].budgetSubjectId = this.busiIdOptions[
            i
          ].budgetSubjectId;
          //预算科目名称
          this.rowData.detailList[index].budgetSubjectName = this.busiIdOptions[
            i
          ].budgetSubjectName;
          //归口部门id
          this.rowData.detailList[index].focusedDepartId = this.busiIdOptions[
            i
          ].budgetSubjectDepartid;
          //归口部门名称
          this.rowData.detailList[index].focusedDepartName = this.busiIdOptions[
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
          this.rowData.detailList[index].budgetDepartname ==
          this.budgetDepartnameoptions[i].value
        ) {
          //预算部门id
          this.rowData.detailList[
            index
          ].budgetDepartId = this.budgetDepartnameoptions[i].value;
          //预算部门名称
          this.rowData.detailList[
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

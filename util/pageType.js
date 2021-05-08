//通用的工具方法

//采购管理
import XESB from '@/yiyon/purchase/lowAmountInstrument/lowAmountInstrumentForm.vue'//小额设备采购

//财务管理
import SXYW from '@/yiyon/finance/credit/financeCreditForm.vue' //授信业务
import ZLJY from '@/yiyon/finance/data/financeDataForm.vue' //资料借阅
import PTZJ from '@/yiyon/finance/fund/financeFundForm.vue' //配套资金申请
import CIF from '@/yiyon/finance/credit/contractIncomeForm.vue' //收款合同
//资金管理
import assetApplyIframe from '@/yiyon/asset/assetApply/form.vue' //资产采购申请单弹框
import noAssetApplyIframe from '@/yiyon/asset/assetApply/form_no.vue' //不列入固定资产采购申请单弹框
import assetChangeAdjustIframe from '@/yiyon/asset/assetChange/adjust/form.vue' //资产调剂申请单弹框

//公共彈框
import Approval from '@/yiyon/public/more-Approval.vue' //审批弹框
import budgetCaption from '@/yiyon/public/more-budgetCaption.vue' //预算-会议费-填表说明
import ProcessView from '@/yiyon/public/more-ProcessView.vue' //流程查看
import contract from '@/yiyon/public/more-contract.vue' //合同弹框
import payee from '@/yiyon/public/more-payee.vue' //收款/单位
import reapply from '@/yiyon/public/more-receptionapply.vue' //公务接待申请单弹框
import incomeexpendituresubject from '@/yiyon/public/more-incomeexpendituresubject.vue' //支出项目弹框
import laborProfile from '@/yiyon/public/more-laborProfile.vue' //劳务人员，姓名弹框
import partnerUnit from '@/yiyon/public/more-partnerUnit'	//对方单位弹窗
import invoiceFrame from '@/yiyon/public/more-invoice.vue'	//发票单号弹窗
import relatedDoc from '@/yiyon/public/more-relatedDocuments.vue'	//关联单据弹窗
import incomeReceipt from '@/yiyon/public/more-incomeReceipt.vue'	//收款单
import expenseplanIframe from '@/yiyon/public/more-expenseplan.vue' //月度用款计划弹框
import requiserIframe from '@/yiyon/public/more-requiser.vue' //请款单
import travelApplyIframe from '@/yiyon/public/more-travelApply.vue' //出差申请单
import project from '@/yiyon/public/more-project.vue' //项目弹框
import budgetSubject from '@/yiyon/public/more-budgetSubject.vue' //预算科目
import projectApproval from '@/yiyon/public/more-projectApproval.vue' //项目立项
import ruleSystemConstruction from '@/yiyon/public/more-ruleSystemConstruction.vue' //制度准则
import attachmentPopup from '@/yiyon/public/more-attachmentPopup.vue' //附件上传/附件查看弹框
import userIframe from '@/yiyon/public/more-user.vue' //人员选择（用户管理）
import userStaffframe from '@/yiyon/public/more-userStaff.vue' //人员选择（人员档案）
import assetsEntrusted2Iframe from '@/yiyon/public/more-assetsEntrusted2.vue' //被委托采购资产
import assetsTypeIframe from '@/yiyon/public/more-assetsType.vue' //资产类别
import storageplaceIframe from '@/yiyon/public/more-storageplace.vue' //存放地点
import assetsCardIframe from '@/yiyon/public/more-assetsCard.vue' //资产卡片
import assetsReduceIframe from '@/yiyon/public/more-assetsReduce.vue' //资产减少明细选择
import importExcel from '@/yiyon/public/more-importXls.vue' //导入下载模板
import materialIframe from '@/yiyon/public/more-material.vue' //存货编码
import priorApprovalIframe from '@/yiyon/public/more-priorApproval.vue' //事前审批单-关联审批单
import assetsDisposalIframe from '@/yiyon/public/more-assetsDisposal.vue' //资产处置单
import moneyPlan from '@/yiyon/public/more-moneyPlan.vue' //执行计划-选择计划模板
import accountsubjectIframe from '@/yiyon/public/more-accountsubject.vue' //会计科目档案
import expenseIframe from '@/yiyon/public/more-expensePage.vue' //报销单选择
import depart from '@/yiyon/public/more-depart.vue' //选择部门
import oilcardIframe from '@/yiyon/public/more-oilcard.vue' //油卡
import licensePlateNumber from '@/yiyon/public/more-licensePlateNumber.vue'	//车牌号选择
import carstatemaintainIframe from '@/yiyon/public/more-carstatemaintain.vue' //车辆状态维护
import materialBillMainIframe from '@/yiyon/public/more-materialBillMain.vue' //存货入库单界面
import receivablesaccountIframe from '@/yiyon/public/more-receivablesaccount.vue' //收款账户档案
import moduleSelectIframe from '@/yiyon/public/more-moduleSelect.vue' //常用功能
import allAuditListIframe from '@/yiyon/public/more-allAuditList.vue' //待审批任务
import oldallAuditListIframe from '@/yiyon/public/more-oldallAuditList.vue' //已审批任务
import daibanIframe from '@/yiyon/public/index-daiban.vue' //我的待办
import indexSubIframe from '@/yiyon/public/more-indexSub.vue' //待提交
import indexMyPageIframe from '@/yiyon/public/more-indexMyPage.vue' //我的单据
import indexContentIframe from '@/yiyon/public/more-indexContent.vue' //我的合同
import indexAssetsCardIframe from '@/yiyon/public/more-indexAssetsCard.vue' //我的资产
import notifyIframe from '@/yiyon/public/more-notifyIframe.vue' //通知公告详情
import materialImplementIframe from '@/yiyon/public/more-materialImplement.vue' //存货存量表

export default {

  XESB,

    SXYW,//授信业务
    ZLJY,
	PTZJ,
  CIF,
	assetApplyIframe,//资产采购申请单弹框
	noAssetApplyIframe,//不列入固定资产采购单
	assetChangeAdjustIframe,//资产调剂申请单
	moneyPlan,
    Approval,
	ProcessView,
	contract,
	payee,
	reapply,
	incomeexpendituresubject,
	laborProfile,
	partnerUnit,
	invoiceFrame,
	relatedDoc,
	expenseplanIframe,
	requiserIframe,
	travelApplyIframe,
	project,
	budgetSubject,
	projectApproval,
	ruleSystemConstruction,
	attachmentPopup,
	userIframe,
	userStaffframe,
	assetsEntrusted2Iframe,
	assetsTypeIframe,
	storageplaceIframe,
	assetsCardIframe,
	assetsReduceIframe,
	incomeReceipt,
	importExcel,
	materialIframe,
	priorApprovalIframe,
	assetsDisposalIframe,
	accountsubjectIframe,
	expenseIframe,
	depart,
	oilcardIframe,
	licensePlateNumber,
	carstatemaintainIframe,
	materialBillMainIframe,
	receivablesaccountIframe,
	moduleSelectIframe,
	allAuditListIframe,
	oldallAuditListIframe,
	daibanIframe,
	indexSubIframe,
	indexMyPageIframe,
	indexContentIframe,
	indexAssetsCardIframe,
	notifyIframe,
	materialImplementIframe,
	budgetCaption
}

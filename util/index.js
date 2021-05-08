//通用的工具方法
var _this //定义全局_this,获取全局this
export default {

  //获取字典的数据  needArray状态索引值，可以直接获取需要的状态
  getDictData: function (dict_name, needArray) {
    var datas = [];
    var data = localStorage.getItem("dict:" + dict_name);
    if (data != null) {
      data = eval('(' + data + ')');
    }
    if (!needArray) {
      for (var key in data) {
        datas.push({
          value: key,
          label: data[key]
        });
      }
    } else {
      needArray.forEach(function (val, i) {
        for (var key in data) {
          if (val == key) {
            datas.push({
              value: key,
              label: data[key]
            });
          }
        }
      })
    }
    return datas;
  },
  //字典值转换成标题(每一个key对应得value值。eg:ZFJZCG: "政府集中采购"，则返回"政府集中采购")
  getDictTitle: function (dict_name, value, defaultv) {
    if (value === "") {
      return ""
    }
    var data = localStorage.getItem("dict:" + dict_name);
    if (data != null) {
      data = eval('(' + data + ')');
    }
    for (var key in data) {
      if (value == key) {
        return data[key];
      }
    }
    if (typeof (defaultv) !== 'undifined') {
      return defaultv;
    }
    return value == null ? '' : value;
  },
  //字典标题转换成值
  getDictValue: function (dict_name, title, defaultt) {
    var data = localStorage.getItem("dict:" + dict_name);
    if (data != null) {
      data = eval('(' + data + ')');
    }
    for (var key in data) {
      if (title == data[key]) {
        return key;
      }
    }

    if (typeof (defaultt) !== 'undifined') {
      return defaultt;
    }
  },
  //获取常量值
	// const_name 常量标识
  getConstValue: function (const_name, defaultt) {
    var data = localStorage.getItem("dict:CONST");
    if (data != null) {
      data = eval('(' + data + ')');
    }

    data = data[const_name];
    if (data) {
      return data;
    }
    if (typeof (defaultt) !== 'undifined') {
      return defaultt;
    }
  },
  // 表单提交
  postTo: function (url, method, searchKey) {
    var s = '<form id="tempform" action="' + url + '" method="' +
      (method || 'post') + '">';
    // for (var name in searchKey) {
    //   s += '<input type="hidden" name="' + name + '" value="' +
    //     searchKey[name] + '"/>';
    // }
    s += '</form>';
    $(s).appendTo('body').submit();
    $('#tempform').remove();
  },
	splits(_this,d,dict){
		if(d == "" || d == null){
			return ""
		}
		let one = d.substr(0,1)
		if(one == ","){
			d = d.substr(1)
		}
		if(d == ""){
			return ""
		}else{
			let arr = d.split(",")
			let t = ""
			for(let i = 0 ; i < arr.length;i++){
				if(arr[i] != "" && arr[i] != null){
					t += _this.$util.getDictTitle(dict,arr[i]) + ','
				}
			}
			return t
		}
	},
  //导出文件
  exportFile: function (url, ids, params) {
    if (typeof (params) == 'undifined') {
      params = {};
    }
    if (typeof (ids) !== 'undifined' || ids != '') {
      params['ids'] = ids;
    }
    this.postTo(url, 'get', params);
  },
  //预算的必填控制 modify=1 校验所有数据 modify=0 校验当前行数据
  mustFunBudget: function (saveFlag, index, that) {
    saveFlag = true
    let thatDom = that.$el
    let msg = null;
    let $table = null;
    if(index == 'all') {
      $table = $(thatDom).find('*[must]') //列表全部保存
    } else {
      $table = $($(thatDom).find('tbody').find('tr')[index]).find('*[must]') //行内保存
    }
    $table.each(function (i, v) {
      var sw = $(this).attr("musts") //是否必填的判断
      $(this).removeClass('backred');
      $(this).find('input').removeClass('backred');
      // $(this).find('div').removeClass('backred');
      if (sw == 0 || sw == undefined) {
        // console.log($(this).attr('must'))
        msg = $(this).attr('must');
        // let mark = msg.slice(0, 1);
        // msg = msg.substr(1); //删除提示信息的第一个字符
        if ($(this).hasClass('el-select--mini') || $(this).hasClass('el-date-editor--date')) {
          if ($(this).find('input').val() == '') {
            $(this).find('input').parents(".circle_content").attr('actives', "1")
            $(".circle_content").each(function (i) {
              if ($(this).attr('actives') == 1) {
                // $(".step").attr("active",i)
                that.active = i
                $(this).attr('actives', "0")
                return false
              }
            })
            $(this).find('input').addClass('backred');
            $(this).find('input').focus()
            that.$message({
              dangerouslyUseHTMLString: true,
              message: '请填写' + msg,
              type: 'warning',
              duration: 900
            });
            saveFlag = false;
            return false;
          } else {
            $(this).find('input').removeClass('backred');
          }
        }else if($(this).hasClass('vue-treeselect')){
          let valtext=$(this).find('.vue-treeselect__single-value').html()
          if (valtext== '' || valtext== null || valtext== undefined) {
            $(this).find('input').addClass('backred');
            that.$message({
              dangerouslyUseHTMLString: true,
              message: '请填写' + msg,
              type: 'warning',
              duration: 900
            });
            saveFlag = false;
            return false;
          }else{
            $(this).find('input').removeClass('backred');
          }
        } else {
          if ($(this).val() == '') {
            $(this).parents(".circle_content").attr('actives', "1")
            // console.log($(this).parents(".circle_content").attr('asd',"asdw"))
            $(".circle_content").each(function (i) {
              if ($(this).attr('actives') == 1) {
                // $(".step").attr("active",i)
                that.active = i
                $(this).attr('actives', "0")
                return false
              }
            })
            $(this).addClass('backred');
            $(this).focus()
            that.$message({
              dangerouslyUseHTMLString: true,
              message: '请填写' + msg,
              type: 'warning',
              duration: 900
            });
            saveFlag = false;
            return false;
          } else {
            $(this).removeClass('backred');
          }
        }
      }
    })
    return saveFlag;
  },
  //明细提交必填控制
  //musts 条件控制 0 非必填 1必填
  mustFun: function (saveFlag, modify, that) {
    saveFlag = true
    let thatDom = that.$el
    let msg = null;
    $(thatDom).find('*[must]').each(function (i, v) {
      var sw = $(this).attr("musts")
      $(this).removeClass('backred');
      $(this).find('input').removeClass('backred');
      // $(this).find('div').removeClass('backred');
      if (sw == 1 || sw == undefined) {
        msg = $(this).attr('must');
        if ($(this).hasClass('el-select--mini') || $(this).hasClass('el-date-editor--date')) {
          if ($(this).find('input').val() == '') {
            $(this).find('input').parents(".circle_content").attr('actives', "1")
            $(".circle_content").each(function (i) {
              if ($(this).attr('actives') == 1) {
                // $(".step").attr("active",i)
                that.active = i
                $(this).attr('actives', "0")
                return false
              }
            })
            $(this).find('input').addClass('backred');
            $(this).find('input').focus()
            that.$message({
              dangerouslyUseHTMLString: true,
              message: '请填写' + msg,
              type: 'warning',
              duration: 900
            });
            saveFlag = false;
            return false;
          } else {
            $(this).find('input').removeClass('backred');
          }
        }else if($(this).hasClass('vue-treeselect')){
          let valtext=$(this).find('.vue-treeselect__single-value').html()
          if (valtext== '' || valtext== null || valtext== undefined) {
            $(this).find('input').addClass('backred');
            saveFlag = false;
          }else{
            $(this).find('input').removeClass('backred');
          }
        } else {
          if ($(this).val() == '') {
            $(this).parents(".circle_content").attr('actives', "1")
            // console.log($(this).parents(".circle_content").attr('asd',"asdw"))
            $(".circle_content").each(function (i) {
              if ($(this).attr('actives') == 1) {
                // $(".step").attr("active",i)
                that.active = i
                $(this).attr('actives', "0")
                return false
              }
            })
            $(this).addClass('backred');
            $(this).focus()
            that.$message({
              dangerouslyUseHTMLString: true,
              message: '请填写' + msg,
              type: 'warning',
              duration: 900
            });
            saveFlag = false;
            return false;
          } else {
            $(this).removeClass('backred');
          }
        }
      }
    })
    return saveFlag;
  },
  //明细保存时验证必填
  mustsaveFun: function (saveFlag,that) {
    let thatDom = that.$el
    $('.backred').removeClass('backred');
    var getOfcus = 1;
    $(thatDom).find('*[must]').each(function (i, v) {
      var sw = $(this).attr("musts")
      $(this).removeClass('backred');
      $(this).find('input').removeClass('backred');
      if (sw == 1 || sw == undefined) {
        if ($(this).hasClass('el-select--mini') || $(this).hasClass('el-date-editor--date')) {
          if ($(this).find('input').val() == '') {
            $(this).find('input').addClass('backred');
            if(getOfcus){
              //获取光标和跳转页签
              $(this).find('input').parents(".circle_content").attr('actives', "1")
              $(".circle_content").each(function (i) {
                if ($(this).attr('actives') == 1) {
                  that.active = i
                  $(this).attr('actives', "0")
                  return false
                }
              })
              $(this).find('input').focus()
              getOfcus = 0
            }
            saveFlag = false;
          } else {
            $(this).find('input').removeClass('backred');
          }
        }else if($(this).hasClass('vue-treeselect')){
          let valtext=$(this).find('.vue-treeselect__single-value').html()
          if (valtext== '') {
            $(this).find('input').addClass('backred');
            saveFlag = false;
          }else{
            $(this).find('input').removeClass('backred');
          }
        } else {
          if ($(this).val() == '') {
            $(this).addClass('backred');
            if(getOfcus){
              //获取光标和跳转页签
              $(this).parents(".circle_content").attr('actives', "1")
              $(".circle_content").each(function (i) {
                if ($(this).attr('actives') == 1) {
                  that.active = i
                  $(this).attr('actives', "0")
                  return false
                }
              })
            	$(this).focus()
            	getOfcus = 0
            }
            saveFlag = false;
          } else {
            $(this).removeClass('backred');
          }
        }
      }
    })
    return saveFlag;
  },
  //去除千分位
  delcommafy: function (num) {
    if (num == null || num == undefined || num == "") {
			num = 0
    }
    num = num.toString();
    num = num.replace(/[ ]/g, ""); //去除空格
    num = num.replace(/,/gi, '');
    return Number(num);
  },
  //千位分隔符  num:金额   fixed:保留几位小数
  //on有值则不可以为负数
  fmtMoney: function (num, fixed, on) {
    if (num === "" || num == undefined || num === null) {
      return ""
    }
    let d = Number(num);
    if (on) {
      if (d < 0) {
        d = 0;
      }
    }
    return d.toFixed(fixed).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  },
  fmtMoneyAll: function (num, fixed, on) {
    //金额控制只能输入数字
    if (isNaN(Number(num))) {
      num = '';
      this.$message({
        type: "info",
        message: "请填写金额",
        duration: 2000
      });
      return false;
    }
    let d = Number(num);
    if (on) {
      if (d < 0) {
        d = 0;
      }
    }
    return d.toFixed(fixed).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  },
  //金额合计
  moneyAll: function (d, v) {
    let y = 0
    for (let i = 0; i < d.length; i++) {
      y += this.delcommafy(d[i][v]);
    }
    return this.fmtMoney(y, 2);
  },
  //金额小写转化大写
  moneyCap: function (money) {
    var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
    var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
    var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
    var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
    //var cnInteger = "整"; //整数金额时后面跟的字符
    var cnIntLast = "元"; //整型完以后的单位
    var maxNum = 999999999999999.9999; //最大处理的数字

    var IntegerNum; //金额整数部分
    var DecimalNum; //金额小数部分
    var ChineseStr = ""; //输出的中文金额字符串
    var parts; //分离金额后用的数组，预定义
    if (money ==="") {
      return "";
    }
    money = parseFloat(money);
    if (money >= maxNum) {
      $.alert('超出最大处理数字');
      return "";
    }
    if (money == 0) {
      //ChineseStr = cnNums[0]+cnIntLast+cnInteger;
      ChineseStr = cnNums[0] + cnIntLast
      //document.getElementById("show").value=ChineseStr;
      return ChineseStr;
    }
    money = money.toString(); //转换为字符串
    if (money.indexOf(".") == -1) {
      IntegerNum = money;
      DecimalNum = '';
    } else {
      parts = money.split(".");
      IntegerNum = parts[0];
      DecimalNum = parts[1].substr(0, 4);
    }
    if (parseInt(IntegerNum, 10) > 0) { //获取整型部分转换
      var zeroCount = 0;
      var IntLen = IntegerNum.length;
      for (var i = 0; i < IntLen; i++) {
        var n = IntegerNum.substr(i, 1);
        var p = IntLen - i - 1;
        var q = p / 4;
        var m = p % 4;
        if (n == "0") {
          zeroCount++;
        } else {
          if (zeroCount > 0) {
            ChineseStr += cnNums[0];
          }
          zeroCount = 0; //归零
          ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
        }
        if (m == 0 && zeroCount < 4) {
          ChineseStr += cnIntUnits[q];
        }
      }
      ChineseStr += cnIntLast;
      //整型部分处理完毕
    }
    if (DecimalNum != '') { //小数部分
      ChineseStr += "零"
      var decLen = DecimalNum.length;
      for (var i = 0; i < decLen; i++) {
        var n = DecimalNum.substr(i, 1);
        if (n != '0') {
          ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
        }
      }
    }
    if (ChineseStr == '') {
      //ChineseStr += cnNums[0]+cnIntLast+cnInteger;
      ChineseStr += cnNums[0] + cnIntLast;
    }
    /* else if( DecimalNum == '' ){
    		        ChineseStr += cnInteger;
    		        ChineseStr += cnInteger;
    		    } */
    if (ChineseStr.charAt(ChineseStr.length - 1) == "元") {
      ChineseStr += "整"
    }
    return ChineseStr;
  },
  //上报周期
  getDate: function () {
    let s = []
    for (var m = 6; m > 0; m--) {
      if (parseInt(m) > 0) {
        //m是 往前推的总月份
        var myDate = new Date();
        // var mytime = myDate.format("yyyy-MM-dd"); //获取当前日期
        var year = myDate.getFullYear(); //获取当前年
        var month = myDate.getMonth() + 3; //获取当前月
        var lowData = ""; //当前年月日往前推m个月后获取到的年月日
        var ylow = parseInt(parseInt(m) / 12); //往前推的总月份换成对应的年数取整
        var mlow = parseInt(m) % 12; //往前推的月数
        if (ylow > 0) {
          year -= ylow; //年要再减一
        } else {
          year = year; //年取当前年份
        }
        if (mlow > month || mlow == month) {
          //往前推的月份大于或等于当前月份，12减去往前推的月份加上现在的月份
          year = year - 1;
          month = 12 - mlow + month;
          if(month<10){
            lowData = year + "0" + month;
          }else{
            lowData = year + "" + month;
          }
        } else {
          //往前推的月份小于当前月份
          month -= mlow;
          if (month < 10) {
            lowData = year + "0" + month;
          } else {
            lowData = year + "" + month;
          }
        }
        s.unshift(lowData);
      } else {}
    }
    return s
  },
  //当前月份退后
  getDateMonth: function () {
    let s = []
    for (var m = 6; m > 0; m--) {
      if (parseInt(m) > 0) {
        //m是 往前推的总月份
        var myDate = new Date();
        // var mytime = myDate.format("yyyy-MM-dd"); //获取当前日期
        var year = myDate.getFullYear(); //获取当前年
        var month = myDate.getMonth() + 1; //获取当前月
        var lowData = ""; //当前年月日往前推m个月后获取到的年月日
        var ylow = parseInt(parseInt(m) / 12); //往前推的总月份换成对应的年数取整
        var mlow = parseInt(m) % 12; //往前推的月数
        if (ylow > 0) {
          year -= ylow; //年要再减一
        } else {
          year = year; //年取当前年份
        }
        if (mlow > month || mlow == month) {
          //往前推的月份大于或等于当前月份，12减去往前推的月份加上现在的月份
          year = year - 1;
          month = 12 - mlow + month;
          if(month<10){
            lowData = year + "0" + month;
          }else{
            lowData = year + "" + month;
          }
        } else {
          month -= mlow;
          //往前推的月份小于当前月份
          if (month < 10) {
            lowData = year + "0" + month;
          } else {
            lowData = year + "" + month;
          }

        }
        s.unshift(lowData);
      } else {}
    }
    return s
  },
  //   获取当前月及前六个月
  getNowDate: function () {
    let s = []
    for (var m = 6; m > 0; m--) {
      if (parseInt(m) > 0) {
        //m是 往前推的总月份
        var myDate = new Date();
        // var mytime = myDate.format("yyyy-MM-dd"); //获取当前日期
        var year = myDate.getFullYear(); //获取当前年
        var month = myDate.getMonth() + 2; //获取当前月
        var lowData = ""; //当前年月日往前推m个月后获取到的年月日
        var ylow = parseInt(parseInt(m) / 12); //往前推的总月份换成对应的年数取整
        var mlow = parseInt(m) % 12; //往前推的月数
        if (ylow > 0) {
          year -= ylow; //年要再减一
        } else {
          year = year; //年取当前年份
        }
        if (mlow > month || mlow == month) {
          //往前推的月份大于或等于当前月份，12减去往前推的月份加上现在的月份
          year = year - 1;
          month = 12 - mlow + month;
          lowData = year + "-" + month;
        } else {
          //往前推的月份小于当前月份
          month -= mlow;
          if (month < 10) {
            lowData = year + "0" + month;
          } else {
            lowData = year + "" + month;
          }
        }
        s.unshift(lowData);
      } else {}
    }
    return s
  },
  //毫秒转日期（-）
  changeDate: function (num) {
    if (num == null || num == undefined || num == "") {
			num = 0
    }
    var oDate = new Date(num);
    let oYear = oDate.getYear();
    let oMonth = oDate.getMonth()+1;
    let oDay = oDate.getDate();
    let oTime =oYear +'-'+ oMonth +'-'+ oDay;//最后拼接时间  
    return oTime;  
  },
  //日期格式转化
  // {
  //   "date": 18,
  //   "hours": 17,
  //   "seconds": 42,
  //   "month": 5,
  //   "timezoneOffset": -480,
  //   "year": 120,
  //   "minutes": 32,
  //   "time": 1592472762000,
  //   "day": 4
  // }
  changeDateobj:function(obj){
    let time='';
    if(obj){
      let year=obj.year*1+1900;
      let month=obj.month*1+1;
      let date=obj.date*1;
      if(month<10){
        month='0'+month
      }
      if(date<10){
        date='0'+date
      }
      time=year+'-'+month+'-'+date
    }
    return time
  },
  //加密保存时删除的字段
  deleteObj:function(obj){
    delete obj.page;
    delete obj.orderMap;
    delete obj.whereMap;
    delete obj.whereOrMaps;
    delete obj.joinSqls;
    delete obj.selectSql;
    delete obj.sumFields;
    delete obj.sqlMap;
    delete obj.whereSqls;
    delete obj.whereSql;
    delete obj.whereSql;
    delete obj.logger;
  },
  //Vue-layer 弹框封装
  //t:标题，z:组件 w:宽度 h:高度 that: Vue的THIS  便于操作父级数据
  //需要动态控制弹框大小
  layerFrameSpecial: function (t, z, w, h, that) {
    _this = that
    that.$layer.iframe({
      content: {
        content: z, //传递的组件对象
        parent: that, //当前的vue对象
        data: {} //props
      },
      area: [w, h],
      title: t,
      maxmin: true,
      resize: true,
      fixed: false, //不固定
      shade: false,
      anim: 6,
      // id:"#layerFrame"
    })
  },
  //t:标题，z:组件 w:宽度 h:高度 that: Vue的THIS  便于操作父级数据
  //弹框全屏
  layerFrame: function (t, z, w, h, that) {
    _this = that
    that.$layer.iframe({
      content: {
        content: z, //传递的组件对象
        parent: that, //当前的vue对象
        data: {} //props
      },
      //area: [w, h],
      area: ['99%', '99%'],
      title: t,
      maxmin: true,
      resize: true,
      fixed: false, //不固定
      shade: false,
      anim: 6,
      // id:"#layerFrame"
    })
  },
  //选择字段弹框统一调用这个
  layerFrameProject: function (t, z, w, h, that) {
    _this = that
    that.$layer.iframe({
      content: {
        content: z, //传递的组件对象
        parent: that, //当前的vue对象
        data: {} //props
      },
      area: ['80%', '660px'],
      title: t,
      maxmin: true,
      resize: true,
      fixed: false, //不固定
      shade: false,
      // shade: true,
			// shadeClose: false,
      anim: 6,
    })
  },
	//选择字段弹框统一调用这个
	layerRelatedDoc: function (t, z, w, h, that) {
	  _this = that
	  that.$layer.iframe({
	    content: {
	      content: z, //传递的组件对象
	      parent: that, //当前的vue对象
	      data: {} //props
	    },
	    area: ['30%', '720px'],
	    title: t,
	    maxmin: true,
	    resize: true,
	    fixed: false, //不固定
	    shade: false,
	    // shade: true,
			// shadeClose: false,
	    anim: 6,
	  })
	},
  //流程查看弹框统一调用这个
  layerFrameProcess: function (t, z, w, h, that) {
    _this = that
    that.$layer.iframe({
      content: {
        content: z, //传递的组件对象
        parent: that, //当前的vue对象
        data: {} //props
      },
      area: ['50%', '540px'],
      title: t,
      maxmin: true,
      resize: true,
      fixed: false, //不固定
      shade: false,
      anim: 6,
    })
  },
  //审批弹框统一调用这个
  layerFrameShenpi: function (t, z, w, h, that) {
    _this = that
    that.$layer.iframe({
      content: {
        content: z, //传递的组件对象
        parent: that, //当前的vue对象
        data: {} //props
      },
      area: ['400px', '300px'],
      title: t,
      maxmin: true,
      resize: true,
      fixed: false, //不固定
      shade: false,
      anim: 6,
    })
  },
  //导入弹框统一调用这个
  layerFrameImportXls: function (t, z, w, h, that) {
    _this = that
    that.$layer.iframe({
      content: {
        content: z, //传递的组件对象
        parent: that, //当前的vue对象
        data: {} //props
      },
      area: ['40%', '240px'],
      title: t,
      maxmin: true,
      resize: true,
      fixed: false, //不固定
      shade: false,
      anim: 6,
    })
  },
  //对象数组深度克隆
  deepClone(obj) {
    // let _this=this;
    var result;
    var oClass = {}.toString.call(obj).slice(8, -1);
    if (oClass === "Object") {
      result = {};
    } else if (oClass === "Array") {
      result = [];
    } else {
      return obj;
    }
    for (var key in obj) {
      var copy = obj[key];
      var typeCopy = {}.toString.call(copy).slice(8, -1)
      if (typeCopy == "Object") {
        result[key] = this.deepClone(copy); //递归调用
      } else if (typeCopy == "Array") {
        result[key] = this.deepClone(copy);
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  },
  //计算天数差的函数，通用
  DateDiff: function (sDate1, sDate2) { //sDate1和sDate2是2017-9-25格式
    var aDate, oDate1, oDate2, iDays
    oDate1 = new Date(sDate1).getTime() //转换为9-25-2017格式
    oDate2 = new Date(sDate2).getTime()
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数
    return iDays
  },
  getAll:function(stime,etime){
    //初始化日期列表，数组
    var diffdate = new Array();
    var i=0;
    //开始日期小于等于结束日期,并循环
    while(stime<=etime){
        diffdate[i] = stime;
        //获取开始日期时间戳
        var stime_ts = new Date(stime).getTime();
        //增加一天时间戳后的日期
        var next_date = stime_ts + (24*60*60*1000);
        //拼接年月日，这里的月份会返回（0-11），所以要+1
        var next_dates_y = new Date(next_date).getFullYear()+'-';
        var next_dates_m = (new Date(next_date).getMonth()+1 < 10)?'0'+(new Date(next_date).getMonth()+1)+'-':(new Date(next_date).getMonth()+1)+'-';
        var next_dates_d = (new Date(next_date).getDate() < 10)?'0'+new Date(next_date).getDate():new Date(next_date).getDate();

        stime = next_dates_y+next_dates_m+next_dates_d;
        //增加数组key
        i++;
    }
    return diffdate
  },
  //附件张数修改限制输入正整数
  attachNumChange(value) {
    let r = /^\+?[1-9][0-9]*$/;
    if (r.test(value)) {
      return value
    } else {
      value = '';
      _this.$message({
        type: "warning",
        message: "请填写一个正整数",
        duration: 2000
      });
      return value;
    }
  },
  //预算-人员限制输入正整数
  inputNumInteger(_that,value) {
    let r = /^\d*$/;
    if (r.test(value)) {
      return value
    } else {
      value = '';
      _that.$message({
        type: "warning",
        message: "请填写一个整数",
        duration: 2000
      });
      return false;
    }
  },
  //预算-限制input只能输入大于0的整数或者保留两位数的小数
  inputNumDecimal(_that,value) {
    let r = /^\d+(?:\.\d{1,2})?$/;
    if (r.test(value)) {
      return value
    } else {
      value = '';
      _that.$message({
        type: "warning",
        message: "请填写一个大于0的整数或保留两位数的小数",
        duration: 2000
      });
      return value;
    }
  },
  //限制input输入整数
  inputIntegers(value) {
    let r = /^\d*$/;
    if (r.test(value)) {
      return value
    } else {
      value = '';
      _this.$message({
        type: "warning",
        message: "请填写一个整数",
        duration: 2000
      });
      return false;
    }
  },
  //限制input只能输入大于0的整数或者保留两位数的小数
  inputNumD(value) {
    let r = /^\d+(?:\.\d{1,2})?$/;
    if (r.test(value)) {
      return value
    } else {
      value = '';
      _this.$message({
        type: "warning",
        message: "请填写一个大于0的整数或保留两位数的小数",
        duration: 2000
      });
      return value;
    }
  },
  //数组去重
 unique(arr){
    var newArr = [];
    for(var i = 0; i < arr.length; i++){
        for(var j = i+1; j < arr.length; j++){
            if(arr[i] == arr[j]){
                ++i;
            }
        }
        newArr.push(arr[i]);
    }
    return newArr;
  },
  checkTime(i) {
    if (i < 10) {
      i = '0' + i
    }
    return i
  },
  //将Tue Oct 01 2019 00:00:00 GMT 0800 (中国标准时间)  转正 yyyy-mm-dd 格式
  dataBE(dats) {
    if (dats == "") {
      return ""
    }
    var dates;
    dates = new Date(dats)
    var dateEnd = dates.getFullYear() + '-' + this.checkTime(dates.getMonth() + 1) + '-' + this.checkTime(dates.getDate());
    return dateEnd
  },
  //_this --- this  成功弹框
  CgMsg(_this, d) {
    _this.$message({
      dangerouslyUseHTMLString: true,
      message: d,
      type: 'success'
    });
  },
  //_this --- this  警告
  JgMsg(_this, d) {
    _this.$message({
      dangerouslyUseHTMLString: true,
      message: d,
      type: 'warning'
    });
  },
  //_this --- this  失败
  SbMsg(_this, d) {
    _this.$message({
      dangerouslyUseHTMLString: true,
      type: "info",
      message: d,
      duration: 900
    });
    // _this.$message.error(d);
  },
  //日期格式化
  //times为new Date()格式 , fmt为格式
  // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
  // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
  Format(times, fmt) { //author: meizz
    var o = {
      "M+": times.getMonth() + 1, //月份
      "d+": times.getDate(), //日
      "h+": times.getHours(), //小时
      "m+": times.getMinutes(), //分
      "s+": times.getSeconds(), //秒
      "q+": Math.floor((times.getMonth() + 3) / 3), //季度
      "S": times.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (times.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  //计算月份的第一天和最后一天
  //time 日期,  formate 要转换的格式

  getDataBE(time,formate){
    var firstDay=new Date(time);//这个月的第一天
    var currentMonth=firstDay.getMonth(); //取得月份数
    var nextMonthFirstDay=new Date(firstDay.getFullYear(),currentMonth+1,1);//加1获取下个月第一天
    var dis=nextMonthFirstDay.getTime()-24*60*60*1000;//减去一天就是这个月的最后一天
    var lastDay=new Date(dis);
    firstDay=this.Format(firstDay,formate)
    lastDay=this.Format(lastDay,formate)
    return [firstDay,lastDay]
  },
  //小数相加避免出现多位
  accAdd(arg1, arg2) {
   if(arg1 == undefined || arg1 == null || arg1 == "null" || arg1 == "" || arg1==NaN){
    arg1 = 0;
   }
   if(arg2 == undefined || arg2 == null || arg2 == "null" || arg2 == "" || arg2==NaN){
    arg2 = 0;
   }
      var r1, r2, m, c;
      try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
      try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
      c = Math.abs(r1 - r2);
      m = Math.pow(10, Math.max(r1, r2))
      if (c > 0) {
          var cm = Math.pow(10, c);
          if (r1 > r2) {
              arg1 = Number(arg1.toString().replace(".", ""));
              arg2 = Number(arg2.toString().replace(".", "")) * cm;
          }
          else {
              arg1 = Number(arg1.toString().replace(".", "")) * cm;
              arg2 = Number(arg2.toString().replace(".", ""));
          }
      }
      else {
          arg1 = Number(arg1.toString().replace(".", ""));
          arg2 = Number(arg2.toString().replace(".", ""));
      }
      return (arg1 + arg2) / m
  },
  //小数相减避免出现多位
  numSub(num1, num2) {
    if(num1 == undefined || num1 == null || num1 == "null" || num1 == "" || num1==NaN){
      num1 = 0;
     }
     if(num2 == undefined || num2 == null || num2 == "null" || num2 == "" || num2==NaN){
      num2 = 0;
     }
     var baseNum, baseNum1, baseNum2;
     var precision;// 精度
     try {
      baseNum1 = num1.toString().split(".")[1].length;
     } catch (e) {
      baseNum1 = 0;
     }
     try {
      baseNum2 = num2.toString().split(".")[1].length;
     } catch (e) {
      baseNum2 = 0;
     }
     baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
     precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
     return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
  },
  //小数相乘避免出现多位
  numMulti(num1, num2) {
    if(num1 == undefined || num1 == null || num1 == "null" || num1 == "" || num1==NaN){
      num1 = 0;
     }
     if(num2 == undefined || num2 == null || num2 == "null" || num2 == "" || num2==NaN){
      num2 = 0;
     }
    var baseNum = 0;
    try {
     baseNum += num1.toString().split(".")[1].length;
    } catch (e) {
    }
    try {
     baseNum += num2.toString().split(".")[1].length;
    } catch (e) {
    }
    return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
   },
   //限制input只能输入数字
   yzNumber(value) {
     var text =value;
     text = text.replace(/[^\d.-]/g, ""); //清除“数字”和“.”以外的字符
     text = text.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
     text = text.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
     text = text.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
     if (text.indexOf(".") < 0 && text != "") {
         text = parseFloat(value);
     }
     return text
   },
};


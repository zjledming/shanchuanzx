
import ToastUtil from "./ToastUtil";

const checkFixPhone = (phone) => {
    if (phone != '') {
        var pattern = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
        if (pattern.test(phone) == false) {
            ToastUtil.showShort("请正确填写办公电话!");
            return false;
        } else {
            return true;
        }
    } else {
        ToastUtil.showShort('固定电话不能为空')
        return false;
    }
};
const checkMobile = (mobile) => {
    if (mobile != '') {
        var pattern = /^(((13[0-9]{1})|15[0-9]{1}|18[0-9]{1}|)+\d{8})$/;
        if (pattern.test(mobile) == false) {
            ToastUtil.showShort(`手机号格式不正确`);
            return false;
        } else {
            return true;
        }
    } else {
        ToastUtil.showShort('手机号码不能为空')
        return false
    }
};


//判断字符串是否为空
const IsSpace = (strMain) => { 
	var strComp = strMain;
	try {
		if (strComp == "  " || strComp == "" || strComp == " "
				|| strComp == null || strComp == "null" || strComp.length == 0
				|| typeof strMain == "undefined" || strMain == "undefined") {
			return true;
		} else {
			return false;
		}
	} catch (e) {
		return false;
	}
}

const checkIsNull = (title, content) => {
    if (IsSpace(content)) {
        ToastUtil.showShort(`${title}不能为空`);
        return false;
    } else {
        return true;
    }

};

export {
    IsSpace,
    checkFixPhone,
    checkMobile,
    checkIsNull
};

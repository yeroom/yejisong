const $cmm = {

    /**
     * alert
     * @param txt
     * @param callback
     */
    alert: (txt, callback) => {

        alert(txt);
        !!callback && callback();
    },

    /**
     * ajax
     * @param option
     */
    ajax: options => {

        let _options = {

            method: "POST",
            loading: true,
            isExtr: false,
            dataType: "json",
            header: null,
            error : function(res) {
                $cmm.alert('네트워크 오류가 발생했습니다.');
            }
        };

        // 기본 객체에 파라미터 객체를 추가.
        for(var val in options) {
            if(!$cmm.util.isEmpty(options[val])) {
                _options[val] = options[val];
            }
        }

        // data 초기화
        if(!_options.data) {
            _options.data = {};
        }

        // formdata일 경우
        if(!!_options.formData) {

            _options.enctype = 'multipart/form-data';
            _options.processData = false;
            _options.contentType = false;

            _options.data = _options.formData;
        }

        _options.success = function(data) {

            let resultCode	= data.resultCode;
            let resultMsg	= data.resultMsg;

            if(!!data.length && data.length > 0) {

                resultCode	= data[0].resultCode;
                resultMsg	= data[0].resultMsg;
            }

            if(resultCode === "0000") {

                options.success(data);
            } else if(resultCode === "9990") {

                $cmm.alert('로그인 후 이용가능합니다.', () => {

                    location.href = '/' + data.loginUrl;
                });
            } else {

                if(!_options.errorCallback) {

                    if(!!resultMsg) {

                        $cmm.alert(resultMsg);
                    } else {

                        $cmm.alert('시스템 오류가 발생했습니다.');
                    }
                } else {

                    _options.errorCallback(data);
                }
            }
        };

        $.ajax(_options);
    },

    util: {

        /**
         * 문자열이 공백또는 Null 인지 체크한다.
         * @memberOf $comm.util
         * @param {String} selValue 문자열
         * @returns {Boolean}
         */
        isEmpty : function(selValue) {
            if (selValue == null || typeof (selValue) == "undefined" || selValue === ""
                || selValue === "NULL" || selValue === "null") {
                return true;
            }

            if(typeof (selValue) == "string" && selValue.replace(/ /g, '') === "") {
                return true;
            }

            return false;
        },
    },
};

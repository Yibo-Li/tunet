var request = require('request');
var Hashes = require('jshashes')
var xEncode = require('./xEncode');

function get_err(res)
{
	var p=/E([\d]+)/;
	var arr = p.exec(res);
	var n=0;
	if(arr)
		n=Number(arr[1]);
	var msg=res;
	switch(n)
	{
	case 3001:
		msg="流量或时长已用尽";
		goto_service=1;
		break;
	case 3002:
		msg="计费策略条件不匹配";
		break;
	case 3003:
		msg="控制策略条件不匹配";
		break;
	case 3004:
		msg="余额不足";
		goto_service=1;
		break;
	case 2531:
		msg="用户不存在";
		break;
	case 2532:
		msg="两次认证的间隔太短";
		break;
	case 2533:
		msg="尝试次数过于频繁";
		break;
	case 2553:
		msg="密码错误";
		break;
	case 2601:
		msg="不是专用客户端";
		break;
	case 2606:
		msg="用户被禁用或无联网权限";
		break;
	case 2611:
		msg="MAC绑定错误";
		break;
	case 2613:
		msg="NAS PORT绑定错误";
		break;
	case 2616:
		msg="余额不足";
		goto_service=1;
		break;
	case 2620:
		msg="连接数已满，请登录http://usereg.tsinghua.edu.cn，选择下线您的IP地址。";
		goto_service=1;
		break;
	case 2806:
		msg="找不到符合条件的产品";
		break;
	case 2807:
		msg="找不到符合条件的计费策略";
		break;
	case 2808:
		msg="找不到符合条件的控制策略";
		break;
	case 2833:
		msg="IP地址异常，请重新拿地址";
		break;
	case 2840:
		msg="校内地址不允许访问外网";
		break;
	case 2841:
		msg="IP地址绑定错误";
		break;
	case 2842:
		msg="IP地址无需认证可直接上网";
		break;
	case 2843:
		msg="IP地址不在IP表中";
		break;
	case 2844:
		msg="IP地址在黑名单中，请联系管理员。";
		break;
	case 2901:
		msg="第三方接口认证失败";
		break;
	}
	return msg;
}

function get_challenge(name, callback) {
    var host = "https://auth4.tsinghua.edu.cn/cgi-bin/get_challenge";
    request.post(
        {
            url: host,
            form: {
                callback: '1',
                username: name
            }
        },
        function(err,httpResponse,body) {
            if(err) {
                return console.error('connect failed:', err.code);
            }
            callback(JSON.parse(body.slice(2, -1))['challenge']);
        }
    )
}

exports.login = function (name, pwd) {
    if (name == '') {
        console.log("请填写用户名");
        return;
    }

    if (pwd == '') {
        console.log("请填写密码");
        return;
    }

    get_challenge(name, function(challenge) {
        var ac_id = '1';
        var host = "https://auth4.tsinghua.edu.cn/cgi-bin/srun_portal";
        var token = challenge;
        var hmd5 = new Hashes.MD5().hex_hmac(token, 'pwd');
        var enc = "s" + "run" + "_bx1";
        var ip = '';
        var n = '200';
        var type = '1';
        var base64 = new Hashes.Base64().setTab('LVoJPiCN2R8G90yg+hmFHuacZ1OWMnrsSTXkYpUq/3dlbfKwv6xztjI7DeBE45QA').setUTF8(false);
        var info = "{SRBX1}" + base64.encode(xEncode.xEncode(JSON.stringify({ "username": name, "password": pwd, "ip": ip, "acid": ac_id, "enc_ver": enc }), token));

        request.post(
            {
                url: host,
                form: {
                    action: 'login',
                    username: name,
                    password: '{MD5}' + hmd5,
                    ac_id: ac_id,
                    type: type,
                    n: n,
                    ip: ip,
                    info: info,
                    chksum: new Hashes.SHA1().hex(
                        token + name +
                        token + hmd5 +
                        token + ac_id +
                        token + ip +
                        token + n +
                        token + type +
                        token + info)
                }
            },
            function(err,httpResponse,body){
                console.log(get_err(body));
            }
        )
    });
}

exports.logout = function () {
    var host = "https://auth4.tsinghua.edu.cn/cgi-bin/srun_portal";

    request.post(
        {
            url: host,
            form: {
                action: 'logout'
            }
        },
        function(err,httpResponse,body){
            console.log(get_err(body));
        }
    )
}
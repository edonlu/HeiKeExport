function myHeiKe () {

	this.dItem = null;
	
	//this.shadeHtml = '<div class="display-backdrop fade in" id="shade66" style="display: none; z-index: 6665;"></div>'
	this.url = localStorage.getItem('url');
	this.token = localStorage.getItem('token');
	this.rpcStatus = localStorage.getItem('rpcStatus');


	this.startListen = function () {
		//console.log();
		this.initHeike();
		var target4 = $("#target4");
		var btns = target4.find(".content");
		var btnmain = $("#btnmain");
		var btn = '<button type="button" class="btn success" id="aria2btn"><i class="icon icon-cloud-download" style="margin-right: 6px;"></i>Aria2</button>';
		btns.append(btn);
		$("#aria2btn").attr("style", btnmain.attr('style'));
		$("#aria2btn").bind('click', (obj) => {
			this.getDownloadURL();
		});
		$.messager.show('程序初始化成功！', {type: 'success', placement: 'center'});
	}
	
	this.initHeike = function () {
		$.messager.show('正在初始化程序……', {type: 'info', placement: 'center'});
		var list = $("#partial").find('.list').children();
		$.each(list, (i, v) => {
			$(v).bind('click', (item) => {
				this.dItem = item;
				$($('.display-backdrop')[0]).remove();
			});
		});
		var rpcHtml = '<div id="target66" class="" style="width: 340px; background: #FFF; position: absolute; left: 10px; z-index: 6666; display: none;">' + 
                '<div class="heading">' + 
                    '<div class="title"><strong>设置Aira服务器</strong></div>' + 
                '</div>' +
                '<div class="content article box">' +
                    '<div class="control has-label-left has-icon-right">' +
                        'URL(类似：http://localhost:6800/jsonrpc)：<input name="rpcURL" type="text" id="rpcURL" class="input" placeholder="Aria2服务器地址" style="width: 90%; display: block; padding-left: 10px;">' +
                        'Token(如果没有Token可以留空)：<input name="rpcToken" type="text" id="rpcToken" class="input" placeholder="Token"  style="width: 50%; display: inline-block; padding-left: 10px; margin-right: 10px">当前状态：<span id="status"></span>' +
                        '<div><input type="button" name="btnCheckRPC" value="测试连接" id="btnCheckRPC" class="btn primary circle" style="margin-top: 10px; margin-right: 10px;">' +
						'<input type="button" name="btnSaveRPC" value="保存" id="btnSaveRPC" class="btn success outline circle" style="margin-top: 10px;"></div>' +
                    '</div>' +
                    '<div class="control has-label-left has-icon-right"><hr>首次使用本插件，需要设置Aira2服务器。</div>' +
                '</div>' +
            '</div>';
		var rpcset = '<nav id="fabNav66" class="affix dock-bottom dock-left fab has-padding dock-auto shadow-none" style="margin-left: 70px;">' + 
						'<a id="rpcBtn" class="btn circle primary layer"><i class="icon icon-cog" style="margin-right: 4px;"></i></a>' + 
					'</nav>';
					
		$("#partial").append(rpcset);
		
		$('body').append(rpcHtml);
		$('#rpcURL').val(this.url == null ? '' : this.url);
		$('#rpcToken').val(this.token == null ? '' : this.token);
		if(this.rpcStatus == '1'){
			setStatus('#status', '已连接', 'green');
		}else{
			setStatus('#status', '未连接', 'red');
		}
		$('#rpcURL, #rpcToken').blur( () => {
			if($('#rpcURL').val() != this.url || $('#rpcToken').val() != this.token){
				setStatus('#status', '测试连接', 'red');
				this.rpcStatus = '0';
			}
			
		});
		$('#btnCheckRPC').click( () => {
			this.getRPCVersion($('#rpcURL').val(), $('#rpcToken').val());
		});
		$('#btnSaveRPC').click( () => {
			localStorage.setItem('url', $('#rpcURL').val());
			localStorage.setItem('token', $('#rpcToken').val());
			localStorage.setItem('rpcStatus', this.rpcStatus);
		});
		$('#target66').css('top', ($('#fabNav66').offset().top - $('#target66').height() - 10) + 'px');
		$('#fabNav66').click( () => {
			//$('#shade66').show();
			$('#target66').slideToggle();
			
		});
		if(this.url != null && this.rpcStatus == '1'){
			$('#rpcBtn').append('已连接');
		}else{
			$('#rpcBtn').append('未连接');
		}
	}
	this.getDownloadURL = function () {
		var that = $($(this.dItem.currentTarget)[0]);
		var obj = this;
		var data = that.attr('data');
		$.ajax({
			type: "post",
			url: "CommonAjax.ashx?type=DownUrl",
			data: "{'d':'" + data + "','tp':'web'}",
			dataType: "json",
			async: true,
			beforeSend: () => {$.messager.show('正在获取下载地址……', {type: 'info', placement: 'center'});},
			success: function (d) {
				if (d.IsOk) {
					
					//web
					obj.sendUrl(bcone(d.DownUrl));
				
				} else {
					$.messager.show(d.Msg, {type: 'danger', placement: 'center'});
					return;
				}
			},
			error: function (err) {
				$.messager.show(err, {type: 'danger', placement: 'center'});; return;
			}
		});
	}
	this.sendUrl = function (path) {		
		$.messager.show('已经取得下载地址，正在推送到Aira2服务器', {type: 'success', placement: 'center'});
		var rpcData = {
			jsonrpc : '2.0',
			id : new Date().getTime(),
			method : 'aria2.addUri',
			params : [
				[path],
				{
					continue : 'true',
					split   : '10',
					'max-connection-per-server' : '10',
				}
			]
		}
		$.post(this.url, JSON.stringify(rpcData), (res) => {
			if(res.error == undefined || res.error == null){
				
				$.messager.show('任务添加成功，请返回Aria2查看任务', {type: 'success', placement: 'center'});
			}
		})
	}
	this.getRPCVersion = function (aria2Url, aria2Token) {
		var aria2 = {
			url : aria2Url,
			token : aria2Token,
		}
		var rpcData = {
			jsonrpc : '2.0',
			method : 'aria2.getVersion',
			id : 1,
			params : []
		}
		$.post(aria2.url, JSON.stringify(rpcData), (res) => {
			var ver = '';
			if(res != null && res != undefined){
				var d = res.result.version;
				if(d != null && d != undefined){
					ver = d;
				}
				console.log(res);
			}
			if(ver == ''){
				setStatus('#status', '连接错误', 'red');
				this.rpcStatus = 0;
				$('#rpcBtn').html($('#rpcBtn').html().replace("已", "未"));
			}
			else{
				setStatus('#status', '已连接', 'green');
				this.rpcStatus = 1;
				$('#rpcBtn').html($('#rpcBtn').html().replace("未", "已"));
			}
		}).fail( () => {
			setStatus('#status', '连接错误', 'red');
			this.rpcStatus = 0;
			$('#rpcBtn').html($('#rpcBtn').html().replace("已", "未"));
		});
	}
	
}


var testToken = function () {
	var url = 'http://token:123456@aria2.ywmt.bid:8080/jsonrpc';
	var rpcData = {
		jsonrpc : '2.0',
		method : 'aria2.getVersion',
		id : 1,
		params : []
	}
	$.post(url, JSON.stringify(rpcData), (res) => {
		console.log(res);
	}).fail( (obj) => {
		console.log(obj);
	});
}
var setStatus = function(id, t, c){
	$(id).text(t)
	$('#status').css('color', c);
}
document.addEventListener('DOMContentLoaded', () => {
	
	const hk = new myHeiKe();

	hk.startListen();
	
	testToken();
})
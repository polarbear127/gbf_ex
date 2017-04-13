var devtoolport = null;
chrome.runtime.onConnect.addListener(
	function(port){
		if(port.name == "devtools-agency"){
			devtoolport = port;
			port.onMessage.addListener(
				function(msg) {
					if(msg.name=="init"){
						return;
					}
					chrome.tabs.query({url:"http://game.granbluefantasy.jp/*"}, function(tabs) {
							if(tabs.length>=1){
		  						chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
		    						console.log(response.farewell);
		    						});
							}	
						});
				});
		}
	});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(sender.tab){
		devtoolport.postMessage(request);
	}
});
chrome.webRequest.onBeforeRequest.addListener(function(details){
	var bodyString = String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes));
	var realBody = JSON.parse(bodyString);
	console.log('拦截request:' + details.url + ',原body:');
	console.log(realBody);
	var realBodyC = realBody.c;
	for (var k in realBodyC){
		if (k != 4001 && k != 1002){
			chrome.tabs.executeScript(null,
				{code : 'console.info("拦截请求:'+details.url+'");console.info('+bodyString+')'});
			console.log('该Request已被拦截');
			return {cancel: true};
		}
	}
	/*var myBody = {};
	var bodyC = {};
	bodyC[4001] = 1;
	myBody.c = bodyC;
	if (realBody.c[1002] != null){
		if (realBody.c[1001] != null){
			realBody.c[1002] += 1;
		}
		myBody.c[1002] = realBody.c[1002];
	}
	myBody.g = realBody.g;
	myBody.u = realBody.u;
	console.log('更改过后:');
	console.log(myBody);
	console.log('即将取消旧请求并发送新请求');
	var dest = details.url.indexOf('ob')!=-1?'ob/r':'gc/gc';
	var request = '{contentType : "application/json",dataType : "json",method : "POST",data : \''+JSON.stringify(myBody)+'\'}'
	chrome.tabs.executeScript(null,
		{code : '$.ajax(\''+dest+'\','+request+'); console.info(\'执行完毕\');'});*/
	console.log('该Request已被放行');
	return {};
},
{urls: ["http://game.granbluefantasy.jp/ob*", "http://game.granbluefantasy.jp/gc*"]},
["blocking", "requestBody"]);

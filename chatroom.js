//chatroom.js
 
// IM初始化
 window.JIM = new JMessage({
         // debug : true
     });
 	$.ajax({
 	url:'http://liuqingwushui.top/api/imchat.php',
 	data:{},
 	success:function(data){
 	JIM.init({
 		"appkey" : data.appkey,
 		"random_str" : data.random_str,
 		"signature" : data.signature,
 		"timestamp" : data.timestamp,
 		"flag" : 0
 	}).onSuccess(function(data) {
 		console.log('success:' + JSON.stringify(data));
		ready();
 	}).onFail(function(data) {
 		console.log('error:' + JSON.stringify(data))
 		 });
 		},
 		error:function(data){
 			mui.alert("鉴权失败");
 		}
 			});
 
// 判断浏览器是否支持 createObjectURL api
function getObjectURL(file) {  
         var url = null;   
         if (window.createObjectURL!=undefined) {  
          url = window.createObjectURL(file) ;  
         } else if (window.URL!=undefined) { // mozilla(firefox)  
          url = window.URL.createObjectURL(file) ;  
         } else if (window.webkitURL!=undefined) { // webkit or chrome  
          url = window.webkitURL.createObjectURL(file) ;  
         }  
         return url ;  
}
 
function ready(){
	(function (doc, win) {
	        var docEl = doc.documentElement,
	            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	            recalc = function () {
	                var clientWidth = docEl.clientWidth;
	                if (!clientWidth) return;
	                if(clientWidth>=720){
	                    docEl.style.fontSize = '100px';
	                }else{
	                    docEl.style.fontSize = 100 * (clientWidth / 720) + 'px';
	                }
	            };
	
	        if (!doc.addEventListener) return;
	        win.addEventListener(resizeEvt, recalc, false);
	        doc.addEventListener('DOMContentLoaded', recalc, false);
	    })(document, window);
		
	/*发送消恿*/
	function send(headSrc,str,name){
		var html="<div class='send'><div class='msg'><img src="+headSrc+" /><span style='position: absolute;left: 1.1rem;'>"+name+"</span>"+
		"<p>"+str+"</p></div></div>";
		upView(html);
	}
	/*接受消息*/
	function show(headSrc,str,name){
		var html="<div class='show'><div class='msg'><img src="+headSrc+" /><span style='position: absolute;right: 1.1rem;'>"+name+"</span>"+
		"<p>"+str+"</p></div></div>";
		upView(html);
	}
	/*更新视图*/
	function upView(html){
		$('.message').append(html);
		// $('body').animate({scrollTop:$('.message').outerHeight()-window.innerHeight},200);
		var ele = document.getElementById('message');
		ele.scrollTop = ele.scrollHeight;
	}
	function sj(){
		return parseInt(Math.random()*10)
	}
	$(function(){
		$("input[type='file']").change(function(){
			var file=this.files[0];
			if(!file.length){
			//获取用户信息
			 var name="";
			 JIM.getUserInfo({
			              'username' : user
			        }).onSuccess(function(data) {
					   name=data.user_info;
			          }).onFail(function(data) {
			            console.log(data);
			        });
					
			var fd = new FormData();
			fd.append("avatar",file);
			 // 发送消息
			 JIM.sendChatroomPic({
			            'target_rid' : "23638768",
			                 'image' : fd,
			               }).onSuccess(function(data,msg) {
			                 console.log(msg);
							 JIM.getResource({
							                 'media_id' : name.avatar,
							               }).onSuccess(function(src) { var s = getObjectURL(file);show(src.url,"<img src='"+s+"'>",name.nickname);})
			               }).onFail(function(data) {
			                  //同发送单聊文本
			               });
			
			}
		})
		
		$('.footer').on('keyup','input',function(){
			if($(this).val().length>0){
				$(this).next().css('background','#114F8E');
			
			}else{
				$(this).next().css('background','#ddd');
			}
		})
		$('.footer p').click(function(){
			//获取用户信息
			 var name="";
			 JIM.getUserInfo({
			              'username' : user
			        }).onSuccess(function(data) {
					   name=data.user_info;
			          }).onFail(function(data) {
			            console.log(data);
			        });
			
			var that=this;
			  JIM.sendChatroomMsg({
						'target_rid' : "23638768",
			            'content' : $(that).prev().val()
			        }).onSuccess(function(data,msg) {
						var con=$(that).prev().val();
						if(name.avatar!=""){
						 JIM.getResource({
						                 'media_id' : name.avatar,
						               }).onSuccess(function(src) {show(src.url,con,name.nickname);})
									   }
						else{show("img/touxiang.png",con,name.nickname);}
						$("#text").val("");
			        }).onFail(function(data) {
			            console.log('error:' + JSON.stringify(data));
						
			        });
			
		})
	})
	/*测试数据*/
	// var arr=['我是小Q','好久没联系了＿','你在想我乿','怎么不和我说诿','跟我聊会天吧'];
	// var imgarr=['img/touxiang.png','img/touxiangm.png']
	// test()
	// function test(){
	// 	$(arr).each(function(i){
	// 		setTimeout(function(){
	// 			send("img/touxiang.png",arr[i])
	// 		},sj()*500)
	// 	})
	// }
	
	var user= localStorage.getItem("account");
	var pass= localStorage.getItem("pass");
        JIM.login({
            'username' : user,
			'password':  pass
        }).onSuccess(function(data) {
            console.log(data);
			localStorage.setItem("account", data.username);
			//业务事件监听
            JIM.onEventNotification(function(data) {
                console.log('event_receive: ' + JSON.stringify(data));
            });
			//用户信息变更监听
           JIM.onUserInfUpdate(function(data) {
                console.log('onUserInfUpdate : ' + JSON.stringify(data));
            });
			//业务事件同步监听
			JIM.onSyncEvent(function(data) {
                console.log('onSyncEvent : ' + JSON.stringify(data));
            });
			//消息已读数变更事件实时监听
			JIM.onMsgReceiptChange(function(data){
			    console.log('onMsgReceiptChange : ' + JSON.stringify(data));
			});
			//消息已读数变更事件同步监听
			JIM.onSyncMsgReceipt(function(data){
			    console.log('onSyncMsgReceipt : ' + JSON.stringify(data));
			});
			//会话未读数变更监听（多端在线）
			JIM.onMutiUnreadMsgUpdate(function(data){
			    console.log('onConversationUpdate : ' + JSON.stringify(data));
			});
			//消息透传监听
		    JIM.onTransMsgRec(function(data){
			    console.log('onTransMsgRec : ' + JSON.stringify(data));
			});
			//聊天室消息监听
			JIM.onRoomMsg (function(data){
			    console.log(data);
				var data=data;
				JIM.getUserInfo({
				            'username' : data.content.from_id,
				        }).onSuccess(function(d) {
							//data.user_info.avatar 头像
							 JIM.getResource({
							                 'media_id' : d.user_info.avatar,
							               }).onSuccess(function(src) {
											   if(data.content.msg_type=="text"){
											   	send(src.url,data.content.msg_body.text,data.content.from_name);
											   }
											   if(data.content.msg_type=="image"){
											   	from_name=data.content.from_name;
											   	JIM.getResource({
											   	                 'media_id' : data.content.msg_body.media_id,
											   	               }).onSuccess(function(img) {
											   	                   //data.code 返回码
											   	                   //data.message 描述
											   	                   //data.url 资源临时访问路径，具体超时时间expire time会包含在url中
											   					   send(src.url,"<img src='"+img.url+"' />",d.user_info.nickname);
											   					   console.log(data);
											   	               }).onFail(function(data) {
											   	                   
											   	               });
											   }
											  
										   }).onFail(function(e) {
											 if(data.content.msg_type=="text"){
											 	send("img/touxiang.png",data.content.msg_body.text,data.content.from_name);
											 }
											 if(data.content.msg_type=="image"){
											   	from_name=data.content.from_name;
											   	JIM.getResource({
											   	                 'media_id' : data.content.msg_body.media_id,
											   	               }).onSuccess(function(img) {
											   	                   //data.code 返回码
											   	                   //data.message 描述
											   	                   //data.url 资源临时访问路径，具体超时时间expire time会包含在url中
											   					   send("img/touxiang.png","<img src='"+img.url+"' />",d.user_info.nickname);
											   					   console.log(data);
											   	               }).onFail(function(data) { 
											   	               });
											   }
											   })
				})
				// if(data.content.msg_type=="text"){
				// 	send("litpic",data.content.msg_body.text,data.content.from_name);
				// }
				// if(data.content.msg_type=="image"){
				// 	from_name=data.content.from_name;
				// 	JIM.getResource({
				// 	                 'media_id' : data.content.msg_body.media_id,
				// 	               }).onSuccess(function(data) {
				// 	                   //data.code 返回码
				// 	                   //data.message 描述
				// 	                   //data.url 资源临时访问路径，具体超时时间expire time会包含在url中
				// 					   send("litpic","<img src='"+data.url+"' />",from_name);
				// 					   console.log(data);
				// 	               }).onFail(function(data) {
				// 	                   //data.code 返回码
				// 	                   //data.message 描述
				// 					   console.log(data);
				// 	               });
				// }
			});
			//加入聊天室
			 JIM.enterChatroom({'id':"23638768"}).onSuccess(function(data) {
							console.log('success:' + JSON.stringify(data));
								 }).onFail(function(data) {	
			               });
        }).onFail(function(data) {
             mui.openWindow({url:'login.html'})
        }).onTimeout(function(data) {
            mui.openWindow({url:'login.html'})
        });
		}
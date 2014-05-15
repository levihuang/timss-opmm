//random array
function randomArray() {
    var arr = [];
    for (var i = 0; i < 5; i++) {//生成一个1-6的数组
        arr[i] = i+1;
    }
    for(var i = arr.length - 1; i; i--){  
        var temp, random = parseInt(Math.random() * i);  
            temp = arr[i];  
            arr[i] = arr[random];  
            arr[random] = temp;  
          
    }  
    var arrayNum = new Array();
    for( index in arr ){
    	var num = arr[index];
    	if( num == 1){
			arrayNum.push("一");
		}else if ( num == 2 ){
			arrayNum.push("二");
		}else if ( num == 3 ){
			arrayNum.push("三");
		}else if ( num == 4 ){
			arrayNum.push("四");
		}else if ( num == 5 ){
			arrayNum.push("五");
		}
    }
    return arrayNum;
}

// 班组排班规则随机生成
function groupShow( ){
	$("#searchCondition").show();
	$("#searchCondition2").hide();
	$("#calendar").show().html("");
	$("#personCalendar").hide().html("");
	
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
	var eventsArray = new Array();
	
	for(var i = 1; i < 31; i ++ ){
			var randArray = randomArray();
			eventsArray.push({
				title: '白班：' + randArray[0] + '班',
				start: new Date(y, m, i),
				color: '#018ED6'
				
			});
			eventsArray.push({
				title: '中班：' + randArray[1] + '班',
				start: new Date(y, m, i),
				color: '#DCB86A'
			});
		
			eventsArray.push({
				title: '夜班：' + randArray[2] + '班',
				start: new Date(y, m, i),
				color: '#352D2B'
			});
			
			eventsArray.push({
				title: '休息：' + randArray[3] + '班',
				start: new Date(y, m, i),
				color: '#82C247'
			});
			eventsArray.push({
				title: '休息：' + randArray[4] + '班',
				start: new Date(y, m, i),
				color: '#82C247'
			});
		
			
	}
	
	//渲染日历
	$('#calendar').fullCalendar({
		header:{
              right: 'prev,next today',
              center: 'title',
              left: 'prevYear,nextYear'
        },
        buttonText :{
        	 prev: '上月',
        	 next: '下月',
        	 prevYear: '去年',
        	 nextYear: '明年',
        	 today : '今天'
        },
        titleFormat : {
        	month: 'yyyy MM'
        },
        height : '600',
        dayNames : ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
        dayNamesShort : ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
		editable: false,
		events : eventsArray
	});
}


//个人视图
function personShow(){
	$("#calendar").hide();
	$("#searchCondition").hide();
	$("#personCalendar").show().html("");
	$("#searchCondition2").show();
	
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
	var eventsArray = new Array();
	
	for(var i = 0; i < 30; i ++ ){
		if( i % 9 == 0 ){
			eventsArray.push({
				title: '中班',
				start: new Date(y, m, i+1),
				color: '#DCB86A'
			});
		
			eventsArray.push({
				title: '休息',
				start: new Date(y, m, i+2),
				color: '#82C247'
			});
			eventsArray.push({
				title: '休息',
				start: new Date(y, m, i+3),
				color: '#82C247'
			});
			eventsArray.push({
				title: '白班',
				start: new Date(y, m, i+4),
				color: '#018ED6'
				
			});
			eventsArray.push({
				title: '白班',
				start: new Date(y, m, i+5),
				color: '#018ED6'
			});
			eventsArray.push({
				title: '休息',
				start: new Date(y, m, i+6),
				color: '#82C247'
			});
			eventsArray.push({
				title: '休息',
				start: new Date(y, m, i+7),
				color: '#82C247'
			});
			eventsArray.push({
				title: '夜班',
				start: new Date(y, m, i+8),
				color: '#352D2B'
			});
			eventsArray.push({
				title: '夜班',
				start: new Date(y, m, i+9),
				color: '#352D2B'
			});
			
		}
	}
	
	
	$('#personCalendar').fullCalendar({
		header:{
              right: 'prev,next today',
              center: 'title',
              left: 'prevYear,nextYear'
        },
        buttonText :{
        	 prev: '上月',
        	 next: '下月',
        	 prevYear: '去年',
        	 nextYear: '明年',
        	 today : '今天'
        },
        titleFormat : {
        	month: 'yyyy MM'
        },
        height : '600',
        dayNames : ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
        dayNamesShort : ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
		editable: false,
		events : eventsArray
	});
}
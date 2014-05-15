Function.prototype.clone = function() {
    var that = this;
    var temp = function temporary() { return that.apply(this, arguments); };
    for(var key in this) {
        if (this.hasOwnProperty(key)) {
            temp[key] = this[key];
        }
    }
    return temp;
};

ITCUI_EventHandler  = function(){
	var events = {};
	var invMapping = {};
	
	this.registerEvent = function(eventId,f,deepcopy){
		var evtList = events[eventId];
		if(!evtList){
			events[eventId] = [];
			evtList = events[eventId];
		}
		var evtNo = (new Date().getTime()%100000) + "" + Math.abs(Math.round(Math.random()*1000));
		if(!deepcopy){
			evtList.push([f,evtNo])
		}
		else{
			evtList.push([f.clone(),evtNo])	
		}
		invMapping[evtNo] = eventId;
		return evtNo;
	};

	this.unregisterEvent = function(evtNo){
		var eventId = invMapping[evtNo];
		if(!eventId){
			return;
		}
		var evtList = events[eventId];
		if(!evtList){
			return;
		}		
		var i = 0;	
		for(i=0;i<evtList.length;i++){
			var evt = evtList[i];
			if(evt[1]==evtNo){
				break;
			}
		}
		var newEvents = [];
		for(var j=0;j<evtList.length;j++){
			if(j!=i){
				newEvents.push(evtList[i]);
			}
		}
		evtList = newEvents;
		delete(invMapping[evtNo]);
	};

	this.triggerEvent = function(eventId,args){
		var evtList = events[eventId];
		var rtnList = [];
		if(evtList){
			for(var i=0;i<evtList.length;i++){
				var evt = evtList[i];
				if(evt && evt[0]){
					rtnList.push(evt[0](args));
				}
			}
		}
		if(rtnList.length>0){
			return rtnList;
		}
		return -1;
	};
}

var _event_handler = _event_handler || _parent()._event_handler || new ITCUI_EventHandler();
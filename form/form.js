(function() {
	function toJSONString( form ) {
		var obj = {};
		var flagQuery = true;
		var flagResp = true;
		var elements = form.querySelectorAll( "input, select, div" );
		for( var i = 0; i < elements.length; ++i ) {
			var element = elements[i];
			var id = element.id;
			var name = element.name;
			var value = element.value;

			if(id === "requestWrapper"){
				obj.request = {};
			}

			if(id === "responseWrapper"){
				obj.response = {};
			}

			if(name === "command"){
				obj[name] = value;

			} else if(name === "method" || name === "uri"){
				obj.request[name] = value;

			} else if(name === "title" || name === "text"){
				obj.response[name] = value;

			} else if(name === "query_params"){
				if(flagQuery){
					obj.request[name] = {};
					flagQuery = false;
				}
				obj.request[name][value] = elements[i+1].value;
				i++;

			} else if(name === "fields"){
				if(flagResp){
					obj.response[name] = {};
					flagResp = false;
				}
				obj.response[name][value] = elements[i+1].value;
				i++; 
			}
		}

		return JSON.stringify(obj, null, 2);
	}

	document.addEventListener( "DOMContentLoaded", function() {
		var form = document.getElementById( "formulaire" );
		var output = document.getElementById( "output" );
		form.addEventListener( "submit", function( e ) {
			e.preventDefault();
			var json = toJSONString( this );
			output.innerHTML = json;

		}, false);

	});

})();

function addInputParam(){
    var div = document.getElementById("requestParamWrapper");
    div.insertAdjacentHTML('beforeend', '<input type="text" name="query_params" id="params" class="addedReqParam"/>');
    div.insertAdjacentHTML('beforeend', '<input type="text" name="query_params" id="params" class="addedReqParam"/>');
}

function addResponseField(){	
	var div = document.getElementById("responseFieldWrapper");
    div.insertAdjacentHTML('beforeend', '<input type="text" name="fields" class="addedResParam"/>');
    div.insertAdjacentHTML('beforeend', '<input type="text" name="fields" class="addedResParam"/>');
}
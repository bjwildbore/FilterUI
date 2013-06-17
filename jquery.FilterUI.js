;(function($){ 
	"use strict";		
	
	var methods = {
		init : function( options ){
			var $this = $(this);								
				$this.opts = $.extend({}, $.fn.fui.defaults, options);	
				
				if($this.opts.cookies){
						$this = loadCookieValues($this);
				}
				
				buildFilters($this);				
				configureEventHandlers($this);
		},
		
		getFilterValues: function (obj) {
				var $this = $(this);				
        }
		
	};

	function  configureEventHandlers($this){
	
		$this.on("click", "li", function(event){
			$(this).toggleClass('selected');
			adjustFilters($(this));	
		});	
		
	}

	function adjustFilters(objLi){
		
		var type = objLi.parent().attr('data-type');
		var value = objLi.attr('data-value');			
	    //if required
	    //multi select?
		//filter children?
		
		var aFilterValues = getFilterListValues(type);		

		//adjustChildrenFilters
		$('.filterList[data-parent="'+type+'"] li').each(function(){		
				
			var parentvalue =  $(this).attr('data-parentvalue');
						
			if($.inArray(parentvalue , aFilterValues ) == -1){ // if parent value not selected
				$('i', this).removeClass('icon-unselected icon-check-empty');
				$(this).addClass('isHidden');				
			} else {
				$('i', this).removeClass('icon-unselected icon-check-empty');
				$(this).removeClass('isHidden');
			}
			
			adjustFilters($(this));
		});
		
		 setFilterValues(type, aFilterValues );
		 
		

	}
	
	function setFilterValues(type, values){
		$.cookie('f_' + type , values);
		oFilters[type].values = values;	
		oFilters[type].active = $('.filterList[data-type="'+type+'"] li:not(.isHidden) i:.icon-unselected').size();	
	}
	
	function buildFilters($this){
		var sHtml = '',
			sFilters = '',
			i=0,
			j=0,
			filters = $this.opts.filters,			
			filter = {},
			options = [],
			option = {};
			
		//console.log('buildFilters');
		//console.log($this);
		
		sHtml += '<div class="fuiTitle"><span>'+$this.opts.title+'</span>';
		
		if($this.opts.allowDisable){
			sHtml += '<div class="fuiStatusButton "><i></i>disable</div>';
		} 
		
		sHtml += '</div>';
		
		for (i = 0; i < filters.length; i++){
			filter = filters[i];
			sFilters += '<div class="fui_' + filter.id + '" data-parentfilter="'+filter.parent+'">';
			sFilters += '<div>' + filter.title + '</div>';
			sFilters += '<ul>'; 
			
			//console.log(filter);
			
			options = filter.options;
			for (j = 0; j < options.length; j++){
				option = options[j];
				sFilters += '<li class=" '+option.default+' " data-parent="'+ option.parent +'" data-value="'+option.value+'">'+option.label+'</li>'; 
			}
			
			sFilters += '</ul>' 
			sFilters += '</div>';
		}		
		
		
		
		$this.append(sHtml + sFilters);
		
		/*
		$(".btnFilterReset").click(function(e) {
		    console.log('btnFilterReset' );
			clearBrowserCache();
		});
				
		loadOptionsFromArray(oFilters.region.dictionary,'cfRegion','');		
		loadOptionsFromArray(oFilters.location.dictionary ,'cfLocation','regionID');
		
		loadOptionsFromArray(oFilters.tutor.dictionary ,'cfTutor','');
		loadOptionsFromArray(oFilters.type.dictionary ,'cfType','');
		loadOptionsFromArray(oFilters.status.dictionary ,'cfStatus','');
		*/
			
	}// end buildFilters function
	
	

/*
	function loadOptionsFromArray(aArray,id,parentFilterValueField){
		
		var sTmp = "";

		for (var i = 0; i < aArray.length; i++){		
		
			sTmp +=	"<li data-value='"+aArray[i].id+"'  ";
			if(parentFilterValueField!=""){			
				sTmp +=	" data-parentvalue='"+aArray[i][parentFilterValueField]+"' class='isHidden' ";
			}
			sTmp +="><i class='icon icon-check icon-unselected icon-check-empty'></i>"+aArray[i].title+"</li>";			
		}
		
		
    	$(sTmp).appendTo("#"+id);
		
	}



		
	// loads any previous settings for the filters from the browser cookies... prevents users having to reenter any
	// filter values if they navigate away from the page on accident.
	function applyCookiesToFilters(){		
		
		checkSetParameterCookie("region");	
		checkSetParameterCookie("location");
		checkSetParameterCookie("tutor");
		checkSetParameterCookie("type");
		checkSetParameterCookie("status");
		checkSetParameterCookie("options");
		
 	}


	function checkSetParameterCookie(id){	
		
		var key = 'f_' + id,
		aFilterValues = [],
		aCookieValue = [],
		cookieValue = "",		
		i = 0;
		
		
		if ($.cookie(key) == null) { 	
			$.cookie(key ,''); 	
			console.log('found null value');		
		} else {
			cookieValue = $.cookie(key);
		}
		
		
		console.log(key);
		console.log(cookieValue);
		aCookieValue = cookieValue.split(',') ;			
		
		if(cookieValue.length){				
			for (i = 0; i < aCookieValue.length; i++){				
				$('.filterList[data-type="'+id+'"] li[data-value="'+aCookieValue[i]+'"] i').removeClass('icon-unselected icon-check-empty');
				$('.filterList[data-parent="'+id+'"] li[data-parentvalue="'+aCookieValue[i]+'"]').removeClass('isHidden');
			}
			setFilterValues(id, aCookieValue );

			
		} else {
			$('.filterList[data-type="'+id+'"] li i').removeClass('icon-unselected icon-check-empty');
			$('.filterList[data-parent="'+id+'"] li').removeClass('isHidden');
			
			aFilterValues = getFilterListValues(id);	
			setFilterValues(id, aCookieValue );
		}			

			
	}





	function clearBrowserCache(){
		
	    $.jStorage.flush();
		$.cookie("f_region","");
		
		$.cookie("f_tutor","");
		$.cookie("f_location","");		
		$.cookie("f_status","");
		$.cookie("f_type","");
		$.cookie("f_options","");	
	  
	    location.reload(true);	  	
	}
	
	
	*/
	
	
	function clearCookies($this){	
		console.log('TODO: clearCookies');
	}
	
	function resetToCookies($this){	
		console.log('TODO: resetToCookies');
	}
	
	function resetToDefaults($this){
		console.log('TODO: resetToDefaults');
	}
	
	function loadCookieValues($this){
		console.log('TODO: loadCookieValues');
		return $this;
	}

	function updateCookies($this){
		console.log('TODO: updateCookies');
		return $this;
	}	
	
	
	
	
	
	
	$.fn.fui = function(method) { 
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}
	};
	
	// plugin defaults - added as a property on our plugin function
	$.fn.fui.defaults = {		
		title: 'Filters',
		filters: [],			
		cookies: true,
		autosetCookies: true,
		status: true,
		allowDisable: true,
		onFilterChange: function(){return true}		
	};	

})(jQuery);
;(function($){ 
	"use strict";		
	
	var methods = {
		init : function( options ){
			var $this = $(this);								
				$this.opts = $.extend({}, $.fn.fui.defaults, options);					
				
								
				
				$this.addClass('fuiFilters');
				buildFilters($this);				
				configureEventHandlers($this);
		},		

		getFilterValues: function (obj) {
				var $this = $(this);				
        }
		
	};

	function  configureEventHandlers($this){
		
		$this.on("click", "li", function(event){
			if (event.ctrlKey){
				console.log("ctrl");
				$(this).removeClass('unselected');
				$(this).siblings().addClass('unselected');
				adjustFilters($this,$(this),true);	
			} else {
			
			/*
			TODO:required:
			console.log('isRequired', isRequired);
			isRequired = filterObj.attr('data-required'),
			
			if( isRequired && $('.fuiFilter[data-type="'+type+'"] li:not(.isHidden):not(.unselected)').size() == 0){
				//reset the filters
				$('.filterList[data-type="'+type+'"] li i').toggleClass('icon-unselected icon-check-empty');
			} else { 
			*/
			
				$(this).toggleClass('unselected');
				adjustFilters($this,$(this),true);	
			}
		});	

		$this.on("click", ".fuiFilter > div", function(event){
			console.log('barclick');
			$(this).parent().children('ul').toggle('fast');
		});	
		
		
	}

	function adjustFilters($this,objLi,isRootLiItem){
		var filterObj = objLi.closest('.fuiFilter'),
		type = filterObj.attr('data-type'),
		value = objLi.attr('data-value');	
					
	    //if required
	    //multi select?
		//filter children?
		


		
		var aFilterValues = getFilterListValues(type);
		//console.log(type + ' ' + value + ' ' + aFilterValues);			

		//adjustChildrenFilters
		$('.fuiFilter[data-parentfilter="'+type+'"] li[data-parent="'+value+'"]').each(function(){		
			var $thisLi = $(this);
			//console.log($this);
			var parentvalue =  $thisLi.attr('data-parent');
			//console.log(type,'parent value = ',parentvalue, value , $thisLi.text());	
			
			if($.inArray(parentvalue , aFilterValues ) == -1){ // if parent value not selected
				$thisLi.removeClass('unselected');
				$thisLi.addClass('isHidden');				
			} else {
				$thisLi.removeClass('unselected');
				$thisLi.removeClass('isHidden');
			}			
			adjustFilters($this,$thisLi,false);
		});				
		
		setFilterValues(type, aFilterValues );		
		
		if(isRootLiItem){
			changeFilterStatus($this);
		} 
		
	}
	
	function changeFilterStatus($this){
	
		console.log('changeFilterStatus');
		
		var filters = $this.opts.filters,			
			filter = {},
			options = [],
			option = {},
			unselectedItems = '',
			i = 0;
		
		for (i = 0; i < filters.length; i++){
			filter = filters[i];			
			unselectedItems = $('.fuiFilter[data-type="'+filter.id+'"] li:not(.isHidden).unselected').size();
			console.log(filter.id , unselectedItems);
			if(unselectedItems > 0){
				$('.fuiFilter[data-type="'+filter.id+'"] span').text('('+ unselectedItems + ' unselected)');
			} else {
				$('.fuiFilter[data-type="'+filter.id+'"] span').text('');
			}
		}
		
	}

	function setFilterValues(type, values) {		
		$.cookie('fui_' + type , values);
		//console.log ('cookie ' +$.cookie('fui_' + type))		
    };		
	
	function getFilterListValues(dataType){		
		var aReturn = [],
		listItems = $('.fuiFilter[data-type="'+dataType+'"] li:not(.unselected)');
		
		listItems.each(function(){	
			aReturn.push($(this).attr('data-value'));
			aReturn.push($(this).text());			
		});	
		return aReturn;
	}


	
	
	
	function buildFilters($this){
		var sHtml = '',
			sFilters = '',
			i=0,
			j=0,
			applyDefaults = true,
			cookieKey = '',	
			cookieValues = '',
			parentFilterValues = '',			
			tmpValues = [],			
			filters = $this.opts.filters,			
			filter = {},
			options = [],
			option = {};			
	
		sHtml += '<div class="fuiTitle"><span>'+$this.opts.title+'</span>';
		
		if($this.opts.allowDisable){
			sHtml += '<div class="fuiStatusButton "><i></i>disable</div>';
		} 
		
		sHtml += '</div>';
		
		for (i = 0; i < filters.length; i++){
			tmpValues = [];
			filter = filters[i];
			cookieKey = 'fui_' + filter.id;
			cookieValues = $.cookie(cookieKey);	
			
			if(cookieValues == null){				
				$.cookie(cookieKey, '');
				cookieValues = [];				
			} else {			
				applyDefaults = false;
				cookieValues = cookieValues.split(',');								
			}
			
			sFilters += '<div class="fuiFilter" data-required="' + filter.required + '" data-type="' + filter.id + '" data-parentfilter="'+filter.parent+'">';
			sFilters += '<div>' + filter.title + ' <span class="liStatus"></span></div>';
			sFilters += '<ul>';			
			
			options = filter.options;
			
			parentFilterValues = $.cookie('fui_'+filter.parent);
			
			if(parentFilterValues !== null){						
					parentFilterValues = parentFilterValues.split(',');	
			}
				
			for (j = 0; j < options.length; j++){
				option = options[j];
				sFilters += '<li class="';
				
				if(filter.parent != "" ){					
					if($.inArray(''+option.parent , parentFilterValues ) == -1   ){							
						sFilters += ' isHidden ';						
					}
				}		

				if(applyDefaults){				
					if(option.default === false){
						sFilters += ' unselected ';
					} else {
						tmpValues.push(option.value);
					}					
				} else {
					if( $.inArray(''+option.value , cookieValues ) == -1   ){
						
						sFilters += 'unselected';						
					} else {
						
						tmpValues.push(option.value);
					}
					
				}
				sFilters +='" data-parent="'+ option.parent +'" data-value="'+option.value+'"><i class="fuiIconSelected '+$this.opts.iconSelectedClass+'"></i><i class="fuiIconUnselected '+$this.opts.iconUnselectedClass+'"></i>'+option.label+'</li>'; 
			}
			
			$.cookie(cookieKey, tmpValues);
			
			sFilters += '</ul>' 
			sFilters += '</div>';
		}		
		
		
		
		$this.append(sHtml + sFilters);
		changeFilterStatus($this);
		/*
		$(".btnFilterReset").click(function(e) {
		    console.log('btnFilterReset' );
			clearBrowserCache();
		});
		*/
			
	}// end buildFilters function
	


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
		autosetCookies: true,
		iconSelectedClass: 'icon-check-sign',
		iconUnselectedClass: 'icon-check-empty',
		status: true,
		allowDisable: true,
		onFilterChange: function(){return true}		
	};	

})(jQuery);
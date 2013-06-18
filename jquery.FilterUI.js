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
			var isRequired = false,
			type='',
			items = [],			
			thisLi = $(this),
			filter = thisLi.closest('.fuiFilter');
			//todo add code for radio here
			if(filter.attr('data-multi') == 'true'){
				if (event.ctrlKey){				
					thisLi.removeClass('unselected');
					thisLi.siblings().addClass('unselected');				
				} else {
					isRequired = filter.attr('data-required');
					type = filter.attr('data-type');			
					items = $('.fuiFilter[data-type="'+type+'"] li:not(.unselected):not(.isHidden)').size();
									
					if(isRequired == 'true' && items <= 1 ){					
						thisLi.removeClass('unselected');					
					} else {
						thisLi.toggleClass('unselected');						
					}						
				}
			} else {
				thisLi.removeClass('unselected');
				thisLi.siblings().addClass('unselected');							
			}
			
			adjustFilters($this,thisLi,true);				

		});	

		$this.on("click", ".fuiFilter > div", function(event){
			console.log('barclick');
			$(this).parent().children('ul').toggle('fast');
		});		
		
	}

	function adjustFilters($this,objLi,isRootLiItem){
		var filter = objLi.closest('.fuiFilter'),
		type = filter.attr('data-type'),		
		value = objLi.attr('data-value');					
	    
	    //multi select?
		//filter children?
		
		var aFilterValues = getFilterListValues(type);				

		//adjustChildrenFilters
		$('.fuiFilter[data-parentfilter="'+type+'"] li[data-parent="'+value+'"]').each(function(){		
			var $thisLi = $(this);
			var multi = $thisLi.closest('.fuiFilter').attr('data-multi'); 
			var parentvalue =  $thisLi.attr('data-parent');
			var unselectedItems = 0;
			
			if($.inArray(parentvalue , aFilterValues ) == -1){ // if parent value not selected Hide Options
				$thisLi.removeClass('unselected');
				$thisLi.addClass('isHidden');				
			} else {
				$thisLi.removeClass('isHidden');
				
				if(multi == "false"){
					$thisLi.addClass('unselected');									
				} else {
					$thisLi.removeClass('unselected');					
				}				
			}			
			adjustFilters($this,$thisLi,false);
		});	
		
		//todo: check for children all unselected and check the first one
		
		setFilterValues(type, aFilterValues );		
		
		if(isRootLiItem){
			changeFilterStatus($this);
		} 
		
	}
	
	function changeFilterStatus($this){
	
		//console.log('changeFilterStatus');
		
		var filters = $this.opts.filters,			
			filter = {},
			options = [],
			option = {},
			unselectedItems = '',
			i = 0;
		
		for (i = 0; i < filters.length; i++){
			filter = filters[i];	
			if(filter.multi){			
				unselectedItems = $('.fuiFilter[data-type="'+filter.id+'"] li:not(.isHidden).unselected').size();
				//console.log(filter.id , unselectedItems);
				if(unselectedItems > 0){
					$('.fuiFilter[data-type="'+filter.id+'"] span').text('('+ unselectedItems + ' unselected)');
				} else {
					$('.fuiFilter[data-type="'+filter.id+'"] span').text('');
				}
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
			selectedIcon = '',
			unselectedIcon = '',
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
			if(filter.multi){
				selectedIcon = $this.opts.checkSelectedClass;
				unselectedIcon = $this.opts.checkUnselectedClass;
			} else {
				selectedIcon = $this.opts.radioSelectedClass;
				unselectedIcon = $this.opts.radioUnselectedClass;
			}
			
			if(cookieValues == null){				
				$.cookie(cookieKey, '');
				cookieValues = [];				
			} else {			
				applyDefaults = false;
				cookieValues = cookieValues.split(',');								
			}
			
			sFilters += '<div class="fuiFilter" data-multi="' + filter.multi + '" data-required="' + filter.required + '" data-type="' + filter.id + '" data-parentfilter="'+filter.parent+'">';
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
				sFilters +='" ';
				sFilters +='data-parent="'+ option.parent +'" ';
				sFilters +='data-value="'+option.value+'">';
				sFilters +='<i class="fuiIconSelected '+selectedIcon+'"></i>';
				sFilters +='<i class="fuiIconUnselected '+unselectedIcon+'"></i>';
				sFilters += option.label+'</li>'; 
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
		radioSelectedClass: 'icon-ok-circle',
		radioUnselectedClass: 'icon-circle-blank',
		checkSelectedClass: 'icon-check-sign',
		checkUnselectedClass: 'icon-check-empty',		
		status: true,
		allowDisable: true,
		onFilterChange: function(){return true}		
	};	

})(jQuery);
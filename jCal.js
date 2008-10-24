/*
 * jCal calendar multi-day and multi-month datepicker plugin for jQuery
 *	version 0.3.2
 * Author: Jim Palmer
 * Released under MIT license.
 */
(function($) {
	$.fn.jCal = function (opt) {
		$.jCal(this, opt);
	}
	$.jCal = function (target, opt) {
		opt = $.extend({
			day:			new Date(),									// date to drive first cal
			days:			1,											// default number of days user can select
			showMonths:		1,											// how many side-by-side months to show
			dCheck:			function (day) { return true; },			// handler for checking if single date is valid or not
			callback:		function (day, days) { return true; },		// callback function for click on date
			selectedBG:		'rgb(0, 143, 214)',							// default bgcolor for selected date cell
			defaultBG:		'rgb(255, 255, 255)',						// default bgcolor for unselected date cell
			dayOffset:		0,											// 0=week start with sunday, 1=week starts with monday
			forceWeek:		false,										// true=force selection at start of week, false=select days out from selected day
			dow:			['S', 'M', 'T', 'W', 'T', 'F', 'S'],		// days of week - change this to reflect your dayOffset
			ml:				['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			ms:				['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			_target:		target										// target DOM element - no need to set extend this variable
		}, opt);
		opt.day = new Date(opt.day.getFullYear(), opt.day.getMonth(), opt.day.getDate());
		$(target).stop().empty();
		for (var sm=0; sm < opt.showMonths; sm++)
			$(target).append('<div class="jCalMo"></div>');
		opt.cID = 'c' + $('.jCalMo').length;
		$('.jCalMo', target).each(
			function (ind) {
				drawCalControl($(this), $.extend( {}, opt, { 'ind':ind, 
						'day':new Date( new Date( opt.day.getTime() ).setMonth( new Date( opt.day.getTime() ).getMonth() + ind ) ) }
					));
				drawCal($(this), $.extend( {}, opt, { 'ind':ind, 
						'day':new Date( new Date( opt.day.getTime() ).setMonth( new Date( opt.day.getTime() ).getMonth() + ind ) ) }
					));
			});
		$('.jCal', target).each(
			function () {
				$('.month', this).css('width', $(this).parent().width() - ( $('.left', this).width() || 0 ) - ( $('.right', this).width() || 0 ) + 'px')
			});
	}

	function drawCalControl (target, opt) {
		$(target).append(
			'<div class="jCal">' + 
					( (opt.ind == 0) ? '<div class="left"><img src="_left.gif"></div>' : '' ) + 
					'<div class="month">' + opt.ml[opt.day.getMonth()] + ' ' + opt.day.getFullYear() + '</div>' +
					( (opt.ind == ( opt.showMonths - 1 )) ? '<div class="right"><img src="_right.gif"></div>' : '' ) +
			'</div>');
		$(target).find('.jCal .left').bind('click',
			function (e) {
				if ($('.jCalMask', opt._target).length > 0) return false;
				var mD = { w:0, h:0 };
				$('.jCalMo', opt._target).each( function () { 
						mD.w += $(this).width() + parseInt($(this).css('padding-left')) + parseInt($(this).css('padding-right')); 
						var cH = $(this).height() + parseInt($(this).css('padding-top')) + parseInt($(this).css('padding-bottom')); 
						mD.h = ((cH > mD.h) ? cH : mD.h);
					} );
				$(opt._target).prepend('<div class="jCalMo"></div>');

				opt.day = new Date( $('div[id*=' + opt.cID + 'd_]:first', opt._target).attr('id').replace(opt.cID + 'd_', '').replace(/_/g, '/') );
				opt.day.setDate(1);
				opt.day.setMonth( opt.day.getMonth() - 1 );
				drawCalControl($('.jCalMo:first', opt._target), opt);
				drawCal($('.jCalMo:first', opt._target), opt);

				if (opt.showMonths > 1) {
					$('.right', opt._target).clone(true).appendTo( $('.jCalMo:eq(1) .jCal', opt._target) );
					$('.left:last, .right:last', opt._target).remove();
				}

				$(opt._target).append('<div class="jCalSpace" style="width:'+mD.w+'px; height:'+mD.h+'px;"></div>');

				$('.jCalMo', opt._target).wrapAll(
					'<div class="jCalMask" style="clip:rect(0px '+mD.w+'px '+mD.h+'px 0px); width:'+ ( mD.w + ( mD.w / opt.showMonths ) ) +'px; height:'+mD.h+'px;">' + 
						'<div class="jCalMove"></div>' +
					'</div>');

				$('.jCalMove', opt._target).css('margin-left', ( ( mD.w / opt.showMonths ) * -1 ) + 'px').css('opacity', 0.5).animate({ marginLeft:'0px' }, 'fast',
					function () {
						$(this).children('.jCalMo:not(:last)').appendTo( $(opt._target) );
						$('.jCalSpace, .jCalMask', opt._target).empty().remove();
						if ( typeof $(opt._target).data('day') == 'object' ) 
							reSelectDates(opt._target, $(opt._target).data('day'), $(opt._target).data('days'), opt);
					});
			});
		$(target).find('.jCal .right').bind('click', 
			function (e) {
				if ($('.jCalMask', opt._target).length > 0) return false;
				var mD = { w:0, h:0 };
				$('.jCalMo', opt._target).each( function () { 
						mD.w += $(this).width() + parseInt($(this).css('padding-left')) + parseInt($(this).css('padding-right')); 
						var cH = $(this).height() + parseInt($(this).css('padding-top')) + parseInt($(this).css('padding-bottom')); 
						mD.h = ((cH > mD.h) ? cH : mD.h);
					} );
				$(opt._target).append('<div class="jCalMo"></div>');

				opt.day = new Date( $('div[id^=' + opt.cID + 'd_]:last', opt._target).attr('id').replace(opt.cID + 'd_', '').replace(/_/g, '/') );
				opt.day.setDate(1);
				opt.day.setMonth( opt.day.getMonth() + 1 );
				drawCalControl($('.jCalMo:last', opt._target), opt);
				drawCal($('.jCalMo:last', opt._target), opt);

				if (opt.showMonths > 1) {
					$('.left', opt._target).clone(true).prependTo( $('.jCalMo:eq(1) .jCal', opt._target) );
					$('.left:first, .right:first', opt._target).remove();
				}

				$(opt._target).append('<div class="jCalSpace" style="width:'+mD.w+'px; height:'+mD.h+'px;"></div>');

				$('.jCalMo', opt._target).wrapAll(
					'<div class="jCalMask" style="clip:rect(0px '+mD.w+'px '+mD.h+'px 0px); width:'+ ( mD.w + ( mD.w / opt.showMonths ) ) +'px; height:'+mD.h+'px;">' + 
						'<div class="jCalMove"></div>' +
					'</div>');

				$('.jCalMove', opt._target).css('opacity', 0.5).animate({ marginLeft:( ( mD.w / opt.showMonths ) * -1 ) + 'px' }, 'fast',
					function () {
						$(this).children('.jCalMo:not(:first)').appendTo( $(opt._target) );
						$('.jCalSpace, .jCalMask', opt._target).empty().remove();
						if ( typeof $(opt._target).data('day') == 'object' ) 
							reSelectDates(opt._target, $(opt._target).data('day'), $(opt._target).data('days'), opt);
					});

			});
	}
	
	function reSelectDates (target, day, days, opt) {
		var fDay = new Date(day.getTime());
		var sDay = new Date(day.getTime());
		for (var fC = false, di = 0, dC = days; di < dC; di++) {
			var dF = $(target).find('div[id*=d_' + (sDay.getMonth() + 1) + '_' + sDay.getDate() + '_' + sDay.getFullYear() + ']');
			if ( dF.length > 0 ) {
				dF.stop().addClass('selectedDay');
				fC = true;
			}
			sDay.setDate( sDay.getDate() + 1 );
		}
		if ( fC && typeof opt.callback == 'function' ) opt.callback( day, days );
	}

	function drawCal (target, opt) {
		for (var ds in opt.dow)
			$(target).append('<div class="dow">' + opt.dow[ds] + '</div>');
		var fd = new Date( new Date( opt.day.getTime() ).setDate(1) );
		var ldlm = new Date( new Date( fd.getTime() ).setDate(0) );
		var ld = new Date( new Date( new Date( fd.getTime() ).setMonth( fd.getMonth() + 1 ) ).setDate(0) );
		var copt = {fd:fd.getDay(), lld:ldlm.getDate(), ld:ld.getDate()};
		var offsetDayStart = ( ( copt.fd < opt.dayOffset ) ? ( opt.dayOffset - 7 ) : 1 );
		var offsetDayEnd = ( ( ld.getDay() < opt.dayOffset ) ? ( 7 - ld.getDay() ) : ld.getDay() );
		for ( var d = offsetDayStart, dE = ( copt.fd + copt.ld + ( 7 - offsetDayEnd ) ); d < dE; d++)
			$(target).append(
				(( d <= ( copt.fd - opt.dayOffset ) ) ? 
					'<div id="' + opt.cID + 'd' + d + '" class="pday">' + ( copt.lld - ( ( copt.fd - opt.dayOffset ) - d ) ) + '</div>' 
					: ( ( d > ( ( copt.fd - opt.dayOffset ) + copt.ld ) ) ?
						'<div id="' + opt.cID + 'd' + d + '" class="aday">' + ( d - ( ( copt.fd - opt.dayOffset ) + copt.ld ) ) + '</div>' 
						: '<div id="' + opt.cID + 'd_' + (fd.getMonth() + 1) + '_' + ( d - ( copt.fd - opt.dayOffset ) ) + '_' + fd.getFullYear() + '" class="' +
							( ( opt.dCheck( new Date( (new Date( fd.getTime() )).setDate( d - ( copt.fd - opt.dayOffset ) ) ) ) ) ? 'day' : 'invday' ) +
							'">' + ( d - ( copt.fd - opt.dayOffset ) )  + '</div>'
					) 
				)
			);
		$(target).find('div[id^=' + opt.cID + 'd]:first, div[id^=' + opt.cID + 'd]:nth-child(7n+2)').before( '<br style="clear:both; font-size:0.1em;" />' );
		$(target).find('div[id^=' + opt.cID + 'd_]:not(.invday)').bind("mouseover mouseout click", function(e){
			if ($('.jCalMask', opt._target).length > 0) return false;
			var osDate = new Date ( $(this).attr('id').replace(/c[0-9]{1,}d_([0-9]{1,2})_([0-9]{1,2})_([0-9]{4})/, '$1/$2/$3') );
			if (opt.forceWeek) osDate.setDate( osDate.getDate() + (opt.dayOffset - osDate.getDay()) );
			var sDate = new Date ( osDate.getTime() );
			if (e.type == 'click')
				$('div[id*=d_]', opt._target).stop().removeClass('selectedDay').removeClass('overDay').css('backgroundColor', '');
			for (var di = 0, ds = opt.days; di < ds; di++) {
				var currDay = $(opt._target).find('#' + opt.cID + 'd_' + ( sDate.getMonth() + 1 ) + '_' + sDate.getDate() + '_' + sDate.getFullYear());
				if ( currDay.length == 0 || $(currDay).hasClass('invday') ) break;
				if ( e.type == 'mouseover' )		$(currDay).addClass('overDay');
				else if ( e.type == 'mouseout' )	$(currDay).stop().removeClass('overDay').css('backgroundColor', '');
				else if ( e.type == 'click' )		$(currDay).stop().addClass('selectedDay');
				sDate.setDate( sDate.getDate() + 1 );
			}
			if (e.type == 'click') {
				opt.day = osDate;
				opt.callback( osDate, di );
				$(opt._target).data('day', opt.day).data('days', di);
			}
		});
	}
})(jQuery);

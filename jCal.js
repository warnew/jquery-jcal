/*
 * jCal calendar multi-day and multi-month datepicker plugin for jQuery
 * Author: Jim Palmer
 * Released under MIT license.
 */
(function($) {
	$.fn.jCal = function (opt) {
		$.jCal(this, opt);
	}
	$.jCal = function (target, opt) {
		opt = $.extend({
			day:			new Date(),
			days:			1,
			showMonths:		1,
			sDate:			new Date(),
			eDate:			new Date(),
			dCheck:			function (day) { return true; },
			callback:		function (day, days) { return true; },
			selectedBG:		'rgb(0, 143, 214)',
			defaultBG:		'rgb(255, 255, 255)',
			_target:		target,
			ml:				['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			ms:				['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			dow:			['S', 'M', 'T', 'W', 'T', 'F', 'S']
		}, opt);
		opt.day.setDate(1);
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
			
		$(target).find('.jCal .left').bind("click",
			function (e) {
				if ($('.jCalMask', opt._target).length > 0) return false;
				var mD = { w:0, h:0 };
				$('.jCalMo', opt._target).each( function () { 
						mD.w += $(this).width() + parseInt($(this).css('padding-left')) + parseInt($(this).css('padding-right')); 
						var cH = $(this).height() + parseInt($(this).css('padding-top')) + parseInt($(this).css('padding-bottom')); 
						mD.h = ((cH > mD.h) ? cH : mD.h);
					} );
				$(opt._target).prepend('<div class="jCalMo"></div>');

				opt.day = new Date( $('.day[id^=' + opt.cID + 'd_]:first', opt._target).attr('id').replace(opt.cID + 'd_', '').replace(/_/g, '/') );
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
						$(this).children('.jCalMo:not(:last)').clone(true).appendTo( $(opt._target) );
						$('.jCalSpace, .jCalMask', opt._target).empty().remove();
					});
			});


		$(target).find('.jCal .right').bind("click", 
			function (e) {
				if ($('.jCalMask', opt._target).length > 0) return false;
				var mD = { w:0, h:0 };
				$('.jCalMo', opt._target).each( function () { 
						mD.w += $(this).width() + parseInt($(this).css('padding-left')) + parseInt($(this).css('padding-right')); 
						var cH = $(this).height() + parseInt($(this).css('padding-top')) + parseInt($(this).css('padding-bottom')); 
						mD.h = ((cH > mD.h) ? cH : mD.h);
					} );
				$(opt._target).append('<div class="jCalMo"></div>');

				opt.day = new Date( $('.day[id^=' + opt.cID + 'd_]:last', opt._target).attr('id').replace(opt.cID + 'd_', '').replace(/_/g, '/') );
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
						$(this).children('.jCalMo:not(:first)').clone(true).appendTo( $(opt._target) );
						$('.jCalSpace, .jCalMask', opt._target).empty().remove();
					});
			});
			
	}

	function drawCal (target, opt) {
		for (var ds in opt.dow)
			$(target).append('<div class="dow">' + opt.dow[ds] + '</div>');
		var fd = new Date( new Date( opt.day.getTime() ).setDate(1) );
		var ldlm = new Date( new Date( fd.getTime() ).setDate(0) );
		var ld = new Date( new Date( new Date( fd.getTime() ).setMonth( fd.getMonth() + 1 ) ).setDate(0) );
		for (var d=1; d < ( fd.getDay() + ld.getDate() + ( 7 - ld.getDay() ) ); d++)
			$(target).append(
				(( d <= fd.getDay() ) ? 
					'<div id="' + opt.cID + 'd' + d + '" class="pday">' + ( ldlm.getDate() - ( fd.getDay() - d ) ) + '</div>' 
					: ( ( d > ( fd.getDay() + ld.getDate() ) ) ?
						'<div id="' + opt.cID + 'd' + d + '" class="aday">' + ( d - ( fd.getDay() + ld.getDate() ) ) + '</div>' 
						: '<div id="' + opt.cID + 'd_' + (fd.getMonth() + 1) + '_' + ( d - fd.getDay() ) + '_' + fd.getFullYear() + '" class="' +
							( ( opt.dCheck( new Date( (new Date( fd.getTime() )).setDate( d - fd.getDay() ) ) ) ) ? 'day' : 'invday' ) +
							'">' + ( d - fd.getDay() )  + '</div>'
					) 
				)
			);
		$(target).find('div[id^=' + opt.cID + 'd]:first, div[id^=' + opt.cID + 'd]:nth-child(7n+2)').before( '<br style="clear:both; font-size:0.1em;" />' );
		$(target).find('div[id^=' + opt.cID + 'd_]:not(.invday)').bind("mouseover mouseout click", function(e){
			if ($('.jCalMask', opt._target).length > 0) return false;
			var osDate = new Date ( $(this).attr('id').replace(/c[0-9]{1,}d_([0-9]{1,2})_([0-9]{1,2})_([0-9]{4})/, '$1/$2/$3') );
			var sDate = new Date ( osDate.getTime() );
			if (e.type == 'click') 
				$('div[id^=' + opt.cID + 'd_].selectedDay', $(opt._target).parent()).removeClass('selectedDay').animate(
					{ backgroundColor:opt.defaultBG }, 'fast', function () {
						$(this).css('backgroundColor', '');
					});
			for (var di=0; di < opt.days; di++) {
				var currDay = $(opt._target).find('#' + opt.cID + 'd_' + ( sDate.getMonth() + 1 ) + '_' + sDate.getDate() + '_' + sDate.getFullYear());
				if ( currDay == null || $(currDay).hasClass('invday') ) break;
				$(currDay).toggleClass( ( (e.type == 'click') ? 'selectedDay' : 'overDay' ) );
				if (e.type == 'click') $(currDay).stop().animate({ backgroundColor:opt.selectedBG }, 'fast', function () {
					$(this).css('backgroundColor', opt.selectedBG); 
				});
				else $(currDay).css('backgroundColor', '').stop();
				sDate.setDate( sDate.getDate() + 1 );
			}
			if (e.type == 'click') opt.callback( osDate, di );
		});
	}
})(jQuery);
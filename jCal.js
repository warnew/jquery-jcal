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
			ml:			['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			ms:			['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			dow:			['S', 'M', 'T', 'W', 'T', 'F', 'S']
		}, opt);
		opt.day.setDate(1);
		$(target).stop().empty();
		for (var sm=0; sm < opt.showMonths; sm++)
			$(target).append('<div class="jCalMo"></div>');
		opt.cID = 'c' + $('.jCalMo').length;
		$(target).find('.jCalMo').each(
			function (ind) {
				drawCal($(this), $.extend( {}, opt, { 'ind':ind, 
						'day':new Date( new Date( opt.day.getTime() ).setMonth( new Date( opt.day.getTime() ).getMonth() + ind ) ) }
					));
			}
		);
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
		$(target).find('div[id^=' + opt.cID + 'd]:first, div[id^=' + opt.cID + 'd]:nth-child(7n+1)').before( '<br style="clear:both; font-size:0.1em;" />' );
		$(target).prepend( '<div style="' + ( (opt.ind == 0) ? 'text-align:left;' : 
					( (opt.ind == ( opt.showMonths - 1 )) ? 'text-align:right;' : '' ) ) + '">' + 
				'<div class="jCal">' + 
					( (opt.ind == 0) ? '<span class="left"><img src="_left.gif"></span>' : '' ) + 
					'<span class="month">' + opt.ml[opt.day.getMonth()] + ' ' + opt.day.getFullYear() + '</span>' +
					( (opt.ind == ( opt.showMonths - 1 )) ? '<span class="right"><img src="_right.gif"></span>' : '' ) +
				'</div>' +
			'</div>');
		$(target).find('.jCal .left').bind("click", function (e) {
				opt.day.setMonth( opt.day.getMonth() - 1);
				$.jCal($(target).parent(), opt);
			});
		$(target).find('.jCal .right').bind("click", function (e) {
				opt.day.setMonth( opt.day.getMonth() + ( (opt.showMonths == 1) ? 1 : 0 ) );
				$.jCal($(target).parent(), opt);
			});
		$(target).find('div[id^=' + opt.cID + 'd_]:not(.invday)').bind("mouseover mouseout click", function(e){
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

function renderCal ( target, cal ) {

	// get day to start jCal on
	var startCalDate = currDate,
		arrDate = $('#arriveCal').data('day'),
		depDate = $('#departCal').data('day');

	if ( advDate.getTime() > startCalDate.getTime() )
		startCalDate = advDate;

	if ( arrDate && arrDate.getTime() > startCalDate.getTime() )
		startCalDate = arrDate;

/* XXX - we will always focus on the arrival date
	if ( depDate && cal == 'departCal' && depDate.getTime() > startCalDate.getTime() )
		startCalDate = depDate;
*/

	// load the 2mo calendar
	$('#' + cal).jCal({
		day:			startCalDate,
		days:			1,
		showMonths:		2,
		monthSelect:	false,
		scrollSpeed:	120,
		drawBack:		function () {

				// remove any highlighted text
				if ( document.selection && typeof(document.selection.empty) != 'undefined' )
					document.selection.empty();
				else if ( typeof(window.getSelection) === 'function' && typeof(window.getSelection().removeAllRanges) === 'function' )
					window.getSelection().removeAllRanges();

				// ensure clicking on the jCal parent or children it will not throw the inputs blur event
				$(this._target).unbind('click').bind('click', this._target,
					function (e) {
						$(e.data).stop();
						$(target).focus();
					}
				);

				// select arrival date
				if ( arrDate && cal == 'departCal' )
					$('#' + cal + ' [id*=' + ( arrDate.getMonth() + 1 ) + '_' + arrDate.getDate() + '_' + arrDate.getFullYear() + ']')
						.addClass('selectedDay');

				// select days in between
				if ( arrDate && depDate ) {
					var sDate = new Date ( arrDate.getTime() );
					for ( var di = 0, ds = Math.round( ( depDate.getTime() - arrDate.getTime() ) / 86400000 ); di < ds; di++ ) {
						var currDay = $('#' + cal + ' [id*=' + ( sDate.getMonth() + 1 ) + '_' + sDate.getDate() + '_' + sDate.getFullYear() + ']');
						if ( ! $(currDay).hasClass('selectedDay') )
							$(currDay).stop().addClass('selectedDay');
						sDate.setDate( sDate.getDate() + 1 );
					}
				}

				// select departure date
				if ( depDate && cal == 'arriveCal' )
					$('#' + cal + ' [id*=' + ( depDate.getMonth() + 1 ) + '_' + depDate.getDate() + '_' + depDate.getFullYear() + ']')
						.addClass('selectedDay');

				// draw focus back to the input
				$(target).focus();

			},
		dCheck:			function (day) {

				if ( day.getTime() < (advDate).getTime() )		// 3day advance
					return 'invday';
				else
					return 'day';
/* XXX - no need to shade those outside
					return 'day' +
						( ( arrDate && cal == 'departCal' && day.getTime() < arrDate.getTime() )
							? ' outDay' : '' ) +
						( ( depDate && cal == 'arriveCal' && day.getTime() > depDate.getTime() )
							? ' outDay' : '' );
*/
			},
		callback:		function ( day, days, clickedDay ) {

				$(target).val( ( day.getMonth() + 1 ) + '/' + day.getDate() + '/' + day.getFullYear() );

				// show warning for selecting days outside of itinerary range
/* XXX - no need to fire out of range events
				if ( clickedDay && ( $(clickedDay).hasClass('outDay') || $(clickedDay).nextAll('div:lt(' + ( days - 1 ) + ')').hasClass('outDay') ) )
					alert('outside of range');
*/

				if ( typeof $(this._target).data('day') == 'object' &&
					 $(this._target).data('day').getTime() == day.getTime() &&
					 $(this._target).data('days') == days )
					return false;

				// clear if arrival > departure || departure < arrival
				if ( cal == 'arriveCal' && $('#departCal').data('day') && day.getTime() > $('#departCal').data('day').getTime() ) {
					$('#depDate').val('');
					$('#departCal').data('day','');
				}
				if ( cal == 'departCal' && $('#arriveCal').data('day') && day.getTime() < $('#arriveCal').data('day').getTime() ) {
					$('#arrDate').val('');
					$('#arriveCal').data('day','');
				}

				// hide with valid new day onclick
				$(this._target).empty().css('display','none').removeShadow();

				return true;

			}
		});

// hilights from departure date to arrival
if ( cal == 'departCal' && arrDate )
	$('#departCal .day').bind('mouseover mouseout click', {_target:this._target,otherDate:arrDate},
		function (e) {
			var osDate = new Date ( $(this).attr('id').replace(/c[0-9]{1,}d_([0-9]{1,2})_([0-9]{1,2})_([0-9]{4})/, '$1/$2/$3') );
			var sDate = new Date ( osDate.getTime() );
			for ( var di = Math.round( ( osDate.getTime() - arrDate.getTime() ) / 86400000 ); di >= 0; di-- ) {
				var currDay = $(e.data._target).find('[id*=' + ( sDate.getMonth() + 1 ) + '_' + sDate.getDate() + '_' + sDate.getFullYear() + ']');
				if ( currDay.length == 0 || $(currDay).hasClass('invday') ) break;
				if ( e.type == 'mouseover' )		$(currDay).addClass('overDay');
				else if ( e.type == 'mouseout' )	$(currDay).stop().removeClass('overDay');
				else if ( e.type == 'click' )		$(currDay).stop().addClass('selectedDay');
				sDate.setDate( sDate.getDate() - 1 );
			}
		}
	);

// hilights arrival to set departure date
if ( cal == 'arriveCal' && depDate )
	$('#arriveCal .day').bind('mouseover mouseout click', {_target:this._target,otherDate:depDate},
		function (e) {
			var osDate = new Date ( $(this).attr('id').replace(/c[0-9]{1,}d_([0-9]{1,2})_([0-9]{1,2})_([0-9]{4})/, '$1/$2/$3') );
			var sDate = new Date ( osDate.getTime() );
			for ( var di = 0, ds = Math.round( ( depDate.getTime() - osDate.getTime() ) / 86400000 ); di <= ds; di++ ) {
				var currDay = $(e.data._target).find('[id*=' + ( sDate.getMonth() + 1 ) + '_' + sDate.getDate() + '_' + sDate.getFullYear() + ']');
				if ( currDay.length == 0 || $(currDay).hasClass('invday') ) break;
				if ( e.type == 'mouseover' )		$(currDay).addClass('overDay');
				else if ( e.type == 'mouseout' )	$(currDay).stop().removeClass('overDay');
				else if ( e.type == 'click' )		$(currDay).stop().addClass('selectedDay');
				sDate.setDate( sDate.getDate() + 1 );
			}
		}
	);

	// this is the global blur to hide the current cal
	$(target).unbind('blur').bind('blur', {cal:cal},
		function ( e ) {
			if ( $('#' + e.data.cal + ' .jCalMove').length == 0 ) {
				$('#' + e.data.cal).animate({'opacity':1}, 200,
					function () {
						$('#' + e.data.cal).css('display','none');
						$('#' + e.data.cal).empty().removeShadow();
					}
				);
			}
		}
	);

}

function showCalPicker ( target, cal ) {

	if ( $('#' + cal).css('display') == 'none' ) {
		// show cal
		renderCal(target, cal);
		// calculate top positioning
		var pickerTop = $(target).position().top + $(target).height() + 8;
		// stop previous animations + calculate positioning + show
		$('#' + cal).stop().css({left:$(target).position().left + 'px',top:pickerTop + 'px',display:'block'}).dropShadow({color:'#808080'});
		// make sure it's always on top
		$('#' + cal).css( 'z-index', ( ( parseInt( $(target).css('z-index') ) || 1110 ) + 10 ) );
	}

	$(document).keyup(function(e){
	    if (e.keyCode == 27) {
	        $('#arriveCal, #departCal').css('display','none');
			$('#arriveCal, #departCal').empty().removeShadow();
		}
	});

	// ensure focus is on the input
	$(target).focus();
	
	// scrollTo - ensure you have the jQuery.ScrollTo plugin installed from http://flesler.blogspot.com/
	$.scrollTo( $( '#' + cal ), 500 );

}
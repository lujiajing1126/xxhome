define(function(require, exports, module) {
	var $ = SUI.$;
	exports.getBoardList = function(orgId, session) {
		return $.globalResponseHandler({
			url:'/api/event_board/anyway/list_board?session='+session,
			//url: '/api/org/' + orgId + '/list_owned_event_boards?session=' + session,
			dataType: 'json',
			type:"GET"
		});
	};
	exports.addToBoard = function(eventId, session, targetName) {
		return $.globalResponseHandler({
			url: '/api/event/' + eventId + '/target/add',
			data: {
				session: session,
				board_name: targetName
			},
			type: 'post',
			dataType: 'json'
		});
	};
	exports.getBoardApplicationEvents = function(boardName, session, skip, limit) {
		return $.globalResponseHandler({
			url: '/api/event_board/' + encodeURI(boardName) + '/list_waiting_events?session=' + session + '&skip=' + skip + '&limit=' + limit,
			dataType: 'json',
		});
	};
	exports.acceptAct = function(eventId, boardName, session) {
		return $.globalResponseHandler({
			url: '/api/event_board/' + encodeURI(boardName) + '/accept',
			type: 'post',
			dataType: 'json',
			data: {
				session: session,
				eventId: eventId
			}
		});

	};
	exports.rejectAct = function(eventId, boardName, session, message) {
		return $.globalResponseHandler({
			url: '/api/event_board/' + encodeURI(boardName) + '/reject',
			type: 'post',
			dataType: 'json',
			data: {
				session: session,
				eventId: eventId,
				message: message
			}
		});
	};
	exports.getBoardPublishedEvents = function(boardName, session, skip, limit) {
		return $.globalResponseHandler({
			url: '/api/event_board/' + encodeURI(boardName) + '/list_published_events?session=' + session + '&skip=' + skip + '&limit=' + limit,
			dataType: 'json'
		});
	};
});
!function(){var deps=["jquery"];define("sui/core/common",deps,function(a){
	SUI.$=a("jquery");
	/**
	 * Hack jQuery to support dataTransfer
	 * contributed by: jquery.ndd
	 */
	var originalFix = SUI.$.event.fix;
	SUI.$.event.fix = function(event) {
    	event = originalFix.apply(this, [event]);
	    if( event.type.indexOf('drag') == 0 || event.type.indexOf('drop') == 0 ) {
	        event.dataTransfer = event.originalEvent.dataTransfer;
	    }
	    return event;
	}
})}();
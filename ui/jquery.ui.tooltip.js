/*
 * jQuery UI Tooltip @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Tooltip
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 */
(function( $ ) {

var increments = 0;

$.widget( "ui.tooltip", {
	version: "@VERSION",
	options: {
<<<<<<< HEAD
		items: "[title]",
=======
>>>>>>> datepicker-hh
		content: function() {
			return $(this).attr("title");
		},
		hide: true,
		items: "[title]",
		position: {
			my: "left+15 center",
			at: "right center",
			collision: "flip fit"
		},
		show: true,
		tooltipClass: null,

		// callbacks
		close: null,
		open: null
	},

	_create: function() {
<<<<<<< HEAD
		var self = this;
		this.tooltip = $("<div></div>")
			.attr("id", "ui-tooltip-" + increments++)
			.attr("role", "tooltip")
			.attr("aria-hidden", "true")
			.addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content")
			.appendTo(document.body)
			.hide();
		this.tooltipContent = $("<div></div>")
			.addClass("ui-tooltip-content")
			.appendTo(this.tooltip);
		this.opacity = this.tooltip.css("opacity");
		this.element
			.bind("focus.tooltip mouseover.tooltip", function(event) {
				self.open( event );
			})
			.bind("blur.tooltip mouseout.tooltip", function(event) {
				self.close( event );
			});
=======
		this._bind({
			mouseover: "open",
			focusin: "open"
		});

		// IDs of generated tooltips, needed for destroy
		this.tooltips = {};
>>>>>>> datepicker-hh
	},

	_setOption: function( key, value ) {
		if ( key === "disabled" ) {
			this[ value ? "_disable" : "_enable" ]();
			this.options[ key ] = value;
			// disable element style changes
			return;
		}
		this._super( "_setOption", key, value );
	},
<<<<<<< HEAD
	
	disable: function() {
		this.options.disabled = true;
	},
	
	_destroy: function() {
		this.tooltip.remove();
	},
	
	widget: function() {
		return this.element.pushStack(this.tooltip.get());
	},
	
	open: function(event) {
		var target = $(event && event.target || this.element).closest(this.options.items);
		if ( !target.length ) {
			return;
		}
		// already visible? possible when both focus and mouseover events occur
		if (this.current && this.current[0] == target[0])
			return;
		var self = this;
		this.current = target;
		this.currentTitle = target.attr("title");
		var content = this.options.content.call(target[0], function(response) {
			// IE may instantly serve a cached response, need to give it a chance to finish with _open before that
			setTimeout(function() {
				// ignore async responses that come in after the tooltip is already hidden
				if (self.current == target)
					self._open(event, target, response);
			}, 13);
=======

	_disable: function() {
		var that = this;

		// close open tooltips
		$.each( this.tooltips, function( id, element ) {
			var event = $.Event( "blur" );
			event.target = event.currentTarget = element[0];
			that.close( event, true );
		});

		// remove title attributes to prevent native tooltips
		this.element.find( this.options.items ).andSelf().each(function() {
			var element = $( this );
			if ( element.is( "[title]" ) ) {
				element
					.data( "tooltip-title", element.attr( "title" ) )
					.attr( "title", "" );
			}
		});
	},

	_enable: function() {
		// restore title attributes
		this.element.find( this.options.items ).andSelf().each(function() {
			var element = $( this );
			if ( element.data( "tooltip-title" ) ) {
				element.attr( "title", element.data( "tooltip-title" ) );
			}
		});
	},

	open: function( event ) {
		var content,
			that = this,
			target = $( event ? event.target : this.element )
				.closest( this.options.items );

		// if aria-describedby exists, then the tooltip is already open
		if ( !target.length || target.attr( "aria-describedby" ) ) {
			return;
		}

		if ( !target.data( "tooltip-title" ) ) {
			target.data( "tooltip-title", target.attr( "title" ) );
		}

		content = this.options.content.call( target[0], function( response ) {
			// IE may instantly serve a cached response for ajax requests
			// delay this call to _open so the other call to _open runs first
			setTimeout(function() {
				that._open( event, target, response );
			}, 1 );
>>>>>>> datepicker-hh
		});
		if ( content ) {
			that._open( event, target, content );
		}
	},
<<<<<<< HEAD
	
	_open: function(event, target, content) {
		if (!content)
			return;
		
		target.attr("title", "");
		
		if (this.options.disabled)
			return;
			
		this.tooltipContent.html(content);
		this.tooltip.css({
			top: 0,
			left: 0
		}).show().position( $.extend({
			of: target
		}, this.options.position )).hide();
		
		this.tooltip.attr("aria-hidden", "false");
		target.attr("aria-describedby", this.tooltip.attr("id"));
=======

	_open: function( event, target, content ) {
		if ( !content ) {
			return;
		}

		// if we have a title, clear it to prevent the native tooltip
		// we have to check first to avoid defining a title if none exists
		// (we don't want to cause an element to start matching [title])
		// TODO: document why we don't use .removeAttr()
		if ( target.is( "[title]" ) ) {
			target.attr( "title", "" );
		}

		// ajaxy tooltip can update an existing one
		var tooltip = this._find( target );
		if ( !tooltip.length ) {
			tooltip = this._tooltip( target );
			target.attr( "aria-describedby", tooltip.attr( "id" ) );
		}
		tooltip.find( ".ui-tooltip-content" ).html( content );
		tooltip
			.stop( true )
			.position( $.extend({
				of: target
			}, this.options.position ) )
			.hide();
>>>>>>> datepicker-hh

		this._show( tooltip, this.options.show );

		this._trigger( "open", event, { tooltip: tooltip } );

		this._bind( target, {
			mouseleave: "close",
			blur: "close"
		});
	},
<<<<<<< HEAD
	
	close: function(event) {
		if (!this.current)
			return;
		
		var current = this.current;
		this.current = null;
		current.attr("title", this.currentTitle);
		
		if (this.options.disabled)
			return;
		
=======

	close: function( event, force ) {
		var that = this,
			target = $( event ? event.currentTarget : this.element ),
			tooltip = this._find( target );

		// don't close if the element has focus
		// this prevents the tooltip from closing if you hover while focused
		if ( !force && document.activeElement === target[0] ) {
			return;
		}

		// only set title if we had one before (see comment in _open())
		if ( target.data( "tooltip-title" ) ) {
			target.attr( "title", target.data( "tooltip-title" ) );
		}

		target.removeAttr( "aria-describedby" );

>>>>>>> datepicker-hh
		tooltip.stop( true );
		this._hide( tooltip, this.options.hide, function() {
			$( this ).remove();
			delete that.tooltips[ this.id ];
		});
<<<<<<< HEAD
		
		this.tooltip.stop(false, true).fadeOut();
		
		this._trigger( "close", event );
=======

		target.unbind( "mouseleave.tooltip blur.tooltip" );

		this._trigger( "close", event, { tooltip: tooltip } );
	},

	_tooltip: function( element ) {
		var id = "ui-tooltip-" + increments++,
			tooltip = $( "<div>" )
				.attr({
					id: id,
					role: "tooltip"
				})
				.addClass( "ui-tooltip ui-widget ui-corner-all ui-widget-content " +
					( this.options.tooltipClass || "" ) );
		$( "<div>" )
			.addClass( "ui-tooltip-content" )
			.appendTo( tooltip );
		tooltip.appendTo( document.body );
		if ( $.fn.bgiframe ) {
			tooltip.bgiframe();
		}
		this.tooltips[ id ] = element;
		return tooltip;
	},

	_find: function( target ) {
		var id = target.attr( "aria-describedby" );
		return id ? $( "#" + id ) : $();
	},

	_destroy: function() {
		$.each( this.tooltips, function( id ) {
			$( "#" + id ).remove();
		});
>>>>>>> datepicker-hh
	}
});

}( jQuery ) );

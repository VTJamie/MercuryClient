/*global $, define, require*/

define(['jquery', 'jquerymobile', 'backbone', 'pagemenuitemview', 'hbs!pagemenutemplate', 'app'], function ($, jqM, Backbone, PageMenuItemView, PageMenuTemplate, App) {"use strict";
	var C = {

	}, PageMenuView = Backbone.View.extend({
		initialize: function (options) {

			this.options = $.extend({}, options);
			debug.log(this.options);
			this.model = this.options.model;
		},

		render: function () {			
			this.$el.empty().html(PageMenuTemplate(this.model.toJSON()));
			var curmodel, curview, $thisul = this.$el.find('> ul');		
			for (var idx = 0; idx < this.model.length; idx++) {
				curmodel = this.model.at(idx);
				curview = new PageMenuItemView();
				curview.model = curmodel;
				$thisul.append(curview.render());
			}			
			this.$el.trigger('create');
			return this.el;
		},
		attributes: {
			'data-role': 'navbar',
			'data-theme': 'a',			
			'class': 'ui-bar'
		}
	});
	return PageMenuView;
});

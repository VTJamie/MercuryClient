/*global $, define, require, window, debug*/

define(['jquery', 'jquerymobile', 'backbone', 'app', 'basecontrolview', 'hbs!buttontemplate', 'submitrequestmodel', 'pagecollection', 'pageresponsebodymodel', 'complexitemlistsubmitrequestmodel', 'refreshrequestmodel'], function ($, jqM, Backbone, App, BaseControlView, Template, SubmitRequestModel, PageCollection, PageResponseBodyModel, ComplexListItemSubmitRequestModel, RefreshControlsRequestModel) {
    "use strict";
    var C = {
            LABEL: "LABEL",
            ID: "ID",
            BUTTON_ALLOW_RETURN_CLICK: "BUTTON_ALLOW_RETURN_CLICK",
            BUTTON_TYPE: "BUTTON_TYPE",
            BUTTON_TYPE_SUBMIT: "BUTTON_TYPE_SUBMIT",
            BUTTON_TYPE_CANCEL: "BUTTON_TYPE_CANCEL",
            REQUEST_FIELD_ACTION_PROPERTY_NAME: "REQUEST_FIELD_ACTION_PROPERTY_NAME",
            SUBMIT_RESPONSE_ACTION_LIST: "SUBMIT_RESPONSE_ACTION_LIST",
            SUBMIT_RESPONSE_ACTION_TYPE: "SUBMIT_RESPONSE_ACTION_TYPE",
            SUBMIT_RESPONSE_ACTION_TYPE_CLOSE: "SUBMIT_RESPONSE_ACTION_TYPE_CLOSE",
            SUBMIT_RESPONSE_ACTION_TYPE_OPEN_DATA_OBJECT: "SUBMIT_RESPONSE_ACTION_TYPE_OPEN_DATA_OBJECT",
            SUBMIT_RESPONSE_ACTION_TYPE_OPEN_DATA_OBJECT_POST_VALUES: "SUBMIT_RESPONSE_ACTION_TYPE_OPEN_DATA_OBJECT_POST_VALUES",
            SUBMIT_RESPONSE_ACTION_TYPE_OPEN_DATA_OBJECT_OBJECT_NAME: "SUBMIT_RESPONSE_ACTION_TYPE_OPEN_DATA_OBJECT_OBJECT_NAME",
            SUBMIT_RESPONSE_ACTION_TYPE_OPEN_DATA_OBJECT_POST_PARAMETER_NAME: "SUBMIT_RESPONSE_ACTION_TYPE_OPEN_DATA_OBJECT_POST_PARAMETER_NAME",
            SUBMIT_RESPONSE_ACTION_TYPE_OPEN_DATA_OBJECT_POST_PARAMETER_VALUE: "SUBMIT_RESPONSE_ACTION_TYPE_OPEN_DATA_OBJECT_POST_PARAMETER_VALUE",
            ERRORS: "ERRORS",
            RESPONSE_BODY: "RESPONSE_BODY",
            IS_DIALOG: "IS_DIALOG",
            CONTROL_ARRAY: "CONTROL_ARRAY"
        },
        ButtonView = BaseControlView.extend({
            initialize: function (options) {
                BaseControlView.prototype.initialize.apply(this, arguments);
                App.vent.on('enterpressed.mercury', this.enterPressed, this);
                App.vent.on('escapepressed.mercury', this.escapePressed, this);
            },
            remove: function () {
                App.vent.off('enterpressed.mercury');
                App.vent.off('escapepressed.mercury');
            },
            events: $.extend({}, {
                'tap': "buttonClicked",
                'keyup': 'keyUp'
            }, BaseControlView.prototype.events),
            template: Template,
            render: function () {
                BaseControlView.prototype.render.apply(this, arguments);
                if (this.el.nodeName.toUpperCase() !== "BUTTON") {
                    this.setElement(this.$el.html().trim());
                }
                return this.el;
            },
            attributes: {},
            enterPressed: function (e) {
                if (this.$el.closest('.ui-page-active').size() > 0 && this.model.get(C.BUTTON_TYPE) === C.BUTTON_TYPE_SUBMIT && this.model.get(C.BUTTON_ALLOW_RETURN_CLICK)) {
                    debug.log("Button", "enter pressed");
                    this.buttonClicked(e);
                }
            },
            escapePressed: function (e) {
                if (this.$el.closest('.ui-page-active').size() > 0 && this.model.get(C.BUTTON_TYPE) === C.BUTTON_TYPE_CANCEL) {
                    debug.log("Escape", "enter pressed");
                    this.buttonClicked(e);
                }
            },
            buttonClicked: function (event) {
                var lastpage,
                    isdialog = PageResponseBodyModel.getCurrentInstance().get(C.RESPONSE_BODY).get(C.IS_DIALOG);
                function goBack() {
                    if (PageCollection.length > 0) {
                        lastpage = PageCollection.pop().get("page");
                        $.mobile.changePage($(lastpage));
                    } else {
                        window.history.back();
                    }
                }
                function handleResponseActionList(responsemodel, e) {
                    var responsebody = responsemodel.get(C.RESPONSE_BODY),
                        navigationhash = [],
                        idx,
                        curpostvalue;
                    if (responsebody.get(C.ERRORS).size() === 0) {
                        responsebody.get(C.SUBMIT_RESPONSE_ACTION_LIST).each(function (model) {
                            if (model.get(C.SUBMIT_RESPONSE_ACTION_TYPE) === C.SUBMIT_RESPONSE_ACTION_TYPE_CLOSE) {
                                goBack();
                                if (event) {
                                    event.preventDefault();
                                }
                            } else if (model.get(C.SUBMIT_RESPONSE_ACTION_TYPE) === C.SUBMIT_RESPONSE_ACTION_TYPE_OPEN_DATA_OBJECT) {

                                navigationhash.push(model.get(C.SUBMIT_RESPONSE_ACTION_TYPE_OPEN_DATA_OBJECT_OBJECT_NAME));
                                for (idx = 0; idx < model.get(C.SUBMIT_RESPONSE_ACTION_TYPE_OPEN_DATA_OBJECT_POST_VALUES).length; idx += 1) {
                                    curpostvalue = model.get(C.SUBMIT_RESPONSE_ACTION_TYPE_OPEN_DATA_OBJECT_POST_VALUES).at(idx);

                                    navigationhash.push(curpostvalue.get(C.SUBMIT_RESPONSE_ACTION_TYPE_OPEN_DATA_OBJECT_POST_PARAMETER_NAME));
                                    navigationhash.push(curpostvalue.get(C.SUBMIT_RESPONSE_ACTION_TYPE_OPEN_DATA_OBJECT_POST_PARAMETER_VALUE));
                                }
                                Backbone.history.navigate(navigationhash.join("/"), {trigger: true});
                                if (event) {
                                    event.preventDefault();
                                }
                            }
                        });
                    }
                }
                if (this.model.get(C.BUTTON_TYPE) === C.BUTTON_TYPE_SUBMIT) {
                    if (isdialog) {
                        ComplexListItemSubmitRequestModel.request({
                            REQUEST_FIELD_ACTION_PROPERTY_NAME: this.model.get(C.ID)
                        }, function (model) {
                            handleResponseActionList(model, event);
                            RefreshControlsRequestModel.request({}, function (model) {return; });
                        });
                    } else {
                        SubmitRequestModel.request({
                            REQUEST_FIELD_ACTION_PROPERTY_NAME: this.model.get(C.ID)
                        }, function (model) {
                            handleResponseActionList(model, event);
                        });
                    }
                } else if (this.model.get(C.BUTTON_TYPE) === C.BUTTON_TYPE_CANCEL) {
                    goBack();
                }
            },
            keyUp: function () {
                return;
            },
            getValue: function () {
                return {};
            }
        });
    return ButtonView;
});

/*global $, define, require*/

define(['backbone', 'constantsrequestmodel', 'errorcollection', 'submitactioncollection', 'basemodel'], function (Backbone, CM, ErrorCollection, SubmitActionCollection, BaseModel) {
    "use strict";
    var C = {
            ERRORS: ErrorCollection,
            SUBMIT_RESPONSE_ACTION_LIST: SubmitActionCollection
        },
        SubmitResponseBodyModel = BaseModel.extend({
            C: $.extend({}, C, BaseModel.prototype.C)
        });

    return SubmitResponseBodyModel;
});

import $ = require('jquery');
import jqXHR = JQuery.jqXHR;
import {RESTResponse} from "../domain/rest/RESTResponse";
import {METHOD_HTTP} from "../util/Constants";

export class Model {

    public static callServer(url: string, method: string, async: boolean = true, data: Object = null): jqXHR<RESTResponse> {
        return $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            async: async,
            data: method == METHOD_HTTP.Get ? '' : JSON.stringify(data),
        });
    }
}

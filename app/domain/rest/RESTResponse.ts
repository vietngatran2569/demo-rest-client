import {RESTPagination} from "./RESTPagination";

export class RESTResponse {
    status : number;
    message: string;
    data: Object;
    pagination: RESTPagination;
}

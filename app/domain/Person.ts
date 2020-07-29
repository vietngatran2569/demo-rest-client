import {Task} from "./Task";

export class Person {
    id: number;
    name: string;
    age: number;
    salary: number;
    status: Status;
    statusStr: string;
    dob: any;
    salaryFormat: string;
    dobFormat: string;
    isHasTask: boolean;
    tasks: Task[]
}

export enum Status {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

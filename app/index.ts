import 'jquery';
import 'bootstrap';
import {Person, Status} from './domain/Person';
import {PersonService} from './service/PersonService';
import {Task} from "./domain/Task";

export class Index {
    private personService = new PersonService();

    constructor() {
        // init Service class
        // Call service
        let persons = this.personService.getAll();

        // binding data
        this.bindData(persons);

        // Init event
        this.on_click();
        this.on_change();

        Index.configUI();
    }

    private bindData(persons: Person[]): void {
        let ulEle = $('#persons');
        if (persons.length == 0) {
            ulEle.html('<div> Không có person nào</div>');
        } else {
            let content = '';
            persons.forEach((person: Person, index: number) => {
                content += `<tr>
                                <th scope="row">${index + 1}</th>
                                <td>${person.id}</td>
                                <td>${person.name}</td>
                                <td>${person.age}</td>
                                <td>${person.salaryFormat}</td>
                                <td>${person.dobFormat}</td>
                                <td>
                                    ${person.status == Status.ACTIVE ? `<span class="badge badge-success">${person.statusStr}</span>` : `<span class="badge badge-warning">${person.statusStr}</span>`} 
                                </td>
                                <td class="text-center">
                                    <button class="btn-transparent" data-toggle="tooltip" data-placement="top" id="btn-show-task" data-id="${person.id}" title="Xem công việc" >
                                        <i class="fa fa-tasks" aria-hidden="true"></i>
                                    </button> 
                                    <button class="btn-transparent" id="btn-edit-person" title="Sửa" data-toggle="tooltip" data-id="${person.id}" data-placement="top" title="Tooltip on top">
                                        <i class="fa fa-edit" aria-hidden="true"></i>
                                    </button>
                                </td>
                            </tr>`;
            });
            ulEle.html(content);
        }
    }

    private on_click(): void {
        let self = this;
        let rootPersonElm = $('#persons');

        $("#btn-search").on('click', () => {
            // @ts-ignore
            let keyword: string = $("input[name='keyword']").val();
            this.bindData(this.personService.getAll(keyword));
        });

        rootPersonElm.on('click', '#btn-show-task', function () {
            $('#taskModal').modal('show');
            let tasks = self.personService.getTasksByPersonId(Number($(this).attr('data-id')));
            let rootElm = $('#listTask');

            if (tasks.length <= 0) {
                rootElm.html(`<h3>Hiện tại không có công việc nào!</h3>`);
                return;
            }

            let content = '';
            let count = 1;
            tasks.forEach((task: Task) => {
                content += `<div class="card">
                        <div class="card-header" id="heading">
                            <div class="mb-0 text-info " style="cursor:pointer;">
                                ${task.title}
                            </div>
                        </div>

                        <div id="collapse" class="collapse">
                            <div class="card-body">
                                <h3>${task.title}</h3>
                                <hr>
                                <img src="${task.image}" alt="${task.title}" class="img-thumbnail w-100">
                                <small class="font-italic " style="text-decoration: underline;">${task.title}</small>
                                <div class="mt-3">${task.description}</div>
                            </div>
                        </div>
                    </div>`;
                count++;
            });
            rootElm.html(content);
        });

        rootPersonElm.on('click', '#btn-edit-person', function () {
            let personExist: Person = self.personService.getPerson(Number($(this).attr('data-id')));
            if (null != personExist) {
                let formElm = $('#formEditPerson');
                formElm.find('input[name="id"]').val(personExist.id);
                formElm.find('input[name="name"]').val(personExist.name);
                formElm.find('input[name="age"]').val(personExist.age);
                formElm.find('input[name="salary"]').val(personExist.salary);
                let date = Index.convertMillisecondToInputDate(personExist.dob);
                console.log(date);
                formElm.find('input[name="dob"]').val(date);
                let selectElm = formElm.find('select[name="status"]');
                selectElm.val(personExist.status);
                selectElm.prop('disabled', personExist.isHasTask);
                $('#modalEditPerson').modal('show');
            }
        });

        $('#formEditPerson #btn-update').on('click', function () {
            let formElm = $('#formEditPerson');
            let person = new Person();
            person.id = Number(formElm.find('input[name="id"]').val());
            person.name = String(formElm.find('input[name="name"]').val());
            person.age = Number(formElm.find('input[name="age"]').val());
            person.dob = formElm.find('input[name="dob"]').val();
            person.salary = Number(formElm.find('input[name="salary"]').val());
            // @ts-ignore
            person.status = formElm.find('select[name="status"] option:selected').val();
            let personResult = self.personService.update(person);
            if (personResult != null) {
                self.bindData(self.personService.getAll());
                $('#modalEditPerson').modal('hide');
            }
        });
    }

    private on_change(): void {
        $('.filter select[name="status"]').on('change', () => {
            // @ts-ignore
            let valOpt: string = $('.filter select[name="status"] option:checked').val();

            if (valOpt != 'ALL') {
                this.bindData(this.personService.getAll(undefined, valOpt));
            } else {
                this.bindData(this.personService.getAll());
            }
        })
    }

    private static configUI(): void {
        $('[data-toggle="tooltip"]').tooltip();

        $(`#listTask`).on('click', `#heading`, function () {
            if ($(this).next('.collapse').hasClass('show')) {
                $(this).next('.collapse').toggleClass('show');
                return;
            }
            $('#listTask .collapse').removeClass('show');
            $(this).next('.collapse').toggleClass('show');
        });
    }

    private static convertMillisecondToInputDate(value: number): string {
        let date = new Date(value);
        return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate()}`;
    }
}

$(document).ready(function () {
    new Index();
});

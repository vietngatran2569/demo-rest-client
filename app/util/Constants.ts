const BASE_URL = "http://localhost:2020/api_v1";

export const ENDPOINT = {
    person: {
        findAll: `${BASE_URL}/person`,
        findOne: `${BASE_URL}/person/{**?}`,
        update: `${BASE_URL}/person/update`
    },
    task: {
        findByPersonId: `${BASE_URL}/task?personId={**?}`
    }
};

export const METHOD_HTTP = {
    Get: 'GET',
    Post: 'POST',
    Put: 'PUT'
};

export enum LOAD_DATA_MODE {
    Cache, Refresh
}

export enum HTTP_STATUS {
    OK = 200,
    NOT_FOUND = 404,
    BAD_REQUEST = 400,
}

export let setEmpInfo = (info) => {
    return {
        type: 'setEmpInfo',
        payload: info
    };
}

export let getClients = (info) => {
    return {
        type: 'getClients',
        payload: info
    };
}

export const updateClients = (data) => {
    return {
      type: 'updateClients',
      payload: data
    };
};

export const deleteClient = (id) => {
    return {
      type: 'deleteClient',
      payload: id
    };
};

export let addClient = (data) => {
    return {
      type: 'addClient',
      payload: data
    };
};
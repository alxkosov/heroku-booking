import makeRequest from './helpers/makeRequest';
import "regenerator-runtime/runtime";

async function all(params){
    let data = await makeRequest(`/rooms${params}`);
    return data;
}

async function one(id){
    let data = await makeRequest(`/rooms/${id}`);
    return data;
}

async function add(room){
    let data = await makeRequest('/rooms/', {
        method: 'POST',
        body: JSON.stringify({...room}),
        headers:{
            'Content-Type': 'application/json'
            }
    });

    return data;
}

async function edit(id, room){
    let data = await makeRequest(`/rooms/${id}`, {
        method: 'PUT',
        body: JSON.stringify(room),
        headers:{
            'Content-Type': 'application/json'
            }
    });
    return data;
} 

async function remove(id){
    let data = await makeRequest(`/rooms/${id}`, {
        method: 'DELETE'
    });

    return data;
}


export { all, one, add, edit, remove };

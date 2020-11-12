import makeRequest from './helpers/makeRequest';
import "regenerator-runtime/runtime";

//GET /posts?_sort=views&_order=asc
async function all(params){
    let data = await makeRequest(`/types${params}`);
    return data;
}
//http://localhost:3000/rooms?_expand=type&typeId=2
async function one(id){
    let data = await makeRequest(`/types/${id}`);
    return data;
}

async function add(type){
    let data = await makeRequest('/types/', {
        method: 'POST',
        body: JSON.stringify({...type}),
        headers:{
            'Content-Type': 'application/json'
            }
    });

    return data;
}

async function edit(id, type){
    let data = await makeRequest(`/types/${id}`, {
        method: 'PUT',
        body: JSON.stringify(type),
        headers:{
            'Content-Type': 'application/json'
            }
    });
    return data;
} 

async function remove(id){
    let data = await makeRequest(`/types/${id}`, {
        method: 'DELETE'
    });

    return data;
}


export { all, one, add, edit, remove };

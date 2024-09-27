import { validUsers } from './validate-data.js'; 

function searchAllUsers(users, searchField, searchValue) {
    return users.find(user => {
        const value = user[searchField];

        if (typeof value === 'string' && typeof searchValue === 'string') {
            return value.toLowerCase().includes(searchValue.toLowerCase());
        }

        return value === searchValue;
    });
}

// const searchParam = "age"; 
// const searchVal = "35";

// const searchParam = "note";
// const searchVal = "old lady";

const searchParam = "full_name";
const searchVal = "Elias";

const foundUsers = searchAllUsers(validUsers, searchParam, searchVal);
console.log(foundUsers);

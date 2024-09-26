import { allUsers } from './format-data.js';

function filterUsers(users, filterParams) {
    return users.filter(user => {
        return (
            (!filterParams.country || user.country === filterParams.country) &&
            (!filterParams.age || user.age === filterParams.age) &&
            (!filterParams.gender || user.gender.toLowerCase() === filterParams.gender.toLowerCase()) &&
            (filterParams.favorite === undefined || user.favorite === filterParams.favorite)
        );
    });
}

const filterParams = {
    country: 'Australia',
    age: 46,
    gender: 'male',
    favorite: false
};

const filteredUsers = filterUsers(allUsers, filterParams);

console.log(filteredUsers);

import { validUsers } from './validate-data.js';

export function filterUsers(users, filterParams) {
    return users.filter(user => {
        return (
            (!filterParams.country || user.country === filterParams.country) &&
            (!filterParams.age || user.age === filterParams.age) &&
            (!filterParams.gender || user.gender.toLocaleLowerCase() === filterParams.gender.toLocaleLowerCase()) &&
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

const filteredUsers = filterUsers(validUsers, filterParams);

console.log(filteredUsers);

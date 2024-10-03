import { validUsers } from './validUsers.js';

export function filterUsers(users, filterParams) {
    return users.filter(user => {

        let ageMatch = true;
        if (filterParams.age) {
            const { minAge, maxAge } = filterParams.age;
            ageMatch = user.age >= minAge && user.age <= maxAge;
        }

        return (
            (!filterParams.country || user.country === filterParams.country) &&
            ageMatch &&
            (!filterParams.gender || user.gender.toLocaleLowerCase() === filterParams.gender.toLocaleLowerCase()) &&
            (filterParams.favorite === undefined || user.favorite === filterParams.favorite)
        );
    });
}

const filterParams = {
    country: 'Ireland',
    age: 55,
    gender: 'male',
    favorite: false
};

const filteredUsers = filterUsers(validUsers, filterParams);

console.log(filteredUsers);

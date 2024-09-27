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

function calculatePercentage(users, searchField, condition) {
    const matchingUsers = users.filter(user => {
        const val = user[searchField]; 

        if (typeof val === 'string') {
            return condition(val.toLowerCase());
        }

        return condition(val);
    });
    
    const totalUsersNum = users.length;
    const matchingNum = matchingUsers.length; 
    return parseFloat(((matchingNum / totalUsersNum) * 100).toFixed(1));
}

// const matchParam = "age"
// const condition = val => val => 35;
// const condition = val => val < 35;

// const matchParam = "country"
// const condition = val => val === 'germany'; 

const matchParam = "course"
const condition = val => val === 'mathematics'; 

const percentage = calculatePercentage(validUsers, matchParam, condition);
console.log(percentage);
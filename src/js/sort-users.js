import { validUsers } from './validate-data.js'; 

export function sortUsers(users, sortParam, asc) {

    return users.sort((a, b) => {
        const valueA = a[sortParam];
        const valueB = b[sortParam];

        if (valueA === null || valueA === undefined) return 1;
        if (valueB === null || valueB === undefined) return -1;

        if (!isNaN(valueA) && !isNaN(valueB)) return asc ? valueA - valueB : valueB - valueA;

        if (sortParam === 'b_date') {
            const dateA = new Date(valueA);
            const dateB = new Date(valueB);
            return asc ? dateA - dateB : dateB - dateA;
        }

        const strA = String(valueA || '').toLocaleLowerCase();
        const strB = String(valueB || '').toLocaleLowerCase();

        if (strA < strB) return asc ? -1 : 1;
        if (strA > strB) return asc ? 1 : -1;

        return 0;
    });
}

const ascending = true;

// const sortingField = 'full_Name';
const sortingField = 'age';
// const sortingField = 'country';
// const sortingField = 'b_day';

export const sortedUsers = sortUsers(validUsers, sortingField, ascending);

console.log(sortedUsers);
import axios from 'axios';
import { pluckTitles } from './helper.js';

async function getBooksBySubject(subject) {
    let data = [];

    try {
        const response = await axios.get(`https://openlibrary.org/subjects/${subject}.json`);
        data = response.data;
    } catch(err) {
        console.log(`Error getting books: ${err.message}`, err.stack);
    }

    return data;
}

export async function getTitlesBySubject(subject) {
    const data = await getBooksBySubject(subject);
    return pluckTitles(data);
}
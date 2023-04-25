import { getTitlesBySubject } from './books.js';

(async () => {
    const titles = await getTitlesBySubject('javascript');
    console.log(titles);
})();
import {createPool} from 'mysql2/promise';

const pool = createPool({
    host: 'localhost',
    port: '3308',
    user: 'root',
    password: '',
    database: 'stack_men'
});

export default pool;
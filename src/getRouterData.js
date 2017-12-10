import {
    info,
} from '../src/services/user';

async function getRouterData(f) {
    let data = await info();
    return f(data);
}
import test from 'ava'
import axios from 'axios';
import * as actix from '../index';

actix.get('/', (req) => {
  req.sendText("hello world");
});

actix.get('/get/name', (req) => {
  const { name } = req.getQueryParams();
  req.sendText(`your name is ${name}!`);
});

actix.get('/get/:name', (req) => {
  const { name } = req.getUrlParams();
  req.sendText(`your name is ${name}!`);
});

actix.post('/update/user', (req) => {
  const { name } = req.getBody();
  req.sendText(`your name is ${name}!`);
});

const host = '127.0.0.1:8080'
const reqHost = `http://${host}`;

actix.start(host);

test.serial('1. 测试接口连接', async (t) => {
  const res = await axios.get(`${reqHost}/`);
  t.is(res.data, 'hello world')
})

test.serial('2. get query params', async (t) => {
  const name = 'kai';
  const res = await axios.get(`${reqHost}/get/name?name=${name}`);
  t.is(res.data, `your name is ${name}!`)
})

test.serial('3. get url params', async (t) => {
  const name = 'kai';
  const res = await axios.get(`${reqHost}/get/${name}`);
  t.is(res.data, `your name is ${name}!`)
})

test.serial('4. use post body', async (t) => {
  const name = 'kai';
  const res = await axios.post(`${reqHost}/update/user`, {
    name,
  });
  t.is(res.data, `your name is ${name}!`)
})

test.serial('5. use form body', async (t) => {
  const name = 'kai';
  const res = await axios.postForm(`${reqHost}/update/user`, {
    name,
  });
  t.is(res.data, `your name is ${name}!`)
})

test.serial('6. use html form body', async (t) => {
  const name = 'kai';
  const res = await axios.post(`${reqHost}/update/user`, `name=${name}`);
  t.is(res.data, `your name is ${name}!`)
})

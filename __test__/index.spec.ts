import test from 'ava'
import axios from 'axios';
import * as actix from '../index';

actix.get('/', (req) => {
  req.sendText("hello world");
});

const host = '127.0.0.1:8080'
const reqHost = `http://${host}`;

actix.start(host);

test.serial('1. 测试接口连接', async (t) => {
  const res = await axios.get(`${reqHost}/`);
  t.is(res.data, 'hello world')
})

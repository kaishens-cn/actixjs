import test from 'ava'
import axios from 'axios';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';
import * as actix from '../index';

const host = '127.0.0.1:8080'
const reqHost = `http://${host}`;

test.before(t => {
  actix.cleanupRouter();
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

  actix.post('/update/user/xml', (req) => {
    const { name } = req.getBody();
    req.sendText(`your name is ${name['$value']}!`);
  });
  actix.start(host);
})

test.serial('1. 测试接口连接', async (t) => {
  const res = await axios.get(`${reqHost}/`);
  t.is(res.data, 'hello world')
})

test.skip('2. get query params', async (t) => {
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

test.serial('7. use form data upload file', async (t) => {
  const name = 'kai';
  const res = await axios.postForm(`${reqHost}/update/user`, {
    name,
    // file: fs.createReadStream(path.join(__dirname, './data.txt')),
    file: fs.createReadStream(path.join(__dirname, './data.xlsx')),
  });
  t.is(res.data, `your name is ${name}!`)

  t.is(fileMD5(path.join(__dirname, './data.xlsx')), fileMD5(path.join(__dirname, './static/data.xlsx')))
})

test.serial('8. post xml data', async (t) => {
  const name = 'kai';
  const res = await axios.request({
    method: 'POST',
    maxBodyLength: Infinity,
    url: `${reqHost}/update/user/xml`,
    headers: {
      'Content-Type': 'application/xml'
    },
    data: `<xml><name>${name}</name></xml>`
  });
  t.is(res.data, `your name is ${name}!`);
})

test.after(t => {
  actix.stop();
})

const fileMD5 = (filePath: string) => {
  const buffer = fs.readFileSync(filePath);
  const hash = crypto.createHash('md5');
  // @ts-ignore
  hash.update(buffer, 'utf8');
  return hash.digest('hex')
}

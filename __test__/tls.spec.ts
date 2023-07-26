import test from 'ava'
import axios from 'axios';
import * as path from 'path';
import * as actix from '../index';

const host = '127.0.0.1:8443'
const reqHost = `https://${host}`;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

test.before(t => {
  actix.cleanupRouter();
  actix.get('/', (req) => {
    req.sendText("hello world");
  });
  actix.startWithConfig({
    url: '0.0.0.0:8443',
    tls: 'true',
    cert_location: path.join(__dirname, './certs/pkcs8-cert.pem'),
    key_location: path.join(__dirname, './certs/pkcs8-key.pem')
  });
})

test.serial('1. 测试接口连接', async (t) => {
  const res = await axios.get(`${reqHost}/`);
  t.is(res.data, 'hello world')
});

test.after(t => {
  actix.stop();
})

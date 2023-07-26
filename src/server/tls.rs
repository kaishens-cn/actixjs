use std::{fs::File, io::BufReader};

use rustls::{server::ServerConfig, Certificate, PrivateKey};
use rustls_pemfile::{certs, read_one, Item};

use napi::Result;

use crate::request::helpers::make_js_error;

pub fn load_tls_certs(user_config: &super::config::ServerConfig) -> Result<ServerConfig> {
  let config = ServerConfig::builder()
    .with_safe_defaults()
    .with_no_client_auth();

  let cert_file = &mut BufReader::new(
    File::open(user_config.cert_location.as_ref().unwrap())
      .map_err(|_| make_js_error("Error loading cert file"))?,
  );
  let key_file = &mut BufReader::new(
    File::open(user_config.key_location.as_ref().unwrap())
      .map_err(|_| make_js_error("Error loading key file"))?,
  );

  let cert_chain = certs(cert_file)
    .map_err(|_| make_js_error("Error loading files"))?
    .into_iter()
    .map(Certificate)
    .collect();
  let keys = read_one(key_file).unwrap().unwrap();
  match keys {
    Item::X509Certificate(key_chain) => Ok(
      config
        .with_single_cert(cert_chain, PrivateKey(key_chain))
        .unwrap(),
    ),
    Item::RSAKey(key_chain) => Ok(
      config
        .with_single_cert(cert_chain, PrivateKey(key_chain))
        .unwrap(),
    ),
    Item::PKCS8Key(key_chain) => Ok(
      config
        .with_single_cert(cert_chain, PrivateKey(key_chain))
        .unwrap(),
    ),
    Item::ECKey(key_chain) => Ok(
      config
        .with_single_cert(cert_chain, PrivateKey(key_chain))
        .unwrap(),
    ),
    Item::Crl(key_chain) => Ok(
      config
        .with_single_cert(cert_chain, PrivateKey(key_chain))
        .unwrap(),
    ),
    _ => Err(make_js_error("Unknown certificate type")),
  }

  // if key_chain.is_empty() {
  //     return Err(make_js_error("No keys found"));
  // }
}

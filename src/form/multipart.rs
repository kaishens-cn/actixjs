use bytes::{Bytes};
use std::collections::HashMap;
use futures_codec::{BytesCodec, FramedRead};
use futures_util::{TryStreamExt};
use futures_util::io::Cursor;
use serde_json::{json, Value};
use multer::Multipart;
use crate::tokio_workers::RUNNER;
use std::fs;

fn string_to_static_str(s: String) -> &'static str {
    Box::leak(s.into_boxed_str())
}

pub fn multipart(body: Bytes, boundary: String) -> HashMap<String, Value> {
    futures::executor::block_on(async move {
        RUNNER.spawn(async move {
            let mut map: HashMap<String, Value> = HashMap::new();

            let stream = FramedRead::new(Cursor::new(body), BytesCodec)
                .map_ok(|bytes| bytes::Bytes::copy_from_slice(bytes.as_ref()));

            let mut multipart = Multipart::new(stream, string_to_static_str(boundary));

            while let Some(field) = multipart.next_field().await.unwrap() {
                let name = field.name().unwrap().to_string();
                let file_name = field.file_name();

                if file_name.is_none() {
                    let content = field.text().await.unwrap();
                    map.insert(name, Value::from(content));
                } else {
                    let filename = file_name.unwrap().to_string();
                    let content = field.bytes().await.unwrap();
                    let filepath = format!("./__test__/static/{}", filename);
                    map.insert(name, json!({ "filename": filename, "filepath":  filepath}));
                    fs::write(filepath, content).unwrap();
                }
            }

            map
        }).await.unwrap()
    })
}

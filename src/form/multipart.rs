use std::io::BufRead;
use bytes::Bytes;
use crate::form::parse::{get_boundary, get_disposition};
use std::collections::HashMap;
use std::convert::Infallible;
use std::str::Chars;
use futures_util::stream;
use serde_json::Value;
use futures_util::stream::Stream;
// Import multer types.
use multer::Multipart;
use crate::tokio_workers::RUNNER;

// async fn get_byte_stream_from_somewhere(data: &mut str) -> (impl Stream<Item = Result<Bytes, Infallible>>, &'static str) {
//     // let data = "----------------------------998975451924305363868138\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\nkai\r\n----------------------------998975451924305363868138--\r\n";
//     let d = String::from(data);
//     let stream = futures_util::stream::iter(
//         d.chars()
//             .map(|ch| ch.to_string())
//             .map(|part| Ok(Bytes::copy_from_slice(part.as_bytes()))),
//     );
//
//     (stream, "--------------------------998975451924305363868138")
// }
// fn str_stream(string: &'static str) -> impl Stream<Item = multer::Result<Bytes>> {
//     stream::iter(
//         string
//             .chars()
//             .map(|ch| ch.to_string())
//             .map(|part| Ok(Bytes::copy_from_slice(part.as_bytes()))),
//     )
// }

pub fn multipart(body: &Bytes, boundary: &str) -> HashMap<String, Value> {
    // let data = "--X-BOUNDARY--\r\n";
    // futures::executor::block_on(async move {
    //     RUNNER.spawn(async move  {
    //         let data = std::str::from_utf8(body).unwrap().clone();
    //         // // let (stream, boundary2) = get_byte_stream_from_somewhere(sre.borrow_mut()).await;
    //         // let stream = str_stream(data.chars());
    //         // let mut multipart = Multipart::new(stream, "--------------------------998975451924305363868138");
    //         // while let Some(field) = multipart.next_field().await.unwrap() {
    //         //     let name = field.name();
    //         //     println!("{:?}", name);
    //         //     let content = field.text().await.unwrap();
    //         //     println!("Content: {:?}", content);
    //         // }
    //         println!("{}", data);
    //         HashMap::new()
    //     }).await.unwrap()
    // })

    // let data = std::str::from_utf8(body).unwrap().clone();

    match std::str::from_utf8(body) {
        Ok(body_str) => {
            let lines: Vec<&str> = body_str.lines().collect();
            let mut index = 0;
            let mut name = "".to_string();
            let mut map: HashMap<String, Value> = HashMap::new();
            for l in lines {
                if l == boundary.to_string() + "--" {
                    // body结尾
                    break;
                }
                if index == 2 && l != "" {
                    index = index + 1;
                    map.insert(name.clone(), Value::from(l));
                }
                if index == 1 {
                    // 解析Content-Disposition，记录name
                    name = get_disposition(l);
                    index = index + 1;
                }
                if l == "--".to_string() + boundary {
                    // 请求体起点
                    index = 1;
                }
            }
            return map;
        }
        Err(e) => HashMap::new(),
    }
}
use std::io::BufRead;
use bytes::Bytes;
use crate::form::parse::{get_boundary, get_disposition};
use std::collections::HashMap;
use serde_json::Value;

pub fn multipart(body: &Bytes, boundary: &str) -> HashMap<String, Value> {
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
        },
        Err(e) => HashMap::new(),
    }
}
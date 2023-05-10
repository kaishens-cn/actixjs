pub fn get_boundary(ct: &str) -> &str {
    if ct.len() == 0 {
        return "";
    }

    let part: Vec<&str> = ct.split("boundary=").collect();
    if part.len() == 0 {
        return "";
    }

    return part[part.len() - 1];
}

pub fn get_disposition(str: &str) -> String {
    let cd_key = "Content-Disposition:";
    let name_key = "name=\"";
    let mut key_tmp = "".to_string();
    let mut cd_value = "".to_string();
    let mut name_value = "".to_string();
    for (i, &item) in str.as_bytes().iter().enumerate() {
        let s = (item as char).to_string();
        if cd_key == key_tmp {
            if s != " " && s != ";" {
                cd_value = cd_value + &*s;
            }
            if s == ";" {
                key_tmp = "".to_string();
            }
        } else if name_key == key_tmp {
            if i != str.as_bytes().len() - 1 {
                name_value = name_value + &*s;
            }
        } else {
            if s != " " {
                key_tmp = key_tmp + &*s;
            }
        }
    }
    return name_value;
}
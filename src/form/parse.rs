use crate::form::error::Error;
use crate::form::constants::ContentDispositionAttr;

pub fn parse_boundary<T: AsRef<str>>(content_type: T) -> Result<String, Error> {
    let m = content_type
        .as_ref()
        .parse::<mime::Mime>()
        .map_err(Error::DecodeContentType)?;

    if !(m.type_() == mime::MULTIPART && m.subtype() == mime::FORM_DATA) {
        return Err(Error::NoMultipart);
    }

    m.get_param(mime::BOUNDARY)
        .map(|name| name.as_str().to_owned())
        .ok_or(Error::NoBoundary)
}

pub fn parse_disposition<T: AsRef<str>>(content: T) -> (Option<String>, Option<String>) {
    let val = content.as_ref().as_bytes();
    let name = ContentDispositionAttr::Name.extract_from(val).and_then(|attr| std::str::from_utf8(attr).ok()).map(String::from);
    let filename = ContentDispositionAttr::FileName.extract_from(val).and_then(|attr| std::str::from_utf8(attr).ok()).map(String::from);
    let content_type = ContentDispositionAttr::ContentType.extract_from(val).and_then(|attr| std::str::from_utf8(attr).ok()).map(String::from);

    println!("{:?}", content_type);
    return (name, filename);
}
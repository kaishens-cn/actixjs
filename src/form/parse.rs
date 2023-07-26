use crate::form::error::Error;

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

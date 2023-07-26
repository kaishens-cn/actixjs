// use futures::Future;
use lazy_static::lazy_static;
use tokio::runtime::{Builder, Runtime};

lazy_static! {
  pub(crate) static ref RUNNER: Runtime = {
    Builder::new_multi_thread()
      .worker_threads(4)
      .thread_name("actix-worker")
      .enable_all()
      .build()
      .unwrap()
  };
}

// pub fn spawn<F>(fut: F)
// where
//   F: 'static + Send + Future<Output = ()>,
// {
//   RUNNER.spawn(fut);
// }

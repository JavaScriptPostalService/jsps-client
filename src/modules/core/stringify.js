export const mod_stringify = (data, cb) => {
  try {
    cb(
      JSON.stringify(data)
    );
  } catch(e) {
    console.warn('attempted to send invalid data to the pubsub server.');
  }
}

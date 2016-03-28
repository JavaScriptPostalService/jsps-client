export const modStringify = (data, callback) => {
  try {
    callback(
      JSON.stringify(data)
    );
  } catch (e) {
    console.warn('attempted to send invalid data to the pubsub server.');
  }
};

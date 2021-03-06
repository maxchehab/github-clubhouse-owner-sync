import http from 'http';

export default function closeServer(server: http.Server) {
  return new Promise<void>((resolve, reject) =>
    server.close((err: Error) => {
      if (err) {
        reject(err);
      }

      resolve();
    }),
  );
}

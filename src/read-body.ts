import { IncomingMessage } from "http";

export function readJsonBody(incoming: IncomingMessage) {
  return new Promise((resolve, reject) => {
    let data = '';

    incoming.on('data', (chunk) => {
      data += chunk;
    });

    incoming.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    });

    incoming.on('error', (error) => {
      reject(error);
    });
  });
}
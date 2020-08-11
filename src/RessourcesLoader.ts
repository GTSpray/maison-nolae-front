declare var ActiveXObject: (type: string) => void;

export enum HttpMethod {
  CONNECT = "CONNECT",
  DELETE = "DELETE",
  GET = "GET",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
  PATCH = "PATCH",
  POST = "POST",
  PUT = "PUT",
  TRACE = "TRACE"
}

export interface RequestOptions {
  headers?: { [key: string]: string };
  timeout?: number;
  params?: Object;
  responseType?: XMLHttpRequestResponseType;
  method: HttpMethod;
  url: string;
}

export default class RessourcesLoader {
  static getXMLHttpRequest(): XMLHttpRequest | null {
    var xhr = null;
    if (window.XMLHttpRequest || window.ActiveXObject) {
      if (window.ActiveXObject) {
        try {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
          xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
      } else {
        xhr = new XMLHttpRequest();
      }
    } else {
      console.error(
        "Votre navigateur ne supporte pas l'objet XMLHTTPRequest..."
      );
      return null;
    }

    return xhr;
  }

  static httpRequest(opts: RequestOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr = RessourcesLoader.getXMLHttpRequest() as XMLHttpRequest;

      if (opts.responseType) xhr.responseType = opts.responseType;
      if (opts.timeout) xhr.timeout = opts.timeout;

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            opts,
            status: xhr.status,
            statusText: xhr.statusText
          });
        }
      });

      xhr.addEventListener("error", () => {
        reject({
          opts,
          status: xhr.status,
          statusText: xhr.statusText
        });
      });

      let params = "";
      if (opts.params) {
        params = Object.keys(opts.params)
          .map(
            (key) =>
              encodeURIComponent(key) +
              "=" +
              encodeURIComponent(opts.params[key])
          )
          .join("&");
      }

      switch (opts.method) {
        case HttpMethod.GET: {
          xhr.open(opts.method, `${opts.url}?${params}`);
          if (opts.headers) {
            Object.keys(opts.headers).forEach((key) =>
              xhr.setRequestHeader(key, opts.headers[key])
            );
          }
          xhr.send();
          break;
        }
        default: {
          xhr.open(opts.method, opts.url);
          if (opts.headers) {
            Object.keys(opts.headers).forEach((key) =>
              xhr.setRequestHeader(key, opts.headers[key])
            );
          }
          xhr.send(JSON.stringify(opts.params));
          break;
        }
      }
    });
  }

  static loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => {
        if (!image.complete) {
          return reject(src);
        }
        return resolve(image);
      });
      image.src = src;
    });
  }
}

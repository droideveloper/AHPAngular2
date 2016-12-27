export class Uri {

  constructor(private url: string) { }

  static create(url: string) {
    return new Uri(url);
  }

  appendPath(path: string | number): Uri {
    this.url = this.url.concat('/' + path);
    return this;
  }

  appendEncodedPath(path: string | number ): Uri {
    let encodedPath = encodeURIComponent(path.toString());
    return this.appendPath(encodeURIComponent(path + ''));
  }

  appendQuery(key: string, value: string | number): Uri {
    let first = this.url.indexOf('?') == -1;
    let prefix = first ? '?' : '&';
    this.url = this.url.concat(prefix + key + '=' + value);
    return this; 
  }

  appendEncodedQuery(key: string, value: string | number): Uri {
    let encodedKey = encodeURIComponent(key);
    let encodedValue = encodeURIComponent(value.toString());
    return this.appendQuery(encodedKey, encodedValue);
  }

  build(url: string): Uri {
    this.url = url;
    return this;
  }

  toString(): string {
    return this.url;
  }
}
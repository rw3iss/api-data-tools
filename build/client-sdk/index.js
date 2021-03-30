var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};

// src/client-sdk/index.ts
__markAsModule(exports);
__export(exports, {
  APIClient: () => APIClient_default
});

// src/client-sdk/Request.ts
function _makeRequestOptions(opts) {
  opts = opts || {};
  return opts;
}
var Request = class {
  static async get(url, headers) {
    let opts = {
      mode: "cors",
      method: "GET",
      headers,
      redirect: "follow"
    };
    opts = _makeRequestOptions(opts);
    return await fetch(url, opts);
  }
  static async post(url, data, headers) {
    let opts = {
      mode: "cors",
      body: data ? JSON.stringify(data) : void 0,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      redirect: "follow"
    };
    opts = _makeRequestOptions(opts);
    return await fetch(url, opts).catch((e) => {
      console.log("caught request", e);
    });
  }
  static async put(url, data, headers) {
    let opts = {
      mode: "cors",
      body: data ? JSON.stringify(data) : void 0,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...headers
      }
    };
    opts = _makeRequestOptions(opts);
    return await fetch(url, opts);
  }
  static async delete(url, headers) {
    let opts = {
      method: "DELETE",
      headers
    };
    opts = _makeRequestOptions(opts);
    return await fetch(url, opts);
  }
  static findError(res) {
    return res ? res.error ? res.error : res.message ? res.message : "An unknown error occurred." : "An unknown error occurred.";
  }
};
var Request_default = Request;

// src/client-sdk/HttpClient.ts
var HttpClient = class {
  get(url) {
    return this.request(url, "GET");
  }
  post(url, body) {
    return this.request(url, "POST", body);
  }
  put(url, body) {
    return this.request(url, "PUT", body);
  }
  delete(url) {
    return this.request(url, "DELETE");
  }
  async request(url, method = "GET", body = void 0, headers = void 0) {
    return new Promise((resolve, reject) => {
      let request;
      switch (method.toLowerCase()) {
        case "get":
          request = Request_default.get(url, headers);
          break;
        case "post":
          request = Request_default.post(url, body, headers);
          break;
        case "put":
          request = Request_default.put(url, body, headers);
          break;
        case "delete":
          request = Request_default.delete(url, headers);
          break;
        default:
          request = Request_default.get(url, headers);
          break;
      }
      request.then((r) => {
        if (!r.ok) {
          console.log("bad response");
          let handled = false;
          if (!handled) {
            return reject(r);
          } else {
            return resolve(false);
          }
        }
        return r.text();
      }).then((text) => {
        return text ? JSON.parse(text) : {};
      }).then((r) => {
        return resolve(r);
      }).catch((e) => {
        console.log("REQUEST ERROR", e);
        return reject("Failed to make request.");
      });
    });
  }
};
var HttpClient_default = HttpClient;

// src/client-sdk/APIClient.ts
var APIClient = class extends HttpClient_default {
  constructor(apiBase) {
    super();
    this.get = async (type, params, limit) => {
      try {
        let url = `${this.apiBase}/${type}${limit ? "?limit=" + limit : ""}`;
        return await super.get(url);
      } catch (e) {
        console.log("Client.get error", e);
        throw e;
      }
    };
    this.save = async (type, o) => {
      console.log("save");
      try {
        let url = `${this.apiBase}/${type}`;
        if (o.id)
          url += `/${o.id}`;
        return await this.post(url, o);
      } catch (e) {
        console.log("Client.save error", e);
        throw e;
      }
    };
    this.delete = async (type, params) => {
      try {
        if (!params.id)
          throw "delete requires an id parameter";
        let url = `${this.apiBase}/${type}/${params.id}`;
        return await this.delete(url);
      } catch (e) {
        debug("Client.delete error", e);
        throw e;
      }
    };
    if (!apiBase)
      throw "APIClient requires the base URI of the API as an argument.";
    console.log("APIClient initialized with:", apiBase);
    this.apiBase = apiBase;
  }
  async getOne(type, params, serialize = false) {
    console.log("getone");
    try {
      let r = await this.get(type, params, 1);
      console.log("getone response", r);
      return r.length ? r[0] : null;
    } catch (e) {
      console.log("Client.getOne error", e);
      throw e;
    }
  }
};
var APIClient_default = APIClient;
//# sourceMappingURL=index.js.map

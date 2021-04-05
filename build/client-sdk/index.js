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
var Request = class {
  static async get(url, headers) {
    let opts = {
      mode: "cors",
      method: "GET",
      headers,
      redirect: "follow"
    };
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
    return await fetch(url, opts);
  }
  static async delete(url, headers) {
    let opts = {
      method: "DELETE",
      headers
    };
    return await fetch(url, opts);
  }
  static findError(res) {
    return res ? res.error ? res.error : res.message ? res.message : "An unknown error occurred." : "An unknown error occurred.";
  }
};
var Request_default = Request;

// src/client-sdk/HttpClient.ts
var HttpClient = class {
  get(url, options) {
    return this.request(url, "GET", null, options.headers);
  }
  post(url, body, options) {
    return this.request(url, "POST", body, options.headers);
  }
  put(url, body, options) {
    return this.request(url, "PUT", body, options.headers);
  }
  delete(url, options) {
    return this.request(url, "DELETE", null, options.headers);
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
  constructor(apiBase, options) {
    super();
    this.get = async (type, params, limit) => {
      try {
        let url = `${this.apiBase}/${type}${limit ? "?limit=" + limit : ""}`;
        console.log("get", this.options);
        return await super.get(url, this.options);
      } catch (e) {
        console.log("Client.get error", e);
        throw e;
      }
    };
    this.save = async (type, o) => {
      console.log("save");
      try {
        let url = `${this.apiBase}/${type}`;
        if (o.id) {
          url += `/${o.id}`;
          return await super.put(url, o, this.options);
        } else {
          return await super.post(url, o, this.options);
        }
      } catch (e) {
        console.log("Client.save error", e);
        throw e;
      }
    };
    this.delete = async (type, params) => {
      try {
        console.log("delete >", type, params);
        if (typeof params.id == "undefined")
          throw "delete requires an id parameter";
        let url = `${this.apiBase}/${type}/${params.id}`;
        console.log("calling delete...", this.options);
        return await super.delete(url, this.options);
      } catch (e) {
        console.log("Client.delete error", e);
        throw e;
      }
    };
    if (!apiBase)
      throw "APIClient requires the base URI of the API as an argument.";
    this.apiBase = apiBase;
    this.options = options;
  }
  async getOne(type, params, serialize = false) {
    console.log("getone");
    try {
      let r = await this.get(type, params, 1);
      return r.length ? r[0] : null;
    } catch (e) {
      console.log("Client.getOne error", e);
      throw e;
    }
  }
};
var APIClient_default = APIClient;
//# sourceMappingURL=index.js.map

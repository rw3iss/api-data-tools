var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (callback, module2) => () => {
  if (!module2) {
    module2 = {exports: {}};
    callback(module2.exports, module2);
  }
  return module2.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", {value: module2, enumerable: true})), module2);
};

// node_modules/source-map/lib/base64.js
var require_base64 = __commonJS((exports2) => {
  var intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
  exports2.encode = function(number) {
    if (0 <= number && number < intToCharMap.length) {
      return intToCharMap[number];
    }
    throw new TypeError("Must be between 0 and 63: " + number);
  };
  exports2.decode = function(charCode) {
    var bigA = 65;
    var bigZ = 90;
    var littleA = 97;
    var littleZ = 122;
    var zero = 48;
    var nine = 57;
    var plus = 43;
    var slash = 47;
    var littleOffset = 26;
    var numberOffset = 52;
    if (bigA <= charCode && charCode <= bigZ) {
      return charCode - bigA;
    }
    if (littleA <= charCode && charCode <= littleZ) {
      return charCode - littleA + littleOffset;
    }
    if (zero <= charCode && charCode <= nine) {
      return charCode - zero + numberOffset;
    }
    if (charCode == plus) {
      return 62;
    }
    if (charCode == slash) {
      return 63;
    }
    return -1;
  };
});

// node_modules/source-map/lib/base64-vlq.js
var require_base64_vlq = __commonJS((exports2) => {
  var base64 = require_base64();
  var VLQ_BASE_SHIFT = 5;
  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
  var VLQ_BASE_MASK = VLQ_BASE - 1;
  var VLQ_CONTINUATION_BIT = VLQ_BASE;
  function toVLQSigned(aValue) {
    return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
  }
  function fromVLQSigned(aValue) {
    var isNegative = (aValue & 1) === 1;
    var shifted = aValue >> 1;
    return isNegative ? -shifted : shifted;
  }
  exports2.encode = function base64VLQ_encode(aValue) {
    var encoded = "";
    var digit;
    var vlq = toVLQSigned(aValue);
    do {
      digit = vlq & VLQ_BASE_MASK;
      vlq >>>= VLQ_BASE_SHIFT;
      if (vlq > 0) {
        digit |= VLQ_CONTINUATION_BIT;
      }
      encoded += base64.encode(digit);
    } while (vlq > 0);
    return encoded;
  };
  exports2.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
    var strLen = aStr.length;
    var result = 0;
    var shift = 0;
    var continuation, digit;
    do {
      if (aIndex >= strLen) {
        throw new Error("Expected more digits in base 64 VLQ value.");
      }
      digit = base64.decode(aStr.charCodeAt(aIndex++));
      if (digit === -1) {
        throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
      }
      continuation = !!(digit & VLQ_CONTINUATION_BIT);
      digit &= VLQ_BASE_MASK;
      result = result + (digit << shift);
      shift += VLQ_BASE_SHIFT;
    } while (continuation);
    aOutParam.value = fromVLQSigned(result);
    aOutParam.rest = aIndex;
  };
});

// node_modules/source-map/lib/util.js
var require_util = __commonJS((exports2) => {
  function getArg(aArgs, aName, aDefaultValue) {
    if (aName in aArgs) {
      return aArgs[aName];
    } else if (arguments.length === 3) {
      return aDefaultValue;
    } else {
      throw new Error('"' + aName + '" is a required argument.');
    }
  }
  exports2.getArg = getArg;
  var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
  var dataUrlRegexp = /^data:.+\,.+$/;
  function urlParse(aUrl) {
    var match = aUrl.match(urlRegexp);
    if (!match) {
      return null;
    }
    return {
      scheme: match[1],
      auth: match[2],
      host: match[3],
      port: match[4],
      path: match[5]
    };
  }
  exports2.urlParse = urlParse;
  function urlGenerate(aParsedUrl) {
    var url = "";
    if (aParsedUrl.scheme) {
      url += aParsedUrl.scheme + ":";
    }
    url += "//";
    if (aParsedUrl.auth) {
      url += aParsedUrl.auth + "@";
    }
    if (aParsedUrl.host) {
      url += aParsedUrl.host;
    }
    if (aParsedUrl.port) {
      url += ":" + aParsedUrl.port;
    }
    if (aParsedUrl.path) {
      url += aParsedUrl.path;
    }
    return url;
  }
  exports2.urlGenerate = urlGenerate;
  function normalize(aPath) {
    var path2 = aPath;
    var url = urlParse(aPath);
    if (url) {
      if (!url.path) {
        return aPath;
      }
      path2 = url.path;
    }
    var isAbsolute = exports2.isAbsolute(path2);
    var parts = path2.split(/\/+/);
    for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
      part = parts[i];
      if (part === ".") {
        parts.splice(i, 1);
      } else if (part === "..") {
        up++;
      } else if (up > 0) {
        if (part === "") {
          parts.splice(i + 1, up);
          up = 0;
        } else {
          parts.splice(i, 2);
          up--;
        }
      }
    }
    path2 = parts.join("/");
    if (path2 === "") {
      path2 = isAbsolute ? "/" : ".";
    }
    if (url) {
      url.path = path2;
      return urlGenerate(url);
    }
    return path2;
  }
  exports2.normalize = normalize;
  function join(aRoot, aPath) {
    if (aRoot === "") {
      aRoot = ".";
    }
    if (aPath === "") {
      aPath = ".";
    }
    var aPathUrl = urlParse(aPath);
    var aRootUrl = urlParse(aRoot);
    if (aRootUrl) {
      aRoot = aRootUrl.path || "/";
    }
    if (aPathUrl && !aPathUrl.scheme) {
      if (aRootUrl) {
        aPathUrl.scheme = aRootUrl.scheme;
      }
      return urlGenerate(aPathUrl);
    }
    if (aPathUrl || aPath.match(dataUrlRegexp)) {
      return aPath;
    }
    if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
      aRootUrl.host = aPath;
      return urlGenerate(aRootUrl);
    }
    var joined = aPath.charAt(0) === "/" ? aPath : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
    if (aRootUrl) {
      aRootUrl.path = joined;
      return urlGenerate(aRootUrl);
    }
    return joined;
  }
  exports2.join = join;
  exports2.isAbsolute = function(aPath) {
    return aPath.charAt(0) === "/" || urlRegexp.test(aPath);
  };
  function relative(aRoot, aPath) {
    if (aRoot === "") {
      aRoot = ".";
    }
    aRoot = aRoot.replace(/\/$/, "");
    var level = 0;
    while (aPath.indexOf(aRoot + "/") !== 0) {
      var index = aRoot.lastIndexOf("/");
      if (index < 0) {
        return aPath;
      }
      aRoot = aRoot.slice(0, index);
      if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
        return aPath;
      }
      ++level;
    }
    return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
  }
  exports2.relative = relative;
  var supportsNullProto = function() {
    var obj = Object.create(null);
    return !("__proto__" in obj);
  }();
  function identity(s) {
    return s;
  }
  function toSetString(aStr) {
    if (isProtoString(aStr)) {
      return "$" + aStr;
    }
    return aStr;
  }
  exports2.toSetString = supportsNullProto ? identity : toSetString;
  function fromSetString(aStr) {
    if (isProtoString(aStr)) {
      return aStr.slice(1);
    }
    return aStr;
  }
  exports2.fromSetString = supportsNullProto ? identity : fromSetString;
  function isProtoString(s) {
    if (!s) {
      return false;
    }
    var length = s.length;
    if (length < 9) {
      return false;
    }
    if (s.charCodeAt(length - 1) !== 95 || s.charCodeAt(length - 2) !== 95 || s.charCodeAt(length - 3) !== 111 || s.charCodeAt(length - 4) !== 116 || s.charCodeAt(length - 5) !== 111 || s.charCodeAt(length - 6) !== 114 || s.charCodeAt(length - 7) !== 112 || s.charCodeAt(length - 8) !== 95 || s.charCodeAt(length - 9) !== 95) {
      return false;
    }
    for (var i = length - 10; i >= 0; i--) {
      if (s.charCodeAt(i) !== 36) {
        return false;
      }
    }
    return true;
  }
  function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
    var cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0 || onlyCompareOriginal) {
      return cmp;
    }
    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }
    return strcmp(mappingA.name, mappingB.name);
  }
  exports2.compareByOriginalPositions = compareByOriginalPositions;
  function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
    var cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0 || onlyCompareGenerated) {
      return cmp;
    }
    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0) {
      return cmp;
    }
    return strcmp(mappingA.name, mappingB.name);
  }
  exports2.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
  function strcmp(aStr1, aStr2) {
    if (aStr1 === aStr2) {
      return 0;
    }
    if (aStr1 === null) {
      return 1;
    }
    if (aStr2 === null) {
      return -1;
    }
    if (aStr1 > aStr2) {
      return 1;
    }
    return -1;
  }
  function compareByGeneratedPositionsInflated(mappingA, mappingB) {
    var cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0) {
      return cmp;
    }
    return strcmp(mappingA.name, mappingB.name);
  }
  exports2.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
  function parseSourceMapInput(str) {
    return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ""));
  }
  exports2.parseSourceMapInput = parseSourceMapInput;
  function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
    sourceURL = sourceURL || "";
    if (sourceRoot) {
      if (sourceRoot[sourceRoot.length - 1] !== "/" && sourceURL[0] !== "/") {
        sourceRoot += "/";
      }
      sourceURL = sourceRoot + sourceURL;
    }
    if (sourceMapURL) {
      var parsed = urlParse(sourceMapURL);
      if (!parsed) {
        throw new Error("sourceMapURL could not be parsed");
      }
      if (parsed.path) {
        var index = parsed.path.lastIndexOf("/");
        if (index >= 0) {
          parsed.path = parsed.path.substring(0, index + 1);
        }
      }
      sourceURL = join(urlGenerate(parsed), sourceURL);
    }
    return normalize(sourceURL);
  }
  exports2.computeSourceURL = computeSourceURL;
});

// node_modules/source-map/lib/array-set.js
var require_array_set = __commonJS((exports2) => {
  var util = require_util();
  var has = Object.prototype.hasOwnProperty;
  var hasNativeMap = typeof Map !== "undefined";
  function ArraySet() {
    this._array = [];
    this._set = hasNativeMap ? new Map() : Object.create(null);
  }
  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
    var set = new ArraySet();
    for (var i = 0, len = aArray.length; i < len; i++) {
      set.add(aArray[i], aAllowDuplicates);
    }
    return set;
  };
  ArraySet.prototype.size = function ArraySet_size() {
    return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
  };
  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
    var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
    var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
    var idx = this._array.length;
    if (!isDuplicate || aAllowDuplicates) {
      this._array.push(aStr);
    }
    if (!isDuplicate) {
      if (hasNativeMap) {
        this._set.set(aStr, idx);
      } else {
        this._set[sStr] = idx;
      }
    }
  };
  ArraySet.prototype.has = function ArraySet_has(aStr) {
    if (hasNativeMap) {
      return this._set.has(aStr);
    } else {
      var sStr = util.toSetString(aStr);
      return has.call(this._set, sStr);
    }
  };
  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
    if (hasNativeMap) {
      var idx = this._set.get(aStr);
      if (idx >= 0) {
        return idx;
      }
    } else {
      var sStr = util.toSetString(aStr);
      if (has.call(this._set, sStr)) {
        return this._set[sStr];
      }
    }
    throw new Error('"' + aStr + '" is not in the set.');
  };
  ArraySet.prototype.at = function ArraySet_at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
    }
    throw new Error("No element indexed by " + aIdx);
  };
  ArraySet.prototype.toArray = function ArraySet_toArray() {
    return this._array.slice();
  };
  exports2.ArraySet = ArraySet;
});

// node_modules/source-map/lib/mapping-list.js
var require_mapping_list = __commonJS((exports2) => {
  var util = require_util();
  function generatedPositionAfter(mappingA, mappingB) {
    var lineA = mappingA.generatedLine;
    var lineB = mappingB.generatedLine;
    var columnA = mappingA.generatedColumn;
    var columnB = mappingB.generatedColumn;
    return lineB > lineA || lineB == lineA && columnB >= columnA || util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
  }
  function MappingList() {
    this._array = [];
    this._sorted = true;
    this._last = {generatedLine: -1, generatedColumn: 0};
  }
  MappingList.prototype.unsortedForEach = function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };
  MappingList.prototype.add = function MappingList_add(aMapping) {
    if (generatedPositionAfter(this._last, aMapping)) {
      this._last = aMapping;
      this._array.push(aMapping);
    } else {
      this._sorted = false;
      this._array.push(aMapping);
    }
  };
  MappingList.prototype.toArray = function MappingList_toArray() {
    if (!this._sorted) {
      this._array.sort(util.compareByGeneratedPositionsInflated);
      this._sorted = true;
    }
    return this._array;
  };
  exports2.MappingList = MappingList;
});

// node_modules/source-map/lib/source-map-generator.js
var require_source_map_generator = __commonJS((exports2) => {
  var base64VLQ = require_base64_vlq();
  var util = require_util();
  var ArraySet = require_array_set().ArraySet;
  var MappingList = require_mapping_list().MappingList;
  function SourceMapGenerator(aArgs) {
    if (!aArgs) {
      aArgs = {};
    }
    this._file = util.getArg(aArgs, "file", null);
    this._sourceRoot = util.getArg(aArgs, "sourceRoot", null);
    this._skipValidation = util.getArg(aArgs, "skipValidation", false);
    this._sources = new ArraySet();
    this._names = new ArraySet();
    this._mappings = new MappingList();
    this._sourcesContents = null;
  }
  SourceMapGenerator.prototype._version = 3;
  SourceMapGenerator.fromSourceMap = function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot
    });
    aSourceMapConsumer.eachMapping(function(mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };
      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util.relative(sourceRoot, newMapping.source);
        }
        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };
        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }
      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function(sourceFile) {
      var sourceRelative = sourceFile;
      if (sourceRoot !== null) {
        sourceRelative = util.relative(sourceRoot, sourceFile);
      }
      if (!generator._sources.has(sourceRelative)) {
        generator._sources.add(sourceRelative);
      }
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };
  SourceMapGenerator.prototype.addMapping = function SourceMapGenerator_addMapping(aArgs) {
    var generated = util.getArg(aArgs, "generated");
    var original = util.getArg(aArgs, "original", null);
    var source = util.getArg(aArgs, "source", null);
    var name = util.getArg(aArgs, "name", null);
    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }
    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }
    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }
    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source,
      name
    });
  };
  SourceMapGenerator.prototype.setSourceContent = function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util.relative(this._sourceRoot, source);
    }
    if (aSourceContent != null) {
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      delete this._sourcesContents[util.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };
  SourceMapGenerator.prototype.applySourceMap = function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(`SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`);
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    if (sourceRoot != null) {
      sourceFile = util.relative(sourceRoot, sourceFile);
    }
    var newSources = new ArraySet();
    var newNames = new ArraySet();
    this._mappings.unsortedForEach(function(mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util.join(aSourceMapPath, mapping.source);
          }
          if (sourceRoot != null) {
            mapping.source = util.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }
      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }
      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }
    }, this);
    this._sources = newSources;
    this._names = newNames;
    aSourceMapConsumer.sources.forEach(function(sourceFile2) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile2);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile2 = util.join(aSourceMapPath, sourceFile2);
        }
        if (sourceRoot != null) {
          sourceFile2 = util.relative(sourceRoot, sourceFile2);
        }
        this.setSourceContent(sourceFile2, content);
      }
    }, this);
  };
  SourceMapGenerator.prototype._validateMapping = function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource, aName) {
    if (aOriginal && typeof aOriginal.line !== "number" && typeof aOriginal.column !== "number") {
      throw new Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");
    }
    if (aGenerated && "line" in aGenerated && "column" in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) {
      return;
    } else if (aGenerated && "line" in aGenerated && "column" in aGenerated && aOriginal && "line" in aOriginal && "column" in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) {
      return;
    } else {
      throw new Error("Invalid mapping: " + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };
  SourceMapGenerator.prototype._serializeMappings = function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = "";
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;
    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = "";
      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ";";
          previousGeneratedLine++;
        }
      } else {
        if (i > 0) {
          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ",";
        }
      }
      next += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;
      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;
        next += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;
        next += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;
        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }
      result += next;
    }
    return result;
  };
  SourceMapGenerator.prototype._generateSourcesContent = function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function(source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util.relative(aSourceRoot, source);
      }
      var key = util.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key) ? this._sourcesContents[key] : null;
    }, this);
  };
  SourceMapGenerator.prototype.toJSON = function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }
    return map;
  };
  SourceMapGenerator.prototype.toString = function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };
  exports2.SourceMapGenerator = SourceMapGenerator;
});

// node_modules/source-map/lib/binary-search.js
var require_binary_search = __commonJS((exports2) => {
  exports2.GREATEST_LOWER_BOUND = 1;
  exports2.LEAST_UPPER_BOUND = 2;
  function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
    var mid = Math.floor((aHigh - aLow) / 2) + aLow;
    var cmp = aCompare(aNeedle, aHaystack[mid], true);
    if (cmp === 0) {
      return mid;
    } else if (cmp > 0) {
      if (aHigh - mid > 1) {
        return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
      }
      if (aBias == exports2.LEAST_UPPER_BOUND) {
        return aHigh < aHaystack.length ? aHigh : -1;
      } else {
        return mid;
      }
    } else {
      if (mid - aLow > 1) {
        return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
      }
      if (aBias == exports2.LEAST_UPPER_BOUND) {
        return mid;
      } else {
        return aLow < 0 ? -1 : aLow;
      }
    }
  }
  exports2.search = function search(aNeedle, aHaystack, aCompare, aBias) {
    if (aHaystack.length === 0) {
      return -1;
    }
    var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare, aBias || exports2.GREATEST_LOWER_BOUND);
    if (index < 0) {
      return -1;
    }
    while (index - 1 >= 0) {
      if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
        break;
      }
      --index;
    }
    return index;
  };
});

// node_modules/source-map/lib/quick-sort.js
var require_quick_sort = __commonJS((exports2) => {
  function swap(ary, x, y) {
    var temp = ary[x];
    ary[x] = ary[y];
    ary[y] = temp;
  }
  function randomIntInRange(low, high) {
    return Math.round(low + Math.random() * (high - low));
  }
  function doQuickSort(ary, comparator, p, r) {
    if (p < r) {
      var pivotIndex = randomIntInRange(p, r);
      var i = p - 1;
      swap(ary, pivotIndex, r);
      var pivot = ary[r];
      for (var j = p; j < r; j++) {
        if (comparator(ary[j], pivot) <= 0) {
          i += 1;
          swap(ary, i, j);
        }
      }
      swap(ary, i + 1, j);
      var q = i + 1;
      doQuickSort(ary, comparator, p, q - 1);
      doQuickSort(ary, comparator, q + 1, r);
    }
  }
  exports2.quickSort = function(ary, comparator) {
    doQuickSort(ary, comparator, 0, ary.length - 1);
  };
});

// node_modules/source-map/lib/source-map-consumer.js
var require_source_map_consumer = __commonJS((exports2) => {
  var util = require_util();
  var binarySearch = require_binary_search();
  var ArraySet = require_array_set().ArraySet;
  var base64VLQ = require_base64_vlq();
  var quickSort = require_quick_sort().quickSort;
  function SourceMapConsumer(aSourceMap, aSourceMapURL) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === "string") {
      sourceMap = util.parseSourceMapInput(aSourceMap);
    }
    return sourceMap.sections != null ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL) : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
  }
  SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
    return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
  };
  SourceMapConsumer.prototype._version = 3;
  SourceMapConsumer.prototype.__generatedMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, "_generatedMappings", {
    configurable: true,
    enumerable: true,
    get: function() {
      if (!this.__generatedMappings) {
        this._parseMappings(this._mappings, this.sourceRoot);
      }
      return this.__generatedMappings;
    }
  });
  SourceMapConsumer.prototype.__originalMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, "_originalMappings", {
    configurable: true,
    enumerable: true,
    get: function() {
      if (!this.__originalMappings) {
        this._parseMappings(this._mappings, this.sourceRoot);
      }
      return this.__originalMappings;
    }
  });
  SourceMapConsumer.prototype._charIsMappingSeparator = function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };
  SourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };
  SourceMapConsumer.GENERATED_ORDER = 1;
  SourceMapConsumer.ORIGINAL_ORDER = 2;
  SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
  SourceMapConsumer.LEAST_UPPER_BOUND = 2;
  SourceMapConsumer.prototype.eachMapping = function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
    var mappings;
    switch (order) {
      case SourceMapConsumer.GENERATED_ORDER:
        mappings = this._generatedMappings;
        break;
      case SourceMapConsumer.ORIGINAL_ORDER:
        mappings = this._originalMappings;
        break;
      default:
        throw new Error("Unknown order of iteration.");
    }
    var sourceRoot = this.sourceRoot;
    mappings.map(function(mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
      return {
        source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };
  SourceMapConsumer.prototype.allGeneratedPositionsFor = function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, "line");
    var needle = {
      source: util.getArg(aArgs, "source"),
      originalLine: line,
      originalColumn: util.getArg(aArgs, "column", 0)
    };
    needle.source = this._findSourceIndex(needle.source);
    if (needle.source < 0) {
      return [];
    }
    var mappings = [];
    var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];
      if (aArgs.column === void 0) {
        var originalLine = mapping.originalLine;
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, "generatedLine", null),
            column: util.getArg(mapping, "generatedColumn", null),
            lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
          });
          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;
        while (mapping && mapping.originalLine === line && mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, "generatedLine", null),
            column: util.getArg(mapping, "generatedColumn", null),
            lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
          });
          mapping = this._originalMappings[++index];
        }
      }
    }
    return mappings;
  };
  exports2.SourceMapConsumer = SourceMapConsumer;
  function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === "string") {
      sourceMap = util.parseSourceMapInput(aSourceMap);
    }
    var version = util.getArg(sourceMap, "version");
    var sources = util.getArg(sourceMap, "sources");
    var names = util.getArg(sourceMap, "names", []);
    var sourceRoot = util.getArg(sourceMap, "sourceRoot", null);
    var sourcesContent = util.getArg(sourceMap, "sourcesContent", null);
    var mappings = util.getArg(sourceMap, "mappings");
    var file = util.getArg(sourceMap, "file", null);
    if (version != this._version) {
      throw new Error("Unsupported version: " + version);
    }
    if (sourceRoot) {
      sourceRoot = util.normalize(sourceRoot);
    }
    sources = sources.map(String).map(util.normalize).map(function(source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source) ? util.relative(sourceRoot, source) : source;
    });
    this._names = ArraySet.fromArray(names.map(String), true);
    this._sources = ArraySet.fromArray(sources, true);
    this._absoluteSources = this._sources.toArray().map(function(s) {
      return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
    });
    this.sourceRoot = sourceRoot;
    this.sourcesContent = sourcesContent;
    this._mappings = mappings;
    this._sourceMapURL = aSourceMapURL;
    this.file = file;
  }
  BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
  BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
  BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util.relative(this.sourceRoot, relativeSource);
    }
    if (this._sources.has(relativeSource)) {
      return this._sources.indexOf(relativeSource);
    }
    var i;
    for (i = 0; i < this._absoluteSources.length; ++i) {
      if (this._absoluteSources[i] == aSource) {
        return i;
      }
    }
    return -1;
  };
  BasicSourceMapConsumer.fromSourceMap = function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);
    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(), smc.sourceRoot);
    smc.file = aSourceMap._file;
    smc._sourceMapURL = aSourceMapURL;
    smc._absoluteSources = smc._sources.toArray().map(function(s) {
      return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
    });
    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];
    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping();
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;
      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;
        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }
        destOriginalMappings.push(destMapping);
      }
      destGeneratedMappings.push(destMapping);
    }
    quickSort(smc.__originalMappings, util.compareByOriginalPositions);
    return smc;
  };
  BasicSourceMapConsumer.prototype._version = 3;
  Object.defineProperty(BasicSourceMapConsumer.prototype, "sources", {
    get: function() {
      return this._absoluteSources.slice();
    }
  });
  function Mapping() {
    this.generatedLine = 0;
    this.generatedColumn = 0;
    this.source = null;
    this.originalLine = null;
    this.originalColumn = null;
    this.name = null;
  }
  BasicSourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;
    while (index < length) {
      if (aStr.charAt(index) === ";") {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      } else if (aStr.charAt(index) === ",") {
        index++;
      } else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);
        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }
          if (segment.length === 2) {
            throw new Error("Found a source, but no line and column");
          }
          if (segment.length === 3) {
            throw new Error("Found a source and line, but no column");
          }
          cachedSegments[str] = segment;
        }
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;
        if (segment.length > 1) {
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          mapping.originalLine += 1;
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;
          if (segment.length > 4) {
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }
        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === "number") {
          originalMappings.push(mapping);
        }
      }
    }
    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;
    quickSort(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };
  BasicSourceMapConsumer.prototype._findMapping = function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName, aColumnName, aComparator, aBias) {
    if (aNeedle[aLineName] <= 0) {
      throw new TypeError("Line must be greater than or equal to 1, got " + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError("Column must be greater than or equal to 0, got " + aNeedle[aColumnName]);
    }
    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };
  BasicSourceMapConsumer.prototype.computeColumnSpans = function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];
        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }
      mapping.lastGeneratedColumn = Infinity;
    }
  };
  BasicSourceMapConsumer.prototype.originalPositionFor = function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, "line"),
      generatedColumn: util.getArg(aArgs, "column")
    };
    var index = this._findMapping(needle, this._generatedMappings, "generatedLine", "generatedColumn", util.compareByGeneratedPositionsDeflated, util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
    if (index >= 0) {
      var mapping = this._generatedMappings[index];
      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, "source", null);
        if (source !== null) {
          source = this._sources.at(source);
          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
        }
        var name = util.getArg(mapping, "name", null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source,
          line: util.getArg(mapping, "originalLine", null),
          column: util.getArg(mapping, "originalColumn", null),
          name
        };
      }
    }
    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };
  BasicSourceMapConsumer.prototype.hasContentsOfAllSources = function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(sc) {
      return sc == null;
    });
  };
  BasicSourceMapConsumer.prototype.sourceContentFor = function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }
    var index = this._findSourceIndex(aSource);
    if (index >= 0) {
      return this.sourcesContent[index];
    }
    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util.relative(this.sourceRoot, relativeSource);
    }
    var url;
    if (this.sourceRoot != null && (url = util.urlParse(this.sourceRoot))) {
      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
      if (url.scheme == "file" && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)];
      }
      if ((!url.path || url.path == "/") && this._sources.has("/" + relativeSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
    }
    if (nullOnMissing) {
      return null;
    } else {
      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
    }
  };
  BasicSourceMapConsumer.prototype.generatedPositionFor = function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, "source");
    source = this._findSourceIndex(source);
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }
    var needle = {
      source,
      originalLine: util.getArg(aArgs, "line"),
      originalColumn: util.getArg(aArgs, "column")
    };
    var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
    if (index >= 0) {
      var mapping = this._originalMappings[index];
      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, "generatedLine", null),
          column: util.getArg(mapping, "generatedColumn", null),
          lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
        };
      }
    }
    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };
  exports2.BasicSourceMapConsumer = BasicSourceMapConsumer;
  function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === "string") {
      sourceMap = util.parseSourceMapInput(aSourceMap);
    }
    var version = util.getArg(sourceMap, "version");
    var sections = util.getArg(sourceMap, "sections");
    if (version != this._version) {
      throw new Error("Unsupported version: " + version);
    }
    this._sources = new ArraySet();
    this._names = new ArraySet();
    var lastOffset = {
      line: -1,
      column: 0
    };
    this._sections = sections.map(function(s) {
      if (s.url) {
        throw new Error("Support for url field in sections not implemented.");
      }
      var offset = util.getArg(s, "offset");
      var offsetLine = util.getArg(offset, "line");
      var offsetColumn = util.getArg(offset, "column");
      if (offsetLine < lastOffset.line || offsetLine === lastOffset.line && offsetColumn < lastOffset.column) {
        throw new Error("Section offsets must be ordered and non-overlapping.");
      }
      lastOffset = offset;
      return {
        generatedOffset: {
          generatedLine: offsetLine + 1,
          generatedColumn: offsetColumn + 1
        },
        consumer: new SourceMapConsumer(util.getArg(s, "map"), aSourceMapURL)
      };
    });
  }
  IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
  IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
  IndexedSourceMapConsumer.prototype._version = 3;
  Object.defineProperty(IndexedSourceMapConsumer.prototype, "sources", {
    get: function() {
      var sources = [];
      for (var i = 0; i < this._sections.length; i++) {
        for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
          sources.push(this._sections[i].consumer.sources[j]);
        }
      }
      return sources;
    }
  });
  IndexedSourceMapConsumer.prototype.originalPositionFor = function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, "line"),
      generatedColumn: util.getArg(aArgs, "column")
    };
    var sectionIndex = binarySearch.search(needle, this._sections, function(needle2, section2) {
      var cmp = needle2.generatedLine - section2.generatedOffset.generatedLine;
      if (cmp) {
        return cmp;
      }
      return needle2.generatedColumn - section2.generatedOffset.generatedColumn;
    });
    var section = this._sections[sectionIndex];
    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }
    return section.consumer.originalPositionFor({
      line: needle.generatedLine - (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn - (section.generatedOffset.generatedLine === needle.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
      bias: aArgs.bias
    });
  };
  IndexedSourceMapConsumer.prototype.hasContentsOfAllSources = function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function(s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };
  IndexedSourceMapConsumer.prototype.sourceContentFor = function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    } else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };
  IndexedSourceMapConsumer.prototype.generatedPositionFor = function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      if (section.consumer._findSourceIndex(util.getArg(aArgs, "source")) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line + (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column + (section.generatedOffset.generatedLine === generatedPosition.line ? section.generatedOffset.generatedColumn - 1 : 0)
        };
        return ret;
      }
    }
    return {
      line: null,
      column: null
    };
  };
  IndexedSourceMapConsumer.prototype._parseMappings = function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];
        var source = section.consumer._sources.at(mapping.source);
        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
        this._sources.add(source);
        source = this._sources.indexOf(source);
        var name = null;
        if (mapping.name) {
          name = section.consumer._names.at(mapping.name);
          this._names.add(name);
          name = this._names.indexOf(name);
        }
        var adjustedMapping = {
          source,
          generatedLine: mapping.generatedLine + (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn + (section.generatedOffset.generatedLine === mapping.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name
        };
        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === "number") {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }
    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort(this.__originalMappings, util.compareByOriginalPositions);
  };
  exports2.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
});

// node_modules/source-map/lib/source-node.js
var require_source_node = __commonJS((exports2) => {
  var SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
  var util = require_util();
  var REGEX_NEWLINE = /(\r?\n)/;
  var NEWLINE_CODE = 10;
  var isSourceNode = "$$$isSourceNode$$$";
  function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
    this.children = [];
    this.sourceContents = {};
    this.line = aLine == null ? null : aLine;
    this.column = aColumn == null ? null : aColumn;
    this.source = aSource == null ? null : aSource;
    this.name = aName == null ? null : aName;
    this[isSourceNode] = true;
    if (aChunks != null)
      this.add(aChunks);
  }
  SourceNode.fromStringWithSourceMap = function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    var node = new SourceNode();
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var remainingLinesIndex = 0;
    var shiftNextLine = function() {
      var lineContents = getNextLine();
      var newLine = getNextLine() || "";
      return lineContents + newLine;
      function getNextLine() {
        return remainingLinesIndex < remainingLines.length ? remainingLines[remainingLinesIndex++] : void 0;
      }
    };
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;
    var lastMapping = null;
    aSourceMapConsumer.eachMapping(function(mapping) {
      if (lastMapping !== null) {
        if (lastGeneratedLine < mapping.generatedLine) {
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
        } else {
          var nextLine = remainingLines[remainingLinesIndex] || "";
          var code = nextLine.substr(0, mapping.generatedColumn - lastGeneratedColumn);
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn - lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          lastMapping = mapping;
          return;
        }
      }
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[remainingLinesIndex] || "";
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    if (remainingLinesIndex < remainingLines.length) {
      if (lastMapping) {
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      node.add(remainingLines.splice(remainingLinesIndex).join(""));
    }
    aSourceMapConsumer.sources.forEach(function(sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });
    return node;
    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === void 0) {
        node.add(code);
      } else {
        var source = aRelativePath ? util.join(aRelativePath, mapping.source) : mapping.source;
        node.add(new SourceNode(mapping.originalLine, mapping.originalColumn, source, code, mapping.name));
      }
    }
  };
  SourceNode.prototype.add = function SourceNode_add(aChunk) {
    if (Array.isArray(aChunk)) {
      aChunk.forEach(function(chunk) {
        this.add(chunk);
      }, this);
    } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      if (aChunk) {
        this.children.push(aChunk);
      }
    } else {
      throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
    }
    return this;
  };
  SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
    if (Array.isArray(aChunk)) {
      for (var i = aChunk.length - 1; i >= 0; i--) {
        this.prepend(aChunk[i]);
      }
    } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      this.children.unshift(aChunk);
    } else {
      throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
    }
    return this;
  };
  SourceNode.prototype.walk = function SourceNode_walk(aFn) {
    var chunk;
    for (var i = 0, len = this.children.length; i < len; i++) {
      chunk = this.children[i];
      if (chunk[isSourceNode]) {
        chunk.walk(aFn);
      } else {
        if (chunk !== "") {
          aFn(chunk, {
            source: this.source,
            line: this.line,
            column: this.column,
            name: this.name
          });
        }
      }
    }
  };
  SourceNode.prototype.join = function SourceNode_join(aSep) {
    var newChildren;
    var i;
    var len = this.children.length;
    if (len > 0) {
      newChildren = [];
      for (i = 0; i < len - 1; i++) {
        newChildren.push(this.children[i]);
        newChildren.push(aSep);
      }
      newChildren.push(this.children[i]);
      this.children = newChildren;
    }
    return this;
  };
  SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
    var lastChild = this.children[this.children.length - 1];
    if (lastChild[isSourceNode]) {
      lastChild.replaceRight(aPattern, aReplacement);
    } else if (typeof lastChild === "string") {
      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
    } else {
      this.children.push("".replace(aPattern, aReplacement));
    }
    return this;
  };
  SourceNode.prototype.setSourceContent = function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
  };
  SourceNode.prototype.walkSourceContents = function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }
    var sources = Object.keys(this.sourceContents);
    for (var i = 0, len = sources.length; i < len; i++) {
      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  };
  SourceNode.prototype.toString = function SourceNode_toString() {
    var str = "";
    this.walk(function(chunk) {
      str += chunk;
    });
    return str;
  };
  SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
    var generated = {
      code: "",
      line: 1,
      column: 0
    };
    var map = new SourceMapGenerator(aArgs);
    var sourceMappingActive = false;
    var lastOriginalSource = null;
    var lastOriginalLine = null;
    var lastOriginalColumn = null;
    var lastOriginalName = null;
    this.walk(function(chunk, original) {
      generated.code += chunk;
      if (original.source !== null && original.line !== null && original.column !== null) {
        if (lastOriginalSource !== original.source || lastOriginalLine !== original.line || lastOriginalColumn !== original.column || lastOriginalName !== original.name) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
        lastOriginalSource = original.source;
        lastOriginalLine = original.line;
        lastOriginalColumn = original.column;
        lastOriginalName = original.name;
        sourceMappingActive = true;
      } else if (sourceMappingActive) {
        map.addMapping({
          generated: {
            line: generated.line,
            column: generated.column
          }
        });
        lastOriginalSource = null;
        sourceMappingActive = false;
      }
      for (var idx = 0, length = chunk.length; idx < length; idx++) {
        if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
          generated.line++;
          generated.column = 0;
          if (idx + 1 === length) {
            lastOriginalSource = null;
            sourceMappingActive = false;
          } else if (sourceMappingActive) {
            map.addMapping({
              source: original.source,
              original: {
                line: original.line,
                column: original.column
              },
              generated: {
                line: generated.line,
                column: generated.column
              },
              name: original.name
            });
          }
        } else {
          generated.column++;
        }
      }
    });
    this.walkSourceContents(function(sourceFile, sourceContent) {
      map.setSourceContent(sourceFile, sourceContent);
    });
    return {code: generated.code, map};
  };
  exports2.SourceNode = SourceNode;
});

// node_modules/source-map/source-map.js
var require_source_map = __commonJS((exports2) => {
  exports2.SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
  exports2.SourceMapConsumer = require_source_map_consumer().SourceMapConsumer;
  exports2.SourceNode = require_source_node().SourceNode;
});

// node_modules/buffer-from/index.js
var require_buffer_from = __commonJS((exports2, module2) => {
  var toString = Object.prototype.toString;
  var isModern = typeof Buffer.alloc === "function" && typeof Buffer.allocUnsafe === "function" && typeof Buffer.from === "function";
  function isArrayBuffer(input) {
    return toString.call(input).slice(8, -1) === "ArrayBuffer";
  }
  function fromArrayBuffer(obj, byteOffset, length) {
    byteOffset >>>= 0;
    var maxLength = obj.byteLength - byteOffset;
    if (maxLength < 0) {
      throw new RangeError("'offset' is out of bounds");
    }
    if (length === void 0) {
      length = maxLength;
    } else {
      length >>>= 0;
      if (length > maxLength) {
        throw new RangeError("'length' is out of bounds");
      }
    }
    return isModern ? Buffer.from(obj.slice(byteOffset, byteOffset + length)) : new Buffer(new Uint8Array(obj.slice(byteOffset, byteOffset + length)));
  }
  function fromString(string, encoding) {
    if (typeof encoding !== "string" || encoding === "") {
      encoding = "utf8";
    }
    if (!Buffer.isEncoding(encoding)) {
      throw new TypeError('"encoding" must be a valid string encoding');
    }
    return isModern ? Buffer.from(string, encoding) : new Buffer(string, encoding);
  }
  function bufferFrom(value, encodingOrOffset, length) {
    if (typeof value === "number") {
      throw new TypeError('"value" argument must not be a number');
    }
    if (isArrayBuffer(value)) {
      return fromArrayBuffer(value, encodingOrOffset, length);
    }
    if (typeof value === "string") {
      return fromString(value, encodingOrOffset);
    }
    return isModern ? Buffer.from(value) : new Buffer(value);
  }
  module2.exports = bufferFrom;
});

// node_modules/source-map-support/source-map-support.js
var require_source_map_support = __commonJS((exports2, module2) => {
  var SourceMapConsumer = require_source_map().SourceMapConsumer;
  var path2 = require("path");
  var fs2;
  try {
    fs2 = require("fs");
    if (!fs2.existsSync || !fs2.readFileSync) {
      fs2 = null;
    }
  } catch (err) {
  }
  var bufferFrom = require_buffer_from();
  function dynamicRequire(mod, request) {
    return mod.require(request);
  }
  var errorFormatterInstalled = false;
  var uncaughtShimInstalled = false;
  var emptyCacheBetweenOperations = false;
  var environment = "auto";
  var fileContentsCache = {};
  var sourceMapCache = {};
  var reSourceMap = /^data:application\/json[^,]+base64,/;
  var retrieveFileHandlers = [];
  var retrieveMapHandlers = [];
  function isInBrowser() {
    if (environment === "browser")
      return true;
    if (environment === "node")
      return false;
    return typeof window !== "undefined" && typeof XMLHttpRequest === "function" && !(window.require && window.module && window.process && window.process.type === "renderer");
  }
  function hasGlobalProcessEventEmitter() {
    return typeof process === "object" && process !== null && typeof process.on === "function";
  }
  function handlerExec(list) {
    return function(arg) {
      for (var i = 0; i < list.length; i++) {
        var ret = list[i](arg);
        if (ret) {
          return ret;
        }
      }
      return null;
    };
  }
  var retrieveFile = handlerExec(retrieveFileHandlers);
  retrieveFileHandlers.push(function(path3) {
    path3 = path3.trim();
    if (/^file:/.test(path3)) {
      path3 = path3.replace(/file:\/\/\/(\w:)?/, function(protocol, drive) {
        return drive ? "" : "/";
      });
    }
    if (path3 in fileContentsCache) {
      return fileContentsCache[path3];
    }
    var contents = "";
    try {
      if (!fs2) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", path3, false);
        xhr.send(null);
        if (xhr.readyState === 4 && xhr.status === 200) {
          contents = xhr.responseText;
        }
      } else if (fs2.existsSync(path3)) {
        contents = fs2.readFileSync(path3, "utf8");
      }
    } catch (er) {
    }
    return fileContentsCache[path3] = contents;
  });
  function supportRelativeURL(file, url) {
    if (!file)
      return url;
    var dir = path2.dirname(file);
    var match = /^\w+:\/\/[^\/]*/.exec(dir);
    var protocol = match ? match[0] : "";
    var startPath = dir.slice(protocol.length);
    if (protocol && /^\/\w\:/.test(startPath)) {
      protocol += "/";
      return protocol + path2.resolve(dir.slice(protocol.length), url).replace(/\\/g, "/");
    }
    return protocol + path2.resolve(dir.slice(protocol.length), url);
  }
  function retrieveSourceMapURL(source) {
    var fileData;
    if (isInBrowser()) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", source, false);
        xhr.send(null);
        fileData = xhr.readyState === 4 ? xhr.responseText : null;
        var sourceMapHeader = xhr.getResponseHeader("SourceMap") || xhr.getResponseHeader("X-SourceMap");
        if (sourceMapHeader) {
          return sourceMapHeader;
        }
      } catch (e) {
      }
    }
    fileData = retrieveFile(source);
    var re = /(?:\/\/[@#][\s]*sourceMappingURL=([^\s'"]+)[\s]*$)|(?:\/\*[@#][\s]*sourceMappingURL=([^\s*'"]+)[\s]*(?:\*\/)[\s]*$)/mg;
    var lastMatch, match;
    while (match = re.exec(fileData))
      lastMatch = match;
    if (!lastMatch)
      return null;
    return lastMatch[1];
  }
  var retrieveSourceMap = handlerExec(retrieveMapHandlers);
  retrieveMapHandlers.push(function(source) {
    var sourceMappingURL = retrieveSourceMapURL(source);
    if (!sourceMappingURL)
      return null;
    var sourceMapData;
    if (reSourceMap.test(sourceMappingURL)) {
      var rawData = sourceMappingURL.slice(sourceMappingURL.indexOf(",") + 1);
      sourceMapData = bufferFrom(rawData, "base64").toString();
      sourceMappingURL = source;
    } else {
      sourceMappingURL = supportRelativeURL(source, sourceMappingURL);
      sourceMapData = retrieveFile(sourceMappingURL);
    }
    if (!sourceMapData) {
      return null;
    }
    return {
      url: sourceMappingURL,
      map: sourceMapData
    };
  });
  function mapSourcePosition(position) {
    var sourceMap = sourceMapCache[position.source];
    if (!sourceMap) {
      var urlAndMap = retrieveSourceMap(position.source);
      if (urlAndMap) {
        sourceMap = sourceMapCache[position.source] = {
          url: urlAndMap.url,
          map: new SourceMapConsumer(urlAndMap.map)
        };
        if (sourceMap.map.sourcesContent) {
          sourceMap.map.sources.forEach(function(source, i) {
            var contents = sourceMap.map.sourcesContent[i];
            if (contents) {
              var url = supportRelativeURL(sourceMap.url, source);
              fileContentsCache[url] = contents;
            }
          });
        }
      } else {
        sourceMap = sourceMapCache[position.source] = {
          url: null,
          map: null
        };
      }
    }
    if (sourceMap && sourceMap.map && typeof sourceMap.map.originalPositionFor === "function") {
      var originalPosition = sourceMap.map.originalPositionFor(position);
      if (originalPosition.source !== null) {
        originalPosition.source = supportRelativeURL(sourceMap.url, originalPosition.source);
        return originalPosition;
      }
    }
    return position;
  }
  function mapEvalOrigin(origin) {
    var match = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(origin);
    if (match) {
      var position = mapSourcePosition({
        source: match[2],
        line: +match[3],
        column: match[4] - 1
      });
      return "eval at " + match[1] + " (" + position.source + ":" + position.line + ":" + (position.column + 1) + ")";
    }
    match = /^eval at ([^(]+) \((.+)\)$/.exec(origin);
    if (match) {
      return "eval at " + match[1] + " (" + mapEvalOrigin(match[2]) + ")";
    }
    return origin;
  }
  function CallSiteToString() {
    var fileName;
    var fileLocation = "";
    if (this.isNative()) {
      fileLocation = "native";
    } else {
      fileName = this.getScriptNameOrSourceURL();
      if (!fileName && this.isEval()) {
        fileLocation = this.getEvalOrigin();
        fileLocation += ", ";
      }
      if (fileName) {
        fileLocation += fileName;
      } else {
        fileLocation += "<anonymous>";
      }
      var lineNumber = this.getLineNumber();
      if (lineNumber != null) {
        fileLocation += ":" + lineNumber;
        var columnNumber = this.getColumnNumber();
        if (columnNumber) {
          fileLocation += ":" + columnNumber;
        }
      }
    }
    var line = "";
    var functionName = this.getFunctionName();
    var addSuffix = true;
    var isConstructor = this.isConstructor();
    var isMethodCall = !(this.isToplevel() || isConstructor);
    if (isMethodCall) {
      var typeName = this.getTypeName();
      if (typeName === "[object Object]") {
        typeName = "null";
      }
      var methodName = this.getMethodName();
      if (functionName) {
        if (typeName && functionName.indexOf(typeName) != 0) {
          line += typeName + ".";
        }
        line += functionName;
        if (methodName && functionName.indexOf("." + methodName) != functionName.length - methodName.length - 1) {
          line += " [as " + methodName + "]";
        }
      } else {
        line += typeName + "." + (methodName || "<anonymous>");
      }
    } else if (isConstructor) {
      line += "new " + (functionName || "<anonymous>");
    } else if (functionName) {
      line += functionName;
    } else {
      line += fileLocation;
      addSuffix = false;
    }
    if (addSuffix) {
      line += " (" + fileLocation + ")";
    }
    return line;
  }
  function cloneCallSite(frame) {
    var object = {};
    Object.getOwnPropertyNames(Object.getPrototypeOf(frame)).forEach(function(name) {
      object[name] = /^(?:is|get)/.test(name) ? function() {
        return frame[name].call(frame);
      } : frame[name];
    });
    object.toString = CallSiteToString;
    return object;
  }
  function wrapCallSite(frame, state) {
    if (state === void 0) {
      state = {nextPosition: null, curPosition: null};
    }
    if (frame.isNative()) {
      state.curPosition = null;
      return frame;
    }
    var source = frame.getFileName() || frame.getScriptNameOrSourceURL();
    if (source) {
      var line = frame.getLineNumber();
      var column = frame.getColumnNumber() - 1;
      var noHeader = /^v(10\.1[6-9]|10\.[2-9][0-9]|10\.[0-9]{3,}|1[2-9]\d*|[2-9]\d|\d{3,}|11\.11)/;
      var headerLength = noHeader.test(process.version) ? 0 : 62;
      if (line === 1 && column > headerLength && !isInBrowser() && !frame.isEval()) {
        column -= headerLength;
      }
      var position = mapSourcePosition({
        source,
        line,
        column
      });
      state.curPosition = position;
      frame = cloneCallSite(frame);
      var originalFunctionName = frame.getFunctionName;
      frame.getFunctionName = function() {
        if (state.nextPosition == null) {
          return originalFunctionName();
        }
        return state.nextPosition.name || originalFunctionName();
      };
      frame.getFileName = function() {
        return position.source;
      };
      frame.getLineNumber = function() {
        return position.line;
      };
      frame.getColumnNumber = function() {
        return position.column + 1;
      };
      frame.getScriptNameOrSourceURL = function() {
        return position.source;
      };
      return frame;
    }
    var origin = frame.isEval() && frame.getEvalOrigin();
    if (origin) {
      origin = mapEvalOrigin(origin);
      frame = cloneCallSite(frame);
      frame.getEvalOrigin = function() {
        return origin;
      };
      return frame;
    }
    return frame;
  }
  function prepareStackTrace(error, stack) {
    if (emptyCacheBetweenOperations) {
      fileContentsCache = {};
      sourceMapCache = {};
    }
    var name = error.name || "Error";
    var message = error.message || "";
    var errorString = name + ": " + message;
    var state = {nextPosition: null, curPosition: null};
    var processedStack = [];
    for (var i = stack.length - 1; i >= 0; i--) {
      processedStack.push("\n    at " + wrapCallSite(stack[i], state));
      state.nextPosition = state.curPosition;
    }
    state.curPosition = state.nextPosition = null;
    return errorString + processedStack.reverse().join("");
  }
  function getErrorSource(error) {
    var match = /\n    at [^(]+ \((.*):(\d+):(\d+)\)/.exec(error.stack);
    if (match) {
      var source = match[1];
      var line = +match[2];
      var column = +match[3];
      var contents = fileContentsCache[source];
      if (!contents && fs2 && fs2.existsSync(source)) {
        try {
          contents = fs2.readFileSync(source, "utf8");
        } catch (er) {
          contents = "";
        }
      }
      if (contents) {
        var code = contents.split(/(?:\r\n|\r|\n)/)[line - 1];
        if (code) {
          return source + ":" + line + "\n" + code + "\n" + new Array(column).join(" ") + "^";
        }
      }
    }
    return null;
  }
  function printErrorAndExit(error) {
    var source = getErrorSource(error);
    if (process.stderr._handle && process.stderr._handle.setBlocking) {
      process.stderr._handle.setBlocking(true);
    }
    if (source) {
      console.error();
      console.error(source);
    }
    console.error(error.stack);
    process.exit(1);
  }
  function shimEmitUncaughtException() {
    var origEmit = process.emit;
    process.emit = function(type) {
      if (type === "uncaughtException") {
        var hasStack = arguments[1] && arguments[1].stack;
        var hasListeners = this.listeners(type).length > 0;
        if (hasStack && !hasListeners) {
          return printErrorAndExit(arguments[1]);
        }
      }
      return origEmit.apply(this, arguments);
    };
  }
  var originalRetrieveFileHandlers = retrieveFileHandlers.slice(0);
  var originalRetrieveMapHandlers = retrieveMapHandlers.slice(0);
  exports2.wrapCallSite = wrapCallSite;
  exports2.getErrorSource = getErrorSource;
  exports2.mapSourcePosition = mapSourcePosition;
  exports2.retrieveSourceMap = retrieveSourceMap;
  exports2.install = function(options) {
    options = options || {};
    if (options.environment) {
      environment = options.environment;
      if (["node", "browser", "auto"].indexOf(environment) === -1) {
        throw new Error("environment " + environment + " was unknown. Available options are {auto, browser, node}");
      }
    }
    if (options.retrieveFile) {
      if (options.overrideRetrieveFile) {
        retrieveFileHandlers.length = 0;
      }
      retrieveFileHandlers.unshift(options.retrieveFile);
    }
    if (options.retrieveSourceMap) {
      if (options.overrideRetrieveSourceMap) {
        retrieveMapHandlers.length = 0;
      }
      retrieveMapHandlers.unshift(options.retrieveSourceMap);
    }
    if (options.hookRequire && !isInBrowser()) {
      var Module = dynamicRequire(module2, "module");
      var $compile = Module.prototype._compile;
      if (!$compile.__sourceMapSupport) {
        Module.prototype._compile = function(content, filename) {
          fileContentsCache[filename] = content;
          sourceMapCache[filename] = void 0;
          return $compile.call(this, content, filename);
        };
        Module.prototype._compile.__sourceMapSupport = true;
      }
    }
    if (!emptyCacheBetweenOperations) {
      emptyCacheBetweenOperations = "emptyCacheBetweenOperations" in options ? options.emptyCacheBetweenOperations : false;
    }
    if (!errorFormatterInstalled) {
      errorFormatterInstalled = true;
      Error.prepareStackTrace = prepareStackTrace;
    }
    if (!uncaughtShimInstalled) {
      var installHandler = "handleUncaughtExceptions" in options ? options.handleUncaughtExceptions : true;
      try {
        var worker_threads = dynamicRequire(module2, "worker_threads");
        if (worker_threads.isMainThread === false) {
          installHandler = false;
        }
      } catch (e) {
      }
      if (installHandler && hasGlobalProcessEventEmitter()) {
        uncaughtShimInstalled = true;
        shimEmitUncaughtException();
      }
    }
  };
  exports2.resetRetrieveHandlers = function() {
    retrieveFileHandlers.length = 0;
    retrieveMapHandlers.length = 0;
    retrieveFileHandlers = originalRetrieveFileHandlers.slice(0);
    retrieveMapHandlers = originalRetrieveMapHandlers.slice(0);
    retrieveSourceMap = handlerExec(retrieveMapHandlers);
    retrieveFile = handlerExec(retrieveFileHandlers);
  };
});

// node_modules/mysql/lib/protocol/constants/client.js
var require_client = __commonJS((exports2) => {
  exports2.CLIENT_LONG_PASSWORD = 1;
  exports2.CLIENT_FOUND_ROWS = 2;
  exports2.CLIENT_LONG_FLAG = 4;
  exports2.CLIENT_CONNECT_WITH_DB = 8;
  exports2.CLIENT_NO_SCHEMA = 16;
  exports2.CLIENT_COMPRESS = 32;
  exports2.CLIENT_ODBC = 64;
  exports2.CLIENT_LOCAL_FILES = 128;
  exports2.CLIENT_IGNORE_SPACE = 256;
  exports2.CLIENT_PROTOCOL_41 = 512;
  exports2.CLIENT_INTERACTIVE = 1024;
  exports2.CLIENT_SSL = 2048;
  exports2.CLIENT_IGNORE_SIGPIPE = 4096;
  exports2.CLIENT_TRANSACTIONS = 8192;
  exports2.CLIENT_RESERVED = 16384;
  exports2.CLIENT_SECURE_CONNECTION = 32768;
  exports2.CLIENT_MULTI_STATEMENTS = 65536;
  exports2.CLIENT_MULTI_RESULTS = 131072;
  exports2.CLIENT_PS_MULTI_RESULTS = 262144;
  exports2.CLIENT_PLUGIN_AUTH = 524288;
  exports2.CLIENT_SSL_VERIFY_SERVER_CERT = 1073741824;
  exports2.CLIENT_REMEMBER_OPTIONS = 2147483648;
});

// node_modules/mysql/lib/protocol/constants/charsets.js
var require_charsets = __commonJS((exports2) => {
  exports2.BIG5_CHINESE_CI = 1;
  exports2.LATIN2_CZECH_CS = 2;
  exports2.DEC8_SWEDISH_CI = 3;
  exports2.CP850_GENERAL_CI = 4;
  exports2.LATIN1_GERMAN1_CI = 5;
  exports2.HP8_ENGLISH_CI = 6;
  exports2.KOI8R_GENERAL_CI = 7;
  exports2.LATIN1_SWEDISH_CI = 8;
  exports2.LATIN2_GENERAL_CI = 9;
  exports2.SWE7_SWEDISH_CI = 10;
  exports2.ASCII_GENERAL_CI = 11;
  exports2.UJIS_JAPANESE_CI = 12;
  exports2.SJIS_JAPANESE_CI = 13;
  exports2.CP1251_BULGARIAN_CI = 14;
  exports2.LATIN1_DANISH_CI = 15;
  exports2.HEBREW_GENERAL_CI = 16;
  exports2.TIS620_THAI_CI = 18;
  exports2.EUCKR_KOREAN_CI = 19;
  exports2.LATIN7_ESTONIAN_CS = 20;
  exports2.LATIN2_HUNGARIAN_CI = 21;
  exports2.KOI8U_GENERAL_CI = 22;
  exports2.CP1251_UKRAINIAN_CI = 23;
  exports2.GB2312_CHINESE_CI = 24;
  exports2.GREEK_GENERAL_CI = 25;
  exports2.CP1250_GENERAL_CI = 26;
  exports2.LATIN2_CROATIAN_CI = 27;
  exports2.GBK_CHINESE_CI = 28;
  exports2.CP1257_LITHUANIAN_CI = 29;
  exports2.LATIN5_TURKISH_CI = 30;
  exports2.LATIN1_GERMAN2_CI = 31;
  exports2.ARMSCII8_GENERAL_CI = 32;
  exports2.UTF8_GENERAL_CI = 33;
  exports2.CP1250_CZECH_CS = 34;
  exports2.UCS2_GENERAL_CI = 35;
  exports2.CP866_GENERAL_CI = 36;
  exports2.KEYBCS2_GENERAL_CI = 37;
  exports2.MACCE_GENERAL_CI = 38;
  exports2.MACROMAN_GENERAL_CI = 39;
  exports2.CP852_GENERAL_CI = 40;
  exports2.LATIN7_GENERAL_CI = 41;
  exports2.LATIN7_GENERAL_CS = 42;
  exports2.MACCE_BIN = 43;
  exports2.CP1250_CROATIAN_CI = 44;
  exports2.UTF8MB4_GENERAL_CI = 45;
  exports2.UTF8MB4_BIN = 46;
  exports2.LATIN1_BIN = 47;
  exports2.LATIN1_GENERAL_CI = 48;
  exports2.LATIN1_GENERAL_CS = 49;
  exports2.CP1251_BIN = 50;
  exports2.CP1251_GENERAL_CI = 51;
  exports2.CP1251_GENERAL_CS = 52;
  exports2.MACROMAN_BIN = 53;
  exports2.UTF16_GENERAL_CI = 54;
  exports2.UTF16_BIN = 55;
  exports2.UTF16LE_GENERAL_CI = 56;
  exports2.CP1256_GENERAL_CI = 57;
  exports2.CP1257_BIN = 58;
  exports2.CP1257_GENERAL_CI = 59;
  exports2.UTF32_GENERAL_CI = 60;
  exports2.UTF32_BIN = 61;
  exports2.UTF16LE_BIN = 62;
  exports2.BINARY = 63;
  exports2.ARMSCII8_BIN = 64;
  exports2.ASCII_BIN = 65;
  exports2.CP1250_BIN = 66;
  exports2.CP1256_BIN = 67;
  exports2.CP866_BIN = 68;
  exports2.DEC8_BIN = 69;
  exports2.GREEK_BIN = 70;
  exports2.HEBREW_BIN = 71;
  exports2.HP8_BIN = 72;
  exports2.KEYBCS2_BIN = 73;
  exports2.KOI8R_BIN = 74;
  exports2.KOI8U_BIN = 75;
  exports2.LATIN2_BIN = 77;
  exports2.LATIN5_BIN = 78;
  exports2.LATIN7_BIN = 79;
  exports2.CP850_BIN = 80;
  exports2.CP852_BIN = 81;
  exports2.SWE7_BIN = 82;
  exports2.UTF8_BIN = 83;
  exports2.BIG5_BIN = 84;
  exports2.EUCKR_BIN = 85;
  exports2.GB2312_BIN = 86;
  exports2.GBK_BIN = 87;
  exports2.SJIS_BIN = 88;
  exports2.TIS620_BIN = 89;
  exports2.UCS2_BIN = 90;
  exports2.UJIS_BIN = 91;
  exports2.GEOSTD8_GENERAL_CI = 92;
  exports2.GEOSTD8_BIN = 93;
  exports2.LATIN1_SPANISH_CI = 94;
  exports2.CP932_JAPANESE_CI = 95;
  exports2.CP932_BIN = 96;
  exports2.EUCJPMS_JAPANESE_CI = 97;
  exports2.EUCJPMS_BIN = 98;
  exports2.CP1250_POLISH_CI = 99;
  exports2.UTF16_UNICODE_CI = 101;
  exports2.UTF16_ICELANDIC_CI = 102;
  exports2.UTF16_LATVIAN_CI = 103;
  exports2.UTF16_ROMANIAN_CI = 104;
  exports2.UTF16_SLOVENIAN_CI = 105;
  exports2.UTF16_POLISH_CI = 106;
  exports2.UTF16_ESTONIAN_CI = 107;
  exports2.UTF16_SPANISH_CI = 108;
  exports2.UTF16_SWEDISH_CI = 109;
  exports2.UTF16_TURKISH_CI = 110;
  exports2.UTF16_CZECH_CI = 111;
  exports2.UTF16_DANISH_CI = 112;
  exports2.UTF16_LITHUANIAN_CI = 113;
  exports2.UTF16_SLOVAK_CI = 114;
  exports2.UTF16_SPANISH2_CI = 115;
  exports2.UTF16_ROMAN_CI = 116;
  exports2.UTF16_PERSIAN_CI = 117;
  exports2.UTF16_ESPERANTO_CI = 118;
  exports2.UTF16_HUNGARIAN_CI = 119;
  exports2.UTF16_SINHALA_CI = 120;
  exports2.UTF16_GERMAN2_CI = 121;
  exports2.UTF16_CROATIAN_MYSQL561_CI = 122;
  exports2.UTF16_UNICODE_520_CI = 123;
  exports2.UTF16_VIETNAMESE_CI = 124;
  exports2.UCS2_UNICODE_CI = 128;
  exports2.UCS2_ICELANDIC_CI = 129;
  exports2.UCS2_LATVIAN_CI = 130;
  exports2.UCS2_ROMANIAN_CI = 131;
  exports2.UCS2_SLOVENIAN_CI = 132;
  exports2.UCS2_POLISH_CI = 133;
  exports2.UCS2_ESTONIAN_CI = 134;
  exports2.UCS2_SPANISH_CI = 135;
  exports2.UCS2_SWEDISH_CI = 136;
  exports2.UCS2_TURKISH_CI = 137;
  exports2.UCS2_CZECH_CI = 138;
  exports2.UCS2_DANISH_CI = 139;
  exports2.UCS2_LITHUANIAN_CI = 140;
  exports2.UCS2_SLOVAK_CI = 141;
  exports2.UCS2_SPANISH2_CI = 142;
  exports2.UCS2_ROMAN_CI = 143;
  exports2.UCS2_PERSIAN_CI = 144;
  exports2.UCS2_ESPERANTO_CI = 145;
  exports2.UCS2_HUNGARIAN_CI = 146;
  exports2.UCS2_SINHALA_CI = 147;
  exports2.UCS2_GERMAN2_CI = 148;
  exports2.UCS2_CROATIAN_MYSQL561_CI = 149;
  exports2.UCS2_UNICODE_520_CI = 150;
  exports2.UCS2_VIETNAMESE_CI = 151;
  exports2.UCS2_GENERAL_MYSQL500_CI = 159;
  exports2.UTF32_UNICODE_CI = 160;
  exports2.UTF32_ICELANDIC_CI = 161;
  exports2.UTF32_LATVIAN_CI = 162;
  exports2.UTF32_ROMANIAN_CI = 163;
  exports2.UTF32_SLOVENIAN_CI = 164;
  exports2.UTF32_POLISH_CI = 165;
  exports2.UTF32_ESTONIAN_CI = 166;
  exports2.UTF32_SPANISH_CI = 167;
  exports2.UTF32_SWEDISH_CI = 168;
  exports2.UTF32_TURKISH_CI = 169;
  exports2.UTF32_CZECH_CI = 170;
  exports2.UTF32_DANISH_CI = 171;
  exports2.UTF32_LITHUANIAN_CI = 172;
  exports2.UTF32_SLOVAK_CI = 173;
  exports2.UTF32_SPANISH2_CI = 174;
  exports2.UTF32_ROMAN_CI = 175;
  exports2.UTF32_PERSIAN_CI = 176;
  exports2.UTF32_ESPERANTO_CI = 177;
  exports2.UTF32_HUNGARIAN_CI = 178;
  exports2.UTF32_SINHALA_CI = 179;
  exports2.UTF32_GERMAN2_CI = 180;
  exports2.UTF32_CROATIAN_MYSQL561_CI = 181;
  exports2.UTF32_UNICODE_520_CI = 182;
  exports2.UTF32_VIETNAMESE_CI = 183;
  exports2.UTF8_UNICODE_CI = 192;
  exports2.UTF8_ICELANDIC_CI = 193;
  exports2.UTF8_LATVIAN_CI = 194;
  exports2.UTF8_ROMANIAN_CI = 195;
  exports2.UTF8_SLOVENIAN_CI = 196;
  exports2.UTF8_POLISH_CI = 197;
  exports2.UTF8_ESTONIAN_CI = 198;
  exports2.UTF8_SPANISH_CI = 199;
  exports2.UTF8_SWEDISH_CI = 200;
  exports2.UTF8_TURKISH_CI = 201;
  exports2.UTF8_CZECH_CI = 202;
  exports2.UTF8_DANISH_CI = 203;
  exports2.UTF8_LITHUANIAN_CI = 204;
  exports2.UTF8_SLOVAK_CI = 205;
  exports2.UTF8_SPANISH2_CI = 206;
  exports2.UTF8_ROMAN_CI = 207;
  exports2.UTF8_PERSIAN_CI = 208;
  exports2.UTF8_ESPERANTO_CI = 209;
  exports2.UTF8_HUNGARIAN_CI = 210;
  exports2.UTF8_SINHALA_CI = 211;
  exports2.UTF8_GERMAN2_CI = 212;
  exports2.UTF8_CROATIAN_MYSQL561_CI = 213;
  exports2.UTF8_UNICODE_520_CI = 214;
  exports2.UTF8_VIETNAMESE_CI = 215;
  exports2.UTF8_GENERAL_MYSQL500_CI = 223;
  exports2.UTF8MB4_UNICODE_CI = 224;
  exports2.UTF8MB4_ICELANDIC_CI = 225;
  exports2.UTF8MB4_LATVIAN_CI = 226;
  exports2.UTF8MB4_ROMANIAN_CI = 227;
  exports2.UTF8MB4_SLOVENIAN_CI = 228;
  exports2.UTF8MB4_POLISH_CI = 229;
  exports2.UTF8MB4_ESTONIAN_CI = 230;
  exports2.UTF8MB4_SPANISH_CI = 231;
  exports2.UTF8MB4_SWEDISH_CI = 232;
  exports2.UTF8MB4_TURKISH_CI = 233;
  exports2.UTF8MB4_CZECH_CI = 234;
  exports2.UTF8MB4_DANISH_CI = 235;
  exports2.UTF8MB4_LITHUANIAN_CI = 236;
  exports2.UTF8MB4_SLOVAK_CI = 237;
  exports2.UTF8MB4_SPANISH2_CI = 238;
  exports2.UTF8MB4_ROMAN_CI = 239;
  exports2.UTF8MB4_PERSIAN_CI = 240;
  exports2.UTF8MB4_ESPERANTO_CI = 241;
  exports2.UTF8MB4_HUNGARIAN_CI = 242;
  exports2.UTF8MB4_SINHALA_CI = 243;
  exports2.UTF8MB4_GERMAN2_CI = 244;
  exports2.UTF8MB4_CROATIAN_MYSQL561_CI = 245;
  exports2.UTF8MB4_UNICODE_520_CI = 246;
  exports2.UTF8MB4_VIETNAMESE_CI = 247;
  exports2.UTF8_GENERAL50_CI = 253;
  exports2.ARMSCII8 = exports2.ARMSCII8_GENERAL_CI;
  exports2.ASCII = exports2.ASCII_GENERAL_CI;
  exports2.BIG5 = exports2.BIG5_CHINESE_CI;
  exports2.BINARY = exports2.BINARY;
  exports2.CP1250 = exports2.CP1250_GENERAL_CI;
  exports2.CP1251 = exports2.CP1251_GENERAL_CI;
  exports2.CP1256 = exports2.CP1256_GENERAL_CI;
  exports2.CP1257 = exports2.CP1257_GENERAL_CI;
  exports2.CP866 = exports2.CP866_GENERAL_CI;
  exports2.CP850 = exports2.CP850_GENERAL_CI;
  exports2.CP852 = exports2.CP852_GENERAL_CI;
  exports2.CP932 = exports2.CP932_JAPANESE_CI;
  exports2.DEC8 = exports2.DEC8_SWEDISH_CI;
  exports2.EUCJPMS = exports2.EUCJPMS_JAPANESE_CI;
  exports2.EUCKR = exports2.EUCKR_KOREAN_CI;
  exports2.GB2312 = exports2.GB2312_CHINESE_CI;
  exports2.GBK = exports2.GBK_CHINESE_CI;
  exports2.GEOSTD8 = exports2.GEOSTD8_GENERAL_CI;
  exports2.GREEK = exports2.GREEK_GENERAL_CI;
  exports2.HEBREW = exports2.HEBREW_GENERAL_CI;
  exports2.HP8 = exports2.HP8_ENGLISH_CI;
  exports2.KEYBCS2 = exports2.KEYBCS2_GENERAL_CI;
  exports2.KOI8R = exports2.KOI8R_GENERAL_CI;
  exports2.KOI8U = exports2.KOI8U_GENERAL_CI;
  exports2.LATIN1 = exports2.LATIN1_SWEDISH_CI;
  exports2.LATIN2 = exports2.LATIN2_GENERAL_CI;
  exports2.LATIN5 = exports2.LATIN5_TURKISH_CI;
  exports2.LATIN7 = exports2.LATIN7_GENERAL_CI;
  exports2.MACCE = exports2.MACCE_GENERAL_CI;
  exports2.MACROMAN = exports2.MACROMAN_GENERAL_CI;
  exports2.SJIS = exports2.SJIS_JAPANESE_CI;
  exports2.SWE7 = exports2.SWE7_SWEDISH_CI;
  exports2.TIS620 = exports2.TIS620_THAI_CI;
  exports2.UCS2 = exports2.UCS2_GENERAL_CI;
  exports2.UJIS = exports2.UJIS_JAPANESE_CI;
  exports2.UTF16 = exports2.UTF16_GENERAL_CI;
  exports2.UTF16LE = exports2.UTF16LE_GENERAL_CI;
  exports2.UTF8 = exports2.UTF8_GENERAL_CI;
  exports2.UTF8MB4 = exports2.UTF8MB4_GENERAL_CI;
  exports2.UTF32 = exports2.UTF32_GENERAL_CI;
});

// node_modules/mysql/lib/protocol/constants/ssl_profiles.js
var require_ssl_profiles = __commonJS((exports2) => {
  exports2["Amazon RDS"] = {
    ca: [
      "-----BEGIN CERTIFICATE-----\nMIIDQzCCAqygAwIBAgIJAOd1tlfiGoEoMA0GCSqGSIb3DQEBBQUAMHUxCzAJBgNV\nBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdTZWF0dGxlMRMw\nEQYDVQQKEwpBbWF6b24uY29tMQwwCgYDVQQLEwNSRFMxHDAaBgNVBAMTE2F3cy5h\nbWF6b24uY29tL3Jkcy8wHhcNMTAwNDA1MjI0NDMxWhcNMTUwNDA0MjI0NDMxWjB1\nMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHU2Vh\ndHRsZTETMBEGA1UEChMKQW1hem9uLmNvbTEMMAoGA1UECxMDUkRTMRwwGgYDVQQD\nExNhd3MuYW1hem9uLmNvbS9yZHMvMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKB\ngQDKhXGU7tizxUR5WaFoMTFcxNxa05PEjZaIOEN5ctkWrqYSRov0/nOMoZjqk8bC\nmed9vPFoQGD0OTakPs0jVe3wwmR735hyVwmKIPPsGlaBYj1O6llIpZeQVyupNx56\nUzqtiLaDzh1KcmfqP3qP2dInzBfJQKjiRudo1FWnpPt33QIDAQABo4HaMIHXMB0G\nA1UdDgQWBBT/H3x+cqSkR/ePSIinPtc4yWKe3DCBpwYDVR0jBIGfMIGcgBT/H3x+\ncqSkR/ePSIinPtc4yWKe3KF5pHcwdTELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldh\nc2hpbmd0b24xEDAOBgNVBAcTB1NlYXR0bGUxEzARBgNVBAoTCkFtYXpvbi5jb20x\nDDAKBgNVBAsTA1JEUzEcMBoGA1UEAxMTYXdzLmFtYXpvbi5jb20vcmRzL4IJAOd1\ntlfiGoEoMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQEFBQADgYEAvguZy/BDT66x\nGfgnJlyQwnFSeVLQm9u/FIvz4huGjbq9dqnD6h/Gm56QPFdyMEyDiZWaqY6V08lY\nLTBNb4kcIc9/6pc0/ojKciP5QJRm6OiZ4vgG05nF4fYjhU7WClUx7cxq1fKjNc2J\nUCmmYqgiVkAGWRETVo+byOSDZ4swb10=\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIID9DCCAtygAwIBAgIBQjANBgkqhkiG9w0BAQUFADCBijELMAkGA1UEBhMCVVMx\nEzARBgNVBAgMCldhc2hpbmd0b24xEDAOBgNVBAcMB1NlYXR0bGUxIjAgBgNVBAoM\nGUFtYXpvbiBXZWIgU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMx\nGzAZBgNVBAMMEkFtYXpvbiBSRFMgUm9vdCBDQTAeFw0xNTAyMDUwOTExMzFaFw0y\nMDAzMDUwOTExMzFaMIGKMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2FzaGluZ3Rv\nbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBTZXJ2aWNl\ncywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzEbMBkGA1UEAwwSQW1hem9uIFJE\nUyBSb290IENBMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuD8nrZ8V\nu+VA8yVlUipCZIKPTDcOILYpUe8Tct0YeQQr0uyl018StdBsa3CjBgvwpDRq1HgF\nJi2N3+39+shCNspQeE6aYU+BHXhKhIIStt3r7gl/4NqYiDDMWKHxHq0nsGDFfArf\nAOcjZdJagOMqb3fF46flc8k2E7THTm9Sz4L7RY1WdABMuurpICLFE3oHcGdapOb9\nT53pQR+xpHW9atkcf3pf7gbO0rlKVSIoUenBlZipUlp1VZl/OD/E+TtRhDDNdI2J\nP/DSMM3aEsq6ZQkfbz/Ilml+Lx3tJYXUDmp+ZjzMPLk/+3beT8EhrwtcG3VPpvwp\nBIOqsqVVTvw/CwIDAQABo2MwYTAOBgNVHQ8BAf8EBAMCAQYwDwYDVR0TAQH/BAUw\nAwEB/zAdBgNVHQ4EFgQUTgLurD72FchM7Sz1BcGPnIQISYMwHwYDVR0jBBgwFoAU\nTgLurD72FchM7Sz1BcGPnIQISYMwDQYJKoZIhvcNAQEFBQADggEBAHZcgIio8pAm\nMjHD5cl6wKjXxScXKtXygWH2BoDMYBJF9yfyKO2jEFxYKbHePpnXB1R04zJSWAw5\n2EUuDI1pSBh9BA82/5PkuNlNeSTB3dXDD2PEPdzVWbSKvUB8ZdooV+2vngL0Zm4r\n47QPyd18yPHrRIbtBtHR/6CwKevLZ394zgExqhnekYKIqqEX41xsUV0Gm6x4vpjf\n2u6O/+YE2U+qyyxHE5Wd5oqde0oo9UUpFETJPVb6Q2cEeQib8PBAyi0i6KnF+kIV\nA9dY7IHSubtCK/i8wxMVqfd5GtbA8mmpeJFwnDvm9rBEsHybl08qlax9syEwsUYr\n/40NawZfTUU=\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIEBjCCAu6gAwIBAgIJAMc0ZzaSUK51MA0GCSqGSIb3DQEBCwUAMIGPMQswCQYD\nVQQGEwJVUzEQMA4GA1UEBwwHU2VhdHRsZTETMBEGA1UECAwKV2FzaGluZ3RvbjEi\nMCAGA1UECgwZQW1hem9uIFdlYiBTZXJ2aWNlcywgSW5jLjETMBEGA1UECwwKQW1h\nem9uIFJEUzEgMB4GA1UEAwwXQW1hem9uIFJEUyBSb290IDIwMTkgQ0EwHhcNMTkw\nODIyMTcwODUwWhcNMjQwODIyMTcwODUwWjCBjzELMAkGA1UEBhMCVVMxEDAOBgNV\nBAcMB1NlYXR0bGUxEzARBgNVBAgMCldhc2hpbmd0b24xIjAgBgNVBAoMGUFtYXpv\nbiBXZWIgU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMxIDAeBgNV\nBAMMF0FtYXpvbiBSRFMgUm9vdCAyMDE5IENBMIIBIjANBgkqhkiG9w0BAQEFAAOC\nAQ8AMIIBCgKCAQEArXnF/E6/Qh+ku3hQTSKPMhQQlCpoWvnIthzX6MK3p5a0eXKZ\noWIjYcNNG6UwJjp4fUXl6glp53Jobn+tWNX88dNH2n8DVbppSwScVE2LpuL+94vY\n0EYE/XxN7svKea8YvlrqkUBKyxLxTjh+U/KrGOaHxz9v0l6ZNlDbuaZw3qIWdD/I\n6aNbGeRUVtpM6P+bWIoxVl/caQylQS6CEYUk+CpVyJSkopwJlzXT07tMoDL5WgX9\nO08KVgDNz9qP/IGtAcRduRcNioH3E9v981QO1zt/Gpb2f8NqAjUUCUZzOnij6mx9\nMcZ+9cWX88CRzR0vQODWuZscgI08NvM69Fn2SQIDAQABo2MwYTAOBgNVHQ8BAf8E\nBAMCAQYwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUc19g2LzLA5j0Kxc0LjZa\npmD/vB8wHwYDVR0jBBgwFoAUc19g2LzLA5j0Kxc0LjZapmD/vB8wDQYJKoZIhvcN\nAQELBQADggEBAHAG7WTmyjzPRIM85rVj+fWHsLIvqpw6DObIjMWokpliCeMINZFV\nynfgBKsf1ExwbvJNzYFXW6dihnguDG9VMPpi2up/ctQTN8tm9nDKOy08uNZoofMc\nNUZxKCEkVKZv+IL4oHoeayt8egtv3ujJM6V14AstMQ6SwvwvA93EP/Ug2e4WAXHu\ncbI1NAbUgVDqp+DRdfvZkgYKryjTWd/0+1fS8X1bBZVWzl7eirNVnHbSH2ZDpNuY\n0SBd8dj5F6ld3t58ydZbrTHze7JJOd8ijySAp4/kiu9UfZWuTPABzDa/DSdz9Dk/\nzPW4CXXvhLmE02TA9/HeCw3KEHIwicNuEfw=\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIEATCCAumgAwIBAgIBRDANBgkqhkiG9w0BAQUFADCBijELMAkGA1UEBhMCVVMx\nEzARBgNVBAgMCldhc2hpbmd0b24xEDAOBgNVBAcMB1NlYXR0bGUxIjAgBgNVBAoM\nGUFtYXpvbiBXZWIgU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMx\nGzAZBgNVBAMMEkFtYXpvbiBSRFMgUm9vdCBDQTAeFw0xNTAyMDUyMjAzMDZaFw0y\nMDAzMDUyMjAzMDZaMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2FzaGluZ3Rv\nbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBTZXJ2aWNl\ncywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzElMCMGA1UEAwwcQW1hem9uIFJE\nUyBhcC1ub3J0aGVhc3QtMSBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC\nggEBAMmM2B4PfTXCZjbZMWiDPyxvk/eeNwIRJAhfzesiGUiLozX6CRy3rwC1ZOPV\nAcQf0LB+O8wY88C/cV+d4Q2nBDmnk+Vx7o2MyMh343r5rR3Na+4izd89tkQVt0WW\nvO21KRH5i8EuBjinboOwAwu6IJ+HyiQiM0VjgjrmEr/YzFPL8MgHD/YUHehqjACn\nC0+B7/gu7W4qJzBL2DOf7ub2qszGtwPE+qQzkCRDwE1A4AJmVE++/FLH2Zx78Egg\nfV1sUxPtYgjGH76VyyO6GNKM6rAUMD/q5mnPASQVIXgKbupr618bnH+SWHFjBqZq\nHvDGPMtiiWII41EmGUypyt5AbysCAwEAAaNmMGQwDgYDVR0PAQH/BAQDAgEGMBIG\nA1UdEwEB/wQIMAYBAf8CAQAwHQYDVR0OBBYEFIiKM0Q6n1K4EmLxs3ZXxINbwEwR\nMB8GA1UdIwQYMBaAFE4C7qw+9hXITO0s9QXBj5yECEmDMA0GCSqGSIb3DQEBBQUA\nA4IBAQBezGbE9Rw/k2e25iGjj5n8r+M3dlye8ORfCE/dijHtxqAKasXHgKX8I9Tw\nJkBiGWiuzqn7gO5MJ0nMMro1+gq29qjZnYX1pDHPgsRjUX8R+juRhgJ3JSHijRbf\n4qNJrnwga7pj94MhcLq9u0f6dxH6dXbyMv21T4TZMTmcFduf1KgaiVx1PEyJjC6r\nM+Ru+A0eM+jJ7uCjUoZKcpX8xkj4nmSnz9NMPog3wdOSB9cAW7XIc5mHa656wr7I\nWJxVcYNHTXIjCcng2zMKd1aCcl2KSFfy56sRfT7J5Wp69QSr+jq8KM55gw8uqAwi\nVPrXn2899T1rcTtFYFP16WXjGuc0\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIEATCCAumgAwIBAgIBTDANBgkqhkiG9w0BAQUFADCBijELMAkGA1UEBhMCVVMx\nEzARBgNVBAgMCldhc2hpbmd0b24xEDAOBgNVBAcMB1NlYXR0bGUxIjAgBgNVBAoM\nGUFtYXpvbiBXZWIgU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMx\nGzAZBgNVBAMMEkFtYXpvbiBSRFMgUm9vdCBDQTAeFw0xNTExMDYwMDA1NDZaFw0y\nMDAzMDUwMDA1NDZaMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2FzaGluZ3Rv\nbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBTZXJ2aWNl\ncywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzElMCMGA1UEAwwcQW1hem9uIFJE\nUyBhcC1ub3J0aGVhc3QtMiBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC\nggEBAKSwd+RVUzTRH0FgnbwoTK8TMm/zMT4+2BvALpAUe6YXbkisg2goycWuuWLg\njOpFBB3GtyvXZnkqi7MkDWUmj1a2kf8l2oLyoaZ+Hm9x/sV+IJzOqPvj1XVUGjP6\nyYYnPJmUYqvZeI7fEkIGdFkP2m4/sgsSGsFvpD9FK1bL1Kx2UDpYX0kHTtr18Zm/\n1oN6irqWALSmXMDydb8hE0FB2A1VFyeKE6PnoDj/Y5cPHwPPdEi6/3gkDkSaOG30\nrWeQfL3pOcKqzbHaWTxMphd0DSL/quZ64Nr+Ly65Q5PRcTrtr55ekOUziuqXwk+o\n9QpACMwcJ7ROqOznZTqTzSFVXFECAwEAAaNmMGQwDgYDVR0PAQH/BAQDAgEGMBIG\nA1UdEwEB/wQIMAYBAf8CAQAwHQYDVR0OBBYEFM6Nox/QWbhzWVvzoJ/y0kGpNPK+\nMB8GA1UdIwQYMBaAFE4C7qw+9hXITO0s9QXBj5yECEmDMA0GCSqGSIb3DQEBBQUA\nA4IBAQCTkWBqNvyRf3Y/W21DwFx3oT/AIWrHt0BdGZO34tavummXemTH9LZ/mqv9\naljt6ZuDtf5DEQjdsAwXMsyo03ffnP7doWm8iaF1+Mui77ot0TmTsP/deyGwukvJ\ntkxX8bZjDh+EaNauWKr+CYnniNxCQLfFtXYJsfOdVBzK3xNL+Z3ucOQRhr2helWc\nCDQgwfhP1+3pRVKqHvWCPC4R3fT7RZHuRmZ38kndv476GxRntejh+ePffif78bFI\n3rIZCPBGobrrUMycafSbyXteoGca/kA+/IqrAPlk0pWQ4aEL0yTWN2h2dnjoD7oX\nbyIuL/g9AGRh97+ssn7D6bDRPTbW\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIEATCCAumgAwIBAgIBRTANBgkqhkiG9w0BAQUFADCBijELMAkGA1UEBhMCVVMx\nEzARBgNVBAgMCldhc2hpbmd0b24xEDAOBgNVBAcMB1NlYXR0bGUxIjAgBgNVBAoM\nGUFtYXpvbiBXZWIgU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMx\nGzAZBgNVBAMMEkFtYXpvbiBSRFMgUm9vdCBDQTAeFw0xNTAyMDUyMjAzMTlaFw0y\nMDAzMDUyMjAzMTlaMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2FzaGluZ3Rv\nbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBTZXJ2aWNl\ncywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzElMCMGA1UEAwwcQW1hem9uIFJE\nUyBhcC1zb3V0aGVhc3QtMSBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC\nggEBANaXElmSEYt/UtxHFsARFhSUahTf1KNJzR0Dmay6hqOXQuRVbKRwPd19u5vx\nDdF1sLT7D69IK3VDnUiQScaCv2Dpu9foZt+rLx+cpx1qiQd1UHrvqq8xPzQOqCdC\nRFStq6yVYZ69yfpfoI67AjclMOjl2Vph3ftVnqP0IgVKZdzeC7fd+umGgR9xY0Qr\nUbhd/lWdsbNvzK3f1TPWcfIKQnpvSt85PIEDJir6/nuJUKMtmJRwTymJf0i+JZ4x\n7dJa341p2kHKcHMgOPW7nJQklGBA70ytjUV6/qebS3yIugr/28mwReflg3TJzVDl\nEOvi6pqbqNbkMuEwGDCmEQIVqgkCAwEAAaNmMGQwDgYDVR0PAQH/BAQDAgEGMBIG\nA1UdEwEB/wQIMAYBAf8CAQAwHQYDVR0OBBYEFAu93/4k5xbWOsgdCdn+/KdiRuit\nMB8GA1UdIwQYMBaAFE4C7qw+9hXITO0s9QXBj5yECEmDMA0GCSqGSIb3DQEBBQUA\nA4IBAQBlcjSyscpPjf5+MgzMuAsCxByqUt+WFspwcMCpwdaBeHOPSQrXNqX2Sk6P\nkth6oCivA64trWo8tFMvPYlUA1FYVD5WpN0kCK+P5pD4KHlaDsXhuhClJzp/OP8t\npOyUr5109RHLxqoKB5J5m1XA7rgcFjnMxwBSWFe3/4uMk/+4T53YfCVXuc6QV3i7\nI/2LAJwFf//pTtt6fZenYfCsahnr2nvrNRNyAxcfvGZ/4Opn/mJtR6R/AjvQZHiR\nbkRNKF2GW0ueK5W4FkZVZVhhX9xh1Aj2Ollb+lbOqADaVj+AT3PoJPZ3MPQHKCXm\nxwG0LOLlRr/TfD6li1AfOVTAJXv9\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIEATCCAumgAwIBAgIBRjANBgkqhkiG9w0BAQUFADCBijELMAkGA1UEBhMCVVMx\nEzARBgNVBAgMCldhc2hpbmd0b24xEDAOBgNVBAcMB1NlYXR0bGUxIjAgBgNVBAoM\nGUFtYXpvbiBXZWIgU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMx\nGzAZBgNVBAMMEkFtYXpvbiBSRFMgUm9vdCBDQTAeFw0xNTAyMDUyMjAzMjRaFw0y\nMDAzMDUyMjAzMjRaMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2FzaGluZ3Rv\nbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBTZXJ2aWNl\ncywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzElMCMGA1UEAwwcQW1hem9uIFJE\nUyBhcC1zb3V0aGVhc3QtMiBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC\nggEBAJqBAJutz69hFOh3BtLHZTbwE8eejGGKayn9hu98YMDPzWzGXWCmW+ZYWELA\ncY3cNWNF8K4FqKXFr2ssorBYim1UtYFX8yhydT2hMD5zgQ2sCGUpuidijuPA6zaq\nZ3tdhVR94f0q8mpwpv2zqR9PcqaGDx2VR1x773FupRPRo7mEW1vC3IptHCQlP/zE\n7jQiLl28bDIH2567xg7e7E9WnZToRnhlYdTaDaJsHTzi5mwILi4cihSok7Shv/ME\nhnukvxeSPUpaVtFaBhfBqq055ePq9I+Ns4KGreTKMhU0O9fkkaBaBmPaFgmeX/XO\nn2AX7gMouo3mtv34iDTZ0h6YCGkCAwEAAaNmMGQwDgYDVR0PAQH/BAQDAgEGMBIG\nA1UdEwEB/wQIMAYBAf8CAQAwHQYDVR0OBBYEFIlQnY0KHYWn1jYumSdJYfwj/Nfw\nMB8GA1UdIwQYMBaAFE4C7qw+9hXITO0s9QXBj5yECEmDMA0GCSqGSIb3DQEBBQUA\nA4IBAQA0wVU6/l41cTzHc4azc4CDYY2Wd90DFWiH9C/mw0SgToYfCJ/5Cfi0NT/Y\nPRnk3GchychCJgoPA/k9d0//IhYEAIiIDjyFVgjbTkKV3sh4RbdldKVOUB9kumz/\nZpShplsGt3z4QQiVnKfrAgqxWDjR0I0pQKkxXa6Sjkicos9LQxVtJ0XA4ieG1E7z\nzJr+6t80wmzxvkInSaWP3xNJK9azVRTrgQZQlvkbpDbExl4mNTG66VD3bAp6t3Wa\nB49//uDdfZmPkqqbX+hsxp160OH0rxJppwO3Bh869PkDnaPEd/Pxw7PawC+li0gi\nNRV8iCEx85aFxcyOhqn0WZOasxee\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIID/zCCAuegAwIBAgIBRzANBgkqhkiG9w0BAQUFADCBijELMAkGA1UEBhMCVVMx\nEzARBgNVBAgMCldhc2hpbmd0b24xEDAOBgNVBAcMB1NlYXR0bGUxIjAgBgNVBAoM\nGUFtYXpvbiBXZWIgU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMx\nGzAZBgNVBAMMEkFtYXpvbiBSRFMgUm9vdCBDQTAeFw0xNTAyMDUyMjAzMzFaFw0y\nMDAzMDUyMjAzMzFaMIGSMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2FzaGluZ3Rv\nbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBTZXJ2aWNl\ncywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzEjMCEGA1UEAwwaQW1hem9uIFJE\nUyBldS1jZW50cmFsLTEgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB\nAQDFtP2dhSLuaPOI4ZrrPWsK4OY9ocQBp3yApH1KJYmI9wpQKZG/KCH2E6Oo7JAw\nQORU519r033T+FO2Z7pFPlmz1yrxGXyHpJs8ySx3Yo5S8ncDCdZJCLmtPiq/hahg\n5/0ffexMFUCQaYicFZsrJ/cStdxUV+tSw2JQLD7UxS9J97LQWUPyyG+ZrjYVTVq+\nzudnFmNSe4QoecXMhAFTGJFQXxP7nhSL9Ao5FGgdXy7/JWeWdQIAj8ku6cBDKPa6\nY6kP+ak+In+Lye8z9qsCD/afUozfWjPR2aA4JoIZVF8dNRShIMo8l0XfgfM2q0+n\nApZWZ+BjhIO5XuoUgHS3D2YFAgMBAAGjZjBkMA4GA1UdDwEB/wQEAwIBBjASBgNV\nHRMBAf8ECDAGAQH/AgEAMB0GA1UdDgQWBBRm4GsWIA/M6q+tK8WGHWDGh2gcyTAf\nBgNVHSMEGDAWgBROAu6sPvYVyEztLPUFwY+chAhJgzANBgkqhkiG9w0BAQUFAAOC\nAQEAHpMmeVQNqcxgfQdbDIi5UIy+E7zZykmtAygN1XQrvga9nXTis4kOTN6g5/+g\nHCx7jIXeNJzAbvg8XFqBN84Quqgpl/tQkbpco9Jh1HDs558D5NnZQxNqH5qXQ3Mm\nuPgCw0pYcPOa7bhs07i+MdVwPBsX27CFDtsgAIru8HvKxY1oTZrWnyIRo93tt/pk\nWuItVMVHjaQZVfTCow0aDUbte6Vlw82KjUFq+n2NMSCJDiDKsDDHT6BJc4AJHIq3\n/4Z52MSC9KMr0yAaaoWfW/yMEj9LliQauAgwVjArF4q78rxpfKTG9Rfd8U1BZANP\n7FrFMN0ThjfA1IvmOYcgskY5bQ==\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIID/DCCAuSgAwIBAgIBSDANBgkqhkiG9w0BAQUFADCBijELMAkGA1UEBhMCVVMx\nEzARBgNVBAgMCldhc2hpbmd0b24xEDAOBgNVBAcMB1NlYXR0bGUxIjAgBgNVBAoM\nGUFtYXpvbiBXZWIgU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMx\nGzAZBgNVBAMMEkFtYXpvbiBSRFMgUm9vdCBDQTAeFw0xNTAyMDUyMjAzMzVaFw0y\nMDAzMDUyMjAzMzVaMIGPMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2FzaGluZ3Rv\nbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBTZXJ2aWNl\ncywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzEgMB4GA1UEAwwXQW1hem9uIFJE\nUyBldS13ZXN0LTEgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCx\nPdbqQ0HKRj79Pmocxvjc+P6i4Ux24kgFIl+ckiir1vzkmesc3a58gjrMlCksEObt\nYihs5IhzEq1ePT0gbfS9GYFp34Uj/MtPwlrfCBWG4d2TcrsKRHr1/EXUYhWqmdrb\nRhX8XqoRhVkbF/auzFSBhTzcGGvZpQ2KIaxRcQfcXlMVhj/pxxAjh8U4F350Fb0h\nnX1jw4/KvEreBL0Xb2lnlGTkwVxaKGSgXEnOgIyOFdOQc61vdome0+eeZsP4jqeR\nTGYJA9izJsRbe2YJxHuazD+548hsPlM3vFzKKEVURCha466rAaYAHy3rKur3HYQx\nYt+SoKcEz9PXuSGj96ejAgMBAAGjZjBkMA4GA1UdDwEB/wQEAwIBBjASBgNVHRMB\nAf8ECDAGAQH/AgEAMB0GA1UdDgQWBBTebg//h2oeXbZjQ4uuoiuLYzuiPDAfBgNV\nHSMEGDAWgBROAu6sPvYVyEztLPUFwY+chAhJgzANBgkqhkiG9w0BAQUFAAOCAQEA\nTikPaGeZasTPw+4RBemlsyPAjtFFQLo7ddaFdORLgdEysVf8aBqndvbA6MT/v4lj\nGtEtUdF59ZcbWOrVm+fBZ2h/jYJ59dYF/xzb09nyRbdMSzB9+mkSsnOMqluq5y8o\nDY/PfP2vGhEg/2ZncRC7nlQU1Dm8F4lFWEiQ2fi7O1cW852Vmbq61RIfcYsH/9Ma\nkpgk10VZ75b8m3UhmpZ/2uRY+JEHImH5WpcTJ7wNiPNJsciZMznGtrgOnPzYco8L\ncDleOASIZifNMQi9PKOJKvi0ITz0B/imr8KBsW0YjZVJ54HMa7W1lwugSM7aMAs+\nE3Sd5lS+SHwWaOCHwhOEVA==\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIID/DCCAuSgAwIBAgIBSTANBgkqhkiG9w0BAQUFADCBijELMAkGA1UEBhMCVVMx\nEzARBgNVBAgMCldhc2hpbmd0b24xEDAOBgNVBAcMB1NlYXR0bGUxIjAgBgNVBAoM\nGUFtYXpvbiBXZWIgU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMx\nGzAZBgNVBAMMEkFtYXpvbiBSRFMgUm9vdCBDQTAeFw0xNTAyMDUyMjAzNDBaFw0y\nMDAzMDUyMjAzNDBaMIGPMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2FzaGluZ3Rv\nbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBTZXJ2aWNl\ncywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzEgMB4GA1UEAwwXQW1hem9uIFJE\nUyBzYS1lYXN0LTEgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCU\nX4OBnQ5xA6TLJAiFEI6l7bUWjoVJBa/VbMdCCSs2i2dOKmqUaXu2ix2zcPILj3lZ\nGMk3d/2zvTK/cKhcFrewHUBamTeVHdEmynhMQamqNmkM4ptYzFcvEUw1TGxHT4pV\nQ6gSN7+/AJewQvyHexHo8D0+LDN0/Wa9mRm4ixCYH2CyYYJNKaZt9+EZfNu+PPS4\n8iB0TWH0DgQkbWMBfCRgolLLitAZklZ4dvdlEBS7evN1/7ttBxUK6SvkeeSx3zBl\nww3BlXqc3bvTQL0A+RRysaVyFbvtp9domFaDKZCpMmDFAN/ntx215xmQdrSt+K3F\ncXdGQYHx5q410CAclGnbAgMBAAGjZjBkMA4GA1UdDwEB/wQEAwIBBjASBgNVHRMB\nAf8ECDAGAQH/AgEAMB0GA1UdDgQWBBT6iVWnm/uakS+tEX2mzIfw+8JL0zAfBgNV\nHSMEGDAWgBROAu6sPvYVyEztLPUFwY+chAhJgzANBgkqhkiG9w0BAQUFAAOCAQEA\nFmDD+QuDklXn2EgShwQxV13+txPRuVdOSrutHhoCgMwFWCMtPPtBAKs6KPY7Guvw\nDpJoZSehDiOfsgMirjOWjvfkeWSNvKfjWTVneX7pZD9W5WPnsDBvTbCGezm+v87z\nb+ZM2ZMo98m/wkMcIEAgdSKilR2fuw8rLkAjhYFfs0A7tDgZ9noKwgHvoE4dsrI0\nKZYco6DlP/brASfHTPa2puBLN9McK3v+h0JaSqqm5Ro2Bh56tZkQh8AWy/miuDuK\n3+hNEVdxosxlkM1TPa1DGj0EzzK0yoeerXuH2HX7LlCrrxf6/wdKnjR12PMrLQ4A\npCqkcWw894z6bV9MAvKe6A==\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIID/DCCAuSgAwIBAgIBQzANBgkqhkiG9w0BAQUFADCBijELMAkGA1UEBhMCVVMx\nEzARBgNVBAgMCldhc2hpbmd0b24xEDAOBgNVBAcMB1NlYXR0bGUxIjAgBgNVBAoM\nGUFtYXpvbiBXZWIgU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMx\nGzAZBgNVBAMMEkFtYXpvbiBSRFMgUm9vdCBDQTAeFw0xNTAyMDUyMTU0MDRaFw0y\nMDAzMDUyMTU0MDRaMIGPMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2FzaGluZ3Rv\nbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBTZXJ2aWNl\ncywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzEgMB4GA1UEAwwXQW1hem9uIFJE\nUyB1cy1lYXN0LTEgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDI\nUIuwh8NusKHk1SqPXcP7OqxY3S/M2ZyQWD3w7Bfihpyyy/fc1w0/suIpX3kbMhAV\n2ESwged2/2zSx4pVnjp/493r4luhSqQYzru78TuPt9bhJIJ51WXunZW2SWkisSaf\nUSYUzVN9ezR/bjXTumSUQaLIouJt3OHLX49s+3NAbUyOI8EdvgBQWD68H1epsC0n\nCI5s+pIktyOZ59c4DCDLQcXErQ+tNbDC++oct1ANd/q8p9URonYwGCGOBy7sbCYq\n9eVHh1Iy2M+SNXddVOGw5EuruvHoCIQyOz5Lz4zSuZA9dRbrfztNOpezCNYu6NKM\nn+hzcvdiyxv77uNm8EaxAgMBAAGjZjBkMA4GA1UdDwEB/wQEAwIBBjASBgNVHRMB\nAf8ECDAGAQH/AgEAMB0GA1UdDgQWBBQSQG3TmMe6Sa3KufaPBa72v4QFDzAfBgNV\nHSMEGDAWgBROAu6sPvYVyEztLPUFwY+chAhJgzANBgkqhkiG9w0BAQUFAAOCAQEA\nL/mOZfB3187xTmjOHMqN2G2oSKHBKiQLM9uv8+97qT+XR+TVsBT6b3yoPpMAGhHA\nPc7nxAF5gPpuzatx0OTLPcmYucFmfqT/1qA5WlgCnMNtczyNMH97lKFTNV7Njtek\njWEzAEQSyEWrkNpNlC4j6kMYyPzVXQeXUeZTgJ9FNnVZqmvfjip2N22tawMjrCn5\n7KN/zN65EwY2oO9XsaTwwWmBu3NrDdMbzJnbxoWcFWj4RBwanR1XjQOVNhDwmCOl\n/1Et13b8CPyj69PC8BOVU6cfTSx8WUVy0qvYOKHNY9Bqa5BDnIL3IVmUkeTlM1mt\nenRpyBj+Bk9rh/ICdiRKmA==\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIID/DCCAuSgAwIBAgIBSjANBgkqhkiG9w0BAQUFADCBijELMAkGA1UEBhMCVVMx\nEzARBgNVBAgMCldhc2hpbmd0b24xEDAOBgNVBAcMB1NlYXR0bGUxIjAgBgNVBAoM\nGUFtYXpvbiBXZWIgU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMx\nGzAZBgNVBAMMEkFtYXpvbiBSRFMgUm9vdCBDQTAeFw0xNTAyMDUyMjAzNDVaFw0y\nMDAzMDUyMjAzNDVaMIGPMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2FzaGluZ3Rv\nbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBTZXJ2aWNl\ncywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzEgMB4GA1UEAwwXQW1hem9uIFJE\nUyB1cy13ZXN0LTEgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDE\nDhw+uw/ycaiIhhyu2pXFRimq0DlB8cNtIe8hdqndH8TV/TFrljNgR8QdzOgZtZ9C\nzzQ2GRpInN/qJF6slEd6wO+6TaDBQkPY+07TXNt52POFUhdVkhJXHpE2BS7Xn6J7\n7RFAOeG1IZmc2DDt+sR1BgXzUqHslQGfFYNS0/MBO4P+ya6W7IhruB1qfa4HiYQS\ndbe4MvGWnv0UzwAqdR7OF8+8/5c58YXZIXCO9riYF2ql6KNSL5cyDPcYK5VK0+Q9\nVI6vuJHSMYcF7wLePw8jtBktqAFE/wbdZiIHhZvNyiNWPPNTGUmQbaJ+TzQEHDs5\n8en+/W7JKnPyBOkxxENbAgMBAAGjZjBkMA4GA1UdDwEB/wQEAwIBBjASBgNVHRMB\nAf8ECDAGAQH/AgEAMB0GA1UdDgQWBBS0nw/tFR9bCjgqWTPJkyy4oOD8bzAfBgNV\nHSMEGDAWgBROAu6sPvYVyEztLPUFwY+chAhJgzANBgkqhkiG9w0BAQUFAAOCAQEA\nCXGAY3feAak6lHdqj6+YWjy6yyUnLK37bRxZDsyDVXrPRQaXRzPTzx79jvDwEb/H\nQ/bdQ7zQRWqJcbivQlwhuPJ4kWPUZgSt3JUUuqkMsDzsvj/bwIjlrEFDOdHGh0mi\neVIngFEjUXjMh+5aHPEF9BlQnB8LfVtKj18e15UDTXFa+xJPFxUR7wDzCfo4WI1m\nsUMG4q1FkGAZgsoyFPZfF8IVvgCuGdR8z30VWKklFxttlK0eGLlPAyIO0CQxPQlo\nsaNJrHf4tLOgZIWk+LpDhNd9Et5EzvJ3aURUsKY4pISPPF5WdvM9OE59bERwUErd\nnuOuQWQeeadMceZnauRzJQ==\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIID/DCCAuSgAwIBAgIBSzANBgkqhkiG9w0BAQUFADCBijELMAkGA1UEBhMCVVMx\nEzARBgNVBAgMCldhc2hpbmd0b24xEDAOBgNVBAcMB1NlYXR0bGUxIjAgBgNVBAoM\nGUFtYXpvbiBXZWIgU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMx\nGzAZBgNVBAMMEkFtYXpvbiBSRFMgUm9vdCBDQTAeFw0xNTAyMDUyMjAzNTBaFw0y\nMDAzMDUyMjAzNTBaMIGPMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2FzaGluZ3Rv\nbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBTZXJ2aWNl\ncywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzEgMB4GA1UEAwwXQW1hem9uIFJE\nUyB1cy13ZXN0LTIgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDM\nH58SR48U6jyERC1vYTnub34smf5EQVXyzaTmspWGWGzT31NLNZGSDFaa7yef9kdO\nmzJsgebR5tXq6LdwlIoWkKYQ7ycUaadtVKVYdI40QcI3cHn0qLFlg2iBXmWp/B+i\nZ34VuVlCh31Uj5WmhaBoz8t/GRqh1V/aCsf3Wc6jCezH3QfuCjBpzxdOOHN6Ie2v\nxX09O5qmZTvMoRBAvPkxdaPg/Mi7fxueWTbEVk78kuFbF1jHYw8U1BLILIAhcqlq\nx4u8nl73t3O3l/soNUcIwUDK0/S+Kfqhwn9yQyPlhb4Wy3pfnZLJdkyHldktnQav\n9TB9u7KH5Lk0aAYslMLxAgMBAAGjZjBkMA4GA1UdDwEB/wQEAwIBBjASBgNVHRMB\nAf8ECDAGAQH/AgEAMB0GA1UdDgQWBBT8roM4lRnlFHWMPWRz0zkwFZog1jAfBgNV\nHSMEGDAWgBROAu6sPvYVyEztLPUFwY+chAhJgzANBgkqhkiG9w0BAQUFAAOCAQEA\nJwrxwgwmPtcdaU7O7WDdYa4hprpOMamI49NDzmE0s10oGrqmLwZygcWU0jT+fJ+Y\npJe1w0CVfKaeLYNsOBVW3X4ZPmffYfWBheZiaiEflq/P6t7/Eg81gaKYnZ/x1Dfa\nsUYkzPvCkXe9wEz5zdUTOCptDt89rBR9CstL9vE7WYUgiVVmBJffWbHQLtfjv6OF\nNMb0QME981kGRzc2WhgP71YS2hHd1kXtsoYP1yTu4vThSKsoN4bkiHsaC1cRkLoy\n0fFA4wpB3WloMEvCDaUvvH1LZlBXTNlwi9KtcwD4tDxkkBt4tQczKLGpQ/nF/W9n\n8YDWk3IIc1sd0bkZqoau2Q==\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIID/TCCAuWgAwIBAgIBTTANBgkqhkiG9w0BAQsFADCBijELMAkGA1UEBhMCVVMx\nEzARBgNVBAgMCldhc2hpbmd0b24xEDAOBgNVBAcMB1NlYXR0bGUxIjAgBgNVBAoM\nGUFtYXpvbiBXZWIgU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMx\nGzAZBgNVBAMMEkFtYXpvbiBSRFMgUm9vdCBDQTAeFw0xNjA1MDMyMTI5MjJaFw0y\nMDAzMDUyMTI5MjJaMIGQMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2FzaGluZ3Rv\nbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBTZXJ2aWNl\ncywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzEhMB8GA1UEAwwYQW1hem9uIFJE\nUyBhcC1zb3V0aC0xIENBMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA\n06eWGLE0TeqL9kyWOLkS8q0fXO97z+xyBV3DKSB2lg2GkgBz3B98MkmkeB0SZy3G\nCe4uCpCPbFKiFEdiUclOlhZsrBuCeaimxLM3Ig2wuenElO/7TqgaYHYUbT3d+VQW\nGUbLn5GRZJZe1OAClYdOWm7A1CKpuo+cVV1vxbY2nGUQSJPpVn2sT9gnwvjdE60U\nJGYU/RLCTm8zmZBvlWaNIeKDnreIc4rKn6gUnJ2cQn1ryCVleEeyc3xjYDSrjgdn\nFLYGcp9mphqVT0byeQMOk0c7RHpxrCSA0V5V6/CreFV2LteK50qcDQzDSM18vWP/\np09FoN8O7QrtOeZJzH/lmwIDAQABo2YwZDAOBgNVHQ8BAf8EBAMCAQYwEgYDVR0T\nAQH/BAgwBgEB/wIBADAdBgNVHQ4EFgQU2i83QHuEl/d0keXF+69HNJph7cMwHwYD\nVR0jBBgwFoAUTgLurD72FchM7Sz1BcGPnIQISYMwDQYJKoZIhvcNAQELBQADggEB\nACqnH2VjApoDqoSQOky52QBwsGaj+xWYHW5Gm7EvCqvQuhWMkeBuD6YJmMvNyA9G\nI2lh6/o+sUk/RIsbYbxPRdhNPTOgDR9zsNRw6qxaHztq/CEC+mxDCLa3O1hHBaDV\nBmB3nCZb93BvO0EQSEk7aytKq/f+sjyxqOcs385gintdHGU9uM7gTZHnU9vByJsm\n/TL07Miq67X0NlhIoo3jAk+xHaeKJdxdKATQp0448P5cY20q4b8aMk1twcNaMvCP\ndG4M5doaoUA8OQ/0ukLLae/LBxLeTw04q1/a2SyFaVUX2Twbb1S3xVWwLA8vsyGr\nigXx7B5GgP+IHb6DTjPJAi0=\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIID/DCCAuSgAwIBAgIBTjANBgkqhkiG9w0BAQsFADCBijELMAkGA1UEBhMCVVMx\nEzARBgNVBAgMCldhc2hpbmd0b24xEDAOBgNVBAcMB1NlYXR0bGUxIjAgBgNVBAoM\nGUFtYXpvbiBXZWIgU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMx\nGzAZBgNVBAMMEkFtYXpvbiBSRFMgUm9vdCBDQTAeFw0xNjA4MTExOTU4NDVaFw0y\nMDAzMDUxOTU4NDVaMIGPMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2FzaGluZ3Rv\nbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBTZXJ2aWNl\ncywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzEgMB4GA1UEAwwXQW1hem9uIFJE\nUyB1cy1lYXN0LTIgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCp\nWnnUX7wM0zzstccX+4iXKJa9GR0a2PpvB1paEX4QRCgfhEdQWDaSqyrWNgdVCKkt\n1aQkWu5j6VAC2XIG7kKoonm1ZdBVyBLqW5lXNywlaiU9yhJkwo8BR+/OqgE+PLt/\nEO1mlN0PQudja/XkExCXTO29TG2j7F/O7hox6vTyHNHc0H88zS21uPuBE+jivViS\nyzj/BkyoQ85hnkues3f9R6gCGdc+J51JbZnmgzUkvXjAEuKhAm9JksVOxcOKUYe5\nERhn0U9zjzpfbAITIkul97VVa5IxskFFTHIPJbvRKHJkiF6wTJww/tc9wm+fSCJ1\n+DbQTGZgkQ3bJrqRN29/AgMBAAGjZjBkMA4GA1UdDwEB/wQEAwIBBjASBgNVHRMB\nAf8ECDAGAQH/AgEAMB0GA1UdDgQWBBSAHQzUYYZbepwKEMvGdHp8wzHnfDAfBgNV\nHSMEGDAWgBROAu6sPvYVyEztLPUFwY+chAhJgzANBgkqhkiG9w0BAQsFAAOCAQEA\nMbaEzSYZ+aZeTBxf8yi0ta8K4RdwEJsEmP6IhFFQHYUtva2Cynl4Q9tZg3RMsybT\n9mlnSQQlbN/wqIIXbkrcgFcHoXG9Odm/bDtUwwwDaiEhXVfeQom3G77QHOWMTCGK\nqadwuh5msrb17JdXZoXr4PYHDKP7j0ONfAyFNER2+uecblHfRSpVq5UeF3L6ZJb8\nfSw/GtAV6an+/0r+Qm+PiI2H5XuZ4GmRJYnGMhqWhBYrY7p3jtVnKcsh39wgfUnW\nAvZEZG/yhFyAZW0Essa39LiL5VSq14Y1DOj0wgnhSY/9WHxaAo1HB1T9OeZknYbD\nfl/EGSZ0TEvZkENrXcPlVA==\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIID/zCCAuegAwIBAgIBTzANBgkqhkiG9w0BAQsFADCBijELMAkGA1UEBhMCVVMx\nEzARBgNVBAgMCldhc2hpbmd0b24xEDAOBgNVBAcMB1NlYXR0bGUxIjAgBgNVBAoM\nGUFtYXpvbiBXZWIgU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMx\nGzAZBgNVBAMMEkFtYXpvbiBSRFMgUm9vdCBDQTAeFw0xNjA5MTUwMDEwMTFaFw0y\nMDAzMDUwMDEwMTFaMIGSMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2FzaGluZ3Rv\nbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBTZXJ2aWNl\ncywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzEjMCEGA1UEAwwaQW1hem9uIFJE\nUyBjYS1jZW50cmFsLTEgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB\nAQCZYI/iQ6DrS3ny3t1EwX1wAD+3LMgh7Fd01EW5LIuaK2kYIIQpsVKhxLCit/V5\nAGc/1qiJS1Qz9ODLTh0Na6bZW6EakRzuHJLe32KJtoFYPC7Z09UqzXrpA/XL+1hM\nP0ZmCWsU7Nn/EmvfBp9zX3dZp6P6ATrvDuYaVFr+SA7aT3FXpBroqBS1fyzUPs+W\nc6zTR6+yc4zkHX0XQxC5RH6xjgpeRkoOajA/sNo7AQF7KlWmKHbdVF44cvvAhRKZ\nXaoVs/C4GjkaAEPTCbopYdhzg+KLx9eB2BQnYLRrIOQZtRfbQI2Nbj7p3VsRuOW1\ntlcks2w1Gb0YC6w6SuIMFkl1AgMBAAGjZjBkMA4GA1UdDwEB/wQEAwIBBjASBgNV\nHRMBAf8ECDAGAQH/AgEAMB0GA1UdDgQWBBToYWxE1lawl6Ks6NsvpbHQ3GKEtzAf\nBgNVHSMEGDAWgBROAu6sPvYVyEztLPUFwY+chAhJgzANBgkqhkiG9w0BAQsFAAOC\nAQEAG/8tQ0ooi3hoQpa5EJz0/E5VYBsAz3YxA2HoIonn0jJyG16bzB4yZt4vNQMA\nKsNlQ1uwDWYL1nz63axieUUFIxqxl1KmwfhsmLgZ0Hd2mnTPIl2Hw3uj5+wdgGBg\nagnAZ0bajsBYgD2VGQbqjdk2Qn7Fjy3LEWIvGZx4KyZ99OJ2QxB7JOPdauURAtWA\nDKYkP4LLJxtj07DSzG8kuRWb9B47uqUD+eKDIyjfjbnzGtd9HqqzYFau7EX3HVD9\n9Qhnjl7bTZ6YfAEZ3nH2t3Vc0z76XfGh47rd0pNRhMV+xpok75asKf/lNh5mcUrr\nVKwflyMkQpSbDCmcdJ90N2xEXQ==\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIID/DCCAuSgAwIBAgIBUDANBgkqhkiG9w0BAQsFADCBijELMAkGA1UEBhMCVVMx\nEzARBgNVBAgMCldhc2hpbmd0b24xEDAOBgNVBAcMB1NlYXR0bGUxIjAgBgNVBAoM\nGUFtYXpvbiBXZWIgU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMx\nGzAZBgNVBAMMEkFtYXpvbiBSRFMgUm9vdCBDQTAeFw0xNjEwMTAxNzQ0NDJaFw0y\nMDAzMDUxNzQ0NDJaMIGPMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2FzaGluZ3Rv\nbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBTZXJ2aWNl\ncywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzEgMB4GA1UEAwwXQW1hem9uIFJE\nUyBldS13ZXN0LTIgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDO\ncttLJfubB4XMMIGWNfJISkIdCMGJyOzLiMJaiWB5GYoXKhEl7YGotpy0qklwW3BQ\na0fmVdcCLX+dIuVQ9iFK+ZcK7zwm7HtdDTCHOCKeOh2IcnU4c/VIokFi6Gn8udM6\nN/Zi5M5OGpVwLVALQU7Yctsn3c95el6MdVx6mJiIPVu7tCVZn88Z2koBQ2gq9P4O\nSb249SHFqOb03lYDsaqy1NDsznEOhaRBw7DPJFpvmw1lA3/Y6qrExRI06H2VYR2i\n7qxwDV50N58fs10n7Ye1IOxTVJsgEA7X6EkRRXqYaM39Z76R894548WHfwXWjUsi\nMEX0RS0/t1GmnUQjvevDAgMBAAGjZjBkMA4GA1UdDwEB/wQEAwIBBjASBgNVHRMB\nAf8ECDAGAQH/AgEAMB0GA1UdDgQWBBQBxmcuRSxERYCtNnSr5xNfySokHjAfBgNV\nHSMEGDAWgBROAu6sPvYVyEztLPUFwY+chAhJgzANBgkqhkiG9w0BAQsFAAOCAQEA\nUyCUQjsF3nUAABjfEZmpksTuUo07aT3KGYt+EMMFdejnBQ0+2lJJFGtT+CDAk1SD\nRSgfEBon5vvKEtlnTf9a3pv8WXOAkhfxnryr9FH6NiB8obISHNQNPHn0ljT2/T+I\nY6ytfRvKHa0cu3V0NXbJm2B4KEOt4QCDiFxUIX9z6eB4Kditwu05OgQh6KcogOiP\nJesWxBMXXGoDC1rIYTFO7szwDyOHlCcVXJDNsTJhc32oDWYdeIbW7o/5I+aQsrXZ\nC96HykZcgWzz6sElrQxUaT3IoMw/5nmw4uWKKnZnxgI9bY4fpQwMeBZ96iHfFxvH\nmqfEEuC7uUoPofXdBp2ObQ==\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIECjCCAvKgAwIBAgICEAAwDQYJKoZIhvcNAQELBQAwgZMxCzAJBgNVBAYTAlVT\nMRAwDgYDVQQHDAdTZWF0dGxlMRMwEQYDVQQIDApXYXNoaW5ndG9uMSIwIAYDVQQK\nDBlBbWF6b24gV2ViIFNlcnZpY2VzLCBJbmMuMRMwEQYDVQQLDApBbWF6b24gUkRT\nMSQwIgYDVQQDDBtBbWF6b24gUkRTIEdvdkNsb3VkIFJvb3QgQ0EwHhcNMTcwNTE5\nMjIzMTE5WhcNMjIwNTE4MTIwMDAwWjCBkzELMAkGA1UEBhMCVVMxEzARBgNVBAgM\nCldhc2hpbmd0b24xEDAOBgNVBAcMB1NlYXR0bGUxIjAgBgNVBAoMGUFtYXpvbiBX\nZWIgU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMxJDAiBgNVBAMM\nG0FtYXpvbiBSRFMgdXMtZ292LXdlc3QtMSBDQTCCASIwDQYJKoZIhvcNAQEBBQAD\nggEPADCCAQoCggEBAM8YZLKAzzOdNnoi7Klih26Zkj+OCpDfwx4ZYB6f8L8UoQi5\n8z9ZtIwMjiJ/kO08P1yl4gfc7YZcNFvhGruQZNat3YNpxwUpQcr4mszjuffbL4uz\n+/8FBxALdqCVOJ5Q0EVSfz3d9Bd1pUPL7ARtSpy7bn/tUPyQeI+lODYO906C0TQ3\nb9bjOsgAdBKkHfjLdsknsOZYYIzYWOJyFJJa0B11XjDUNBy/3IuC0KvDl6At0V5b\n8M6cWcKhte2hgjwTYepV+/GTadeube1z5z6mWsN5arOAQUtYDLH6Aztq9mCJzLHm\nRccBugnGl3fRLJ2VjioN8PoGoN9l9hFBy5fnFgsCAwEAAaNmMGQwDgYDVR0PAQH/\nBAQDAgEGMBIGA1UdEwEB/wQIMAYBAf8CAQAwHQYDVR0OBBYEFEG7+br8KkvwPd5g\n71Rvh2stclJbMB8GA1UdIwQYMBaAFEkQz6S4NS5lOYKcDjBSuCcVpdzjMA0GCSqG\nSIb3DQEBCwUAA4IBAQBMA327u5ABmhX+aPxljoIbxnydmAFWxW6wNp5+rZrvPig8\nzDRqGQWWr7wWOIjfcWugSElYtf/m9KZHG/Z6+NG7nAoUrdcd1h/IQhb+lFQ2b5g9\nsVzQv/H2JNkfZA8fL/Ko/Tm/f9tcqe0zrGCtT+5u0Nvz35Wl8CEUKLloS5xEb3k5\n7D9IhG3fsE3vHWlWrGCk1cKry3j12wdPG5cUsug0vt34u6rdhP+FsM0tHI15Kjch\nRuUCvyQecy2ZFNAa3jmd5ycNdL63RWe8oayRBpQBxPPCbHfILxGZEdJbCH9aJ2D/\nl8oHIDnvOLdv7/cBjyYuvmprgPtu3QEkbre5Hln/\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIID/DCCAuSgAwIBAgIBUTANBgkqhkiG9w0BAQsFADCBijELMAkGA1UEBhMCVVMx\nEzARBgNVBAgMCldhc2hpbmd0b24xEDAOBgNVBAcMB1NlYXR0bGUxIjAgBgNVBAoM\nGUFtYXpvbiBXZWIgU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMx\nGzAZBgNVBAMMEkFtYXpvbiBSRFMgUm9vdCBDQTAeFw0xNzA4MjUyMTM5MjZaFw0y\nMDAzMDUyMTM5MjZaMIGPMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2FzaGluZ3Rv\nbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBTZXJ2aWNl\ncywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzEgMB4GA1UEAwwXQW1hem9uIFJE\nUyBldS13ZXN0LTMgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC+\nxmlEC/3a4cJH+UPwXCE02lC7Zq5NHd0dn6peMeLN8agb6jW4VfSY0NydjRj2DJZ8\nK7wV6sub5NUGT1NuFmvSmdbNR2T59KX0p2dVvxmXHHtIpQ9Y8Aq3ZfhmC5q5Bqgw\ntMA1xayDi7HmoPX3R8kk9ktAZQf6lDeksCvok8idjTu9tiSpDiMwds5BjMsWfyjZ\nd13PTGGNHYVdP692BSyXzSP1Vj84nJKnciW8tAqwIiadreJt5oXyrCXi8ekUMs80\ncUTuGm3aA3Q7PB5ljJMPqz0eVddaiIvmTJ9O3Ez3Du/HpImyMzXjkFaf+oNXf/Hx\n/EW5jCRR6vEiXJcDRDS7AgMBAAGjZjBkMA4GA1UdDwEB/wQEAwIBBjASBgNVHRMB\nAf8ECDAGAQH/AgEAMB0GA1UdDgQWBBRZ9mRtS5fHk3ZKhG20Oack4cAqMTAfBgNV\nHSMEGDAWgBROAu6sPvYVyEztLPUFwY+chAhJgzANBgkqhkiG9w0BAQsFAAOCAQEA\nF/u/9L6ExQwD73F/bhCw7PWcwwqsK1mypIdrjdIsu0JSgwWwGCXmrIspA3n3Dqxq\nsMhAJD88s9Em7337t+naar2VyLO63MGwjj+vA4mtvQRKq8ScIpiEc7xN6g8HUMsd\ngPG9lBGfNjuAZsrGJflrko4HyuSM7zHExMjXLH+CXcv/m3lWOZwnIvlVMa4x0Tz0\nA4fklaawryngzeEjuW6zOiYCzjZtPlP8Fw0SpzppJ8VpQfrZ751RDo4yudmPqoPK\n5EUe36L8U+oYBXnC5TlYs9bpVv9o5wJQI5qA9oQE2eFWxF1E0AyZ4V5sgGUBStaX\nBjDDWul0wSo7rt1Tq7XpnA==\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIEATCCAumgAwIBAgIBTjANBgkqhkiG9w0BAQUFADCBijELMAkGA1UEBhMCVVMx\nEzARBgNVBAgMCldhc2hpbmd0b24xEDAOBgNVBAcMB1NlYXR0bGUxIjAgBgNVBAoM\nGUFtYXpvbiBXZWIgU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMx\nGzAZBgNVBAMMEkFtYXpvbiBSRFMgUm9vdCBDQTAeFw0xNzEyMDEwMDU1NDJaFw0y\nMDAzMDUwMDU1NDJaMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2FzaGluZ3Rv\nbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBTZXJ2aWNl\ncywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzElMCMGA1UEAwwcQW1hem9uIFJE\nUyBhcC1ub3J0aGVhc3QtMyBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC\nggEBAMZtQNnm/XT19mTa10ftHLzg5UhajoI65JHv4TQNdGXdsv+CQdGYU49BJ9Eu\n3bYgiEtTzR2lQe9zGMvtuJobLhOWuavzp7IixoIQcHkFHN6wJ1CvqrxgvJfBq6Hy\nEuCDCiU+PPDLUNA6XM6Qx3IpHd1wrJkjRB80dhmMSpxmRmx849uFafhN+P1QybsM\nTI0o48VON2+vj+mNuQTyLMMP8D4odSQHjaoG+zyJfJGZeAyqQyoOUOFEyQaHC3TT\n3IDSNCQlpxb9LerbCoKu79WFBBq3CS5cYpg8/fsnV2CniRBFFUumBt5z4dhw9RJU\nqlUXXO1ZyzpGd+c5v6FtrfXtnIUCAwEAAaNmMGQwDgYDVR0PAQH/BAQDAgEGMBIG\nA1UdEwEB/wQIMAYBAf8CAQAwHQYDVR0OBBYEFETv7ELNplYy/xTeIOInl6nzeiHg\nMB8GA1UdIwQYMBaAFE4C7qw+9hXITO0s9QXBj5yECEmDMA0GCSqGSIb3DQEBBQUA\nA4IBAQCpKxOQcd0tEKb3OtsOY8q/MPwTyustGk2Rt7t9G68idADp8IytB7M0SDRo\nwWZqynEq7orQVKdVOanhEWksNDzGp0+FPAf/KpVvdYCd7ru3+iI+V4ZEp2JFdjuZ\nZz0PIjS6AgsZqE5Ri1J+NmfmjGZCPhsHnGZiBaenX6K5VRwwwmLN6xtoqrrfR5zL\nQfBeeZNJG6KiM3R/DxJ5rAa6Fz+acrhJ60L7HprhB7SFtj1RCijau3+ZwiGmUOMr\nyKlMv+VgmzSw7o4Hbxy1WVrA6zQsTHHSGf+vkQn2PHvnFMUEu/ZLbTDYFNmTLK91\nK6o4nMsEvhBKgo4z7H1EqqxXhvN2\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIEDjCCAvagAwIBAgIJAMM61RQn3/kdMA0GCSqGSIb3DQEBCwUAMIGTMQswCQYD\nVQQGEwJVUzEQMA4GA1UEBwwHU2VhdHRsZTETMBEGA1UECAwKV2FzaGluZ3RvbjEi\nMCAGA1UECgwZQW1hem9uIFdlYiBTZXJ2aWNlcywgSW5jLjETMBEGA1UECwwKQW1h\nem9uIFJEUzEkMCIGA1UEAwwbQW1hem9uIFJEUyBHb3ZDbG91ZCBSb290IENBMB4X\nDTE3MDUxOTIyMjkxMVoXDTIyMDUxODIyMjkxMVowgZMxCzAJBgNVBAYTAlVTMRAw\nDgYDVQQHDAdTZWF0dGxlMRMwEQYDVQQIDApXYXNoaW5ndG9uMSIwIAYDVQQKDBlB\nbWF6b24gV2ViIFNlcnZpY2VzLCBJbmMuMRMwEQYDVQQLDApBbWF6b24gUkRTMSQw\nIgYDVQQDDBtBbWF6b24gUkRTIEdvdkNsb3VkIFJvb3QgQ0EwggEiMA0GCSqGSIb3\nDQEBAQUAA4IBDwAwggEKAoIBAQDGS9bh1FGiJPT+GRb3C5aKypJVDC1H2gbh6n3u\nj8cUiyMXfmm+ak402zdLpSYMaxiQ7oL/B3wEmumIpRDAsQrSp3B/qEeY7ipQGOfh\nq2TXjXGIUjiJ/FaoGqkymHRLG+XkNNBtb7MRItsjlMVNELXECwSiMa3nJL2/YyHW\nnTr1+11/weeZEKgVbCUrOugFkMXnfZIBSn40j6EnRlO2u/NFU5ksK5ak2+j8raZ7\nxW7VXp9S1Tgf1IsWHjGZZZguwCkkh1tHOlHC9gVA3p63WecjrIzcrR/V27atul4m\ntn56s5NwFvYPUIx1dbC8IajLUrepVm6XOwdQCfd02DmOyjWJAgMBAAGjYzBhMA4G\nA1UdDwEB/wQEAwIBBjAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRJEM+kuDUu\nZTmCnA4wUrgnFaXc4zAfBgNVHSMEGDAWgBRJEM+kuDUuZTmCnA4wUrgnFaXc4zAN\nBgkqhkiG9w0BAQsFAAOCAQEAcfA7uirXsNZyI2j4AJFVtOTKOZlQwqbyNducnmlg\n/5nug9fAkwM4AgvF5bBOD1Hw6khdsccMwIj+1S7wpL+EYb/nSc8G0qe1p/9lZ/mZ\nff5g4JOa26lLuCrZDqAk4TzYnt6sQKfa5ZXVUUn0BK3okhiXS0i+NloMyaBCL7vk\nkDwkHwEqflRKfZ9/oFTcCfoiHPA7AdBtaPVr0/Kj9L7k+ouz122huqG5KqX0Zpo8\nS0IGvcd2FZjNSNPttNAK7YuBVsZ0m2nIH1SLp//00v7yAHIgytQwwB17PBcp4NXD\npCfTa27ng9mMMC2YLqWQpW4TkqjDin2ZC+5X/mbrjzTvVg==\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIEBzCCAu+gAwIBAgICEAAwDQYJKoZIhvcNAQELBQAwgZQxCzAJBgNVBAYTAlVT\nMRAwDgYDVQQHDAdTZWF0dGxlMRMwEQYDVQQIDApXYXNoaW5ndG9uMSIwIAYDVQQK\nDBlBbWF6b24gV2ViIFNlcnZpY2VzLCBJbmMuMRMwEQYDVQQLDApBbWF6b24gUkRT\nMSUwIwYDVQQDDBxBbWF6b24gUkRTIGFwLWVhc3QtMSBSb290IENBMB4XDTE5MDIx\nNzAyNDcwMFoXDTIyMDYwMTEyMDAwMFowgY8xCzAJBgNVBAYTAlVTMRMwEQYDVQQI\nDApXYXNoaW5ndG9uMRAwDgYDVQQHDAdTZWF0dGxlMSIwIAYDVQQKDBlBbWF6b24g\nV2ViIFNlcnZpY2VzLCBJbmMuMRMwEQYDVQQLDApBbWF6b24gUkRTMSAwHgYDVQQD\nDBdBbWF6b24gUkRTIGFwLWVhc3QtMSBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEP\nADCCAQoCggEBAOcJAUofyJuBuPr5ISHi/Ha5ed8h3eGdzn4MBp6rytPOg9NVGRQs\nO93fNGCIKsUT6gPuk+1f1ncMTV8Y0Fdf4aqGWme+Khm3ZOP3V1IiGnVq0U2xiOmn\nSQ4Q7LoeQC4lC6zpoCHVJyDjZ4pAknQQfsXb77Togdt/tK5ahev0D+Q3gCwAoBoO\nDHKJ6t820qPi63AeGbJrsfNjLKiXlFPDUj4BGir4dUzjEeH7/hx37na1XG/3EcxP\n399cT5k7sY/CR9kctMlUyEEUNQOmhi/ly1Lgtihm3QfjL6K9aGLFNwX35Bkh9aL2\nF058u+n8DP/dPeKUAcJKiQZUmzuen5n57x8CAwEAAaNmMGQwDgYDVR0PAQH/BAQD\nAgEGMBIGA1UdEwEB/wQIMAYBAf8CAQAwHQYDVR0OBBYEFFlqgF4FQlb9yP6c+Q3E\nO3tXv+zOMB8GA1UdIwQYMBaAFK9T6sY/PBZVbnHcNcQXf58P4OuPMA0GCSqGSIb3\nDQEBCwUAA4IBAQDeXiS3v1z4jWAo1UvVyKDeHjtrtEH1Rida1eOXauFuEQa5tuOk\nE53Os4haZCW4mOlKjigWs4LN+uLIAe1aFXGo92nGIqyJISHJ1L+bopx/JmIbHMCZ\n0lTNJfR12yBma5VQy7vzeFku/SisKwX0Lov1oHD4MVhJoHbUJYkmAjxorcIHORvh\nI3Vj5XrgDWtLDPL8/Id/roul/L+WX5ir+PGScKBfQIIN2lWdZoqdsx8YWqhm/ikL\nC6qNieSwcvWL7C03ri0DefTQMY54r5wP33QU5hJ71JoaZI3YTeT0Nf+NRL4hM++w\nQ0veeNzBQXg1f/JxfeA39IDIX1kiCf71tGlT\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIEDDCCAvSgAwIBAgICcEUwDQYJKoZIhvcNAQELBQAwgY8xCzAJBgNVBAYTAlVT\nMRAwDgYDVQQHDAdTZWF0dGxlMRMwEQYDVQQIDApXYXNoaW5ndG9uMSIwIAYDVQQK\nDBlBbWF6b24gV2ViIFNlcnZpY2VzLCBJbmMuMRMwEQYDVQQLDApBbWF6b24gUkRT\nMSAwHgYDVQQDDBdBbWF6b24gUkRTIFJvb3QgMjAxOSBDQTAeFw0xOTA5MTgxNjU2\nMjBaFw0yNDA4MjIxNzA4NTBaMIGZMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2Fz\naGluZ3RvbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBT\nZXJ2aWNlcywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzEqMCgGA1UEAwwhQW1h\nem9uIFJEUyBhcC1ub3J0aGVhc3QtMSAyMDE5IENBMIIBIjANBgkqhkiG9w0BAQEF\nAAOCAQ8AMIIBCgKCAQEAndtkldmHtk4TVQAyqhAvtEHSMb6pLhyKrIFved1WO3S7\n+I+bWwv9b2W/ljJxLq9kdT43bhvzonNtI4a1LAohS6bqyirmk8sFfsWT3akb+4Sx\n1sjc8Ovc9eqIWJCrUiSvv7+cS7ZTA9AgM1PxvHcsqrcUXiK3Jd/Dax9jdZE1e15s\nBEhb2OEPE+tClFZ+soj8h8Pl2Clo5OAppEzYI4LmFKtp1X/BOf62k4jviXuCSst3\nUnRJzE/CXtjmN6oZySVWSe0rQYuyqRl6//9nK40cfGKyxVnimB8XrrcxUN743Vud\nQQVU0Esm8OVTX013mXWQXJHP2c0aKkog8LOga0vobQIDAQABo2YwZDAOBgNVHQ8B\nAf8EBAMCAQYwEgYDVR0TAQH/BAgwBgEB/wIBADAdBgNVHQ4EFgQULmoOS1mFSjj+\nsnUPx4DgS3SkLFYwHwYDVR0jBBgwFoAUc19g2LzLA5j0Kxc0LjZapmD/vB8wDQYJ\nKoZIhvcNAQELBQADggEBAAkVL2P1M2/G9GM3DANVAqYOwmX0Xk58YBHQu6iiQg4j\nb4Ky/qsZIsgT7YBsZA4AOcPKQFgGTWhe9pvhmXqoN3RYltN8Vn7TbUm/ZVDoMsrM\ngwv0+TKxW1/u7s8cXYfHPiTzVSJuOogHx99kBW6b2f99GbP7O1Sv3sLq4j6lVvBX\nFiacf5LAWC925nvlTzLlBgIc3O9xDtFeAGtZcEtxZJ4fnGXiqEnN4539+nqzIyYq\nnvlgCzyvcfRAxwltrJHuuRu6Maw5AGcd2Y0saMhqOVq9KYKFKuD/927BTrbd2JVf\n2sGWyuPZPCk3gq+5pCjbD0c6DkhcMGI6WwxvM5V/zSM=\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIEDDCCAvSgAwIBAgICOFAwDQYJKoZIhvcNAQELBQAwgY8xCzAJBgNVBAYTAlVT\nMRAwDgYDVQQHDAdTZWF0dGxlMRMwEQYDVQQIDApXYXNoaW5ndG9uMSIwIAYDVQQK\nDBlBbWF6b24gV2ViIFNlcnZpY2VzLCBJbmMuMRMwEQYDVQQLDApBbWF6b24gUkRT\nMSAwHgYDVQQDDBdBbWF6b24gUkRTIFJvb3QgMjAxOSBDQTAeFw0xOTA5MTAxNzQ2\nMjFaFw0yNDA4MjIxNzA4NTBaMIGZMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2Fz\naGluZ3RvbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBT\nZXJ2aWNlcywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzEqMCgGA1UEAwwhQW1h\nem9uIFJEUyBhcC1ub3J0aGVhc3QtMiAyMDE5IENBMIIBIjANBgkqhkiG9w0BAQEF\nAAOCAQ8AMIIBCgKCAQEAzU72e6XbaJbi4HjJoRNjKxzUEuChKQIt7k3CWzNnmjc5\n8I1MjCpa2W1iw1BYVysXSNSsLOtUsfvBZxi/1uyMn5ZCaf9aeoA9UsSkFSZBjOCN\nDpKPCmfV1zcEOvJz26+1m8WDg+8Oa60QV0ou2AU1tYcw98fOQjcAES0JXXB80P2s\n3UfkNcnDz+l4k7j4SllhFPhH6BQ4lD2NiFAP4HwoG6FeJUn45EPjzrydxjq6v5Fc\ncQ8rGuHADVXotDbEhaYhNjIrsPL+puhjWfhJjheEw8c4whRZNp6gJ/b6WEes/ZhZ\nh32DwsDsZw0BfRDUMgUn8TdecNexHUw8vQWeC181hwIDAQABo2YwZDAOBgNVHQ8B\nAf8EBAMCAQYwEgYDVR0TAQH/BAgwBgEB/wIBADAdBgNVHQ4EFgQUwW9bWgkWkr0U\nlrOsq2kvIdrECDgwHwYDVR0jBBgwFoAUc19g2LzLA5j0Kxc0LjZapmD/vB8wDQYJ\nKoZIhvcNAQELBQADggEBAEugF0Gj7HVhX0ehPZoGRYRt3PBuI2YjfrrJRTZ9X5wc\n9T8oHmw07mHmNy1qqWvooNJg09bDGfB0k5goC2emDiIiGfc/kvMLI7u+eQOoMKj6\nmkfCncyRN3ty08Po45vTLBFZGUvtQmjM6yKewc4sXiASSBmQUpsMbiHRCL72M5qV\nobcJOjGcIdDTmV1BHdWT+XcjynsGjUqOvQWWhhLPrn4jWe6Xuxll75qlrpn3IrIx\nCRBv/5r7qbcQJPOgwQsyK4kv9Ly8g7YT1/vYBlR3cRsYQjccw5ceWUj2DrMVWhJ4\nprf+E3Aa4vYmLLOUUvKnDQ1k3RGNu56V0tonsQbfsaM=\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIEDDCCAvSgAwIBAgICOYIwDQYJKoZIhvcNAQELBQAwgY8xCzAJBgNVBAYTAlVT\nMRAwDgYDVQQHDAdTZWF0dGxlMRMwEQYDVQQIDApXYXNoaW5ndG9uMSIwIAYDVQQK\nDBlBbWF6b24gV2ViIFNlcnZpY2VzLCBJbmMuMRMwEQYDVQQLDApBbWF6b24gUkRT\nMSAwHgYDVQQDDBdBbWF6b24gUkRTIFJvb3QgMjAxOSBDQTAeFw0xOTA5MTcyMDA1\nMjlaFw0yNDA4MjIxNzA4NTBaMIGZMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2Fz\naGluZ3RvbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBT\nZXJ2aWNlcywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzEqMCgGA1UEAwwhQW1h\nem9uIFJEUyBhcC1ub3J0aGVhc3QtMyAyMDE5IENBMIIBIjANBgkqhkiG9w0BAQEF\nAAOCAQ8AMIIBCgKCAQEA4dMak8W+XW8y/2F6nRiytFiA4XLwePadqWebGtlIgyCS\nkbug8Jv5w7nlMkuxOxoUeD4WhI6A9EkAn3r0REM/2f0aYnd2KPxeqS2MrtdxxHw1\nxoOxk2x0piNSlOz6yog1idsKR5Wurf94fvM9FdTrMYPPrDabbGqiBMsZZmoHLvA3\nZ+57HEV2tU0Ei3vWeGIqnNjIekS+E06KhASxrkNU5vi611UsnYZlSi0VtJsH4UGV\nLhnHl53aZL0YFO5mn/fzuNG/51qgk/6EFMMhaWInXX49Dia9FnnuWXwVwi6uX1Wn\n7kjoHi5VtmC8ZlGEHroxX2DxEr6bhJTEpcLMnoQMqwIDAQABo2YwZDAOBgNVHQ8B\nAf8EBAMCAQYwEgYDVR0TAQH/BAgwBgEB/wIBADAdBgNVHQ4EFgQUsUI5Cb3SWB8+\ngv1YLN/ABPMdxSAwHwYDVR0jBBgwFoAUc19g2LzLA5j0Kxc0LjZapmD/vB8wDQYJ\nKoZIhvcNAQELBQADggEBAJAF3E9PM1uzVL8YNdzb6fwJrxxqI2shvaMVmC1mXS+w\nG0zh4v2hBZOf91l1EO0rwFD7+fxoI6hzQfMxIczh875T6vUXePKVOCOKI5wCrDad\nzQbVqbFbdhsBjF4aUilOdtw2qjjs9JwPuB0VXN4/jY7m21oKEOcnpe36+7OiSPjN\nxngYewCXKrSRqoj3mw+0w/+exYj3Wsush7uFssX18av78G+ehKPIVDXptOCP/N7W\n8iKVNeQ2QGTnu2fzWsGUSvMGyM7yqT+h1ILaT//yQS8er511aHMLc142bD4D9VSy\nDgactwPDTShK/PXqhvNey9v/sKXm4XatZvwcc8KYlW4=\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIECDCCAvCgAwIBAgICVIYwDQYJKoZIhvcNAQELBQAwgY8xCzAJBgNVBAYTAlVT\nMRAwDgYDVQQHDAdTZWF0dGxlMRMwEQYDVQQIDApXYXNoaW5ndG9uMSIwIAYDVQQK\nDBlBbWF6b24gV2ViIFNlcnZpY2VzLCBJbmMuMRMwEQYDVQQLDApBbWF6b24gUkRT\nMSAwHgYDVQQDDBdBbWF6b24gUkRTIFJvb3QgMjAxOSBDQTAeFw0xOTA5MDQxNzEz\nMDRaFw0yNDA4MjIxNzA4NTBaMIGVMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2Fz\naGluZ3RvbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBT\nZXJ2aWNlcywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzEmMCQGA1UEAwwdQW1h\nem9uIFJEUyBhcC1zb3V0aC0xIDIwMTkgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IB\nDwAwggEKAoIBAQDUYOz1hGL42yUCrcsMSOoU8AeD/3KgZ4q7gP+vAz1WnY9K/kim\neWN/2Qqzlo3+mxSFQFyD4MyV3+CnCPnBl9Sh1G/F6kThNiJ7dEWSWBQGAB6HMDbC\nBaAsmUc1UIz8sLTL3fO+S9wYhA63Wun0Fbm/Rn2yk/4WnJAaMZcEtYf6e0KNa0LM\np/kN/70/8cD3iz3dDR8zOZFpHoCtf0ek80QqTich0A9n3JLxR6g6tpwoYviVg89e\nqCjQ4axxOkWWeusLeTJCcY6CkVyFvDAKvcUl1ytM5AiaUkXblE7zDFXRM4qMMRdt\nlPm8d3pFxh0fRYk8bIKnpmtOpz3RIctDrZZxAgMBAAGjZjBkMA4GA1UdDwEB/wQE\nAwIBBjASBgNVHRMBAf8ECDAGAQH/AgEAMB0GA1UdDgQWBBT99wKJftD3jb4sHoHG\ni3uGlH6W6TAfBgNVHSMEGDAWgBRzX2DYvMsDmPQrFzQuNlqmYP+8HzANBgkqhkiG\n9w0BAQsFAAOCAQEAZ17hhr3dII3hUfuHQ1hPWGrpJOX/G9dLzkprEIcCidkmRYl+\nhu1Pe3caRMh/17+qsoEErmnVq5jNY9X1GZL04IZH8YbHc7iRHw3HcWAdhN8633+K\njYEB2LbJ3vluCGnCejq9djDb6alOugdLMJzxOkHDhMZ6/gYbECOot+ph1tQuZXzD\ntZ7prRsrcuPBChHlPjmGy8M9z8u+kF196iNSUGC4lM8vLkHM7ycc1/ZOwRq9aaTe\niOghbQQyAEe03MWCyDGtSmDfr0qEk+CHN+6hPiaL8qKt4s+V9P7DeK4iW08ny8Ox\nAVS7u0OK/5+jKMAMrKwpYrBydOjTUTHScocyNw==\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIEDDCCAvSgAwIBAgICY4kwDQYJKoZIhvcNAQELBQAwgY8xCzAJBgNVBAYTAlVT\nMRAwDgYDVQQHDAdTZWF0dGxlMRMwEQYDVQQIDApXYXNoaW5ndG9uMSIwIAYDVQQK\nDBlBbWF6b24gV2ViIFNlcnZpY2VzLCBJbmMuMRMwEQYDVQQLDApBbWF6b24gUkRT\nMSAwHgYDVQQDDBdBbWF6b24gUkRTIFJvb3QgMjAxOSBDQTAeFw0xOTA5MTMyMDEx\nNDJaFw0yNDA4MjIxNzA4NTBaMIGZMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2Fz\naGluZ3RvbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBT\nZXJ2aWNlcywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzEqMCgGA1UEAwwhQW1h\nem9uIFJEUyBhcC1zb3V0aGVhc3QtMSAyMDE5IENBMIIBIjANBgkqhkiG9w0BAQEF\nAAOCAQ8AMIIBCgKCAQEAr5u9OuLL/OF/fBNUX2kINJLzFl4DnmrhnLuSeSnBPgbb\nqddjf5EFFJBfv7IYiIWEFPDbDG5hoBwgMup5bZDbas+ZTJTotnnxVJTQ6wlhTmns\neHECcg2pqGIKGrxZfbQhlj08/4nNAPvyYCTS0bEcmQ1emuDPyvJBYDDLDU6AbCB5\n6Z7YKFQPTiCBblvvNzchjLWF9IpkqiTsPHiEt21sAdABxj9ityStV3ja/W9BfgxH\nwzABSTAQT6FbDwmQMo7dcFOPRX+hewQSic2Rn1XYjmNYzgEHisdUsH7eeXREAcTw\n61TRvaLH8AiOWBnTEJXPAe6wYfrcSd1pD0MXpoB62wIDAQABo2YwZDAOBgNVHQ8B\nAf8EBAMCAQYwEgYDVR0TAQH/BAgwBgEB/wIBADAdBgNVHQ4EFgQUytwMiomQOgX5\nIchd+2lDWRUhkikwHwYDVR0jBBgwFoAUc19g2LzLA5j0Kxc0LjZapmD/vB8wDQYJ\nKoZIhvcNAQELBQADggEBACf6lRDpfCD7BFRqiWM45hqIzffIaysmVfr+Jr+fBTjP\nuYe/ba1omSrNGG23bOcT9LJ8hkQJ9d+FxUwYyICQNWOy6ejicm4z0C3VhphbTPqj\nyjpt9nG56IAcV8BcRJh4o/2IfLNzC/dVuYJV8wj7XzwlvjysenwdrJCoLadkTr1h\neIdG6Le07sB9IxrGJL9e04afk37h7c8ESGSE4E+oS4JQEi3ATq8ne1B9DQ9SasXi\nIRmhNAaISDzOPdyLXi9N9V9Lwe/DHcja7hgLGYx3UqfjhLhOKwp8HtoZORixAmOI\nHfILgNmwyugAbuZoCazSKKBhQ0wgO0WZ66ZKTMG8Oho=\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIEDDCCAvSgAwIBAgICEkYwDQYJKoZIhvcNAQELBQAwgY8xCzAJBgNVBAYTAlVT\nMRAwDgYDVQQHDAdTZWF0dGxlMRMwEQYDVQQIDApXYXNoaW5ndG9uMSIwIAYDVQQK\nDBlBbWF6b24gV2ViIFNlcnZpY2VzLCBJbmMuMRMwEQYDVQQLDApBbWF6b24gUkRT\nMSAwHgYDVQQDDBdBbWF6b24gUkRTIFJvb3QgMjAxOSBDQTAeFw0xOTA5MTYxOTUz\nNDdaFw0yNDA4MjIxNzA4NTBaMIGZMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2Fz\naGluZ3RvbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBT\nZXJ2aWNlcywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzEqMCgGA1UEAwwhQW1h\nem9uIFJEUyBhcC1zb3V0aGVhc3QtMiAyMDE5IENBMIIBIjANBgkqhkiG9w0BAQEF\nAAOCAQ8AMIIBCgKCAQEAufodI2Flker8q7PXZG0P0vmFSlhQDw907A6eJuF/WeMo\nGHnll3b4S6nC3oRS3nGeRMHbyU2KKXDwXNb3Mheu+ox+n5eb/BJ17eoj9HbQR1cd\ngEkIciiAltf8gpMMQH4anP7TD+HNFlZnP7ii3geEJB2GGXSxgSWvUzH4etL67Zmn\nTpGDWQMB0T8lK2ziLCMF4XAC/8xDELN/buHCNuhDpxpPebhct0T+f6Arzsiswt2j\n7OeNeLLZwIZvVwAKF7zUFjC6m7/VmTQC8nidVY559D6l0UhhU0Co/txgq3HVsMOH\nPbxmQUwJEKAzQXoIi+4uZzHFZrvov/nDTNJUhC6DqwIDAQABo2YwZDAOBgNVHQ8B\nAf8EBAMCAQYwEgYDVR0TAQH/BAgwBgEB/wIBADAdBgNVHQ4EFgQUwaZpaCme+EiV\nM5gcjeHZSTgOn4owHwYDVR0jBBgwFoAUc19g2LzLA5j0Kxc0LjZapmD/vB8wDQYJ\nKoZIhvcNAQELBQADggEBAAR6a2meCZuXO2TF9bGqKGtZmaah4pH2ETcEVUjkvXVz\nsl+ZKbYjrun+VkcMGGKLUjS812e7eDF726ptoku9/PZZIxlJB0isC/0OyixI8N4M\nNsEyvp52XN9QundTjkl362bomPnHAApeU0mRbMDRR2JdT70u6yAzGLGsUwMkoNnw\n1VR4XKhXHYGWo7KMvFrZ1KcjWhubxLHxZWXRulPVtGmyWg/MvE6KF+2XMLhojhUL\n+9jB3Fpn53s6KMx5tVq1x8PukHmowcZuAF8k+W4gk8Y68wIwynrdZrKRyRv6CVtR\nFZ8DeJgoNZT3y/GT254VqMxxfuy2Ccb/RInd16tEvVk=\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIECjCCAvKgAwIBAgICEzUwDQYJKoZIhvcNAQELBQAwgY8xCzAJBgNVBAYTAlVT\nMRAwDgYDVQQHDAdTZWF0dGxlMRMwEQYDVQQIDApXYXNoaW5ndG9uMSIwIAYDVQQK\nDBlBbWF6b24gV2ViIFNlcnZpY2VzLCBJbmMuMRMwEQYDVQQLDApBbWF6b24gUkRT\nMSAwHgYDVQQDDBdBbWF6b24gUkRTIFJvb3QgMjAxOSBDQTAeFw0xOTA5MTAyMDUy\nMjVaFw0yNDA4MjIxNzA4NTBaMIGXMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2Fz\naGluZ3RvbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBT\nZXJ2aWNlcywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzEoMCYGA1UEAwwfQW1h\nem9uIFJEUyBjYS1jZW50cmFsLTEgMjAxOSBDQTCCASIwDQYJKoZIhvcNAQEBBQAD\nggEPADCCAQoCggEBAOxHqdcPSA2uBjsCP4DLSlqSoPuQ/X1kkJLusVRKiQE2zayB\nviuCBt4VB9Qsh2rW3iYGM+usDjltGnI1iUWA5KHcvHszSMkWAOYWLiMNKTlg6LCp\nXnE89tvj5dIH6U8WlDvXLdjB/h30gW9JEX7S8supsBSci2GxEzb5mRdKaDuuF/0O\nqvz4YE04pua3iZ9QwmMFuTAOYzD1M72aOpj+7Ac+YLMM61qOtU+AU6MndnQkKoQi\nqmUN2A9IFaqHFzRlSdXwKCKUA4otzmz+/N3vFwjb5F4DSsbsrMfjeHMo6o/nb6Nh\nYDb0VJxxPee6TxSuN7CQJ2FxMlFUezcoXqwqXD0CAwEAAaNmMGQwDgYDVR0PAQH/\nBAQDAgEGMBIGA1UdEwEB/wQIMAYBAf8CAQAwHQYDVR0OBBYEFDGGpon9WfIpsggE\nCxHq8hZ7E2ESMB8GA1UdIwQYMBaAFHNfYNi8ywOY9CsXNC42WqZg/7wfMA0GCSqG\nSIb3DQEBCwUAA4IBAQAvpeQYEGZvoTVLgV9rd2+StPYykMsmFjWQcyn3dBTZRXC2\nlKq7QhQczMAOhEaaN29ZprjQzsA2X/UauKzLR2Uyqc2qOeO9/YOl0H3qauo8C/W9\nr8xqPbOCDLEXlOQ19fidXyyEPHEq5WFp8j+fTh+s8WOx2M7IuC0ANEetIZURYhSp\nxl9XOPRCJxOhj7JdelhpweX0BJDNHeUFi0ClnFOws8oKQ7sQEv66d5ddxqqZ3NVv\nRbCvCtEutQMOUMIuaygDlMn1anSM8N7Wndx8G6+Uy67AnhjGx7jw/0YPPxopEj6x\nJXP8j0sJbcT9K/9/fPVLNT25RvQ/93T2+IQL4Ca2\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIECjCCAvKgAwIBAgICV2YwDQYJKoZIhvcNAQELBQAwgY8xCzAJBgNVBAYTAlVT\nMRAwDgYDVQQHDAdTZWF0dGxlMRMwEQYDVQQIDApXYXNoaW5ndG9uMSIwIAYDVQQK\nDBlBbWF6b24gV2ViIFNlcnZpY2VzLCBJbmMuMRMwEQYDVQQLDApBbWF6b24gUkRT\nMSAwHgYDVQQDDBdBbWF6b24gUkRTIFJvb3QgMjAxOSBDQTAeFw0xOTA5MTExOTM2\nMjBaFw0yNDA4MjIxNzA4NTBaMIGXMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2Fz\naGluZ3RvbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBT\nZXJ2aWNlcywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzEoMCYGA1UEAwwfQW1h\nem9uIFJEUyBldS1jZW50cmFsLTEgMjAxOSBDQTCCASIwDQYJKoZIhvcNAQEBBQAD\nggEPADCCAQoCggEBAMEx54X2pHVv86APA0RWqxxRNmdkhAyp2R1cFWumKQRofoFv\nn+SPXdkpIINpMuEIGJANozdiEz7SPsrAf8WHyD93j/ZxrdQftRcIGH41xasetKGl\nI67uans8d+pgJgBKGb/Z+B5m+UsIuEVekpvgpwKtmmaLFC/NCGuSsJoFsRqoa6Gh\nm34W6yJoY87UatddCqLY4IIXaBFsgK9Q/wYzYLbnWM6ZZvhJ52VMtdhcdzeTHNW0\n5LGuXJOF7Ahb4JkEhoo6TS2c0NxB4l4MBfBPgti+O7WjR3FfZHpt18A6Zkq6A2u6\nD/oTSL6c9/3sAaFTFgMyL3wHb2YlW0BPiljZIqECAwEAAaNmMGQwDgYDVR0PAQH/\nBAQDAgEGMBIGA1UdEwEB/wQIMAYBAf8CAQAwHQYDVR0OBBYEFOcAToAc6skWffJa\nTnreaswAfrbcMB8GA1UdIwQYMBaAFHNfYNi8ywOY9CsXNC42WqZg/7wfMA0GCSqG\nSIb3DQEBCwUAA4IBAQA1d0Whc1QtspK496mFWfFEQNegLh0a9GWYlJm+Htcj5Nxt\nDAIGXb+8xrtOZFHmYP7VLCT5Zd2C+XytqseK/+s07iAr0/EPF+O2qcyQWMN5KhgE\ncXw2SwuP9FPV3i+YAm11PBVeenrmzuk9NrdHQ7TxU4v7VGhcsd2C++0EisrmquWH\nmgIfmVDGxphwoES52cY6t3fbnXmTkvENvR+h3rj+fUiSz0aSo+XZUGHPgvuEKM/W\nCBD9Smc9CBoBgvy7BgHRgRUmwtABZHFUIEjHI5rIr7ZvYn+6A0O6sogRfvVYtWFc\nqpyrW1YX8mD0VlJ8fGKM3G+aCOsiiPKDV/Uafrm+\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIECDCCAvCgAwIBAgICGAcwDQYJKoZIhvcNAQELBQAwgY8xCzAJBgNVBAYTAlVT\nMRAwDgYDVQQHDAdTZWF0dGxlMRMwEQYDVQQIDApXYXNoaW5ndG9uMSIwIAYDVQQK\nDBlBbWF6b24gV2ViIFNlcnZpY2VzLCBJbmMuMRMwEQYDVQQLDApBbWF6b24gUkRT\nMSAwHgYDVQQDDBdBbWF6b24gUkRTIFJvb3QgMjAxOSBDQTAeFw0xOTA5MTIxODE5\nNDRaFw0yNDA4MjIxNzA4NTBaMIGVMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2Fz\naGluZ3RvbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBT\nZXJ2aWNlcywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzEmMCQGA1UEAwwdQW1h\nem9uIFJEUyBldS1ub3J0aC0xIDIwMTkgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IB\nDwAwggEKAoIBAQCiIYnhe4UNBbdBb/nQxl5giM0XoVHWNrYV5nB0YukA98+TPn9v\nAoj1RGYmtryjhrf01Kuv8SWO+Eom95L3zquoTFcE2gmxCfk7bp6qJJ3eHOJB+QUO\nXsNRh76fwDzEF1yTeZWH49oeL2xO13EAx4PbZuZpZBttBM5zAxgZkqu4uWQczFEs\nJXfla7z2fvWmGcTagX10O5C18XaFroV0ubvSyIi75ue9ykg/nlFAeB7O0Wxae88e\nuhiBEFAuLYdqWnsg3459NfV8Yi1GnaitTym6VI3tHKIFiUvkSiy0DAlAGV2iiyJE\nq+DsVEO4/hSINJEtII4TMtysOsYPpINqeEzRAgMBAAGjZjBkMA4GA1UdDwEB/wQE\nAwIBBjASBgNVHRMBAf8ECDAGAQH/AgEAMB0GA1UdDgQWBBRR0UpnbQyjnHChgmOc\nhnlc0PogzTAfBgNVHSMEGDAWgBRzX2DYvMsDmPQrFzQuNlqmYP+8HzANBgkqhkiG\n9w0BAQsFAAOCAQEAKJD4xVzSf4zSGTBJrmamo86jl1NHQxXUApAZuBZEc8tqC6TI\nT5CeoSr9CMuVC8grYyBjXblC4OsM5NMvmsrXl/u5C9dEwtBFjo8mm53rOOIm1fxl\nI1oYB/9mtO9ANWjkykuLzWeBlqDT/i7ckaKwalhLODsRDO73vRhYNjsIUGloNsKe\npxw3dzHwAZx4upSdEVG4RGCZ1D0LJ4Gw40OfD69hfkDfRVVxKGrbEzqxXRvovmDc\ntKLdYZO/6REoca36v4BlgIs1CbUXJGLSXUwtg7YXGLSVBJ/U0+22iGJmBSNcoyUN\ncjPFD9JQEhDDIYYKSGzIYpvslvGc4T5ISXFiuQ==\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIEBzCCAu+gAwIBAgICYpgwDQYJKoZIhvcNAQELBQAwgY8xCzAJBgNVBAYTAlVT\nMRAwDgYDVQQHDAdTZWF0dGxlMRMwEQYDVQQIDApXYXNoaW5ndG9uMSIwIAYDVQQK\nDBlBbWF6b24gV2ViIFNlcnZpY2VzLCBJbmMuMRMwEQYDVQQLDApBbWF6b24gUkRT\nMSAwHgYDVQQDDBdBbWF6b24gUkRTIFJvb3QgMjAxOSBDQTAeFw0xOTA5MTExNzMx\nNDhaFw0yNDA4MjIxNzA4NTBaMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2Fz\naGluZ3RvbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBT\nZXJ2aWNlcywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzElMCMGA1UEAwwcQW1h\nem9uIFJEUyBldS13ZXN0LTEgMjAxOSBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEP\nADCCAQoCggEBAMk3YdSZ64iAYp6MyyKtYJtNzv7zFSnnNf6vv0FB4VnfITTMmOyZ\nLXqKAT2ahZ00hXi34ewqJElgU6eUZT/QlzdIu359TEZyLVPwURflL6SWgdG01Q5X\nO++7fSGcBRyIeuQWs9FJNIIqK8daF6qw0Rl5TXfu7P9dBc3zkgDXZm2DHmxGDD69\n7liQUiXzoE1q2Z9cA8+jirDioJxN9av8hQt12pskLQumhlArsMIhjhHRgF03HOh5\ntvi+RCfihVOxELyIRTRpTNiIwAqfZxxTWFTgfn+gijTmd0/1DseAe82aYic8JbuS\nEMbrDduAWsqrnJ4GPzxHKLXX0JasCUcWyMECAwEAAaNmMGQwDgYDVR0PAQH/BAQD\nAgEGMBIGA1UdEwEB/wQIMAYBAf8CAQAwHQYDVR0OBBYEFPLtsq1NrwJXO13C9eHt\nsLY11AGwMB8GA1UdIwQYMBaAFHNfYNi8ywOY9CsXNC42WqZg/7wfMA0GCSqGSIb3\nDQEBCwUAA4IBAQAnWBKj5xV1A1mYd0kIgDdkjCwQkiKF5bjIbGkT3YEFFbXoJlSP\n0lZZ/hDaOHI8wbLT44SzOvPEEmWF9EE7SJzkvSdQrUAWR9FwDLaU427ALI3ngNHy\nlGJ2hse1fvSRNbmg8Sc9GBv8oqNIBPVuw+AJzHTacZ1OkyLZrz1c1QvwvwN2a+Jd\nvH0V0YIhv66llKcYDMUQJAQi4+8nbRxXWv6Gq3pvrFoorzsnkr42V3JpbhnYiK+9\nnRKd4uWl62KRZjGkfMbmsqZpj2fdSWMY1UGyN1k+kDmCSWYdrTRDP0xjtIocwg+A\nJ116n4hV/5mbA0BaPiS2krtv17YAeHABZcvz\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIEBzCCAu+gAwIBAgICZIEwDQYJKoZIhvcNAQELBQAwgY8xCzAJBgNVBAYTAlVT\nMRAwDgYDVQQHDAdTZWF0dGxlMRMwEQYDVQQIDApXYXNoaW5ndG9uMSIwIAYDVQQK\nDBlBbWF6b24gV2ViIFNlcnZpY2VzLCBJbmMuMRMwEQYDVQQLDApBbWF6b24gUkRT\nMSAwHgYDVQQDDBdBbWF6b24gUkRTIFJvb3QgMjAxOSBDQTAeFw0xOTA5MTIyMTMy\nMzJaFw0yNDA4MjIxNzA4NTBaMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2Fz\naGluZ3RvbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBT\nZXJ2aWNlcywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzElMCMGA1UEAwwcQW1h\nem9uIFJEUyBldS13ZXN0LTIgMjAxOSBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEP\nADCCAQoCggEBALGiwqjiF7xIjT0Sx7zB3764K2T2a1DHnAxEOr+/EIftWKxWzT3u\nPFwS2eEZcnKqSdRQ+vRzonLBeNLO4z8aLjQnNbkizZMBuXGm4BqRm1Kgq3nlLDQn\n7YqdijOq54SpShvR/8zsO4sgMDMmHIYAJJOJqBdaus2smRt0NobIKc0liy7759KB\n6kmQ47Gg+kfIwxrQA5zlvPLeQImxSoPi9LdbRoKvu7Iot7SOa+jGhVBh3VdqndJX\n7tm/saj4NE375csmMETFLAOXjat7zViMRwVorX4V6AzEg1vkzxXpA9N7qywWIT5Y\nfYaq5M8i6vvLg0CzrH9fHORtnkdjdu1y+0MCAwEAAaNmMGQwDgYDVR0PAQH/BAQD\nAgEGMBIGA1UdEwEB/wQIMAYBAf8CAQAwHQYDVR0OBBYEFFOhOx1yt3Z7mvGB9jBv\n2ymdZwiOMB8GA1UdIwQYMBaAFHNfYNi8ywOY9CsXNC42WqZg/7wfMA0GCSqGSIb3\nDQEBCwUAA4IBAQBehqY36UGDvPVU9+vtaYGr38dBbp+LzkjZzHwKT1XJSSUc2wqM\nhnCIQKilonrTIvP1vmkQi8qHPvDRtBZKqvz/AErW/ZwQdZzqYNFd+BmOXaeZWV0Q\noHtDzXmcwtP8aUQpxN0e1xkWb1E80qoy+0uuRqb/50b/R4Q5qqSfJhkn6z8nwB10\n7RjLtJPrK8igxdpr3tGUzfAOyiPrIDncY7UJaL84GFp7WWAkH0WG3H8Y8DRcRXOU\nmqDxDLUP3rNuow3jnGxiUY+gGX5OqaZg4f4P6QzOSmeQYs6nLpH0PiN00+oS1BbD\nbpWdZEttILPI+vAYkU4QuBKKDjJL6HbSd+cn\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIEBzCCAu+gAwIBAgICJDQwDQYJKoZIhvcNAQELBQAwgY8xCzAJBgNVBAYTAlVT\nMRAwDgYDVQQHDAdTZWF0dGxlMRMwEQYDVQQIDApXYXNoaW5ndG9uMSIwIAYDVQQK\nDBlBbWF6b24gV2ViIFNlcnZpY2VzLCBJbmMuMRMwEQYDVQQLDApBbWF6b24gUkRT\nMSAwHgYDVQQDDBdBbWF6b24gUkRTIFJvb3QgMjAxOSBDQTAeFw0xOTA5MTgxNzAz\nMTVaFw0yNDA4MjIxNzA4NTBaMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2Fz\naGluZ3RvbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBT\nZXJ2aWNlcywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzElMCMGA1UEAwwcQW1h\nem9uIFJEUyBldS13ZXN0LTMgMjAxOSBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEP\nADCCAQoCggEBAL9bL7KE0n02DLVtlZ2PL+g/BuHpMYFq2JnE2RgompGurDIZdjmh\n1pxfL3nT+QIVMubuAOy8InRfkRxfpxyjKYdfLJTPJG+jDVL+wDcPpACFVqoV7Prg\npVYEV0lc5aoYw4bSeYFhdzgim6F8iyjoPnObjll9mo4XsHzSoqJLCd0QC+VG9Fw2\nq+GDRZrLRmVM2oNGDRbGpGIFg77aRxRapFZa8SnUgs2AqzuzKiprVH5i0S0M6dWr\ni+kk5epmTtkiDHceX+dP/0R1NcnkCPoQ9TglyXyPdUdTPPRfKCq12dftqll+u4mV\nARdN6WFjovxax8EAP2OAUTi1afY+1JFMj+sCAwEAAaNmMGQwDgYDVR0PAQH/BAQD\nAgEGMBIGA1UdEwEB/wQIMAYBAf8CAQAwHQYDVR0OBBYEFLfhrbrO5exkCVgxW0x3\nY2mAi8lNMB8GA1UdIwQYMBaAFHNfYNi8ywOY9CsXNC42WqZg/7wfMA0GCSqGSIb3\nDQEBCwUAA4IBAQAigQ5VBNGyw+OZFXwxeJEAUYaXVoP/qrhTOJ6mCE2DXUVEoJeV\nSxScy/TlFA9tJXqmit8JH8VQ/xDL4ubBfeMFAIAo4WzNWDVoeVMqphVEcDWBHsI1\nAETWzfsapRS9yQekOMmxg63d/nV8xewIl8aNVTHdHYXMqhhik47VrmaVEok1UQb3\nO971RadLXIEbVd9tjY5bMEHm89JsZDnDEw1hQXBb67Elu64OOxoKaHBgUH8AZn/2\nzFsL1ynNUjOhCSAA15pgd1vjwc0YsBbAEBPcHBWYBEyME6NLNarjOzBl4FMtATSF\nwWCKRGkvqN8oxYhwR2jf2rR5Mu4DWkK5Q8Ep\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIEEjCCAvqgAwIBAgIJANew34ehz5l8MA0GCSqGSIb3DQEBCwUAMIGVMQswCQYD\nVQQGEwJVUzEQMA4GA1UEBwwHU2VhdHRsZTETMBEGA1UECAwKV2FzaGluZ3RvbjEi\nMCAGA1UECgwZQW1hem9uIFdlYiBTZXJ2aWNlcywgSW5jLjETMBEGA1UECwwKQW1h\nem9uIFJEUzEmMCQGA1UEAwwdQW1hem9uIFJEUyBtZS1zb3V0aC0xIFJvb3QgQ0Ew\nHhcNMTkwNTEwMjE0ODI3WhcNMjQwNTA4MjE0ODI3WjCBlTELMAkGA1UEBhMCVVMx\nEDAOBgNVBAcMB1NlYXR0bGUxEzARBgNVBAgMCldhc2hpbmd0b24xIjAgBgNVBAoM\nGUFtYXpvbiBXZWIgU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMx\nJjAkBgNVBAMMHUFtYXpvbiBSRFMgbWUtc291dGgtMSBSb290IENBMIIBIjANBgkq\nhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp7BYV88MukcY+rq0r79+C8UzkT30fEfT\naPXbx1d6M7uheGN4FMaoYmL+JE1NZPaMRIPTHhFtLSdPccInvenRDIatcXX+jgOk\nUA6lnHQ98pwN0pfDUyz/Vph4jBR9LcVkBbe0zdoKKp+HGbMPRU0N2yNrog9gM5O8\ngkU/3O2csJ/OFQNnj4c2NQloGMUpEmedwJMOyQQfcUyt9CvZDfIPNnheUS29jGSw\nERpJe/AENu8Pxyc72jaXQuD+FEi2Ck6lBkSlWYQFhTottAeGvVFNCzKszCntrtqd\nrdYUwurYsLTXDHv9nW2hfDUQa0mhXf9gNDOBIVAZugR9NqNRNyYLHQIDAQABo2Mw\nYTAOBgNVHQ8BAf8EBAMCAQYwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQU54cf\nDjgwBx4ycBH8+/r8WXdaiqYwHwYDVR0jBBgwFoAU54cfDjgwBx4ycBH8+/r8WXda\niqYwDQYJKoZIhvcNAQELBQADggEBAIIMTSPx/dR7jlcxggr+O6OyY49Rlap2laKA\neC/XI4ySP3vQkIFlP822U9Kh8a9s46eR0uiwV4AGLabcu0iKYfXjPkIprVCqeXV7\nny9oDtrbflyj7NcGdZLvuzSwgl9SYTJp7PVCZtZutsPYlbJrBPHwFABvAkMvRtDB\nhitIg4AESDGPoCl94sYHpfDfjpUDMSrAMDUyO6DyBdZH5ryRMAs3lGtsmkkNUrso\naTW6R05681Z0mvkRdb+cdXtKOSuDZPoe2wJJIaz3IlNQNSrB5TImMYgmt6iAsFhv\n3vfTSTKrZDNTJn4ybG6pq1zWExoXsktZPylJly6R3RBwV6nwqBM=\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIEBzCCAu+gAwIBAgICQ2QwDQYJKoZIhvcNAQELBQAwgY8xCzAJBgNVBAYTAlVT\nMRAwDgYDVQQHDAdTZWF0dGxlMRMwEQYDVQQIDApXYXNoaW5ndG9uMSIwIAYDVQQK\nDBlBbWF6b24gV2ViIFNlcnZpY2VzLCBJbmMuMRMwEQYDVQQLDApBbWF6b24gUkRT\nMSAwHgYDVQQDDBdBbWF6b24gUkRTIFJvb3QgMjAxOSBDQTAeFw0xOTA5MDUxODQ2\nMjlaFw0yNDA4MjIxNzA4NTBaMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2Fz\naGluZ3RvbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBT\nZXJ2aWNlcywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzElMCMGA1UEAwwcQW1h\nem9uIFJEUyBzYS1lYXN0LTEgMjAxOSBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEP\nADCCAQoCggEBAMMvR+ReRnOzqJzoaPipNTt1Z2VA968jlN1+SYKUrYM3No+Vpz0H\nM6Tn0oYB66ByVsXiGc28ulsqX1HbHsxqDPwvQTKvO7SrmDokoAkjJgLocOLUAeld\n5AwvUjxGRP6yY90NV7X786MpnYb2Il9DIIaV9HjCmPt+rjy2CZjS0UjPjCKNfB8J\nbFjgW6GGscjeyGb/zFwcom5p4j0rLydbNaOr9wOyQrtt3ZQWLYGY9Zees/b8pmcc\nJt+7jstZ2UMV32OO/kIsJ4rMUn2r/uxccPwAc1IDeRSSxOrnFKhW3Cu69iB3bHp7\nJbawY12g7zshE4I14sHjv3QoXASoXjx4xgMCAwEAAaNmMGQwDgYDVR0PAQH/BAQD\nAgEGMBIGA1UdEwEB/wQIMAYBAf8CAQAwHQYDVR0OBBYEFI1Fc/Ql2jx+oJPgBVYq\nccgP0pQ8MB8GA1UdIwQYMBaAFHNfYNi8ywOY9CsXNC42WqZg/7wfMA0GCSqGSIb3\nDQEBCwUAA4IBAQB4VVVabVp70myuYuZ3vltQIWqSUMhkaTzehMgGcHjMf9iLoZ/I\n93KiFUSGnek5cRePyS9wcpp0fcBT3FvkjpUdCjVtdttJgZFhBxgTd8y26ImdDDMR\n4+BUuhI5msvjL08f+Vkkpu1GQcGmyFVPFOy/UY8iefu+QyUuiBUnUuEDd49Hw0Fn\n/kIPII6Vj82a2mWV/Q8e+rgN8dIRksRjKI03DEoP8lhPlsOkhdwU6Uz9Vu6NOB2Q\nLs1kbcxAc7cFSyRVJEhh12Sz9d0q/CQSTFsVJKOjSNQBQfVnLz1GwO/IieUEAr4C\njkTntH0r1LX5b/GwN4R887LvjAEdTbg1his7\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIEBzCCAu+gAwIBAgICJVUwDQYJKoZIhvcNAQELBQAwgY8xCzAJBgNVBAYTAlVT\nMRAwDgYDVQQHDAdTZWF0dGxlMRMwEQYDVQQIDApXYXNoaW5ndG9uMSIwIAYDVQQK\nDBlBbWF6b24gV2ViIFNlcnZpY2VzLCBJbmMuMRMwEQYDVQQLDApBbWF6b24gUkRT\nMSAwHgYDVQQDDBdBbWF6b24gUkRTIFJvb3QgMjAxOSBDQTAeFw0xOTA5MTkxODE2\nNTNaFw0yNDA4MjIxNzA4NTBaMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2Fz\naGluZ3RvbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBT\nZXJ2aWNlcywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzElMCMGA1UEAwwcQW1h\nem9uIFJEUyB1cy1lYXN0LTEgMjAxOSBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEP\nADCCAQoCggEBAM3i/k2u6cqbMdcISGRvh+m+L0yaSIoOXjtpNEoIftAipTUYoMhL\nInXGlQBVA4shkekxp1N7HXe1Y/iMaPEyb3n+16pf3vdjKl7kaSkIhjdUz3oVUEYt\ni8Z/XeJJ9H2aEGuiZh3kHixQcZczn8cg3dA9aeeyLSEnTkl/npzLf//669Ammyhs\nXcAo58yvT0D4E0D/EEHf2N7HRX7j/TlyWvw/39SW0usiCrHPKDLxByLojxLdHzso\nQIp/S04m+eWn6rmD+uUiRteN1hI5ncQiA3wo4G37mHnUEKo6TtTUh+sd/ku6a8HK\nglMBcgqudDI90s1OpuIAWmuWpY//8xEG2YECAwEAAaNmMGQwDgYDVR0PAQH/BAQD\nAgEGMBIGA1UdEwEB/wQIMAYBAf8CAQAwHQYDVR0OBBYEFPqhoWZcrVY9mU7tuemR\nRBnQIj1jMB8GA1UdIwQYMBaAFHNfYNi8ywOY9CsXNC42WqZg/7wfMA0GCSqGSIb3\nDQEBCwUAA4IBAQB6zOLZ+YINEs72heHIWlPZ8c6WY8MDU+Be5w1M+BK2kpcVhCUK\nPJO4nMXpgamEX8DIiaO7emsunwJzMSvavSPRnxXXTKIc0i/g1EbiDjnYX9d85DkC\nE1LaAUCmCZBVi9fIe0H2r9whIh4uLWZA41oMnJx/MOmo3XyMfQoWcqaSFlMqfZM4\n0rNoB/tdHLNuV4eIdaw2mlHxdWDtF4oH+HFm+2cVBUVC1jXKrFv/euRVtsTT+A6i\nh2XBHKxQ1Y4HgAn0jACP2QSPEmuoQEIa57bEKEcZsBR8SDY6ZdTd2HLRIApcCOSF\nMRM8CKLeF658I0XgF8D5EsYoKPsA+74Z+jDH\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIECDCCAvCgAwIBAgIDAIVCMA0GCSqGSIb3DQEBCwUAMIGPMQswCQYDVQQGEwJV\nUzEQMA4GA1UEBwwHU2VhdHRsZTETMBEGA1UECAwKV2FzaGluZ3RvbjEiMCAGA1UE\nCgwZQW1hem9uIFdlYiBTZXJ2aWNlcywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJE\nUzEgMB4GA1UEAwwXQW1hem9uIFJEUyBSb290IDIwMTkgQ0EwHhcNMTkwOTEzMTcw\nNjQxWhcNMjQwODIyMTcwODUwWjCBlDELMAkGA1UEBhMCVVMxEzARBgNVBAgMCldh\nc2hpbmd0b24xEDAOBgNVBAcMB1NlYXR0bGUxIjAgBgNVBAoMGUFtYXpvbiBXZWIg\nU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMxJTAjBgNVBAMMHEFt\nYXpvbiBSRFMgdXMtZWFzdC0yIDIwMTkgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IB\nDwAwggEKAoIBAQDE+T2xYjUbxOp+pv+gRA3FO24+1zCWgXTDF1DHrh1lsPg5k7ht\n2KPYzNc+Vg4E+jgPiW0BQnA6jStX5EqVh8BU60zELlxMNvpg4KumniMCZ3krtMUC\nau1NF9rM7HBh+O+DYMBLK5eSIVt6lZosOb7bCi3V6wMLA8YqWSWqabkxwN4w0vXI\n8lu5uXXFRemHnlNf+yA/4YtN4uaAyd0ami9+klwdkZfkrDOaiy59haOeBGL8EB/c\ndbJJlguHH5CpCscs3RKtOOjEonXnKXldxarFdkMzi+aIIjQ8GyUOSAXHtQHb3gZ4\nnS6Ey0CMlwkB8vUObZU9fnjKJcL5QCQqOfwvAgMBAAGjZjBkMA4GA1UdDwEB/wQE\nAwIBBjASBgNVHRMBAf8ECDAGAQH/AgEAMB0GA1UdDgQWBBQUPuRHohPxx4VjykmH\n6usGrLL1ETAfBgNVHSMEGDAWgBRzX2DYvMsDmPQrFzQuNlqmYP+8HzANBgkqhkiG\n9w0BAQsFAAOCAQEAUdR9Vb3y33Yj6X6KGtuthZ08SwjImVQPtknzpajNE5jOJAh8\nquvQnU9nlnMO85fVDU1Dz3lLHGJ/YG1pt1Cqq2QQ200JcWCvBRgdvH6MjHoDQpqZ\nHvQ3vLgOGqCLNQKFuet9BdpsHzsctKvCVaeBqbGpeCtt3Hh/26tgx0rorPLw90A2\nV8QSkZJjlcKkLa58N5CMM8Xz8KLWg3MZeT4DmlUXVCukqK2RGuP2L+aME8dOxqNv\nOnOz1zrL5mR2iJoDpk8+VE/eBDmJX40IJk6jBjWoxAO/RXq+vBozuF5YHN1ujE92\ntO8HItgTp37XT8bJBAiAnt5mxw+NLSqtxk2QdQ==\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIECDCCAvCgAwIBAgIDAIkHMA0GCSqGSIb3DQEBCwUAMIGPMQswCQYDVQQGEwJV\nUzEQMA4GA1UEBwwHU2VhdHRsZTETMBEGA1UECAwKV2FzaGluZ3RvbjEiMCAGA1UE\nCgwZQW1hem9uIFdlYiBTZXJ2aWNlcywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJE\nUzEgMB4GA1UEAwwXQW1hem9uIFJEUyBSb290IDIwMTkgQ0EwHhcNMTkwOTA2MTc0\nMDIxWhcNMjQwODIyMTcwODUwWjCBlDELMAkGA1UEBhMCVVMxEzARBgNVBAgMCldh\nc2hpbmd0b24xEDAOBgNVBAcMB1NlYXR0bGUxIjAgBgNVBAoMGUFtYXpvbiBXZWIg\nU2VydmljZXMsIEluYy4xEzARBgNVBAsMCkFtYXpvbiBSRFMxJTAjBgNVBAMMHEFt\nYXpvbiBSRFMgdXMtd2VzdC0xIDIwMTkgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IB\nDwAwggEKAoIBAQDD2yzbbAl77OofTghDMEf624OvU0eS9O+lsdO0QlbfUfWa1Kd6\n0WkgjkLZGfSRxEHMCnrv4UPBSK/Qwn6FTjkDLgemhqBtAnplN4VsoDL+BkRX4Wwq\n/dSQJE2b+0hm9w9UMVGFDEq1TMotGGTD2B71eh9HEKzKhGzqiNeGsiX4VV+LJzdH\nuM23eGisNqmd4iJV0zcAZ+Gbh2zK6fqTOCvXtm7Idccv8vZZnyk1FiWl3NR4WAgK\nAkvWTIoFU3Mt7dIXKKClVmvssG8WHCkd3Xcb4FHy/G756UZcq67gMMTX/9fOFM/v\nl5C0+CHl33Yig1vIDZd+fXV1KZD84dEJfEvHAgMBAAGjZjBkMA4GA1UdDwEB/wQE\nAwIBBjASBgNVHRMBAf8ECDAGAQH/AgEAMB0GA1UdDgQWBBR+ap20kO/6A7pPxo3+\nT3CfqZpQWjAfBgNVHSMEGDAWgBRzX2DYvMsDmPQrFzQuNlqmYP+8HzANBgkqhkiG\n9w0BAQsFAAOCAQEAHCJky2tPjPttlDM/RIqExupBkNrnSYnOK4kr9xJ3sl8UF2DA\nPAnYsjXp3rfcjN/k/FVOhxwzi3cXJF/2Tjj39Bm/OEfYTOJDNYtBwB0VVH4ffa/6\ntZl87jaIkrxJcreeeHqYMnIxeN0b/kliyA+a5L2Yb0VPjt9INq34QDc1v74FNZ17\n4z8nr1nzg4xsOWu0Dbjo966lm4nOYIGBRGOKEkHZRZ4mEiMgr3YLkv8gSmeitx57\nZ6dVemNtUic/LVo5Iqw4n3TBS0iF2C1Q1xT/s3h+0SXZlfOWttzSluDvoMv5PvCd\npFjNn+aXLAALoihL1MJSsxydtsLjOBro5eK0Vw==\n-----END CERTIFICATE-----\n",
      "-----BEGIN CERTIFICATE-----\nMIIEBzCCAu+gAwIBAgICUYkwDQYJKoZIhvcNAQELBQAwgY8xCzAJBgNVBAYTAlVT\nMRAwDgYDVQQHDAdTZWF0dGxlMRMwEQYDVQQIDApXYXNoaW5ndG9uMSIwIAYDVQQK\nDBlBbWF6b24gV2ViIFNlcnZpY2VzLCBJbmMuMRMwEQYDVQQLDApBbWF6b24gUkRT\nMSAwHgYDVQQDDBdBbWF6b24gUkRTIFJvb3QgMjAxOSBDQTAeFw0xOTA5MTYxODIx\nMTVaFw0yNDA4MjIxNzA4NTBaMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKV2Fz\naGluZ3RvbjEQMA4GA1UEBwwHU2VhdHRsZTEiMCAGA1UECgwZQW1hem9uIFdlYiBT\nZXJ2aWNlcywgSW5jLjETMBEGA1UECwwKQW1hem9uIFJEUzElMCMGA1UEAwwcQW1h\nem9uIFJEUyB1cy13ZXN0LTIgMjAxOSBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEP\nADCCAQoCggEBANCEZBZyu6yJQFZBJmSUZfSZd3Ui2gitczMKC4FLr0QzkbxY+cLa\nuVONIOrPt4Rwi+3h/UdnUg917xao3S53XDf1TDMFEYp4U8EFPXqCn/GXBIWlU86P\nPvBN+gzw3nS+aco7WXb+woTouvFVkk8FGU7J532llW8o/9ydQyDIMtdIkKTuMfho\nOiNHSaNc+QXQ32TgvM9A/6q7ksUoNXGCP8hDOkSZ/YOLiI5TcdLh/aWj00ziL5bj\npvytiMZkilnc9dLY9QhRNr0vGqL0xjmWdoEXz9/OwjmCihHqJq+20MJPsvFm7D6a\n2NKybR9U+ddrjb8/iyLOjURUZnj5O+2+OPcCAwEAAaNmMGQwDgYDVR0PAQH/BAQD\nAgEGMBIGA1UdEwEB/wQIMAYBAf8CAQAwHQYDVR0OBBYEFEBxMBdv81xuzqcK5TVu\npHj+Aor8MB8GA1UdIwQYMBaAFHNfYNi8ywOY9CsXNC42WqZg/7wfMA0GCSqGSIb3\nDQEBCwUAA4IBAQBZkfiVqGoJjBI37aTlLOSjLcjI75L5wBrwO39q+B4cwcmpj58P\n3sivv+jhYfAGEbQnGRzjuFoyPzWnZ1DesRExX+wrmHsLLQbF2kVjLZhEJMHF9eB7\nGZlTPdTzHErcnuXkwA/OqyXMpj9aghcQFuhCNguEfnROY9sAoK2PTfnTz9NJHL+Q\nUpDLEJEUfc0GZMVWYhahc0x38ZnSY2SKacIPECQrTI0KpqZv/P+ijCEcMD9xmYEb\njL4en+XKS1uJpw5fIU5Sj0MxhdGstH6S84iAE5J3GM3XHklGSFwwqPYvuTXvANH6\nuboynxRgSae59jIlAK6Jrr6GWMwQRbgcaAlW\n-----END CERTIFICATE-----\n"
    ]
  };
});

// node_modules/mysql/lib/ConnectionConfig.js
var require_ConnectionConfig = __commonJS((exports2, module2) => {
  var urlParse = require("url").parse;
  var ClientConstants = require_client();
  var Charsets = require_charsets();
  var SSLProfiles = null;
  module2.exports = ConnectionConfig;
  function ConnectionConfig(options) {
    if (typeof options === "string") {
      options = ConnectionConfig.parseUrl(options);
    }
    this.host = options.host || "localhost";
    this.port = options.port || 3306;
    this.localAddress = options.localAddress;
    this.socketPath = options.socketPath;
    this.user = options.user || void 0;
    this.password = options.password || void 0;
    this.database = options.database;
    this.connectTimeout = options.connectTimeout === void 0 ? 10 * 1e3 : options.connectTimeout;
    this.insecureAuth = options.insecureAuth || false;
    this.supportBigNumbers = options.supportBigNumbers || false;
    this.bigNumberStrings = options.bigNumberStrings || false;
    this.dateStrings = options.dateStrings || false;
    this.debug = options.debug;
    this.trace = options.trace !== false;
    this.stringifyObjects = options.stringifyObjects || false;
    this.timezone = options.timezone || "local";
    this.flags = options.flags || "";
    this.queryFormat = options.queryFormat;
    this.pool = options.pool || void 0;
    this.ssl = typeof options.ssl === "string" ? ConnectionConfig.getSSLProfile(options.ssl) : options.ssl || false;
    this.localInfile = options.localInfile === void 0 ? true : options.localInfile;
    this.multipleStatements = options.multipleStatements || false;
    this.typeCast = options.typeCast === void 0 ? true : options.typeCast;
    if (this.timezone[0] === " ") {
      this.timezone = "+" + this.timezone.substr(1);
    }
    if (this.ssl) {
      this.ssl.rejectUnauthorized = this.ssl.rejectUnauthorized !== false;
    }
    this.maxPacketSize = 0;
    this.charsetNumber = options.charset ? ConnectionConfig.getCharsetNumber(options.charset) : options.charsetNumber || Charsets.UTF8_GENERAL_CI;
    var defaultFlags = ConnectionConfig.getDefaultFlags(options);
    this.clientFlags = ConnectionConfig.mergeFlags(defaultFlags, options.flags);
  }
  ConnectionConfig.mergeFlags = function mergeFlags(defaultFlags, userFlags) {
    var allFlags = ConnectionConfig.parseFlagList(defaultFlags);
    var newFlags = ConnectionConfig.parseFlagList(userFlags);
    for (var flag in newFlags) {
      if (allFlags[flag] !== false) {
        allFlags[flag] = newFlags[flag];
      }
    }
    var flags = 0;
    for (var flag in allFlags) {
      if (allFlags[flag]) {
        flags |= ClientConstants["CLIENT_" + flag] || 0;
      }
    }
    return flags;
  };
  ConnectionConfig.getCharsetNumber = function getCharsetNumber(charset) {
    var num = Charsets[charset.toUpperCase()];
    if (num === void 0) {
      throw new TypeError("Unknown charset '" + charset + "'");
    }
    return num;
  };
  ConnectionConfig.getDefaultFlags = function getDefaultFlags(options) {
    var defaultFlags = [
      "-COMPRESS",
      "-CONNECT_ATTRS",
      "+CONNECT_WITH_DB",
      "+FOUND_ROWS",
      "+IGNORE_SIGPIPE",
      "+IGNORE_SPACE",
      "+LOCAL_FILES",
      "+LONG_FLAG",
      "+LONG_PASSWORD",
      "+MULTI_RESULTS",
      "+ODBC",
      "-PLUGIN_AUTH",
      "+PROTOCOL_41",
      "+PS_MULTI_RESULTS",
      "+RESERVED",
      "+SECURE_CONNECTION",
      "+TRANSACTIONS"
    ];
    if (options && options.localInfile !== void 0 && !options.localInfile) {
      defaultFlags.push("-LOCAL_FILES");
    }
    if (options && options.multipleStatements) {
      defaultFlags.push("+MULTI_STATEMENTS");
    }
    return defaultFlags;
  };
  ConnectionConfig.getSSLProfile = function getSSLProfile(name) {
    if (!SSLProfiles) {
      SSLProfiles = require_ssl_profiles();
    }
    var ssl = SSLProfiles[name];
    if (ssl === void 0) {
      throw new TypeError("Unknown SSL profile '" + name + "'");
    }
    return ssl;
  };
  ConnectionConfig.parseFlagList = function parseFlagList(flagList) {
    var allFlags = Object.create(null);
    if (!flagList) {
      return allFlags;
    }
    var flags = !Array.isArray(flagList) ? String(flagList || "").toUpperCase().split(/\s*,+\s*/) : flagList;
    for (var i = 0; i < flags.length; i++) {
      var flag = flags[i];
      var offset = 1;
      var state = flag[0];
      if (state === void 0) {
        continue;
      }
      if (state !== "-" && state !== "+") {
        offset = 0;
        state = "+";
      }
      allFlags[flag.substr(offset)] = state === "+";
    }
    return allFlags;
  };
  ConnectionConfig.parseUrl = function(url) {
    url = urlParse(url, true);
    var options = {
      host: url.hostname,
      port: url.port,
      database: url.pathname.substr(1)
    };
    if (url.auth) {
      var auth = url.auth.split(":");
      options.user = auth.shift();
      options.password = auth.join(":");
    }
    if (url.query) {
      for (var key in url.query) {
        var value = url.query[key];
        try {
          options[key] = JSON.parse(value);
        } catch (err) {
          options[key] = value;
        }
      }
    }
    return options;
  };
});

// node_modules/mysql/lib/protocol/PacketHeader.js
var require_PacketHeader = __commonJS((exports2, module2) => {
  module2.exports = PacketHeader;
  function PacketHeader(length, number) {
    this.length = length;
    this.number = number;
  }
});

// node_modules/bignumber.js/bignumber.mjs
var require_bignumber = __commonJS((exports2) => {
  __markAsModule(exports2);
  __export(exports2, {
    BigNumber: () => BigNumber,
    default: () => bignumber_default
  });
  var isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
  var mathceil = Math.ceil;
  var mathfloor = Math.floor;
  var bignumberError = "[BigNumber Error] ";
  var tooManyDigits = bignumberError + "Number primitive has more than 15 significant digits: ";
  var BASE = 1e14;
  var LOG_BASE = 14;
  var MAX_SAFE_INTEGER = 9007199254740991;
  var POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13];
  var SQRT_BASE = 1e7;
  var MAX = 1e9;
  function clone(configObject) {
    var div, convertBase, parseNumeric, P = BigNumber2.prototype = {constructor: BigNumber2, toString: null, valueOf: null}, ONE = new BigNumber2(1), DECIMAL_PLACES = 20, ROUNDING_MODE = 4, TO_EXP_NEG = -7, TO_EXP_POS = 21, MIN_EXP = -1e7, MAX_EXP = 1e7, CRYPTO = false, MODULO_MODE = 1, POW_PRECISION = 0, FORMAT = {
      prefix: "",
      groupSize: 3,
      secondaryGroupSize: 0,
      groupSeparator: ",",
      decimalSeparator: ".",
      fractionGroupSize: 0,
      fractionGroupSeparator: "\xA0",
      suffix: ""
    }, ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
    function BigNumber2(v, b) {
      var alphabet, c, caseChanged, e, i, isNum, len, str, x = this;
      if (!(x instanceof BigNumber2))
        return new BigNumber2(v, b);
      if (b == null) {
        if (v && v._isBigNumber === true) {
          x.s = v.s;
          if (!v.c || v.e > MAX_EXP) {
            x.c = x.e = null;
          } else if (v.e < MIN_EXP) {
            x.c = [x.e = 0];
          } else {
            x.e = v.e;
            x.c = v.c.slice();
          }
          return;
        }
        if ((isNum = typeof v == "number") && v * 0 == 0) {
          x.s = 1 / v < 0 ? (v = -v, -1) : 1;
          if (v === ~~v) {
            for (e = 0, i = v; i >= 10; i /= 10, e++)
              ;
            if (e > MAX_EXP) {
              x.c = x.e = null;
            } else {
              x.e = e;
              x.c = [v];
            }
            return;
          }
          str = String(v);
        } else {
          if (!isNumeric.test(str = String(v)))
            return parseNumeric(x, str, isNum);
          x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
        }
        if ((e = str.indexOf(".")) > -1)
          str = str.replace(".", "");
        if ((i = str.search(/e/i)) > 0) {
          if (e < 0)
            e = i;
          e += +str.slice(i + 1);
          str = str.substring(0, i);
        } else if (e < 0) {
          e = str.length;
        }
      } else {
        intCheck(b, 2, ALPHABET.length, "Base");
        if (b == 10) {
          x = new BigNumber2(v);
          return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
        }
        str = String(v);
        if (isNum = typeof v == "number") {
          if (v * 0 != 0)
            return parseNumeric(x, str, isNum, b);
          x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;
          if (BigNumber2.DEBUG && str.replace(/^0\.0*|\./, "").length > 15) {
            throw Error(tooManyDigits + v);
          }
        } else {
          x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
        }
        alphabet = ALPHABET.slice(0, b);
        e = i = 0;
        for (len = str.length; i < len; i++) {
          if (alphabet.indexOf(c = str.charAt(i)) < 0) {
            if (c == ".") {
              if (i > e) {
                e = len;
                continue;
              }
            } else if (!caseChanged) {
              if (str == str.toUpperCase() && (str = str.toLowerCase()) || str == str.toLowerCase() && (str = str.toUpperCase())) {
                caseChanged = true;
                i = -1;
                e = 0;
                continue;
              }
            }
            return parseNumeric(x, String(v), isNum, b);
          }
        }
        isNum = false;
        str = convertBase(str, b, 10, x.s);
        if ((e = str.indexOf(".")) > -1)
          str = str.replace(".", "");
        else
          e = str.length;
      }
      for (i = 0; str.charCodeAt(i) === 48; i++)
        ;
      for (len = str.length; str.charCodeAt(--len) === 48; )
        ;
      if (str = str.slice(i, ++len)) {
        len -= i;
        if (isNum && BigNumber2.DEBUG && len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
          throw Error(tooManyDigits + x.s * v);
        }
        if ((e = e - i - 1) > MAX_EXP) {
          x.c = x.e = null;
        } else if (e < MIN_EXP) {
          x.c = [x.e = 0];
        } else {
          x.e = e;
          x.c = [];
          i = (e + 1) % LOG_BASE;
          if (e < 0)
            i += LOG_BASE;
          if (i < len) {
            if (i)
              x.c.push(+str.slice(0, i));
            for (len -= LOG_BASE; i < len; ) {
              x.c.push(+str.slice(i, i += LOG_BASE));
            }
            i = LOG_BASE - (str = str.slice(i)).length;
          } else {
            i -= len;
          }
          for (; i--; str += "0")
            ;
          x.c.push(+str);
        }
      } else {
        x.c = [x.e = 0];
      }
    }
    BigNumber2.clone = clone;
    BigNumber2.ROUND_UP = 0;
    BigNumber2.ROUND_DOWN = 1;
    BigNumber2.ROUND_CEIL = 2;
    BigNumber2.ROUND_FLOOR = 3;
    BigNumber2.ROUND_HALF_UP = 4;
    BigNumber2.ROUND_HALF_DOWN = 5;
    BigNumber2.ROUND_HALF_EVEN = 6;
    BigNumber2.ROUND_HALF_CEIL = 7;
    BigNumber2.ROUND_HALF_FLOOR = 8;
    BigNumber2.EUCLID = 9;
    BigNumber2.config = BigNumber2.set = function(obj) {
      var p, v;
      if (obj != null) {
        if (typeof obj == "object") {
          if (obj.hasOwnProperty(p = "DECIMAL_PLACES")) {
            v = obj[p];
            intCheck(v, 0, MAX, p);
            DECIMAL_PLACES = v;
          }
          if (obj.hasOwnProperty(p = "ROUNDING_MODE")) {
            v = obj[p];
            intCheck(v, 0, 8, p);
            ROUNDING_MODE = v;
          }
          if (obj.hasOwnProperty(p = "EXPONENTIAL_AT")) {
            v = obj[p];
            if (v && v.pop) {
              intCheck(v[0], -MAX, 0, p);
              intCheck(v[1], 0, MAX, p);
              TO_EXP_NEG = v[0];
              TO_EXP_POS = v[1];
            } else {
              intCheck(v, -MAX, MAX, p);
              TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
            }
          }
          if (obj.hasOwnProperty(p = "RANGE")) {
            v = obj[p];
            if (v && v.pop) {
              intCheck(v[0], -MAX, -1, p);
              intCheck(v[1], 1, MAX, p);
              MIN_EXP = v[0];
              MAX_EXP = v[1];
            } else {
              intCheck(v, -MAX, MAX, p);
              if (v) {
                MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
              } else {
                throw Error(bignumberError + p + " cannot be zero: " + v);
              }
            }
          }
          if (obj.hasOwnProperty(p = "CRYPTO")) {
            v = obj[p];
            if (v === !!v) {
              if (v) {
                if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
                  CRYPTO = v;
                } else {
                  CRYPTO = !v;
                  throw Error(bignumberError + "crypto unavailable");
                }
              } else {
                CRYPTO = v;
              }
            } else {
              throw Error(bignumberError + p + " not true or false: " + v);
            }
          }
          if (obj.hasOwnProperty(p = "MODULO_MODE")) {
            v = obj[p];
            intCheck(v, 0, 9, p);
            MODULO_MODE = v;
          }
          if (obj.hasOwnProperty(p = "POW_PRECISION")) {
            v = obj[p];
            intCheck(v, 0, MAX, p);
            POW_PRECISION = v;
          }
          if (obj.hasOwnProperty(p = "FORMAT")) {
            v = obj[p];
            if (typeof v == "object")
              FORMAT = v;
            else
              throw Error(bignumberError + p + " not an object: " + v);
          }
          if (obj.hasOwnProperty(p = "ALPHABET")) {
            v = obj[p];
            if (typeof v == "string" && !/^.$|[+-.\s]|(.).*\1/.test(v)) {
              ALPHABET = v;
            } else {
              throw Error(bignumberError + p + " invalid: " + v);
            }
          }
        } else {
          throw Error(bignumberError + "Object expected: " + obj);
        }
      }
      return {
        DECIMAL_PLACES,
        ROUNDING_MODE,
        EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
        RANGE: [MIN_EXP, MAX_EXP],
        CRYPTO,
        MODULO_MODE,
        POW_PRECISION,
        FORMAT,
        ALPHABET
      };
    };
    BigNumber2.isBigNumber = function(v) {
      if (!v || v._isBigNumber !== true)
        return false;
      if (!BigNumber2.DEBUG)
        return true;
      var i, n, c = v.c, e = v.e, s = v.s;
      out:
        if ({}.toString.call(c) == "[object Array]") {
          if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {
            if (c[0] === 0) {
              if (e === 0 && c.length === 1)
                return true;
              break out;
            }
            i = (e + 1) % LOG_BASE;
            if (i < 1)
              i += LOG_BASE;
            if (String(c[0]).length == i) {
              for (i = 0; i < c.length; i++) {
                n = c[i];
                if (n < 0 || n >= BASE || n !== mathfloor(n))
                  break out;
              }
              if (n !== 0)
                return true;
            }
          }
        } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
          return true;
        }
      throw Error(bignumberError + "Invalid BigNumber: " + v);
    };
    BigNumber2.maximum = BigNumber2.max = function() {
      return maxOrMin(arguments, P.lt);
    };
    BigNumber2.minimum = BigNumber2.min = function() {
      return maxOrMin(arguments, P.gt);
    };
    BigNumber2.random = function() {
      var pow2_53 = 9007199254740992;
      var random53bitInt = Math.random() * pow2_53 & 2097151 ? function() {
        return mathfloor(Math.random() * pow2_53);
      } : function() {
        return (Math.random() * 1073741824 | 0) * 8388608 + (Math.random() * 8388608 | 0);
      };
      return function(dp) {
        var a, b, e, k, v, i = 0, c = [], rand = new BigNumber2(ONE);
        if (dp == null)
          dp = DECIMAL_PLACES;
        else
          intCheck(dp, 0, MAX);
        k = mathceil(dp / LOG_BASE);
        if (CRYPTO) {
          if (crypto.getRandomValues) {
            a = crypto.getRandomValues(new Uint32Array(k *= 2));
            for (; i < k; ) {
              v = a[i] * 131072 + (a[i + 1] >>> 11);
              if (v >= 9e15) {
                b = crypto.getRandomValues(new Uint32Array(2));
                a[i] = b[0];
                a[i + 1] = b[1];
              } else {
                c.push(v % 1e14);
                i += 2;
              }
            }
            i = k / 2;
          } else if (crypto.randomBytes) {
            a = crypto.randomBytes(k *= 7);
            for (; i < k; ) {
              v = (a[i] & 31) * 281474976710656 + a[i + 1] * 1099511627776 + a[i + 2] * 4294967296 + a[i + 3] * 16777216 + (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];
              if (v >= 9e15) {
                crypto.randomBytes(7).copy(a, i);
              } else {
                c.push(v % 1e14);
                i += 7;
              }
            }
            i = k / 7;
          } else {
            CRYPTO = false;
            throw Error(bignumberError + "crypto unavailable");
          }
        }
        if (!CRYPTO) {
          for (; i < k; ) {
            v = random53bitInt();
            if (v < 9e15)
              c[i++] = v % 1e14;
          }
        }
        k = c[--i];
        dp %= LOG_BASE;
        if (k && dp) {
          v = POWS_TEN[LOG_BASE - dp];
          c[i] = mathfloor(k / v) * v;
        }
        for (; c[i] === 0; c.pop(), i--)
          ;
        if (i < 0) {
          c = [e = 0];
        } else {
          for (e = -1; c[0] === 0; c.splice(0, 1), e -= LOG_BASE)
            ;
          for (i = 1, v = c[0]; v >= 10; v /= 10, i++)
            ;
          if (i < LOG_BASE)
            e -= LOG_BASE - i;
        }
        rand.e = e;
        rand.c = c;
        return rand;
      };
    }();
    BigNumber2.sum = function() {
      var i = 1, args = arguments, sum = new BigNumber2(args[0]);
      for (; i < args.length; )
        sum = sum.plus(args[i++]);
      return sum;
    };
    convertBase = function() {
      var decimal = "0123456789";
      function toBaseOut(str, baseIn, baseOut, alphabet) {
        var j, arr = [0], arrL, i = 0, len = str.length;
        for (; i < len; ) {
          for (arrL = arr.length; arrL--; arr[arrL] *= baseIn)
            ;
          arr[0] += alphabet.indexOf(str.charAt(i++));
          for (j = 0; j < arr.length; j++) {
            if (arr[j] > baseOut - 1) {
              if (arr[j + 1] == null)
                arr[j + 1] = 0;
              arr[j + 1] += arr[j] / baseOut | 0;
              arr[j] %= baseOut;
            }
          }
        }
        return arr.reverse();
      }
      return function(str, baseIn, baseOut, sign, callerIsToString) {
        var alphabet, d, e, k, r, x, xc, y, i = str.indexOf("."), dp = DECIMAL_PLACES, rm = ROUNDING_MODE;
        if (i >= 0) {
          k = POW_PRECISION;
          POW_PRECISION = 0;
          str = str.replace(".", "");
          y = new BigNumber2(baseIn);
          x = y.pow(str.length - i);
          POW_PRECISION = k;
          y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, "0"), 10, baseOut, decimal);
          y.e = y.c.length;
        }
        xc = toBaseOut(str, baseIn, baseOut, callerIsToString ? (alphabet = ALPHABET, decimal) : (alphabet = decimal, ALPHABET));
        e = k = xc.length;
        for (; xc[--k] == 0; xc.pop())
          ;
        if (!xc[0])
          return alphabet.charAt(0);
        if (i < 0) {
          --e;
        } else {
          x.c = xc;
          x.e = e;
          x.s = sign;
          x = div(x, y, dp, rm, baseOut);
          xc = x.c;
          r = x.r;
          e = x.e;
        }
        d = e + dp + 1;
        i = xc[d];
        k = baseOut / 2;
        r = r || d < 0 || xc[d + 1] != null;
        r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : i > k || i == k && (rm == 4 || r || rm == 6 && xc[d - 1] & 1 || rm == (x.s < 0 ? 8 : 7));
        if (d < 1 || !xc[0]) {
          str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
        } else {
          xc.length = d;
          if (r) {
            for (--baseOut; ++xc[--d] > baseOut; ) {
              xc[d] = 0;
              if (!d) {
                ++e;
                xc = [1].concat(xc);
              }
            }
          }
          for (k = xc.length; !xc[--k]; )
            ;
          for (i = 0, str = ""; i <= k; str += alphabet.charAt(xc[i++]))
            ;
          str = toFixedPoint(str, e, alphabet.charAt(0));
        }
        return str;
      };
    }();
    div = function() {
      function multiply(x, k, base) {
        var m, temp, xlo, xhi, carry = 0, i = x.length, klo = k % SQRT_BASE, khi = k / SQRT_BASE | 0;
        for (x = x.slice(); i--; ) {
          xlo = x[i] % SQRT_BASE;
          xhi = x[i] / SQRT_BASE | 0;
          m = khi * xlo + xhi * klo;
          temp = klo * xlo + m % SQRT_BASE * SQRT_BASE + carry;
          carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
          x[i] = temp % base;
        }
        if (carry)
          x = [carry].concat(x);
        return x;
      }
      function compare2(a, b, aL, bL) {
        var i, cmp;
        if (aL != bL) {
          cmp = aL > bL ? 1 : -1;
        } else {
          for (i = cmp = 0; i < aL; i++) {
            if (a[i] != b[i]) {
              cmp = a[i] > b[i] ? 1 : -1;
              break;
            }
          }
        }
        return cmp;
      }
      function subtract(a, b, aL, base) {
        var i = 0;
        for (; aL--; ) {
          a[aL] -= i;
          i = a[aL] < b[aL] ? 1 : 0;
          a[aL] = i * base + a[aL] - b[aL];
        }
        for (; !a[0] && a.length > 1; a.splice(0, 1))
          ;
      }
      return function(x, y, dp, rm, base) {
        var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0, yL, yz, s = x.s == y.s ? 1 : -1, xc = x.c, yc = y.c;
        if (!xc || !xc[0] || !yc || !yc[0]) {
          return new BigNumber2(!x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN : xc && xc[0] == 0 || !yc ? s * 0 : s / 0);
        }
        q = new BigNumber2(s);
        qc = q.c = [];
        e = x.e - y.e;
        s = dp + e + 1;
        if (!base) {
          base = BASE;
          e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
          s = s / LOG_BASE | 0;
        }
        for (i = 0; yc[i] == (xc[i] || 0); i++)
          ;
        if (yc[i] > (xc[i] || 0))
          e--;
        if (s < 0) {
          qc.push(1);
          more = true;
        } else {
          xL = xc.length;
          yL = yc.length;
          i = 0;
          s += 2;
          n = mathfloor(base / (yc[0] + 1));
          if (n > 1) {
            yc = multiply(yc, n, base);
            xc = multiply(xc, n, base);
            yL = yc.length;
            xL = xc.length;
          }
          xi = yL;
          rem = xc.slice(0, yL);
          remL = rem.length;
          for (; remL < yL; rem[remL++] = 0)
            ;
          yz = yc.slice();
          yz = [0].concat(yz);
          yc0 = yc[0];
          if (yc[1] >= base / 2)
            yc0++;
          do {
            n = 0;
            cmp = compare2(yc, rem, yL, remL);
            if (cmp < 0) {
              rem0 = rem[0];
              if (yL != remL)
                rem0 = rem0 * base + (rem[1] || 0);
              n = mathfloor(rem0 / yc0);
              if (n > 1) {
                if (n >= base)
                  n = base - 1;
                prod = multiply(yc, n, base);
                prodL = prod.length;
                remL = rem.length;
                while (compare2(prod, rem, prodL, remL) == 1) {
                  n--;
                  subtract(prod, yL < prodL ? yz : yc, prodL, base);
                  prodL = prod.length;
                  cmp = 1;
                }
              } else {
                if (n == 0) {
                  cmp = n = 1;
                }
                prod = yc.slice();
                prodL = prod.length;
              }
              if (prodL < remL)
                prod = [0].concat(prod);
              subtract(rem, prod, remL, base);
              remL = rem.length;
              if (cmp == -1) {
                while (compare2(yc, rem, yL, remL) < 1) {
                  n++;
                  subtract(rem, yL < remL ? yz : yc, remL, base);
                  remL = rem.length;
                }
              }
            } else if (cmp === 0) {
              n++;
              rem = [0];
            }
            qc[i++] = n;
            if (rem[0]) {
              rem[remL++] = xc[xi] || 0;
            } else {
              rem = [xc[xi]];
              remL = 1;
            }
          } while ((xi++ < xL || rem[0] != null) && s--);
          more = rem[0] != null;
          if (!qc[0])
            qc.splice(0, 1);
        }
        if (base == BASE) {
          for (i = 1, s = qc[0]; s >= 10; s /= 10, i++)
            ;
          round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);
        } else {
          q.e = e;
          q.r = +more;
        }
        return q;
      };
    }();
    function format(n, i, rm, id) {
      var c0, e, ne, len, str;
      if (rm == null)
        rm = ROUNDING_MODE;
      else
        intCheck(rm, 0, 8);
      if (!n.c)
        return n.toString();
      c0 = n.c[0];
      ne = n.e;
      if (i == null) {
        str = coeffToString(n.c);
        str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS) ? toExponential(str, ne) : toFixedPoint(str, ne, "0");
      } else {
        n = round(new BigNumber2(n), i, rm);
        e = n.e;
        str = coeffToString(n.c);
        len = str.length;
        if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {
          for (; len < i; str += "0", len++)
            ;
          str = toExponential(str, e);
        } else {
          i -= ne;
          str = toFixedPoint(str, e, "0");
          if (e + 1 > len) {
            if (--i > 0)
              for (str += "."; i--; str += "0")
                ;
          } else {
            i += e - len;
            if (i > 0) {
              if (e + 1 == len)
                str += ".";
              for (; i--; str += "0")
                ;
            }
          }
        }
      }
      return n.s < 0 && c0 ? "-" + str : str;
    }
    function maxOrMin(args, method) {
      var n, i = 1, m = new BigNumber2(args[0]);
      for (; i < args.length; i++) {
        n = new BigNumber2(args[i]);
        if (!n.s) {
          m = n;
          break;
        } else if (method.call(m, n)) {
          m = n;
        }
      }
      return m;
    }
    function normalise(n, c, e) {
      var i = 1, j = c.length;
      for (; !c[--j]; c.pop())
        ;
      for (j = c[0]; j >= 10; j /= 10, i++)
        ;
      if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {
        n.c = n.e = null;
      } else if (e < MIN_EXP) {
        n.c = [n.e = 0];
      } else {
        n.e = e;
        n.c = c;
      }
      return n;
    }
    parseNumeric = function() {
      var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i, dotAfter = /^([^.]+)\.$/, dotBefore = /^\.([^.]+)$/, isInfinityOrNaN = /^-?(Infinity|NaN)$/, whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
      return function(x, str, isNum, b) {
        var base, s = isNum ? str : str.replace(whitespaceOrPlus, "");
        if (isInfinityOrNaN.test(s)) {
          x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
        } else {
          if (!isNum) {
            s = s.replace(basePrefix, function(m, p1, p2) {
              base = (p2 = p2.toLowerCase()) == "x" ? 16 : p2 == "b" ? 2 : 8;
              return !b || b == base ? p1 : m;
            });
            if (b) {
              base = b;
              s = s.replace(dotAfter, "$1").replace(dotBefore, "0.$1");
            }
            if (str != s)
              return new BigNumber2(s, base);
          }
          if (BigNumber2.DEBUG) {
            throw Error(bignumberError + "Not a" + (b ? " base " + b : "") + " number: " + str);
          }
          x.s = null;
        }
        x.c = x.e = null;
      };
    }();
    function round(x, sd, rm, r) {
      var d, i, j, k, n, ni, rd, xc = x.c, pows10 = POWS_TEN;
      if (xc) {
        out: {
          for (d = 1, k = xc[0]; k >= 10; k /= 10, d++)
            ;
          i = sd - d;
          if (i < 0) {
            i += LOG_BASE;
            j = sd;
            n = xc[ni = 0];
            rd = n / pows10[d - j - 1] % 10 | 0;
          } else {
            ni = mathceil((i + 1) / LOG_BASE);
            if (ni >= xc.length) {
              if (r) {
                for (; xc.length <= ni; xc.push(0))
                  ;
                n = rd = 0;
                d = 1;
                i %= LOG_BASE;
                j = i - LOG_BASE + 1;
              } else {
                break out;
              }
            } else {
              n = k = xc[ni];
              for (d = 1; k >= 10; k /= 10, d++)
                ;
              i %= LOG_BASE;
              j = i - LOG_BASE + d;
              rd = j < 0 ? 0 : n / pows10[d - j - 1] % 10 | 0;
            }
          }
          r = r || sd < 0 || xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);
          r = rm < 4 ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 && (i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
          if (sd < 1 || !xc[0]) {
            xc.length = 0;
            if (r) {
              sd -= x.e + 1;
              xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
              x.e = -sd || 0;
            } else {
              xc[0] = x.e = 0;
            }
            return x;
          }
          if (i == 0) {
            xc.length = ni;
            k = 1;
            ni--;
          } else {
            xc.length = ni + 1;
            k = pows10[LOG_BASE - i];
            xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
          }
          if (r) {
            for (; ; ) {
              if (ni == 0) {
                for (i = 1, j = xc[0]; j >= 10; j /= 10, i++)
                  ;
                j = xc[0] += k;
                for (k = 1; j >= 10; j /= 10, k++)
                  ;
                if (i != k) {
                  x.e++;
                  if (xc[0] == BASE)
                    xc[0] = 1;
                }
                break;
              } else {
                xc[ni] += k;
                if (xc[ni] != BASE)
                  break;
                xc[ni--] = 0;
                k = 1;
              }
            }
          }
          for (i = xc.length; xc[--i] === 0; xc.pop())
            ;
        }
        if (x.e > MAX_EXP) {
          x.c = x.e = null;
        } else if (x.e < MIN_EXP) {
          x.c = [x.e = 0];
        }
      }
      return x;
    }
    function valueOf(n) {
      var str, e = n.e;
      if (e === null)
        return n.toString();
      str = coeffToString(n.c);
      str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(str, e) : toFixedPoint(str, e, "0");
      return n.s < 0 ? "-" + str : str;
    }
    P.absoluteValue = P.abs = function() {
      var x = new BigNumber2(this);
      if (x.s < 0)
        x.s = 1;
      return x;
    };
    P.comparedTo = function(y, b) {
      return compare(this, new BigNumber2(y, b));
    };
    P.decimalPlaces = P.dp = function(dp, rm) {
      var c, n, v, x = this;
      if (dp != null) {
        intCheck(dp, 0, MAX);
        if (rm == null)
          rm = ROUNDING_MODE;
        else
          intCheck(rm, 0, 8);
        return round(new BigNumber2(x), dp + x.e + 1, rm);
      }
      if (!(c = x.c))
        return null;
      n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;
      if (v = c[v])
        for (; v % 10 == 0; v /= 10, n--)
          ;
      if (n < 0)
        n = 0;
      return n;
    };
    P.dividedBy = P.div = function(y, b) {
      return div(this, new BigNumber2(y, b), DECIMAL_PLACES, ROUNDING_MODE);
    };
    P.dividedToIntegerBy = P.idiv = function(y, b) {
      return div(this, new BigNumber2(y, b), 0, 1);
    };
    P.exponentiatedBy = P.pow = function(n, m) {
      var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y, x = this;
      n = new BigNumber2(n);
      if (n.c && !n.isInteger()) {
        throw Error(bignumberError + "Exponent not an integer: " + valueOf(n));
      }
      if (m != null)
        m = new BigNumber2(m);
      nIsBig = n.e > 14;
      if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {
        y = new BigNumber2(Math.pow(+valueOf(x), nIsBig ? 2 - isOdd(n) : +valueOf(n)));
        return m ? y.mod(m) : y;
      }
      nIsNeg = n.s < 0;
      if (m) {
        if (m.c ? !m.c[0] : !m.s)
          return new BigNumber2(NaN);
        isModExp = !nIsNeg && x.isInteger() && m.isInteger();
        if (isModExp)
          x = x.mod(m);
      } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0 ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7 : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {
        k = x.s < 0 && isOdd(n) ? -0 : 0;
        if (x.e > -1)
          k = 1 / k;
        return new BigNumber2(nIsNeg ? 1 / k : k);
      } else if (POW_PRECISION) {
        k = mathceil(POW_PRECISION / LOG_BASE + 2);
      }
      if (nIsBig) {
        half = new BigNumber2(0.5);
        if (nIsNeg)
          n.s = 1;
        nIsOdd = isOdd(n);
      } else {
        i = Math.abs(+valueOf(n));
        nIsOdd = i % 2;
      }
      y = new BigNumber2(ONE);
      for (; ; ) {
        if (nIsOdd) {
          y = y.times(x);
          if (!y.c)
            break;
          if (k) {
            if (y.c.length > k)
              y.c.length = k;
          } else if (isModExp) {
            y = y.mod(m);
          }
        }
        if (i) {
          i = mathfloor(i / 2);
          if (i === 0)
            break;
          nIsOdd = i % 2;
        } else {
          n = n.times(half);
          round(n, n.e + 1, 1);
          if (n.e > 14) {
            nIsOdd = isOdd(n);
          } else {
            i = +valueOf(n);
            if (i === 0)
              break;
            nIsOdd = i % 2;
          }
        }
        x = x.times(x);
        if (k) {
          if (x.c && x.c.length > k)
            x.c.length = k;
        } else if (isModExp) {
          x = x.mod(m);
        }
      }
      if (isModExp)
        return y;
      if (nIsNeg)
        y = ONE.div(y);
      return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
    };
    P.integerValue = function(rm) {
      var n = new BigNumber2(this);
      if (rm == null)
        rm = ROUNDING_MODE;
      else
        intCheck(rm, 0, 8);
      return round(n, n.e + 1, rm);
    };
    P.isEqualTo = P.eq = function(y, b) {
      return compare(this, new BigNumber2(y, b)) === 0;
    };
    P.isFinite = function() {
      return !!this.c;
    };
    P.isGreaterThan = P.gt = function(y, b) {
      return compare(this, new BigNumber2(y, b)) > 0;
    };
    P.isGreaterThanOrEqualTo = P.gte = function(y, b) {
      return (b = compare(this, new BigNumber2(y, b))) === 1 || b === 0;
    };
    P.isInteger = function() {
      return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
    };
    P.isLessThan = P.lt = function(y, b) {
      return compare(this, new BigNumber2(y, b)) < 0;
    };
    P.isLessThanOrEqualTo = P.lte = function(y, b) {
      return (b = compare(this, new BigNumber2(y, b))) === -1 || b === 0;
    };
    P.isNaN = function() {
      return !this.s;
    };
    P.isNegative = function() {
      return this.s < 0;
    };
    P.isPositive = function() {
      return this.s > 0;
    };
    P.isZero = function() {
      return !!this.c && this.c[0] == 0;
    };
    P.minus = function(y, b) {
      var i, j, t, xLTy, x = this, a = x.s;
      y = new BigNumber2(y, b);
      b = y.s;
      if (!a || !b)
        return new BigNumber2(NaN);
      if (a != b) {
        y.s = -b;
        return x.plus(y);
      }
      var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
      if (!xe || !ye) {
        if (!xc || !yc)
          return xc ? (y.s = -b, y) : new BigNumber2(yc ? x : NaN);
        if (!xc[0] || !yc[0]) {
          return yc[0] ? (y.s = -b, y) : new BigNumber2(xc[0] ? x : ROUNDING_MODE == 3 ? -0 : 0);
        }
      }
      xe = bitFloor(xe);
      ye = bitFloor(ye);
      xc = xc.slice();
      if (a = xe - ye) {
        if (xLTy = a < 0) {
          a = -a;
          t = xc;
        } else {
          ye = xe;
          t = yc;
        }
        t.reverse();
        for (b = a; b--; t.push(0))
          ;
        t.reverse();
      } else {
        j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;
        for (a = b = 0; b < j; b++) {
          if (xc[b] != yc[b]) {
            xLTy = xc[b] < yc[b];
            break;
          }
        }
      }
      if (xLTy)
        t = xc, xc = yc, yc = t, y.s = -y.s;
      b = (j = yc.length) - (i = xc.length);
      if (b > 0)
        for (; b--; xc[i++] = 0)
          ;
      b = BASE - 1;
      for (; j > a; ) {
        if (xc[--j] < yc[j]) {
          for (i = j; i && !xc[--i]; xc[i] = b)
            ;
          --xc[i];
          xc[j] += BASE;
        }
        xc[j] -= yc[j];
      }
      for (; xc[0] == 0; xc.splice(0, 1), --ye)
        ;
      if (!xc[0]) {
        y.s = ROUNDING_MODE == 3 ? -1 : 1;
        y.c = [y.e = 0];
        return y;
      }
      return normalise(y, xc, ye);
    };
    P.modulo = P.mod = function(y, b) {
      var q, s, x = this;
      y = new BigNumber2(y, b);
      if (!x.c || !y.s || y.c && !y.c[0]) {
        return new BigNumber2(NaN);
      } else if (!y.c || x.c && !x.c[0]) {
        return new BigNumber2(x);
      }
      if (MODULO_MODE == 9) {
        s = y.s;
        y.s = 1;
        q = div(x, y, 0, 3);
        y.s = s;
        q.s *= s;
      } else {
        q = div(x, y, 0, MODULO_MODE);
      }
      y = x.minus(q.times(y));
      if (!y.c[0] && MODULO_MODE == 1)
        y.s = x.s;
      return y;
    };
    P.multipliedBy = P.times = function(y, b) {
      var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc, base, sqrtBase, x = this, xc = x.c, yc = (y = new BigNumber2(y, b)).c;
      if (!xc || !yc || !xc[0] || !yc[0]) {
        if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
          y.c = y.e = y.s = null;
        } else {
          y.s *= x.s;
          if (!xc || !yc) {
            y.c = y.e = null;
          } else {
            y.c = [0];
            y.e = 0;
          }
        }
        return y;
      }
      e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
      y.s *= x.s;
      xcL = xc.length;
      ycL = yc.length;
      if (xcL < ycL)
        zc = xc, xc = yc, yc = zc, i = xcL, xcL = ycL, ycL = i;
      for (i = xcL + ycL, zc = []; i--; zc.push(0))
        ;
      base = BASE;
      sqrtBase = SQRT_BASE;
      for (i = ycL; --i >= 0; ) {
        c = 0;
        ylo = yc[i] % sqrtBase;
        yhi = yc[i] / sqrtBase | 0;
        for (k = xcL, j = i + k; j > i; ) {
          xlo = xc[--k] % sqrtBase;
          xhi = xc[k] / sqrtBase | 0;
          m = yhi * xlo + xhi * ylo;
          xlo = ylo * xlo + m % sqrtBase * sqrtBase + zc[j] + c;
          c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
          zc[j--] = xlo % base;
        }
        zc[j] = c;
      }
      if (c) {
        ++e;
      } else {
        zc.splice(0, 1);
      }
      return normalise(y, zc, e);
    };
    P.negated = function() {
      var x = new BigNumber2(this);
      x.s = -x.s || null;
      return x;
    };
    P.plus = function(y, b) {
      var t, x = this, a = x.s;
      y = new BigNumber2(y, b);
      b = y.s;
      if (!a || !b)
        return new BigNumber2(NaN);
      if (a != b) {
        y.s = -b;
        return x.minus(y);
      }
      var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
      if (!xe || !ye) {
        if (!xc || !yc)
          return new BigNumber2(a / 0);
        if (!xc[0] || !yc[0])
          return yc[0] ? y : new BigNumber2(xc[0] ? x : a * 0);
      }
      xe = bitFloor(xe);
      ye = bitFloor(ye);
      xc = xc.slice();
      if (a = xe - ye) {
        if (a > 0) {
          ye = xe;
          t = yc;
        } else {
          a = -a;
          t = xc;
        }
        t.reverse();
        for (; a--; t.push(0))
          ;
        t.reverse();
      }
      a = xc.length;
      b = yc.length;
      if (a - b < 0)
        t = yc, yc = xc, xc = t, b = a;
      for (a = 0; b; ) {
        a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
        xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
      }
      if (a) {
        xc = [a].concat(xc);
        ++ye;
      }
      return normalise(y, xc, ye);
    };
    P.precision = P.sd = function(sd, rm) {
      var c, n, v, x = this;
      if (sd != null && sd !== !!sd) {
        intCheck(sd, 1, MAX);
        if (rm == null)
          rm = ROUNDING_MODE;
        else
          intCheck(rm, 0, 8);
        return round(new BigNumber2(x), sd, rm);
      }
      if (!(c = x.c))
        return null;
      v = c.length - 1;
      n = v * LOG_BASE + 1;
      if (v = c[v]) {
        for (; v % 10 == 0; v /= 10, n--)
          ;
        for (v = c[0]; v >= 10; v /= 10, n++)
          ;
      }
      if (sd && x.e + 1 > n)
        n = x.e + 1;
      return n;
    };
    P.shiftedBy = function(k) {
      intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
      return this.times("1e" + k);
    };
    P.squareRoot = P.sqrt = function() {
      var m, n, r, rep, t, x = this, c = x.c, s = x.s, e = x.e, dp = DECIMAL_PLACES + 4, half = new BigNumber2("0.5");
      if (s !== 1 || !c || !c[0]) {
        return new BigNumber2(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
      }
      s = Math.sqrt(+valueOf(x));
      if (s == 0 || s == 1 / 0) {
        n = coeffToString(c);
        if ((n.length + e) % 2 == 0)
          n += "0";
        s = Math.sqrt(+n);
        e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);
        if (s == 1 / 0) {
          n = "1e" + e;
        } else {
          n = s.toExponential();
          n = n.slice(0, n.indexOf("e") + 1) + e;
        }
        r = new BigNumber2(n);
      } else {
        r = new BigNumber2(s + "");
      }
      if (r.c[0]) {
        e = r.e;
        s = e + dp;
        if (s < 3)
          s = 0;
        for (; ; ) {
          t = r;
          r = half.times(t.plus(div(x, t, dp, 1)));
          if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {
            if (r.e < e)
              --s;
            n = n.slice(s - 3, s + 1);
            if (n == "9999" || !rep && n == "4999") {
              if (!rep) {
                round(t, t.e + DECIMAL_PLACES + 2, 0);
                if (t.times(t).eq(x)) {
                  r = t;
                  break;
                }
              }
              dp += 4;
              s += 4;
              rep = 1;
            } else {
              if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
                round(r, r.e + DECIMAL_PLACES + 2, 1);
                m = !r.times(r).eq(x);
              }
              break;
            }
          }
        }
      }
      return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
    };
    P.toExponential = function(dp, rm) {
      if (dp != null) {
        intCheck(dp, 0, MAX);
        dp++;
      }
      return format(this, dp, rm, 1);
    };
    P.toFixed = function(dp, rm) {
      if (dp != null) {
        intCheck(dp, 0, MAX);
        dp = dp + this.e + 1;
      }
      return format(this, dp, rm);
    };
    P.toFormat = function(dp, rm, format2) {
      var str, x = this;
      if (format2 == null) {
        if (dp != null && rm && typeof rm == "object") {
          format2 = rm;
          rm = null;
        } else if (dp && typeof dp == "object") {
          format2 = dp;
          dp = rm = null;
        } else {
          format2 = FORMAT;
        }
      } else if (typeof format2 != "object") {
        throw Error(bignumberError + "Argument not an object: " + format2);
      }
      str = x.toFixed(dp, rm);
      if (x.c) {
        var i, arr = str.split("."), g1 = +format2.groupSize, g2 = +format2.secondaryGroupSize, groupSeparator = format2.groupSeparator || "", intPart = arr[0], fractionPart = arr[1], isNeg = x.s < 0, intDigits = isNeg ? intPart.slice(1) : intPart, len = intDigits.length;
        if (g2)
          i = g1, g1 = g2, g2 = i, len -= i;
        if (g1 > 0 && len > 0) {
          i = len % g1 || g1;
          intPart = intDigits.substr(0, i);
          for (; i < len; i += g1)
            intPart += groupSeparator + intDigits.substr(i, g1);
          if (g2 > 0)
            intPart += groupSeparator + intDigits.slice(i);
          if (isNeg)
            intPart = "-" + intPart;
        }
        str = fractionPart ? intPart + (format2.decimalSeparator || "") + ((g2 = +format2.fractionGroupSize) ? fractionPart.replace(new RegExp("\\d{" + g2 + "}\\B", "g"), "$&" + (format2.fractionGroupSeparator || "")) : fractionPart) : intPart;
      }
      return (format2.prefix || "") + str + (format2.suffix || "");
    };
    P.toFraction = function(md) {
      var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s, x = this, xc = x.c;
      if (md != null) {
        n = new BigNumber2(md);
        if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
          throw Error(bignumberError + "Argument " + (n.isInteger() ? "out of range: " : "not an integer: ") + valueOf(n));
        }
      }
      if (!xc)
        return new BigNumber2(x);
      d = new BigNumber2(ONE);
      n1 = d0 = new BigNumber2(ONE);
      d1 = n0 = new BigNumber2(ONE);
      s = coeffToString(xc);
      e = d.e = s.length - x.e - 1;
      d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
      md = !md || n.comparedTo(d) > 0 ? e > 0 ? d : n1 : n;
      exp = MAX_EXP;
      MAX_EXP = 1 / 0;
      n = new BigNumber2(s);
      n0.c[0] = 0;
      for (; ; ) {
        q = div(n, d, 0, 1);
        d2 = d0.plus(q.times(d1));
        if (d2.comparedTo(md) == 1)
          break;
        d0 = d1;
        d1 = d2;
        n1 = n0.plus(q.times(d2 = n1));
        n0 = d2;
        d = n.minus(q.times(d2 = d));
        n = d2;
      }
      d2 = div(md.minus(d0), d1, 0, 1);
      n0 = n0.plus(d2.times(n1));
      d0 = d0.plus(d2.times(d1));
      n0.s = n1.s = x.s;
      e = e * 2;
      r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];
      MAX_EXP = exp;
      return r;
    };
    P.toNumber = function() {
      return +valueOf(this);
    };
    P.toPrecision = function(sd, rm) {
      if (sd != null)
        intCheck(sd, 1, MAX);
      return format(this, sd, rm, 2);
    };
    P.toString = function(b) {
      var str, n = this, s = n.s, e = n.e;
      if (e === null) {
        if (s) {
          str = "Infinity";
          if (s < 0)
            str = "-" + str;
        } else {
          str = "NaN";
        }
      } else {
        if (b == null) {
          str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(coeffToString(n.c), e) : toFixedPoint(coeffToString(n.c), e, "0");
        } else if (b === 10) {
          n = round(new BigNumber2(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
          str = toFixedPoint(coeffToString(n.c), n.e, "0");
        } else {
          intCheck(b, 2, ALPHABET.length, "Base");
          str = convertBase(toFixedPoint(coeffToString(n.c), e, "0"), 10, b, s, true);
        }
        if (s < 0 && n.c[0])
          str = "-" + str;
      }
      return str;
    };
    P.valueOf = P.toJSON = function() {
      return valueOf(this);
    };
    P._isBigNumber = true;
    P[Symbol.toStringTag] = "BigNumber";
    P[Symbol.for("nodejs.util.inspect.custom")] = P.valueOf;
    if (configObject != null)
      BigNumber2.set(configObject);
    return BigNumber2;
  }
  function bitFloor(n) {
    var i = n | 0;
    return n > 0 || n === i ? i : i - 1;
  }
  function coeffToString(a) {
    var s, z, i = 1, j = a.length, r = a[0] + "";
    for (; i < j; ) {
      s = a[i++] + "";
      z = LOG_BASE - s.length;
      for (; z--; s = "0" + s)
        ;
      r += s;
    }
    for (j = r.length; r.charCodeAt(--j) === 48; )
      ;
    return r.slice(0, j + 1 || 1);
  }
  function compare(x, y) {
    var a, b, xc = x.c, yc = y.c, i = x.s, j = y.s, k = x.e, l = y.e;
    if (!i || !j)
      return null;
    a = xc && !xc[0];
    b = yc && !yc[0];
    if (a || b)
      return a ? b ? 0 : -j : i;
    if (i != j)
      return i;
    a = i < 0;
    b = k == l;
    if (!xc || !yc)
      return b ? 0 : !xc ^ a ? 1 : -1;
    if (!b)
      return k > l ^ a ? 1 : -1;
    j = (k = xc.length) < (l = yc.length) ? k : l;
    for (i = 0; i < j; i++)
      if (xc[i] != yc[i])
        return xc[i] > yc[i] ^ a ? 1 : -1;
    return k == l ? 0 : k > l ^ a ? 1 : -1;
  }
  function intCheck(n, min, max, name) {
    if (n < min || n > max || n !== mathfloor(n)) {
      throw Error(bignumberError + (name || "Argument") + (typeof n == "number" ? n < min || n > max ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(n));
    }
  }
  function isOdd(n) {
    var k = n.c.length - 1;
    return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
  }
  function toExponential(str, e) {
    return (str.length > 1 ? str.charAt(0) + "." + str.slice(1) : str) + (e < 0 ? "e" : "e+") + e;
  }
  function toFixedPoint(str, e, z) {
    var len, zs;
    if (e < 0) {
      for (zs = z + "."; ++e; zs += z)
        ;
      str = zs + str;
    } else {
      len = str.length;
      if (++e > len) {
        for (zs = z, e -= len; --e; zs += z)
          ;
        str += zs;
      } else if (e < len) {
        str = str.slice(0, e) + "." + str.slice(e);
      }
    }
    return str;
  }
  var BigNumber = clone();
  var bignumber_default = BigNumber;
});

// node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS((exports2, module2) => {
  var buffer = require("buffer");
  var Buffer2 = buffer.Buffer;
  function copyProps(src, dst) {
    for (var key in src) {
      dst[key] = src[key];
    }
  }
  if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
    module2.exports = buffer;
  } else {
    copyProps(buffer, exports2);
    exports2.Buffer = SafeBuffer;
  }
  function SafeBuffer(arg, encodingOrOffset, length) {
    return Buffer2(arg, encodingOrOffset, length);
  }
  copyProps(Buffer2, SafeBuffer);
  SafeBuffer.from = function(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
      throw new TypeError("Argument must not be a number");
    }
    return Buffer2(arg, encodingOrOffset, length);
  };
  SafeBuffer.alloc = function(size, fill, encoding) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    var buf = Buffer2(size);
    if (fill !== void 0) {
      if (typeof encoding === "string") {
        buf.fill(fill, encoding);
      } else {
        buf.fill(fill);
      }
    } else {
      buf.fill(0);
    }
    return buf;
  };
  SafeBuffer.allocUnsafe = function(size) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    return Buffer2(size);
  };
  SafeBuffer.allocUnsafeSlow = function(size) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    return buffer.SlowBuffer(size);
  };
});

// node_modules/mysql/lib/protocol/BufferList.js
var require_BufferList = __commonJS((exports2, module2) => {
  module2.exports = BufferList;
  function BufferList() {
    this.bufs = [];
    this.size = 0;
  }
  BufferList.prototype.shift = function shift() {
    var buf = this.bufs.shift();
    if (buf) {
      this.size -= buf.length;
    }
    return buf;
  };
  BufferList.prototype.push = function push(buf) {
    if (!buf || !buf.length) {
      return;
    }
    this.bufs.push(buf);
    this.size += buf.length;
  };
});

// node_modules/mysql/lib/protocol/Parser.js
var require_Parser = __commonJS((exports2, module2) => {
  var PacketHeader = require_PacketHeader();
  var BigNumber = require_bignumber();
  var Buffer2 = require_safe_buffer().Buffer;
  var BufferList = require_BufferList();
  var MAX_PACKET_LENGTH = Math.pow(2, 24) - 1;
  var MUL_32BIT = Math.pow(2, 32);
  var PACKET_HEADER_LENGTH = 4;
  module2.exports = Parser;
  function Parser(options) {
    options = options || {};
    this._supportBigNumbers = options.config && options.config.supportBigNumbers;
    this._buffer = Buffer2.alloc(0);
    this._nextBuffers = new BufferList();
    this._longPacketBuffers = new BufferList();
    this._offset = 0;
    this._packetEnd = null;
    this._packetHeader = null;
    this._packetOffset = null;
    this._onError = options.onError || function(err) {
      throw err;
    };
    this._onPacket = options.onPacket || function() {
    };
    this._nextPacketNumber = 0;
    this._encoding = "utf-8";
    this._paused = false;
  }
  Parser.prototype.write = function write(chunk) {
    this._nextBuffers.push(chunk);
    while (!this._paused) {
      var packetHeader = this._tryReadPacketHeader();
      if (!packetHeader) {
        break;
      }
      if (!this._combineNextBuffers(packetHeader.length)) {
        break;
      }
      this._parsePacket(packetHeader);
    }
  };
  Parser.prototype.append = function append(chunk) {
    if (!chunk || chunk.length === 0) {
      return;
    }
    var sliceEnd = this._buffer.length;
    var sliceStart = this._packetOffset === null ? this._offset : this._packetOffset;
    var sliceLength = sliceEnd - sliceStart;
    var buffer = null;
    var chunks = !(chunk instanceof Array || Array.isArray(chunk)) ? [chunk] : chunk;
    var length = 0;
    var offset = 0;
    for (var i = 0; i < chunks.length; i++) {
      length += chunks[i].length;
    }
    if (sliceLength !== 0) {
      buffer = Buffer2.allocUnsafe(sliceLength + length);
      offset = 0;
      offset += this._buffer.copy(buffer, 0, sliceStart, sliceEnd);
      for (var i = 0; i < chunks.length; i++) {
        offset += chunks[i].copy(buffer, offset);
      }
    } else if (chunks.length > 1) {
      buffer = Buffer2.allocUnsafe(length);
      offset = 0;
      for (var i = 0; i < chunks.length; i++) {
        offset += chunks[i].copy(buffer, offset);
      }
    } else {
      buffer = chunks[0];
    }
    this._buffer = buffer;
    this._offset = this._offset - sliceStart;
    this._packetEnd = this._packetEnd !== null ? this._packetEnd - sliceStart : null;
    this._packetOffset = this._packetOffset !== null ? this._packetOffset - sliceStart : null;
  };
  Parser.prototype.pause = function() {
    this._paused = true;
  };
  Parser.prototype.resume = function() {
    this._paused = false;
    process.nextTick(this.write.bind(this));
  };
  Parser.prototype.peak = function peak(offset) {
    return this._buffer[this._offset + (offset >>> 0)];
  };
  Parser.prototype.parseUnsignedNumber = function parseUnsignedNumber(bytes) {
    if (bytes === 1) {
      return this._buffer[this._offset++];
    }
    var buffer = this._buffer;
    var offset = this._offset + bytes - 1;
    var value = 0;
    if (bytes > 4) {
      var err = new Error("parseUnsignedNumber: Supports only up to 4 bytes");
      err.offset = this._offset - this._packetOffset - 1;
      err.code = "PARSER_UNSIGNED_TOO_LONG";
      throw err;
    }
    while (offset >= this._offset) {
      value = (value << 8 | buffer[offset]) >>> 0;
      offset--;
    }
    this._offset += bytes;
    return value;
  };
  Parser.prototype.parseLengthCodedString = function() {
    var length = this.parseLengthCodedNumber();
    if (length === null) {
      return null;
    }
    return this.parseString(length);
  };
  Parser.prototype.parseLengthCodedBuffer = function() {
    var length = this.parseLengthCodedNumber();
    if (length === null) {
      return null;
    }
    return this.parseBuffer(length);
  };
  Parser.prototype.parseLengthCodedNumber = function parseLengthCodedNumber() {
    if (this._offset >= this._buffer.length) {
      var err = new Error("Parser: read past end");
      err.offset = this._offset - this._packetOffset;
      err.code = "PARSER_READ_PAST_END";
      throw err;
    }
    var bits = this._buffer[this._offset++];
    if (bits <= 250) {
      return bits;
    }
    switch (bits) {
      case 251:
        return null;
      case 252:
        return this.parseUnsignedNumber(2);
      case 253:
        return this.parseUnsignedNumber(3);
      case 254:
        break;
      default:
        var err = new Error("Unexpected first byte" + (bits ? ": 0x" + bits.toString(16) : ""));
        err.offset = this._offset - this._packetOffset - 1;
        err.code = "PARSER_BAD_LENGTH_BYTE";
        throw err;
    }
    var low = this.parseUnsignedNumber(4);
    var high = this.parseUnsignedNumber(4);
    var value;
    if (high >>> 21) {
      value = BigNumber(MUL_32BIT).times(high).plus(low).toString();
      if (this._supportBigNumbers) {
        return value;
      }
      var err = new Error('parseLengthCodedNumber: JS precision range exceeded, number is >= 53 bit: "' + value + '"');
      err.offset = this._offset - this._packetOffset - 8;
      err.code = "PARSER_JS_PRECISION_RANGE_EXCEEDED";
      throw err;
    }
    value = low + MUL_32BIT * high;
    return value;
  };
  Parser.prototype.parseFiller = function(length) {
    return this.parseBuffer(length);
  };
  Parser.prototype.parseNullTerminatedBuffer = function() {
    var end = this._nullByteOffset();
    var value = this._buffer.slice(this._offset, end);
    this._offset = end + 1;
    return value;
  };
  Parser.prototype.parseNullTerminatedString = function() {
    var end = this._nullByteOffset();
    var value = this._buffer.toString(this._encoding, this._offset, end);
    this._offset = end + 1;
    return value;
  };
  Parser.prototype._nullByteOffset = function() {
    var offset = this._offset;
    while (this._buffer[offset] !== 0) {
      offset++;
      if (offset >= this._buffer.length) {
        var err = new Error("Offset of null terminated string not found.");
        err.offset = this._offset - this._packetOffset;
        err.code = "PARSER_MISSING_NULL_BYTE";
        throw err;
      }
    }
    return offset;
  };
  Parser.prototype.parsePacketTerminatedBuffer = function parsePacketTerminatedBuffer() {
    var length = this._packetEnd - this._offset;
    return this.parseBuffer(length);
  };
  Parser.prototype.parsePacketTerminatedString = function() {
    var length = this._packetEnd - this._offset;
    return this.parseString(length);
  };
  Parser.prototype.parseBuffer = function(length) {
    var response = Buffer2.alloc(length);
    this._buffer.copy(response, 0, this._offset, this._offset + length);
    this._offset += length;
    return response;
  };
  Parser.prototype.parseString = function(length) {
    var offset = this._offset;
    var end = offset + length;
    var value = this._buffer.toString(this._encoding, offset, end);
    this._offset = end;
    return value;
  };
  Parser.prototype.parseGeometryValue = function() {
    var buffer = this.parseLengthCodedBuffer();
    var offset = 4;
    if (buffer === null || !buffer.length) {
      return null;
    }
    function parseGeometry() {
      var result = null;
      var byteOrder = buffer.readUInt8(offset);
      offset += 1;
      var wkbType = byteOrder ? buffer.readUInt32LE(offset) : buffer.readUInt32BE(offset);
      offset += 4;
      switch (wkbType) {
        case 1:
          var x = byteOrder ? buffer.readDoubleLE(offset) : buffer.readDoubleBE(offset);
          offset += 8;
          var y = byteOrder ? buffer.readDoubleLE(offset) : buffer.readDoubleBE(offset);
          offset += 8;
          result = {x, y};
          break;
        case 2:
          var numPoints = byteOrder ? buffer.readUInt32LE(offset) : buffer.readUInt32BE(offset);
          offset += 4;
          result = [];
          for (var i = numPoints; i > 0; i--) {
            var x = byteOrder ? buffer.readDoubleLE(offset) : buffer.readDoubleBE(offset);
            offset += 8;
            var y = byteOrder ? buffer.readDoubleLE(offset) : buffer.readDoubleBE(offset);
            offset += 8;
            result.push({x, y});
          }
          break;
        case 3:
          var numRings = byteOrder ? buffer.readUInt32LE(offset) : buffer.readUInt32BE(offset);
          offset += 4;
          result = [];
          for (var i = numRings; i > 0; i--) {
            var numPoints = byteOrder ? buffer.readUInt32LE(offset) : buffer.readUInt32BE(offset);
            offset += 4;
            var line = [];
            for (var j = numPoints; j > 0; j--) {
              var x = byteOrder ? buffer.readDoubleLE(offset) : buffer.readDoubleBE(offset);
              offset += 8;
              var y = byteOrder ? buffer.readDoubleLE(offset) : buffer.readDoubleBE(offset);
              offset += 8;
              line.push({x, y});
            }
            result.push(line);
          }
          break;
        case 4:
        case 5:
        case 6:
        case 7:
          var num = byteOrder ? buffer.readUInt32LE(offset) : buffer.readUInt32BE(offset);
          offset += 4;
          var result = [];
          for (var i = num; i > 0; i--) {
            result.push(parseGeometry());
          }
          break;
      }
      return result;
    }
    return parseGeometry();
  };
  Parser.prototype.reachedPacketEnd = function() {
    return this._offset === this._packetEnd;
  };
  Parser.prototype.incrementPacketNumber = function() {
    var currentPacketNumber = this._nextPacketNumber;
    this._nextPacketNumber = (this._nextPacketNumber + 1) % 256;
    return currentPacketNumber;
  };
  Parser.prototype.resetPacketNumber = function() {
    this._nextPacketNumber = 0;
  };
  Parser.prototype.packetLength = function packetLength() {
    if (!this._packetHeader) {
      return null;
    }
    return this._packetHeader.length + this._longPacketBuffers.size;
  };
  Parser.prototype._combineNextBuffers = function _combineNextBuffers(bytes) {
    var length = this._buffer.length - this._offset;
    if (length >= bytes) {
      return true;
    }
    if (length + this._nextBuffers.size < bytes) {
      return false;
    }
    var buffers = [];
    var bytesNeeded = bytes - length;
    while (bytesNeeded > 0) {
      var buffer = this._nextBuffers.shift();
      buffers.push(buffer);
      bytesNeeded -= buffer.length;
    }
    this.append(buffers);
    return true;
  };
  Parser.prototype._combineLongPacketBuffers = function _combineLongPacketBuffers() {
    if (!this._longPacketBuffers.size) {
      return;
    }
    var remainingBytes = this._buffer.length - this._offset;
    var trailingPacketBytes = this._buffer.length - this._packetEnd;
    var buf = null;
    var buffer = Buffer2.allocUnsafe(remainingBytes + this._longPacketBuffers.size);
    var offset = 0;
    while (buf = this._longPacketBuffers.shift()) {
      offset += buf.copy(buffer, offset);
    }
    this._buffer.copy(buffer, offset, this._offset);
    this._buffer = buffer;
    this._offset = 0;
    this._packetEnd = this._buffer.length - trailingPacketBytes;
    this._packetOffset = 0;
  };
  Parser.prototype._parsePacket = function _parsePacket(packetHeader) {
    this._packetEnd = this._offset + packetHeader.length;
    this._packetOffset = this._offset;
    if (packetHeader.length === MAX_PACKET_LENGTH) {
      this._longPacketBuffers.push(this._buffer.slice(this._packetOffset, this._packetEnd));
      this._advanceToNextPacket();
      return;
    }
    this._combineLongPacketBuffers();
    var hadException = true;
    try {
      this._onPacket(packetHeader);
      hadException = false;
    } catch (err) {
      if (!err || typeof err.code !== "string" || err.code.substr(0, 7) !== "PARSER_") {
        throw err;
      }
      this._onError(err);
      hadException = false;
    } finally {
      this._advanceToNextPacket();
      if (hadException) {
        process.nextTick(this.write.bind(this));
      }
    }
  };
  Parser.prototype._tryReadPacketHeader = function _tryReadPacketHeader() {
    if (this._packetHeader) {
      return this._packetHeader;
    }
    if (!this._combineNextBuffers(PACKET_HEADER_LENGTH)) {
      return null;
    }
    this._packetHeader = new PacketHeader(this.parseUnsignedNumber(3), this.parseUnsignedNumber(1));
    if (this._packetHeader.number !== this._nextPacketNumber) {
      var err = new Error("Packets out of order. Got: " + this._packetHeader.number + " Expected: " + this._nextPacketNumber);
      err.code = "PROTOCOL_PACKETS_OUT_OF_ORDER";
      err.fatal = true;
      this._onError(err);
    }
    this.incrementPacketNumber();
    return this._packetHeader;
  };
  Parser.prototype._advanceToNextPacket = function() {
    this._offset = this._packetEnd;
    this._packetHeader = null;
    this._packetEnd = null;
    this._packetOffset = null;
  };
});

// node_modules/mysql/lib/protocol/packets/AuthSwitchRequestPacket.js
var require_AuthSwitchRequestPacket = __commonJS((exports2, module2) => {
  module2.exports = AuthSwitchRequestPacket;
  function AuthSwitchRequestPacket(options) {
    options = options || {};
    this.status = 254;
    this.authMethodName = options.authMethodName;
    this.authMethodData = options.authMethodData;
  }
  AuthSwitchRequestPacket.prototype.parse = function parse(parser) {
    this.status = parser.parseUnsignedNumber(1);
    this.authMethodName = parser.parseNullTerminatedString();
    this.authMethodData = parser.parsePacketTerminatedBuffer();
  };
  AuthSwitchRequestPacket.prototype.write = function write(writer) {
    writer.writeUnsignedNumber(1, this.status);
    writer.writeNullTerminatedString(this.authMethodName);
    writer.writeBuffer(this.authMethodData);
  };
});

// node_modules/mysql/lib/protocol/packets/AuthSwitchResponsePacket.js
var require_AuthSwitchResponsePacket = __commonJS((exports2, module2) => {
  module2.exports = AuthSwitchResponsePacket;
  function AuthSwitchResponsePacket(options) {
    options = options || {};
    this.data = options.data;
  }
  AuthSwitchResponsePacket.prototype.parse = function parse(parser) {
    this.data = parser.parsePacketTerminatedBuffer();
  };
  AuthSwitchResponsePacket.prototype.write = function write(writer) {
    writer.writeBuffer(this.data);
  };
});

// node_modules/mysql/lib/protocol/packets/ClientAuthenticationPacket.js
var require_ClientAuthenticationPacket = __commonJS((exports2, module2) => {
  var Buffer2 = require_safe_buffer().Buffer;
  module2.exports = ClientAuthenticationPacket;
  function ClientAuthenticationPacket(options) {
    options = options || {};
    this.clientFlags = options.clientFlags;
    this.maxPacketSize = options.maxPacketSize;
    this.charsetNumber = options.charsetNumber;
    this.filler = void 0;
    this.user = options.user;
    this.scrambleBuff = options.scrambleBuff;
    this.database = options.database;
    this.protocol41 = options.protocol41;
  }
  ClientAuthenticationPacket.prototype.parse = function(parser) {
    if (this.protocol41) {
      this.clientFlags = parser.parseUnsignedNumber(4);
      this.maxPacketSize = parser.parseUnsignedNumber(4);
      this.charsetNumber = parser.parseUnsignedNumber(1);
      this.filler = parser.parseFiller(23);
      this.user = parser.parseNullTerminatedString();
      this.scrambleBuff = parser.parseLengthCodedBuffer();
      this.database = parser.parseNullTerminatedString();
    } else {
      this.clientFlags = parser.parseUnsignedNumber(2);
      this.maxPacketSize = parser.parseUnsignedNumber(3);
      this.user = parser.parseNullTerminatedString();
      this.scrambleBuff = parser.parseBuffer(8);
      this.database = parser.parseLengthCodedBuffer();
    }
  };
  ClientAuthenticationPacket.prototype.write = function(writer) {
    if (this.protocol41) {
      writer.writeUnsignedNumber(4, this.clientFlags);
      writer.writeUnsignedNumber(4, this.maxPacketSize);
      writer.writeUnsignedNumber(1, this.charsetNumber);
      writer.writeFiller(23);
      writer.writeNullTerminatedString(this.user);
      writer.writeLengthCodedBuffer(this.scrambleBuff);
      writer.writeNullTerminatedString(this.database);
    } else {
      writer.writeUnsignedNumber(2, this.clientFlags);
      writer.writeUnsignedNumber(3, this.maxPacketSize);
      writer.writeNullTerminatedString(this.user);
      writer.writeBuffer(this.scrambleBuff);
      if (this.database && this.database.length) {
        writer.writeFiller(1);
        writer.writeBuffer(Buffer2.from(this.database));
      }
    }
  };
});

// node_modules/mysql/lib/protocol/packets/ComChangeUserPacket.js
var require_ComChangeUserPacket = __commonJS((exports2, module2) => {
  module2.exports = ComChangeUserPacket;
  function ComChangeUserPacket(options) {
    options = options || {};
    this.command = 17;
    this.user = options.user;
    this.scrambleBuff = options.scrambleBuff;
    this.database = options.database;
    this.charsetNumber = options.charsetNumber;
  }
  ComChangeUserPacket.prototype.parse = function(parser) {
    this.command = parser.parseUnsignedNumber(1);
    this.user = parser.parseNullTerminatedString();
    this.scrambleBuff = parser.parseLengthCodedBuffer();
    this.database = parser.parseNullTerminatedString();
    this.charsetNumber = parser.parseUnsignedNumber(1);
  };
  ComChangeUserPacket.prototype.write = function(writer) {
    writer.writeUnsignedNumber(1, this.command);
    writer.writeNullTerminatedString(this.user);
    writer.writeLengthCodedBuffer(this.scrambleBuff);
    writer.writeNullTerminatedString(this.database);
    writer.writeUnsignedNumber(2, this.charsetNumber);
  };
});

// node_modules/mysql/lib/protocol/packets/ComPingPacket.js
var require_ComPingPacket = __commonJS((exports2, module2) => {
  module2.exports = ComPingPacket;
  function ComPingPacket() {
    this.command = 14;
  }
  ComPingPacket.prototype.write = function(writer) {
    writer.writeUnsignedNumber(1, this.command);
  };
  ComPingPacket.prototype.parse = function(parser) {
    this.command = parser.parseUnsignedNumber(1);
  };
});

// node_modules/mysql/lib/protocol/packets/ComQueryPacket.js
var require_ComQueryPacket = __commonJS((exports2, module2) => {
  module2.exports = ComQueryPacket;
  function ComQueryPacket(sql) {
    this.command = 3;
    this.sql = sql;
  }
  ComQueryPacket.prototype.write = function(writer) {
    writer.writeUnsignedNumber(1, this.command);
    writer.writeString(this.sql);
  };
  ComQueryPacket.prototype.parse = function(parser) {
    this.command = parser.parseUnsignedNumber(1);
    this.sql = parser.parsePacketTerminatedString();
  };
});

// node_modules/mysql/lib/protocol/packets/ComQuitPacket.js
var require_ComQuitPacket = __commonJS((exports2, module2) => {
  module2.exports = ComQuitPacket;
  function ComQuitPacket() {
    this.command = 1;
  }
  ComQuitPacket.prototype.parse = function parse(parser) {
    this.command = parser.parseUnsignedNumber(1);
  };
  ComQuitPacket.prototype.write = function write(writer) {
    writer.writeUnsignedNumber(1, this.command);
  };
});

// node_modules/mysql/lib/protocol/packets/ComStatisticsPacket.js
var require_ComStatisticsPacket = __commonJS((exports2, module2) => {
  module2.exports = ComStatisticsPacket;
  function ComStatisticsPacket() {
    this.command = 9;
  }
  ComStatisticsPacket.prototype.write = function(writer) {
    writer.writeUnsignedNumber(1, this.command);
  };
  ComStatisticsPacket.prototype.parse = function(parser) {
    this.command = parser.parseUnsignedNumber(1);
  };
});

// node_modules/mysql/lib/protocol/packets/EmptyPacket.js
var require_EmptyPacket = __commonJS((exports2, module2) => {
  module2.exports = EmptyPacket;
  function EmptyPacket() {
  }
  EmptyPacket.prototype.parse = function parse() {
  };
  EmptyPacket.prototype.write = function write() {
  };
});

// node_modules/mysql/lib/protocol/packets/EofPacket.js
var require_EofPacket = __commonJS((exports2, module2) => {
  module2.exports = EofPacket;
  function EofPacket(options) {
    options = options || {};
    this.fieldCount = void 0;
    this.warningCount = options.warningCount;
    this.serverStatus = options.serverStatus;
    this.protocol41 = options.protocol41;
  }
  EofPacket.prototype.parse = function(parser) {
    this.fieldCount = parser.parseUnsignedNumber(1);
    if (this.protocol41) {
      this.warningCount = parser.parseUnsignedNumber(2);
      this.serverStatus = parser.parseUnsignedNumber(2);
    }
  };
  EofPacket.prototype.write = function(writer) {
    writer.writeUnsignedNumber(1, 254);
    if (this.protocol41) {
      writer.writeUnsignedNumber(2, this.warningCount);
      writer.writeUnsignedNumber(2, this.serverStatus);
    }
  };
});

// node_modules/mysql/lib/protocol/packets/ErrorPacket.js
var require_ErrorPacket = __commonJS((exports2, module2) => {
  module2.exports = ErrorPacket;
  function ErrorPacket(options) {
    options = options || {};
    this.fieldCount = options.fieldCount;
    this.errno = options.errno;
    this.sqlStateMarker = options.sqlStateMarker;
    this.sqlState = options.sqlState;
    this.message = options.message;
  }
  ErrorPacket.prototype.parse = function(parser) {
    this.fieldCount = parser.parseUnsignedNumber(1);
    this.errno = parser.parseUnsignedNumber(2);
    if (parser.peak() === 35) {
      this.sqlStateMarker = parser.parseString(1);
      this.sqlState = parser.parseString(5);
    }
    this.message = parser.parsePacketTerminatedString();
  };
  ErrorPacket.prototype.write = function(writer) {
    writer.writeUnsignedNumber(1, 255);
    writer.writeUnsignedNumber(2, this.errno);
    if (this.sqlStateMarker) {
      writer.writeString(this.sqlStateMarker);
      writer.writeString(this.sqlState);
    }
    writer.writeString(this.message);
  };
});

// node_modules/mysql/lib/protocol/constants/types.js
var require_types = __commonJS((exports2) => {
  exports2.DECIMAL = 0;
  exports2.TINY = 1;
  exports2.SHORT = 2;
  exports2.LONG = 3;
  exports2.FLOAT = 4;
  exports2.DOUBLE = 5;
  exports2.NULL = 6;
  exports2.TIMESTAMP = 7;
  exports2.LONGLONG = 8;
  exports2.INT24 = 9;
  exports2.DATE = 10;
  exports2.TIME = 11;
  exports2.DATETIME = 12;
  exports2.YEAR = 13;
  exports2.NEWDATE = 14;
  exports2.VARCHAR = 15;
  exports2.BIT = 16;
  exports2.TIMESTAMP2 = 17;
  exports2.DATETIME2 = 18;
  exports2.TIME2 = 19;
  exports2.JSON = 245;
  exports2.NEWDECIMAL = 246;
  exports2.ENUM = 247;
  exports2.SET = 248;
  exports2.TINY_BLOB = 249;
  exports2.MEDIUM_BLOB = 250;
  exports2.LONG_BLOB = 251;
  exports2.BLOB = 252;
  exports2.VAR_STRING = 253;
  exports2.STRING = 254;
  exports2.GEOMETRY = 255;
  exports2[0] = "DECIMAL";
  exports2[1] = "TINY";
  exports2[2] = "SHORT";
  exports2[3] = "LONG";
  exports2[4] = "FLOAT";
  exports2[5] = "DOUBLE";
  exports2[6] = "NULL";
  exports2[7] = "TIMESTAMP";
  exports2[8] = "LONGLONG";
  exports2[9] = "INT24";
  exports2[10] = "DATE";
  exports2[11] = "TIME";
  exports2[12] = "DATETIME";
  exports2[13] = "YEAR";
  exports2[14] = "NEWDATE";
  exports2[15] = "VARCHAR";
  exports2[16] = "BIT";
  exports2[17] = "TIMESTAMP2";
  exports2[18] = "DATETIME2";
  exports2[19] = "TIME2";
  exports2[245] = "JSON";
  exports2[246] = "NEWDECIMAL";
  exports2[247] = "ENUM";
  exports2[248] = "SET";
  exports2[249] = "TINY_BLOB";
  exports2[250] = "MEDIUM_BLOB";
  exports2[251] = "LONG_BLOB";
  exports2[252] = "BLOB";
  exports2[253] = "VAR_STRING";
  exports2[254] = "STRING";
  exports2[255] = "GEOMETRY";
});

// node_modules/mysql/lib/protocol/packets/Field.js
var require_Field = __commonJS((exports2, module2) => {
  var Types = require_types();
  module2.exports = Field;
  function Field(options) {
    options = options || {};
    this.parser = options.parser;
    this.packet = options.packet;
    this.db = options.packet.db;
    this.table = options.packet.table;
    this.name = options.packet.name;
    this.type = Types[options.packet.type];
    this.length = options.packet.length;
  }
  Field.prototype.string = function() {
    return this.parser.parseLengthCodedString();
  };
  Field.prototype.buffer = function() {
    return this.parser.parseLengthCodedBuffer();
  };
  Field.prototype.geometry = function() {
    return this.parser.parseGeometryValue();
  };
});

// node_modules/mysql/lib/protocol/packets/FieldPacket.js
var require_FieldPacket = __commonJS((exports2, module2) => {
  module2.exports = FieldPacket;
  function FieldPacket(options) {
    options = options || {};
    this.catalog = options.catalog;
    this.db = options.db;
    this.table = options.table;
    this.orgTable = options.orgTable;
    this.name = options.name;
    this.orgName = options.orgName;
    this.charsetNr = options.charsetNr;
    this.length = options.length;
    this.type = options.type;
    this.flags = options.flags;
    this.decimals = options.decimals;
    this.default = options.default;
    this.zeroFill = options.zeroFill;
    this.protocol41 = options.protocol41;
  }
  FieldPacket.prototype.parse = function(parser) {
    if (this.protocol41) {
      this.catalog = parser.parseLengthCodedString();
      this.db = parser.parseLengthCodedString();
      this.table = parser.parseLengthCodedString();
      this.orgTable = parser.parseLengthCodedString();
      this.name = parser.parseLengthCodedString();
      this.orgName = parser.parseLengthCodedString();
      if (parser.parseLengthCodedNumber() !== 12) {
        var err = new TypeError("Received invalid field length");
        err.code = "PARSER_INVALID_FIELD_LENGTH";
        throw err;
      }
      this.charsetNr = parser.parseUnsignedNumber(2);
      this.length = parser.parseUnsignedNumber(4);
      this.type = parser.parseUnsignedNumber(1);
      this.flags = parser.parseUnsignedNumber(2);
      this.decimals = parser.parseUnsignedNumber(1);
      var filler = parser.parseBuffer(2);
      if (filler[0] !== 0 || filler[1] !== 0) {
        var err = new TypeError("Received invalid filler");
        err.code = "PARSER_INVALID_FILLER";
        throw err;
      }
      this.zeroFill = this.flags & 64 ? true : false;
      if (parser.reachedPacketEnd()) {
        return;
      }
      this.default = parser.parseLengthCodedString();
    } else {
      this.table = parser.parseLengthCodedString();
      this.name = parser.parseLengthCodedString();
      this.length = parser.parseUnsignedNumber(parser.parseUnsignedNumber(1));
      this.type = parser.parseUnsignedNumber(parser.parseUnsignedNumber(1));
    }
  };
  FieldPacket.prototype.write = function(writer) {
    if (this.protocol41) {
      writer.writeLengthCodedString(this.catalog);
      writer.writeLengthCodedString(this.db);
      writer.writeLengthCodedString(this.table);
      writer.writeLengthCodedString(this.orgTable);
      writer.writeLengthCodedString(this.name);
      writer.writeLengthCodedString(this.orgName);
      writer.writeLengthCodedNumber(12);
      writer.writeUnsignedNumber(2, this.charsetNr || 0);
      writer.writeUnsignedNumber(4, this.length || 0);
      writer.writeUnsignedNumber(1, this.type || 0);
      writer.writeUnsignedNumber(2, this.flags || 0);
      writer.writeUnsignedNumber(1, this.decimals || 0);
      writer.writeFiller(2);
      if (this.default !== void 0) {
        writer.writeLengthCodedString(this.default);
      }
    } else {
      writer.writeLengthCodedString(this.table);
      writer.writeLengthCodedString(this.name);
      writer.writeUnsignedNumber(1, 1);
      writer.writeUnsignedNumber(1, this.length);
      writer.writeUnsignedNumber(1, 1);
      writer.writeUnsignedNumber(1, this.type);
    }
  };
});

// node_modules/mysql/lib/protocol/packets/HandshakeInitializationPacket.js
var require_HandshakeInitializationPacket = __commonJS((exports2, module2) => {
  var Buffer2 = require_safe_buffer().Buffer;
  var Client = require_client();
  module2.exports = HandshakeInitializationPacket;
  function HandshakeInitializationPacket(options) {
    options = options || {};
    this.protocolVersion = options.protocolVersion;
    this.serverVersion = options.serverVersion;
    this.threadId = options.threadId;
    this.scrambleBuff1 = options.scrambleBuff1;
    this.filler1 = options.filler1;
    this.serverCapabilities1 = options.serverCapabilities1;
    this.serverLanguage = options.serverLanguage;
    this.serverStatus = options.serverStatus;
    this.serverCapabilities2 = options.serverCapabilities2;
    this.scrambleLength = options.scrambleLength;
    this.filler2 = options.filler2;
    this.scrambleBuff2 = options.scrambleBuff2;
    this.filler3 = options.filler3;
    this.pluginData = options.pluginData;
    this.protocol41 = options.protocol41;
    if (this.protocol41) {
      this.serverCapabilities1 |= Client.CLIENT_PROTOCOL_41;
    }
  }
  HandshakeInitializationPacket.prototype.parse = function(parser) {
    this.protocolVersion = parser.parseUnsignedNumber(1);
    this.serverVersion = parser.parseNullTerminatedString();
    this.threadId = parser.parseUnsignedNumber(4);
    this.scrambleBuff1 = parser.parseBuffer(8);
    this.filler1 = parser.parseFiller(1);
    this.serverCapabilities1 = parser.parseUnsignedNumber(2);
    this.serverLanguage = parser.parseUnsignedNumber(1);
    this.serverStatus = parser.parseUnsignedNumber(2);
    this.protocol41 = (this.serverCapabilities1 & 1 << 9) > 0;
    if (this.protocol41) {
      this.serverCapabilities2 = parser.parseUnsignedNumber(2);
      this.scrambleLength = parser.parseUnsignedNumber(1);
      this.filler2 = parser.parseFiller(10);
      this.scrambleBuff2 = parser.parseBuffer(12);
      this.filler3 = parser.parseFiller(1);
    } else {
      this.filler2 = parser.parseFiller(13);
    }
    if (parser.reachedPacketEnd()) {
      return;
    }
    this.pluginData = parser.parsePacketTerminatedString();
    var lastChar = this.pluginData.length - 1;
    if (this.pluginData[lastChar] === "\0") {
      this.pluginData = this.pluginData.substr(0, lastChar);
    }
  };
  HandshakeInitializationPacket.prototype.write = function(writer) {
    writer.writeUnsignedNumber(1, this.protocolVersion);
    writer.writeNullTerminatedString(this.serverVersion);
    writer.writeUnsignedNumber(4, this.threadId);
    writer.writeBuffer(this.scrambleBuff1);
    writer.writeFiller(1);
    writer.writeUnsignedNumber(2, this.serverCapabilities1);
    writer.writeUnsignedNumber(1, this.serverLanguage);
    writer.writeUnsignedNumber(2, this.serverStatus);
    if (this.protocol41) {
      writer.writeUnsignedNumber(2, this.serverCapabilities2);
      writer.writeUnsignedNumber(1, this.scrambleLength);
      writer.writeFiller(10);
    }
    writer.writeNullTerminatedBuffer(this.scrambleBuff2);
    if (this.pluginData !== void 0) {
      writer.writeNullTerminatedString(this.pluginData);
    }
  };
  HandshakeInitializationPacket.prototype.scrambleBuff = function() {
    var buffer = null;
    if (typeof this.scrambleBuff2 === "undefined") {
      buffer = Buffer2.from(this.scrambleBuff1);
    } else {
      buffer = Buffer2.allocUnsafe(this.scrambleBuff1.length + this.scrambleBuff2.length);
      this.scrambleBuff1.copy(buffer, 0);
      this.scrambleBuff2.copy(buffer, this.scrambleBuff1.length);
    }
    return buffer;
  };
});

// node_modules/mysql/lib/protocol/packets/LocalDataFilePacket.js
var require_LocalDataFilePacket = __commonJS((exports2, module2) => {
  module2.exports = LocalDataFilePacket;
  function LocalDataFilePacket(data) {
    this.data = data;
  }
  LocalDataFilePacket.prototype.write = function(writer) {
    writer.writeBuffer(this.data);
  };
});

// node_modules/mysql/lib/protocol/packets/LocalInfileRequestPacket.js
var require_LocalInfileRequestPacket = __commonJS((exports2, module2) => {
  module2.exports = LocalInfileRequestPacket;
  function LocalInfileRequestPacket(options) {
    options = options || {};
    this.filename = options.filename;
  }
  LocalInfileRequestPacket.prototype.parse = function parse(parser) {
    if (parser.parseLengthCodedNumber() !== null) {
      var err = new TypeError("Received invalid field length");
      err.code = "PARSER_INVALID_FIELD_LENGTH";
      throw err;
    }
    this.filename = parser.parsePacketTerminatedString();
  };
  LocalInfileRequestPacket.prototype.write = function write(writer) {
    writer.writeLengthCodedNumber(null);
    writer.writeString(this.filename);
  };
});

// node_modules/mysql/lib/protocol/packets/OkPacket.js
var require_OkPacket = __commonJS((exports2, module2) => {
  var ER_UPDATE_INFO_REGEXP = /^[^:0-9]+: [0-9]+[^:0-9]+: ([0-9]+)[^:0-9]+: [0-9]+[^:0-9]*$/;
  module2.exports = OkPacket;
  function OkPacket(options) {
    options = options || {};
    this.fieldCount = void 0;
    this.affectedRows = void 0;
    this.insertId = void 0;
    this.serverStatus = void 0;
    this.warningCount = void 0;
    this.message = void 0;
    this.protocol41 = options.protocol41;
  }
  OkPacket.prototype.parse = function(parser) {
    this.fieldCount = parser.parseUnsignedNumber(1);
    this.affectedRows = parser.parseLengthCodedNumber();
    this.insertId = parser.parseLengthCodedNumber();
    if (this.protocol41) {
      this.serverStatus = parser.parseUnsignedNumber(2);
      this.warningCount = parser.parseUnsignedNumber(2);
    }
    this.message = parser.parsePacketTerminatedString();
    this.changedRows = 0;
    var m = ER_UPDATE_INFO_REGEXP.exec(this.message);
    if (m !== null) {
      this.changedRows = parseInt(m[1], 10);
    }
  };
  OkPacket.prototype.write = function(writer) {
    writer.writeUnsignedNumber(1, 0);
    writer.writeLengthCodedNumber(this.affectedRows || 0);
    writer.writeLengthCodedNumber(this.insertId || 0);
    if (this.protocol41) {
      writer.writeUnsignedNumber(2, this.serverStatus || 0);
      writer.writeUnsignedNumber(2, this.warningCount || 0);
    }
    writer.writeString(this.message);
  };
});

// node_modules/mysql/lib/protocol/packets/OldPasswordPacket.js
var require_OldPasswordPacket = __commonJS((exports2, module2) => {
  module2.exports = OldPasswordPacket;
  function OldPasswordPacket(options) {
    options = options || {};
    this.scrambleBuff = options.scrambleBuff;
  }
  OldPasswordPacket.prototype.parse = function(parser) {
    this.scrambleBuff = parser.parsePacketTerminatedBuffer();
  };
  OldPasswordPacket.prototype.write = function(writer) {
    writer.writeBuffer(this.scrambleBuff);
  };
});

// node_modules/mysql/lib/protocol/packets/ResultSetHeaderPacket.js
var require_ResultSetHeaderPacket = __commonJS((exports2, module2) => {
  module2.exports = ResultSetHeaderPacket;
  function ResultSetHeaderPacket(options) {
    options = options || {};
    this.fieldCount = options.fieldCount;
  }
  ResultSetHeaderPacket.prototype.parse = function(parser) {
    this.fieldCount = parser.parseLengthCodedNumber();
  };
  ResultSetHeaderPacket.prototype.write = function(writer) {
    writer.writeLengthCodedNumber(this.fieldCount);
  };
});

// node_modules/mysql/lib/protocol/packets/RowDataPacket.js
var require_RowDataPacket = __commonJS((exports2, module2) => {
  var Types = require_types();
  var Charsets = require_charsets();
  var Field = require_Field();
  var IEEE_754_BINARY_64_PRECISION = Math.pow(2, 53);
  module2.exports = RowDataPacket;
  function RowDataPacket() {
  }
  Object.defineProperty(RowDataPacket.prototype, "parse", {
    configurable: true,
    enumerable: false,
    value: parse
  });
  Object.defineProperty(RowDataPacket.prototype, "_typeCast", {
    configurable: true,
    enumerable: false,
    value: typeCast
  });
  function parse(parser, fieldPackets, typeCast2, nestTables, connection) {
    var self2 = this;
    var next = function() {
      return self2._typeCast(fieldPacket, parser, connection.config.timezone, connection.config.supportBigNumbers, connection.config.bigNumberStrings, connection.config.dateStrings);
    };
    for (var i = 0; i < fieldPackets.length; i++) {
      var fieldPacket = fieldPackets[i];
      var value;
      if (typeof typeCast2 === "function") {
        value = typeCast2.apply(connection, [new Field({packet: fieldPacket, parser}), next]);
      } else {
        value = typeCast2 ? this._typeCast(fieldPacket, parser, connection.config.timezone, connection.config.supportBigNumbers, connection.config.bigNumberStrings, connection.config.dateStrings) : fieldPacket.charsetNr === Charsets.BINARY ? parser.parseLengthCodedBuffer() : parser.parseLengthCodedString();
      }
      if (typeof nestTables === "string" && nestTables.length) {
        this[fieldPacket.table + nestTables + fieldPacket.name] = value;
      } else if (nestTables) {
        this[fieldPacket.table] = this[fieldPacket.table] || {};
        this[fieldPacket.table][fieldPacket.name] = value;
      } else {
        this[fieldPacket.name] = value;
      }
    }
  }
  function typeCast(field, parser, timeZone, supportBigNumbers, bigNumberStrings, dateStrings) {
    var numberString;
    switch (field.type) {
      case Types.TIMESTAMP:
      case Types.TIMESTAMP2:
      case Types.DATE:
      case Types.DATETIME:
      case Types.DATETIME2:
      case Types.NEWDATE:
        var dateString = parser.parseLengthCodedString();
        if (typeMatch(field.type, dateStrings)) {
          return dateString;
        }
        if (dateString === null) {
          return null;
        }
        var originalString = dateString;
        if (field.type === Types.DATE) {
          dateString += " 00:00:00";
        }
        if (timeZone !== "local") {
          dateString += " " + timeZone;
        }
        var dt = new Date(dateString);
        if (isNaN(dt.getTime())) {
          return originalString;
        }
        return dt;
      case Types.TINY:
      case Types.SHORT:
      case Types.LONG:
      case Types.INT24:
      case Types.YEAR:
      case Types.FLOAT:
      case Types.DOUBLE:
        numberString = parser.parseLengthCodedString();
        return numberString === null || field.zeroFill && numberString[0] === "0" ? numberString : Number(numberString);
      case Types.NEWDECIMAL:
      case Types.LONGLONG:
        numberString = parser.parseLengthCodedString();
        return numberString === null || field.zeroFill && numberString[0] === "0" ? numberString : supportBigNumbers && (bigNumberStrings || Number(numberString) >= IEEE_754_BINARY_64_PRECISION || Number(numberString) <= -IEEE_754_BINARY_64_PRECISION) ? numberString : Number(numberString);
      case Types.BIT:
        return parser.parseLengthCodedBuffer();
      case Types.STRING:
      case Types.VAR_STRING:
      case Types.TINY_BLOB:
      case Types.MEDIUM_BLOB:
      case Types.LONG_BLOB:
      case Types.BLOB:
        return field.charsetNr === Charsets.BINARY ? parser.parseLengthCodedBuffer() : parser.parseLengthCodedString();
      case Types.GEOMETRY:
        return parser.parseGeometryValue();
      default:
        return parser.parseLengthCodedString();
    }
  }
  function typeMatch(type, list) {
    if (Array.isArray(list)) {
      return list.indexOf(Types[type]) !== -1;
    } else {
      return Boolean(list);
    }
  }
});

// node_modules/mysql/lib/protocol/packets/SSLRequestPacket.js
var require_SSLRequestPacket = __commonJS((exports2, module2) => {
  var ClientConstants = require_client();
  module2.exports = SSLRequestPacket;
  function SSLRequestPacket(options) {
    options = options || {};
    this.clientFlags = options.clientFlags | ClientConstants.CLIENT_SSL;
    this.maxPacketSize = options.maxPacketSize;
    this.charsetNumber = options.charsetNumber;
  }
  SSLRequestPacket.prototype.parse = function(parser) {
    this.clientFlags = parser.parseUnsignedNumber(4);
    this.maxPacketSize = parser.parseUnsignedNumber(4);
    this.charsetNumber = parser.parseUnsignedNumber(1);
  };
  SSLRequestPacket.prototype.write = function(writer) {
    writer.writeUnsignedNumber(4, this.clientFlags);
    writer.writeUnsignedNumber(4, this.maxPacketSize);
    writer.writeUnsignedNumber(1, this.charsetNumber);
    writer.writeFiller(23);
  };
});

// node_modules/mysql/lib/protocol/packets/StatisticsPacket.js
var require_StatisticsPacket = __commonJS((exports2, module2) => {
  module2.exports = StatisticsPacket;
  function StatisticsPacket() {
    this.message = void 0;
  }
  StatisticsPacket.prototype.parse = function(parser) {
    this.message = parser.parsePacketTerminatedString();
    var items = this.message.split(/\s\s/);
    for (var i = 0; i < items.length; i++) {
      var m = items[i].match(/^(.+)\:\s+(.+)$/);
      if (m !== null) {
        this[m[1].toLowerCase().replace(/\s/g, "_")] = Number(m[2]);
      }
    }
  };
  StatisticsPacket.prototype.write = function(writer) {
    writer.writeString(this.message);
  };
});

// node_modules/mysql/lib/protocol/packets/UseOldPasswordPacket.js
var require_UseOldPasswordPacket = __commonJS((exports2, module2) => {
  module2.exports = UseOldPasswordPacket;
  function UseOldPasswordPacket(options) {
    options = options || {};
    this.firstByte = options.firstByte || 254;
  }
  UseOldPasswordPacket.prototype.parse = function(parser) {
    this.firstByte = parser.parseUnsignedNumber(1);
  };
  UseOldPasswordPacket.prototype.write = function(writer) {
    writer.writeUnsignedNumber(1, this.firstByte);
  };
});

// node_modules/mysql/lib/protocol/packets/index.js
var require_packets = __commonJS((exports2) => {
  exports2.AuthSwitchRequestPacket = require_AuthSwitchRequestPacket();
  exports2.AuthSwitchResponsePacket = require_AuthSwitchResponsePacket();
  exports2.ClientAuthenticationPacket = require_ClientAuthenticationPacket();
  exports2.ComChangeUserPacket = require_ComChangeUserPacket();
  exports2.ComPingPacket = require_ComPingPacket();
  exports2.ComQueryPacket = require_ComQueryPacket();
  exports2.ComQuitPacket = require_ComQuitPacket();
  exports2.ComStatisticsPacket = require_ComStatisticsPacket();
  exports2.EmptyPacket = require_EmptyPacket();
  exports2.EofPacket = require_EofPacket();
  exports2.ErrorPacket = require_ErrorPacket();
  exports2.Field = require_Field();
  exports2.FieldPacket = require_FieldPacket();
  exports2.HandshakeInitializationPacket = require_HandshakeInitializationPacket();
  exports2.LocalDataFilePacket = require_LocalDataFilePacket();
  exports2.LocalInfileRequestPacket = require_LocalInfileRequestPacket();
  exports2.OkPacket = require_OkPacket();
  exports2.OldPasswordPacket = require_OldPasswordPacket();
  exports2.ResultSetHeaderPacket = require_ResultSetHeaderPacket();
  exports2.RowDataPacket = require_RowDataPacket();
  exports2.SSLRequestPacket = require_SSLRequestPacket();
  exports2.StatisticsPacket = require_StatisticsPacket();
  exports2.UseOldPasswordPacket = require_UseOldPasswordPacket();
});

// node_modules/mysql/lib/protocol/constants/errors.js
var require_errors = __commonJS((exports2) => {
  exports2.EE_CANTCREATEFILE = 1;
  exports2.EE_READ = 2;
  exports2.EE_WRITE = 3;
  exports2.EE_BADCLOSE = 4;
  exports2.EE_OUTOFMEMORY = 5;
  exports2.EE_DELETE = 6;
  exports2.EE_LINK = 7;
  exports2.EE_EOFERR = 9;
  exports2.EE_CANTLOCK = 10;
  exports2.EE_CANTUNLOCK = 11;
  exports2.EE_DIR = 12;
  exports2.EE_STAT = 13;
  exports2.EE_CANT_CHSIZE = 14;
  exports2.EE_CANT_OPEN_STREAM = 15;
  exports2.EE_GETWD = 16;
  exports2.EE_SETWD = 17;
  exports2.EE_LINK_WARNING = 18;
  exports2.EE_OPEN_WARNING = 19;
  exports2.EE_DISK_FULL = 20;
  exports2.EE_CANT_MKDIR = 21;
  exports2.EE_UNKNOWN_CHARSET = 22;
  exports2.EE_OUT_OF_FILERESOURCES = 23;
  exports2.EE_CANT_READLINK = 24;
  exports2.EE_CANT_SYMLINK = 25;
  exports2.EE_REALPATH = 26;
  exports2.EE_SYNC = 27;
  exports2.EE_UNKNOWN_COLLATION = 28;
  exports2.EE_FILENOTFOUND = 29;
  exports2.EE_FILE_NOT_CLOSED = 30;
  exports2.EE_CHANGE_OWNERSHIP = 31;
  exports2.EE_CHANGE_PERMISSIONS = 32;
  exports2.EE_CANT_SEEK = 33;
  exports2.EE_CAPACITY_EXCEEDED = 34;
  exports2.HA_ERR_KEY_NOT_FOUND = 120;
  exports2.HA_ERR_FOUND_DUPP_KEY = 121;
  exports2.HA_ERR_INTERNAL_ERROR = 122;
  exports2.HA_ERR_RECORD_CHANGED = 123;
  exports2.HA_ERR_WRONG_INDEX = 124;
  exports2.HA_ERR_CRASHED = 126;
  exports2.HA_ERR_WRONG_IN_RECORD = 127;
  exports2.HA_ERR_OUT_OF_MEM = 128;
  exports2.HA_ERR_NOT_A_TABLE = 130;
  exports2.HA_ERR_WRONG_COMMAND = 131;
  exports2.HA_ERR_OLD_FILE = 132;
  exports2.HA_ERR_NO_ACTIVE_RECORD = 133;
  exports2.HA_ERR_RECORD_DELETED = 134;
  exports2.HA_ERR_RECORD_FILE_FULL = 135;
  exports2.HA_ERR_INDEX_FILE_FULL = 136;
  exports2.HA_ERR_END_OF_FILE = 137;
  exports2.HA_ERR_UNSUPPORTED = 138;
  exports2.HA_ERR_TOO_BIG_ROW = 139;
  exports2.HA_WRONG_CREATE_OPTION = 140;
  exports2.HA_ERR_FOUND_DUPP_UNIQUE = 141;
  exports2.HA_ERR_UNKNOWN_CHARSET = 142;
  exports2.HA_ERR_WRONG_MRG_TABLE_DEF = 143;
  exports2.HA_ERR_CRASHED_ON_REPAIR = 144;
  exports2.HA_ERR_CRASHED_ON_USAGE = 145;
  exports2.HA_ERR_LOCK_WAIT_TIMEOUT = 146;
  exports2.HA_ERR_LOCK_TABLE_FULL = 147;
  exports2.HA_ERR_READ_ONLY_TRANSACTION = 148;
  exports2.HA_ERR_LOCK_DEADLOCK = 149;
  exports2.HA_ERR_CANNOT_ADD_FOREIGN = 150;
  exports2.HA_ERR_NO_REFERENCED_ROW = 151;
  exports2.HA_ERR_ROW_IS_REFERENCED = 152;
  exports2.HA_ERR_NO_SAVEPOINT = 153;
  exports2.HA_ERR_NON_UNIQUE_BLOCK_SIZE = 154;
  exports2.HA_ERR_NO_SUCH_TABLE = 155;
  exports2.HA_ERR_TABLE_EXIST = 156;
  exports2.HA_ERR_NO_CONNECTION = 157;
  exports2.HA_ERR_NULL_IN_SPATIAL = 158;
  exports2.HA_ERR_TABLE_DEF_CHANGED = 159;
  exports2.HA_ERR_NO_PARTITION_FOUND = 160;
  exports2.HA_ERR_RBR_LOGGING_FAILED = 161;
  exports2.HA_ERR_DROP_INDEX_FK = 162;
  exports2.HA_ERR_FOREIGN_DUPLICATE_KEY = 163;
  exports2.HA_ERR_TABLE_NEEDS_UPGRADE = 164;
  exports2.HA_ERR_TABLE_READONLY = 165;
  exports2.HA_ERR_AUTOINC_READ_FAILED = 166;
  exports2.HA_ERR_AUTOINC_ERANGE = 167;
  exports2.HA_ERR_GENERIC = 168;
  exports2.HA_ERR_RECORD_IS_THE_SAME = 169;
  exports2.HA_ERR_LOGGING_IMPOSSIBLE = 170;
  exports2.HA_ERR_CORRUPT_EVENT = 171;
  exports2.HA_ERR_NEW_FILE = 172;
  exports2.HA_ERR_ROWS_EVENT_APPLY = 173;
  exports2.HA_ERR_INITIALIZATION = 174;
  exports2.HA_ERR_FILE_TOO_SHORT = 175;
  exports2.HA_ERR_WRONG_CRC = 176;
  exports2.HA_ERR_TOO_MANY_CONCURRENT_TRXS = 177;
  exports2.HA_ERR_NOT_IN_LOCK_PARTITIONS = 178;
  exports2.HA_ERR_INDEX_COL_TOO_LONG = 179;
  exports2.HA_ERR_INDEX_CORRUPT = 180;
  exports2.HA_ERR_UNDO_REC_TOO_BIG = 181;
  exports2.HA_FTS_INVALID_DOCID = 182;
  exports2.HA_ERR_TABLE_IN_FK_CHECK = 183;
  exports2.HA_ERR_TABLESPACE_EXISTS = 184;
  exports2.HA_ERR_TOO_MANY_FIELDS = 185;
  exports2.HA_ERR_ROW_IN_WRONG_PARTITION = 186;
  exports2.HA_ERR_INNODB_READ_ONLY = 187;
  exports2.HA_ERR_FTS_EXCEED_RESULT_CACHE_LIMIT = 188;
  exports2.HA_ERR_TEMP_FILE_WRITE_FAILURE = 189;
  exports2.HA_ERR_INNODB_FORCED_RECOVERY = 190;
  exports2.HA_ERR_FTS_TOO_MANY_WORDS_IN_PHRASE = 191;
  exports2.HA_ERR_FK_DEPTH_EXCEEDED = 192;
  exports2.HA_MISSING_CREATE_OPTION = 193;
  exports2.HA_ERR_SE_OUT_OF_MEMORY = 194;
  exports2.HA_ERR_TABLE_CORRUPT = 195;
  exports2.HA_ERR_QUERY_INTERRUPTED = 196;
  exports2.HA_ERR_TABLESPACE_MISSING = 197;
  exports2.HA_ERR_TABLESPACE_IS_NOT_EMPTY = 198;
  exports2.HA_ERR_WRONG_FILE_NAME = 199;
  exports2.HA_ERR_NOT_ALLOWED_COMMAND = 200;
  exports2.HA_ERR_COMPUTE_FAILED = 201;
  exports2.ER_HASHCHK = 1e3;
  exports2.ER_NISAMCHK = 1001;
  exports2.ER_NO = 1002;
  exports2.ER_YES = 1003;
  exports2.ER_CANT_CREATE_FILE = 1004;
  exports2.ER_CANT_CREATE_TABLE = 1005;
  exports2.ER_CANT_CREATE_DB = 1006;
  exports2.ER_DB_CREATE_EXISTS = 1007;
  exports2.ER_DB_DROP_EXISTS = 1008;
  exports2.ER_DB_DROP_DELETE = 1009;
  exports2.ER_DB_DROP_RMDIR = 1010;
  exports2.ER_CANT_DELETE_FILE = 1011;
  exports2.ER_CANT_FIND_SYSTEM_REC = 1012;
  exports2.ER_CANT_GET_STAT = 1013;
  exports2.ER_CANT_GET_WD = 1014;
  exports2.ER_CANT_LOCK = 1015;
  exports2.ER_CANT_OPEN_FILE = 1016;
  exports2.ER_FILE_NOT_FOUND = 1017;
  exports2.ER_CANT_READ_DIR = 1018;
  exports2.ER_CANT_SET_WD = 1019;
  exports2.ER_CHECKREAD = 1020;
  exports2.ER_DISK_FULL = 1021;
  exports2.ER_DUP_KEY = 1022;
  exports2.ER_ERROR_ON_CLOSE = 1023;
  exports2.ER_ERROR_ON_READ = 1024;
  exports2.ER_ERROR_ON_RENAME = 1025;
  exports2.ER_ERROR_ON_WRITE = 1026;
  exports2.ER_FILE_USED = 1027;
  exports2.ER_FILSORT_ABORT = 1028;
  exports2.ER_FORM_NOT_FOUND = 1029;
  exports2.ER_GET_ERRNO = 1030;
  exports2.ER_ILLEGAL_HA = 1031;
  exports2.ER_KEY_NOT_FOUND = 1032;
  exports2.ER_NOT_FORM_FILE = 1033;
  exports2.ER_NOT_KEYFILE = 1034;
  exports2.ER_OLD_KEYFILE = 1035;
  exports2.ER_OPEN_AS_READONLY = 1036;
  exports2.ER_OUTOFMEMORY = 1037;
  exports2.ER_OUT_OF_SORTMEMORY = 1038;
  exports2.ER_UNEXPECTED_EOF = 1039;
  exports2.ER_CON_COUNT_ERROR = 1040;
  exports2.ER_OUT_OF_RESOURCES = 1041;
  exports2.ER_BAD_HOST_ERROR = 1042;
  exports2.ER_HANDSHAKE_ERROR = 1043;
  exports2.ER_DBACCESS_DENIED_ERROR = 1044;
  exports2.ER_ACCESS_DENIED_ERROR = 1045;
  exports2.ER_NO_DB_ERROR = 1046;
  exports2.ER_UNKNOWN_COM_ERROR = 1047;
  exports2.ER_BAD_NULL_ERROR = 1048;
  exports2.ER_BAD_DB_ERROR = 1049;
  exports2.ER_TABLE_EXISTS_ERROR = 1050;
  exports2.ER_BAD_TABLE_ERROR = 1051;
  exports2.ER_NON_UNIQ_ERROR = 1052;
  exports2.ER_SERVER_SHUTDOWN = 1053;
  exports2.ER_BAD_FIELD_ERROR = 1054;
  exports2.ER_WRONG_FIELD_WITH_GROUP = 1055;
  exports2.ER_WRONG_GROUP_FIELD = 1056;
  exports2.ER_WRONG_SUM_SELECT = 1057;
  exports2.ER_WRONG_VALUE_COUNT = 1058;
  exports2.ER_TOO_LONG_IDENT = 1059;
  exports2.ER_DUP_FIELDNAME = 1060;
  exports2.ER_DUP_KEYNAME = 1061;
  exports2.ER_DUP_ENTRY = 1062;
  exports2.ER_WRONG_FIELD_SPEC = 1063;
  exports2.ER_PARSE_ERROR = 1064;
  exports2.ER_EMPTY_QUERY = 1065;
  exports2.ER_NONUNIQ_TABLE = 1066;
  exports2.ER_INVALID_DEFAULT = 1067;
  exports2.ER_MULTIPLE_PRI_KEY = 1068;
  exports2.ER_TOO_MANY_KEYS = 1069;
  exports2.ER_TOO_MANY_KEY_PARTS = 1070;
  exports2.ER_TOO_LONG_KEY = 1071;
  exports2.ER_KEY_COLUMN_DOES_NOT_EXITS = 1072;
  exports2.ER_BLOB_USED_AS_KEY = 1073;
  exports2.ER_TOO_BIG_FIELDLENGTH = 1074;
  exports2.ER_WRONG_AUTO_KEY = 1075;
  exports2.ER_READY = 1076;
  exports2.ER_NORMAL_SHUTDOWN = 1077;
  exports2.ER_GOT_SIGNAL = 1078;
  exports2.ER_SHUTDOWN_COMPLETE = 1079;
  exports2.ER_FORCING_CLOSE = 1080;
  exports2.ER_IPSOCK_ERROR = 1081;
  exports2.ER_NO_SUCH_INDEX = 1082;
  exports2.ER_WRONG_FIELD_TERMINATORS = 1083;
  exports2.ER_BLOBS_AND_NO_TERMINATED = 1084;
  exports2.ER_TEXTFILE_NOT_READABLE = 1085;
  exports2.ER_FILE_EXISTS_ERROR = 1086;
  exports2.ER_LOAD_INFO = 1087;
  exports2.ER_ALTER_INFO = 1088;
  exports2.ER_WRONG_SUB_KEY = 1089;
  exports2.ER_CANT_REMOVE_ALL_FIELDS = 1090;
  exports2.ER_CANT_DROP_FIELD_OR_KEY = 1091;
  exports2.ER_INSERT_INFO = 1092;
  exports2.ER_UPDATE_TABLE_USED = 1093;
  exports2.ER_NO_SUCH_THREAD = 1094;
  exports2.ER_KILL_DENIED_ERROR = 1095;
  exports2.ER_NO_TABLES_USED = 1096;
  exports2.ER_TOO_BIG_SET = 1097;
  exports2.ER_NO_UNIQUE_LOGFILE = 1098;
  exports2.ER_TABLE_NOT_LOCKED_FOR_WRITE = 1099;
  exports2.ER_TABLE_NOT_LOCKED = 1100;
  exports2.ER_BLOB_CANT_HAVE_DEFAULT = 1101;
  exports2.ER_WRONG_DB_NAME = 1102;
  exports2.ER_WRONG_TABLE_NAME = 1103;
  exports2.ER_TOO_BIG_SELECT = 1104;
  exports2.ER_UNKNOWN_ERROR = 1105;
  exports2.ER_UNKNOWN_PROCEDURE = 1106;
  exports2.ER_WRONG_PARAMCOUNT_TO_PROCEDURE = 1107;
  exports2.ER_WRONG_PARAMETERS_TO_PROCEDURE = 1108;
  exports2.ER_UNKNOWN_TABLE = 1109;
  exports2.ER_FIELD_SPECIFIED_TWICE = 1110;
  exports2.ER_INVALID_GROUP_FUNC_USE = 1111;
  exports2.ER_UNSUPPORTED_EXTENSION = 1112;
  exports2.ER_TABLE_MUST_HAVE_COLUMNS = 1113;
  exports2.ER_RECORD_FILE_FULL = 1114;
  exports2.ER_UNKNOWN_CHARACTER_SET = 1115;
  exports2.ER_TOO_MANY_TABLES = 1116;
  exports2.ER_TOO_MANY_FIELDS = 1117;
  exports2.ER_TOO_BIG_ROWSIZE = 1118;
  exports2.ER_STACK_OVERRUN = 1119;
  exports2.ER_WRONG_OUTER_JOIN = 1120;
  exports2.ER_NULL_COLUMN_IN_INDEX = 1121;
  exports2.ER_CANT_FIND_UDF = 1122;
  exports2.ER_CANT_INITIALIZE_UDF = 1123;
  exports2.ER_UDF_NO_PATHS = 1124;
  exports2.ER_UDF_EXISTS = 1125;
  exports2.ER_CANT_OPEN_LIBRARY = 1126;
  exports2.ER_CANT_FIND_DL_ENTRY = 1127;
  exports2.ER_FUNCTION_NOT_DEFINED = 1128;
  exports2.ER_HOST_IS_BLOCKED = 1129;
  exports2.ER_HOST_NOT_PRIVILEGED = 1130;
  exports2.ER_PASSWORD_ANONYMOUS_USER = 1131;
  exports2.ER_PASSWORD_NOT_ALLOWED = 1132;
  exports2.ER_PASSWORD_NO_MATCH = 1133;
  exports2.ER_UPDATE_INFO = 1134;
  exports2.ER_CANT_CREATE_THREAD = 1135;
  exports2.ER_WRONG_VALUE_COUNT_ON_ROW = 1136;
  exports2.ER_CANT_REOPEN_TABLE = 1137;
  exports2.ER_INVALID_USE_OF_NULL = 1138;
  exports2.ER_REGEXP_ERROR = 1139;
  exports2.ER_MIX_OF_GROUP_FUNC_AND_FIELDS = 1140;
  exports2.ER_NONEXISTING_GRANT = 1141;
  exports2.ER_TABLEACCESS_DENIED_ERROR = 1142;
  exports2.ER_COLUMNACCESS_DENIED_ERROR = 1143;
  exports2.ER_ILLEGAL_GRANT_FOR_TABLE = 1144;
  exports2.ER_GRANT_WRONG_HOST_OR_USER = 1145;
  exports2.ER_NO_SUCH_TABLE = 1146;
  exports2.ER_NONEXISTING_TABLE_GRANT = 1147;
  exports2.ER_NOT_ALLOWED_COMMAND = 1148;
  exports2.ER_SYNTAX_ERROR = 1149;
  exports2.ER_DELAYED_CANT_CHANGE_LOCK = 1150;
  exports2.ER_TOO_MANY_DELAYED_THREADS = 1151;
  exports2.ER_ABORTING_CONNECTION = 1152;
  exports2.ER_NET_PACKET_TOO_LARGE = 1153;
  exports2.ER_NET_READ_ERROR_FROM_PIPE = 1154;
  exports2.ER_NET_FCNTL_ERROR = 1155;
  exports2.ER_NET_PACKETS_OUT_OF_ORDER = 1156;
  exports2.ER_NET_UNCOMPRESS_ERROR = 1157;
  exports2.ER_NET_READ_ERROR = 1158;
  exports2.ER_NET_READ_INTERRUPTED = 1159;
  exports2.ER_NET_ERROR_ON_WRITE = 1160;
  exports2.ER_NET_WRITE_INTERRUPTED = 1161;
  exports2.ER_TOO_LONG_STRING = 1162;
  exports2.ER_TABLE_CANT_HANDLE_BLOB = 1163;
  exports2.ER_TABLE_CANT_HANDLE_AUTO_INCREMENT = 1164;
  exports2.ER_DELAYED_INSERT_TABLE_LOCKED = 1165;
  exports2.ER_WRONG_COLUMN_NAME = 1166;
  exports2.ER_WRONG_KEY_COLUMN = 1167;
  exports2.ER_WRONG_MRG_TABLE = 1168;
  exports2.ER_DUP_UNIQUE = 1169;
  exports2.ER_BLOB_KEY_WITHOUT_LENGTH = 1170;
  exports2.ER_PRIMARY_CANT_HAVE_NULL = 1171;
  exports2.ER_TOO_MANY_ROWS = 1172;
  exports2.ER_REQUIRES_PRIMARY_KEY = 1173;
  exports2.ER_NO_RAID_COMPILED = 1174;
  exports2.ER_UPDATE_WITHOUT_KEY_IN_SAFE_MODE = 1175;
  exports2.ER_KEY_DOES_NOT_EXITS = 1176;
  exports2.ER_CHECK_NO_SUCH_TABLE = 1177;
  exports2.ER_CHECK_NOT_IMPLEMENTED = 1178;
  exports2.ER_CANT_DO_THIS_DURING_AN_TRANSACTION = 1179;
  exports2.ER_ERROR_DURING_COMMIT = 1180;
  exports2.ER_ERROR_DURING_ROLLBACK = 1181;
  exports2.ER_ERROR_DURING_FLUSH_LOGS = 1182;
  exports2.ER_ERROR_DURING_CHECKPOINT = 1183;
  exports2.ER_NEW_ABORTING_CONNECTION = 1184;
  exports2.ER_DUMP_NOT_IMPLEMENTED = 1185;
  exports2.ER_FLUSH_MASTER_BINLOG_CLOSED = 1186;
  exports2.ER_INDEX_REBUILD = 1187;
  exports2.ER_MASTER = 1188;
  exports2.ER_MASTER_NET_READ = 1189;
  exports2.ER_MASTER_NET_WRITE = 1190;
  exports2.ER_FT_MATCHING_KEY_NOT_FOUND = 1191;
  exports2.ER_LOCK_OR_ACTIVE_TRANSACTION = 1192;
  exports2.ER_UNKNOWN_SYSTEM_VARIABLE = 1193;
  exports2.ER_CRASHED_ON_USAGE = 1194;
  exports2.ER_CRASHED_ON_REPAIR = 1195;
  exports2.ER_WARNING_NOT_COMPLETE_ROLLBACK = 1196;
  exports2.ER_TRANS_CACHE_FULL = 1197;
  exports2.ER_SLAVE_MUST_STOP = 1198;
  exports2.ER_SLAVE_NOT_RUNNING = 1199;
  exports2.ER_BAD_SLAVE = 1200;
  exports2.ER_MASTER_INFO = 1201;
  exports2.ER_SLAVE_THREAD = 1202;
  exports2.ER_TOO_MANY_USER_CONNECTIONS = 1203;
  exports2.ER_SET_CONSTANTS_ONLY = 1204;
  exports2.ER_LOCK_WAIT_TIMEOUT = 1205;
  exports2.ER_LOCK_TABLE_FULL = 1206;
  exports2.ER_READ_ONLY_TRANSACTION = 1207;
  exports2.ER_DROP_DB_WITH_READ_LOCK = 1208;
  exports2.ER_CREATE_DB_WITH_READ_LOCK = 1209;
  exports2.ER_WRONG_ARGUMENTS = 1210;
  exports2.ER_NO_PERMISSION_TO_CREATE_USER = 1211;
  exports2.ER_UNION_TABLES_IN_DIFFERENT_DIR = 1212;
  exports2.ER_LOCK_DEADLOCK = 1213;
  exports2.ER_TABLE_CANT_HANDLE_FT = 1214;
  exports2.ER_CANNOT_ADD_FOREIGN = 1215;
  exports2.ER_NO_REFERENCED_ROW = 1216;
  exports2.ER_ROW_IS_REFERENCED = 1217;
  exports2.ER_CONNECT_TO_MASTER = 1218;
  exports2.ER_QUERY_ON_MASTER = 1219;
  exports2.ER_ERROR_WHEN_EXECUTING_COMMAND = 1220;
  exports2.ER_WRONG_USAGE = 1221;
  exports2.ER_WRONG_NUMBER_OF_COLUMNS_IN_SELECT = 1222;
  exports2.ER_CANT_UPDATE_WITH_READLOCK = 1223;
  exports2.ER_MIXING_NOT_ALLOWED = 1224;
  exports2.ER_DUP_ARGUMENT = 1225;
  exports2.ER_USER_LIMIT_REACHED = 1226;
  exports2.ER_SPECIFIC_ACCESS_DENIED_ERROR = 1227;
  exports2.ER_LOCAL_VARIABLE = 1228;
  exports2.ER_GLOBAL_VARIABLE = 1229;
  exports2.ER_NO_DEFAULT = 1230;
  exports2.ER_WRONG_VALUE_FOR_VAR = 1231;
  exports2.ER_WRONG_TYPE_FOR_VAR = 1232;
  exports2.ER_VAR_CANT_BE_READ = 1233;
  exports2.ER_CANT_USE_OPTION_HERE = 1234;
  exports2.ER_NOT_SUPPORTED_YET = 1235;
  exports2.ER_MASTER_FATAL_ERROR_READING_BINLOG = 1236;
  exports2.ER_SLAVE_IGNORED_TABLE = 1237;
  exports2.ER_INCORRECT_GLOBAL_LOCAL_VAR = 1238;
  exports2.ER_WRONG_FK_DEF = 1239;
  exports2.ER_KEY_REF_DO_NOT_MATCH_TABLE_REF = 1240;
  exports2.ER_OPERAND_COLUMNS = 1241;
  exports2.ER_SUBQUERY_NO_1_ROW = 1242;
  exports2.ER_UNKNOWN_STMT_HANDLER = 1243;
  exports2.ER_CORRUPT_HELP_DB = 1244;
  exports2.ER_CYCLIC_REFERENCE = 1245;
  exports2.ER_AUTO_CONVERT = 1246;
  exports2.ER_ILLEGAL_REFERENCE = 1247;
  exports2.ER_DERIVED_MUST_HAVE_ALIAS = 1248;
  exports2.ER_SELECT_REDUCED = 1249;
  exports2.ER_TABLENAME_NOT_ALLOWED_HERE = 1250;
  exports2.ER_NOT_SUPPORTED_AUTH_MODE = 1251;
  exports2.ER_SPATIAL_CANT_HAVE_NULL = 1252;
  exports2.ER_COLLATION_CHARSET_MISMATCH = 1253;
  exports2.ER_SLAVE_WAS_RUNNING = 1254;
  exports2.ER_SLAVE_WAS_NOT_RUNNING = 1255;
  exports2.ER_TOO_BIG_FOR_UNCOMPRESS = 1256;
  exports2.ER_ZLIB_Z_MEM_ERROR = 1257;
  exports2.ER_ZLIB_Z_BUF_ERROR = 1258;
  exports2.ER_ZLIB_Z_DATA_ERROR = 1259;
  exports2.ER_CUT_VALUE_GROUP_CONCAT = 1260;
  exports2.ER_WARN_TOO_FEW_RECORDS = 1261;
  exports2.ER_WARN_TOO_MANY_RECORDS = 1262;
  exports2.ER_WARN_NULL_TO_NOTNULL = 1263;
  exports2.ER_WARN_DATA_OUT_OF_RANGE = 1264;
  exports2.WARN_DATA_TRUNCATED = 1265;
  exports2.ER_WARN_USING_OTHER_HANDLER = 1266;
  exports2.ER_CANT_AGGREGATE_2COLLATIONS = 1267;
  exports2.ER_DROP_USER = 1268;
  exports2.ER_REVOKE_GRANTS = 1269;
  exports2.ER_CANT_AGGREGATE_3COLLATIONS = 1270;
  exports2.ER_CANT_AGGREGATE_NCOLLATIONS = 1271;
  exports2.ER_VARIABLE_IS_NOT_STRUCT = 1272;
  exports2.ER_UNKNOWN_COLLATION = 1273;
  exports2.ER_SLAVE_IGNORED_SSL_PARAMS = 1274;
  exports2.ER_SERVER_IS_IN_SECURE_AUTH_MODE = 1275;
  exports2.ER_WARN_FIELD_RESOLVED = 1276;
  exports2.ER_BAD_SLAVE_UNTIL_COND = 1277;
  exports2.ER_MISSING_SKIP_SLAVE = 1278;
  exports2.ER_UNTIL_COND_IGNORED = 1279;
  exports2.ER_WRONG_NAME_FOR_INDEX = 1280;
  exports2.ER_WRONG_NAME_FOR_CATALOG = 1281;
  exports2.ER_WARN_QC_RESIZE = 1282;
  exports2.ER_BAD_FT_COLUMN = 1283;
  exports2.ER_UNKNOWN_KEY_CACHE = 1284;
  exports2.ER_WARN_HOSTNAME_WONT_WORK = 1285;
  exports2.ER_UNKNOWN_STORAGE_ENGINE = 1286;
  exports2.ER_WARN_DEPRECATED_SYNTAX = 1287;
  exports2.ER_NON_UPDATABLE_TABLE = 1288;
  exports2.ER_FEATURE_DISABLED = 1289;
  exports2.ER_OPTION_PREVENTS_STATEMENT = 1290;
  exports2.ER_DUPLICATED_VALUE_IN_TYPE = 1291;
  exports2.ER_TRUNCATED_WRONG_VALUE = 1292;
  exports2.ER_TOO_MUCH_AUTO_TIMESTAMP_COLS = 1293;
  exports2.ER_INVALID_ON_UPDATE = 1294;
  exports2.ER_UNSUPPORTED_PS = 1295;
  exports2.ER_GET_ERRMSG = 1296;
  exports2.ER_GET_TEMPORARY_ERRMSG = 1297;
  exports2.ER_UNKNOWN_TIME_ZONE = 1298;
  exports2.ER_WARN_INVALID_TIMESTAMP = 1299;
  exports2.ER_INVALID_CHARACTER_STRING = 1300;
  exports2.ER_WARN_ALLOWED_PACKET_OVERFLOWED = 1301;
  exports2.ER_CONFLICTING_DECLARATIONS = 1302;
  exports2.ER_SP_NO_RECURSIVE_CREATE = 1303;
  exports2.ER_SP_ALREADY_EXISTS = 1304;
  exports2.ER_SP_DOES_NOT_EXIST = 1305;
  exports2.ER_SP_DROP_FAILED = 1306;
  exports2.ER_SP_STORE_FAILED = 1307;
  exports2.ER_SP_LILABEL_MISMATCH = 1308;
  exports2.ER_SP_LABEL_REDEFINE = 1309;
  exports2.ER_SP_LABEL_MISMATCH = 1310;
  exports2.ER_SP_UNINIT_VAR = 1311;
  exports2.ER_SP_BADSELECT = 1312;
  exports2.ER_SP_BADRETURN = 1313;
  exports2.ER_SP_BADSTATEMENT = 1314;
  exports2.ER_UPDATE_LOG_DEPRECATED_IGNORED = 1315;
  exports2.ER_UPDATE_LOG_DEPRECATED_TRANSLATED = 1316;
  exports2.ER_QUERY_INTERRUPTED = 1317;
  exports2.ER_SP_WRONG_NO_OF_ARGS = 1318;
  exports2.ER_SP_COND_MISMATCH = 1319;
  exports2.ER_SP_NORETURN = 1320;
  exports2.ER_SP_NORETURNEND = 1321;
  exports2.ER_SP_BAD_CURSOR_QUERY = 1322;
  exports2.ER_SP_BAD_CURSOR_SELECT = 1323;
  exports2.ER_SP_CURSOR_MISMATCH = 1324;
  exports2.ER_SP_CURSOR_ALREADY_OPEN = 1325;
  exports2.ER_SP_CURSOR_NOT_OPEN = 1326;
  exports2.ER_SP_UNDECLARED_VAR = 1327;
  exports2.ER_SP_WRONG_NO_OF_FETCH_ARGS = 1328;
  exports2.ER_SP_FETCH_NO_DATA = 1329;
  exports2.ER_SP_DUP_PARAM = 1330;
  exports2.ER_SP_DUP_VAR = 1331;
  exports2.ER_SP_DUP_COND = 1332;
  exports2.ER_SP_DUP_CURS = 1333;
  exports2.ER_SP_CANT_ALTER = 1334;
  exports2.ER_SP_SUBSELECT_NYI = 1335;
  exports2.ER_STMT_NOT_ALLOWED_IN_SF_OR_TRG = 1336;
  exports2.ER_SP_VARCOND_AFTER_CURSHNDLR = 1337;
  exports2.ER_SP_CURSOR_AFTER_HANDLER = 1338;
  exports2.ER_SP_CASE_NOT_FOUND = 1339;
  exports2.ER_FPARSER_TOO_BIG_FILE = 1340;
  exports2.ER_FPARSER_BAD_HEADER = 1341;
  exports2.ER_FPARSER_EOF_IN_COMMENT = 1342;
  exports2.ER_FPARSER_ERROR_IN_PARAMETER = 1343;
  exports2.ER_FPARSER_EOF_IN_UNKNOWN_PARAMETER = 1344;
  exports2.ER_VIEW_NO_EXPLAIN = 1345;
  exports2.ER_FRM_UNKNOWN_TYPE = 1346;
  exports2.ER_WRONG_OBJECT = 1347;
  exports2.ER_NONUPDATEABLE_COLUMN = 1348;
  exports2.ER_VIEW_SELECT_DERIVED = 1349;
  exports2.ER_VIEW_SELECT_CLAUSE = 1350;
  exports2.ER_VIEW_SELECT_VARIABLE = 1351;
  exports2.ER_VIEW_SELECT_TMPTABLE = 1352;
  exports2.ER_VIEW_WRONG_LIST = 1353;
  exports2.ER_WARN_VIEW_MERGE = 1354;
  exports2.ER_WARN_VIEW_WITHOUT_KEY = 1355;
  exports2.ER_VIEW_INVALID = 1356;
  exports2.ER_SP_NO_DROP_SP = 1357;
  exports2.ER_SP_GOTO_IN_HNDLR = 1358;
  exports2.ER_TRG_ALREADY_EXISTS = 1359;
  exports2.ER_TRG_DOES_NOT_EXIST = 1360;
  exports2.ER_TRG_ON_VIEW_OR_TEMP_TABLE = 1361;
  exports2.ER_TRG_CANT_CHANGE_ROW = 1362;
  exports2.ER_TRG_NO_SUCH_ROW_IN_TRG = 1363;
  exports2.ER_NO_DEFAULT_FOR_FIELD = 1364;
  exports2.ER_DIVISION_BY_ZERO = 1365;
  exports2.ER_TRUNCATED_WRONG_VALUE_FOR_FIELD = 1366;
  exports2.ER_ILLEGAL_VALUE_FOR_TYPE = 1367;
  exports2.ER_VIEW_NONUPD_CHECK = 1368;
  exports2.ER_VIEW_CHECK_FAILED = 1369;
  exports2.ER_PROCACCESS_DENIED_ERROR = 1370;
  exports2.ER_RELAY_LOG_FAIL = 1371;
  exports2.ER_PASSWD_LENGTH = 1372;
  exports2.ER_UNKNOWN_TARGET_BINLOG = 1373;
  exports2.ER_IO_ERR_LOG_INDEX_READ = 1374;
  exports2.ER_BINLOG_PURGE_PROHIBITED = 1375;
  exports2.ER_FSEEK_FAIL = 1376;
  exports2.ER_BINLOG_PURGE_FATAL_ERR = 1377;
  exports2.ER_LOG_IN_USE = 1378;
  exports2.ER_LOG_PURGE_UNKNOWN_ERR = 1379;
  exports2.ER_RELAY_LOG_INIT = 1380;
  exports2.ER_NO_BINARY_LOGGING = 1381;
  exports2.ER_RESERVED_SYNTAX = 1382;
  exports2.ER_WSAS_FAILED = 1383;
  exports2.ER_DIFF_GROUPS_PROC = 1384;
  exports2.ER_NO_GROUP_FOR_PROC = 1385;
  exports2.ER_ORDER_WITH_PROC = 1386;
  exports2.ER_LOGGING_PROHIBIT_CHANGING_OF = 1387;
  exports2.ER_NO_FILE_MAPPING = 1388;
  exports2.ER_WRONG_MAGIC = 1389;
  exports2.ER_PS_MANY_PARAM = 1390;
  exports2.ER_KEY_PART_0 = 1391;
  exports2.ER_VIEW_CHECKSUM = 1392;
  exports2.ER_VIEW_MULTIUPDATE = 1393;
  exports2.ER_VIEW_NO_INSERT_FIELD_LIST = 1394;
  exports2.ER_VIEW_DELETE_MERGE_VIEW = 1395;
  exports2.ER_CANNOT_USER = 1396;
  exports2.ER_XAER_NOTA = 1397;
  exports2.ER_XAER_INVAL = 1398;
  exports2.ER_XAER_RMFAIL = 1399;
  exports2.ER_XAER_OUTSIDE = 1400;
  exports2.ER_XAER_RMERR = 1401;
  exports2.ER_XA_RBROLLBACK = 1402;
  exports2.ER_NONEXISTING_PROC_GRANT = 1403;
  exports2.ER_PROC_AUTO_GRANT_FAIL = 1404;
  exports2.ER_PROC_AUTO_REVOKE_FAIL = 1405;
  exports2.ER_DATA_TOO_LONG = 1406;
  exports2.ER_SP_BAD_SQLSTATE = 1407;
  exports2.ER_STARTUP = 1408;
  exports2.ER_LOAD_FROM_FIXED_SIZE_ROWS_TO_VAR = 1409;
  exports2.ER_CANT_CREATE_USER_WITH_GRANT = 1410;
  exports2.ER_WRONG_VALUE_FOR_TYPE = 1411;
  exports2.ER_TABLE_DEF_CHANGED = 1412;
  exports2.ER_SP_DUP_HANDLER = 1413;
  exports2.ER_SP_NOT_VAR_ARG = 1414;
  exports2.ER_SP_NO_RETSET = 1415;
  exports2.ER_CANT_CREATE_GEOMETRY_OBJECT = 1416;
  exports2.ER_FAILED_ROUTINE_BREAK_BINLOG = 1417;
  exports2.ER_BINLOG_UNSAFE_ROUTINE = 1418;
  exports2.ER_BINLOG_CREATE_ROUTINE_NEED_SUPER = 1419;
  exports2.ER_EXEC_STMT_WITH_OPEN_CURSOR = 1420;
  exports2.ER_STMT_HAS_NO_OPEN_CURSOR = 1421;
  exports2.ER_COMMIT_NOT_ALLOWED_IN_SF_OR_TRG = 1422;
  exports2.ER_NO_DEFAULT_FOR_VIEW_FIELD = 1423;
  exports2.ER_SP_NO_RECURSION = 1424;
  exports2.ER_TOO_BIG_SCALE = 1425;
  exports2.ER_TOO_BIG_PRECISION = 1426;
  exports2.ER_M_BIGGER_THAN_D = 1427;
  exports2.ER_WRONG_LOCK_OF_SYSTEM_TABLE = 1428;
  exports2.ER_CONNECT_TO_FOREIGN_DATA_SOURCE = 1429;
  exports2.ER_QUERY_ON_FOREIGN_DATA_SOURCE = 1430;
  exports2.ER_FOREIGN_DATA_SOURCE_DOESNT_EXIST = 1431;
  exports2.ER_FOREIGN_DATA_STRING_INVALID_CANT_CREATE = 1432;
  exports2.ER_FOREIGN_DATA_STRING_INVALID = 1433;
  exports2.ER_CANT_CREATE_FEDERATED_TABLE = 1434;
  exports2.ER_TRG_IN_WRONG_SCHEMA = 1435;
  exports2.ER_STACK_OVERRUN_NEED_MORE = 1436;
  exports2.ER_TOO_LONG_BODY = 1437;
  exports2.ER_WARN_CANT_DROP_DEFAULT_KEYCACHE = 1438;
  exports2.ER_TOO_BIG_DISPLAYWIDTH = 1439;
  exports2.ER_XAER_DUPID = 1440;
  exports2.ER_DATETIME_FUNCTION_OVERFLOW = 1441;
  exports2.ER_CANT_UPDATE_USED_TABLE_IN_SF_OR_TRG = 1442;
  exports2.ER_VIEW_PREVENT_UPDATE = 1443;
  exports2.ER_PS_NO_RECURSION = 1444;
  exports2.ER_SP_CANT_SET_AUTOCOMMIT = 1445;
  exports2.ER_MALFORMED_DEFINER = 1446;
  exports2.ER_VIEW_FRM_NO_USER = 1447;
  exports2.ER_VIEW_OTHER_USER = 1448;
  exports2.ER_NO_SUCH_USER = 1449;
  exports2.ER_FORBID_SCHEMA_CHANGE = 1450;
  exports2.ER_ROW_IS_REFERENCED_2 = 1451;
  exports2.ER_NO_REFERENCED_ROW_2 = 1452;
  exports2.ER_SP_BAD_VAR_SHADOW = 1453;
  exports2.ER_TRG_NO_DEFINER = 1454;
  exports2.ER_OLD_FILE_FORMAT = 1455;
  exports2.ER_SP_RECURSION_LIMIT = 1456;
  exports2.ER_SP_PROC_TABLE_CORRUPT = 1457;
  exports2.ER_SP_WRONG_NAME = 1458;
  exports2.ER_TABLE_NEEDS_UPGRADE = 1459;
  exports2.ER_SP_NO_AGGREGATE = 1460;
  exports2.ER_MAX_PREPARED_STMT_COUNT_REACHED = 1461;
  exports2.ER_VIEW_RECURSIVE = 1462;
  exports2.ER_NON_GROUPING_FIELD_USED = 1463;
  exports2.ER_TABLE_CANT_HANDLE_SPKEYS = 1464;
  exports2.ER_NO_TRIGGERS_ON_SYSTEM_SCHEMA = 1465;
  exports2.ER_REMOVED_SPACES = 1466;
  exports2.ER_AUTOINC_READ_FAILED = 1467;
  exports2.ER_USERNAME = 1468;
  exports2.ER_HOSTNAME = 1469;
  exports2.ER_WRONG_STRING_LENGTH = 1470;
  exports2.ER_NON_INSERTABLE_TABLE = 1471;
  exports2.ER_ADMIN_WRONG_MRG_TABLE = 1472;
  exports2.ER_TOO_HIGH_LEVEL_OF_NESTING_FOR_SELECT = 1473;
  exports2.ER_NAME_BECOMES_EMPTY = 1474;
  exports2.ER_AMBIGUOUS_FIELD_TERM = 1475;
  exports2.ER_FOREIGN_SERVER_EXISTS = 1476;
  exports2.ER_FOREIGN_SERVER_DOESNT_EXIST = 1477;
  exports2.ER_ILLEGAL_HA_CREATE_OPTION = 1478;
  exports2.ER_PARTITION_REQUIRES_VALUES_ERROR = 1479;
  exports2.ER_PARTITION_WRONG_VALUES_ERROR = 1480;
  exports2.ER_PARTITION_MAXVALUE_ERROR = 1481;
  exports2.ER_PARTITION_SUBPARTITION_ERROR = 1482;
  exports2.ER_PARTITION_SUBPART_MIX_ERROR = 1483;
  exports2.ER_PARTITION_WRONG_NO_PART_ERROR = 1484;
  exports2.ER_PARTITION_WRONG_NO_SUBPART_ERROR = 1485;
  exports2.ER_WRONG_EXPR_IN_PARTITION_FUNC_ERROR = 1486;
  exports2.ER_NO_CONST_EXPR_IN_RANGE_OR_LIST_ERROR = 1487;
  exports2.ER_FIELD_NOT_FOUND_PART_ERROR = 1488;
  exports2.ER_LIST_OF_FIELDS_ONLY_IN_HASH_ERROR = 1489;
  exports2.ER_INCONSISTENT_PARTITION_INFO_ERROR = 1490;
  exports2.ER_PARTITION_FUNC_NOT_ALLOWED_ERROR = 1491;
  exports2.ER_PARTITIONS_MUST_BE_DEFINED_ERROR = 1492;
  exports2.ER_RANGE_NOT_INCREASING_ERROR = 1493;
  exports2.ER_INCONSISTENT_TYPE_OF_FUNCTIONS_ERROR = 1494;
  exports2.ER_MULTIPLE_DEF_CONST_IN_LIST_PART_ERROR = 1495;
  exports2.ER_PARTITION_ENTRY_ERROR = 1496;
  exports2.ER_MIX_HANDLER_ERROR = 1497;
  exports2.ER_PARTITION_NOT_DEFINED_ERROR = 1498;
  exports2.ER_TOO_MANY_PARTITIONS_ERROR = 1499;
  exports2.ER_SUBPARTITION_ERROR = 1500;
  exports2.ER_CANT_CREATE_HANDLER_FILE = 1501;
  exports2.ER_BLOB_FIELD_IN_PART_FUNC_ERROR = 1502;
  exports2.ER_UNIQUE_KEY_NEED_ALL_FIELDS_IN_PF = 1503;
  exports2.ER_NO_PARTS_ERROR = 1504;
  exports2.ER_PARTITION_MGMT_ON_NONPARTITIONED = 1505;
  exports2.ER_FOREIGN_KEY_ON_PARTITIONED = 1506;
  exports2.ER_DROP_PARTITION_NON_EXISTENT = 1507;
  exports2.ER_DROP_LAST_PARTITION = 1508;
  exports2.ER_COALESCE_ONLY_ON_HASH_PARTITION = 1509;
  exports2.ER_REORG_HASH_ONLY_ON_SAME_NO = 1510;
  exports2.ER_REORG_NO_PARAM_ERROR = 1511;
  exports2.ER_ONLY_ON_RANGE_LIST_PARTITION = 1512;
  exports2.ER_ADD_PARTITION_SUBPART_ERROR = 1513;
  exports2.ER_ADD_PARTITION_NO_NEW_PARTITION = 1514;
  exports2.ER_COALESCE_PARTITION_NO_PARTITION = 1515;
  exports2.ER_REORG_PARTITION_NOT_EXIST = 1516;
  exports2.ER_SAME_NAME_PARTITION = 1517;
  exports2.ER_NO_BINLOG_ERROR = 1518;
  exports2.ER_CONSECUTIVE_REORG_PARTITIONS = 1519;
  exports2.ER_REORG_OUTSIDE_RANGE = 1520;
  exports2.ER_PARTITION_FUNCTION_FAILURE = 1521;
  exports2.ER_PART_STATE_ERROR = 1522;
  exports2.ER_LIMITED_PART_RANGE = 1523;
  exports2.ER_PLUGIN_IS_NOT_LOADED = 1524;
  exports2.ER_WRONG_VALUE = 1525;
  exports2.ER_NO_PARTITION_FOR_GIVEN_VALUE = 1526;
  exports2.ER_FILEGROUP_OPTION_ONLY_ONCE = 1527;
  exports2.ER_CREATE_FILEGROUP_FAILED = 1528;
  exports2.ER_DROP_FILEGROUP_FAILED = 1529;
  exports2.ER_TABLESPACE_AUTO_EXTEND_ERROR = 1530;
  exports2.ER_WRONG_SIZE_NUMBER = 1531;
  exports2.ER_SIZE_OVERFLOW_ERROR = 1532;
  exports2.ER_ALTER_FILEGROUP_FAILED = 1533;
  exports2.ER_BINLOG_ROW_LOGGING_FAILED = 1534;
  exports2.ER_BINLOG_ROW_WRONG_TABLE_DEF = 1535;
  exports2.ER_BINLOG_ROW_RBR_TO_SBR = 1536;
  exports2.ER_EVENT_ALREADY_EXISTS = 1537;
  exports2.ER_EVENT_STORE_FAILED = 1538;
  exports2.ER_EVENT_DOES_NOT_EXIST = 1539;
  exports2.ER_EVENT_CANT_ALTER = 1540;
  exports2.ER_EVENT_DROP_FAILED = 1541;
  exports2.ER_EVENT_INTERVAL_NOT_POSITIVE_OR_TOO_BIG = 1542;
  exports2.ER_EVENT_ENDS_BEFORE_STARTS = 1543;
  exports2.ER_EVENT_EXEC_TIME_IN_THE_PAST = 1544;
  exports2.ER_EVENT_OPEN_TABLE_FAILED = 1545;
  exports2.ER_EVENT_NEITHER_M_EXPR_NOR_M_AT = 1546;
  exports2.ER_COL_COUNT_DOESNT_MATCH_CORRUPTED = 1547;
  exports2.ER_CANNOT_LOAD_FROM_TABLE = 1548;
  exports2.ER_EVENT_CANNOT_DELETE = 1549;
  exports2.ER_EVENT_COMPILE_ERROR = 1550;
  exports2.ER_EVENT_SAME_NAME = 1551;
  exports2.ER_EVENT_DATA_TOO_LONG = 1552;
  exports2.ER_DROP_INDEX_FK = 1553;
  exports2.ER_WARN_DEPRECATED_SYNTAX_WITH_VER = 1554;
  exports2.ER_CANT_WRITE_LOCK_LOG_TABLE = 1555;
  exports2.ER_CANT_LOCK_LOG_TABLE = 1556;
  exports2.ER_FOREIGN_DUPLICATE_KEY = 1557;
  exports2.ER_COL_COUNT_DOESNT_MATCH_PLEASE_UPDATE = 1558;
  exports2.ER_TEMP_TABLE_PREVENTS_SWITCH_OUT_OF_RBR = 1559;
  exports2.ER_STORED_FUNCTION_PREVENTS_SWITCH_BINLOG_FORMAT = 1560;
  exports2.ER_NDB_CANT_SWITCH_BINLOG_FORMAT = 1561;
  exports2.ER_PARTITION_NO_TEMPORARY = 1562;
  exports2.ER_PARTITION_CONST_DOMAIN_ERROR = 1563;
  exports2.ER_PARTITION_FUNCTION_IS_NOT_ALLOWED = 1564;
  exports2.ER_DDL_LOG_ERROR = 1565;
  exports2.ER_NULL_IN_VALUES_LESS_THAN = 1566;
  exports2.ER_WRONG_PARTITION_NAME = 1567;
  exports2.ER_CANT_CHANGE_TX_CHARACTERISTICS = 1568;
  exports2.ER_DUP_ENTRY_AUTOINCREMENT_CASE = 1569;
  exports2.ER_EVENT_MODIFY_QUEUE_ERROR = 1570;
  exports2.ER_EVENT_SET_VAR_ERROR = 1571;
  exports2.ER_PARTITION_MERGE_ERROR = 1572;
  exports2.ER_CANT_ACTIVATE_LOG = 1573;
  exports2.ER_RBR_NOT_AVAILABLE = 1574;
  exports2.ER_BASE64_DECODE_ERROR = 1575;
  exports2.ER_EVENT_RECURSION_FORBIDDEN = 1576;
  exports2.ER_EVENTS_DB_ERROR = 1577;
  exports2.ER_ONLY_INTEGERS_ALLOWED = 1578;
  exports2.ER_UNSUPORTED_LOG_ENGINE = 1579;
  exports2.ER_BAD_LOG_STATEMENT = 1580;
  exports2.ER_CANT_RENAME_LOG_TABLE = 1581;
  exports2.ER_WRONG_PARAMCOUNT_TO_NATIVE_FCT = 1582;
  exports2.ER_WRONG_PARAMETERS_TO_NATIVE_FCT = 1583;
  exports2.ER_WRONG_PARAMETERS_TO_STORED_FCT = 1584;
  exports2.ER_NATIVE_FCT_NAME_COLLISION = 1585;
  exports2.ER_DUP_ENTRY_WITH_KEY_NAME = 1586;
  exports2.ER_BINLOG_PURGE_EMFILE = 1587;
  exports2.ER_EVENT_CANNOT_CREATE_IN_THE_PAST = 1588;
  exports2.ER_EVENT_CANNOT_ALTER_IN_THE_PAST = 1589;
  exports2.ER_SLAVE_INCIDENT = 1590;
  exports2.ER_NO_PARTITION_FOR_GIVEN_VALUE_SILENT = 1591;
  exports2.ER_BINLOG_UNSAFE_STATEMENT = 1592;
  exports2.ER_SLAVE_FATAL_ERROR = 1593;
  exports2.ER_SLAVE_RELAY_LOG_READ_FAILURE = 1594;
  exports2.ER_SLAVE_RELAY_LOG_WRITE_FAILURE = 1595;
  exports2.ER_SLAVE_CREATE_EVENT_FAILURE = 1596;
  exports2.ER_SLAVE_MASTER_COM_FAILURE = 1597;
  exports2.ER_BINLOG_LOGGING_IMPOSSIBLE = 1598;
  exports2.ER_VIEW_NO_CREATION_CTX = 1599;
  exports2.ER_VIEW_INVALID_CREATION_CTX = 1600;
  exports2.ER_SR_INVALID_CREATION_CTX = 1601;
  exports2.ER_TRG_CORRUPTED_FILE = 1602;
  exports2.ER_TRG_NO_CREATION_CTX = 1603;
  exports2.ER_TRG_INVALID_CREATION_CTX = 1604;
  exports2.ER_EVENT_INVALID_CREATION_CTX = 1605;
  exports2.ER_TRG_CANT_OPEN_TABLE = 1606;
  exports2.ER_CANT_CREATE_SROUTINE = 1607;
  exports2.ER_NEVER_USED = 1608;
  exports2.ER_NO_FORMAT_DESCRIPTION_EVENT_BEFORE_BINLOG_STATEMENT = 1609;
  exports2.ER_SLAVE_CORRUPT_EVENT = 1610;
  exports2.ER_LOAD_DATA_INVALID_COLUMN = 1611;
  exports2.ER_LOG_PURGE_NO_FILE = 1612;
  exports2.ER_XA_RBTIMEOUT = 1613;
  exports2.ER_XA_RBDEADLOCK = 1614;
  exports2.ER_NEED_REPREPARE = 1615;
  exports2.ER_DELAYED_NOT_SUPPORTED = 1616;
  exports2.WARN_NO_MASTER_INFO = 1617;
  exports2.WARN_OPTION_IGNORED = 1618;
  exports2.ER_PLUGIN_DELETE_BUILTIN = 1619;
  exports2.WARN_PLUGIN_BUSY = 1620;
  exports2.ER_VARIABLE_IS_READONLY = 1621;
  exports2.ER_WARN_ENGINE_TRANSACTION_ROLLBACK = 1622;
  exports2.ER_SLAVE_HEARTBEAT_FAILURE = 1623;
  exports2.ER_SLAVE_HEARTBEAT_VALUE_OUT_OF_RANGE = 1624;
  exports2.ER_NDB_REPLICATION_SCHEMA_ERROR = 1625;
  exports2.ER_CONFLICT_FN_PARSE_ERROR = 1626;
  exports2.ER_EXCEPTIONS_WRITE_ERROR = 1627;
  exports2.ER_TOO_LONG_TABLE_COMMENT = 1628;
  exports2.ER_TOO_LONG_FIELD_COMMENT = 1629;
  exports2.ER_FUNC_INEXISTENT_NAME_COLLISION = 1630;
  exports2.ER_DATABASE_NAME = 1631;
  exports2.ER_TABLE_NAME = 1632;
  exports2.ER_PARTITION_NAME = 1633;
  exports2.ER_SUBPARTITION_NAME = 1634;
  exports2.ER_TEMPORARY_NAME = 1635;
  exports2.ER_RENAMED_NAME = 1636;
  exports2.ER_TOO_MANY_CONCURRENT_TRXS = 1637;
  exports2.WARN_NON_ASCII_SEPARATOR_NOT_IMPLEMENTED = 1638;
  exports2.ER_DEBUG_SYNC_TIMEOUT = 1639;
  exports2.ER_DEBUG_SYNC_HIT_LIMIT = 1640;
  exports2.ER_DUP_SIGNAL_SET = 1641;
  exports2.ER_SIGNAL_WARN = 1642;
  exports2.ER_SIGNAL_NOT_FOUND = 1643;
  exports2.ER_SIGNAL_EXCEPTION = 1644;
  exports2.ER_RESIGNAL_WITHOUT_ACTIVE_HANDLER = 1645;
  exports2.ER_SIGNAL_BAD_CONDITION_TYPE = 1646;
  exports2.WARN_COND_ITEM_TRUNCATED = 1647;
  exports2.ER_COND_ITEM_TOO_LONG = 1648;
  exports2.ER_UNKNOWN_LOCALE = 1649;
  exports2.ER_SLAVE_IGNORE_SERVER_IDS = 1650;
  exports2.ER_QUERY_CACHE_DISABLED = 1651;
  exports2.ER_SAME_NAME_PARTITION_FIELD = 1652;
  exports2.ER_PARTITION_COLUMN_LIST_ERROR = 1653;
  exports2.ER_WRONG_TYPE_COLUMN_VALUE_ERROR = 1654;
  exports2.ER_TOO_MANY_PARTITION_FUNC_FIELDS_ERROR = 1655;
  exports2.ER_MAXVALUE_IN_VALUES_IN = 1656;
  exports2.ER_TOO_MANY_VALUES_ERROR = 1657;
  exports2.ER_ROW_SINGLE_PARTITION_FIELD_ERROR = 1658;
  exports2.ER_FIELD_TYPE_NOT_ALLOWED_AS_PARTITION_FIELD = 1659;
  exports2.ER_PARTITION_FIELDS_TOO_LONG = 1660;
  exports2.ER_BINLOG_ROW_ENGINE_AND_STMT_ENGINE = 1661;
  exports2.ER_BINLOG_ROW_MODE_AND_STMT_ENGINE = 1662;
  exports2.ER_BINLOG_UNSAFE_AND_STMT_ENGINE = 1663;
  exports2.ER_BINLOG_ROW_INJECTION_AND_STMT_ENGINE = 1664;
  exports2.ER_BINLOG_STMT_MODE_AND_ROW_ENGINE = 1665;
  exports2.ER_BINLOG_ROW_INJECTION_AND_STMT_MODE = 1666;
  exports2.ER_BINLOG_MULTIPLE_ENGINES_AND_SELF_LOGGING_ENGINE = 1667;
  exports2.ER_BINLOG_UNSAFE_LIMIT = 1668;
  exports2.ER_BINLOG_UNSAFE_INSERT_DELAYED = 1669;
  exports2.ER_BINLOG_UNSAFE_SYSTEM_TABLE = 1670;
  exports2.ER_BINLOG_UNSAFE_AUTOINC_COLUMNS = 1671;
  exports2.ER_BINLOG_UNSAFE_UDF = 1672;
  exports2.ER_BINLOG_UNSAFE_SYSTEM_VARIABLE = 1673;
  exports2.ER_BINLOG_UNSAFE_SYSTEM_FUNCTION = 1674;
  exports2.ER_BINLOG_UNSAFE_NONTRANS_AFTER_TRANS = 1675;
  exports2.ER_MESSAGE_AND_STATEMENT = 1676;
  exports2.ER_SLAVE_CONVERSION_FAILED = 1677;
  exports2.ER_SLAVE_CANT_CREATE_CONVERSION = 1678;
  exports2.ER_INSIDE_TRANSACTION_PREVENTS_SWITCH_BINLOG_FORMAT = 1679;
  exports2.ER_PATH_LENGTH = 1680;
  exports2.ER_WARN_DEPRECATED_SYNTAX_NO_REPLACEMENT = 1681;
  exports2.ER_WRONG_NATIVE_TABLE_STRUCTURE = 1682;
  exports2.ER_WRONG_PERFSCHEMA_USAGE = 1683;
  exports2.ER_WARN_I_S_SKIPPED_TABLE = 1684;
  exports2.ER_INSIDE_TRANSACTION_PREVENTS_SWITCH_BINLOG_DIRECT = 1685;
  exports2.ER_STORED_FUNCTION_PREVENTS_SWITCH_BINLOG_DIRECT = 1686;
  exports2.ER_SPATIAL_MUST_HAVE_GEOM_COL = 1687;
  exports2.ER_TOO_LONG_INDEX_COMMENT = 1688;
  exports2.ER_LOCK_ABORTED = 1689;
  exports2.ER_DATA_OUT_OF_RANGE = 1690;
  exports2.ER_WRONG_SPVAR_TYPE_IN_LIMIT = 1691;
  exports2.ER_BINLOG_UNSAFE_MULTIPLE_ENGINES_AND_SELF_LOGGING_ENGINE = 1692;
  exports2.ER_BINLOG_UNSAFE_MIXED_STATEMENT = 1693;
  exports2.ER_INSIDE_TRANSACTION_PREVENTS_SWITCH_SQL_LOG_BIN = 1694;
  exports2.ER_STORED_FUNCTION_PREVENTS_SWITCH_SQL_LOG_BIN = 1695;
  exports2.ER_FAILED_READ_FROM_PAR_FILE = 1696;
  exports2.ER_VALUES_IS_NOT_INT_TYPE_ERROR = 1697;
  exports2.ER_ACCESS_DENIED_NO_PASSWORD_ERROR = 1698;
  exports2.ER_SET_PASSWORD_AUTH_PLUGIN = 1699;
  exports2.ER_GRANT_PLUGIN_USER_EXISTS = 1700;
  exports2.ER_TRUNCATE_ILLEGAL_FK = 1701;
  exports2.ER_PLUGIN_IS_PERMANENT = 1702;
  exports2.ER_SLAVE_HEARTBEAT_VALUE_OUT_OF_RANGE_MIN = 1703;
  exports2.ER_SLAVE_HEARTBEAT_VALUE_OUT_OF_RANGE_MAX = 1704;
  exports2.ER_STMT_CACHE_FULL = 1705;
  exports2.ER_MULTI_UPDATE_KEY_CONFLICT = 1706;
  exports2.ER_TABLE_NEEDS_REBUILD = 1707;
  exports2.WARN_OPTION_BELOW_LIMIT = 1708;
  exports2.ER_INDEX_COLUMN_TOO_LONG = 1709;
  exports2.ER_ERROR_IN_TRIGGER_BODY = 1710;
  exports2.ER_ERROR_IN_UNKNOWN_TRIGGER_BODY = 1711;
  exports2.ER_INDEX_CORRUPT = 1712;
  exports2.ER_UNDO_RECORD_TOO_BIG = 1713;
  exports2.ER_BINLOG_UNSAFE_INSERT_IGNORE_SELECT = 1714;
  exports2.ER_BINLOG_UNSAFE_INSERT_SELECT_UPDATE = 1715;
  exports2.ER_BINLOG_UNSAFE_REPLACE_SELECT = 1716;
  exports2.ER_BINLOG_UNSAFE_CREATE_IGNORE_SELECT = 1717;
  exports2.ER_BINLOG_UNSAFE_CREATE_REPLACE_SELECT = 1718;
  exports2.ER_BINLOG_UNSAFE_UPDATE_IGNORE = 1719;
  exports2.ER_PLUGIN_NO_UNINSTALL = 1720;
  exports2.ER_PLUGIN_NO_INSTALL = 1721;
  exports2.ER_BINLOG_UNSAFE_WRITE_AUTOINC_SELECT = 1722;
  exports2.ER_BINLOG_UNSAFE_CREATE_SELECT_AUTOINC = 1723;
  exports2.ER_BINLOG_UNSAFE_INSERT_TWO_KEYS = 1724;
  exports2.ER_TABLE_IN_FK_CHECK = 1725;
  exports2.ER_UNSUPPORTED_ENGINE = 1726;
  exports2.ER_BINLOG_UNSAFE_AUTOINC_NOT_FIRST = 1727;
  exports2.ER_CANNOT_LOAD_FROM_TABLE_V2 = 1728;
  exports2.ER_MASTER_DELAY_VALUE_OUT_OF_RANGE = 1729;
  exports2.ER_ONLY_FD_AND_RBR_EVENTS_ALLOWED_IN_BINLOG_STATEMENT = 1730;
  exports2.ER_PARTITION_EXCHANGE_DIFFERENT_OPTION = 1731;
  exports2.ER_PARTITION_EXCHANGE_PART_TABLE = 1732;
  exports2.ER_PARTITION_EXCHANGE_TEMP_TABLE = 1733;
  exports2.ER_PARTITION_INSTEAD_OF_SUBPARTITION = 1734;
  exports2.ER_UNKNOWN_PARTITION = 1735;
  exports2.ER_TABLES_DIFFERENT_METADATA = 1736;
  exports2.ER_ROW_DOES_NOT_MATCH_PARTITION = 1737;
  exports2.ER_BINLOG_CACHE_SIZE_GREATER_THAN_MAX = 1738;
  exports2.ER_WARN_INDEX_NOT_APPLICABLE = 1739;
  exports2.ER_PARTITION_EXCHANGE_FOREIGN_KEY = 1740;
  exports2.ER_NO_SUCH_KEY_VALUE = 1741;
  exports2.ER_RPL_INFO_DATA_TOO_LONG = 1742;
  exports2.ER_NETWORK_READ_EVENT_CHECKSUM_FAILURE = 1743;
  exports2.ER_BINLOG_READ_EVENT_CHECKSUM_FAILURE = 1744;
  exports2.ER_BINLOG_STMT_CACHE_SIZE_GREATER_THAN_MAX = 1745;
  exports2.ER_CANT_UPDATE_TABLE_IN_CREATE_TABLE_SELECT = 1746;
  exports2.ER_PARTITION_CLAUSE_ON_NONPARTITIONED = 1747;
  exports2.ER_ROW_DOES_NOT_MATCH_GIVEN_PARTITION_SET = 1748;
  exports2.ER_NO_SUCH_PARTITION = 1749;
  exports2.ER_CHANGE_RPL_INFO_REPOSITORY_FAILURE = 1750;
  exports2.ER_WARNING_NOT_COMPLETE_ROLLBACK_WITH_CREATED_TEMP_TABLE = 1751;
  exports2.ER_WARNING_NOT_COMPLETE_ROLLBACK_WITH_DROPPED_TEMP_TABLE = 1752;
  exports2.ER_MTS_FEATURE_IS_NOT_SUPPORTED = 1753;
  exports2.ER_MTS_UPDATED_DBS_GREATER_MAX = 1754;
  exports2.ER_MTS_CANT_PARALLEL = 1755;
  exports2.ER_MTS_INCONSISTENT_DATA = 1756;
  exports2.ER_FULLTEXT_NOT_SUPPORTED_WITH_PARTITIONING = 1757;
  exports2.ER_DA_INVALID_CONDITION_NUMBER = 1758;
  exports2.ER_INSECURE_PLAIN_TEXT = 1759;
  exports2.ER_INSECURE_CHANGE_MASTER = 1760;
  exports2.ER_FOREIGN_DUPLICATE_KEY_WITH_CHILD_INFO = 1761;
  exports2.ER_FOREIGN_DUPLICATE_KEY_WITHOUT_CHILD_INFO = 1762;
  exports2.ER_SQLTHREAD_WITH_SECURE_SLAVE = 1763;
  exports2.ER_TABLE_HAS_NO_FT = 1764;
  exports2.ER_VARIABLE_NOT_SETTABLE_IN_SF_OR_TRIGGER = 1765;
  exports2.ER_VARIABLE_NOT_SETTABLE_IN_TRANSACTION = 1766;
  exports2.ER_GTID_NEXT_IS_NOT_IN_GTID_NEXT_LIST = 1767;
  exports2.ER_CANT_CHANGE_GTID_NEXT_IN_TRANSACTION = 1768;
  exports2.ER_SET_STATEMENT_CANNOT_INVOKE_FUNCTION = 1769;
  exports2.ER_GTID_NEXT_CANT_BE_AUTOMATIC_IF_GTID_NEXT_LIST_IS_NON_NULL = 1770;
  exports2.ER_SKIPPING_LOGGED_TRANSACTION = 1771;
  exports2.ER_MALFORMED_GTID_SET_SPECIFICATION = 1772;
  exports2.ER_MALFORMED_GTID_SET_ENCODING = 1773;
  exports2.ER_MALFORMED_GTID_SPECIFICATION = 1774;
  exports2.ER_GNO_EXHAUSTED = 1775;
  exports2.ER_BAD_SLAVE_AUTO_POSITION = 1776;
  exports2.ER_AUTO_POSITION_REQUIRES_GTID_MODE_NOT_OFF = 1777;
  exports2.ER_CANT_DO_IMPLICIT_COMMIT_IN_TRX_WHEN_GTID_NEXT_IS_SET = 1778;
  exports2.ER_GTID_MODE_ON_REQUIRES_ENFORCE_GTID_CONSISTENCY_ON = 1779;
  exports2.ER_GTID_MODE_REQUIRES_BINLOG = 1780;
  exports2.ER_CANT_SET_GTID_NEXT_TO_GTID_WHEN_GTID_MODE_IS_OFF = 1781;
  exports2.ER_CANT_SET_GTID_NEXT_TO_ANONYMOUS_WHEN_GTID_MODE_IS_ON = 1782;
  exports2.ER_CANT_SET_GTID_NEXT_LIST_TO_NON_NULL_WHEN_GTID_MODE_IS_OFF = 1783;
  exports2.ER_FOUND_GTID_EVENT_WHEN_GTID_MODE_IS_OFF = 1784;
  exports2.ER_GTID_UNSAFE_NON_TRANSACTIONAL_TABLE = 1785;
  exports2.ER_GTID_UNSAFE_CREATE_SELECT = 1786;
  exports2.ER_GTID_UNSAFE_CREATE_DROP_TEMPORARY_TABLE_IN_TRANSACTION = 1787;
  exports2.ER_GTID_MODE_CAN_ONLY_CHANGE_ONE_STEP_AT_A_TIME = 1788;
  exports2.ER_MASTER_HAS_PURGED_REQUIRED_GTIDS = 1789;
  exports2.ER_CANT_SET_GTID_NEXT_WHEN_OWNING_GTID = 1790;
  exports2.ER_UNKNOWN_EXPLAIN_FORMAT = 1791;
  exports2.ER_CANT_EXECUTE_IN_READ_ONLY_TRANSACTION = 1792;
  exports2.ER_TOO_LONG_TABLE_PARTITION_COMMENT = 1793;
  exports2.ER_SLAVE_CONFIGURATION = 1794;
  exports2.ER_INNODB_FT_LIMIT = 1795;
  exports2.ER_INNODB_NO_FT_TEMP_TABLE = 1796;
  exports2.ER_INNODB_FT_WRONG_DOCID_COLUMN = 1797;
  exports2.ER_INNODB_FT_WRONG_DOCID_INDEX = 1798;
  exports2.ER_INNODB_ONLINE_LOG_TOO_BIG = 1799;
  exports2.ER_UNKNOWN_ALTER_ALGORITHM = 1800;
  exports2.ER_UNKNOWN_ALTER_LOCK = 1801;
  exports2.ER_MTS_CHANGE_MASTER_CANT_RUN_WITH_GAPS = 1802;
  exports2.ER_MTS_RECOVERY_FAILURE = 1803;
  exports2.ER_MTS_RESET_WORKERS = 1804;
  exports2.ER_COL_COUNT_DOESNT_MATCH_CORRUPTED_V2 = 1805;
  exports2.ER_SLAVE_SILENT_RETRY_TRANSACTION = 1806;
  exports2.ER_DISCARD_FK_CHECKS_RUNNING = 1807;
  exports2.ER_TABLE_SCHEMA_MISMATCH = 1808;
  exports2.ER_TABLE_IN_SYSTEM_TABLESPACE = 1809;
  exports2.ER_IO_READ_ERROR = 1810;
  exports2.ER_IO_WRITE_ERROR = 1811;
  exports2.ER_TABLESPACE_MISSING = 1812;
  exports2.ER_TABLESPACE_EXISTS = 1813;
  exports2.ER_TABLESPACE_DISCARDED = 1814;
  exports2.ER_INTERNAL_ERROR = 1815;
  exports2.ER_INNODB_IMPORT_ERROR = 1816;
  exports2.ER_INNODB_INDEX_CORRUPT = 1817;
  exports2.ER_INVALID_YEAR_COLUMN_LENGTH = 1818;
  exports2.ER_NOT_VALID_PASSWORD = 1819;
  exports2.ER_MUST_CHANGE_PASSWORD = 1820;
  exports2.ER_FK_NO_INDEX_CHILD = 1821;
  exports2.ER_FK_NO_INDEX_PARENT = 1822;
  exports2.ER_FK_FAIL_ADD_SYSTEM = 1823;
  exports2.ER_FK_CANNOT_OPEN_PARENT = 1824;
  exports2.ER_FK_INCORRECT_OPTION = 1825;
  exports2.ER_FK_DUP_NAME = 1826;
  exports2.ER_PASSWORD_FORMAT = 1827;
  exports2.ER_FK_COLUMN_CANNOT_DROP = 1828;
  exports2.ER_FK_COLUMN_CANNOT_DROP_CHILD = 1829;
  exports2.ER_FK_COLUMN_NOT_NULL = 1830;
  exports2.ER_DUP_INDEX = 1831;
  exports2.ER_FK_COLUMN_CANNOT_CHANGE = 1832;
  exports2.ER_FK_COLUMN_CANNOT_CHANGE_CHILD = 1833;
  exports2.ER_FK_CANNOT_DELETE_PARENT = 1834;
  exports2.ER_MALFORMED_PACKET = 1835;
  exports2.ER_READ_ONLY_MODE = 1836;
  exports2.ER_GTID_NEXT_TYPE_UNDEFINED_GROUP = 1837;
  exports2.ER_VARIABLE_NOT_SETTABLE_IN_SP = 1838;
  exports2.ER_CANT_SET_GTID_PURGED_WHEN_GTID_MODE_IS_OFF = 1839;
  exports2.ER_CANT_SET_GTID_PURGED_WHEN_GTID_EXECUTED_IS_NOT_EMPTY = 1840;
  exports2.ER_CANT_SET_GTID_PURGED_WHEN_OWNED_GTIDS_IS_NOT_EMPTY = 1841;
  exports2.ER_GTID_PURGED_WAS_CHANGED = 1842;
  exports2.ER_GTID_EXECUTED_WAS_CHANGED = 1843;
  exports2.ER_BINLOG_STMT_MODE_AND_NO_REPL_TABLES = 1844;
  exports2.ER_ALTER_OPERATION_NOT_SUPPORTED = 1845;
  exports2.ER_ALTER_OPERATION_NOT_SUPPORTED_REASON = 1846;
  exports2.ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_COPY = 1847;
  exports2.ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_PARTITION = 1848;
  exports2.ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_FK_RENAME = 1849;
  exports2.ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_COLUMN_TYPE = 1850;
  exports2.ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_FK_CHECK = 1851;
  exports2.ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_IGNORE = 1852;
  exports2.ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_NOPK = 1853;
  exports2.ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_AUTOINC = 1854;
  exports2.ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_HIDDEN_FTS = 1855;
  exports2.ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_CHANGE_FTS = 1856;
  exports2.ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_FTS = 1857;
  exports2.ER_SQL_SLAVE_SKIP_COUNTER_NOT_SETTABLE_IN_GTID_MODE = 1858;
  exports2.ER_DUP_UNKNOWN_IN_INDEX = 1859;
  exports2.ER_IDENT_CAUSES_TOO_LONG_PATH = 1860;
  exports2.ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_NOT_NULL = 1861;
  exports2.ER_MUST_CHANGE_PASSWORD_LOGIN = 1862;
  exports2.ER_ROW_IN_WRONG_PARTITION = 1863;
  exports2.ER_MTS_EVENT_BIGGER_PENDING_JOBS_SIZE_MAX = 1864;
  exports2.ER_INNODB_NO_FT_USES_PARSER = 1865;
  exports2.ER_BINLOG_LOGICAL_CORRUPTION = 1866;
  exports2.ER_WARN_PURGE_LOG_IN_USE = 1867;
  exports2.ER_WARN_PURGE_LOG_IS_ACTIVE = 1868;
  exports2.ER_AUTO_INCREMENT_CONFLICT = 1869;
  exports2.WARN_ON_BLOCKHOLE_IN_RBR = 1870;
  exports2.ER_SLAVE_MI_INIT_REPOSITORY = 1871;
  exports2.ER_SLAVE_RLI_INIT_REPOSITORY = 1872;
  exports2.ER_ACCESS_DENIED_CHANGE_USER_ERROR = 1873;
  exports2.ER_INNODB_READ_ONLY = 1874;
  exports2.ER_STOP_SLAVE_SQL_THREAD_TIMEOUT = 1875;
  exports2.ER_STOP_SLAVE_IO_THREAD_TIMEOUT = 1876;
  exports2.ER_TABLE_CORRUPT = 1877;
  exports2.ER_TEMP_FILE_WRITE_FAILURE = 1878;
  exports2.ER_INNODB_FT_AUX_NOT_HEX_ID = 1879;
  exports2.ER_OLD_TEMPORALS_UPGRADED = 1880;
  exports2.ER_INNODB_FORCED_RECOVERY = 1881;
  exports2.ER_AES_INVALID_IV = 1882;
  exports2.ER_PLUGIN_CANNOT_BE_UNINSTALLED = 1883;
  exports2.ER_GTID_UNSAFE_BINLOG_SPLITTABLE_STATEMENT_AND_GTID_GROUP = 1884;
  exports2.ER_SLAVE_HAS_MORE_GTIDS_THAN_MASTER = 1885;
  exports2.ER_MISSING_KEY = 1886;
  exports2.WARN_NAMED_PIPE_ACCESS_EVERYONE = 1887;
  exports2.ER_FOUND_MISSING_GTIDS = 1888;
  exports2.ER_FILE_CORRUPT = 3e3;
  exports2.ER_ERROR_ON_MASTER = 3001;
  exports2.ER_INCONSISTENT_ERROR = 3002;
  exports2.ER_STORAGE_ENGINE_NOT_LOADED = 3003;
  exports2.ER_GET_STACKED_DA_WITHOUT_ACTIVE_HANDLER = 3004;
  exports2.ER_WARN_LEGACY_SYNTAX_CONVERTED = 3005;
  exports2.ER_BINLOG_UNSAFE_FULLTEXT_PLUGIN = 3006;
  exports2.ER_CANNOT_DISCARD_TEMPORARY_TABLE = 3007;
  exports2.ER_FK_DEPTH_EXCEEDED = 3008;
  exports2.ER_COL_COUNT_DOESNT_MATCH_PLEASE_UPDATE_V2 = 3009;
  exports2.ER_WARN_TRIGGER_DOESNT_HAVE_CREATED = 3010;
  exports2.ER_REFERENCED_TRG_DOES_NOT_EXIST = 3011;
  exports2.ER_EXPLAIN_NOT_SUPPORTED = 3012;
  exports2.ER_INVALID_FIELD_SIZE = 3013;
  exports2.ER_MISSING_HA_CREATE_OPTION = 3014;
  exports2.ER_ENGINE_OUT_OF_MEMORY = 3015;
  exports2.ER_PASSWORD_EXPIRE_ANONYMOUS_USER = 3016;
  exports2.ER_SLAVE_SQL_THREAD_MUST_STOP = 3017;
  exports2.ER_NO_FT_MATERIALIZED_SUBQUERY = 3018;
  exports2.ER_INNODB_UNDO_LOG_FULL = 3019;
  exports2.ER_INVALID_ARGUMENT_FOR_LOGARITHM = 3020;
  exports2.ER_SLAVE_CHANNEL_IO_THREAD_MUST_STOP = 3021;
  exports2.ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO = 3022;
  exports2.ER_WARN_ONLY_MASTER_LOG_FILE_NO_POS = 3023;
  exports2.ER_QUERY_TIMEOUT = 3024;
  exports2.ER_NON_RO_SELECT_DISABLE_TIMER = 3025;
  exports2.ER_DUP_LIST_ENTRY = 3026;
  exports2.ER_SQL_MODE_NO_EFFECT = 3027;
  exports2.ER_AGGREGATE_ORDER_FOR_UNION = 3028;
  exports2.ER_AGGREGATE_ORDER_NON_AGG_QUERY = 3029;
  exports2.ER_SLAVE_WORKER_STOPPED_PREVIOUS_THD_ERROR = 3030;
  exports2.ER_DONT_SUPPORT_SLAVE_PRESERVE_COMMIT_ORDER = 3031;
  exports2.ER_SERVER_OFFLINE_MODE = 3032;
  exports2.ER_GIS_DIFFERENT_SRIDS = 3033;
  exports2.ER_GIS_UNSUPPORTED_ARGUMENT = 3034;
  exports2.ER_GIS_UNKNOWN_ERROR = 3035;
  exports2.ER_GIS_UNKNOWN_EXCEPTION = 3036;
  exports2.ER_GIS_INVALID_DATA = 3037;
  exports2.ER_BOOST_GEOMETRY_EMPTY_INPUT_EXCEPTION = 3038;
  exports2.ER_BOOST_GEOMETRY_CENTROID_EXCEPTION = 3039;
  exports2.ER_BOOST_GEOMETRY_OVERLAY_INVALID_INPUT_EXCEPTION = 3040;
  exports2.ER_BOOST_GEOMETRY_TURN_INFO_EXCEPTION = 3041;
  exports2.ER_BOOST_GEOMETRY_SELF_INTERSECTION_POINT_EXCEPTION = 3042;
  exports2.ER_BOOST_GEOMETRY_UNKNOWN_EXCEPTION = 3043;
  exports2.ER_STD_BAD_ALLOC_ERROR = 3044;
  exports2.ER_STD_DOMAIN_ERROR = 3045;
  exports2.ER_STD_LENGTH_ERROR = 3046;
  exports2.ER_STD_INVALID_ARGUMENT = 3047;
  exports2.ER_STD_OUT_OF_RANGE_ERROR = 3048;
  exports2.ER_STD_OVERFLOW_ERROR = 3049;
  exports2.ER_STD_RANGE_ERROR = 3050;
  exports2.ER_STD_UNDERFLOW_ERROR = 3051;
  exports2.ER_STD_LOGIC_ERROR = 3052;
  exports2.ER_STD_RUNTIME_ERROR = 3053;
  exports2.ER_STD_UNKNOWN_EXCEPTION = 3054;
  exports2.ER_GIS_DATA_WRONG_ENDIANESS = 3055;
  exports2.ER_CHANGE_MASTER_PASSWORD_LENGTH = 3056;
  exports2.ER_USER_LOCK_WRONG_NAME = 3057;
  exports2.ER_USER_LOCK_DEADLOCK = 3058;
  exports2.ER_REPLACE_INACCESSIBLE_ROWS = 3059;
  exports2.ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_GIS = 3060;
  exports2.ER_ILLEGAL_USER_VAR = 3061;
  exports2.ER_GTID_MODE_OFF = 3062;
  exports2.ER_UNSUPPORTED_BY_REPLICATION_THREAD = 3063;
  exports2.ER_INCORRECT_TYPE = 3064;
  exports2.ER_FIELD_IN_ORDER_NOT_SELECT = 3065;
  exports2.ER_AGGREGATE_IN_ORDER_NOT_SELECT = 3066;
  exports2.ER_INVALID_RPL_WILD_TABLE_FILTER_PATTERN = 3067;
  exports2.ER_NET_OK_PACKET_TOO_LARGE = 3068;
  exports2.ER_INVALID_JSON_DATA = 3069;
  exports2.ER_INVALID_GEOJSON_MISSING_MEMBER = 3070;
  exports2.ER_INVALID_GEOJSON_WRONG_TYPE = 3071;
  exports2.ER_INVALID_GEOJSON_UNSPECIFIED = 3072;
  exports2.ER_DIMENSION_UNSUPPORTED = 3073;
  exports2.ER_SLAVE_CHANNEL_DOES_NOT_EXIST = 3074;
  exports2.ER_SLAVE_MULTIPLE_CHANNELS_HOST_PORT = 3075;
  exports2.ER_SLAVE_CHANNEL_NAME_INVALID_OR_TOO_LONG = 3076;
  exports2.ER_SLAVE_NEW_CHANNEL_WRONG_REPOSITORY = 3077;
  exports2.ER_SLAVE_CHANNEL_DELETE = 3078;
  exports2.ER_SLAVE_MULTIPLE_CHANNELS_CMD = 3079;
  exports2.ER_SLAVE_MAX_CHANNELS_EXCEEDED = 3080;
  exports2.ER_SLAVE_CHANNEL_MUST_STOP = 3081;
  exports2.ER_SLAVE_CHANNEL_NOT_RUNNING = 3082;
  exports2.ER_SLAVE_CHANNEL_WAS_RUNNING = 3083;
  exports2.ER_SLAVE_CHANNEL_WAS_NOT_RUNNING = 3084;
  exports2.ER_SLAVE_CHANNEL_SQL_THREAD_MUST_STOP = 3085;
  exports2.ER_SLAVE_CHANNEL_SQL_SKIP_COUNTER = 3086;
  exports2.ER_WRONG_FIELD_WITH_GROUP_V2 = 3087;
  exports2.ER_MIX_OF_GROUP_FUNC_AND_FIELDS_V2 = 3088;
  exports2.ER_WARN_DEPRECATED_SYSVAR_UPDATE = 3089;
  exports2.ER_WARN_DEPRECATED_SQLMODE = 3090;
  exports2.ER_CANNOT_LOG_PARTIAL_DROP_DATABASE_WITH_GTID = 3091;
  exports2.ER_GROUP_REPLICATION_CONFIGURATION = 3092;
  exports2.ER_GROUP_REPLICATION_RUNNING = 3093;
  exports2.ER_GROUP_REPLICATION_APPLIER_INIT_ERROR = 3094;
  exports2.ER_GROUP_REPLICATION_STOP_APPLIER_THREAD_TIMEOUT = 3095;
  exports2.ER_GROUP_REPLICATION_COMMUNICATION_LAYER_SESSION_ERROR = 3096;
  exports2.ER_GROUP_REPLICATION_COMMUNICATION_LAYER_JOIN_ERROR = 3097;
  exports2.ER_BEFORE_DML_VALIDATION_ERROR = 3098;
  exports2.ER_PREVENTS_VARIABLE_WITHOUT_RBR = 3099;
  exports2.ER_RUN_HOOK_ERROR = 3100;
  exports2.ER_TRANSACTION_ROLLBACK_DURING_COMMIT = 3101;
  exports2.ER_GENERATED_COLUMN_FUNCTION_IS_NOT_ALLOWED = 3102;
  exports2.ER_UNSUPPORTED_ALTER_INPLACE_ON_VIRTUAL_COLUMN = 3103;
  exports2.ER_WRONG_FK_OPTION_FOR_GENERATED_COLUMN = 3104;
  exports2.ER_NON_DEFAULT_VALUE_FOR_GENERATED_COLUMN = 3105;
  exports2.ER_UNSUPPORTED_ACTION_ON_GENERATED_COLUMN = 3106;
  exports2.ER_GENERATED_COLUMN_NON_PRIOR = 3107;
  exports2.ER_DEPENDENT_BY_GENERATED_COLUMN = 3108;
  exports2.ER_GENERATED_COLUMN_REF_AUTO_INC = 3109;
  exports2.ER_FEATURE_NOT_AVAILABLE = 3110;
  exports2.ER_CANT_SET_GTID_MODE = 3111;
  exports2.ER_CANT_USE_AUTO_POSITION_WITH_GTID_MODE_OFF = 3112;
  exports2.ER_CANT_REPLICATE_ANONYMOUS_WITH_AUTO_POSITION = 3113;
  exports2.ER_CANT_REPLICATE_ANONYMOUS_WITH_GTID_MODE_ON = 3114;
  exports2.ER_CANT_REPLICATE_GTID_WITH_GTID_MODE_OFF = 3115;
  exports2.ER_CANT_SET_ENFORCE_GTID_CONSISTENCY_ON_WITH_ONGOING_GTID_VIOLATING_TRANSACTIONS = 3116;
  exports2.ER_SET_ENFORCE_GTID_CONSISTENCY_WARN_WITH_ONGOING_GTID_VIOLATING_TRANSACTIONS = 3117;
  exports2.ER_ACCOUNT_HAS_BEEN_LOCKED = 3118;
  exports2.ER_WRONG_TABLESPACE_NAME = 3119;
  exports2.ER_TABLESPACE_IS_NOT_EMPTY = 3120;
  exports2.ER_WRONG_FILE_NAME = 3121;
  exports2.ER_BOOST_GEOMETRY_INCONSISTENT_TURNS_EXCEPTION = 3122;
  exports2.ER_WARN_OPTIMIZER_HINT_SYNTAX_ERROR = 3123;
  exports2.ER_WARN_BAD_MAX_EXECUTION_TIME = 3124;
  exports2.ER_WARN_UNSUPPORTED_MAX_EXECUTION_TIME = 3125;
  exports2.ER_WARN_CONFLICTING_HINT = 3126;
  exports2.ER_WARN_UNKNOWN_QB_NAME = 3127;
  exports2.ER_UNRESOLVED_HINT_NAME = 3128;
  exports2.ER_WARN_ON_MODIFYING_GTID_EXECUTED_TABLE = 3129;
  exports2.ER_PLUGGABLE_PROTOCOL_COMMAND_NOT_SUPPORTED = 3130;
  exports2.ER_LOCKING_SERVICE_WRONG_NAME = 3131;
  exports2.ER_LOCKING_SERVICE_DEADLOCK = 3132;
  exports2.ER_LOCKING_SERVICE_TIMEOUT = 3133;
  exports2.ER_GIS_MAX_POINTS_IN_GEOMETRY_OVERFLOWED = 3134;
  exports2.ER_SQL_MODE_MERGED = 3135;
  exports2.ER_VTOKEN_PLUGIN_TOKEN_MISMATCH = 3136;
  exports2.ER_VTOKEN_PLUGIN_TOKEN_NOT_FOUND = 3137;
  exports2.ER_CANT_SET_VARIABLE_WHEN_OWNING_GTID = 3138;
  exports2.ER_SLAVE_CHANNEL_OPERATION_NOT_ALLOWED = 3139;
  exports2.ER_INVALID_JSON_TEXT = 3140;
  exports2.ER_INVALID_JSON_TEXT_IN_PARAM = 3141;
  exports2.ER_INVALID_JSON_BINARY_DATA = 3142;
  exports2.ER_INVALID_JSON_PATH = 3143;
  exports2.ER_INVALID_JSON_CHARSET = 3144;
  exports2.ER_INVALID_JSON_CHARSET_IN_FUNCTION = 3145;
  exports2.ER_INVALID_TYPE_FOR_JSON = 3146;
  exports2.ER_INVALID_CAST_TO_JSON = 3147;
  exports2.ER_INVALID_JSON_PATH_CHARSET = 3148;
  exports2.ER_INVALID_JSON_PATH_WILDCARD = 3149;
  exports2.ER_JSON_VALUE_TOO_BIG = 3150;
  exports2.ER_JSON_KEY_TOO_BIG = 3151;
  exports2.ER_JSON_USED_AS_KEY = 3152;
  exports2.ER_JSON_VACUOUS_PATH = 3153;
  exports2.ER_JSON_BAD_ONE_OR_ALL_ARG = 3154;
  exports2.ER_NUMERIC_JSON_VALUE_OUT_OF_RANGE = 3155;
  exports2.ER_INVALID_JSON_VALUE_FOR_CAST = 3156;
  exports2.ER_JSON_DOCUMENT_TOO_DEEP = 3157;
  exports2.ER_JSON_DOCUMENT_NULL_KEY = 3158;
  exports2.ER_SECURE_TRANSPORT_REQUIRED = 3159;
  exports2.ER_NO_SECURE_TRANSPORTS_CONFIGURED = 3160;
  exports2.ER_DISABLED_STORAGE_ENGINE = 3161;
  exports2.ER_USER_DOES_NOT_EXIST = 3162;
  exports2.ER_USER_ALREADY_EXISTS = 3163;
  exports2.ER_AUDIT_API_ABORT = 3164;
  exports2.ER_INVALID_JSON_PATH_ARRAY_CELL = 3165;
  exports2.ER_BUFPOOL_RESIZE_INPROGRESS = 3166;
  exports2.ER_FEATURE_DISABLED_SEE_DOC = 3167;
  exports2.ER_SERVER_ISNT_AVAILABLE = 3168;
  exports2.ER_SESSION_WAS_KILLED = 3169;
  exports2.ER_CAPACITY_EXCEEDED = 3170;
  exports2.ER_CAPACITY_EXCEEDED_IN_RANGE_OPTIMIZER = 3171;
  exports2.ER_TABLE_NEEDS_UPG_PART = 3172;
  exports2.ER_CANT_WAIT_FOR_EXECUTED_GTID_SET_WHILE_OWNING_A_GTID = 3173;
  exports2.ER_CANNOT_ADD_FOREIGN_BASE_COL_VIRTUAL = 3174;
  exports2.ER_CANNOT_CREATE_VIRTUAL_INDEX_CONSTRAINT = 3175;
  exports2.ER_ERROR_ON_MODIFYING_GTID_EXECUTED_TABLE = 3176;
  exports2.ER_LOCK_REFUSED_BY_ENGINE = 3177;
  exports2.ER_UNSUPPORTED_ALTER_ONLINE_ON_VIRTUAL_COLUMN = 3178;
  exports2.ER_MASTER_KEY_ROTATION_NOT_SUPPORTED_BY_SE = 3179;
  exports2.ER_MASTER_KEY_ROTATION_ERROR_BY_SE = 3180;
  exports2.ER_MASTER_KEY_ROTATION_BINLOG_FAILED = 3181;
  exports2.ER_MASTER_KEY_ROTATION_SE_UNAVAILABLE = 3182;
  exports2.ER_TABLESPACE_CANNOT_ENCRYPT = 3183;
  exports2.ER_INVALID_ENCRYPTION_OPTION = 3184;
  exports2.ER_CANNOT_FIND_KEY_IN_KEYRING = 3185;
  exports2.ER_CAPACITY_EXCEEDED_IN_PARSER = 3186;
  exports2.ER_UNSUPPORTED_ALTER_ENCRYPTION_INPLACE = 3187;
  exports2.ER_KEYRING_UDF_KEYRING_SERVICE_ERROR = 3188;
  exports2.ER_USER_COLUMN_OLD_LENGTH = 3189;
  exports2.ER_CANT_RESET_MASTER = 3190;
  exports2.ER_GROUP_REPLICATION_MAX_GROUP_SIZE = 3191;
  exports2.ER_CANNOT_ADD_FOREIGN_BASE_COL_STORED = 3192;
  exports2.ER_TABLE_REFERENCED = 3193;
  exports2.ER_PARTITION_ENGINE_DEPRECATED_FOR_TABLE = 3194;
  exports2.ER_WARN_USING_GEOMFROMWKB_TO_SET_SRID_ZERO = 3195;
  exports2.ER_WARN_USING_GEOMFROMWKB_TO_SET_SRID = 3196;
  exports2.ER_XA_RETRY = 3197;
  exports2.ER_KEYRING_AWS_UDF_AWS_KMS_ERROR = 3198;
  exports2.ER_BINLOG_UNSAFE_XA = 3199;
  exports2.ER_UDF_ERROR = 3200;
  exports2.ER_KEYRING_MIGRATION_FAILURE = 3201;
  exports2.ER_KEYRING_ACCESS_DENIED_ERROR = 3202;
  exports2.ER_KEYRING_MIGRATION_STATUS = 3203;
  exports2.ER_PLUGIN_FAILED_TO_OPEN_TABLES = 3204;
  exports2.ER_PLUGIN_FAILED_TO_OPEN_TABLE = 3205;
  exports2.ER_AUDIT_LOG_NO_KEYRING_PLUGIN_INSTALLED = 3206;
  exports2.ER_AUDIT_LOG_ENCRYPTION_PASSWORD_HAS_NOT_BEEN_SET = 3207;
  exports2.ER_AUDIT_LOG_COULD_NOT_CREATE_AES_KEY = 3208;
  exports2.ER_AUDIT_LOG_ENCRYPTION_PASSWORD_CANNOT_BE_FETCHED = 3209;
  exports2.ER_AUDIT_LOG_JSON_FILTERING_NOT_ENABLED = 3210;
  exports2.ER_AUDIT_LOG_UDF_INSUFFICIENT_PRIVILEGE = 3211;
  exports2.ER_AUDIT_LOG_SUPER_PRIVILEGE_REQUIRED = 3212;
  exports2.ER_COULD_NOT_REINITIALIZE_AUDIT_LOG_FILTERS = 3213;
  exports2.ER_AUDIT_LOG_UDF_INVALID_ARGUMENT_TYPE = 3214;
  exports2.ER_AUDIT_LOG_UDF_INVALID_ARGUMENT_COUNT = 3215;
  exports2.ER_AUDIT_LOG_HAS_NOT_BEEN_INSTALLED = 3216;
  exports2.ER_AUDIT_LOG_UDF_READ_INVALID_MAX_ARRAY_LENGTH_ARG_TYPE = 3217;
  exports2.ER_AUDIT_LOG_UDF_READ_INVALID_MAX_ARRAY_LENGTH_ARG_VALUE = 3218;
  exports2.ER_AUDIT_LOG_JSON_FILTER_PARSING_ERROR = 3219;
  exports2.ER_AUDIT_LOG_JSON_FILTER_NAME_CANNOT_BE_EMPTY = 3220;
  exports2.ER_AUDIT_LOG_JSON_USER_NAME_CANNOT_BE_EMPTY = 3221;
  exports2.ER_AUDIT_LOG_JSON_FILTER_DOES_NOT_EXISTS = 3222;
  exports2.ER_AUDIT_LOG_USER_FIRST_CHARACTER_MUST_BE_ALPHANUMERIC = 3223;
  exports2.ER_AUDIT_LOG_USER_NAME_INVALID_CHARACTER = 3224;
  exports2.ER_AUDIT_LOG_HOST_NAME_INVALID_CHARACTER = 3225;
  exports2.WARN_DEPRECATED_MAXDB_SQL_MODE_FOR_TIMESTAMP = 3226;
  exports2.ER_XA_REPLICATION_FILTERS = 3227;
  exports2.ER_CANT_OPEN_ERROR_LOG = 3228;
  exports2.ER_GROUPING_ON_TIMESTAMP_IN_DST = 3229;
  exports2.ER_CANT_START_SERVER_NAMED_PIPE = 3230;
  exports2[1] = "EE_CANTCREATEFILE";
  exports2[2] = "EE_READ";
  exports2[3] = "EE_WRITE";
  exports2[4] = "EE_BADCLOSE";
  exports2[5] = "EE_OUTOFMEMORY";
  exports2[6] = "EE_DELETE";
  exports2[7] = "EE_LINK";
  exports2[9] = "EE_EOFERR";
  exports2[10] = "EE_CANTLOCK";
  exports2[11] = "EE_CANTUNLOCK";
  exports2[12] = "EE_DIR";
  exports2[13] = "EE_STAT";
  exports2[14] = "EE_CANT_CHSIZE";
  exports2[15] = "EE_CANT_OPEN_STREAM";
  exports2[16] = "EE_GETWD";
  exports2[17] = "EE_SETWD";
  exports2[18] = "EE_LINK_WARNING";
  exports2[19] = "EE_OPEN_WARNING";
  exports2[20] = "EE_DISK_FULL";
  exports2[21] = "EE_CANT_MKDIR";
  exports2[22] = "EE_UNKNOWN_CHARSET";
  exports2[23] = "EE_OUT_OF_FILERESOURCES";
  exports2[24] = "EE_CANT_READLINK";
  exports2[25] = "EE_CANT_SYMLINK";
  exports2[26] = "EE_REALPATH";
  exports2[27] = "EE_SYNC";
  exports2[28] = "EE_UNKNOWN_COLLATION";
  exports2[29] = "EE_FILENOTFOUND";
  exports2[30] = "EE_FILE_NOT_CLOSED";
  exports2[31] = "EE_CHANGE_OWNERSHIP";
  exports2[32] = "EE_CHANGE_PERMISSIONS";
  exports2[33] = "EE_CANT_SEEK";
  exports2[34] = "EE_CAPACITY_EXCEEDED";
  exports2[120] = "HA_ERR_KEY_NOT_FOUND";
  exports2[121] = "HA_ERR_FOUND_DUPP_KEY";
  exports2[122] = "HA_ERR_INTERNAL_ERROR";
  exports2[123] = "HA_ERR_RECORD_CHANGED";
  exports2[124] = "HA_ERR_WRONG_INDEX";
  exports2[126] = "HA_ERR_CRASHED";
  exports2[127] = "HA_ERR_WRONG_IN_RECORD";
  exports2[128] = "HA_ERR_OUT_OF_MEM";
  exports2[130] = "HA_ERR_NOT_A_TABLE";
  exports2[131] = "HA_ERR_WRONG_COMMAND";
  exports2[132] = "HA_ERR_OLD_FILE";
  exports2[133] = "HA_ERR_NO_ACTIVE_RECORD";
  exports2[134] = "HA_ERR_RECORD_DELETED";
  exports2[135] = "HA_ERR_RECORD_FILE_FULL";
  exports2[136] = "HA_ERR_INDEX_FILE_FULL";
  exports2[137] = "HA_ERR_END_OF_FILE";
  exports2[138] = "HA_ERR_UNSUPPORTED";
  exports2[139] = "HA_ERR_TOO_BIG_ROW";
  exports2[140] = "HA_WRONG_CREATE_OPTION";
  exports2[141] = "HA_ERR_FOUND_DUPP_UNIQUE";
  exports2[142] = "HA_ERR_UNKNOWN_CHARSET";
  exports2[143] = "HA_ERR_WRONG_MRG_TABLE_DEF";
  exports2[144] = "HA_ERR_CRASHED_ON_REPAIR";
  exports2[145] = "HA_ERR_CRASHED_ON_USAGE";
  exports2[146] = "HA_ERR_LOCK_WAIT_TIMEOUT";
  exports2[147] = "HA_ERR_LOCK_TABLE_FULL";
  exports2[148] = "HA_ERR_READ_ONLY_TRANSACTION";
  exports2[149] = "HA_ERR_LOCK_DEADLOCK";
  exports2[150] = "HA_ERR_CANNOT_ADD_FOREIGN";
  exports2[151] = "HA_ERR_NO_REFERENCED_ROW";
  exports2[152] = "HA_ERR_ROW_IS_REFERENCED";
  exports2[153] = "HA_ERR_NO_SAVEPOINT";
  exports2[154] = "HA_ERR_NON_UNIQUE_BLOCK_SIZE";
  exports2[155] = "HA_ERR_NO_SUCH_TABLE";
  exports2[156] = "HA_ERR_TABLE_EXIST";
  exports2[157] = "HA_ERR_NO_CONNECTION";
  exports2[158] = "HA_ERR_NULL_IN_SPATIAL";
  exports2[159] = "HA_ERR_TABLE_DEF_CHANGED";
  exports2[160] = "HA_ERR_NO_PARTITION_FOUND";
  exports2[161] = "HA_ERR_RBR_LOGGING_FAILED";
  exports2[162] = "HA_ERR_DROP_INDEX_FK";
  exports2[163] = "HA_ERR_FOREIGN_DUPLICATE_KEY";
  exports2[164] = "HA_ERR_TABLE_NEEDS_UPGRADE";
  exports2[165] = "HA_ERR_TABLE_READONLY";
  exports2[166] = "HA_ERR_AUTOINC_READ_FAILED";
  exports2[167] = "HA_ERR_AUTOINC_ERANGE";
  exports2[168] = "HA_ERR_GENERIC";
  exports2[169] = "HA_ERR_RECORD_IS_THE_SAME";
  exports2[170] = "HA_ERR_LOGGING_IMPOSSIBLE";
  exports2[171] = "HA_ERR_CORRUPT_EVENT";
  exports2[172] = "HA_ERR_NEW_FILE";
  exports2[173] = "HA_ERR_ROWS_EVENT_APPLY";
  exports2[174] = "HA_ERR_INITIALIZATION";
  exports2[175] = "HA_ERR_FILE_TOO_SHORT";
  exports2[176] = "HA_ERR_WRONG_CRC";
  exports2[177] = "HA_ERR_TOO_MANY_CONCURRENT_TRXS";
  exports2[178] = "HA_ERR_NOT_IN_LOCK_PARTITIONS";
  exports2[179] = "HA_ERR_INDEX_COL_TOO_LONG";
  exports2[180] = "HA_ERR_INDEX_CORRUPT";
  exports2[181] = "HA_ERR_UNDO_REC_TOO_BIG";
  exports2[182] = "HA_FTS_INVALID_DOCID";
  exports2[183] = "HA_ERR_TABLE_IN_FK_CHECK";
  exports2[184] = "HA_ERR_TABLESPACE_EXISTS";
  exports2[185] = "HA_ERR_TOO_MANY_FIELDS";
  exports2[186] = "HA_ERR_ROW_IN_WRONG_PARTITION";
  exports2[187] = "HA_ERR_INNODB_READ_ONLY";
  exports2[188] = "HA_ERR_FTS_EXCEED_RESULT_CACHE_LIMIT";
  exports2[189] = "HA_ERR_TEMP_FILE_WRITE_FAILURE";
  exports2[190] = "HA_ERR_INNODB_FORCED_RECOVERY";
  exports2[191] = "HA_ERR_FTS_TOO_MANY_WORDS_IN_PHRASE";
  exports2[192] = "HA_ERR_FK_DEPTH_EXCEEDED";
  exports2[193] = "HA_MISSING_CREATE_OPTION";
  exports2[194] = "HA_ERR_SE_OUT_OF_MEMORY";
  exports2[195] = "HA_ERR_TABLE_CORRUPT";
  exports2[196] = "HA_ERR_QUERY_INTERRUPTED";
  exports2[197] = "HA_ERR_TABLESPACE_MISSING";
  exports2[198] = "HA_ERR_TABLESPACE_IS_NOT_EMPTY";
  exports2[199] = "HA_ERR_WRONG_FILE_NAME";
  exports2[200] = "HA_ERR_NOT_ALLOWED_COMMAND";
  exports2[201] = "HA_ERR_COMPUTE_FAILED";
  exports2[1e3] = "ER_HASHCHK";
  exports2[1001] = "ER_NISAMCHK";
  exports2[1002] = "ER_NO";
  exports2[1003] = "ER_YES";
  exports2[1004] = "ER_CANT_CREATE_FILE";
  exports2[1005] = "ER_CANT_CREATE_TABLE";
  exports2[1006] = "ER_CANT_CREATE_DB";
  exports2[1007] = "ER_DB_CREATE_EXISTS";
  exports2[1008] = "ER_DB_DROP_EXISTS";
  exports2[1009] = "ER_DB_DROP_DELETE";
  exports2[1010] = "ER_DB_DROP_RMDIR";
  exports2[1011] = "ER_CANT_DELETE_FILE";
  exports2[1012] = "ER_CANT_FIND_SYSTEM_REC";
  exports2[1013] = "ER_CANT_GET_STAT";
  exports2[1014] = "ER_CANT_GET_WD";
  exports2[1015] = "ER_CANT_LOCK";
  exports2[1016] = "ER_CANT_OPEN_FILE";
  exports2[1017] = "ER_FILE_NOT_FOUND";
  exports2[1018] = "ER_CANT_READ_DIR";
  exports2[1019] = "ER_CANT_SET_WD";
  exports2[1020] = "ER_CHECKREAD";
  exports2[1021] = "ER_DISK_FULL";
  exports2[1022] = "ER_DUP_KEY";
  exports2[1023] = "ER_ERROR_ON_CLOSE";
  exports2[1024] = "ER_ERROR_ON_READ";
  exports2[1025] = "ER_ERROR_ON_RENAME";
  exports2[1026] = "ER_ERROR_ON_WRITE";
  exports2[1027] = "ER_FILE_USED";
  exports2[1028] = "ER_FILSORT_ABORT";
  exports2[1029] = "ER_FORM_NOT_FOUND";
  exports2[1030] = "ER_GET_ERRNO";
  exports2[1031] = "ER_ILLEGAL_HA";
  exports2[1032] = "ER_KEY_NOT_FOUND";
  exports2[1033] = "ER_NOT_FORM_FILE";
  exports2[1034] = "ER_NOT_KEYFILE";
  exports2[1035] = "ER_OLD_KEYFILE";
  exports2[1036] = "ER_OPEN_AS_READONLY";
  exports2[1037] = "ER_OUTOFMEMORY";
  exports2[1038] = "ER_OUT_OF_SORTMEMORY";
  exports2[1039] = "ER_UNEXPECTED_EOF";
  exports2[1040] = "ER_CON_COUNT_ERROR";
  exports2[1041] = "ER_OUT_OF_RESOURCES";
  exports2[1042] = "ER_BAD_HOST_ERROR";
  exports2[1043] = "ER_HANDSHAKE_ERROR";
  exports2[1044] = "ER_DBACCESS_DENIED_ERROR";
  exports2[1045] = "ER_ACCESS_DENIED_ERROR";
  exports2[1046] = "ER_NO_DB_ERROR";
  exports2[1047] = "ER_UNKNOWN_COM_ERROR";
  exports2[1048] = "ER_BAD_NULL_ERROR";
  exports2[1049] = "ER_BAD_DB_ERROR";
  exports2[1050] = "ER_TABLE_EXISTS_ERROR";
  exports2[1051] = "ER_BAD_TABLE_ERROR";
  exports2[1052] = "ER_NON_UNIQ_ERROR";
  exports2[1053] = "ER_SERVER_SHUTDOWN";
  exports2[1054] = "ER_BAD_FIELD_ERROR";
  exports2[1055] = "ER_WRONG_FIELD_WITH_GROUP";
  exports2[1056] = "ER_WRONG_GROUP_FIELD";
  exports2[1057] = "ER_WRONG_SUM_SELECT";
  exports2[1058] = "ER_WRONG_VALUE_COUNT";
  exports2[1059] = "ER_TOO_LONG_IDENT";
  exports2[1060] = "ER_DUP_FIELDNAME";
  exports2[1061] = "ER_DUP_KEYNAME";
  exports2[1062] = "ER_DUP_ENTRY";
  exports2[1063] = "ER_WRONG_FIELD_SPEC";
  exports2[1064] = "ER_PARSE_ERROR";
  exports2[1065] = "ER_EMPTY_QUERY";
  exports2[1066] = "ER_NONUNIQ_TABLE";
  exports2[1067] = "ER_INVALID_DEFAULT";
  exports2[1068] = "ER_MULTIPLE_PRI_KEY";
  exports2[1069] = "ER_TOO_MANY_KEYS";
  exports2[1070] = "ER_TOO_MANY_KEY_PARTS";
  exports2[1071] = "ER_TOO_LONG_KEY";
  exports2[1072] = "ER_KEY_COLUMN_DOES_NOT_EXITS";
  exports2[1073] = "ER_BLOB_USED_AS_KEY";
  exports2[1074] = "ER_TOO_BIG_FIELDLENGTH";
  exports2[1075] = "ER_WRONG_AUTO_KEY";
  exports2[1076] = "ER_READY";
  exports2[1077] = "ER_NORMAL_SHUTDOWN";
  exports2[1078] = "ER_GOT_SIGNAL";
  exports2[1079] = "ER_SHUTDOWN_COMPLETE";
  exports2[1080] = "ER_FORCING_CLOSE";
  exports2[1081] = "ER_IPSOCK_ERROR";
  exports2[1082] = "ER_NO_SUCH_INDEX";
  exports2[1083] = "ER_WRONG_FIELD_TERMINATORS";
  exports2[1084] = "ER_BLOBS_AND_NO_TERMINATED";
  exports2[1085] = "ER_TEXTFILE_NOT_READABLE";
  exports2[1086] = "ER_FILE_EXISTS_ERROR";
  exports2[1087] = "ER_LOAD_INFO";
  exports2[1088] = "ER_ALTER_INFO";
  exports2[1089] = "ER_WRONG_SUB_KEY";
  exports2[1090] = "ER_CANT_REMOVE_ALL_FIELDS";
  exports2[1091] = "ER_CANT_DROP_FIELD_OR_KEY";
  exports2[1092] = "ER_INSERT_INFO";
  exports2[1093] = "ER_UPDATE_TABLE_USED";
  exports2[1094] = "ER_NO_SUCH_THREAD";
  exports2[1095] = "ER_KILL_DENIED_ERROR";
  exports2[1096] = "ER_NO_TABLES_USED";
  exports2[1097] = "ER_TOO_BIG_SET";
  exports2[1098] = "ER_NO_UNIQUE_LOGFILE";
  exports2[1099] = "ER_TABLE_NOT_LOCKED_FOR_WRITE";
  exports2[1100] = "ER_TABLE_NOT_LOCKED";
  exports2[1101] = "ER_BLOB_CANT_HAVE_DEFAULT";
  exports2[1102] = "ER_WRONG_DB_NAME";
  exports2[1103] = "ER_WRONG_TABLE_NAME";
  exports2[1104] = "ER_TOO_BIG_SELECT";
  exports2[1105] = "ER_UNKNOWN_ERROR";
  exports2[1106] = "ER_UNKNOWN_PROCEDURE";
  exports2[1107] = "ER_WRONG_PARAMCOUNT_TO_PROCEDURE";
  exports2[1108] = "ER_WRONG_PARAMETERS_TO_PROCEDURE";
  exports2[1109] = "ER_UNKNOWN_TABLE";
  exports2[1110] = "ER_FIELD_SPECIFIED_TWICE";
  exports2[1111] = "ER_INVALID_GROUP_FUNC_USE";
  exports2[1112] = "ER_UNSUPPORTED_EXTENSION";
  exports2[1113] = "ER_TABLE_MUST_HAVE_COLUMNS";
  exports2[1114] = "ER_RECORD_FILE_FULL";
  exports2[1115] = "ER_UNKNOWN_CHARACTER_SET";
  exports2[1116] = "ER_TOO_MANY_TABLES";
  exports2[1117] = "ER_TOO_MANY_FIELDS";
  exports2[1118] = "ER_TOO_BIG_ROWSIZE";
  exports2[1119] = "ER_STACK_OVERRUN";
  exports2[1120] = "ER_WRONG_OUTER_JOIN";
  exports2[1121] = "ER_NULL_COLUMN_IN_INDEX";
  exports2[1122] = "ER_CANT_FIND_UDF";
  exports2[1123] = "ER_CANT_INITIALIZE_UDF";
  exports2[1124] = "ER_UDF_NO_PATHS";
  exports2[1125] = "ER_UDF_EXISTS";
  exports2[1126] = "ER_CANT_OPEN_LIBRARY";
  exports2[1127] = "ER_CANT_FIND_DL_ENTRY";
  exports2[1128] = "ER_FUNCTION_NOT_DEFINED";
  exports2[1129] = "ER_HOST_IS_BLOCKED";
  exports2[1130] = "ER_HOST_NOT_PRIVILEGED";
  exports2[1131] = "ER_PASSWORD_ANONYMOUS_USER";
  exports2[1132] = "ER_PASSWORD_NOT_ALLOWED";
  exports2[1133] = "ER_PASSWORD_NO_MATCH";
  exports2[1134] = "ER_UPDATE_INFO";
  exports2[1135] = "ER_CANT_CREATE_THREAD";
  exports2[1136] = "ER_WRONG_VALUE_COUNT_ON_ROW";
  exports2[1137] = "ER_CANT_REOPEN_TABLE";
  exports2[1138] = "ER_INVALID_USE_OF_NULL";
  exports2[1139] = "ER_REGEXP_ERROR";
  exports2[1140] = "ER_MIX_OF_GROUP_FUNC_AND_FIELDS";
  exports2[1141] = "ER_NONEXISTING_GRANT";
  exports2[1142] = "ER_TABLEACCESS_DENIED_ERROR";
  exports2[1143] = "ER_COLUMNACCESS_DENIED_ERROR";
  exports2[1144] = "ER_ILLEGAL_GRANT_FOR_TABLE";
  exports2[1145] = "ER_GRANT_WRONG_HOST_OR_USER";
  exports2[1146] = "ER_NO_SUCH_TABLE";
  exports2[1147] = "ER_NONEXISTING_TABLE_GRANT";
  exports2[1148] = "ER_NOT_ALLOWED_COMMAND";
  exports2[1149] = "ER_SYNTAX_ERROR";
  exports2[1150] = "ER_DELAYED_CANT_CHANGE_LOCK";
  exports2[1151] = "ER_TOO_MANY_DELAYED_THREADS";
  exports2[1152] = "ER_ABORTING_CONNECTION";
  exports2[1153] = "ER_NET_PACKET_TOO_LARGE";
  exports2[1154] = "ER_NET_READ_ERROR_FROM_PIPE";
  exports2[1155] = "ER_NET_FCNTL_ERROR";
  exports2[1156] = "ER_NET_PACKETS_OUT_OF_ORDER";
  exports2[1157] = "ER_NET_UNCOMPRESS_ERROR";
  exports2[1158] = "ER_NET_READ_ERROR";
  exports2[1159] = "ER_NET_READ_INTERRUPTED";
  exports2[1160] = "ER_NET_ERROR_ON_WRITE";
  exports2[1161] = "ER_NET_WRITE_INTERRUPTED";
  exports2[1162] = "ER_TOO_LONG_STRING";
  exports2[1163] = "ER_TABLE_CANT_HANDLE_BLOB";
  exports2[1164] = "ER_TABLE_CANT_HANDLE_AUTO_INCREMENT";
  exports2[1165] = "ER_DELAYED_INSERT_TABLE_LOCKED";
  exports2[1166] = "ER_WRONG_COLUMN_NAME";
  exports2[1167] = "ER_WRONG_KEY_COLUMN";
  exports2[1168] = "ER_WRONG_MRG_TABLE";
  exports2[1169] = "ER_DUP_UNIQUE";
  exports2[1170] = "ER_BLOB_KEY_WITHOUT_LENGTH";
  exports2[1171] = "ER_PRIMARY_CANT_HAVE_NULL";
  exports2[1172] = "ER_TOO_MANY_ROWS";
  exports2[1173] = "ER_REQUIRES_PRIMARY_KEY";
  exports2[1174] = "ER_NO_RAID_COMPILED";
  exports2[1175] = "ER_UPDATE_WITHOUT_KEY_IN_SAFE_MODE";
  exports2[1176] = "ER_KEY_DOES_NOT_EXITS";
  exports2[1177] = "ER_CHECK_NO_SUCH_TABLE";
  exports2[1178] = "ER_CHECK_NOT_IMPLEMENTED";
  exports2[1179] = "ER_CANT_DO_THIS_DURING_AN_TRANSACTION";
  exports2[1180] = "ER_ERROR_DURING_COMMIT";
  exports2[1181] = "ER_ERROR_DURING_ROLLBACK";
  exports2[1182] = "ER_ERROR_DURING_FLUSH_LOGS";
  exports2[1183] = "ER_ERROR_DURING_CHECKPOINT";
  exports2[1184] = "ER_NEW_ABORTING_CONNECTION";
  exports2[1185] = "ER_DUMP_NOT_IMPLEMENTED";
  exports2[1186] = "ER_FLUSH_MASTER_BINLOG_CLOSED";
  exports2[1187] = "ER_INDEX_REBUILD";
  exports2[1188] = "ER_MASTER";
  exports2[1189] = "ER_MASTER_NET_READ";
  exports2[1190] = "ER_MASTER_NET_WRITE";
  exports2[1191] = "ER_FT_MATCHING_KEY_NOT_FOUND";
  exports2[1192] = "ER_LOCK_OR_ACTIVE_TRANSACTION";
  exports2[1193] = "ER_UNKNOWN_SYSTEM_VARIABLE";
  exports2[1194] = "ER_CRASHED_ON_USAGE";
  exports2[1195] = "ER_CRASHED_ON_REPAIR";
  exports2[1196] = "ER_WARNING_NOT_COMPLETE_ROLLBACK";
  exports2[1197] = "ER_TRANS_CACHE_FULL";
  exports2[1198] = "ER_SLAVE_MUST_STOP";
  exports2[1199] = "ER_SLAVE_NOT_RUNNING";
  exports2[1200] = "ER_BAD_SLAVE";
  exports2[1201] = "ER_MASTER_INFO";
  exports2[1202] = "ER_SLAVE_THREAD";
  exports2[1203] = "ER_TOO_MANY_USER_CONNECTIONS";
  exports2[1204] = "ER_SET_CONSTANTS_ONLY";
  exports2[1205] = "ER_LOCK_WAIT_TIMEOUT";
  exports2[1206] = "ER_LOCK_TABLE_FULL";
  exports2[1207] = "ER_READ_ONLY_TRANSACTION";
  exports2[1208] = "ER_DROP_DB_WITH_READ_LOCK";
  exports2[1209] = "ER_CREATE_DB_WITH_READ_LOCK";
  exports2[1210] = "ER_WRONG_ARGUMENTS";
  exports2[1211] = "ER_NO_PERMISSION_TO_CREATE_USER";
  exports2[1212] = "ER_UNION_TABLES_IN_DIFFERENT_DIR";
  exports2[1213] = "ER_LOCK_DEADLOCK";
  exports2[1214] = "ER_TABLE_CANT_HANDLE_FT";
  exports2[1215] = "ER_CANNOT_ADD_FOREIGN";
  exports2[1216] = "ER_NO_REFERENCED_ROW";
  exports2[1217] = "ER_ROW_IS_REFERENCED";
  exports2[1218] = "ER_CONNECT_TO_MASTER";
  exports2[1219] = "ER_QUERY_ON_MASTER";
  exports2[1220] = "ER_ERROR_WHEN_EXECUTING_COMMAND";
  exports2[1221] = "ER_WRONG_USAGE";
  exports2[1222] = "ER_WRONG_NUMBER_OF_COLUMNS_IN_SELECT";
  exports2[1223] = "ER_CANT_UPDATE_WITH_READLOCK";
  exports2[1224] = "ER_MIXING_NOT_ALLOWED";
  exports2[1225] = "ER_DUP_ARGUMENT";
  exports2[1226] = "ER_USER_LIMIT_REACHED";
  exports2[1227] = "ER_SPECIFIC_ACCESS_DENIED_ERROR";
  exports2[1228] = "ER_LOCAL_VARIABLE";
  exports2[1229] = "ER_GLOBAL_VARIABLE";
  exports2[1230] = "ER_NO_DEFAULT";
  exports2[1231] = "ER_WRONG_VALUE_FOR_VAR";
  exports2[1232] = "ER_WRONG_TYPE_FOR_VAR";
  exports2[1233] = "ER_VAR_CANT_BE_READ";
  exports2[1234] = "ER_CANT_USE_OPTION_HERE";
  exports2[1235] = "ER_NOT_SUPPORTED_YET";
  exports2[1236] = "ER_MASTER_FATAL_ERROR_READING_BINLOG";
  exports2[1237] = "ER_SLAVE_IGNORED_TABLE";
  exports2[1238] = "ER_INCORRECT_GLOBAL_LOCAL_VAR";
  exports2[1239] = "ER_WRONG_FK_DEF";
  exports2[1240] = "ER_KEY_REF_DO_NOT_MATCH_TABLE_REF";
  exports2[1241] = "ER_OPERAND_COLUMNS";
  exports2[1242] = "ER_SUBQUERY_NO_1_ROW";
  exports2[1243] = "ER_UNKNOWN_STMT_HANDLER";
  exports2[1244] = "ER_CORRUPT_HELP_DB";
  exports2[1245] = "ER_CYCLIC_REFERENCE";
  exports2[1246] = "ER_AUTO_CONVERT";
  exports2[1247] = "ER_ILLEGAL_REFERENCE";
  exports2[1248] = "ER_DERIVED_MUST_HAVE_ALIAS";
  exports2[1249] = "ER_SELECT_REDUCED";
  exports2[1250] = "ER_TABLENAME_NOT_ALLOWED_HERE";
  exports2[1251] = "ER_NOT_SUPPORTED_AUTH_MODE";
  exports2[1252] = "ER_SPATIAL_CANT_HAVE_NULL";
  exports2[1253] = "ER_COLLATION_CHARSET_MISMATCH";
  exports2[1254] = "ER_SLAVE_WAS_RUNNING";
  exports2[1255] = "ER_SLAVE_WAS_NOT_RUNNING";
  exports2[1256] = "ER_TOO_BIG_FOR_UNCOMPRESS";
  exports2[1257] = "ER_ZLIB_Z_MEM_ERROR";
  exports2[1258] = "ER_ZLIB_Z_BUF_ERROR";
  exports2[1259] = "ER_ZLIB_Z_DATA_ERROR";
  exports2[1260] = "ER_CUT_VALUE_GROUP_CONCAT";
  exports2[1261] = "ER_WARN_TOO_FEW_RECORDS";
  exports2[1262] = "ER_WARN_TOO_MANY_RECORDS";
  exports2[1263] = "ER_WARN_NULL_TO_NOTNULL";
  exports2[1264] = "ER_WARN_DATA_OUT_OF_RANGE";
  exports2[1265] = "WARN_DATA_TRUNCATED";
  exports2[1266] = "ER_WARN_USING_OTHER_HANDLER";
  exports2[1267] = "ER_CANT_AGGREGATE_2COLLATIONS";
  exports2[1268] = "ER_DROP_USER";
  exports2[1269] = "ER_REVOKE_GRANTS";
  exports2[1270] = "ER_CANT_AGGREGATE_3COLLATIONS";
  exports2[1271] = "ER_CANT_AGGREGATE_NCOLLATIONS";
  exports2[1272] = "ER_VARIABLE_IS_NOT_STRUCT";
  exports2[1273] = "ER_UNKNOWN_COLLATION";
  exports2[1274] = "ER_SLAVE_IGNORED_SSL_PARAMS";
  exports2[1275] = "ER_SERVER_IS_IN_SECURE_AUTH_MODE";
  exports2[1276] = "ER_WARN_FIELD_RESOLVED";
  exports2[1277] = "ER_BAD_SLAVE_UNTIL_COND";
  exports2[1278] = "ER_MISSING_SKIP_SLAVE";
  exports2[1279] = "ER_UNTIL_COND_IGNORED";
  exports2[1280] = "ER_WRONG_NAME_FOR_INDEX";
  exports2[1281] = "ER_WRONG_NAME_FOR_CATALOG";
  exports2[1282] = "ER_WARN_QC_RESIZE";
  exports2[1283] = "ER_BAD_FT_COLUMN";
  exports2[1284] = "ER_UNKNOWN_KEY_CACHE";
  exports2[1285] = "ER_WARN_HOSTNAME_WONT_WORK";
  exports2[1286] = "ER_UNKNOWN_STORAGE_ENGINE";
  exports2[1287] = "ER_WARN_DEPRECATED_SYNTAX";
  exports2[1288] = "ER_NON_UPDATABLE_TABLE";
  exports2[1289] = "ER_FEATURE_DISABLED";
  exports2[1290] = "ER_OPTION_PREVENTS_STATEMENT";
  exports2[1291] = "ER_DUPLICATED_VALUE_IN_TYPE";
  exports2[1292] = "ER_TRUNCATED_WRONG_VALUE";
  exports2[1293] = "ER_TOO_MUCH_AUTO_TIMESTAMP_COLS";
  exports2[1294] = "ER_INVALID_ON_UPDATE";
  exports2[1295] = "ER_UNSUPPORTED_PS";
  exports2[1296] = "ER_GET_ERRMSG";
  exports2[1297] = "ER_GET_TEMPORARY_ERRMSG";
  exports2[1298] = "ER_UNKNOWN_TIME_ZONE";
  exports2[1299] = "ER_WARN_INVALID_TIMESTAMP";
  exports2[1300] = "ER_INVALID_CHARACTER_STRING";
  exports2[1301] = "ER_WARN_ALLOWED_PACKET_OVERFLOWED";
  exports2[1302] = "ER_CONFLICTING_DECLARATIONS";
  exports2[1303] = "ER_SP_NO_RECURSIVE_CREATE";
  exports2[1304] = "ER_SP_ALREADY_EXISTS";
  exports2[1305] = "ER_SP_DOES_NOT_EXIST";
  exports2[1306] = "ER_SP_DROP_FAILED";
  exports2[1307] = "ER_SP_STORE_FAILED";
  exports2[1308] = "ER_SP_LILABEL_MISMATCH";
  exports2[1309] = "ER_SP_LABEL_REDEFINE";
  exports2[1310] = "ER_SP_LABEL_MISMATCH";
  exports2[1311] = "ER_SP_UNINIT_VAR";
  exports2[1312] = "ER_SP_BADSELECT";
  exports2[1313] = "ER_SP_BADRETURN";
  exports2[1314] = "ER_SP_BADSTATEMENT";
  exports2[1315] = "ER_UPDATE_LOG_DEPRECATED_IGNORED";
  exports2[1316] = "ER_UPDATE_LOG_DEPRECATED_TRANSLATED";
  exports2[1317] = "ER_QUERY_INTERRUPTED";
  exports2[1318] = "ER_SP_WRONG_NO_OF_ARGS";
  exports2[1319] = "ER_SP_COND_MISMATCH";
  exports2[1320] = "ER_SP_NORETURN";
  exports2[1321] = "ER_SP_NORETURNEND";
  exports2[1322] = "ER_SP_BAD_CURSOR_QUERY";
  exports2[1323] = "ER_SP_BAD_CURSOR_SELECT";
  exports2[1324] = "ER_SP_CURSOR_MISMATCH";
  exports2[1325] = "ER_SP_CURSOR_ALREADY_OPEN";
  exports2[1326] = "ER_SP_CURSOR_NOT_OPEN";
  exports2[1327] = "ER_SP_UNDECLARED_VAR";
  exports2[1328] = "ER_SP_WRONG_NO_OF_FETCH_ARGS";
  exports2[1329] = "ER_SP_FETCH_NO_DATA";
  exports2[1330] = "ER_SP_DUP_PARAM";
  exports2[1331] = "ER_SP_DUP_VAR";
  exports2[1332] = "ER_SP_DUP_COND";
  exports2[1333] = "ER_SP_DUP_CURS";
  exports2[1334] = "ER_SP_CANT_ALTER";
  exports2[1335] = "ER_SP_SUBSELECT_NYI";
  exports2[1336] = "ER_STMT_NOT_ALLOWED_IN_SF_OR_TRG";
  exports2[1337] = "ER_SP_VARCOND_AFTER_CURSHNDLR";
  exports2[1338] = "ER_SP_CURSOR_AFTER_HANDLER";
  exports2[1339] = "ER_SP_CASE_NOT_FOUND";
  exports2[1340] = "ER_FPARSER_TOO_BIG_FILE";
  exports2[1341] = "ER_FPARSER_BAD_HEADER";
  exports2[1342] = "ER_FPARSER_EOF_IN_COMMENT";
  exports2[1343] = "ER_FPARSER_ERROR_IN_PARAMETER";
  exports2[1344] = "ER_FPARSER_EOF_IN_UNKNOWN_PARAMETER";
  exports2[1345] = "ER_VIEW_NO_EXPLAIN";
  exports2[1346] = "ER_FRM_UNKNOWN_TYPE";
  exports2[1347] = "ER_WRONG_OBJECT";
  exports2[1348] = "ER_NONUPDATEABLE_COLUMN";
  exports2[1349] = "ER_VIEW_SELECT_DERIVED";
  exports2[1350] = "ER_VIEW_SELECT_CLAUSE";
  exports2[1351] = "ER_VIEW_SELECT_VARIABLE";
  exports2[1352] = "ER_VIEW_SELECT_TMPTABLE";
  exports2[1353] = "ER_VIEW_WRONG_LIST";
  exports2[1354] = "ER_WARN_VIEW_MERGE";
  exports2[1355] = "ER_WARN_VIEW_WITHOUT_KEY";
  exports2[1356] = "ER_VIEW_INVALID";
  exports2[1357] = "ER_SP_NO_DROP_SP";
  exports2[1358] = "ER_SP_GOTO_IN_HNDLR";
  exports2[1359] = "ER_TRG_ALREADY_EXISTS";
  exports2[1360] = "ER_TRG_DOES_NOT_EXIST";
  exports2[1361] = "ER_TRG_ON_VIEW_OR_TEMP_TABLE";
  exports2[1362] = "ER_TRG_CANT_CHANGE_ROW";
  exports2[1363] = "ER_TRG_NO_SUCH_ROW_IN_TRG";
  exports2[1364] = "ER_NO_DEFAULT_FOR_FIELD";
  exports2[1365] = "ER_DIVISION_BY_ZERO";
  exports2[1366] = "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD";
  exports2[1367] = "ER_ILLEGAL_VALUE_FOR_TYPE";
  exports2[1368] = "ER_VIEW_NONUPD_CHECK";
  exports2[1369] = "ER_VIEW_CHECK_FAILED";
  exports2[1370] = "ER_PROCACCESS_DENIED_ERROR";
  exports2[1371] = "ER_RELAY_LOG_FAIL";
  exports2[1372] = "ER_PASSWD_LENGTH";
  exports2[1373] = "ER_UNKNOWN_TARGET_BINLOG";
  exports2[1374] = "ER_IO_ERR_LOG_INDEX_READ";
  exports2[1375] = "ER_BINLOG_PURGE_PROHIBITED";
  exports2[1376] = "ER_FSEEK_FAIL";
  exports2[1377] = "ER_BINLOG_PURGE_FATAL_ERR";
  exports2[1378] = "ER_LOG_IN_USE";
  exports2[1379] = "ER_LOG_PURGE_UNKNOWN_ERR";
  exports2[1380] = "ER_RELAY_LOG_INIT";
  exports2[1381] = "ER_NO_BINARY_LOGGING";
  exports2[1382] = "ER_RESERVED_SYNTAX";
  exports2[1383] = "ER_WSAS_FAILED";
  exports2[1384] = "ER_DIFF_GROUPS_PROC";
  exports2[1385] = "ER_NO_GROUP_FOR_PROC";
  exports2[1386] = "ER_ORDER_WITH_PROC";
  exports2[1387] = "ER_LOGGING_PROHIBIT_CHANGING_OF";
  exports2[1388] = "ER_NO_FILE_MAPPING";
  exports2[1389] = "ER_WRONG_MAGIC";
  exports2[1390] = "ER_PS_MANY_PARAM";
  exports2[1391] = "ER_KEY_PART_0";
  exports2[1392] = "ER_VIEW_CHECKSUM";
  exports2[1393] = "ER_VIEW_MULTIUPDATE";
  exports2[1394] = "ER_VIEW_NO_INSERT_FIELD_LIST";
  exports2[1395] = "ER_VIEW_DELETE_MERGE_VIEW";
  exports2[1396] = "ER_CANNOT_USER";
  exports2[1397] = "ER_XAER_NOTA";
  exports2[1398] = "ER_XAER_INVAL";
  exports2[1399] = "ER_XAER_RMFAIL";
  exports2[1400] = "ER_XAER_OUTSIDE";
  exports2[1401] = "ER_XAER_RMERR";
  exports2[1402] = "ER_XA_RBROLLBACK";
  exports2[1403] = "ER_NONEXISTING_PROC_GRANT";
  exports2[1404] = "ER_PROC_AUTO_GRANT_FAIL";
  exports2[1405] = "ER_PROC_AUTO_REVOKE_FAIL";
  exports2[1406] = "ER_DATA_TOO_LONG";
  exports2[1407] = "ER_SP_BAD_SQLSTATE";
  exports2[1408] = "ER_STARTUP";
  exports2[1409] = "ER_LOAD_FROM_FIXED_SIZE_ROWS_TO_VAR";
  exports2[1410] = "ER_CANT_CREATE_USER_WITH_GRANT";
  exports2[1411] = "ER_WRONG_VALUE_FOR_TYPE";
  exports2[1412] = "ER_TABLE_DEF_CHANGED";
  exports2[1413] = "ER_SP_DUP_HANDLER";
  exports2[1414] = "ER_SP_NOT_VAR_ARG";
  exports2[1415] = "ER_SP_NO_RETSET";
  exports2[1416] = "ER_CANT_CREATE_GEOMETRY_OBJECT";
  exports2[1417] = "ER_FAILED_ROUTINE_BREAK_BINLOG";
  exports2[1418] = "ER_BINLOG_UNSAFE_ROUTINE";
  exports2[1419] = "ER_BINLOG_CREATE_ROUTINE_NEED_SUPER";
  exports2[1420] = "ER_EXEC_STMT_WITH_OPEN_CURSOR";
  exports2[1421] = "ER_STMT_HAS_NO_OPEN_CURSOR";
  exports2[1422] = "ER_COMMIT_NOT_ALLOWED_IN_SF_OR_TRG";
  exports2[1423] = "ER_NO_DEFAULT_FOR_VIEW_FIELD";
  exports2[1424] = "ER_SP_NO_RECURSION";
  exports2[1425] = "ER_TOO_BIG_SCALE";
  exports2[1426] = "ER_TOO_BIG_PRECISION";
  exports2[1427] = "ER_M_BIGGER_THAN_D";
  exports2[1428] = "ER_WRONG_LOCK_OF_SYSTEM_TABLE";
  exports2[1429] = "ER_CONNECT_TO_FOREIGN_DATA_SOURCE";
  exports2[1430] = "ER_QUERY_ON_FOREIGN_DATA_SOURCE";
  exports2[1431] = "ER_FOREIGN_DATA_SOURCE_DOESNT_EXIST";
  exports2[1432] = "ER_FOREIGN_DATA_STRING_INVALID_CANT_CREATE";
  exports2[1433] = "ER_FOREIGN_DATA_STRING_INVALID";
  exports2[1434] = "ER_CANT_CREATE_FEDERATED_TABLE";
  exports2[1435] = "ER_TRG_IN_WRONG_SCHEMA";
  exports2[1436] = "ER_STACK_OVERRUN_NEED_MORE";
  exports2[1437] = "ER_TOO_LONG_BODY";
  exports2[1438] = "ER_WARN_CANT_DROP_DEFAULT_KEYCACHE";
  exports2[1439] = "ER_TOO_BIG_DISPLAYWIDTH";
  exports2[1440] = "ER_XAER_DUPID";
  exports2[1441] = "ER_DATETIME_FUNCTION_OVERFLOW";
  exports2[1442] = "ER_CANT_UPDATE_USED_TABLE_IN_SF_OR_TRG";
  exports2[1443] = "ER_VIEW_PREVENT_UPDATE";
  exports2[1444] = "ER_PS_NO_RECURSION";
  exports2[1445] = "ER_SP_CANT_SET_AUTOCOMMIT";
  exports2[1446] = "ER_MALFORMED_DEFINER";
  exports2[1447] = "ER_VIEW_FRM_NO_USER";
  exports2[1448] = "ER_VIEW_OTHER_USER";
  exports2[1449] = "ER_NO_SUCH_USER";
  exports2[1450] = "ER_FORBID_SCHEMA_CHANGE";
  exports2[1451] = "ER_ROW_IS_REFERENCED_2";
  exports2[1452] = "ER_NO_REFERENCED_ROW_2";
  exports2[1453] = "ER_SP_BAD_VAR_SHADOW";
  exports2[1454] = "ER_TRG_NO_DEFINER";
  exports2[1455] = "ER_OLD_FILE_FORMAT";
  exports2[1456] = "ER_SP_RECURSION_LIMIT";
  exports2[1457] = "ER_SP_PROC_TABLE_CORRUPT";
  exports2[1458] = "ER_SP_WRONG_NAME";
  exports2[1459] = "ER_TABLE_NEEDS_UPGRADE";
  exports2[1460] = "ER_SP_NO_AGGREGATE";
  exports2[1461] = "ER_MAX_PREPARED_STMT_COUNT_REACHED";
  exports2[1462] = "ER_VIEW_RECURSIVE";
  exports2[1463] = "ER_NON_GROUPING_FIELD_USED";
  exports2[1464] = "ER_TABLE_CANT_HANDLE_SPKEYS";
  exports2[1465] = "ER_NO_TRIGGERS_ON_SYSTEM_SCHEMA";
  exports2[1466] = "ER_REMOVED_SPACES";
  exports2[1467] = "ER_AUTOINC_READ_FAILED";
  exports2[1468] = "ER_USERNAME";
  exports2[1469] = "ER_HOSTNAME";
  exports2[1470] = "ER_WRONG_STRING_LENGTH";
  exports2[1471] = "ER_NON_INSERTABLE_TABLE";
  exports2[1472] = "ER_ADMIN_WRONG_MRG_TABLE";
  exports2[1473] = "ER_TOO_HIGH_LEVEL_OF_NESTING_FOR_SELECT";
  exports2[1474] = "ER_NAME_BECOMES_EMPTY";
  exports2[1475] = "ER_AMBIGUOUS_FIELD_TERM";
  exports2[1476] = "ER_FOREIGN_SERVER_EXISTS";
  exports2[1477] = "ER_FOREIGN_SERVER_DOESNT_EXIST";
  exports2[1478] = "ER_ILLEGAL_HA_CREATE_OPTION";
  exports2[1479] = "ER_PARTITION_REQUIRES_VALUES_ERROR";
  exports2[1480] = "ER_PARTITION_WRONG_VALUES_ERROR";
  exports2[1481] = "ER_PARTITION_MAXVALUE_ERROR";
  exports2[1482] = "ER_PARTITION_SUBPARTITION_ERROR";
  exports2[1483] = "ER_PARTITION_SUBPART_MIX_ERROR";
  exports2[1484] = "ER_PARTITION_WRONG_NO_PART_ERROR";
  exports2[1485] = "ER_PARTITION_WRONG_NO_SUBPART_ERROR";
  exports2[1486] = "ER_WRONG_EXPR_IN_PARTITION_FUNC_ERROR";
  exports2[1487] = "ER_NO_CONST_EXPR_IN_RANGE_OR_LIST_ERROR";
  exports2[1488] = "ER_FIELD_NOT_FOUND_PART_ERROR";
  exports2[1489] = "ER_LIST_OF_FIELDS_ONLY_IN_HASH_ERROR";
  exports2[1490] = "ER_INCONSISTENT_PARTITION_INFO_ERROR";
  exports2[1491] = "ER_PARTITION_FUNC_NOT_ALLOWED_ERROR";
  exports2[1492] = "ER_PARTITIONS_MUST_BE_DEFINED_ERROR";
  exports2[1493] = "ER_RANGE_NOT_INCREASING_ERROR";
  exports2[1494] = "ER_INCONSISTENT_TYPE_OF_FUNCTIONS_ERROR";
  exports2[1495] = "ER_MULTIPLE_DEF_CONST_IN_LIST_PART_ERROR";
  exports2[1496] = "ER_PARTITION_ENTRY_ERROR";
  exports2[1497] = "ER_MIX_HANDLER_ERROR";
  exports2[1498] = "ER_PARTITION_NOT_DEFINED_ERROR";
  exports2[1499] = "ER_TOO_MANY_PARTITIONS_ERROR";
  exports2[1500] = "ER_SUBPARTITION_ERROR";
  exports2[1501] = "ER_CANT_CREATE_HANDLER_FILE";
  exports2[1502] = "ER_BLOB_FIELD_IN_PART_FUNC_ERROR";
  exports2[1503] = "ER_UNIQUE_KEY_NEED_ALL_FIELDS_IN_PF";
  exports2[1504] = "ER_NO_PARTS_ERROR";
  exports2[1505] = "ER_PARTITION_MGMT_ON_NONPARTITIONED";
  exports2[1506] = "ER_FOREIGN_KEY_ON_PARTITIONED";
  exports2[1507] = "ER_DROP_PARTITION_NON_EXISTENT";
  exports2[1508] = "ER_DROP_LAST_PARTITION";
  exports2[1509] = "ER_COALESCE_ONLY_ON_HASH_PARTITION";
  exports2[1510] = "ER_REORG_HASH_ONLY_ON_SAME_NO";
  exports2[1511] = "ER_REORG_NO_PARAM_ERROR";
  exports2[1512] = "ER_ONLY_ON_RANGE_LIST_PARTITION";
  exports2[1513] = "ER_ADD_PARTITION_SUBPART_ERROR";
  exports2[1514] = "ER_ADD_PARTITION_NO_NEW_PARTITION";
  exports2[1515] = "ER_COALESCE_PARTITION_NO_PARTITION";
  exports2[1516] = "ER_REORG_PARTITION_NOT_EXIST";
  exports2[1517] = "ER_SAME_NAME_PARTITION";
  exports2[1518] = "ER_NO_BINLOG_ERROR";
  exports2[1519] = "ER_CONSECUTIVE_REORG_PARTITIONS";
  exports2[1520] = "ER_REORG_OUTSIDE_RANGE";
  exports2[1521] = "ER_PARTITION_FUNCTION_FAILURE";
  exports2[1522] = "ER_PART_STATE_ERROR";
  exports2[1523] = "ER_LIMITED_PART_RANGE";
  exports2[1524] = "ER_PLUGIN_IS_NOT_LOADED";
  exports2[1525] = "ER_WRONG_VALUE";
  exports2[1526] = "ER_NO_PARTITION_FOR_GIVEN_VALUE";
  exports2[1527] = "ER_FILEGROUP_OPTION_ONLY_ONCE";
  exports2[1528] = "ER_CREATE_FILEGROUP_FAILED";
  exports2[1529] = "ER_DROP_FILEGROUP_FAILED";
  exports2[1530] = "ER_TABLESPACE_AUTO_EXTEND_ERROR";
  exports2[1531] = "ER_WRONG_SIZE_NUMBER";
  exports2[1532] = "ER_SIZE_OVERFLOW_ERROR";
  exports2[1533] = "ER_ALTER_FILEGROUP_FAILED";
  exports2[1534] = "ER_BINLOG_ROW_LOGGING_FAILED";
  exports2[1535] = "ER_BINLOG_ROW_WRONG_TABLE_DEF";
  exports2[1536] = "ER_BINLOG_ROW_RBR_TO_SBR";
  exports2[1537] = "ER_EVENT_ALREADY_EXISTS";
  exports2[1538] = "ER_EVENT_STORE_FAILED";
  exports2[1539] = "ER_EVENT_DOES_NOT_EXIST";
  exports2[1540] = "ER_EVENT_CANT_ALTER";
  exports2[1541] = "ER_EVENT_DROP_FAILED";
  exports2[1542] = "ER_EVENT_INTERVAL_NOT_POSITIVE_OR_TOO_BIG";
  exports2[1543] = "ER_EVENT_ENDS_BEFORE_STARTS";
  exports2[1544] = "ER_EVENT_EXEC_TIME_IN_THE_PAST";
  exports2[1545] = "ER_EVENT_OPEN_TABLE_FAILED";
  exports2[1546] = "ER_EVENT_NEITHER_M_EXPR_NOR_M_AT";
  exports2[1547] = "ER_COL_COUNT_DOESNT_MATCH_CORRUPTED";
  exports2[1548] = "ER_CANNOT_LOAD_FROM_TABLE";
  exports2[1549] = "ER_EVENT_CANNOT_DELETE";
  exports2[1550] = "ER_EVENT_COMPILE_ERROR";
  exports2[1551] = "ER_EVENT_SAME_NAME";
  exports2[1552] = "ER_EVENT_DATA_TOO_LONG";
  exports2[1553] = "ER_DROP_INDEX_FK";
  exports2[1554] = "ER_WARN_DEPRECATED_SYNTAX_WITH_VER";
  exports2[1555] = "ER_CANT_WRITE_LOCK_LOG_TABLE";
  exports2[1556] = "ER_CANT_LOCK_LOG_TABLE";
  exports2[1557] = "ER_FOREIGN_DUPLICATE_KEY";
  exports2[1558] = "ER_COL_COUNT_DOESNT_MATCH_PLEASE_UPDATE";
  exports2[1559] = "ER_TEMP_TABLE_PREVENTS_SWITCH_OUT_OF_RBR";
  exports2[1560] = "ER_STORED_FUNCTION_PREVENTS_SWITCH_BINLOG_FORMAT";
  exports2[1561] = "ER_NDB_CANT_SWITCH_BINLOG_FORMAT";
  exports2[1562] = "ER_PARTITION_NO_TEMPORARY";
  exports2[1563] = "ER_PARTITION_CONST_DOMAIN_ERROR";
  exports2[1564] = "ER_PARTITION_FUNCTION_IS_NOT_ALLOWED";
  exports2[1565] = "ER_DDL_LOG_ERROR";
  exports2[1566] = "ER_NULL_IN_VALUES_LESS_THAN";
  exports2[1567] = "ER_WRONG_PARTITION_NAME";
  exports2[1568] = "ER_CANT_CHANGE_TX_CHARACTERISTICS";
  exports2[1569] = "ER_DUP_ENTRY_AUTOINCREMENT_CASE";
  exports2[1570] = "ER_EVENT_MODIFY_QUEUE_ERROR";
  exports2[1571] = "ER_EVENT_SET_VAR_ERROR";
  exports2[1572] = "ER_PARTITION_MERGE_ERROR";
  exports2[1573] = "ER_CANT_ACTIVATE_LOG";
  exports2[1574] = "ER_RBR_NOT_AVAILABLE";
  exports2[1575] = "ER_BASE64_DECODE_ERROR";
  exports2[1576] = "ER_EVENT_RECURSION_FORBIDDEN";
  exports2[1577] = "ER_EVENTS_DB_ERROR";
  exports2[1578] = "ER_ONLY_INTEGERS_ALLOWED";
  exports2[1579] = "ER_UNSUPORTED_LOG_ENGINE";
  exports2[1580] = "ER_BAD_LOG_STATEMENT";
  exports2[1581] = "ER_CANT_RENAME_LOG_TABLE";
  exports2[1582] = "ER_WRONG_PARAMCOUNT_TO_NATIVE_FCT";
  exports2[1583] = "ER_WRONG_PARAMETERS_TO_NATIVE_FCT";
  exports2[1584] = "ER_WRONG_PARAMETERS_TO_STORED_FCT";
  exports2[1585] = "ER_NATIVE_FCT_NAME_COLLISION";
  exports2[1586] = "ER_DUP_ENTRY_WITH_KEY_NAME";
  exports2[1587] = "ER_BINLOG_PURGE_EMFILE";
  exports2[1588] = "ER_EVENT_CANNOT_CREATE_IN_THE_PAST";
  exports2[1589] = "ER_EVENT_CANNOT_ALTER_IN_THE_PAST";
  exports2[1590] = "ER_SLAVE_INCIDENT";
  exports2[1591] = "ER_NO_PARTITION_FOR_GIVEN_VALUE_SILENT";
  exports2[1592] = "ER_BINLOG_UNSAFE_STATEMENT";
  exports2[1593] = "ER_SLAVE_FATAL_ERROR";
  exports2[1594] = "ER_SLAVE_RELAY_LOG_READ_FAILURE";
  exports2[1595] = "ER_SLAVE_RELAY_LOG_WRITE_FAILURE";
  exports2[1596] = "ER_SLAVE_CREATE_EVENT_FAILURE";
  exports2[1597] = "ER_SLAVE_MASTER_COM_FAILURE";
  exports2[1598] = "ER_BINLOG_LOGGING_IMPOSSIBLE";
  exports2[1599] = "ER_VIEW_NO_CREATION_CTX";
  exports2[1600] = "ER_VIEW_INVALID_CREATION_CTX";
  exports2[1601] = "ER_SR_INVALID_CREATION_CTX";
  exports2[1602] = "ER_TRG_CORRUPTED_FILE";
  exports2[1603] = "ER_TRG_NO_CREATION_CTX";
  exports2[1604] = "ER_TRG_INVALID_CREATION_CTX";
  exports2[1605] = "ER_EVENT_INVALID_CREATION_CTX";
  exports2[1606] = "ER_TRG_CANT_OPEN_TABLE";
  exports2[1607] = "ER_CANT_CREATE_SROUTINE";
  exports2[1608] = "ER_NEVER_USED";
  exports2[1609] = "ER_NO_FORMAT_DESCRIPTION_EVENT_BEFORE_BINLOG_STATEMENT";
  exports2[1610] = "ER_SLAVE_CORRUPT_EVENT";
  exports2[1611] = "ER_LOAD_DATA_INVALID_COLUMN";
  exports2[1612] = "ER_LOG_PURGE_NO_FILE";
  exports2[1613] = "ER_XA_RBTIMEOUT";
  exports2[1614] = "ER_XA_RBDEADLOCK";
  exports2[1615] = "ER_NEED_REPREPARE";
  exports2[1616] = "ER_DELAYED_NOT_SUPPORTED";
  exports2[1617] = "WARN_NO_MASTER_INFO";
  exports2[1618] = "WARN_OPTION_IGNORED";
  exports2[1619] = "ER_PLUGIN_DELETE_BUILTIN";
  exports2[1620] = "WARN_PLUGIN_BUSY";
  exports2[1621] = "ER_VARIABLE_IS_READONLY";
  exports2[1622] = "ER_WARN_ENGINE_TRANSACTION_ROLLBACK";
  exports2[1623] = "ER_SLAVE_HEARTBEAT_FAILURE";
  exports2[1624] = "ER_SLAVE_HEARTBEAT_VALUE_OUT_OF_RANGE";
  exports2[1625] = "ER_NDB_REPLICATION_SCHEMA_ERROR";
  exports2[1626] = "ER_CONFLICT_FN_PARSE_ERROR";
  exports2[1627] = "ER_EXCEPTIONS_WRITE_ERROR";
  exports2[1628] = "ER_TOO_LONG_TABLE_COMMENT";
  exports2[1629] = "ER_TOO_LONG_FIELD_COMMENT";
  exports2[1630] = "ER_FUNC_INEXISTENT_NAME_COLLISION";
  exports2[1631] = "ER_DATABASE_NAME";
  exports2[1632] = "ER_TABLE_NAME";
  exports2[1633] = "ER_PARTITION_NAME";
  exports2[1634] = "ER_SUBPARTITION_NAME";
  exports2[1635] = "ER_TEMPORARY_NAME";
  exports2[1636] = "ER_RENAMED_NAME";
  exports2[1637] = "ER_TOO_MANY_CONCURRENT_TRXS";
  exports2[1638] = "WARN_NON_ASCII_SEPARATOR_NOT_IMPLEMENTED";
  exports2[1639] = "ER_DEBUG_SYNC_TIMEOUT";
  exports2[1640] = "ER_DEBUG_SYNC_HIT_LIMIT";
  exports2[1641] = "ER_DUP_SIGNAL_SET";
  exports2[1642] = "ER_SIGNAL_WARN";
  exports2[1643] = "ER_SIGNAL_NOT_FOUND";
  exports2[1644] = "ER_SIGNAL_EXCEPTION";
  exports2[1645] = "ER_RESIGNAL_WITHOUT_ACTIVE_HANDLER";
  exports2[1646] = "ER_SIGNAL_BAD_CONDITION_TYPE";
  exports2[1647] = "WARN_COND_ITEM_TRUNCATED";
  exports2[1648] = "ER_COND_ITEM_TOO_LONG";
  exports2[1649] = "ER_UNKNOWN_LOCALE";
  exports2[1650] = "ER_SLAVE_IGNORE_SERVER_IDS";
  exports2[1651] = "ER_QUERY_CACHE_DISABLED";
  exports2[1652] = "ER_SAME_NAME_PARTITION_FIELD";
  exports2[1653] = "ER_PARTITION_COLUMN_LIST_ERROR";
  exports2[1654] = "ER_WRONG_TYPE_COLUMN_VALUE_ERROR";
  exports2[1655] = "ER_TOO_MANY_PARTITION_FUNC_FIELDS_ERROR";
  exports2[1656] = "ER_MAXVALUE_IN_VALUES_IN";
  exports2[1657] = "ER_TOO_MANY_VALUES_ERROR";
  exports2[1658] = "ER_ROW_SINGLE_PARTITION_FIELD_ERROR";
  exports2[1659] = "ER_FIELD_TYPE_NOT_ALLOWED_AS_PARTITION_FIELD";
  exports2[1660] = "ER_PARTITION_FIELDS_TOO_LONG";
  exports2[1661] = "ER_BINLOG_ROW_ENGINE_AND_STMT_ENGINE";
  exports2[1662] = "ER_BINLOG_ROW_MODE_AND_STMT_ENGINE";
  exports2[1663] = "ER_BINLOG_UNSAFE_AND_STMT_ENGINE";
  exports2[1664] = "ER_BINLOG_ROW_INJECTION_AND_STMT_ENGINE";
  exports2[1665] = "ER_BINLOG_STMT_MODE_AND_ROW_ENGINE";
  exports2[1666] = "ER_BINLOG_ROW_INJECTION_AND_STMT_MODE";
  exports2[1667] = "ER_BINLOG_MULTIPLE_ENGINES_AND_SELF_LOGGING_ENGINE";
  exports2[1668] = "ER_BINLOG_UNSAFE_LIMIT";
  exports2[1669] = "ER_BINLOG_UNSAFE_INSERT_DELAYED";
  exports2[1670] = "ER_BINLOG_UNSAFE_SYSTEM_TABLE";
  exports2[1671] = "ER_BINLOG_UNSAFE_AUTOINC_COLUMNS";
  exports2[1672] = "ER_BINLOG_UNSAFE_UDF";
  exports2[1673] = "ER_BINLOG_UNSAFE_SYSTEM_VARIABLE";
  exports2[1674] = "ER_BINLOG_UNSAFE_SYSTEM_FUNCTION";
  exports2[1675] = "ER_BINLOG_UNSAFE_NONTRANS_AFTER_TRANS";
  exports2[1676] = "ER_MESSAGE_AND_STATEMENT";
  exports2[1677] = "ER_SLAVE_CONVERSION_FAILED";
  exports2[1678] = "ER_SLAVE_CANT_CREATE_CONVERSION";
  exports2[1679] = "ER_INSIDE_TRANSACTION_PREVENTS_SWITCH_BINLOG_FORMAT";
  exports2[1680] = "ER_PATH_LENGTH";
  exports2[1681] = "ER_WARN_DEPRECATED_SYNTAX_NO_REPLACEMENT";
  exports2[1682] = "ER_WRONG_NATIVE_TABLE_STRUCTURE";
  exports2[1683] = "ER_WRONG_PERFSCHEMA_USAGE";
  exports2[1684] = "ER_WARN_I_S_SKIPPED_TABLE";
  exports2[1685] = "ER_INSIDE_TRANSACTION_PREVENTS_SWITCH_BINLOG_DIRECT";
  exports2[1686] = "ER_STORED_FUNCTION_PREVENTS_SWITCH_BINLOG_DIRECT";
  exports2[1687] = "ER_SPATIAL_MUST_HAVE_GEOM_COL";
  exports2[1688] = "ER_TOO_LONG_INDEX_COMMENT";
  exports2[1689] = "ER_LOCK_ABORTED";
  exports2[1690] = "ER_DATA_OUT_OF_RANGE";
  exports2[1691] = "ER_WRONG_SPVAR_TYPE_IN_LIMIT";
  exports2[1692] = "ER_BINLOG_UNSAFE_MULTIPLE_ENGINES_AND_SELF_LOGGING_ENGINE";
  exports2[1693] = "ER_BINLOG_UNSAFE_MIXED_STATEMENT";
  exports2[1694] = "ER_INSIDE_TRANSACTION_PREVENTS_SWITCH_SQL_LOG_BIN";
  exports2[1695] = "ER_STORED_FUNCTION_PREVENTS_SWITCH_SQL_LOG_BIN";
  exports2[1696] = "ER_FAILED_READ_FROM_PAR_FILE";
  exports2[1697] = "ER_VALUES_IS_NOT_INT_TYPE_ERROR";
  exports2[1698] = "ER_ACCESS_DENIED_NO_PASSWORD_ERROR";
  exports2[1699] = "ER_SET_PASSWORD_AUTH_PLUGIN";
  exports2[1700] = "ER_GRANT_PLUGIN_USER_EXISTS";
  exports2[1701] = "ER_TRUNCATE_ILLEGAL_FK";
  exports2[1702] = "ER_PLUGIN_IS_PERMANENT";
  exports2[1703] = "ER_SLAVE_HEARTBEAT_VALUE_OUT_OF_RANGE_MIN";
  exports2[1704] = "ER_SLAVE_HEARTBEAT_VALUE_OUT_OF_RANGE_MAX";
  exports2[1705] = "ER_STMT_CACHE_FULL";
  exports2[1706] = "ER_MULTI_UPDATE_KEY_CONFLICT";
  exports2[1707] = "ER_TABLE_NEEDS_REBUILD";
  exports2[1708] = "WARN_OPTION_BELOW_LIMIT";
  exports2[1709] = "ER_INDEX_COLUMN_TOO_LONG";
  exports2[1710] = "ER_ERROR_IN_TRIGGER_BODY";
  exports2[1711] = "ER_ERROR_IN_UNKNOWN_TRIGGER_BODY";
  exports2[1712] = "ER_INDEX_CORRUPT";
  exports2[1713] = "ER_UNDO_RECORD_TOO_BIG";
  exports2[1714] = "ER_BINLOG_UNSAFE_INSERT_IGNORE_SELECT";
  exports2[1715] = "ER_BINLOG_UNSAFE_INSERT_SELECT_UPDATE";
  exports2[1716] = "ER_BINLOG_UNSAFE_REPLACE_SELECT";
  exports2[1717] = "ER_BINLOG_UNSAFE_CREATE_IGNORE_SELECT";
  exports2[1718] = "ER_BINLOG_UNSAFE_CREATE_REPLACE_SELECT";
  exports2[1719] = "ER_BINLOG_UNSAFE_UPDATE_IGNORE";
  exports2[1720] = "ER_PLUGIN_NO_UNINSTALL";
  exports2[1721] = "ER_PLUGIN_NO_INSTALL";
  exports2[1722] = "ER_BINLOG_UNSAFE_WRITE_AUTOINC_SELECT";
  exports2[1723] = "ER_BINLOG_UNSAFE_CREATE_SELECT_AUTOINC";
  exports2[1724] = "ER_BINLOG_UNSAFE_INSERT_TWO_KEYS";
  exports2[1725] = "ER_TABLE_IN_FK_CHECK";
  exports2[1726] = "ER_UNSUPPORTED_ENGINE";
  exports2[1727] = "ER_BINLOG_UNSAFE_AUTOINC_NOT_FIRST";
  exports2[1728] = "ER_CANNOT_LOAD_FROM_TABLE_V2";
  exports2[1729] = "ER_MASTER_DELAY_VALUE_OUT_OF_RANGE";
  exports2[1730] = "ER_ONLY_FD_AND_RBR_EVENTS_ALLOWED_IN_BINLOG_STATEMENT";
  exports2[1731] = "ER_PARTITION_EXCHANGE_DIFFERENT_OPTION";
  exports2[1732] = "ER_PARTITION_EXCHANGE_PART_TABLE";
  exports2[1733] = "ER_PARTITION_EXCHANGE_TEMP_TABLE";
  exports2[1734] = "ER_PARTITION_INSTEAD_OF_SUBPARTITION";
  exports2[1735] = "ER_UNKNOWN_PARTITION";
  exports2[1736] = "ER_TABLES_DIFFERENT_METADATA";
  exports2[1737] = "ER_ROW_DOES_NOT_MATCH_PARTITION";
  exports2[1738] = "ER_BINLOG_CACHE_SIZE_GREATER_THAN_MAX";
  exports2[1739] = "ER_WARN_INDEX_NOT_APPLICABLE";
  exports2[1740] = "ER_PARTITION_EXCHANGE_FOREIGN_KEY";
  exports2[1741] = "ER_NO_SUCH_KEY_VALUE";
  exports2[1742] = "ER_RPL_INFO_DATA_TOO_LONG";
  exports2[1743] = "ER_NETWORK_READ_EVENT_CHECKSUM_FAILURE";
  exports2[1744] = "ER_BINLOG_READ_EVENT_CHECKSUM_FAILURE";
  exports2[1745] = "ER_BINLOG_STMT_CACHE_SIZE_GREATER_THAN_MAX";
  exports2[1746] = "ER_CANT_UPDATE_TABLE_IN_CREATE_TABLE_SELECT";
  exports2[1747] = "ER_PARTITION_CLAUSE_ON_NONPARTITIONED";
  exports2[1748] = "ER_ROW_DOES_NOT_MATCH_GIVEN_PARTITION_SET";
  exports2[1749] = "ER_NO_SUCH_PARTITION";
  exports2[1750] = "ER_CHANGE_RPL_INFO_REPOSITORY_FAILURE";
  exports2[1751] = "ER_WARNING_NOT_COMPLETE_ROLLBACK_WITH_CREATED_TEMP_TABLE";
  exports2[1752] = "ER_WARNING_NOT_COMPLETE_ROLLBACK_WITH_DROPPED_TEMP_TABLE";
  exports2[1753] = "ER_MTS_FEATURE_IS_NOT_SUPPORTED";
  exports2[1754] = "ER_MTS_UPDATED_DBS_GREATER_MAX";
  exports2[1755] = "ER_MTS_CANT_PARALLEL";
  exports2[1756] = "ER_MTS_INCONSISTENT_DATA";
  exports2[1757] = "ER_FULLTEXT_NOT_SUPPORTED_WITH_PARTITIONING";
  exports2[1758] = "ER_DA_INVALID_CONDITION_NUMBER";
  exports2[1759] = "ER_INSECURE_PLAIN_TEXT";
  exports2[1760] = "ER_INSECURE_CHANGE_MASTER";
  exports2[1761] = "ER_FOREIGN_DUPLICATE_KEY_WITH_CHILD_INFO";
  exports2[1762] = "ER_FOREIGN_DUPLICATE_KEY_WITHOUT_CHILD_INFO";
  exports2[1763] = "ER_SQLTHREAD_WITH_SECURE_SLAVE";
  exports2[1764] = "ER_TABLE_HAS_NO_FT";
  exports2[1765] = "ER_VARIABLE_NOT_SETTABLE_IN_SF_OR_TRIGGER";
  exports2[1766] = "ER_VARIABLE_NOT_SETTABLE_IN_TRANSACTION";
  exports2[1767] = "ER_GTID_NEXT_IS_NOT_IN_GTID_NEXT_LIST";
  exports2[1768] = "ER_CANT_CHANGE_GTID_NEXT_IN_TRANSACTION";
  exports2[1769] = "ER_SET_STATEMENT_CANNOT_INVOKE_FUNCTION";
  exports2[1770] = "ER_GTID_NEXT_CANT_BE_AUTOMATIC_IF_GTID_NEXT_LIST_IS_NON_NULL";
  exports2[1771] = "ER_SKIPPING_LOGGED_TRANSACTION";
  exports2[1772] = "ER_MALFORMED_GTID_SET_SPECIFICATION";
  exports2[1773] = "ER_MALFORMED_GTID_SET_ENCODING";
  exports2[1774] = "ER_MALFORMED_GTID_SPECIFICATION";
  exports2[1775] = "ER_GNO_EXHAUSTED";
  exports2[1776] = "ER_BAD_SLAVE_AUTO_POSITION";
  exports2[1777] = "ER_AUTO_POSITION_REQUIRES_GTID_MODE_NOT_OFF";
  exports2[1778] = "ER_CANT_DO_IMPLICIT_COMMIT_IN_TRX_WHEN_GTID_NEXT_IS_SET";
  exports2[1779] = "ER_GTID_MODE_ON_REQUIRES_ENFORCE_GTID_CONSISTENCY_ON";
  exports2[1780] = "ER_GTID_MODE_REQUIRES_BINLOG";
  exports2[1781] = "ER_CANT_SET_GTID_NEXT_TO_GTID_WHEN_GTID_MODE_IS_OFF";
  exports2[1782] = "ER_CANT_SET_GTID_NEXT_TO_ANONYMOUS_WHEN_GTID_MODE_IS_ON";
  exports2[1783] = "ER_CANT_SET_GTID_NEXT_LIST_TO_NON_NULL_WHEN_GTID_MODE_IS_OFF";
  exports2[1784] = "ER_FOUND_GTID_EVENT_WHEN_GTID_MODE_IS_OFF";
  exports2[1785] = "ER_GTID_UNSAFE_NON_TRANSACTIONAL_TABLE";
  exports2[1786] = "ER_GTID_UNSAFE_CREATE_SELECT";
  exports2[1787] = "ER_GTID_UNSAFE_CREATE_DROP_TEMPORARY_TABLE_IN_TRANSACTION";
  exports2[1788] = "ER_GTID_MODE_CAN_ONLY_CHANGE_ONE_STEP_AT_A_TIME";
  exports2[1789] = "ER_MASTER_HAS_PURGED_REQUIRED_GTIDS";
  exports2[1790] = "ER_CANT_SET_GTID_NEXT_WHEN_OWNING_GTID";
  exports2[1791] = "ER_UNKNOWN_EXPLAIN_FORMAT";
  exports2[1792] = "ER_CANT_EXECUTE_IN_READ_ONLY_TRANSACTION";
  exports2[1793] = "ER_TOO_LONG_TABLE_PARTITION_COMMENT";
  exports2[1794] = "ER_SLAVE_CONFIGURATION";
  exports2[1795] = "ER_INNODB_FT_LIMIT";
  exports2[1796] = "ER_INNODB_NO_FT_TEMP_TABLE";
  exports2[1797] = "ER_INNODB_FT_WRONG_DOCID_COLUMN";
  exports2[1798] = "ER_INNODB_FT_WRONG_DOCID_INDEX";
  exports2[1799] = "ER_INNODB_ONLINE_LOG_TOO_BIG";
  exports2[1800] = "ER_UNKNOWN_ALTER_ALGORITHM";
  exports2[1801] = "ER_UNKNOWN_ALTER_LOCK";
  exports2[1802] = "ER_MTS_CHANGE_MASTER_CANT_RUN_WITH_GAPS";
  exports2[1803] = "ER_MTS_RECOVERY_FAILURE";
  exports2[1804] = "ER_MTS_RESET_WORKERS";
  exports2[1805] = "ER_COL_COUNT_DOESNT_MATCH_CORRUPTED_V2";
  exports2[1806] = "ER_SLAVE_SILENT_RETRY_TRANSACTION";
  exports2[1807] = "ER_DISCARD_FK_CHECKS_RUNNING";
  exports2[1808] = "ER_TABLE_SCHEMA_MISMATCH";
  exports2[1809] = "ER_TABLE_IN_SYSTEM_TABLESPACE";
  exports2[1810] = "ER_IO_READ_ERROR";
  exports2[1811] = "ER_IO_WRITE_ERROR";
  exports2[1812] = "ER_TABLESPACE_MISSING";
  exports2[1813] = "ER_TABLESPACE_EXISTS";
  exports2[1814] = "ER_TABLESPACE_DISCARDED";
  exports2[1815] = "ER_INTERNAL_ERROR";
  exports2[1816] = "ER_INNODB_IMPORT_ERROR";
  exports2[1817] = "ER_INNODB_INDEX_CORRUPT";
  exports2[1818] = "ER_INVALID_YEAR_COLUMN_LENGTH";
  exports2[1819] = "ER_NOT_VALID_PASSWORD";
  exports2[1820] = "ER_MUST_CHANGE_PASSWORD";
  exports2[1821] = "ER_FK_NO_INDEX_CHILD";
  exports2[1822] = "ER_FK_NO_INDEX_PARENT";
  exports2[1823] = "ER_FK_FAIL_ADD_SYSTEM";
  exports2[1824] = "ER_FK_CANNOT_OPEN_PARENT";
  exports2[1825] = "ER_FK_INCORRECT_OPTION";
  exports2[1826] = "ER_FK_DUP_NAME";
  exports2[1827] = "ER_PASSWORD_FORMAT";
  exports2[1828] = "ER_FK_COLUMN_CANNOT_DROP";
  exports2[1829] = "ER_FK_COLUMN_CANNOT_DROP_CHILD";
  exports2[1830] = "ER_FK_COLUMN_NOT_NULL";
  exports2[1831] = "ER_DUP_INDEX";
  exports2[1832] = "ER_FK_COLUMN_CANNOT_CHANGE";
  exports2[1833] = "ER_FK_COLUMN_CANNOT_CHANGE_CHILD";
  exports2[1834] = "ER_FK_CANNOT_DELETE_PARENT";
  exports2[1835] = "ER_MALFORMED_PACKET";
  exports2[1836] = "ER_READ_ONLY_MODE";
  exports2[1837] = "ER_GTID_NEXT_TYPE_UNDEFINED_GROUP";
  exports2[1838] = "ER_VARIABLE_NOT_SETTABLE_IN_SP";
  exports2[1839] = "ER_CANT_SET_GTID_PURGED_WHEN_GTID_MODE_IS_OFF";
  exports2[1840] = "ER_CANT_SET_GTID_PURGED_WHEN_GTID_EXECUTED_IS_NOT_EMPTY";
  exports2[1841] = "ER_CANT_SET_GTID_PURGED_WHEN_OWNED_GTIDS_IS_NOT_EMPTY";
  exports2[1842] = "ER_GTID_PURGED_WAS_CHANGED";
  exports2[1843] = "ER_GTID_EXECUTED_WAS_CHANGED";
  exports2[1844] = "ER_BINLOG_STMT_MODE_AND_NO_REPL_TABLES";
  exports2[1845] = "ER_ALTER_OPERATION_NOT_SUPPORTED";
  exports2[1846] = "ER_ALTER_OPERATION_NOT_SUPPORTED_REASON";
  exports2[1847] = "ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_COPY";
  exports2[1848] = "ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_PARTITION";
  exports2[1849] = "ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_FK_RENAME";
  exports2[1850] = "ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_COLUMN_TYPE";
  exports2[1851] = "ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_FK_CHECK";
  exports2[1852] = "ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_IGNORE";
  exports2[1853] = "ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_NOPK";
  exports2[1854] = "ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_AUTOINC";
  exports2[1855] = "ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_HIDDEN_FTS";
  exports2[1856] = "ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_CHANGE_FTS";
  exports2[1857] = "ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_FTS";
  exports2[1858] = "ER_SQL_SLAVE_SKIP_COUNTER_NOT_SETTABLE_IN_GTID_MODE";
  exports2[1859] = "ER_DUP_UNKNOWN_IN_INDEX";
  exports2[1860] = "ER_IDENT_CAUSES_TOO_LONG_PATH";
  exports2[1861] = "ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_NOT_NULL";
  exports2[1862] = "ER_MUST_CHANGE_PASSWORD_LOGIN";
  exports2[1863] = "ER_ROW_IN_WRONG_PARTITION";
  exports2[1864] = "ER_MTS_EVENT_BIGGER_PENDING_JOBS_SIZE_MAX";
  exports2[1865] = "ER_INNODB_NO_FT_USES_PARSER";
  exports2[1866] = "ER_BINLOG_LOGICAL_CORRUPTION";
  exports2[1867] = "ER_WARN_PURGE_LOG_IN_USE";
  exports2[1868] = "ER_WARN_PURGE_LOG_IS_ACTIVE";
  exports2[1869] = "ER_AUTO_INCREMENT_CONFLICT";
  exports2[1870] = "WARN_ON_BLOCKHOLE_IN_RBR";
  exports2[1871] = "ER_SLAVE_MI_INIT_REPOSITORY";
  exports2[1872] = "ER_SLAVE_RLI_INIT_REPOSITORY";
  exports2[1873] = "ER_ACCESS_DENIED_CHANGE_USER_ERROR";
  exports2[1874] = "ER_INNODB_READ_ONLY";
  exports2[1875] = "ER_STOP_SLAVE_SQL_THREAD_TIMEOUT";
  exports2[1876] = "ER_STOP_SLAVE_IO_THREAD_TIMEOUT";
  exports2[1877] = "ER_TABLE_CORRUPT";
  exports2[1878] = "ER_TEMP_FILE_WRITE_FAILURE";
  exports2[1879] = "ER_INNODB_FT_AUX_NOT_HEX_ID";
  exports2[1880] = "ER_OLD_TEMPORALS_UPGRADED";
  exports2[1881] = "ER_INNODB_FORCED_RECOVERY";
  exports2[1882] = "ER_AES_INVALID_IV";
  exports2[1883] = "ER_PLUGIN_CANNOT_BE_UNINSTALLED";
  exports2[1884] = "ER_GTID_UNSAFE_BINLOG_SPLITTABLE_STATEMENT_AND_GTID_GROUP";
  exports2[1885] = "ER_SLAVE_HAS_MORE_GTIDS_THAN_MASTER";
  exports2[1886] = "ER_MISSING_KEY";
  exports2[1887] = "WARN_NAMED_PIPE_ACCESS_EVERYONE";
  exports2[1888] = "ER_FOUND_MISSING_GTIDS";
  exports2[3e3] = "ER_FILE_CORRUPT";
  exports2[3001] = "ER_ERROR_ON_MASTER";
  exports2[3002] = "ER_INCONSISTENT_ERROR";
  exports2[3003] = "ER_STORAGE_ENGINE_NOT_LOADED";
  exports2[3004] = "ER_GET_STACKED_DA_WITHOUT_ACTIVE_HANDLER";
  exports2[3005] = "ER_WARN_LEGACY_SYNTAX_CONVERTED";
  exports2[3006] = "ER_BINLOG_UNSAFE_FULLTEXT_PLUGIN";
  exports2[3007] = "ER_CANNOT_DISCARD_TEMPORARY_TABLE";
  exports2[3008] = "ER_FK_DEPTH_EXCEEDED";
  exports2[3009] = "ER_COL_COUNT_DOESNT_MATCH_PLEASE_UPDATE_V2";
  exports2[3010] = "ER_WARN_TRIGGER_DOESNT_HAVE_CREATED";
  exports2[3011] = "ER_REFERENCED_TRG_DOES_NOT_EXIST";
  exports2[3012] = "ER_EXPLAIN_NOT_SUPPORTED";
  exports2[3013] = "ER_INVALID_FIELD_SIZE";
  exports2[3014] = "ER_MISSING_HA_CREATE_OPTION";
  exports2[3015] = "ER_ENGINE_OUT_OF_MEMORY";
  exports2[3016] = "ER_PASSWORD_EXPIRE_ANONYMOUS_USER";
  exports2[3017] = "ER_SLAVE_SQL_THREAD_MUST_STOP";
  exports2[3018] = "ER_NO_FT_MATERIALIZED_SUBQUERY";
  exports2[3019] = "ER_INNODB_UNDO_LOG_FULL";
  exports2[3020] = "ER_INVALID_ARGUMENT_FOR_LOGARITHM";
  exports2[3021] = "ER_SLAVE_CHANNEL_IO_THREAD_MUST_STOP";
  exports2[3022] = "ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO";
  exports2[3023] = "ER_WARN_ONLY_MASTER_LOG_FILE_NO_POS";
  exports2[3024] = "ER_QUERY_TIMEOUT";
  exports2[3025] = "ER_NON_RO_SELECT_DISABLE_TIMER";
  exports2[3026] = "ER_DUP_LIST_ENTRY";
  exports2[3027] = "ER_SQL_MODE_NO_EFFECT";
  exports2[3028] = "ER_AGGREGATE_ORDER_FOR_UNION";
  exports2[3029] = "ER_AGGREGATE_ORDER_NON_AGG_QUERY";
  exports2[3030] = "ER_SLAVE_WORKER_STOPPED_PREVIOUS_THD_ERROR";
  exports2[3031] = "ER_DONT_SUPPORT_SLAVE_PRESERVE_COMMIT_ORDER";
  exports2[3032] = "ER_SERVER_OFFLINE_MODE";
  exports2[3033] = "ER_GIS_DIFFERENT_SRIDS";
  exports2[3034] = "ER_GIS_UNSUPPORTED_ARGUMENT";
  exports2[3035] = "ER_GIS_UNKNOWN_ERROR";
  exports2[3036] = "ER_GIS_UNKNOWN_EXCEPTION";
  exports2[3037] = "ER_GIS_INVALID_DATA";
  exports2[3038] = "ER_BOOST_GEOMETRY_EMPTY_INPUT_EXCEPTION";
  exports2[3039] = "ER_BOOST_GEOMETRY_CENTROID_EXCEPTION";
  exports2[3040] = "ER_BOOST_GEOMETRY_OVERLAY_INVALID_INPUT_EXCEPTION";
  exports2[3041] = "ER_BOOST_GEOMETRY_TURN_INFO_EXCEPTION";
  exports2[3042] = "ER_BOOST_GEOMETRY_SELF_INTERSECTION_POINT_EXCEPTION";
  exports2[3043] = "ER_BOOST_GEOMETRY_UNKNOWN_EXCEPTION";
  exports2[3044] = "ER_STD_BAD_ALLOC_ERROR";
  exports2[3045] = "ER_STD_DOMAIN_ERROR";
  exports2[3046] = "ER_STD_LENGTH_ERROR";
  exports2[3047] = "ER_STD_INVALID_ARGUMENT";
  exports2[3048] = "ER_STD_OUT_OF_RANGE_ERROR";
  exports2[3049] = "ER_STD_OVERFLOW_ERROR";
  exports2[3050] = "ER_STD_RANGE_ERROR";
  exports2[3051] = "ER_STD_UNDERFLOW_ERROR";
  exports2[3052] = "ER_STD_LOGIC_ERROR";
  exports2[3053] = "ER_STD_RUNTIME_ERROR";
  exports2[3054] = "ER_STD_UNKNOWN_EXCEPTION";
  exports2[3055] = "ER_GIS_DATA_WRONG_ENDIANESS";
  exports2[3056] = "ER_CHANGE_MASTER_PASSWORD_LENGTH";
  exports2[3057] = "ER_USER_LOCK_WRONG_NAME";
  exports2[3058] = "ER_USER_LOCK_DEADLOCK";
  exports2[3059] = "ER_REPLACE_INACCESSIBLE_ROWS";
  exports2[3060] = "ER_ALTER_OPERATION_NOT_SUPPORTED_REASON_GIS";
  exports2[3061] = "ER_ILLEGAL_USER_VAR";
  exports2[3062] = "ER_GTID_MODE_OFF";
  exports2[3063] = "ER_UNSUPPORTED_BY_REPLICATION_THREAD";
  exports2[3064] = "ER_INCORRECT_TYPE";
  exports2[3065] = "ER_FIELD_IN_ORDER_NOT_SELECT";
  exports2[3066] = "ER_AGGREGATE_IN_ORDER_NOT_SELECT";
  exports2[3067] = "ER_INVALID_RPL_WILD_TABLE_FILTER_PATTERN";
  exports2[3068] = "ER_NET_OK_PACKET_TOO_LARGE";
  exports2[3069] = "ER_INVALID_JSON_DATA";
  exports2[3070] = "ER_INVALID_GEOJSON_MISSING_MEMBER";
  exports2[3071] = "ER_INVALID_GEOJSON_WRONG_TYPE";
  exports2[3072] = "ER_INVALID_GEOJSON_UNSPECIFIED";
  exports2[3073] = "ER_DIMENSION_UNSUPPORTED";
  exports2[3074] = "ER_SLAVE_CHANNEL_DOES_NOT_EXIST";
  exports2[3075] = "ER_SLAVE_MULTIPLE_CHANNELS_HOST_PORT";
  exports2[3076] = "ER_SLAVE_CHANNEL_NAME_INVALID_OR_TOO_LONG";
  exports2[3077] = "ER_SLAVE_NEW_CHANNEL_WRONG_REPOSITORY";
  exports2[3078] = "ER_SLAVE_CHANNEL_DELETE";
  exports2[3079] = "ER_SLAVE_MULTIPLE_CHANNELS_CMD";
  exports2[3080] = "ER_SLAVE_MAX_CHANNELS_EXCEEDED";
  exports2[3081] = "ER_SLAVE_CHANNEL_MUST_STOP";
  exports2[3082] = "ER_SLAVE_CHANNEL_NOT_RUNNING";
  exports2[3083] = "ER_SLAVE_CHANNEL_WAS_RUNNING";
  exports2[3084] = "ER_SLAVE_CHANNEL_WAS_NOT_RUNNING";
  exports2[3085] = "ER_SLAVE_CHANNEL_SQL_THREAD_MUST_STOP";
  exports2[3086] = "ER_SLAVE_CHANNEL_SQL_SKIP_COUNTER";
  exports2[3087] = "ER_WRONG_FIELD_WITH_GROUP_V2";
  exports2[3088] = "ER_MIX_OF_GROUP_FUNC_AND_FIELDS_V2";
  exports2[3089] = "ER_WARN_DEPRECATED_SYSVAR_UPDATE";
  exports2[3090] = "ER_WARN_DEPRECATED_SQLMODE";
  exports2[3091] = "ER_CANNOT_LOG_PARTIAL_DROP_DATABASE_WITH_GTID";
  exports2[3092] = "ER_GROUP_REPLICATION_CONFIGURATION";
  exports2[3093] = "ER_GROUP_REPLICATION_RUNNING";
  exports2[3094] = "ER_GROUP_REPLICATION_APPLIER_INIT_ERROR";
  exports2[3095] = "ER_GROUP_REPLICATION_STOP_APPLIER_THREAD_TIMEOUT";
  exports2[3096] = "ER_GROUP_REPLICATION_COMMUNICATION_LAYER_SESSION_ERROR";
  exports2[3097] = "ER_GROUP_REPLICATION_COMMUNICATION_LAYER_JOIN_ERROR";
  exports2[3098] = "ER_BEFORE_DML_VALIDATION_ERROR";
  exports2[3099] = "ER_PREVENTS_VARIABLE_WITHOUT_RBR";
  exports2[3100] = "ER_RUN_HOOK_ERROR";
  exports2[3101] = "ER_TRANSACTION_ROLLBACK_DURING_COMMIT";
  exports2[3102] = "ER_GENERATED_COLUMN_FUNCTION_IS_NOT_ALLOWED";
  exports2[3103] = "ER_UNSUPPORTED_ALTER_INPLACE_ON_VIRTUAL_COLUMN";
  exports2[3104] = "ER_WRONG_FK_OPTION_FOR_GENERATED_COLUMN";
  exports2[3105] = "ER_NON_DEFAULT_VALUE_FOR_GENERATED_COLUMN";
  exports2[3106] = "ER_UNSUPPORTED_ACTION_ON_GENERATED_COLUMN";
  exports2[3107] = "ER_GENERATED_COLUMN_NON_PRIOR";
  exports2[3108] = "ER_DEPENDENT_BY_GENERATED_COLUMN";
  exports2[3109] = "ER_GENERATED_COLUMN_REF_AUTO_INC";
  exports2[3110] = "ER_FEATURE_NOT_AVAILABLE";
  exports2[3111] = "ER_CANT_SET_GTID_MODE";
  exports2[3112] = "ER_CANT_USE_AUTO_POSITION_WITH_GTID_MODE_OFF";
  exports2[3113] = "ER_CANT_REPLICATE_ANONYMOUS_WITH_AUTO_POSITION";
  exports2[3114] = "ER_CANT_REPLICATE_ANONYMOUS_WITH_GTID_MODE_ON";
  exports2[3115] = "ER_CANT_REPLICATE_GTID_WITH_GTID_MODE_OFF";
  exports2[3116] = "ER_CANT_SET_ENFORCE_GTID_CONSISTENCY_ON_WITH_ONGOING_GTID_VIOLATING_TRANSACTIONS";
  exports2[3117] = "ER_SET_ENFORCE_GTID_CONSISTENCY_WARN_WITH_ONGOING_GTID_VIOLATING_TRANSACTIONS";
  exports2[3118] = "ER_ACCOUNT_HAS_BEEN_LOCKED";
  exports2[3119] = "ER_WRONG_TABLESPACE_NAME";
  exports2[3120] = "ER_TABLESPACE_IS_NOT_EMPTY";
  exports2[3121] = "ER_WRONG_FILE_NAME";
  exports2[3122] = "ER_BOOST_GEOMETRY_INCONSISTENT_TURNS_EXCEPTION";
  exports2[3123] = "ER_WARN_OPTIMIZER_HINT_SYNTAX_ERROR";
  exports2[3124] = "ER_WARN_BAD_MAX_EXECUTION_TIME";
  exports2[3125] = "ER_WARN_UNSUPPORTED_MAX_EXECUTION_TIME";
  exports2[3126] = "ER_WARN_CONFLICTING_HINT";
  exports2[3127] = "ER_WARN_UNKNOWN_QB_NAME";
  exports2[3128] = "ER_UNRESOLVED_HINT_NAME";
  exports2[3129] = "ER_WARN_ON_MODIFYING_GTID_EXECUTED_TABLE";
  exports2[3130] = "ER_PLUGGABLE_PROTOCOL_COMMAND_NOT_SUPPORTED";
  exports2[3131] = "ER_LOCKING_SERVICE_WRONG_NAME";
  exports2[3132] = "ER_LOCKING_SERVICE_DEADLOCK";
  exports2[3133] = "ER_LOCKING_SERVICE_TIMEOUT";
  exports2[3134] = "ER_GIS_MAX_POINTS_IN_GEOMETRY_OVERFLOWED";
  exports2[3135] = "ER_SQL_MODE_MERGED";
  exports2[3136] = "ER_VTOKEN_PLUGIN_TOKEN_MISMATCH";
  exports2[3137] = "ER_VTOKEN_PLUGIN_TOKEN_NOT_FOUND";
  exports2[3138] = "ER_CANT_SET_VARIABLE_WHEN_OWNING_GTID";
  exports2[3139] = "ER_SLAVE_CHANNEL_OPERATION_NOT_ALLOWED";
  exports2[3140] = "ER_INVALID_JSON_TEXT";
  exports2[3141] = "ER_INVALID_JSON_TEXT_IN_PARAM";
  exports2[3142] = "ER_INVALID_JSON_BINARY_DATA";
  exports2[3143] = "ER_INVALID_JSON_PATH";
  exports2[3144] = "ER_INVALID_JSON_CHARSET";
  exports2[3145] = "ER_INVALID_JSON_CHARSET_IN_FUNCTION";
  exports2[3146] = "ER_INVALID_TYPE_FOR_JSON";
  exports2[3147] = "ER_INVALID_CAST_TO_JSON";
  exports2[3148] = "ER_INVALID_JSON_PATH_CHARSET";
  exports2[3149] = "ER_INVALID_JSON_PATH_WILDCARD";
  exports2[3150] = "ER_JSON_VALUE_TOO_BIG";
  exports2[3151] = "ER_JSON_KEY_TOO_BIG";
  exports2[3152] = "ER_JSON_USED_AS_KEY";
  exports2[3153] = "ER_JSON_VACUOUS_PATH";
  exports2[3154] = "ER_JSON_BAD_ONE_OR_ALL_ARG";
  exports2[3155] = "ER_NUMERIC_JSON_VALUE_OUT_OF_RANGE";
  exports2[3156] = "ER_INVALID_JSON_VALUE_FOR_CAST";
  exports2[3157] = "ER_JSON_DOCUMENT_TOO_DEEP";
  exports2[3158] = "ER_JSON_DOCUMENT_NULL_KEY";
  exports2[3159] = "ER_SECURE_TRANSPORT_REQUIRED";
  exports2[3160] = "ER_NO_SECURE_TRANSPORTS_CONFIGURED";
  exports2[3161] = "ER_DISABLED_STORAGE_ENGINE";
  exports2[3162] = "ER_USER_DOES_NOT_EXIST";
  exports2[3163] = "ER_USER_ALREADY_EXISTS";
  exports2[3164] = "ER_AUDIT_API_ABORT";
  exports2[3165] = "ER_INVALID_JSON_PATH_ARRAY_CELL";
  exports2[3166] = "ER_BUFPOOL_RESIZE_INPROGRESS";
  exports2[3167] = "ER_FEATURE_DISABLED_SEE_DOC";
  exports2[3168] = "ER_SERVER_ISNT_AVAILABLE";
  exports2[3169] = "ER_SESSION_WAS_KILLED";
  exports2[3170] = "ER_CAPACITY_EXCEEDED";
  exports2[3171] = "ER_CAPACITY_EXCEEDED_IN_RANGE_OPTIMIZER";
  exports2[3172] = "ER_TABLE_NEEDS_UPG_PART";
  exports2[3173] = "ER_CANT_WAIT_FOR_EXECUTED_GTID_SET_WHILE_OWNING_A_GTID";
  exports2[3174] = "ER_CANNOT_ADD_FOREIGN_BASE_COL_VIRTUAL";
  exports2[3175] = "ER_CANNOT_CREATE_VIRTUAL_INDEX_CONSTRAINT";
  exports2[3176] = "ER_ERROR_ON_MODIFYING_GTID_EXECUTED_TABLE";
  exports2[3177] = "ER_LOCK_REFUSED_BY_ENGINE";
  exports2[3178] = "ER_UNSUPPORTED_ALTER_ONLINE_ON_VIRTUAL_COLUMN";
  exports2[3179] = "ER_MASTER_KEY_ROTATION_NOT_SUPPORTED_BY_SE";
  exports2[3180] = "ER_MASTER_KEY_ROTATION_ERROR_BY_SE";
  exports2[3181] = "ER_MASTER_KEY_ROTATION_BINLOG_FAILED";
  exports2[3182] = "ER_MASTER_KEY_ROTATION_SE_UNAVAILABLE";
  exports2[3183] = "ER_TABLESPACE_CANNOT_ENCRYPT";
  exports2[3184] = "ER_INVALID_ENCRYPTION_OPTION";
  exports2[3185] = "ER_CANNOT_FIND_KEY_IN_KEYRING";
  exports2[3186] = "ER_CAPACITY_EXCEEDED_IN_PARSER";
  exports2[3187] = "ER_UNSUPPORTED_ALTER_ENCRYPTION_INPLACE";
  exports2[3188] = "ER_KEYRING_UDF_KEYRING_SERVICE_ERROR";
  exports2[3189] = "ER_USER_COLUMN_OLD_LENGTH";
  exports2[3190] = "ER_CANT_RESET_MASTER";
  exports2[3191] = "ER_GROUP_REPLICATION_MAX_GROUP_SIZE";
  exports2[3192] = "ER_CANNOT_ADD_FOREIGN_BASE_COL_STORED";
  exports2[3193] = "ER_TABLE_REFERENCED";
  exports2[3194] = "ER_PARTITION_ENGINE_DEPRECATED_FOR_TABLE";
  exports2[3195] = "ER_WARN_USING_GEOMFROMWKB_TO_SET_SRID_ZERO";
  exports2[3196] = "ER_WARN_USING_GEOMFROMWKB_TO_SET_SRID";
  exports2[3197] = "ER_XA_RETRY";
  exports2[3198] = "ER_KEYRING_AWS_UDF_AWS_KMS_ERROR";
  exports2[3199] = "ER_BINLOG_UNSAFE_XA";
  exports2[3200] = "ER_UDF_ERROR";
  exports2[3201] = "ER_KEYRING_MIGRATION_FAILURE";
  exports2[3202] = "ER_KEYRING_ACCESS_DENIED_ERROR";
  exports2[3203] = "ER_KEYRING_MIGRATION_STATUS";
  exports2[3204] = "ER_PLUGIN_FAILED_TO_OPEN_TABLES";
  exports2[3205] = "ER_PLUGIN_FAILED_TO_OPEN_TABLE";
  exports2[3206] = "ER_AUDIT_LOG_NO_KEYRING_PLUGIN_INSTALLED";
  exports2[3207] = "ER_AUDIT_LOG_ENCRYPTION_PASSWORD_HAS_NOT_BEEN_SET";
  exports2[3208] = "ER_AUDIT_LOG_COULD_NOT_CREATE_AES_KEY";
  exports2[3209] = "ER_AUDIT_LOG_ENCRYPTION_PASSWORD_CANNOT_BE_FETCHED";
  exports2[3210] = "ER_AUDIT_LOG_JSON_FILTERING_NOT_ENABLED";
  exports2[3211] = "ER_AUDIT_LOG_UDF_INSUFFICIENT_PRIVILEGE";
  exports2[3212] = "ER_AUDIT_LOG_SUPER_PRIVILEGE_REQUIRED";
  exports2[3213] = "ER_COULD_NOT_REINITIALIZE_AUDIT_LOG_FILTERS";
  exports2[3214] = "ER_AUDIT_LOG_UDF_INVALID_ARGUMENT_TYPE";
  exports2[3215] = "ER_AUDIT_LOG_UDF_INVALID_ARGUMENT_COUNT";
  exports2[3216] = "ER_AUDIT_LOG_HAS_NOT_BEEN_INSTALLED";
  exports2[3217] = "ER_AUDIT_LOG_UDF_READ_INVALID_MAX_ARRAY_LENGTH_ARG_TYPE";
  exports2[3218] = "ER_AUDIT_LOG_UDF_READ_INVALID_MAX_ARRAY_LENGTH_ARG_VALUE";
  exports2[3219] = "ER_AUDIT_LOG_JSON_FILTER_PARSING_ERROR";
  exports2[3220] = "ER_AUDIT_LOG_JSON_FILTER_NAME_CANNOT_BE_EMPTY";
  exports2[3221] = "ER_AUDIT_LOG_JSON_USER_NAME_CANNOT_BE_EMPTY";
  exports2[3222] = "ER_AUDIT_LOG_JSON_FILTER_DOES_NOT_EXISTS";
  exports2[3223] = "ER_AUDIT_LOG_USER_FIRST_CHARACTER_MUST_BE_ALPHANUMERIC";
  exports2[3224] = "ER_AUDIT_LOG_USER_NAME_INVALID_CHARACTER";
  exports2[3225] = "ER_AUDIT_LOG_HOST_NAME_INVALID_CHARACTER";
  exports2[3226] = "WARN_DEPRECATED_MAXDB_SQL_MODE_FOR_TIMESTAMP";
  exports2[3227] = "ER_XA_REPLICATION_FILTERS";
  exports2[3228] = "ER_CANT_OPEN_ERROR_LOG";
  exports2[3229] = "ER_GROUPING_ON_TIMESTAMP_IN_DST";
  exports2[3230] = "ER_CANT_START_SERVER_NAMED_PIPE";
});

// node_modules/mysql/lib/protocol/Timer.js
var require_Timer = __commonJS((exports2, module2) => {
  var Timers = require("timers");
  module2.exports = Timer;
  function Timer(object) {
    this._object = object;
    this._timeout = null;
  }
  Timer.prototype.active = function active() {
    if (this._timeout) {
      if (this._timeout.refresh) {
        this._timeout.refresh();
      } else {
        Timers.active(this._timeout);
      }
    }
  };
  Timer.prototype.start = function start(msecs) {
    this.stop();
    this._timeout = Timers.setTimeout(this._onTimeout.bind(this), msecs);
  };
  Timer.prototype.stop = function stop() {
    if (this._timeout) {
      Timers.clearTimeout(this._timeout);
      this._timeout = null;
    }
  };
  Timer.prototype._onTimeout = function _onTimeout() {
    return this._object._onTimeout();
  };
});

// node_modules/mysql/lib/protocol/sequences/Sequence.js
var require_Sequence = __commonJS((exports2, module2) => {
  var Util = require("util");
  var EventEmitter = require("events").EventEmitter;
  var Packets = require_packets();
  var ErrorConstants = require_errors();
  var Timer = require_Timer();
  var listenerCount = EventEmitter.listenerCount || function(emitter, type) {
    return emitter.listeners(type).length;
  };
  var LONG_STACK_DELIMITER = "\n    --------------------\n";
  module2.exports = Sequence;
  Util.inherits(Sequence, EventEmitter);
  function Sequence(options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    EventEmitter.call(this);
    options = options || {};
    this._callback = callback;
    this._callSite = null;
    this._ended = false;
    this._timeout = options.timeout;
    this._timer = new Timer(this);
  }
  Sequence.determinePacket = function(byte) {
    switch (byte) {
      case 0:
        return Packets.OkPacket;
      case 254:
        return Packets.EofPacket;
      case 255:
        return Packets.ErrorPacket;
      default:
        return void 0;
    }
  };
  Sequence.prototype.hasErrorHandler = function() {
    return Boolean(this._callback) || listenerCount(this, "error") > 1;
  };
  Sequence.prototype._packetToError = function(packet) {
    var code = ErrorConstants[packet.errno] || "UNKNOWN_CODE_PLEASE_REPORT";
    var err = new Error(code + ": " + packet.message);
    err.code = code;
    err.errno = packet.errno;
    err.sqlMessage = packet.message;
    err.sqlState = packet.sqlState;
    return err;
  };
  Sequence.prototype.end = function(err) {
    if (this._ended) {
      return;
    }
    this._ended = true;
    if (err) {
      this._addLongStackTrace(err);
    }
    this._callSite = null;
    try {
      if (err) {
        this.emit("error", err);
      }
    } finally {
      try {
        if (this._callback) {
          this._callback.apply(this, arguments);
        }
      } finally {
        this.emit("end");
      }
    }
  };
  Sequence.prototype["OkPacket"] = function(packet) {
    this.end(null, packet);
  };
  Sequence.prototype["ErrorPacket"] = function(packet) {
    this.end(this._packetToError(packet));
  };
  Sequence.prototype.start = function() {
  };
  Sequence.prototype._addLongStackTrace = function _addLongStackTrace(err) {
    var callSiteStack = this._callSite && this._callSite.stack;
    if (!callSiteStack || typeof callSiteStack !== "string") {
      return;
    }
    if (err.stack.indexOf(LONG_STACK_DELIMITER) !== -1) {
      return;
    }
    var index = callSiteStack.indexOf("\n");
    if (index !== -1) {
      err.stack += LONG_STACK_DELIMITER + callSiteStack.substr(index + 1);
    }
  };
  Sequence.prototype._onTimeout = function _onTimeout() {
    this.emit("timeout");
  };
});

// node_modules/mysql/lib/protocol/Auth.js
var require_Auth = __commonJS((exports2) => {
  var Buffer2 = require_safe_buffer().Buffer;
  var Crypto = require("crypto");
  var Auth = exports2;
  function auth(name, data, options) {
    options = options || {};
    switch (name) {
      case "mysql_native_password":
        return Auth.token(options.password, data.slice(0, 20));
      default:
        return void 0;
    }
  }
  Auth.auth = auth;
  function sha1(msg) {
    var hash = Crypto.createHash("sha1");
    hash.update(msg, "binary");
    return hash.digest("binary");
  }
  Auth.sha1 = sha1;
  function xor(a, b) {
    a = Buffer2.from(a, "binary");
    b = Buffer2.from(b, "binary");
    var result = Buffer2.allocUnsafe(a.length);
    for (var i = 0; i < a.length; i++) {
      result[i] = a[i] ^ b[i];
    }
    return result;
  }
  Auth.xor = xor;
  Auth.token = function(password, scramble) {
    if (!password) {
      return Buffer2.alloc(0);
    }
    var stage1 = sha1(Buffer2.from(password, "utf8").toString("binary"));
    var stage2 = sha1(stage1);
    var stage3 = sha1(scramble.toString("binary") + stage2);
    return xor(stage3, stage1);
  };
  Auth.hashPassword = function(password) {
    var nr = [20528, 22325];
    var add = 7;
    var nr2 = [4660, 22129];
    var result = Buffer2.alloc(8);
    if (typeof password === "string") {
      password = Buffer2.from(password);
    }
    for (var i = 0; i < password.length; i++) {
      var c = password[i];
      if (c === 32 || c === 9) {
        continue;
      }
      nr = this.xor32(nr, this.add32(this.mul32(this.add32(this.and32(nr, [0, 63]), [0, add]), [0, c]), this.shl32(nr, 8)));
      nr2 = this.add32(nr2, this.xor32(this.shl32(nr2, 8), nr));
      add += c;
    }
    this.int31Write(result, nr, 0);
    this.int31Write(result, nr2, 4);
    return result;
  };
  Auth.randomInit = function(seed1, seed2) {
    return {
      max_value: 1073741823,
      max_value_dbl: 1073741823,
      seed1: seed1 % 1073741823,
      seed2: seed2 % 1073741823
    };
  };
  Auth.myRnd = function(r) {
    r.seed1 = (r.seed1 * 3 + r.seed2) % r.max_value;
    r.seed2 = (r.seed1 + r.seed2 + 33) % r.max_value;
    return r.seed1 / r.max_value_dbl;
  };
  Auth.scramble323 = function(message, password) {
    if (!password) {
      return Buffer2.alloc(0);
    }
    var to = Buffer2.allocUnsafe(8);
    var hashPass = this.hashPassword(password);
    var hashMessage = this.hashPassword(message.slice(0, 8));
    var seed1 = this.int32Read(hashPass, 0) ^ this.int32Read(hashMessage, 0);
    var seed2 = this.int32Read(hashPass, 4) ^ this.int32Read(hashMessage, 4);
    var r = this.randomInit(seed1, seed2);
    for (var i = 0; i < 8; i++) {
      to[i] = Math.floor(this.myRnd(r) * 31) + 64;
    }
    var extra = Math.floor(this.myRnd(r) * 31);
    for (var i = 0; i < 8; i++) {
      to[i] ^= extra;
    }
    return to;
  };
  Auth.xor32 = function(a, b) {
    return [a[0] ^ b[0], a[1] ^ b[1]];
  };
  Auth.add32 = function(a, b) {
    var w1 = a[1] + b[1];
    var w2 = a[0] + b[0] + ((w1 & 4294901760) >> 16);
    return [w2 & 65535, w1 & 65535];
  };
  Auth.mul32 = function(a, b) {
    var w1 = a[1] * b[1];
    var w2 = (a[1] * b[1] >> 16 & 65535) + (a[0] * b[1] & 65535) + (a[1] * b[0] & 65535);
    return [w2 & 65535, w1 & 65535];
  };
  Auth.and32 = function(a, b) {
    return [a[0] & b[0], a[1] & b[1]];
  };
  Auth.shl32 = function(a, b) {
    var w1 = a[1] << b;
    var w2 = a[0] << b | (w1 & 4294901760) >> 16;
    return [w2 & 65535, w1 & 65535];
  };
  Auth.int31Write = function(buffer, number, offset) {
    buffer[offset] = number[0] >> 8 & 127;
    buffer[offset + 1] = number[0] & 255;
    buffer[offset + 2] = number[1] >> 8 & 255;
    buffer[offset + 3] = number[1] & 255;
  };
  Auth.int32Read = function(buffer, offset) {
    return (buffer[offset] << 24) + (buffer[offset + 1] << 16) + (buffer[offset + 2] << 8) + buffer[offset + 3];
  };
});

// node_modules/mysql/lib/protocol/sequences/ChangeUser.js
var require_ChangeUser = __commonJS((exports2, module2) => {
  var Sequence = require_Sequence();
  var Util = require("util");
  var Packets = require_packets();
  var Auth = require_Auth();
  module2.exports = ChangeUser;
  Util.inherits(ChangeUser, Sequence);
  function ChangeUser(options, callback) {
    Sequence.call(this, options, callback);
    this._user = options.user;
    this._password = options.password;
    this._database = options.database;
    this._charsetNumber = options.charsetNumber;
    this._currentConfig = options.currentConfig;
  }
  ChangeUser.prototype.determinePacket = function determinePacket(firstByte) {
    switch (firstByte) {
      case 254:
        return Packets.AuthSwitchRequestPacket;
      case 255:
        return Packets.ErrorPacket;
      default:
        return void 0;
    }
  };
  ChangeUser.prototype.start = function(handshakeInitializationPacket) {
    var scrambleBuff = handshakeInitializationPacket.scrambleBuff();
    scrambleBuff = Auth.token(this._password, scrambleBuff);
    var packet = new Packets.ComChangeUserPacket({
      user: this._user,
      scrambleBuff,
      database: this._database,
      charsetNumber: this._charsetNumber
    });
    this._currentConfig.user = this._user;
    this._currentConfig.password = this._password;
    this._currentConfig.database = this._database;
    this._currentConfig.charsetNumber = this._charsetNumber;
    this.emit("packet", packet);
  };
  ChangeUser.prototype["AuthSwitchRequestPacket"] = function(packet) {
    var name = packet.authMethodName;
    var data = Auth.auth(name, packet.authMethodData, {
      password: this._password
    });
    if (data !== void 0) {
      this.emit("packet", new Packets.AuthSwitchResponsePacket({
        data
      }));
    } else {
      var err = new Error("MySQL is requesting the " + name + " authentication method, which is not supported.");
      err.code = "UNSUPPORTED_AUTH_METHOD";
      err.fatal = true;
      this.end(err);
    }
  };
  ChangeUser.prototype["ErrorPacket"] = function(packet) {
    var err = this._packetToError(packet);
    err.fatal = true;
    this.end(err);
  };
});

// node_modules/mysql/lib/protocol/sequences/Handshake.js
var require_Handshake = __commonJS((exports2, module2) => {
  var Sequence = require_Sequence();
  var Util = require("util");
  var Packets = require_packets();
  var Auth = require_Auth();
  var ClientConstants = require_client();
  module2.exports = Handshake;
  Util.inherits(Handshake, Sequence);
  function Handshake(options, callback) {
    Sequence.call(this, options, callback);
    options = options || {};
    this._config = options.config;
    this._handshakeInitializationPacket = null;
  }
  Handshake.prototype.determinePacket = function determinePacket(firstByte, parser) {
    if (firstByte === 255) {
      return Packets.ErrorPacket;
    }
    if (!this._handshakeInitializationPacket) {
      return Packets.HandshakeInitializationPacket;
    }
    if (firstByte === 254) {
      return parser.packetLength() === 1 ? Packets.UseOldPasswordPacket : Packets.AuthSwitchRequestPacket;
    }
    return void 0;
  };
  Handshake.prototype["AuthSwitchRequestPacket"] = function(packet) {
    var name = packet.authMethodName;
    var data = Auth.auth(name, packet.authMethodData, {
      password: this._config.password
    });
    if (data !== void 0) {
      this.emit("packet", new Packets.AuthSwitchResponsePacket({
        data
      }));
    } else {
      var err = new Error("MySQL is requesting the " + name + " authentication method, which is not supported.");
      err.code = "UNSUPPORTED_AUTH_METHOD";
      err.fatal = true;
      this.end(err);
    }
  };
  Handshake.prototype["HandshakeInitializationPacket"] = function(packet) {
    this._handshakeInitializationPacket = packet;
    this._config.protocol41 = packet.protocol41;
    var serverSSLSupport = packet.serverCapabilities1 & ClientConstants.CLIENT_SSL;
    if (this._config.ssl) {
      if (!serverSSLSupport) {
        var err = new Error("Server does not support secure connection");
        err.code = "HANDSHAKE_NO_SSL_SUPPORT";
        err.fatal = true;
        this.end(err);
        return;
      }
      this._config.clientFlags |= ClientConstants.CLIENT_SSL;
      this.emit("packet", new Packets.SSLRequestPacket({
        clientFlags: this._config.clientFlags,
        maxPacketSize: this._config.maxPacketSize,
        charsetNumber: this._config.charsetNumber
      }));
      this.emit("start-tls");
    } else {
      this._sendCredentials();
    }
  };
  Handshake.prototype._tlsUpgradeCompleteHandler = function() {
    this._sendCredentials();
  };
  Handshake.prototype._sendCredentials = function() {
    var packet = this._handshakeInitializationPacket;
    this.emit("packet", new Packets.ClientAuthenticationPacket({
      clientFlags: this._config.clientFlags,
      maxPacketSize: this._config.maxPacketSize,
      charsetNumber: this._config.charsetNumber,
      user: this._config.user,
      database: this._config.database,
      protocol41: packet.protocol41,
      scrambleBuff: packet.protocol41 ? Auth.token(this._config.password, packet.scrambleBuff()) : Auth.scramble323(packet.scrambleBuff(), this._config.password)
    }));
  };
  Handshake.prototype["UseOldPasswordPacket"] = function() {
    if (!this._config.insecureAuth) {
      var err = new Error("MySQL server is requesting the old and insecure pre-4.1 auth mechanism. Upgrade the user password or use the {insecureAuth: true} option.");
      err.code = "HANDSHAKE_INSECURE_AUTH";
      err.fatal = true;
      this.end(err);
      return;
    }
    this.emit("packet", new Packets.OldPasswordPacket({
      scrambleBuff: Auth.scramble323(this._handshakeInitializationPacket.scrambleBuff(), this._config.password)
    }));
  };
  Handshake.prototype["ErrorPacket"] = function(packet) {
    var err = this._packetToError(packet, true);
    err.fatal = true;
    this.end(err);
  };
});

// node_modules/mysql/lib/protocol/sequences/Ping.js
var require_Ping = __commonJS((exports2, module2) => {
  var Sequence = require_Sequence();
  var Util = require("util");
  var Packets = require_packets();
  module2.exports = Ping;
  Util.inherits(Ping, Sequence);
  function Ping(options, callback) {
    if (!callback && typeof options === "function") {
      callback = options;
      options = {};
    }
    Sequence.call(this, options, callback);
  }
  Ping.prototype.start = function() {
    this.emit("packet", new Packets.ComPingPacket());
  };
});

// node_modules/mysql/lib/protocol/ResultSet.js
var require_ResultSet = __commonJS((exports2, module2) => {
  module2.exports = ResultSet;
  function ResultSet(resultSetHeaderPacket) {
    this.resultSetHeaderPacket = resultSetHeaderPacket;
    this.fieldPackets = [];
    this.eofPackets = [];
    this.rows = [];
  }
});

// node_modules/mysql/lib/protocol/constants/server_status.js
var require_server_status = __commonJS((exports2) => {
  exports2.SERVER_STATUS_IN_TRANS = 1;
  exports2.SERVER_STATUS_AUTOCOMMIT = 2;
  exports2.SERVER_MORE_RESULTS_EXISTS = 8;
  exports2.SERVER_QUERY_NO_GOOD_INDEX_USED = 16;
  exports2.SERVER_QUERY_NO_INDEX_USED = 32;
  exports2.SERVER_STATUS_CURSOR_EXISTS = 64;
  exports2.SERVER_STATUS_LAST_ROW_SENT = 128;
  exports2.SERVER_STATUS_DB_DROPPED = 256;
  exports2.SERVER_STATUS_NO_BACKSLASH_ESCAPES = 512;
  exports2.SERVER_STATUS_METADATA_CHANGED = 1024;
  exports2.SERVER_QUERY_WAS_SLOW = 2048;
  exports2.SERVER_PS_OUT_PARAMS = 4096;
});

// node_modules/process-nextick-args/index.js
var require_process_nextick_args = __commonJS((exports2, module2) => {
  "use strict";
  if (typeof process === "undefined" || !process.version || process.version.indexOf("v0.") === 0 || process.version.indexOf("v1.") === 0 && process.version.indexOf("v1.8.") !== 0) {
    module2.exports = {nextTick};
  } else {
    module2.exports = process;
  }
  function nextTick(fn, arg1, arg2, arg3) {
    if (typeof fn !== "function") {
      throw new TypeError('"callback" argument must be a function');
    }
    var len = arguments.length;
    var args, i;
    switch (len) {
      case 0:
      case 1:
        return process.nextTick(fn);
      case 2:
        return process.nextTick(function afterTickOne() {
          fn.call(null, arg1);
        });
      case 3:
        return process.nextTick(function afterTickTwo() {
          fn.call(null, arg1, arg2);
        });
      case 4:
        return process.nextTick(function afterTickThree() {
          fn.call(null, arg1, arg2, arg3);
        });
      default:
        args = new Array(len - 1);
        i = 0;
        while (i < args.length) {
          args[i++] = arguments[i];
        }
        return process.nextTick(function afterTick() {
          fn.apply(null, args);
        });
    }
  }
});

// node_modules/isarray/index.js
var require_isarray = __commonJS((exports2, module2) => {
  var toString = {}.toString;
  module2.exports = Array.isArray || function(arr) {
    return toString.call(arr) == "[object Array]";
  };
});

// node_modules/readable-stream/lib/internal/streams/stream.js
var require_stream = __commonJS((exports2, module2) => {
  module2.exports = require("stream");
});

// node_modules/core-util-is/lib/util.js
var require_util2 = __commonJS((exports2) => {
  function isArray(arg) {
    if (Array.isArray) {
      return Array.isArray(arg);
    }
    return objectToString(arg) === "[object Array]";
  }
  exports2.isArray = isArray;
  function isBoolean(arg) {
    return typeof arg === "boolean";
  }
  exports2.isBoolean = isBoolean;
  function isNull(arg) {
    return arg === null;
  }
  exports2.isNull = isNull;
  function isNullOrUndefined(arg) {
    return arg == null;
  }
  exports2.isNullOrUndefined = isNullOrUndefined;
  function isNumber(arg) {
    return typeof arg === "number";
  }
  exports2.isNumber = isNumber;
  function isString(arg) {
    return typeof arg === "string";
  }
  exports2.isString = isString;
  function isSymbol(arg) {
    return typeof arg === "symbol";
  }
  exports2.isSymbol = isSymbol;
  function isUndefined(arg) {
    return arg === void 0;
  }
  exports2.isUndefined = isUndefined;
  function isRegExp(re) {
    return objectToString(re) === "[object RegExp]";
  }
  exports2.isRegExp = isRegExp;
  function isObject(arg) {
    return typeof arg === "object" && arg !== null;
  }
  exports2.isObject = isObject;
  function isDate(d) {
    return objectToString(d) === "[object Date]";
  }
  exports2.isDate = isDate;
  function isError(e) {
    return objectToString(e) === "[object Error]" || e instanceof Error;
  }
  exports2.isError = isError;
  function isFunction(arg) {
    return typeof arg === "function";
  }
  exports2.isFunction = isFunction;
  function isPrimitive(arg) {
    return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || typeof arg === "undefined";
  }
  exports2.isPrimitive = isPrimitive;
  exports2.isBuffer = Buffer.isBuffer;
  function objectToString(o) {
    return Object.prototype.toString.call(o);
  }
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS((exports2, module2) => {
  if (typeof Object.create === "function") {
    module2.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    };
  } else {
    module2.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function() {
      };
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    };
  }
});

// node_modules/inherits/inherits.js
var require_inherits = __commonJS((exports2, module2) => {
  try {
    util = require("util");
    if (typeof util.inherits !== "function")
      throw "";
    module2.exports = util.inherits;
  } catch (e) {
    module2.exports = require_inherits_browser();
  }
  var util;
});

// node_modules/readable-stream/lib/internal/streams/BufferList.js
var require_BufferList2 = __commonJS((exports2, module2) => {
  "use strict";
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  var Buffer2 = require_safe_buffer().Buffer;
  var util = require("util");
  function copyBuffer(src, target, offset) {
    src.copy(target, offset);
  }
  module2.exports = function() {
    function BufferList() {
      _classCallCheck(this, BufferList);
      this.head = null;
      this.tail = null;
      this.length = 0;
    }
    BufferList.prototype.push = function push(v) {
      var entry = {data: v, next: null};
      if (this.length > 0)
        this.tail.next = entry;
      else
        this.head = entry;
      this.tail = entry;
      ++this.length;
    };
    BufferList.prototype.unshift = function unshift(v) {
      var entry = {data: v, next: this.head};
      if (this.length === 0)
        this.tail = entry;
      this.head = entry;
      ++this.length;
    };
    BufferList.prototype.shift = function shift() {
      if (this.length === 0)
        return;
      var ret = this.head.data;
      if (this.length === 1)
        this.head = this.tail = null;
      else
        this.head = this.head.next;
      --this.length;
      return ret;
    };
    BufferList.prototype.clear = function clear() {
      this.head = this.tail = null;
      this.length = 0;
    };
    BufferList.prototype.join = function join(s) {
      if (this.length === 0)
        return "";
      var p = this.head;
      var ret = "" + p.data;
      while (p = p.next) {
        ret += s + p.data;
      }
      return ret;
    };
    BufferList.prototype.concat = function concat(n) {
      if (this.length === 0)
        return Buffer2.alloc(0);
      if (this.length === 1)
        return this.head.data;
      var ret = Buffer2.allocUnsafe(n >>> 0);
      var p = this.head;
      var i = 0;
      while (p) {
        copyBuffer(p.data, ret, i);
        i += p.data.length;
        p = p.next;
      }
      return ret;
    };
    return BufferList;
  }();
  if (util && util.inspect && util.inspect.custom) {
    module2.exports.prototype[util.inspect.custom] = function() {
      var obj = util.inspect({length: this.length});
      return this.constructor.name + " " + obj;
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy = __commonJS((exports2, module2) => {
  "use strict";
  var pna = require_process_nextick_args();
  function destroy(err, cb) {
    var _this = this;
    var readableDestroyed = this._readableState && this._readableState.destroyed;
    var writableDestroyed = this._writableState && this._writableState.destroyed;
    if (readableDestroyed || writableDestroyed) {
      if (cb) {
        cb(err);
      } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
        pna.nextTick(emitErrorNT, this, err);
      }
      return this;
    }
    if (this._readableState) {
      this._readableState.destroyed = true;
    }
    if (this._writableState) {
      this._writableState.destroyed = true;
    }
    this._destroy(err || null, function(err2) {
      if (!cb && err2) {
        pna.nextTick(emitErrorNT, _this, err2);
        if (_this._writableState) {
          _this._writableState.errorEmitted = true;
        }
      } else if (cb) {
        cb(err2);
      }
    });
    return this;
  }
  function undestroy() {
    if (this._readableState) {
      this._readableState.destroyed = false;
      this._readableState.reading = false;
      this._readableState.ended = false;
      this._readableState.endEmitted = false;
    }
    if (this._writableState) {
      this._writableState.destroyed = false;
      this._writableState.ended = false;
      this._writableState.ending = false;
      this._writableState.finished = false;
      this._writableState.errorEmitted = false;
    }
  }
  function emitErrorNT(self2, err) {
    self2.emit("error", err);
  }
  module2.exports = {
    destroy,
    undestroy
  };
});

// node_modules/util-deprecate/node.js
var require_node = __commonJS((exports2, module2) => {
  module2.exports = require("util").deprecate;
});

// node_modules/readable-stream/lib/_stream_writable.js
var require_stream_writable = __commonJS((exports2, module2) => {
  "use strict";
  var pna = require_process_nextick_args();
  module2.exports = Writable;
  function CorkedRequest(state) {
    var _this = this;
    this.next = null;
    this.entry = null;
    this.finish = function() {
      onCorkedFinish(_this, state);
    };
  }
  var asyncWrite = !process.browser && ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
  var Duplex;
  Writable.WritableState = WritableState;
  var util = Object.create(require_util2());
  util.inherits = require_inherits();
  var internalUtil = {
    deprecate: require_node()
  };
  var Stream = require_stream();
  var Buffer2 = require_safe_buffer().Buffer;
  var OurUint8Array = global.Uint8Array || function() {
  };
  function _uint8ArrayToBuffer(chunk) {
    return Buffer2.from(chunk);
  }
  function _isUint8Array(obj) {
    return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
  }
  var destroyImpl = require_destroy();
  util.inherits(Writable, Stream);
  function nop() {
  }
  function WritableState(options, stream) {
    Duplex = Duplex || require_stream_duplex();
    options = options || {};
    var isDuplex = stream instanceof Duplex;
    this.objectMode = !!options.objectMode;
    if (isDuplex)
      this.objectMode = this.objectMode || !!options.writableObjectMode;
    var hwm = options.highWaterMark;
    var writableHwm = options.writableHighWaterMark;
    var defaultHwm = this.objectMode ? 16 : 16 * 1024;
    if (hwm || hwm === 0)
      this.highWaterMark = hwm;
    else if (isDuplex && (writableHwm || writableHwm === 0))
      this.highWaterMark = writableHwm;
    else
      this.highWaterMark = defaultHwm;
    this.highWaterMark = Math.floor(this.highWaterMark);
    this.finalCalled = false;
    this.needDrain = false;
    this.ending = false;
    this.ended = false;
    this.finished = false;
    this.destroyed = false;
    var noDecode = options.decodeStrings === false;
    this.decodeStrings = !noDecode;
    this.defaultEncoding = options.defaultEncoding || "utf8";
    this.length = 0;
    this.writing = false;
    this.corked = 0;
    this.sync = true;
    this.bufferProcessing = false;
    this.onwrite = function(er) {
      onwrite(stream, er);
    };
    this.writecb = null;
    this.writelen = 0;
    this.bufferedRequest = null;
    this.lastBufferedRequest = null;
    this.pendingcb = 0;
    this.prefinished = false;
    this.errorEmitted = false;
    this.bufferedRequestCount = 0;
    this.corkedRequestsFree = new CorkedRequest(this);
  }
  WritableState.prototype.getBuffer = function getBuffer() {
    var current = this.bufferedRequest;
    var out = [];
    while (current) {
      out.push(current);
      current = current.next;
    }
    return out;
  };
  (function() {
    try {
      Object.defineProperty(WritableState.prototype, "buffer", {
        get: internalUtil.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch (_) {
    }
  })();
  var realHasInstance;
  if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
    realHasInstance = Function.prototype[Symbol.hasInstance];
    Object.defineProperty(Writable, Symbol.hasInstance, {
      value: function(object) {
        if (realHasInstance.call(this, object))
          return true;
        if (this !== Writable)
          return false;
        return object && object._writableState instanceof WritableState;
      }
    });
  } else {
    realHasInstance = function(object) {
      return object instanceof this;
    };
  }
  function Writable(options) {
    Duplex = Duplex || require_stream_duplex();
    if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
      return new Writable(options);
    }
    this._writableState = new WritableState(options, this);
    this.writable = true;
    if (options) {
      if (typeof options.write === "function")
        this._write = options.write;
      if (typeof options.writev === "function")
        this._writev = options.writev;
      if (typeof options.destroy === "function")
        this._destroy = options.destroy;
      if (typeof options.final === "function")
        this._final = options.final;
    }
    Stream.call(this);
  }
  Writable.prototype.pipe = function() {
    this.emit("error", new Error("Cannot pipe, not readable"));
  };
  function writeAfterEnd(stream, cb) {
    var er = new Error("write after end");
    stream.emit("error", er);
    pna.nextTick(cb, er);
  }
  function validChunk(stream, state, chunk, cb) {
    var valid = true;
    var er = false;
    if (chunk === null) {
      er = new TypeError("May not write null values to stream");
    } else if (typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
      er = new TypeError("Invalid non-string/buffer chunk");
    }
    if (er) {
      stream.emit("error", er);
      pna.nextTick(cb, er);
      valid = false;
    }
    return valid;
  }
  Writable.prototype.write = function(chunk, encoding, cb) {
    var state = this._writableState;
    var ret = false;
    var isBuf = !state.objectMode && _isUint8Array(chunk);
    if (isBuf && !Buffer2.isBuffer(chunk)) {
      chunk = _uint8ArrayToBuffer(chunk);
    }
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = null;
    }
    if (isBuf)
      encoding = "buffer";
    else if (!encoding)
      encoding = state.defaultEncoding;
    if (typeof cb !== "function")
      cb = nop;
    if (state.ended)
      writeAfterEnd(this, cb);
    else if (isBuf || validChunk(this, state, chunk, cb)) {
      state.pendingcb++;
      ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
    }
    return ret;
  };
  Writable.prototype.cork = function() {
    var state = this._writableState;
    state.corked++;
  };
  Writable.prototype.uncork = function() {
    var state = this._writableState;
    if (state.corked) {
      state.corked--;
      if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest)
        clearBuffer(this, state);
    }
  };
  Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
    if (typeof encoding === "string")
      encoding = encoding.toLowerCase();
    if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1))
      throw new TypeError("Unknown encoding: " + encoding);
    this._writableState.defaultEncoding = encoding;
    return this;
  };
  function decodeChunk(state, chunk, encoding) {
    if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
      chunk = Buffer2.from(chunk, encoding);
    }
    return chunk;
  }
  Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
    enumerable: false,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
    if (!isBuf) {
      var newChunk = decodeChunk(state, chunk, encoding);
      if (chunk !== newChunk) {
        isBuf = true;
        encoding = "buffer";
        chunk = newChunk;
      }
    }
    var len = state.objectMode ? 1 : chunk.length;
    state.length += len;
    var ret = state.length < state.highWaterMark;
    if (!ret)
      state.needDrain = true;
    if (state.writing || state.corked) {
      var last = state.lastBufferedRequest;
      state.lastBufferedRequest = {
        chunk,
        encoding,
        isBuf,
        callback: cb,
        next: null
      };
      if (last) {
        last.next = state.lastBufferedRequest;
      } else {
        state.bufferedRequest = state.lastBufferedRequest;
      }
      state.bufferedRequestCount += 1;
    } else {
      doWrite(stream, state, false, len, chunk, encoding, cb);
    }
    return ret;
  }
  function doWrite(stream, state, writev, len, chunk, encoding, cb) {
    state.writelen = len;
    state.writecb = cb;
    state.writing = true;
    state.sync = true;
    if (writev)
      stream._writev(chunk, state.onwrite);
    else
      stream._write(chunk, encoding, state.onwrite);
    state.sync = false;
  }
  function onwriteError(stream, state, sync, er, cb) {
    --state.pendingcb;
    if (sync) {
      pna.nextTick(cb, er);
      pna.nextTick(finishMaybe, stream, state);
      stream._writableState.errorEmitted = true;
      stream.emit("error", er);
    } else {
      cb(er);
      stream._writableState.errorEmitted = true;
      stream.emit("error", er);
      finishMaybe(stream, state);
    }
  }
  function onwriteStateUpdate(state) {
    state.writing = false;
    state.writecb = null;
    state.length -= state.writelen;
    state.writelen = 0;
  }
  function onwrite(stream, er) {
    var state = stream._writableState;
    var sync = state.sync;
    var cb = state.writecb;
    onwriteStateUpdate(state);
    if (er)
      onwriteError(stream, state, sync, er, cb);
    else {
      var finished = needFinish(state);
      if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
        clearBuffer(stream, state);
      }
      if (sync) {
        asyncWrite(afterWrite, stream, state, finished, cb);
      } else {
        afterWrite(stream, state, finished, cb);
      }
    }
  }
  function afterWrite(stream, state, finished, cb) {
    if (!finished)
      onwriteDrain(stream, state);
    state.pendingcb--;
    cb();
    finishMaybe(stream, state);
  }
  function onwriteDrain(stream, state) {
    if (state.length === 0 && state.needDrain) {
      state.needDrain = false;
      stream.emit("drain");
    }
  }
  function clearBuffer(stream, state) {
    state.bufferProcessing = true;
    var entry = state.bufferedRequest;
    if (stream._writev && entry && entry.next) {
      var l = state.bufferedRequestCount;
      var buffer = new Array(l);
      var holder = state.corkedRequestsFree;
      holder.entry = entry;
      var count = 0;
      var allBuffers = true;
      while (entry) {
        buffer[count] = entry;
        if (!entry.isBuf)
          allBuffers = false;
        entry = entry.next;
        count += 1;
      }
      buffer.allBuffers = allBuffers;
      doWrite(stream, state, true, state.length, buffer, "", holder.finish);
      state.pendingcb++;
      state.lastBufferedRequest = null;
      if (holder.next) {
        state.corkedRequestsFree = holder.next;
        holder.next = null;
      } else {
        state.corkedRequestsFree = new CorkedRequest(state);
      }
      state.bufferedRequestCount = 0;
    } else {
      while (entry) {
        var chunk = entry.chunk;
        var encoding = entry.encoding;
        var cb = entry.callback;
        var len = state.objectMode ? 1 : chunk.length;
        doWrite(stream, state, false, len, chunk, encoding, cb);
        entry = entry.next;
        state.bufferedRequestCount--;
        if (state.writing) {
          break;
        }
      }
      if (entry === null)
        state.lastBufferedRequest = null;
    }
    state.bufferedRequest = entry;
    state.bufferProcessing = false;
  }
  Writable.prototype._write = function(chunk, encoding, cb) {
    cb(new Error("_write() is not implemented"));
  };
  Writable.prototype._writev = null;
  Writable.prototype.end = function(chunk, encoding, cb) {
    var state = this._writableState;
    if (typeof chunk === "function") {
      cb = chunk;
      chunk = null;
      encoding = null;
    } else if (typeof encoding === "function") {
      cb = encoding;
      encoding = null;
    }
    if (chunk !== null && chunk !== void 0)
      this.write(chunk, encoding);
    if (state.corked) {
      state.corked = 1;
      this.uncork();
    }
    if (!state.ending && !state.finished)
      endWritable(this, state, cb);
  };
  function needFinish(state) {
    return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
  }
  function callFinal(stream, state) {
    stream._final(function(err) {
      state.pendingcb--;
      if (err) {
        stream.emit("error", err);
      }
      state.prefinished = true;
      stream.emit("prefinish");
      finishMaybe(stream, state);
    });
  }
  function prefinish(stream, state) {
    if (!state.prefinished && !state.finalCalled) {
      if (typeof stream._final === "function") {
        state.pendingcb++;
        state.finalCalled = true;
        pna.nextTick(callFinal, stream, state);
      } else {
        state.prefinished = true;
        stream.emit("prefinish");
      }
    }
  }
  function finishMaybe(stream, state) {
    var need = needFinish(state);
    if (need) {
      prefinish(stream, state);
      if (state.pendingcb === 0) {
        state.finished = true;
        stream.emit("finish");
      }
    }
    return need;
  }
  function endWritable(stream, state, cb) {
    state.ending = true;
    finishMaybe(stream, state);
    if (cb) {
      if (state.finished)
        pna.nextTick(cb);
      else
        stream.once("finish", cb);
    }
    state.ended = true;
    stream.writable = false;
  }
  function onCorkedFinish(corkReq, state, err) {
    var entry = corkReq.entry;
    corkReq.entry = null;
    while (entry) {
      var cb = entry.callback;
      state.pendingcb--;
      cb(err);
      entry = entry.next;
    }
    if (state.corkedRequestsFree) {
      state.corkedRequestsFree.next = corkReq;
    } else {
      state.corkedRequestsFree = corkReq;
    }
  }
  Object.defineProperty(Writable.prototype, "destroyed", {
    get: function() {
      if (this._writableState === void 0) {
        return false;
      }
      return this._writableState.destroyed;
    },
    set: function(value) {
      if (!this._writableState) {
        return;
      }
      this._writableState.destroyed = value;
    }
  });
  Writable.prototype.destroy = destroyImpl.destroy;
  Writable.prototype._undestroy = destroyImpl.undestroy;
  Writable.prototype._destroy = function(err, cb) {
    this.end();
    cb(err);
  };
});

// node_modules/readable-stream/lib/_stream_duplex.js
var require_stream_duplex = __commonJS((exports2, module2) => {
  "use strict";
  var pna = require_process_nextick_args();
  var objectKeys = Object.keys || function(obj) {
    var keys2 = [];
    for (var key in obj) {
      keys2.push(key);
    }
    return keys2;
  };
  module2.exports = Duplex;
  var util = Object.create(require_util2());
  util.inherits = require_inherits();
  var Readable = require_stream_readable();
  var Writable = require_stream_writable();
  util.inherits(Duplex, Readable);
  {
    keys = objectKeys(Writable.prototype);
    for (v = 0; v < keys.length; v++) {
      method = keys[v];
      if (!Duplex.prototype[method])
        Duplex.prototype[method] = Writable.prototype[method];
    }
  }
  var keys;
  var method;
  var v;
  function Duplex(options) {
    if (!(this instanceof Duplex))
      return new Duplex(options);
    Readable.call(this, options);
    Writable.call(this, options);
    if (options && options.readable === false)
      this.readable = false;
    if (options && options.writable === false)
      this.writable = false;
    this.allowHalfOpen = true;
    if (options && options.allowHalfOpen === false)
      this.allowHalfOpen = false;
    this.once("end", onend);
  }
  Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
    enumerable: false,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function onend() {
    if (this.allowHalfOpen || this._writableState.ended)
      return;
    pna.nextTick(onEndNT, this);
  }
  function onEndNT(self2) {
    self2.end();
  }
  Object.defineProperty(Duplex.prototype, "destroyed", {
    get: function() {
      if (this._readableState === void 0 || this._writableState === void 0) {
        return false;
      }
      return this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function(value) {
      if (this._readableState === void 0 || this._writableState === void 0) {
        return;
      }
      this._readableState.destroyed = value;
      this._writableState.destroyed = value;
    }
  });
  Duplex.prototype._destroy = function(err, cb) {
    this.push(null);
    this.end();
    pna.nextTick(cb, err);
  };
});

// node_modules/readable-stream/lib/_stream_readable.js
var require_stream_readable = __commonJS((exports2, module2) => {
  "use strict";
  var pna = require_process_nextick_args();
  module2.exports = Readable;
  var isArray = require_isarray();
  var Duplex;
  Readable.ReadableState = ReadableState;
  var EE = require("events").EventEmitter;
  var EElistenerCount = function(emitter, type) {
    return emitter.listeners(type).length;
  };
  var Stream = require_stream();
  var Buffer2 = require_safe_buffer().Buffer;
  var OurUint8Array = global.Uint8Array || function() {
  };
  function _uint8ArrayToBuffer(chunk) {
    return Buffer2.from(chunk);
  }
  function _isUint8Array(obj) {
    return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
  }
  var util = Object.create(require_util2());
  util.inherits = require_inherits();
  var debugUtil = require("util");
  var debug = void 0;
  if (debugUtil && debugUtil.debuglog) {
    debug = debugUtil.debuglog("stream");
  } else {
    debug = function() {
    };
  }
  var BufferList = require_BufferList2();
  var destroyImpl = require_destroy();
  var StringDecoder;
  util.inherits(Readable, Stream);
  var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
  function prependListener(emitter, event, fn) {
    if (typeof emitter.prependListener === "function")
      return emitter.prependListener(event, fn);
    if (!emitter._events || !emitter._events[event])
      emitter.on(event, fn);
    else if (isArray(emitter._events[event]))
      emitter._events[event].unshift(fn);
    else
      emitter._events[event] = [fn, emitter._events[event]];
  }
  function ReadableState(options, stream) {
    Duplex = Duplex || require_stream_duplex();
    options = options || {};
    var isDuplex = stream instanceof Duplex;
    this.objectMode = !!options.objectMode;
    if (isDuplex)
      this.objectMode = this.objectMode || !!options.readableObjectMode;
    var hwm = options.highWaterMark;
    var readableHwm = options.readableHighWaterMark;
    var defaultHwm = this.objectMode ? 16 : 16 * 1024;
    if (hwm || hwm === 0)
      this.highWaterMark = hwm;
    else if (isDuplex && (readableHwm || readableHwm === 0))
      this.highWaterMark = readableHwm;
    else
      this.highWaterMark = defaultHwm;
    this.highWaterMark = Math.floor(this.highWaterMark);
    this.buffer = new BufferList();
    this.length = 0;
    this.pipes = null;
    this.pipesCount = 0;
    this.flowing = null;
    this.ended = false;
    this.endEmitted = false;
    this.reading = false;
    this.sync = true;
    this.needReadable = false;
    this.emittedReadable = false;
    this.readableListening = false;
    this.resumeScheduled = false;
    this.destroyed = false;
    this.defaultEncoding = options.defaultEncoding || "utf8";
    this.awaitDrain = 0;
    this.readingMore = false;
    this.decoder = null;
    this.encoding = null;
    if (options.encoding) {
      if (!StringDecoder)
        StringDecoder = require("string_decoder/").StringDecoder;
      this.decoder = new StringDecoder(options.encoding);
      this.encoding = options.encoding;
    }
  }
  function Readable(options) {
    Duplex = Duplex || require_stream_duplex();
    if (!(this instanceof Readable))
      return new Readable(options);
    this._readableState = new ReadableState(options, this);
    this.readable = true;
    if (options) {
      if (typeof options.read === "function")
        this._read = options.read;
      if (typeof options.destroy === "function")
        this._destroy = options.destroy;
    }
    Stream.call(this);
  }
  Object.defineProperty(Readable.prototype, "destroyed", {
    get: function() {
      if (this._readableState === void 0) {
        return false;
      }
      return this._readableState.destroyed;
    },
    set: function(value) {
      if (!this._readableState) {
        return;
      }
      this._readableState.destroyed = value;
    }
  });
  Readable.prototype.destroy = destroyImpl.destroy;
  Readable.prototype._undestroy = destroyImpl.undestroy;
  Readable.prototype._destroy = function(err, cb) {
    this.push(null);
    cb(err);
  };
  Readable.prototype.push = function(chunk, encoding) {
    var state = this._readableState;
    var skipChunkCheck;
    if (!state.objectMode) {
      if (typeof chunk === "string") {
        encoding = encoding || state.defaultEncoding;
        if (encoding !== state.encoding) {
          chunk = Buffer2.from(chunk, encoding);
          encoding = "";
        }
        skipChunkCheck = true;
      }
    } else {
      skipChunkCheck = true;
    }
    return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
  };
  Readable.prototype.unshift = function(chunk) {
    return readableAddChunk(this, chunk, null, true, false);
  };
  function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
    var state = stream._readableState;
    if (chunk === null) {
      state.reading = false;
      onEofChunk(stream, state);
    } else {
      var er;
      if (!skipChunkCheck)
        er = chunkInvalid(state, chunk);
      if (er) {
        stream.emit("error", er);
      } else if (state.objectMode || chunk && chunk.length > 0) {
        if (typeof chunk !== "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer2.prototype) {
          chunk = _uint8ArrayToBuffer(chunk);
        }
        if (addToFront) {
          if (state.endEmitted)
            stream.emit("error", new Error("stream.unshift() after end event"));
          else
            addChunk(stream, state, chunk, true);
        } else if (state.ended) {
          stream.emit("error", new Error("stream.push() after EOF"));
        } else {
          state.reading = false;
          if (state.decoder && !encoding) {
            chunk = state.decoder.write(chunk);
            if (state.objectMode || chunk.length !== 0)
              addChunk(stream, state, chunk, false);
            else
              maybeReadMore(stream, state);
          } else {
            addChunk(stream, state, chunk, false);
          }
        }
      } else if (!addToFront) {
        state.reading = false;
      }
    }
    return needMoreData(state);
  }
  function addChunk(stream, state, chunk, addToFront) {
    if (state.flowing && state.length === 0 && !state.sync) {
      stream.emit("data", chunk);
      stream.read(0);
    } else {
      state.length += state.objectMode ? 1 : chunk.length;
      if (addToFront)
        state.buffer.unshift(chunk);
      else
        state.buffer.push(chunk);
      if (state.needReadable)
        emitReadable(stream);
    }
    maybeReadMore(stream, state);
  }
  function chunkInvalid(state, chunk) {
    var er;
    if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
      er = new TypeError("Invalid non-string/buffer chunk");
    }
    return er;
  }
  function needMoreData(state) {
    return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
  }
  Readable.prototype.isPaused = function() {
    return this._readableState.flowing === false;
  };
  Readable.prototype.setEncoding = function(enc) {
    if (!StringDecoder)
      StringDecoder = require("string_decoder/").StringDecoder;
    this._readableState.decoder = new StringDecoder(enc);
    this._readableState.encoding = enc;
    return this;
  };
  var MAX_HWM = 8388608;
  function computeNewHighWaterMark(n) {
    if (n >= MAX_HWM) {
      n = MAX_HWM;
    } else {
      n--;
      n |= n >>> 1;
      n |= n >>> 2;
      n |= n >>> 4;
      n |= n >>> 8;
      n |= n >>> 16;
      n++;
    }
    return n;
  }
  function howMuchToRead(n, state) {
    if (n <= 0 || state.length === 0 && state.ended)
      return 0;
    if (state.objectMode)
      return 1;
    if (n !== n) {
      if (state.flowing && state.length)
        return state.buffer.head.data.length;
      else
        return state.length;
    }
    if (n > state.highWaterMark)
      state.highWaterMark = computeNewHighWaterMark(n);
    if (n <= state.length)
      return n;
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    }
    return state.length;
  }
  Readable.prototype.read = function(n) {
    debug("read", n);
    n = parseInt(n, 10);
    var state = this._readableState;
    var nOrig = n;
    if (n !== 0)
      state.emittedReadable = false;
    if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
      debug("read: emitReadable", state.length, state.ended);
      if (state.length === 0 && state.ended)
        endReadable(this);
      else
        emitReadable(this);
      return null;
    }
    n = howMuchToRead(n, state);
    if (n === 0 && state.ended) {
      if (state.length === 0)
        endReadable(this);
      return null;
    }
    var doRead = state.needReadable;
    debug("need readable", doRead);
    if (state.length === 0 || state.length - n < state.highWaterMark) {
      doRead = true;
      debug("length less than watermark", doRead);
    }
    if (state.ended || state.reading) {
      doRead = false;
      debug("reading or ended", doRead);
    } else if (doRead) {
      debug("do read");
      state.reading = true;
      state.sync = true;
      if (state.length === 0)
        state.needReadable = true;
      this._read(state.highWaterMark);
      state.sync = false;
      if (!state.reading)
        n = howMuchToRead(nOrig, state);
    }
    var ret;
    if (n > 0)
      ret = fromList(n, state);
    else
      ret = null;
    if (ret === null) {
      state.needReadable = true;
      n = 0;
    } else {
      state.length -= n;
    }
    if (state.length === 0) {
      if (!state.ended)
        state.needReadable = true;
      if (nOrig !== n && state.ended)
        endReadable(this);
    }
    if (ret !== null)
      this.emit("data", ret);
    return ret;
  };
  function onEofChunk(stream, state) {
    if (state.ended)
      return;
    if (state.decoder) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) {
        state.buffer.push(chunk);
        state.length += state.objectMode ? 1 : chunk.length;
      }
    }
    state.ended = true;
    emitReadable(stream);
  }
  function emitReadable(stream) {
    var state = stream._readableState;
    state.needReadable = false;
    if (!state.emittedReadable) {
      debug("emitReadable", state.flowing);
      state.emittedReadable = true;
      if (state.sync)
        pna.nextTick(emitReadable_, stream);
      else
        emitReadable_(stream);
    }
  }
  function emitReadable_(stream) {
    debug("emit readable");
    stream.emit("readable");
    flow(stream);
  }
  function maybeReadMore(stream, state) {
    if (!state.readingMore) {
      state.readingMore = true;
      pna.nextTick(maybeReadMore_, stream, state);
    }
  }
  function maybeReadMore_(stream, state) {
    var len = state.length;
    while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
      debug("maybeReadMore read 0");
      stream.read(0);
      if (len === state.length)
        break;
      else
        len = state.length;
    }
    state.readingMore = false;
  }
  Readable.prototype._read = function(n) {
    this.emit("error", new Error("_read() is not implemented"));
  };
  Readable.prototype.pipe = function(dest, pipeOpts) {
    var src = this;
    var state = this._readableState;
    switch (state.pipesCount) {
      case 0:
        state.pipes = dest;
        break;
      case 1:
        state.pipes = [state.pipes, dest];
        break;
      default:
        state.pipes.push(dest);
        break;
    }
    state.pipesCount += 1;
    debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
    var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
    var endFn = doEnd ? onend : unpipe;
    if (state.endEmitted)
      pna.nextTick(endFn);
    else
      src.once("end", endFn);
    dest.on("unpipe", onunpipe);
    function onunpipe(readable, unpipeInfo) {
      debug("onunpipe");
      if (readable === src) {
        if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
          unpipeInfo.hasUnpiped = true;
          cleanup();
        }
      }
    }
    function onend() {
      debug("onend");
      dest.end();
    }
    var ondrain = pipeOnDrain(src);
    dest.on("drain", ondrain);
    var cleanedUp = false;
    function cleanup() {
      debug("cleanup");
      dest.removeListener("close", onclose);
      dest.removeListener("finish", onfinish);
      dest.removeListener("drain", ondrain);
      dest.removeListener("error", onerror);
      dest.removeListener("unpipe", onunpipe);
      src.removeListener("end", onend);
      src.removeListener("end", unpipe);
      src.removeListener("data", ondata);
      cleanedUp = true;
      if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain))
        ondrain();
    }
    var increasedAwaitDrain = false;
    src.on("data", ondata);
    function ondata(chunk) {
      debug("ondata");
      increasedAwaitDrain = false;
      var ret = dest.write(chunk);
      if (ret === false && !increasedAwaitDrain) {
        if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
          debug("false write response, pause", src._readableState.awaitDrain);
          src._readableState.awaitDrain++;
          increasedAwaitDrain = true;
        }
        src.pause();
      }
    }
    function onerror(er) {
      debug("onerror", er);
      unpipe();
      dest.removeListener("error", onerror);
      if (EElistenerCount(dest, "error") === 0)
        dest.emit("error", er);
    }
    prependListener(dest, "error", onerror);
    function onclose() {
      dest.removeListener("finish", onfinish);
      unpipe();
    }
    dest.once("close", onclose);
    function onfinish() {
      debug("onfinish");
      dest.removeListener("close", onclose);
      unpipe();
    }
    dest.once("finish", onfinish);
    function unpipe() {
      debug("unpipe");
      src.unpipe(dest);
    }
    dest.emit("pipe", src);
    if (!state.flowing) {
      debug("pipe resume");
      src.resume();
    }
    return dest;
  };
  function pipeOnDrain(src) {
    return function() {
      var state = src._readableState;
      debug("pipeOnDrain", state.awaitDrain);
      if (state.awaitDrain)
        state.awaitDrain--;
      if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
        state.flowing = true;
        flow(src);
      }
    };
  }
  Readable.prototype.unpipe = function(dest) {
    var state = this._readableState;
    var unpipeInfo = {hasUnpiped: false};
    if (state.pipesCount === 0)
      return this;
    if (state.pipesCount === 1) {
      if (dest && dest !== state.pipes)
        return this;
      if (!dest)
        dest = state.pipes;
      state.pipes = null;
      state.pipesCount = 0;
      state.flowing = false;
      if (dest)
        dest.emit("unpipe", this, unpipeInfo);
      return this;
    }
    if (!dest) {
      var dests = state.pipes;
      var len = state.pipesCount;
      state.pipes = null;
      state.pipesCount = 0;
      state.flowing = false;
      for (var i = 0; i < len; i++) {
        dests[i].emit("unpipe", this, unpipeInfo);
      }
      return this;
    }
    var index = indexOf(state.pipes, dest);
    if (index === -1)
      return this;
    state.pipes.splice(index, 1);
    state.pipesCount -= 1;
    if (state.pipesCount === 1)
      state.pipes = state.pipes[0];
    dest.emit("unpipe", this, unpipeInfo);
    return this;
  };
  Readable.prototype.on = function(ev, fn) {
    var res = Stream.prototype.on.call(this, ev, fn);
    if (ev === "data") {
      if (this._readableState.flowing !== false)
        this.resume();
    } else if (ev === "readable") {
      var state = this._readableState;
      if (!state.endEmitted && !state.readableListening) {
        state.readableListening = state.needReadable = true;
        state.emittedReadable = false;
        if (!state.reading) {
          pna.nextTick(nReadingNextTick, this);
        } else if (state.length) {
          emitReadable(this);
        }
      }
    }
    return res;
  };
  Readable.prototype.addListener = Readable.prototype.on;
  function nReadingNextTick(self2) {
    debug("readable nexttick read 0");
    self2.read(0);
  }
  Readable.prototype.resume = function() {
    var state = this._readableState;
    if (!state.flowing) {
      debug("resume");
      state.flowing = true;
      resume(this, state);
    }
    return this;
  };
  function resume(stream, state) {
    if (!state.resumeScheduled) {
      state.resumeScheduled = true;
      pna.nextTick(resume_, stream, state);
    }
  }
  function resume_(stream, state) {
    if (!state.reading) {
      debug("resume read 0");
      stream.read(0);
    }
    state.resumeScheduled = false;
    state.awaitDrain = 0;
    stream.emit("resume");
    flow(stream);
    if (state.flowing && !state.reading)
      stream.read(0);
  }
  Readable.prototype.pause = function() {
    debug("call pause flowing=%j", this._readableState.flowing);
    if (this._readableState.flowing !== false) {
      debug("pause");
      this._readableState.flowing = false;
      this.emit("pause");
    }
    return this;
  };
  function flow(stream) {
    var state = stream._readableState;
    debug("flow", state.flowing);
    while (state.flowing && stream.read() !== null) {
    }
  }
  Readable.prototype.wrap = function(stream) {
    var _this = this;
    var state = this._readableState;
    var paused = false;
    stream.on("end", function() {
      debug("wrapped end");
      if (state.decoder && !state.ended) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length)
          _this.push(chunk);
      }
      _this.push(null);
    });
    stream.on("data", function(chunk) {
      debug("wrapped data");
      if (state.decoder)
        chunk = state.decoder.write(chunk);
      if (state.objectMode && (chunk === null || chunk === void 0))
        return;
      else if (!state.objectMode && (!chunk || !chunk.length))
        return;
      var ret = _this.push(chunk);
      if (!ret) {
        paused = true;
        stream.pause();
      }
    });
    for (var i in stream) {
      if (this[i] === void 0 && typeof stream[i] === "function") {
        this[i] = function(method) {
          return function() {
            return stream[method].apply(stream, arguments);
          };
        }(i);
      }
    }
    for (var n = 0; n < kProxyEvents.length; n++) {
      stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
    }
    this._read = function(n2) {
      debug("wrapped _read", n2);
      if (paused) {
        paused = false;
        stream.resume();
      }
    };
    return this;
  };
  Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
    enumerable: false,
    get: function() {
      return this._readableState.highWaterMark;
    }
  });
  Readable._fromList = fromList;
  function fromList(n, state) {
    if (state.length === 0)
      return null;
    var ret;
    if (state.objectMode)
      ret = state.buffer.shift();
    else if (!n || n >= state.length) {
      if (state.decoder)
        ret = state.buffer.join("");
      else if (state.buffer.length === 1)
        ret = state.buffer.head.data;
      else
        ret = state.buffer.concat(state.length);
      state.buffer.clear();
    } else {
      ret = fromListPartial(n, state.buffer, state.decoder);
    }
    return ret;
  }
  function fromListPartial(n, list, hasStrings) {
    var ret;
    if (n < list.head.data.length) {
      ret = list.head.data.slice(0, n);
      list.head.data = list.head.data.slice(n);
    } else if (n === list.head.data.length) {
      ret = list.shift();
    } else {
      ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
    }
    return ret;
  }
  function copyFromBufferString(n, list) {
    var p = list.head;
    var c = 1;
    var ret = p.data;
    n -= ret.length;
    while (p = p.next) {
      var str = p.data;
      var nb = n > str.length ? str.length : n;
      if (nb === str.length)
        ret += str;
      else
        ret += str.slice(0, n);
      n -= nb;
      if (n === 0) {
        if (nb === str.length) {
          ++c;
          if (p.next)
            list.head = p.next;
          else
            list.head = list.tail = null;
        } else {
          list.head = p;
          p.data = str.slice(nb);
        }
        break;
      }
      ++c;
    }
    list.length -= c;
    return ret;
  }
  function copyFromBuffer(n, list) {
    var ret = Buffer2.allocUnsafe(n);
    var p = list.head;
    var c = 1;
    p.data.copy(ret);
    n -= p.data.length;
    while (p = p.next) {
      var buf = p.data;
      var nb = n > buf.length ? buf.length : n;
      buf.copy(ret, ret.length - n, 0, nb);
      n -= nb;
      if (n === 0) {
        if (nb === buf.length) {
          ++c;
          if (p.next)
            list.head = p.next;
          else
            list.head = list.tail = null;
        } else {
          list.head = p;
          p.data = buf.slice(nb);
        }
        break;
      }
      ++c;
    }
    list.length -= c;
    return ret;
  }
  function endReadable(stream) {
    var state = stream._readableState;
    if (state.length > 0)
      throw new Error('"endReadable()" called on non-empty stream');
    if (!state.endEmitted) {
      state.ended = true;
      pna.nextTick(endReadableNT, state, stream);
    }
  }
  function endReadableNT(state, stream) {
    if (!state.endEmitted && state.length === 0) {
      state.endEmitted = true;
      stream.readable = false;
      stream.emit("end");
    }
  }
  function indexOf(xs, x) {
    for (var i = 0, l = xs.length; i < l; i++) {
      if (xs[i] === x)
        return i;
    }
    return -1;
  }
});

// node_modules/readable-stream/lib/_stream_transform.js
var require_stream_transform = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = Transform;
  var Duplex = require_stream_duplex();
  var util = Object.create(require_util2());
  util.inherits = require_inherits();
  util.inherits(Transform, Duplex);
  function afterTransform(er, data) {
    var ts = this._transformState;
    ts.transforming = false;
    var cb = ts.writecb;
    if (!cb) {
      return this.emit("error", new Error("write callback called multiple times"));
    }
    ts.writechunk = null;
    ts.writecb = null;
    if (data != null)
      this.push(data);
    cb(er);
    var rs = this._readableState;
    rs.reading = false;
    if (rs.needReadable || rs.length < rs.highWaterMark) {
      this._read(rs.highWaterMark);
    }
  }
  function Transform(options) {
    if (!(this instanceof Transform))
      return new Transform(options);
    Duplex.call(this, options);
    this._transformState = {
      afterTransform: afterTransform.bind(this),
      needTransform: false,
      transforming: false,
      writecb: null,
      writechunk: null,
      writeencoding: null
    };
    this._readableState.needReadable = true;
    this._readableState.sync = false;
    if (options) {
      if (typeof options.transform === "function")
        this._transform = options.transform;
      if (typeof options.flush === "function")
        this._flush = options.flush;
    }
    this.on("prefinish", prefinish);
  }
  function prefinish() {
    var _this = this;
    if (typeof this._flush === "function") {
      this._flush(function(er, data) {
        done(_this, er, data);
      });
    } else {
      done(this, null, null);
    }
  }
  Transform.prototype.push = function(chunk, encoding) {
    this._transformState.needTransform = false;
    return Duplex.prototype.push.call(this, chunk, encoding);
  };
  Transform.prototype._transform = function(chunk, encoding, cb) {
    throw new Error("_transform() is not implemented");
  };
  Transform.prototype._write = function(chunk, encoding, cb) {
    var ts = this._transformState;
    ts.writecb = cb;
    ts.writechunk = chunk;
    ts.writeencoding = encoding;
    if (!ts.transforming) {
      var rs = this._readableState;
      if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
        this._read(rs.highWaterMark);
    }
  };
  Transform.prototype._read = function(n) {
    var ts = this._transformState;
    if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
      ts.transforming = true;
      this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
    } else {
      ts.needTransform = true;
    }
  };
  Transform.prototype._destroy = function(err, cb) {
    var _this2 = this;
    Duplex.prototype._destroy.call(this, err, function(err2) {
      cb(err2);
      _this2.emit("close");
    });
  };
  function done(stream, er, data) {
    if (er)
      return stream.emit("error", er);
    if (data != null)
      stream.push(data);
    if (stream._writableState.length)
      throw new Error("Calling transform done when ws.length != 0");
    if (stream._transformState.transforming)
      throw new Error("Calling transform done when still transforming");
    return stream.push(null);
  }
});

// node_modules/readable-stream/lib/_stream_passthrough.js
var require_stream_passthrough = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = PassThrough;
  var Transform = require_stream_transform();
  var util = Object.create(require_util2());
  util.inherits = require_inherits();
  util.inherits(PassThrough, Transform);
  function PassThrough(options) {
    if (!(this instanceof PassThrough))
      return new PassThrough(options);
    Transform.call(this, options);
  }
  PassThrough.prototype._transform = function(chunk, encoding, cb) {
    cb(null, chunk);
  };
});

// node_modules/readable-stream/readable.js
var require_readable = __commonJS((exports2, module2) => {
  var Stream = require("stream");
  if (process.env.READABLE_STREAM === "disable" && Stream) {
    module2.exports = Stream;
    exports2 = module2.exports = Stream.Readable;
    exports2.Readable = Stream.Readable;
    exports2.Writable = Stream.Writable;
    exports2.Duplex = Stream.Duplex;
    exports2.Transform = Stream.Transform;
    exports2.PassThrough = Stream.PassThrough;
    exports2.Stream = Stream;
  } else {
    exports2 = module2.exports = require_stream_readable();
    exports2.Stream = Stream || exports2;
    exports2.Readable = exports2;
    exports2.Writable = require_stream_writable();
    exports2.Duplex = require_stream_duplex();
    exports2.Transform = require_stream_transform();
    exports2.PassThrough = require_stream_passthrough();
  }
});

// node_modules/mysql/lib/protocol/sequences/Query.js
var require_Query = __commonJS((exports2, module2) => {
  var ClientConstants = require_client();
  var fs2 = require("fs");
  var Packets = require_packets();
  var ResultSet = require_ResultSet();
  var Sequence = require_Sequence();
  var ServerStatus = require_server_status();
  var Readable = require_readable();
  var Util = require("util");
  module2.exports = Query;
  Util.inherits(Query, Sequence);
  function Query(options, callback) {
    Sequence.call(this, options, callback);
    this.sql = options.sql;
    this.values = options.values;
    this.typeCast = options.typeCast === void 0 ? true : options.typeCast;
    this.nestTables = options.nestTables || false;
    this._resultSet = null;
    this._results = [];
    this._fields = [];
    this._index = 0;
    this._loadError = null;
  }
  Query.prototype.start = function() {
    this.emit("packet", new Packets.ComQueryPacket(this.sql));
  };
  Query.prototype.determinePacket = function determinePacket(byte, parser) {
    var resultSet = this._resultSet;
    if (!resultSet) {
      switch (byte) {
        case 0:
          return Packets.OkPacket;
        case 251:
          return Packets.LocalInfileRequestPacket;
        case 255:
          return Packets.ErrorPacket;
        default:
          return Packets.ResultSetHeaderPacket;
      }
    }
    if (resultSet.eofPackets.length === 0) {
      return resultSet.fieldPackets.length < resultSet.resultSetHeaderPacket.fieldCount ? Packets.FieldPacket : Packets.EofPacket;
    }
    if (byte === 255) {
      return Packets.ErrorPacket;
    }
    if (byte === 254 && parser.packetLength() < 9) {
      return Packets.EofPacket;
    }
    return Packets.RowDataPacket;
  };
  Query.prototype["OkPacket"] = function(packet) {
    try {
      if (!this._callback) {
        this.emit("result", packet, this._index);
      } else {
        this._results.push(packet);
        this._fields.push(void 0);
      }
    } finally {
      this._index++;
      this._resultSet = null;
      this._handleFinalResultPacket(packet);
    }
  };
  Query.prototype["ErrorPacket"] = function(packet) {
    var err = this._packetToError(packet);
    var results = this._results.length > 0 ? this._results : void 0;
    var fields = this._fields.length > 0 ? this._fields : void 0;
    err.index = this._index;
    err.sql = this.sql;
    this.end(err, results, fields);
  };
  Query.prototype["LocalInfileRequestPacket"] = function(packet) {
    if (this._connection.config.clientFlags & ClientConstants.CLIENT_LOCAL_FILES) {
      this._sendLocalDataFile(packet.filename);
    } else {
      this._loadError = new Error("Load local files command is disabled");
      this._loadError.code = "LOCAL_FILES_DISABLED";
      this._loadError.fatal = false;
      this.emit("packet", new Packets.EmptyPacket());
    }
  };
  Query.prototype["ResultSetHeaderPacket"] = function(packet) {
    this._resultSet = new ResultSet(packet);
  };
  Query.prototype["FieldPacket"] = function(packet) {
    this._resultSet.fieldPackets.push(packet);
  };
  Query.prototype["EofPacket"] = function(packet) {
    this._resultSet.eofPackets.push(packet);
    if (this._resultSet.eofPackets.length === 1 && !this._callback) {
      this.emit("fields", this._resultSet.fieldPackets, this._index);
    }
    if (this._resultSet.eofPackets.length !== 2) {
      return;
    }
    if (this._callback) {
      this._results.push(this._resultSet.rows);
      this._fields.push(this._resultSet.fieldPackets);
    }
    this._index++;
    this._resultSet = null;
    this._handleFinalResultPacket(packet);
  };
  Query.prototype._handleFinalResultPacket = function(packet) {
    if (packet.serverStatus & ServerStatus.SERVER_MORE_RESULTS_EXISTS) {
      return;
    }
    var results = this._results.length > 1 ? this._results : this._results[0];
    var fields = this._fields.length > 1 ? this._fields : this._fields[0];
    this.end(this._loadError, results, fields);
  };
  Query.prototype["RowDataPacket"] = function(packet, parser, connection) {
    packet.parse(parser, this._resultSet.fieldPackets, this.typeCast, this.nestTables, connection);
    if (this._callback) {
      this._resultSet.rows.push(packet);
    } else {
      this.emit("result", packet, this._index);
    }
  };
  Query.prototype._sendLocalDataFile = function(path2) {
    var self2 = this;
    var localStream = fs2.createReadStream(path2, {
      flag: "r",
      encoding: null,
      autoClose: true
    });
    this.on("pause", function() {
      localStream.pause();
    });
    this.on("resume", function() {
      localStream.resume();
    });
    localStream.on("data", function(data) {
      self2.emit("packet", new Packets.LocalDataFilePacket(data));
    });
    localStream.on("error", function(err) {
      self2._loadError = err;
      localStream.emit("end");
    });
    localStream.on("end", function() {
      self2.emit("packet", new Packets.EmptyPacket());
    });
  };
  Query.prototype.stream = function(options) {
    var self2 = this;
    options = options || {};
    options.objectMode = true;
    var stream = new Readable(options);
    stream._read = function() {
      self2._connection && self2._connection.resume();
    };
    stream.once("end", function() {
      process.nextTick(function() {
        stream.emit("close");
      });
    });
    this.on("result", function(row, i) {
      if (!stream.push(row))
        self2._connection.pause();
      stream.emit("result", row, i);
    });
    this.on("error", function(err) {
      stream.emit("error", err);
    });
    this.on("end", function() {
      stream.push(null);
    });
    this.on("fields", function(fields, i) {
      stream.emit("fields", fields, i);
    });
    return stream;
  };
});

// node_modules/mysql/lib/protocol/sequences/Quit.js
var require_Quit = __commonJS((exports2, module2) => {
  var Sequence = require_Sequence();
  var Util = require("util");
  var Packets = require_packets();
  module2.exports = Quit;
  Util.inherits(Quit, Sequence);
  function Quit(options, callback) {
    if (!callback && typeof options === "function") {
      callback = options;
      options = {};
    }
    Sequence.call(this, options, callback);
    this._started = false;
  }
  Quit.prototype.end = function end(err) {
    if (this._ended) {
      return;
    }
    if (!this._started) {
      Sequence.prototype.end.call(this, err);
      return;
    }
    if (err && err.code === "ECONNRESET" && err.syscall === "read") {
      Sequence.prototype.end.call(this);
      return;
    }
    Sequence.prototype.end.call(this, err);
  };
  Quit.prototype.start = function() {
    this._started = true;
    this.emit("packet", new Packets.ComQuitPacket());
  };
});

// node_modules/mysql/lib/protocol/sequences/Statistics.js
var require_Statistics = __commonJS((exports2, module2) => {
  var Sequence = require_Sequence();
  var Util = require("util");
  var Packets = require_packets();
  module2.exports = Statistics;
  Util.inherits(Statistics, Sequence);
  function Statistics(options, callback) {
    if (!callback && typeof options === "function") {
      callback = options;
      options = {};
    }
    Sequence.call(this, options, callback);
  }
  Statistics.prototype.start = function() {
    this.emit("packet", new Packets.ComStatisticsPacket());
  };
  Statistics.prototype["StatisticsPacket"] = function(packet) {
    this.end(null, packet);
  };
  Statistics.prototype.determinePacket = function determinePacket(firstByte) {
    if (firstByte === 85) {
      return Packets.StatisticsPacket;
    }
    return void 0;
  };
});

// node_modules/mysql/lib/protocol/sequences/index.js
var require_sequences = __commonJS((exports2) => {
  exports2.ChangeUser = require_ChangeUser();
  exports2.Handshake = require_Handshake();
  exports2.Ping = require_Ping();
  exports2.Query = require_Query();
  exports2.Quit = require_Quit();
  exports2.Sequence = require_Sequence();
  exports2.Statistics = require_Statistics();
});

// node_modules/mysql/lib/protocol/PacketWriter.js
var require_PacketWriter = __commonJS((exports2, module2) => {
  var BIT_16 = Math.pow(2, 16);
  var BIT_24 = Math.pow(2, 24);
  var BUFFER_ALLOC_SIZE = Math.pow(2, 8);
  var IEEE_754_BINARY_64_PRECISION = Math.pow(2, 53);
  var MAX_PACKET_LENGTH = Math.pow(2, 24) - 1;
  var Buffer2 = require_safe_buffer().Buffer;
  module2.exports = PacketWriter;
  function PacketWriter() {
    this._buffer = null;
    this._offset = 0;
  }
  PacketWriter.prototype.toBuffer = function toBuffer(parser) {
    if (!this._buffer) {
      this._buffer = Buffer2.alloc(0);
      this._offset = 0;
    }
    var buffer = this._buffer;
    var length = this._offset;
    var packets = Math.floor(length / MAX_PACKET_LENGTH) + 1;
    this._buffer = Buffer2.allocUnsafe(length + packets * 4);
    this._offset = 0;
    for (var packet = 0; packet < packets; packet++) {
      var isLast = packet + 1 === packets;
      var packetLength = isLast ? length % MAX_PACKET_LENGTH : MAX_PACKET_LENGTH;
      var packetNumber = parser.incrementPacketNumber();
      this.writeUnsignedNumber(3, packetLength);
      this.writeUnsignedNumber(1, packetNumber);
      var start = packet * MAX_PACKET_LENGTH;
      var end = start + packetLength;
      this.writeBuffer(buffer.slice(start, end));
    }
    return this._buffer;
  };
  PacketWriter.prototype.writeUnsignedNumber = function(bytes, value) {
    this._allocate(bytes);
    for (var i = 0; i < bytes; i++) {
      this._buffer[this._offset++] = value >> i * 8 & 255;
    }
  };
  PacketWriter.prototype.writeFiller = function(bytes) {
    this._allocate(bytes);
    for (var i = 0; i < bytes; i++) {
      this._buffer[this._offset++] = 0;
    }
  };
  PacketWriter.prototype.writeNullTerminatedString = function(value, encoding) {
    value = value || "";
    value = value + "";
    var bytes = Buffer2.byteLength(value, encoding || "utf-8") + 1;
    this._allocate(bytes);
    this._buffer.write(value, this._offset, encoding);
    this._buffer[this._offset + bytes - 1] = 0;
    this._offset += bytes;
  };
  PacketWriter.prototype.writeString = function(value) {
    value = value || "";
    value = value + "";
    var bytes = Buffer2.byteLength(value, "utf-8");
    this._allocate(bytes);
    this._buffer.write(value, this._offset, "utf-8");
    this._offset += bytes;
  };
  PacketWriter.prototype.writeBuffer = function(value) {
    var bytes = value.length;
    this._allocate(bytes);
    value.copy(this._buffer, this._offset);
    this._offset += bytes;
  };
  PacketWriter.prototype.writeLengthCodedNumber = function(value) {
    if (value === null) {
      this._allocate(1);
      this._buffer[this._offset++] = 251;
      return;
    }
    if (value <= 250) {
      this._allocate(1);
      this._buffer[this._offset++] = value;
      return;
    }
    if (value > IEEE_754_BINARY_64_PRECISION) {
      throw new Error('writeLengthCodedNumber: JS precision range exceeded, your number is > 53 bit: "' + value + '"');
    }
    if (value < BIT_16) {
      this._allocate(3);
      this._buffer[this._offset++] = 252;
    } else if (value < BIT_24) {
      this._allocate(4);
      this._buffer[this._offset++] = 253;
    } else {
      this._allocate(9);
      this._buffer[this._offset++] = 254;
    }
    this._buffer[this._offset++] = value & 255;
    this._buffer[this._offset++] = value >> 8 & 255;
    if (value < BIT_16) {
      return;
    }
    this._buffer[this._offset++] = value >> 16 & 255;
    if (value < BIT_24) {
      return;
    }
    this._buffer[this._offset++] = value >> 24 & 255;
    value = value.toString(2);
    value = value.substr(0, value.length - 32);
    value = parseInt(value, 2);
    this._buffer[this._offset++] = value & 255;
    this._buffer[this._offset++] = value >> 8 & 255;
    this._buffer[this._offset++] = value >> 16 & 255;
    this._buffer[this._offset++] = 0;
  };
  PacketWriter.prototype.writeLengthCodedBuffer = function(value) {
    var bytes = value.length;
    this.writeLengthCodedNumber(bytes);
    this.writeBuffer(value);
  };
  PacketWriter.prototype.writeNullTerminatedBuffer = function(value) {
    this.writeBuffer(value);
    this.writeFiller(1);
  };
  PacketWriter.prototype.writeLengthCodedString = function(value) {
    if (value === null) {
      this.writeLengthCodedNumber(null);
      return;
    }
    value = value === void 0 ? "" : String(value);
    var bytes = Buffer2.byteLength(value, "utf-8");
    this.writeLengthCodedNumber(bytes);
    if (!bytes) {
      return;
    }
    this._allocate(bytes);
    this._buffer.write(value, this._offset, "utf-8");
    this._offset += bytes;
  };
  PacketWriter.prototype._allocate = function _allocate(bytes) {
    if (!this._buffer) {
      this._buffer = Buffer2.alloc(Math.max(BUFFER_ALLOC_SIZE, bytes));
      this._offset = 0;
      return;
    }
    var bytesRemaining = this._buffer.length - this._offset;
    if (bytesRemaining >= bytes) {
      return;
    }
    var newSize = this._buffer.length + Math.max(BUFFER_ALLOC_SIZE, bytes);
    var oldBuffer = this._buffer;
    this._buffer = Buffer2.alloc(newSize);
    oldBuffer.copy(this._buffer);
  };
});

// node_modules/mysql/lib/protocol/Protocol.js
var require_Protocol = __commonJS((exports2, module2) => {
  var Parser = require_Parser();
  var Sequences = require_sequences();
  var Packets = require_packets();
  var Stream = require("stream").Stream;
  var Util = require("util");
  var PacketWriter = require_PacketWriter();
  module2.exports = Protocol;
  Util.inherits(Protocol, Stream);
  function Protocol(options) {
    Stream.call(this);
    options = options || {};
    this.readable = true;
    this.writable = true;
    this._config = options.config || {};
    this._connection = options.connection;
    this._callback = null;
    this._fatalError = null;
    this._quitSequence = null;
    this._handshake = false;
    this._handshaked = false;
    this._ended = false;
    this._destroyed = false;
    this._queue = [];
    this._handshakeInitializationPacket = null;
    this._parser = new Parser({
      onError: this.handleParserError.bind(this),
      onPacket: this._parsePacket.bind(this),
      config: this._config
    });
  }
  Protocol.prototype.write = function(buffer) {
    this._parser.write(buffer);
    return true;
  };
  Protocol.prototype.handshake = function handshake(options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    options = options || {};
    options.config = this._config;
    var sequence = this._enqueue(new Sequences.Handshake(options, callback));
    this._handshake = true;
    return sequence;
  };
  Protocol.prototype.query = function query(options, callback) {
    return this._enqueue(new Sequences.Query(options, callback));
  };
  Protocol.prototype.changeUser = function changeUser(options, callback) {
    return this._enqueue(new Sequences.ChangeUser(options, callback));
  };
  Protocol.prototype.ping = function ping(options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    return this._enqueue(new Sequences.Ping(options, callback));
  };
  Protocol.prototype.stats = function stats(options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    return this._enqueue(new Sequences.Statistics(options, callback));
  };
  Protocol.prototype.quit = function quit(options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    var self2 = this;
    var sequence = this._enqueue(new Sequences.Quit(options, callback));
    sequence.on("end", function() {
      self2.end();
    });
    return this._quitSequence = sequence;
  };
  Protocol.prototype.end = function() {
    if (this._ended) {
      return;
    }
    this._ended = true;
    if (this._quitSequence && (this._quitSequence._ended || this._queue[0] === this._quitSequence)) {
      this._quitSequence.end();
      this.emit("end");
      return;
    }
    var err = new Error("Connection lost: The server closed the connection.");
    err.fatal = true;
    err.code = "PROTOCOL_CONNECTION_LOST";
    this._delegateError(err);
  };
  Protocol.prototype.pause = function() {
    this._parser.pause();
    var seq = this._queue[0];
    if (seq && seq.emit) {
      seq.emit("pause");
    }
  };
  Protocol.prototype.resume = function() {
    this._parser.resume();
    var seq = this._queue[0];
    if (seq && seq.emit) {
      seq.emit("resume");
    }
  };
  Protocol.prototype._enqueue = function(sequence) {
    if (!this._validateEnqueue(sequence)) {
      return sequence;
    }
    if (this._config.trace) {
      sequence._callSite = sequence._callSite || new Error();
    }
    this._queue.push(sequence);
    this.emit("enqueue", sequence);
    var self2 = this;
    sequence.on("error", function(err) {
      self2._delegateError(err, sequence);
    }).on("packet", function(packet) {
      sequence._timer.active();
      self2._emitPacket(packet);
    }).on("timeout", function() {
      var err = new Error(sequence.constructor.name + " inactivity timeout");
      err.code = "PROTOCOL_SEQUENCE_TIMEOUT";
      err.fatal = true;
      err.timeout = sequence._timeout;
      self2._delegateError(err, sequence);
    });
    if (sequence.constructor === Sequences.Handshake) {
      sequence.on("start-tls", function() {
        sequence._timer.active();
        self2._connection._startTLS(function(err) {
          if (err) {
            err.code = "HANDSHAKE_SSL_ERROR";
            err.fatal = true;
            sequence.end(err);
            return;
          }
          sequence._timer.active();
          sequence._tlsUpgradeCompleteHandler();
        });
      });
      sequence.on("end", function() {
        self2._handshaked = true;
        if (!self2._fatalError) {
          self2.emit("handshake", self2._handshakeInitializationPacket);
        }
      });
    }
    sequence.on("end", function() {
      self2._dequeue(sequence);
    });
    if (this._queue.length === 1) {
      this._parser.resetPacketNumber();
      this._startSequence(sequence);
    }
    return sequence;
  };
  Protocol.prototype._validateEnqueue = function _validateEnqueue(sequence) {
    var err;
    var prefix = "Cannot enqueue " + sequence.constructor.name;
    if (this._fatalError) {
      err = new Error(prefix + " after fatal error.");
      err.code = "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR";
    } else if (this._quitSequence) {
      err = new Error(prefix + " after invoking quit.");
      err.code = "PROTOCOL_ENQUEUE_AFTER_QUIT";
    } else if (this._destroyed) {
      err = new Error(prefix + " after being destroyed.");
      err.code = "PROTOCOL_ENQUEUE_AFTER_DESTROY";
    } else if ((this._handshake || this._handshaked) && sequence.constructor === Sequences.Handshake) {
      err = new Error(prefix + " after already enqueuing a Handshake.");
      err.code = "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE";
    } else {
      return true;
    }
    var self2 = this;
    err.fatal = false;
    sequence.on("error", function(err2) {
      self2._delegateError(err2, sequence);
    });
    process.nextTick(function() {
      sequence.end(err);
    });
    return false;
  };
  Protocol.prototype._parsePacket = function() {
    var sequence = this._queue[0];
    if (!sequence) {
      var err = new Error("Received packet with no active sequence.");
      err.code = "PROTOCOL_STRAY_PACKET";
      err.fatal = true;
      this._delegateError(err);
      return;
    }
    var Packet = this._determinePacket(sequence);
    var packet = new Packet({protocol41: this._config.protocol41});
    var packetName = Packet.name;
    if (Packet === Packets.RowDataPacket) {
      sequence.RowDataPacket(packet, this._parser, this._connection);
      if (this._config.debug) {
        this._debugPacket(true, packet);
      }
      return;
    }
    if (this._config.debug) {
      this._parsePacketDebug(packet);
    } else {
      packet.parse(this._parser);
    }
    if (Packet === Packets.HandshakeInitializationPacket) {
      this._handshakeInitializationPacket = packet;
      this.emit("initialize", packet);
    }
    sequence._timer.active();
    if (!sequence[packetName]) {
      var err = new Error("Received packet in the wrong sequence.");
      err.code = "PROTOCOL_INCORRECT_PACKET_SEQUENCE";
      err.fatal = true;
      this._delegateError(err);
      return;
    }
    sequence[packetName](packet);
  };
  Protocol.prototype._parsePacketDebug = function _parsePacketDebug(packet) {
    try {
      packet.parse(this._parser);
    } finally {
      this._debugPacket(true, packet);
    }
  };
  Protocol.prototype._emitPacket = function(packet) {
    var packetWriter = new PacketWriter();
    packet.write(packetWriter);
    this.emit("data", packetWriter.toBuffer(this._parser));
    if (this._config.debug) {
      this._debugPacket(false, packet);
    }
  };
  Protocol.prototype._determinePacket = function(sequence) {
    var firstByte = this._parser.peak();
    if (sequence.determinePacket) {
      var Packet = sequence.determinePacket(firstByte, this._parser);
      if (Packet) {
        return Packet;
      }
    }
    switch (firstByte) {
      case 0:
        return Packets.OkPacket;
      case 254:
        return Packets.EofPacket;
      case 255:
        return Packets.ErrorPacket;
    }
    throw new Error("Could not determine packet, firstByte = " + firstByte);
  };
  Protocol.prototype._dequeue = function(sequence) {
    sequence._timer.stop();
    if (this._fatalError) {
      return;
    }
    this._queue.shift();
    var sequence = this._queue[0];
    if (!sequence) {
      this.emit("drain");
      return;
    }
    this._parser.resetPacketNumber();
    this._startSequence(sequence);
  };
  Protocol.prototype._startSequence = function(sequence) {
    if (sequence._timeout > 0 && isFinite(sequence._timeout)) {
      sequence._timer.start(sequence._timeout);
    }
    if (sequence.constructor === Sequences.ChangeUser) {
      sequence.start(this._handshakeInitializationPacket);
    } else {
      sequence.start();
    }
  };
  Protocol.prototype.handleNetworkError = function(err) {
    err.fatal = true;
    var sequence = this._queue[0];
    if (sequence) {
      sequence.end(err);
    } else {
      this._delegateError(err);
    }
  };
  Protocol.prototype.handleParserError = function handleParserError(err) {
    var sequence = this._queue[0];
    if (sequence) {
      sequence.end(err);
    } else {
      this._delegateError(err);
    }
  };
  Protocol.prototype._delegateError = function(err, sequence) {
    if (this._fatalError) {
      return;
    }
    if (err.fatal) {
      this._fatalError = err;
    }
    if (this._shouldErrorBubbleUp(err, sequence)) {
      this.emit("unhandledError", err);
    } else if (err.fatal) {
      var queue = this._queue;
      process.nextTick(function() {
        queue.forEach(function(sequence2) {
          sequence2.end(err);
        });
        queue.length = 0;
      });
    }
    if (err.fatal) {
      this.emit("end", err);
    }
  };
  Protocol.prototype._shouldErrorBubbleUp = function(err, sequence) {
    if (sequence) {
      if (sequence.hasErrorHandler()) {
        return false;
      } else if (!err.fatal) {
        return true;
      }
    }
    return err.fatal && !this._hasPendingErrorHandlers();
  };
  Protocol.prototype._hasPendingErrorHandlers = function() {
    return this._queue.some(function(sequence) {
      return sequence.hasErrorHandler();
    });
  };
  Protocol.prototype.destroy = function() {
    this._destroyed = true;
    this._parser.pause();
    if (this._connection.state !== "disconnected") {
      if (!this._ended) {
        this.end();
      }
    }
  };
  Protocol.prototype._debugPacket = function(incoming, packet) {
    var connection = this._connection;
    var direction = incoming ? "<--" : "-->";
    var packetName = packet.constructor.name;
    var threadId = connection && connection.threadId !== null ? " (" + connection.threadId + ")" : "";
    if (Array.isArray(this._config.debug) && this._config.debug.indexOf(packetName) === -1) {
      return;
    }
    var packetPayload = Util.inspect(packet).replace(/^[^{]+/, "");
    console.log("%s%s %s %s\n", direction, threadId, packetName, packetPayload);
  };
});

// node_modules/sqlstring/lib/SqlString.js
var require_SqlString = __commonJS((exports2) => {
  var SqlString = exports2;
  var ID_GLOBAL_REGEXP = /`/g;
  var QUAL_GLOBAL_REGEXP = /\./g;
  var CHARS_GLOBAL_REGEXP = /[\0\b\t\n\r\x1a\"\'\\]/g;
  var CHARS_ESCAPE_MAP = {
    "\0": "\\0",
    "\b": "\\b",
    "	": "\\t",
    "\n": "\\n",
    "\r": "\\r",
    "": "\\Z",
    '"': '\\"',
    "'": "\\'",
    "\\": "\\\\"
  };
  SqlString.escapeId = function escapeId(val, forbidQualified) {
    if (Array.isArray(val)) {
      var sql = "";
      for (var i = 0; i < val.length; i++) {
        sql += (i === 0 ? "" : ", ") + SqlString.escapeId(val[i], forbidQualified);
      }
      return sql;
    } else if (forbidQualified) {
      return "`" + String(val).replace(ID_GLOBAL_REGEXP, "``") + "`";
    } else {
      return "`" + String(val).replace(ID_GLOBAL_REGEXP, "``").replace(QUAL_GLOBAL_REGEXP, "`.`") + "`";
    }
  };
  SqlString.escape = function escape2(val, stringifyObjects, timeZone) {
    if (val === void 0 || val === null) {
      return "NULL";
    }
    switch (typeof val) {
      case "boolean":
        return val ? "true" : "false";
      case "number":
        return val + "";
      case "object":
        if (val instanceof Date) {
          return SqlString.dateToString(val, timeZone || "local");
        } else if (Array.isArray(val)) {
          return SqlString.arrayToList(val, timeZone);
        } else if (Buffer.isBuffer(val)) {
          return SqlString.bufferToString(val);
        } else if (typeof val.toSqlString === "function") {
          return String(val.toSqlString());
        } else if (stringifyObjects) {
          return escapeString(val.toString());
        } else {
          return SqlString.objectToValues(val, timeZone);
        }
      default:
        return escapeString(val);
    }
  };
  SqlString.arrayToList = function arrayToList(array, timeZone) {
    var sql = "";
    for (var i = 0; i < array.length; i++) {
      var val = array[i];
      if (Array.isArray(val)) {
        sql += (i === 0 ? "" : ", ") + "(" + SqlString.arrayToList(val, timeZone) + ")";
      } else {
        sql += (i === 0 ? "" : ", ") + SqlString.escape(val, true, timeZone);
      }
    }
    return sql;
  };
  SqlString.format = function format(sql, values, stringifyObjects, timeZone) {
    if (values == null) {
      return sql;
    }
    if (!(values instanceof Array || Array.isArray(values))) {
      values = [values];
    }
    var chunkIndex = 0;
    var placeholdersRegex = /\?+/g;
    var result = "";
    var valuesIndex = 0;
    var match;
    while (valuesIndex < values.length && (match = placeholdersRegex.exec(sql))) {
      var len = match[0].length;
      if (len > 2) {
        continue;
      }
      var value = len === 2 ? SqlString.escapeId(values[valuesIndex]) : SqlString.escape(values[valuesIndex], stringifyObjects, timeZone);
      result += sql.slice(chunkIndex, match.index) + value;
      chunkIndex = placeholdersRegex.lastIndex;
      valuesIndex++;
    }
    if (chunkIndex === 0) {
      return sql;
    }
    if (chunkIndex < sql.length) {
      return result + sql.slice(chunkIndex);
    }
    return result;
  };
  SqlString.dateToString = function dateToString(date, timeZone) {
    var dt = new Date(date);
    if (isNaN(dt.getTime())) {
      return "NULL";
    }
    var year;
    var month;
    var day;
    var hour;
    var minute;
    var second;
    var millisecond;
    if (timeZone === "local") {
      year = dt.getFullYear();
      month = dt.getMonth() + 1;
      day = dt.getDate();
      hour = dt.getHours();
      minute = dt.getMinutes();
      second = dt.getSeconds();
      millisecond = dt.getMilliseconds();
    } else {
      var tz = convertTimezone(timeZone);
      if (tz !== false && tz !== 0) {
        dt.setTime(dt.getTime() + tz * 6e4);
      }
      year = dt.getUTCFullYear();
      month = dt.getUTCMonth() + 1;
      day = dt.getUTCDate();
      hour = dt.getUTCHours();
      minute = dt.getUTCMinutes();
      second = dt.getUTCSeconds();
      millisecond = dt.getUTCMilliseconds();
    }
    var str = zeroPad(year, 4) + "-" + zeroPad(month, 2) + "-" + zeroPad(day, 2) + " " + zeroPad(hour, 2) + ":" + zeroPad(minute, 2) + ":" + zeroPad(second, 2) + "." + zeroPad(millisecond, 3);
    return escapeString(str);
  };
  SqlString.bufferToString = function bufferToString(buffer) {
    return "X" + escapeString(buffer.toString("hex"));
  };
  SqlString.objectToValues = function objectToValues(object, timeZone) {
    var sql = "";
    for (var key in object) {
      var val = object[key];
      if (typeof val === "function") {
        continue;
      }
      sql += (sql.length === 0 ? "" : ", ") + SqlString.escapeId(key) + " = " + SqlString.escape(val, true, timeZone);
    }
    return sql;
  };
  SqlString.raw = function raw(sql) {
    if (typeof sql !== "string") {
      throw new TypeError("argument sql must be a string");
    }
    return {
      toSqlString: function toSqlString() {
        return sql;
      }
    };
  };
  function escapeString(val) {
    var chunkIndex = CHARS_GLOBAL_REGEXP.lastIndex = 0;
    var escapedVal = "";
    var match;
    while (match = CHARS_GLOBAL_REGEXP.exec(val)) {
      escapedVal += val.slice(chunkIndex, match.index) + CHARS_ESCAPE_MAP[match[0]];
      chunkIndex = CHARS_GLOBAL_REGEXP.lastIndex;
    }
    if (chunkIndex === 0) {
      return "'" + val + "'";
    }
    if (chunkIndex < val.length) {
      return "'" + escapedVal + val.slice(chunkIndex) + "'";
    }
    return "'" + escapedVal + "'";
  }
  function zeroPad(number, length) {
    number = number.toString();
    while (number.length < length) {
      number = "0" + number;
    }
    return number;
  }
  function convertTimezone(tz) {
    if (tz === "Z") {
      return 0;
    }
    var m = tz.match(/([\+\-\s])(\d\d):?(\d\d)?/);
    if (m) {
      return (m[1] === "-" ? -1 : 1) * (parseInt(m[2], 10) + (m[3] ? parseInt(m[3], 10) : 0) / 60) * 60;
    }
    return false;
  }
});

// node_modules/sqlstring/index.js
var require_sqlstring = __commonJS((exports2, module2) => {
  module2.exports = require_SqlString();
});

// node_modules/mysql/lib/protocol/SqlString.js
var require_SqlString2 = __commonJS((exports2, module2) => {
  module2.exports = require_sqlstring();
});

// node_modules/mysql/lib/Connection.js
var require_Connection = __commonJS((exports2, module2) => {
  var Crypto = require("crypto");
  var Events = require("events");
  var Net = require("net");
  var tls = require("tls");
  var ConnectionConfig = require_ConnectionConfig();
  var Protocol = require_Protocol();
  var SqlString = require_SqlString2();
  var Query = require_Query();
  var Util = require("util");
  module2.exports = Connection;
  Util.inherits(Connection, Events.EventEmitter);
  function Connection(options) {
    Events.EventEmitter.call(this);
    this.config = options.config;
    this._socket = options.socket;
    this._protocol = new Protocol({config: this.config, connection: this});
    this._connectCalled = false;
    this.state = "disconnected";
    this.threadId = null;
  }
  Connection.createQuery = function createQuery(sql, values, callback) {
    if (sql instanceof Query) {
      return sql;
    }
    var cb = callback;
    var options = {};
    if (typeof sql === "function") {
      cb = sql;
    } else if (typeof sql === "object") {
      options = Object.create(sql);
      if (typeof values === "function") {
        cb = values;
      } else if (values !== void 0) {
        Object.defineProperty(options, "values", {value: values});
      }
    } else {
      options.sql = sql;
      if (typeof values === "function") {
        cb = values;
      } else if (values !== void 0) {
        options.values = values;
      }
    }
    if (cb !== void 0) {
      cb = wrapCallbackInDomain(null, cb);
      if (cb === void 0) {
        throw new TypeError("argument callback must be a function when provided");
      }
    }
    return new Query(options, cb);
  };
  Connection.prototype.connect = function connect(options, callback) {
    if (!callback && typeof options === "function") {
      callback = options;
      options = {};
    }
    if (!this._connectCalled) {
      this._connectCalled = true;
      this._socket = this.config.socketPath ? Net.createConnection(this.config.socketPath) : Net.createConnection(this.config.port, this.config.host);
      if (Events.usingDomains) {
        this._socket.domain = this.domain;
      }
      var connection = this;
      this._protocol.on("data", function(data) {
        connection._socket.write(data);
      });
      this._socket.on("data", wrapToDomain(connection, function(data) {
        connection._protocol.write(data);
      }));
      this._protocol.on("end", function() {
        connection._socket.end();
      });
      this._socket.on("end", wrapToDomain(connection, function() {
        connection._protocol.end();
      }));
      this._socket.on("error", this._handleNetworkError.bind(this));
      this._socket.on("connect", this._handleProtocolConnect.bind(this));
      this._protocol.on("handshake", this._handleProtocolHandshake.bind(this));
      this._protocol.on("initialize", this._handleProtocolInitialize.bind(this));
      this._protocol.on("unhandledError", this._handleProtocolError.bind(this));
      this._protocol.on("drain", this._handleProtocolDrain.bind(this));
      this._protocol.on("end", this._handleProtocolEnd.bind(this));
      this._protocol.on("enqueue", this._handleProtocolEnqueue.bind(this));
      if (this.config.connectTimeout) {
        var handleConnectTimeout = this._handleConnectTimeout.bind(this);
        this._socket.setTimeout(this.config.connectTimeout, handleConnectTimeout);
        this._socket.once("connect", function() {
          this.setTimeout(0, handleConnectTimeout);
        });
      }
    }
    this._protocol.handshake(options, wrapCallbackInDomain(this, callback));
  };
  Connection.prototype.changeUser = function changeUser(options, callback) {
    if (!callback && typeof options === "function") {
      callback = options;
      options = {};
    }
    this._implyConnect();
    var charsetNumber = options.charset ? ConnectionConfig.getCharsetNumber(options.charset) : this.config.charsetNumber;
    return this._protocol.changeUser({
      user: options.user || this.config.user,
      password: options.password || this.config.password,
      database: options.database || this.config.database,
      timeout: options.timeout,
      charsetNumber,
      currentConfig: this.config
    }, wrapCallbackInDomain(this, callback));
  };
  Connection.prototype.beginTransaction = function beginTransaction(options, callback) {
    if (!callback && typeof options === "function") {
      callback = options;
      options = {};
    }
    options = options || {};
    options.sql = "START TRANSACTION";
    options.values = null;
    return this.query(options, callback);
  };
  Connection.prototype.commit = function commit(options, callback) {
    if (!callback && typeof options === "function") {
      callback = options;
      options = {};
    }
    options = options || {};
    options.sql = "COMMIT";
    options.values = null;
    return this.query(options, callback);
  };
  Connection.prototype.rollback = function rollback(options, callback) {
    if (!callback && typeof options === "function") {
      callback = options;
      options = {};
    }
    options = options || {};
    options.sql = "ROLLBACK";
    options.values = null;
    return this.query(options, callback);
  };
  Connection.prototype.query = function query(sql, values, cb) {
    var query2 = Connection.createQuery(sql, values, cb);
    query2._connection = this;
    if (!(typeof sql === "object" && "typeCast" in sql)) {
      query2.typeCast = this.config.typeCast;
    }
    if (query2.sql) {
      query2.sql = this.format(query2.sql, query2.values);
    }
    if (query2._callback) {
      query2._callback = wrapCallbackInDomain(this, query2._callback);
    }
    this._implyConnect();
    return this._protocol._enqueue(query2);
  };
  Connection.prototype.ping = function ping(options, callback) {
    if (!callback && typeof options === "function") {
      callback = options;
      options = {};
    }
    this._implyConnect();
    this._protocol.ping(options, wrapCallbackInDomain(this, callback));
  };
  Connection.prototype.statistics = function statistics(options, callback) {
    if (!callback && typeof options === "function") {
      callback = options;
      options = {};
    }
    this._implyConnect();
    this._protocol.stats(options, wrapCallbackInDomain(this, callback));
  };
  Connection.prototype.end = function end(options, callback) {
    var cb = callback;
    var opts = options;
    if (!callback && typeof options === "function") {
      cb = options;
      opts = null;
    }
    opts = Object.create(opts || null);
    if (opts.timeout === void 0) {
      opts.timeout = 3e4;
    }
    this._implyConnect();
    this._protocol.quit(opts, wrapCallbackInDomain(this, cb));
  };
  Connection.prototype.destroy = function() {
    this.state = "disconnected";
    this._implyConnect();
    this._socket.destroy();
    this._protocol.destroy();
  };
  Connection.prototype.pause = function() {
    this._socket.pause();
    this._protocol.pause();
  };
  Connection.prototype.resume = function() {
    this._socket.resume();
    this._protocol.resume();
  };
  Connection.prototype.escape = function(value) {
    return SqlString.escape(value, false, this.config.timezone);
  };
  Connection.prototype.escapeId = function escapeId(value) {
    return SqlString.escapeId(value, false);
  };
  Connection.prototype.format = function(sql, values) {
    if (typeof this.config.queryFormat === "function") {
      return this.config.queryFormat.call(this, sql, values, this.config.timezone);
    }
    return SqlString.format(sql, values, this.config.stringifyObjects, this.config.timezone);
  };
  if (tls.TLSSocket) {
    Connection.prototype._startTLS = function _startTLS(onSecure) {
      var connection = this;
      createSecureContext(this.config, function(err, secureContext) {
        if (err) {
          onSecure(err);
          return;
        }
        connection._socket.removeAllListeners("data");
        connection._protocol.removeAllListeners("data");
        var rejectUnauthorized = connection.config.ssl.rejectUnauthorized;
        var secureEstablished = false;
        var secureSocket = new tls.TLSSocket(connection._socket, {
          rejectUnauthorized,
          requestCert: true,
          secureContext,
          isServer: false
        });
        secureSocket.on("_tlsError", function(err2) {
          if (secureEstablished) {
            connection._handleNetworkError(err2);
          } else {
            onSecure(err2);
          }
        });
        secureSocket.pipe(connection._protocol);
        connection._protocol.on("data", function(data) {
          secureSocket.write(data);
        });
        secureSocket.on("secure", function() {
          secureEstablished = true;
          onSecure(rejectUnauthorized ? this.ssl.verifyError() : null);
        });
        secureSocket._start();
      });
    };
  } else {
    Connection.prototype._startTLS = function _startTLS(onSecure) {
      var connection = this;
      var credentials = Crypto.createCredentials({
        ca: this.config.ssl.ca,
        cert: this.config.ssl.cert,
        ciphers: this.config.ssl.ciphers,
        key: this.config.ssl.key,
        passphrase: this.config.ssl.passphrase
      });
      var rejectUnauthorized = this.config.ssl.rejectUnauthorized;
      var secureEstablished = false;
      var securePair = tls.createSecurePair(credentials, false, true, rejectUnauthorized);
      securePair.on("error", function(err) {
        if (secureEstablished) {
          connection._handleNetworkError(err);
        } else {
          onSecure(err);
        }
      });
      this._socket.removeAllListeners("data");
      this._protocol.removeAllListeners("data");
      securePair.encrypted.pipe(this._socket);
      this._socket.on("data", function(data) {
        securePair.encrypted.write(data);
      });
      securePair.cleartext.pipe(this._protocol);
      this._protocol.on("data", function(data) {
        securePair.cleartext.write(data);
      });
      securePair.on("secure", function() {
        secureEstablished = true;
        if (!rejectUnauthorized) {
          onSecure();
          return;
        }
        var verifyError = this.ssl.verifyError();
        var err = verifyError;
        if (typeof err === "string") {
          err = new Error(verifyError);
          err.code = verifyError;
        }
        onSecure(err);
      });
      securePair._cycle = securePair.cycle;
      securePair.cycle = function cycle() {
        if (this.ssl && this.ssl.error) {
          this.error();
        }
        return this._cycle.apply(this, arguments);
      };
    };
  }
  Connection.prototype._handleConnectTimeout = function() {
    if (this._socket) {
      this._socket.setTimeout(0);
      this._socket.destroy();
    }
    var err = new Error("connect ETIMEDOUT");
    err.errorno = "ETIMEDOUT";
    err.code = "ETIMEDOUT";
    err.syscall = "connect";
    this._handleNetworkError(err);
  };
  Connection.prototype._handleNetworkError = function(err) {
    this._protocol.handleNetworkError(err);
  };
  Connection.prototype._handleProtocolError = function(err) {
    this.state = "protocol_error";
    this.emit("error", err);
  };
  Connection.prototype._handleProtocolDrain = function() {
    this.emit("drain");
  };
  Connection.prototype._handleProtocolConnect = function() {
    this.state = "connected";
    this.emit("connect");
  };
  Connection.prototype._handleProtocolHandshake = function _handleProtocolHandshake() {
    this.state = "authenticated";
  };
  Connection.prototype._handleProtocolInitialize = function _handleProtocolInitialize(packet) {
    this.threadId = packet.threadId;
  };
  Connection.prototype._handleProtocolEnd = function(err) {
    this.state = "disconnected";
    this.emit("end", err);
  };
  Connection.prototype._handleProtocolEnqueue = function _handleProtocolEnqueue(sequence) {
    this.emit("enqueue", sequence);
  };
  Connection.prototype._implyConnect = function() {
    if (!this._connectCalled) {
      this.connect();
    }
  };
  function createSecureContext(config, cb) {
    var context = null;
    var error = null;
    try {
      context = tls.createSecureContext({
        ca: config.ssl.ca,
        cert: config.ssl.cert,
        ciphers: config.ssl.ciphers,
        key: config.ssl.key,
        passphrase: config.ssl.passphrase
      });
    } catch (err) {
      error = err;
    }
    cb(error, context);
  }
  function unwrapFromDomain(fn) {
    return function() {
      var domains = [];
      var ret;
      while (process.domain) {
        domains.shift(process.domain);
        process.domain.exit();
      }
      try {
        ret = fn.apply(this, arguments);
      } finally {
        for (var i = 0; i < domains.length; i++) {
          domains[i].enter();
        }
      }
      return ret;
    };
  }
  function wrapCallbackInDomain(ee, fn) {
    if (typeof fn !== "function") {
      return void 0;
    }
    if (fn.domain) {
      return fn;
    }
    var domain = process.domain;
    if (domain) {
      return domain.bind(fn);
    } else if (ee) {
      return unwrapFromDomain(wrapToDomain(ee, fn));
    } else {
      return fn;
    }
  }
  function wrapToDomain(ee, fn) {
    return function() {
      if (Events.usingDomains && ee.domain) {
        ee.domain.enter();
        fn.apply(this, arguments);
        ee.domain.exit();
      } else {
        fn.apply(this, arguments);
      }
    };
  }
});

// node_modules/mysql/lib/PoolConnection.js
var require_PoolConnection = __commonJS((exports2, module2) => {
  var inherits = require("util").inherits;
  var Connection = require_Connection();
  var Events = require("events");
  module2.exports = PoolConnection;
  inherits(PoolConnection, Connection);
  function PoolConnection(pool, options) {
    Connection.call(this, options);
    this._pool = pool;
    if (Events.usingDomains) {
      this.domain = pool.domain;
    }
    this.on("end", this._removeFromPool);
    this.on("error", function(err) {
      if (err.fatal) {
        this._removeFromPool();
      }
    });
  }
  PoolConnection.prototype.release = function release() {
    var pool = this._pool;
    if (!pool || pool._closed) {
      return void 0;
    }
    return pool.releaseConnection(this);
  };
  PoolConnection.prototype._realEnd = Connection.prototype.end;
  PoolConnection.prototype.end = function() {
    console.warn("Calling conn.end() to release a pooled connection is deprecated. In next version calling conn.end() will be restored to default conn.end() behavior. Use conn.release() instead.");
    this.release();
  };
  PoolConnection.prototype.destroy = function() {
    Connection.prototype.destroy.apply(this, arguments);
    this._removeFromPool(this);
  };
  PoolConnection.prototype._removeFromPool = function _removeFromPool() {
    if (!this._pool || this._pool._closed) {
      return;
    }
    var pool = this._pool;
    this._pool = null;
    pool._purgeConnection(this);
  };
});

// node_modules/mysql/lib/Pool.js
var require_Pool = __commonJS((exports2, module2) => {
  var mysql2 = require_mysql();
  var Connection = require_Connection();
  var EventEmitter = require("events").EventEmitter;
  var Util = require("util");
  var PoolConnection = require_PoolConnection();
  module2.exports = Pool;
  Util.inherits(Pool, EventEmitter);
  function Pool(options) {
    EventEmitter.call(this);
    this.config = options.config;
    this.config.connectionConfig.pool = this;
    this._acquiringConnections = [];
    this._allConnections = [];
    this._freeConnections = [];
    this._connectionQueue = [];
    this._closed = false;
  }
  Pool.prototype.getConnection = function(cb) {
    if (this._closed) {
      var err = new Error("Pool is closed.");
      err.code = "POOL_CLOSED";
      process.nextTick(function() {
        cb(err);
      });
      return;
    }
    var connection;
    var pool = this;
    if (this._freeConnections.length > 0) {
      connection = this._freeConnections.shift();
      this.acquireConnection(connection, cb);
      return;
    }
    if (this.config.connectionLimit === 0 || this._allConnections.length < this.config.connectionLimit) {
      connection = new PoolConnection(this, {config: this.config.newConnectionConfig()});
      this._acquiringConnections.push(connection);
      this._allConnections.push(connection);
      connection.connect({timeout: this.config.acquireTimeout}, function onConnect(err2) {
        spliceConnection(pool._acquiringConnections, connection);
        if (pool._closed) {
          err2 = new Error("Pool is closed.");
          err2.code = "POOL_CLOSED";
        }
        if (err2) {
          pool._purgeConnection(connection);
          cb(err2);
          return;
        }
        pool.emit("connection", connection);
        pool.emit("acquire", connection);
        cb(null, connection);
      });
      return;
    }
    if (!this.config.waitForConnections) {
      process.nextTick(function() {
        var err2 = new Error("No connections available.");
        err2.code = "POOL_CONNLIMIT";
        cb(err2);
      });
      return;
    }
    this._enqueueCallback(cb);
  };
  Pool.prototype.acquireConnection = function acquireConnection(connection, cb) {
    if (connection._pool !== this) {
      throw new Error("Connection acquired from wrong pool.");
    }
    var changeUser = this._needsChangeUser(connection);
    var pool = this;
    this._acquiringConnections.push(connection);
    function onOperationComplete(err) {
      spliceConnection(pool._acquiringConnections, connection);
      if (pool._closed) {
        err = new Error("Pool is closed.");
        err.code = "POOL_CLOSED";
      }
      if (err) {
        pool._connectionQueue.unshift(cb);
        pool._purgeConnection(connection);
        return;
      }
      if (changeUser) {
        pool.emit("connection", connection);
      }
      pool.emit("acquire", connection);
      cb(null, connection);
    }
    if (changeUser) {
      connection.config = this.config.newConnectionConfig();
      connection.changeUser({timeout: this.config.acquireTimeout}, onOperationComplete);
    } else {
      connection.ping({timeout: this.config.acquireTimeout}, onOperationComplete);
    }
  };
  Pool.prototype.releaseConnection = function releaseConnection(connection) {
    if (this._acquiringConnections.indexOf(connection) !== -1) {
      return;
    }
    if (connection._pool) {
      if (connection._pool !== this) {
        throw new Error("Connection released to wrong pool");
      }
      if (this._freeConnections.indexOf(connection) !== -1) {
        throw new Error("Connection already released");
      } else {
        this._freeConnections.push(connection);
        this.emit("release", connection);
      }
    }
    if (this._closed) {
      this._connectionQueue.splice(0).forEach(function(cb) {
        var err = new Error("Pool is closed.");
        err.code = "POOL_CLOSED";
        process.nextTick(function() {
          cb(err);
        });
      });
    } else if (this._connectionQueue.length) {
      this.getConnection(this._connectionQueue.shift());
    }
  };
  Pool.prototype.end = function(cb) {
    this._closed = true;
    if (typeof cb !== "function") {
      cb = function(err) {
        if (err)
          throw err;
      };
    }
    var calledBack = false;
    var waitingClose = 0;
    function onEnd(err) {
      if (!calledBack && (err || --waitingClose <= 0)) {
        calledBack = true;
        cb(err);
      }
    }
    while (this._allConnections.length !== 0) {
      waitingClose++;
      this._purgeConnection(this._allConnections[0], onEnd);
    }
    if (waitingClose === 0) {
      process.nextTick(onEnd);
    }
  };
  Pool.prototype.query = function(sql, values, cb) {
    var query = Connection.createQuery(sql, values, cb);
    if (!(typeof sql === "object" && "typeCast" in sql)) {
      query.typeCast = this.config.connectionConfig.typeCast;
    }
    if (this.config.connectionConfig.trace) {
      query._callSite = new Error();
    }
    this.getConnection(function(err, conn) {
      if (err) {
        query.on("error", function() {
        });
        query.end(err);
        return;
      }
      query.once("end", function() {
        conn.release();
      });
      conn.query(query);
    });
    return query;
  };
  Pool.prototype._enqueueCallback = function _enqueueCallback(callback) {
    if (this.config.queueLimit && this._connectionQueue.length >= this.config.queueLimit) {
      process.nextTick(function() {
        var err = new Error("Queue limit reached.");
        err.code = "POOL_ENQUEUELIMIT";
        callback(err);
      });
      return;
    }
    var cb = process.domain ? process.domain.bind(callback) : callback;
    this._connectionQueue.push(cb);
    this.emit("enqueue");
  };
  Pool.prototype._needsChangeUser = function _needsChangeUser(connection) {
    var connConfig = connection.config;
    var poolConfig = this.config.connectionConfig;
    return connConfig.user !== poolConfig.user || connConfig.database !== poolConfig.database || connConfig.password !== poolConfig.password || connConfig.charsetNumber !== poolConfig.charsetNumber;
  };
  Pool.prototype._purgeConnection = function _purgeConnection(connection, callback) {
    var cb = callback || function() {
    };
    if (connection.state === "disconnected") {
      connection.destroy();
    }
    this._removeConnection(connection);
    if (connection.state !== "disconnected" && !connection._protocol._quitSequence) {
      connection._realEnd(cb);
      return;
    }
    process.nextTick(cb);
  };
  Pool.prototype._removeConnection = function(connection) {
    connection._pool = null;
    spliceConnection(this._allConnections, connection);
    spliceConnection(this._freeConnections, connection);
    this.releaseConnection(connection);
  };
  Pool.prototype.escape = function(value) {
    return mysql2.escape(value, this.config.connectionConfig.stringifyObjects, this.config.connectionConfig.timezone);
  };
  Pool.prototype.escapeId = function escapeId(value) {
    return mysql2.escapeId(value, false);
  };
  function spliceConnection(array, connection) {
    var index;
    if ((index = array.indexOf(connection)) !== -1) {
      array.splice(index, 1);
    }
  }
});

// node_modules/mysql/lib/PoolConfig.js
var require_PoolConfig = __commonJS((exports2, module2) => {
  var ConnectionConfig = require_ConnectionConfig();
  module2.exports = PoolConfig;
  function PoolConfig(options) {
    if (typeof options === "string") {
      options = ConnectionConfig.parseUrl(options);
    }
    this.acquireTimeout = options.acquireTimeout === void 0 ? 10 * 1e3 : Number(options.acquireTimeout);
    this.connectionConfig = new ConnectionConfig(options);
    this.waitForConnections = options.waitForConnections === void 0 ? true : Boolean(options.waitForConnections);
    this.connectionLimit = options.connectionLimit === void 0 ? 10 : Number(options.connectionLimit);
    this.queueLimit = options.queueLimit === void 0 ? 0 : Number(options.queueLimit);
  }
  PoolConfig.prototype.newConnectionConfig = function newConnectionConfig() {
    var connectionConfig = new ConnectionConfig(this.connectionConfig);
    connectionConfig.clientFlags = this.connectionConfig.clientFlags;
    connectionConfig.maxPacketSize = this.connectionConfig.maxPacketSize;
    return connectionConfig;
  };
});

// node_modules/mysql/lib/PoolSelector.js
var require_PoolSelector = __commonJS((exports2, module2) => {
  var PoolSelector = module2.exports = {};
  PoolSelector.RR = function PoolSelectorRoundRobin() {
    var index = 0;
    return function(clusterIds) {
      if (index >= clusterIds.length) {
        index = 0;
      }
      var clusterId = clusterIds[index++];
      return clusterId;
    };
  };
  PoolSelector.RANDOM = function PoolSelectorRandom() {
    return function(clusterIds) {
      return clusterIds[Math.floor(Math.random() * clusterIds.length)];
    };
  };
  PoolSelector.ORDER = function PoolSelectorOrder() {
    return function(clusterIds) {
      return clusterIds[0];
    };
  };
});

// node_modules/mysql/lib/PoolNamespace.js
var require_PoolNamespace = __commonJS((exports2, module2) => {
  var Connection = require_Connection();
  var PoolSelector = require_PoolSelector();
  module2.exports = PoolNamespace;
  function PoolNamespace(cluster, pattern, selector) {
    this._cluster = cluster;
    this._pattern = pattern;
    this._selector = new PoolSelector[selector]();
  }
  PoolNamespace.prototype.getConnection = function(cb) {
    var clusterNode = this._getClusterNode();
    var cluster = this._cluster;
    var namespace = this;
    if (clusterNode === null) {
      var err = null;
      if (this._cluster._findNodeIds(this._pattern, true).length !== 0) {
        err = new Error("Pool does not have online node.");
        err.code = "POOL_NONEONLINE";
      } else {
        err = new Error("Pool does not exist.");
        err.code = "POOL_NOEXIST";
      }
      cb(err);
      return;
    }
    cluster._getConnection(clusterNode, function(err2, connection) {
      var retry = err2 && cluster._canRetry && cluster._findNodeIds(namespace._pattern).length !== 0;
      if (retry) {
        namespace.getConnection(cb);
        return;
      }
      if (err2) {
        cb(err2);
        return;
      }
      cb(null, connection);
    });
  };
  PoolNamespace.prototype.query = function(sql, values, cb) {
    var cluster = this._cluster;
    var clusterNode = this._getClusterNode();
    var query = Connection.createQuery(sql, values, cb);
    var namespace = this;
    if (clusterNode === null) {
      var err = null;
      if (this._cluster._findNodeIds(this._pattern, true).length !== 0) {
        err = new Error("Pool does not have online node.");
        err.code = "POOL_NONEONLINE";
      } else {
        err = new Error("Pool does not exist.");
        err.code = "POOL_NOEXIST";
      }
      process.nextTick(function() {
        query.on("error", function() {
        });
        query.end(err);
      });
      return query;
    }
    if (!(typeof sql === "object" && "typeCast" in sql)) {
      query.typeCast = clusterNode.pool.config.connectionConfig.typeCast;
    }
    if (clusterNode.pool.config.connectionConfig.trace) {
      query._callSite = new Error();
    }
    cluster._getConnection(clusterNode, function(err2, conn) {
      var retry = err2 && cluster._canRetry && cluster._findNodeIds(namespace._pattern).length !== 0;
      if (retry) {
        namespace.query(query);
        return;
      }
      if (err2) {
        query.on("error", function() {
        });
        query.end(err2);
        return;
      }
      query.once("end", function() {
        conn.release();
      });
      conn.query(query);
    });
    return query;
  };
  PoolNamespace.prototype._getClusterNode = function _getClusterNode() {
    var foundNodeIds = this._cluster._findNodeIds(this._pattern);
    var nodeId;
    switch (foundNodeIds.length) {
      case 0:
        nodeId = null;
        break;
      case 1:
        nodeId = foundNodeIds[0];
        break;
      default:
        nodeId = this._selector(foundNodeIds);
        break;
    }
    return nodeId !== null ? this._cluster._getNode(nodeId) : null;
  };
});

// node_modules/mysql/lib/PoolCluster.js
var require_PoolCluster = __commonJS((exports2, module2) => {
  var Pool = require_Pool();
  var PoolConfig = require_PoolConfig();
  var PoolNamespace = require_PoolNamespace();
  var PoolSelector = require_PoolSelector();
  var Util = require("util");
  var EventEmitter = require("events").EventEmitter;
  module2.exports = PoolCluster;
  function PoolCluster(config) {
    EventEmitter.call(this);
    config = config || {};
    this._canRetry = typeof config.canRetry === "undefined" ? true : config.canRetry;
    this._defaultSelector = config.defaultSelector || "RR";
    this._removeNodeErrorCount = config.removeNodeErrorCount || 5;
    this._restoreNodeTimeout = config.restoreNodeTimeout || 0;
    this._closed = false;
    this._findCaches = Object.create(null);
    this._lastId = 0;
    this._namespaces = Object.create(null);
    this._nodes = Object.create(null);
  }
  Util.inherits(PoolCluster, EventEmitter);
  PoolCluster.prototype.add = function add(id, config) {
    if (this._closed) {
      throw new Error("PoolCluster is closed.");
    }
    var nodeId = typeof id === "object" ? "CLUSTER::" + ++this._lastId : String(id);
    if (this._nodes[nodeId] !== void 0) {
      throw new Error('Node ID "' + nodeId + '" is already defined in PoolCluster.');
    }
    var poolConfig = typeof id !== "object" ? new PoolConfig(config) : new PoolConfig(id);
    this._nodes[nodeId] = {
      id: nodeId,
      errorCount: 0,
      pool: new Pool({config: poolConfig}),
      _offlineUntil: 0
    };
    this._clearFindCaches();
  };
  PoolCluster.prototype.end = function end(callback) {
    var cb = callback !== void 0 ? callback : _cb;
    if (typeof cb !== "function") {
      throw TypeError("callback argument must be a function");
    }
    if (this._closed) {
      process.nextTick(cb);
      return;
    }
    this._closed = true;
    var calledBack = false;
    var nodeIds = Object.keys(this._nodes);
    var waitingClose = 0;
    function onEnd(err) {
      if (!calledBack && (err || --waitingClose <= 0)) {
        calledBack = true;
        cb(err);
      }
    }
    for (var i = 0; i < nodeIds.length; i++) {
      var nodeId = nodeIds[i];
      var node = this._nodes[nodeId];
      waitingClose++;
      node.pool.end(onEnd);
    }
    if (waitingClose === 0) {
      process.nextTick(onEnd);
    }
  };
  PoolCluster.prototype.of = function(pattern, selector) {
    pattern = pattern || "*";
    selector = selector || this._defaultSelector;
    selector = selector.toUpperCase();
    if (typeof PoolSelector[selector] === "undefined") {
      selector = this._defaultSelector;
    }
    var key = pattern + selector;
    if (typeof this._namespaces[key] === "undefined") {
      this._namespaces[key] = new PoolNamespace(this, pattern, selector);
    }
    return this._namespaces[key];
  };
  PoolCluster.prototype.remove = function remove(pattern) {
    var foundNodeIds = this._findNodeIds(pattern, true);
    for (var i = 0; i < foundNodeIds.length; i++) {
      var node = this._getNode(foundNodeIds[i]);
      if (node) {
        this._removeNode(node);
      }
    }
  };
  PoolCluster.prototype.getConnection = function(pattern, selector, cb) {
    var namespace;
    if (typeof pattern === "function") {
      cb = pattern;
      namespace = this.of();
    } else {
      if (typeof selector === "function") {
        cb = selector;
        selector = this._defaultSelector;
      }
      namespace = this.of(pattern, selector);
    }
    namespace.getConnection(cb);
  };
  PoolCluster.prototype._clearFindCaches = function _clearFindCaches() {
    this._findCaches = Object.create(null);
  };
  PoolCluster.prototype._decreaseErrorCount = function _decreaseErrorCount(node) {
    var errorCount = node.errorCount;
    if (errorCount > this._removeNodeErrorCount) {
      errorCount = this._removeNodeErrorCount;
    }
    if (errorCount < 1) {
      errorCount = 1;
    }
    node.errorCount = errorCount - 1;
    if (node._offlineUntil) {
      node._offlineUntil = 0;
      this.emit("online", node.id);
    }
  };
  PoolCluster.prototype._findNodeIds = function _findNodeIds(pattern, includeOffline) {
    var currentTime = 0;
    var foundNodeIds = this._findCaches[pattern];
    if (foundNodeIds === void 0) {
      var expression = patternRegExp(pattern);
      var nodeIds = Object.keys(this._nodes);
      foundNodeIds = nodeIds.filter(function(id) {
        return id.match(expression);
      });
      this._findCaches[pattern] = foundNodeIds;
    }
    if (includeOffline) {
      return foundNodeIds;
    }
    return foundNodeIds.filter(function(nodeId) {
      var node = this._getNode(nodeId);
      if (!node._offlineUntil) {
        return true;
      }
      if (!currentTime) {
        currentTime = getMonotonicMilliseconds();
      }
      return node._offlineUntil <= currentTime;
    }, this);
  };
  PoolCluster.prototype._getNode = function _getNode(id) {
    return this._nodes[id] || null;
  };
  PoolCluster.prototype._increaseErrorCount = function _increaseErrorCount(node) {
    var errorCount = ++node.errorCount;
    if (this._removeNodeErrorCount > errorCount) {
      return;
    }
    if (this._restoreNodeTimeout > 0) {
      node._offlineUntil = getMonotonicMilliseconds() + this._restoreNodeTimeout;
      this.emit("offline", node.id);
      return;
    }
    this._removeNode(node);
    this.emit("remove", node.id);
  };
  PoolCluster.prototype._getConnection = function(node, cb) {
    var self2 = this;
    node.pool.getConnection(function(err, connection) {
      if (err) {
        self2._increaseErrorCount(node);
        cb(err);
        return;
      } else {
        self2._decreaseErrorCount(node);
      }
      connection._clusterId = node.id;
      cb(null, connection);
    });
  };
  PoolCluster.prototype._removeNode = function _removeNode(node) {
    delete this._nodes[node.id];
    this._clearFindCaches();
    node.pool.end(_noop);
  };
  function getMonotonicMilliseconds() {
    var ms;
    if (typeof process.hrtime === "function") {
      ms = process.hrtime();
      ms = ms[0] * 1e3 + ms[1] * 1e-6;
    } else {
      ms = process.uptime() * 1e3;
    }
    return Math.floor(ms);
  }
  function isRegExp(val) {
    return typeof val === "object" && Object.prototype.toString.call(val) === "[object RegExp]";
  }
  function patternRegExp(pattern) {
    if (isRegExp(pattern)) {
      return pattern;
    }
    var source = pattern.replace(/([.+?^=!:${}()|\[\]\/\\])/g, "\\$1").replace(/\*/g, ".*");
    return new RegExp("^" + source + "$");
  }
  function _cb(err) {
    if (err) {
      throw err;
    }
  }
  function _noop() {
  }
});

// node_modules/mysql/index.js
var require_mysql = __commonJS((exports2) => {
  var Classes = Object.create(null);
  exports2.createConnection = function createConnection(config) {
    var Connection = loadClass("Connection");
    var ConnectionConfig = loadClass("ConnectionConfig");
    return new Connection({config: new ConnectionConfig(config)});
  };
  exports2.createPool = function createPool2(config) {
    var Pool = loadClass("Pool");
    var PoolConfig = loadClass("PoolConfig");
    return new Pool({config: new PoolConfig(config)});
  };
  exports2.createPoolCluster = function createPoolCluster(config) {
    var PoolCluster = loadClass("PoolCluster");
    return new PoolCluster(config);
  };
  exports2.createQuery = function createQuery(sql, values, callback) {
    var Connection = loadClass("Connection");
    return Connection.createQuery(sql, values, callback);
  };
  exports2.escape = function escape2(value, stringifyObjects, timeZone) {
    var SqlString = loadClass("SqlString");
    return SqlString.escape(value, stringifyObjects, timeZone);
  };
  exports2.escapeId = function escapeId(value, forbidQualified) {
    var SqlString = loadClass("SqlString");
    return SqlString.escapeId(value, forbidQualified);
  };
  exports2.format = function format(sql, values, stringifyObjects, timeZone) {
    var SqlString = loadClass("SqlString");
    return SqlString.format(sql, values, stringifyObjects, timeZone);
  };
  exports2.raw = function raw(sql) {
    var SqlString = loadClass("SqlString");
    return SqlString.raw(sql);
  };
  Object.defineProperty(exports2, "Types", {
    get: loadClass.bind(null, "Types")
  });
  function loadClass(className) {
    var Class = Classes[className];
    if (Class !== void 0) {
      return Class;
    }
    switch (className) {
      case "Connection":
        Class = require_Connection();
        break;
      case "ConnectionConfig":
        Class = require_ConnectionConfig();
        break;
      case "Pool":
        Class = require_Pool();
        break;
      case "PoolCluster":
        Class = require_PoolCluster();
        break;
      case "PoolConfig":
        Class = require_PoolConfig();
        break;
      case "SqlString":
        Class = require_SqlString2();
        break;
      case "Types":
        Class = require_types();
        break;
      default:
        throw new Error("Cannot find class '" + className + "'");
    }
    Classes[className] = Class;
    return Class;
  }
});

// node_modules/fast-decode-uri-component/index.js
var require_fast_decode_uri_component = __commonJS((exports2, module2) => {
  "use strict";
  var UTF8_ACCEPT = 12;
  var UTF8_REJECT = 0;
  var UTF8_DATA = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    4,
    4,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    6,
    7,
    7,
    7,
    7,
    7,
    7,
    7,
    7,
    7,
    7,
    7,
    7,
    8,
    7,
    7,
    10,
    9,
    9,
    9,
    11,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    12,
    0,
    0,
    0,
    0,
    24,
    36,
    48,
    60,
    72,
    84,
    96,
    0,
    12,
    12,
    12,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    24,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    24,
    24,
    24,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    24,
    24,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    48,
    48,
    48,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    48,
    48,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    48,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    127,
    63,
    63,
    63,
    0,
    31,
    15,
    15,
    15,
    7,
    7,
    7
  ];
  function decodeURIComponent(uri) {
    var percentPosition = uri.indexOf("%");
    if (percentPosition === -1)
      return uri;
    var length = uri.length;
    var decoded = "";
    var last = 0;
    var codepoint = 0;
    var startOfOctets = percentPosition;
    var state = UTF8_ACCEPT;
    while (percentPosition > -1 && percentPosition < length) {
      var high = hexCodeToInt(uri[percentPosition + 1], 4);
      var low = hexCodeToInt(uri[percentPosition + 2], 0);
      var byte = high | low;
      var type = UTF8_DATA[byte];
      state = UTF8_DATA[256 + state + type];
      codepoint = codepoint << 6 | byte & UTF8_DATA[364 + type];
      if (state === UTF8_ACCEPT) {
        decoded += uri.slice(last, startOfOctets);
        decoded += codepoint <= 65535 ? String.fromCharCode(codepoint) : String.fromCharCode(55232 + (codepoint >> 10), 56320 + (codepoint & 1023));
        codepoint = 0;
        last = percentPosition + 3;
        percentPosition = startOfOctets = uri.indexOf("%", last);
      } else if (state === UTF8_REJECT) {
        return null;
      } else {
        percentPosition += 3;
        if (percentPosition < length && uri.charCodeAt(percentPosition) === 37)
          continue;
        return null;
      }
    }
    return decoded + uri.slice(last);
  }
  var HEX = {
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    a: 10,
    A: 10,
    b: 11,
    B: 11,
    c: 12,
    C: 12,
    d: 13,
    D: 13,
    e: 14,
    E: 14,
    f: 15,
    F: 15
  };
  function hexCodeToInt(c, shift) {
    var i = HEX[c];
    return i === void 0 ? 255 : i << shift;
  }
  module2.exports = decodeURIComponent;
});

// node_modules/ret/lib/types.js
var require_types2 = __commonJS((exports2, module2) => {
  module2.exports = {
    ROOT: 0,
    GROUP: 1,
    POSITION: 2,
    SET: 3,
    RANGE: 4,
    REPETITION: 5,
    REFERENCE: 6,
    CHAR: 7
  };
});

// node_modules/ret/lib/sets.js
var require_sets = __commonJS((exports2) => {
  var types = require_types2();
  var INTS = () => [{type: types.RANGE, from: 48, to: 57}];
  var WORDS = () => {
    return [
      {type: types.CHAR, value: 95},
      {type: types.RANGE, from: 97, to: 122},
      {type: types.RANGE, from: 65, to: 90}
    ].concat(INTS());
  };
  var WHITESPACE = () => {
    return [
      {type: types.CHAR, value: 9},
      {type: types.CHAR, value: 10},
      {type: types.CHAR, value: 11},
      {type: types.CHAR, value: 12},
      {type: types.CHAR, value: 13},
      {type: types.CHAR, value: 32},
      {type: types.CHAR, value: 160},
      {type: types.CHAR, value: 5760},
      {type: types.RANGE, from: 8192, to: 8202},
      {type: types.CHAR, value: 8232},
      {type: types.CHAR, value: 8233},
      {type: types.CHAR, value: 8239},
      {type: types.CHAR, value: 8287},
      {type: types.CHAR, value: 12288},
      {type: types.CHAR, value: 65279}
    ];
  };
  var NOTANYCHAR = () => {
    return [
      {type: types.CHAR, value: 10},
      {type: types.CHAR, value: 13},
      {type: types.CHAR, value: 8232},
      {type: types.CHAR, value: 8233}
    ];
  };
  exports2.words = () => ({type: types.SET, set: WORDS(), not: false});
  exports2.notWords = () => ({type: types.SET, set: WORDS(), not: true});
  exports2.ints = () => ({type: types.SET, set: INTS(), not: false});
  exports2.notInts = () => ({type: types.SET, set: INTS(), not: true});
  exports2.whitespace = () => ({type: types.SET, set: WHITESPACE(), not: false});
  exports2.notWhitespace = () => ({type: types.SET, set: WHITESPACE(), not: true});
  exports2.anyChar = () => ({type: types.SET, set: NOTANYCHAR(), not: true});
});

// node_modules/ret/lib/util.js
var require_util3 = __commonJS((exports2) => {
  var types = require_types2();
  var sets = require_sets();
  var CTRL = "@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^ ?";
  var SLSH = {"0": 0, t: 9, n: 10, v: 11, f: 12, r: 13};
  exports2.strToChars = function(str) {
    var chars_regex = /(\[\\b\])|(\\)?\\(?:u([A-F0-9]{4})|x([A-F0-9]{2})|(0?[0-7]{2})|c([@A-Z[\\\]^?])|([0tnvfr]))/g;
    str = str.replace(chars_regex, function(s, b, lbs, a16, b16, c8, dctrl, eslsh) {
      if (lbs) {
        return s;
      }
      var code = b ? 8 : a16 ? parseInt(a16, 16) : b16 ? parseInt(b16, 16) : c8 ? parseInt(c8, 8) : dctrl ? CTRL.indexOf(dctrl) : SLSH[eslsh];
      var c = String.fromCharCode(code);
      if (/[[\]{}^$.|?*+()]/.test(c)) {
        c = "\\" + c;
      }
      return c;
    });
    return str;
  };
  exports2.tokenizeClass = (str, regexpStr) => {
    var tokens = [];
    var regexp = /\\(?:(w)|(d)|(s)|(W)|(D)|(S))|((?:(?:\\)(.)|([^\]\\]))-(?:\\)?([^\]]))|(\])|(?:\\)?([^])/g;
    var rs, c;
    while ((rs = regexp.exec(str)) != null) {
      if (rs[1]) {
        tokens.push(sets.words());
      } else if (rs[2]) {
        tokens.push(sets.ints());
      } else if (rs[3]) {
        tokens.push(sets.whitespace());
      } else if (rs[4]) {
        tokens.push(sets.notWords());
      } else if (rs[5]) {
        tokens.push(sets.notInts());
      } else if (rs[6]) {
        tokens.push(sets.notWhitespace());
      } else if (rs[7]) {
        tokens.push({
          type: types.RANGE,
          from: (rs[8] || rs[9]).charCodeAt(0),
          to: rs[10].charCodeAt(0)
        });
      } else if (c = rs[12]) {
        tokens.push({
          type: types.CHAR,
          value: c.charCodeAt(0)
        });
      } else {
        return [tokens, regexp.lastIndex];
      }
    }
    exports2.error(regexpStr, "Unterminated character class");
  };
  exports2.error = (regexp, msg) => {
    throw new SyntaxError("Invalid regular expression: /" + regexp + "/: " + msg);
  };
});

// node_modules/ret/lib/positions.js
var require_positions = __commonJS((exports2) => {
  var types = require_types2();
  exports2.wordBoundary = () => ({type: types.POSITION, value: "b"});
  exports2.nonWordBoundary = () => ({type: types.POSITION, value: "B"});
  exports2.begin = () => ({type: types.POSITION, value: "^"});
  exports2.end = () => ({type: types.POSITION, value: "$"});
});

// node_modules/ret/lib/index.js
var require_lib = __commonJS((exports2, module2) => {
  var util = require_util3();
  var types = require_types2();
  var sets = require_sets();
  var positions = require_positions();
  module2.exports = (regexpStr) => {
    var i = 0, l, c, start = {type: types.ROOT, stack: []}, lastGroup = start, last = start.stack, groupStack = [];
    var repeatErr = (i2) => {
      util.error(regexpStr, `Nothing to repeat at column ${i2 - 1}`);
    };
    var str = util.strToChars(regexpStr);
    l = str.length;
    while (i < l) {
      c = str[i++];
      switch (c) {
        case "\\":
          c = str[i++];
          switch (c) {
            case "b":
              last.push(positions.wordBoundary());
              break;
            case "B":
              last.push(positions.nonWordBoundary());
              break;
            case "w":
              last.push(sets.words());
              break;
            case "W":
              last.push(sets.notWords());
              break;
            case "d":
              last.push(sets.ints());
              break;
            case "D":
              last.push(sets.notInts());
              break;
            case "s":
              last.push(sets.whitespace());
              break;
            case "S":
              last.push(sets.notWhitespace());
              break;
            default:
              if (/\d/.test(c)) {
                last.push({type: types.REFERENCE, value: parseInt(c, 10)});
              } else {
                last.push({type: types.CHAR, value: c.charCodeAt(0)});
              }
          }
          break;
        case "^":
          last.push(positions.begin());
          break;
        case "$":
          last.push(positions.end());
          break;
        case "[":
          var not;
          if (str[i] === "^") {
            not = true;
            i++;
          } else {
            not = false;
          }
          var classTokens = util.tokenizeClass(str.slice(i), regexpStr);
          i += classTokens[1];
          last.push({
            type: types.SET,
            set: classTokens[0],
            not
          });
          break;
        case ".":
          last.push(sets.anyChar());
          break;
        case "(":
          var group = {
            type: types.GROUP,
            stack: [],
            remember: true
          };
          c = str[i];
          if (c === "?") {
            c = str[i + 1];
            i += 2;
            if (c === "=") {
              group.followedBy = true;
            } else if (c === "!") {
              group.notFollowedBy = true;
            } else if (c !== ":") {
              util.error(regexpStr, `Invalid group, character '${c}' after '?' at column ${i - 1}`);
            }
            group.remember = false;
          }
          last.push(group);
          groupStack.push(lastGroup);
          lastGroup = group;
          last = group.stack;
          break;
        case ")":
          if (groupStack.length === 0) {
            util.error(regexpStr, `Unmatched ) at column ${i - 1}`);
          }
          lastGroup = groupStack.pop();
          last = lastGroup.options ? lastGroup.options[lastGroup.options.length - 1] : lastGroup.stack;
          break;
        case "|":
          if (!lastGroup.options) {
            lastGroup.options = [lastGroup.stack];
            delete lastGroup.stack;
          }
          var stack = [];
          lastGroup.options.push(stack);
          last = stack;
          break;
        case "{":
          var rs = /^(\d+)(,(\d+)?)?\}/.exec(str.slice(i)), min, max;
          if (rs !== null) {
            if (last.length === 0) {
              repeatErr(i);
            }
            min = parseInt(rs[1], 10);
            max = rs[2] ? rs[3] ? parseInt(rs[3], 10) : Infinity : min;
            i += rs[0].length;
            last.push({
              type: types.REPETITION,
              min,
              max,
              value: last.pop()
            });
          } else {
            last.push({
              type: types.CHAR,
              value: 123
            });
          }
          break;
        case "?":
          if (last.length === 0) {
            repeatErr(i);
          }
          last.push({
            type: types.REPETITION,
            min: 0,
            max: 1,
            value: last.pop()
          });
          break;
        case "+":
          if (last.length === 0) {
            repeatErr(i);
          }
          last.push({
            type: types.REPETITION,
            min: 1,
            max: Infinity,
            value: last.pop()
          });
          break;
        case "*":
          if (last.length === 0) {
            repeatErr(i);
          }
          last.push({
            type: types.REPETITION,
            min: 0,
            max: Infinity,
            value: last.pop()
          });
          break;
        default:
          last.push({
            type: types.CHAR,
            value: c.charCodeAt(0)
          });
      }
    }
    if (groupStack.length !== 0) {
      util.error(regexpStr, "Unterminated group");
    }
    return start;
  };
  module2.exports.types = types;
});

// node_modules/safe-regex2/index.js
var require_safe_regex2 = __commonJS((exports2, module2) => {
  "use strict";
  var parse = require_lib();
  var types = parse.types;
  module2.exports = function(re, opts) {
    if (!opts)
      opts = {};
    var replimit = opts.limit === void 0 ? 25 : opts.limit;
    if (isRegExp(re))
      re = re.source;
    else if (typeof re !== "string")
      re = String(re);
    try {
      re = parse(re);
    } catch (err) {
      return false;
    }
    var reps = 0;
    return function walk(node, starHeight) {
      var i;
      var ok;
      var len;
      if (node.type === types.REPETITION) {
        starHeight++;
        reps++;
        if (starHeight > 1)
          return false;
        if (reps > replimit)
          return false;
      }
      if (node.options) {
        for (i = 0, len = node.options.length; i < len; i++) {
          ok = walk({stack: node.options[i]}, starHeight);
          if (!ok)
            return false;
        }
      }
      var stack = node.stack || node.value && node.value.stack;
      if (!stack)
        return true;
      for (i = 0; i < stack.length; i++) {
        ok = walk(stack[i], starHeight);
        if (!ok)
          return false;
      }
      return true;
    }(re, 0);
  };
  function isRegExp(x) {
    return {}.toString.call(x) === "[object RegExp]";
  }
});

// node_modules/find-my-way/lib/pretty-print.js
var require_pretty_print = __commonJS((exports2, module2) => {
  function prettyPrintFlattenedNode(flattenedNode, prefix, tail) {
    var paramName = "";
    const printHandlers = [];
    for (const node of flattenedNode.nodes) {
      for (const handler of node.handlers) {
        printHandlers.push({method: node.method, ...handler});
      }
    }
    printHandlers.forEach((handler, index) => {
      let suffix = `(${handler.method}`;
      if (Object.keys(handler.constraints).length > 0) {
        suffix += " " + JSON.stringify(handler.constraints);
      }
      suffix += ")";
      let name = "";
      if (flattenedNode.prefix.includes(":")) {
        var params = handler.params;
        name = params[params.length - 1];
        if (index > 0) {
          name = ":" + name;
        }
      } else if (index > 0) {
        name = flattenedNode.prefix;
      }
      if (index === 0) {
        paramName += name + ` ${suffix}`;
        return;
      } else {
        paramName += "\n";
      }
      paramName += prefix + "    " + name + ` ${suffix}`;
    });
    var tree = `${prefix}${tail ? "\u2514\u2500\u2500 " : "\u251C\u2500\u2500 "}${flattenedNode.prefix}${paramName}
`;
    prefix = `${prefix}${tail ? "    " : "\u2502   "}`;
    const labels = Object.keys(flattenedNode.children);
    for (var i = 0; i < labels.length; i++) {
      const child = flattenedNode.children[labels[i]];
      tree += prettyPrintFlattenedNode(child, prefix, i === labels.length - 1);
    }
    return tree;
  }
  function flattenNode(flattened, node) {
    if (node.handlers.length > 0) {
      flattened.nodes.push(node);
    }
    if (node.children) {
      for (const child of Object.values(node.children)) {
        const childPrefixSegments = child.prefix.split(/(?=\/)/);
        let cursor = flattened;
        let parent;
        for (const segment of childPrefixSegments) {
          parent = cursor;
          cursor = cursor.children[segment];
          if (!cursor) {
            cursor = {
              prefix: segment,
              nodes: [],
              children: {}
            };
            parent.children[segment] = cursor;
          }
        }
        flattenNode(cursor, child);
      }
    }
  }
  function compressFlattenedNode(flattenedNode) {
    const childKeys = Object.keys(flattenedNode.children);
    if (flattenedNode.nodes.length === 0 && childKeys.length === 1) {
      const child = flattenedNode.children[childKeys[0]];
      if (child.nodes.length <= 1) {
        compressFlattenedNode(child);
        flattenedNode.nodes = child.nodes;
        flattenedNode.prefix += child.prefix;
        flattenedNode.children = child.children;
        return flattenedNode;
      }
    }
    for (const key of Object.keys(flattenedNode.children)) {
      compressFlattenedNode(flattenedNode.children[key]);
    }
    return flattenedNode;
  }
  module2.exports = {flattenNode, compressFlattenedNode, prettyPrintFlattenedNode};
});

// node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = function equal(a, b) {
    if (a === b)
      return true;
    if (a && b && typeof a == "object" && typeof b == "object") {
      if (a.constructor !== b.constructor)
        return false;
      var length, i, keys;
      if (Array.isArray(a)) {
        length = a.length;
        if (length != b.length)
          return false;
        for (i = length; i-- !== 0; )
          if (!equal(a[i], b[i]))
            return false;
        return true;
      }
      if (a.constructor === RegExp)
        return a.source === b.source && a.flags === b.flags;
      if (a.valueOf !== Object.prototype.valueOf)
        return a.valueOf() === b.valueOf();
      if (a.toString !== Object.prototype.toString)
        return a.toString() === b.toString();
      keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length)
        return false;
      for (i = length; i-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
          return false;
      for (i = length; i-- !== 0; ) {
        var key = keys[i];
        if (!equal(a[key], b[key]))
          return false;
      }
      return true;
    }
    return a !== a && b !== b;
  };
});

// node_modules/find-my-way/node.js
var require_node2 = __commonJS((exports2, module2) => {
  "use strict";
  var assert = require("assert");
  var deepEqual = require_fast_deep_equal();
  var types = {
    STATIC: 0,
    PARAM: 1,
    MATCH_ALL: 2,
    REGEX: 3,
    MULTI_PARAM: 4
  };
  function Node(options) {
    options = options || {};
    this.prefix = options.prefix || "/";
    this.label = this.prefix[0];
    this.method = options.method;
    this.handlers = options.handlers || [];
    this.unconstrainedHandler = options.unconstrainedHandler || null;
    this.children = options.children || {};
    this.numberOfChildren = Object.keys(this.children).length;
    this.kind = options.kind || this.types.STATIC;
    this.regex = options.regex || null;
    this.wildcardChild = null;
    this.parametricBrother = null;
    this.constrainer = options.constrainer;
    this.hasConstraints = options.hasConstraints;
    this.constrainedHandlerStores = null;
  }
  Object.defineProperty(Node.prototype, "types", {
    value: types
  });
  Node.prototype.getLabel = function() {
    return this.prefix[0];
  };
  Node.prototype.addChild = function(node) {
    var label = "";
    switch (node.kind) {
      case this.types.STATIC:
        label = node.getLabel();
        break;
      case this.types.PARAM:
      case this.types.REGEX:
      case this.types.MULTI_PARAM:
        label = ":";
        break;
      case this.types.MATCH_ALL:
        this.wildcardChild = node;
        label = "*";
        break;
      default:
        throw new Error(`Unknown node kind: ${node.kind}`);
    }
    assert(this.children[label] === void 0, `There is already a child with label '${label}'`);
    this.children[label] = node;
    this.numberOfChildren = Object.keys(this.children).length;
    const labels = Object.keys(this.children);
    var parametricBrother = this.parametricBrother;
    for (var i = 0; i < labels.length; i++) {
      const child = this.children[labels[i]];
      if (child.label === ":") {
        parametricBrother = child;
        break;
      }
    }
    const iterate = (node2) => {
      if (!node2) {
        return;
      }
      if (node2.kind !== this.types.STATIC) {
        return;
      }
      if (node2 !== this) {
        node2.parametricBrother = parametricBrother || node2.parametricBrother;
      }
      const labels2 = Object.keys(node2.children);
      for (var i2 = 0; i2 < labels2.length; i2++) {
        iterate(node2.children[labels2[i2]]);
      }
    };
    iterate(this);
    return this;
  };
  Node.prototype.reset = function(prefix) {
    this.prefix = prefix;
    this.children = {};
    this.handlers = [];
    this.unconstrainedHandler = null;
    this.kind = this.types.STATIC;
    this.numberOfChildren = 0;
    this.regex = null;
    this.wildcardChild = null;
    this.hasConstraints = false;
    this._decompileGetHandlerMatchingConstraints();
    return this;
  };
  Node.prototype.split = function(length) {
    const newChild = new Node({
      prefix: this.prefix.slice(length),
      children: this.children,
      kind: this.kind,
      handlers: this.handlers.slice(0),
      regex: this.regex,
      constrainer: this.constrainer,
      hasConstraints: this.hasConstraints,
      unconstrainedHandler: this.unconstrainedHandler
    });
    if (this.wildcardChild !== null) {
      newChild.wildcardChild = this.wildcardChild;
    }
    this.reset(this.prefix.slice(0, length));
    this.addChild(newChild);
    return newChild;
  };
  Node.prototype.findByLabel = function(path2) {
    return this.children[path2[0]];
  };
  Node.prototype.findMatchingChild = function(derivedConstraints, path2) {
    var child = this.children[path2[0]];
    if (child !== void 0 && (child.numberOfChildren > 0 || child.getMatchingHandler(derivedConstraints) !== null)) {
      if (path2.slice(0, child.prefix.length) === child.prefix) {
        return child;
      }
    }
    child = this.children[":"];
    if (child !== void 0 && (child.numberOfChildren > 0 || child.getMatchingHandler(derivedConstraints) !== null)) {
      return child;
    }
    child = this.children["*"];
    if (child !== void 0 && (child.numberOfChildren > 0 || child.getMatchingHandler(derivedConstraints) !== null)) {
      return child;
    }
    return null;
  };
  Node.prototype.addHandler = function(handler, params, store, constraints) {
    if (!handler)
      return;
    assert(!this.getHandler(constraints), `There is already a handler with constraints '${JSON.stringify(constraints)}' and method '${this.method}'`);
    const handlerObject = {
      handler,
      params,
      constraints,
      store: store || null,
      paramsLength: params.length
    };
    this.handlers.push(handlerObject);
    this.handlers.sort((a, b) => Object.keys(a.constraints).length - Object.keys(b.constraints).length);
    if (Object.keys(constraints).length > 0) {
      this.hasConstraints = true;
    } else {
      this.unconstrainedHandler = handlerObject;
    }
    if (this.hasConstraints && this.handlers.length > 32) {
      throw new Error("find-my-way supports a maximum of 32 route handlers per node when there are constraints, limit reached");
    }
    this._decompileGetHandlerMatchingConstraints();
  };
  Node.prototype.getHandler = function(constraints) {
    return this.handlers.filter((handler) => deepEqual(constraints, handler.constraints))[0];
  };
  function compileThenGetHandlerMatchingConstraints(derivedConstraints) {
    this._compileGetHandlerMatchingConstraints();
    return this._getHandlerMatchingConstraints(derivedConstraints);
  }
  Node.prototype.getMatchingHandler = function(derivedConstraints) {
    if (this.hasConstraints) {
      return this._getHandlerMatchingConstraints(derivedConstraints);
    } else {
      if (derivedConstraints && derivedConstraints.__hasMustMatchValues) {
        return null;
      } else {
        return this.unconstrainedHandler;
      }
    }
  };
  Node.prototype._getHandlerMatchingConstraints = compileThenGetHandlerMatchingConstraints;
  Node.prototype._decompileGetHandlerMatchingConstraints = function() {
    this._getHandlerMatchingConstraints = compileThenGetHandlerMatchingConstraints;
    return null;
  };
  Node.prototype._buildConstraintStore = function(constraint) {
    const store = this.constrainer.newStoreForConstraint(constraint);
    for (let i = 0; i < this.handlers.length; i++) {
      const handler = this.handlers[i];
      const mustMatchValue = handler.constraints[constraint];
      if (typeof mustMatchValue !== "undefined") {
        let indexes = store.get(mustMatchValue);
        if (!indexes) {
          indexes = 0;
        }
        indexes |= 1 << i;
        store.set(mustMatchValue, indexes);
      }
    }
    return store;
  };
  Node.prototype._constrainedIndexBitmask = function(constraint) {
    let mask = 0;
    for (let i = 0; i < this.handlers.length; i++) {
      const handler = this.handlers[i];
      if (handler.constraints && constraint in handler.constraints) {
        mask |= 1 << i;
      }
    }
    return ~mask;
  };
  Node.prototype._compileGetHandlerMatchingConstraints = function() {
    this.constrainedHandlerStores = {};
    let constraints = new Set();
    for (const handler of this.handlers) {
      for (const key of Object.keys(handler.constraints)) {
        constraints.add(key);
      }
    }
    constraints = Array.from(constraints);
    const lines = [];
    constraints.sort((a, b) => a === "version" ? 1 : 0);
    for (const constraint of constraints) {
      this.constrainedHandlerStores[constraint] = this._buildConstraintStore(constraint);
    }
    lines.push(`
  let candidates = 0b${"1".repeat(this.handlers.length)}
  let mask, matches
  `);
    for (const constraint of constraints) {
      lines.push(`
    mask = ${this._constrainedIndexBitmask(constraint)}
    value = derivedConstraints.${constraint}
    `);
      lines.push(`
    if (typeof value === "undefined") {
      candidates &= mask
    } else {
      matches = this.constrainedHandlerStores.${constraint}.get(value) || 0
      candidates &= (matches | mask)
    }
    if (candidates === 0) return null;
    `);
    }
    lines.push(`
  return this.handlers[Math.floor(Math.log2(candidates))]
  `);
    this._getHandlerMatchingConstraints = new Function("derivedConstraints", lines.join("\n"));
  };
  module2.exports = Node;
});

// node_modules/semver-store/index.js
var require_semver_store = __commonJS((exports2, module2) => {
  "use strict";
  function SemVerStore() {
    if (!(this instanceof SemVerStore)) {
      return new SemVerStore();
    }
    this.tree = new Node();
  }
  SemVerStore.prototype.set = function(version, store) {
    if (typeof version !== "string") {
      throw new TypeError("Version should be a string");
    }
    var currentNode = this.tree;
    version = version.split(".");
    while (version.length) {
      currentNode = currentNode.addChild(new Node(version.shift()));
    }
    currentNode.setStore(store);
    return this;
  };
  SemVerStore.prototype.get = function(version) {
    if (typeof version !== "string")
      return null;
    if (version === "*")
      version = "x.x.x";
    var node = this.tree;
    var firstDot = version.indexOf(".");
    var secondDot = version.indexOf(".", firstDot + 1);
    var major = version.slice(0, firstDot);
    var minor = secondDot === -1 ? version.slice(firstDot + 1) : version.slice(firstDot + 1, secondDot);
    var patch = secondDot === -1 ? "x" : version.slice(secondDot + 1);
    node = node.getChild(major);
    if (node === null)
      return null;
    node = node.getChild(minor);
    if (node === null)
      return null;
    node = node.getChild(patch);
    if (node === null)
      return null;
    return node.store;
  };
  SemVerStore.prototype.del = function(version) {
    if (typeof version !== "string") {
      throw new TypeError("Version should be a string");
    }
    var firstDot = version.indexOf(".");
    var secondDot = version.indexOf(".", firstDot + 1);
    var major = version.slice(0, firstDot);
    var minor = secondDot === -1 ? version.slice(firstDot + 1) : version.slice(firstDot + 1, secondDot);
    var patch = secondDot === -1 ? "x" : version.slice(secondDot + 1);
    var majorNode = this.tree.children[major];
    if (majorNode == null)
      return this;
    if (minor === "x") {
      this.tree.removeChild(major);
      return this;
    }
    var minorNode = majorNode.children[minor];
    if (minorNode == null)
      return this;
    if (patch === "x") {
      this.tree.children[major].removeChild(minor);
      if (this.tree.children[major].length === 0) {
        this.tree.removeChild(major);
      }
      return this;
    }
    var patchNode = minorNode.children[patch];
    if (patchNode == null)
      return this;
    this.tree.children[major].children[minor].removeChild(patch);
    if (this.tree.children[major].children[minor].length === 0) {
      this.tree.children[major].removeChild(minor);
      if (this.tree.children[major].length === 0) {
        this.tree.removeChild(major);
      }
    }
    return this;
  };
  SemVerStore.prototype.empty = function() {
    this.tree = new Node();
    return this;
  };
  function getMax(arr) {
    var l = arr.length;
    var max = arr[0];
    for (var i = 1; i < l; i++) {
      if (arr[i] > max) {
        max = arr[i];
      }
    }
    return max;
  }
  function Node(prefix, children, store) {
    this.prefix = Number(prefix) || 0;
    this.children = children || null;
    this.childrenPrefixes = children ? Object.keys(children) : [];
    this.store = store || null;
  }
  Node.prototype.getChild = function(prefix) {
    if (this.children === null)
      return null;
    if (prefix === "x") {
      var max = getMax(this.childrenPrefixes);
      return this.children[max];
    }
    return this.children[prefix] || null;
  };
  Node.prototype.addChild = function(node) {
    this.children = this.children || {};
    var child = this.getChild(node.prefix);
    if (child === null) {
      this.children[node.prefix] = node;
      this.childrenPrefixes.push(node.prefix);
    }
    return child || node;
  };
  Node.prototype.removeChild = function(prefix) {
    if (prefix === "x") {
      this.children = null;
      this.childrenPrefixes = [];
      return this;
    }
    if (this.children[prefix] !== void 0) {
      prefix = Number(prefix);
      delete this.children[prefix];
      this.childrenPrefixes.splice(this.childrenPrefixes.indexOf(prefix), 1);
    }
    return this;
  };
  Node.prototype.setStore = function(store) {
    this.store = store;
    return this;
  };
  Object.defineProperty(Node.prototype, "length", {
    get: function() {
      return this.childrenPrefixes.length;
    }
  });
  module2.exports = SemVerStore;
});

// node_modules/find-my-way/lib/strategies/accept-version.js
var require_accept_version = __commonJS((exports2, module2) => {
  "use strict";
  var SemVerStore = require_semver_store();
  var assert = require("assert");
  module2.exports = {
    name: "version",
    mustMatchWhenDerived: true,
    storage: SemVerStore,
    validate(value) {
      assert(typeof value === "string", "Version should be a string");
    }
  };
});

// node_modules/find-my-way/lib/strategies/accept-host.js
var require_accept_host = __commonJS((exports2, module2) => {
  "use strict";
  var assert = require("assert");
  function HostStorage() {
    var hosts = {};
    var regexHosts = [];
    return {
      get: (host) => {
        var exact = hosts[host];
        if (exact) {
          return exact;
        }
        var item;
        for (var i = 0; i < regexHosts.length; i++) {
          item = regexHosts[i];
          if (item.host.test(host)) {
            return item.value;
          }
        }
      },
      set: (host, value) => {
        if (host instanceof RegExp) {
          regexHosts.push({host, value});
        } else {
          hosts[host] = value;
        }
      },
      del: (host) => {
        delete hosts[host];
        regexHosts = regexHosts.filter((obj) => String(obj.host) !== String(host));
      },
      empty: () => {
        hosts = {};
        regexHosts = [];
      }
    };
  }
  module2.exports = {
    name: "host",
    mustMatchWhenDerived: false,
    storage: HostStorage,
    validate(value) {
      assert(typeof value === "string" || Object.prototype.toString.call(value) === "[object RegExp]", "Host should be a string or a RegExp");
    }
  };
});

// node_modules/find-my-way/lib/constrainer.js
var require_constrainer = __commonJS((exports2, module2) => {
  "use strict";
  var acceptVersionStrategy = require_accept_version();
  var acceptHostStrategy = require_accept_host();
  var assert = require("assert");
  var Constrainer = class {
    constructor(customStrategies) {
      this.strategies = {
        version: acceptVersionStrategy,
        host: acceptHostStrategy
      };
      this.strategiesInUse = new Set();
      if (customStrategies) {
        var kCustomStrategies = Object.keys(customStrategies);
        var strategy;
        for (var i = 0; i < kCustomStrategies.length; i++) {
          strategy = customStrategies[kCustomStrategies[i]];
          assert(typeof strategy.name === "string" && strategy.name !== "", "strategy.name is required.");
          assert(strategy.storage && typeof strategy.storage === "function", "strategy.storage function is required.");
          assert(strategy.deriveConstraint && typeof strategy.deriveConstraint === "function", "strategy.deriveConstraint function is required.");
          strategy.isCustom = true;
          this.strategies[strategy.name] = strategy;
        }
      }
    }
    deriveConstraints(req, ctx) {
      return void 0;
    }
    noteUsage(constraints) {
      if (constraints) {
        const beforeSize = this.strategiesInUse.size;
        for (const key in constraints) {
          this.strategiesInUse.add(key);
        }
        if (beforeSize !== this.strategiesInUse.size) {
          this._buildDeriveConstraints();
        }
      }
    }
    newStoreForConstraint(constraint) {
      if (!this.strategies[constraint]) {
        throw new Error(`No strategy registered for constraint key ${constraint}`);
      }
      return this.strategies[constraint].storage();
    }
    validateConstraints(constraints) {
      for (const key in constraints) {
        const value = constraints[key];
        if (typeof value === "undefined") {
          throw new Error("Can't pass an undefined constraint value, must pass null or no key at all");
        }
        const strategy = this.strategies[key];
        if (!strategy) {
          throw new Error(`No strategy registered for constraint key ${key}`);
        }
        if (strategy.validate) {
          strategy.validate(value);
        }
      }
    }
    _buildDeriveConstraints() {
      if (this.strategiesInUse.size === 0)
        return;
      const lines = [`
      const derivedConstraints = {
        __hasMustMatchValues: false,
    `];
      const mustMatchKeys = [];
      for (const key of this.strategiesInUse) {
        const strategy = this.strategies[key];
        if (!strategy.isCustom) {
          if (key === "version") {
            lines.push("   version: req.headers['accept-version'],");
          } else if (key === "host") {
            lines.push("   host: req.headers.host,");
          } else {
            throw new Error("unknown non-custom strategy for compiling constraint derivation function");
          }
        } else {
          lines.push(`  ${strategy.name}: this.strategies.${key}.deriveConstraint(req, ctx),`);
        }
        if (strategy.mustMatchWhenDerived) {
          mustMatchKeys.push(key);
        }
      }
      lines.push("}");
      if (mustMatchKeys.length > 0) {
        lines.push(`derivedConstraints.__hasMustMatchValues = !!(${mustMatchKeys.map((key) => `derivedConstraints.${key}`).join(" || ")})`);
      }
      lines.push("return derivedConstraints");
      this.deriveConstraints = new Function("req", "ctx", lines.join("\n")).bind(this);
    }
  };
  module2.exports = Constrainer;
});

// node_modules/find-my-way/index.js
var require_find_my_way = __commonJS((exports2, module2) => {
  "use strict";
  var assert = require("assert");
  var http = require("http");
  var fastDecode = require_fast_decode_uri_component();
  var isRegexSafe = require_safe_regex2();
  var {flattenNode, compressFlattenedNode, prettyPrintFlattenedNode} = require_pretty_print();
  var Node = require_node2();
  var Constrainer = require_constrainer();
  var NODE_TYPES = Node.prototype.types;
  var httpMethods = http.METHODS;
  var FULL_PATH_REGEXP = /^https?:\/\/.*?\//;
  if (!isRegexSafe(FULL_PATH_REGEXP)) {
    throw new Error("the FULL_PATH_REGEXP is not safe, update this module");
  }
  function Router(opts) {
    if (!(this instanceof Router)) {
      return new Router(opts);
    }
    opts = opts || {};
    if (opts.defaultRoute) {
      assert(typeof opts.defaultRoute === "function", "The default route must be a function");
      this.defaultRoute = opts.defaultRoute;
    } else {
      this.defaultRoute = null;
    }
    if (opts.onBadUrl) {
      assert(typeof opts.onBadUrl === "function", "The bad url handler must be a function");
      this.onBadUrl = opts.onBadUrl;
    } else {
      this.onBadUrl = null;
    }
    this.caseSensitive = opts.caseSensitive === void 0 ? true : opts.caseSensitive;
    this.ignoreTrailingSlash = opts.ignoreTrailingSlash || false;
    this.maxParamLength = opts.maxParamLength || 100;
    this.allowUnsafeRegex = opts.allowUnsafeRegex || false;
    this.constrainer = new Constrainer(opts.constraints);
    this.trees = {};
    this.routes = [];
  }
  Router.prototype.on = function on(method, path2, opts, handler, store) {
    if (typeof opts === "function") {
      if (handler !== void 0) {
        store = handler;
      }
      handler = opts;
      opts = {};
    }
    assert(typeof path2 === "string", "Path should be a string");
    assert(path2.length > 0, "The path could not be empty");
    assert(path2[0] === "/" || path2[0] === "*", "The first character of a path should be `/` or `*`");
    assert(typeof handler === "function", "Handler should be a function");
    this._on(method, path2, opts, handler, store);
    if (this.ignoreTrailingSlash && path2 !== "/" && !path2.endsWith("*")) {
      if (path2.endsWith("/")) {
        this._on(method, path2.slice(0, -1), opts, handler, store);
      } else {
        this._on(method, path2 + "/", opts, handler, store);
      }
    }
  };
  Router.prototype._on = function _on(method, path2, opts, handler, store) {
    if (Array.isArray(method)) {
      for (var k = 0; k < method.length; k++) {
        this._on(method[k], path2, opts, handler, store);
      }
      return;
    }
    assert(typeof method === "string", "Method should be a string");
    assert(httpMethods.indexOf(method) !== -1, `Method '${method}' is not an http method.`);
    let constraints = {};
    if (opts.constraints !== void 0) {
      assert(typeof opts.constraints === "object" && opts.constraints !== null, "Constraints should be an object");
      if (Object.keys(opts.constraints).length !== 0) {
        constraints = opts.constraints;
      }
    }
    this.constrainer.validateConstraints(constraints);
    this.constrainer.noteUsage(constraints);
    const params = [];
    var j = 0;
    this.routes.push({
      method,
      path: path2,
      opts,
      handler,
      store
    });
    for (var i2 = 0, len = path2.length; i2 < len; i2++) {
      if (path2.charCodeAt(i2) === 58) {
        if (i2 !== len - 1 && path2.charCodeAt(i2 + 1) === 58) {
          path2 = path2.slice(0, i2) + path2.slice(i2 + 1);
          len = path2.length;
          continue;
        }
        var nodeType = NODE_TYPES.PARAM;
        j = i2 + 1;
        var staticPart = path2.slice(0, i2);
        if (this.caseSensitive === false) {
          staticPart = staticPart.toLowerCase();
        }
        this._insert(method, staticPart, NODE_TYPES.STATIC, null, null, null, null, constraints);
        var isRegex = false;
        while (i2 < len && path2.charCodeAt(i2) !== 47) {
          isRegex = isRegex || path2[i2] === "(";
          if (isRegex) {
            i2 = getClosingParenthensePosition(path2, i2) + 1;
            break;
          } else if (path2.charCodeAt(i2) !== 45) {
            i2++;
          } else {
            break;
          }
        }
        if (isRegex && (i2 === len || path2.charCodeAt(i2) === 47)) {
          nodeType = NODE_TYPES.REGEX;
        } else if (i2 < len && path2.charCodeAt(i2) !== 47) {
          nodeType = NODE_TYPES.MULTI_PARAM;
        }
        var parameter = path2.slice(j, i2);
        var regex = isRegex ? parameter.slice(parameter.indexOf("("), i2) : null;
        if (isRegex) {
          regex = new RegExp(regex);
          if (!this.allowUnsafeRegex) {
            assert(isRegexSafe(regex), `The regex '${regex.toString()}' is not safe!`);
          }
        }
        params.push(parameter.slice(0, isRegex ? parameter.indexOf("(") : i2));
        path2 = path2.slice(0, j) + path2.slice(i2);
        i2 = j;
        len = path2.length;
        if (i2 === len) {
          var completedPath = path2.slice(0, i2);
          if (this.caseSensitive === false) {
            completedPath = completedPath.toLowerCase();
          }
          return this._insert(method, completedPath, nodeType, params, handler, store, regex, constraints);
        }
        staticPart = path2.slice(0, i2);
        if (this.caseSensitive === false) {
          staticPart = staticPart.toLowerCase();
        }
        this._insert(method, staticPart, nodeType, params, null, null, regex, constraints);
        i2--;
      } else if (path2.charCodeAt(i2) === 42) {
        this._insert(method, path2.slice(0, i2), NODE_TYPES.STATIC, null, null, null, null, constraints);
        params.push("*");
        return this._insert(method, path2.slice(0, len), NODE_TYPES.MATCH_ALL, params, handler, store, null, constraints);
      }
    }
    if (this.caseSensitive === false) {
      path2 = path2.toLowerCase();
    }
    this._insert(method, path2, NODE_TYPES.STATIC, params, handler, store, null, constraints);
  };
  Router.prototype._insert = function _insert(method, path2, kind, params, handler, store, regex, constraints) {
    const route = path2;
    var prefix = "";
    var pathLen = 0;
    var prefixLen = 0;
    var len = 0;
    var max = 0;
    var node = null;
    var currentNode = this.trees[method];
    if (typeof currentNode === "undefined") {
      currentNode = new Node({method, constrainer: this.constrainer});
      this.trees[method] = currentNode;
    }
    while (true) {
      prefix = currentNode.prefix;
      prefixLen = prefix.length;
      pathLen = path2.length;
      len = 0;
      max = pathLen < prefixLen ? pathLen : prefixLen;
      while (len < max && path2[len] === prefix[len])
        len++;
      if (len < prefixLen) {
        node = currentNode.split(len);
        if (len === pathLen) {
          assert(!currentNode.getHandler(constraints), `Method '${method}' already declared for route '${route}' with constraints '${JSON.stringify(constraints)}'`);
          currentNode.addHandler(handler, params, store, constraints);
          currentNode.kind = kind;
        } else {
          node = new Node({
            method,
            prefix: path2.slice(len),
            kind,
            handlers: null,
            regex,
            constrainer: this.constrainer
          });
          node.addHandler(handler, params, store, constraints);
          currentNode.addChild(node);
        }
      } else if (len < pathLen) {
        path2 = path2.slice(len);
        node = currentNode.findByLabel(path2);
        if (node) {
          currentNode = node;
          continue;
        }
        node = new Node({method, prefix: path2, kind, handlers: null, regex, constrainer: this.constrainer});
        node.addHandler(handler, params, store, constraints);
        currentNode.addChild(node);
      } else if (handler) {
        assert(!currentNode.getHandler(constraints), `Method '${method}' already declared for route '${route}' with constraints '${JSON.stringify(constraints)}'`);
        currentNode.addHandler(handler, params, store, constraints);
      }
      return;
    }
  };
  Router.prototype.reset = function reset() {
    this.trees = {};
    this.routes = [];
  };
  Router.prototype.off = function off(method, path2) {
    var self2 = this;
    if (Array.isArray(method)) {
      return method.map(function(method2) {
        return self2.off(method2, path2);
      });
    }
    assert(typeof method === "string", "Method should be a string");
    assert(httpMethods.indexOf(method) !== -1, `Method '${method}' is not an http method.`);
    assert(typeof path2 === "string", "Path should be a string");
    assert(path2.length > 0, "The path could not be empty");
    assert(path2[0] === "/" || path2[0] === "*", "The first character of a path should be `/` or `*`");
    const ignoreTrailingSlash = this.ignoreTrailingSlash;
    var newRoutes = self2.routes.filter(function(route) {
      if (!ignoreTrailingSlash) {
        return !(method === route.method && path2 === route.path);
      }
      if (path2.endsWith("/")) {
        const routeMatches2 = path2 === route.path || path2.slice(0, -1) === route.path;
        return !(method === route.method && routeMatches2);
      }
      const routeMatches = path2 === route.path || path2 + "/" === route.path;
      return !(method === route.method && routeMatches);
    });
    if (ignoreTrailingSlash) {
      newRoutes = newRoutes.filter(function(route, i2, ar) {
        if (route.path.endsWith("/") && i2 < ar.length - 1) {
          return route.path.slice(0, -1) !== ar[i2 + 1].path;
        } else if (route.path.endsWith("/") === false && i2 < ar.length - 1) {
          return route.path + "/" !== ar[i2 + 1].path;
        }
        return true;
      });
    }
    self2.reset();
    newRoutes.forEach(function(route) {
      self2.on(route.method, route.path, route.opts, route.handler, route.store);
    });
  };
  Router.prototype.lookup = function lookup(req, res, ctx) {
    var handle = this.find(req.method, sanitizeUrl(req.url), this.constrainer.deriveConstraints(req, ctx));
    if (handle === null)
      return this._defaultRoute(req, res, ctx);
    return ctx === void 0 ? handle.handler(req, res, handle.params, handle.store) : handle.handler.call(ctx, req, res, handle.params, handle.store);
  };
  Router.prototype.find = function find(method, path2, derivedConstraints) {
    var currentNode = this.trees[method];
    if (currentNode === void 0)
      return null;
    if (path2.charCodeAt(0) !== 47) {
      path2 = path2.replace(FULL_PATH_REGEXP, "/");
    }
    var originalPath = path2;
    var originalPathLength = path2.length;
    if (this.caseSensitive === false) {
      path2 = path2.toLowerCase();
    }
    var maxParamLength = this.maxParamLength;
    var wildcardNode = null;
    var pathLenWildcard = 0;
    var decoded = null;
    var pindex = 0;
    var params = null;
    var i2 = 0;
    var idxInOriginalPath = 0;
    while (true) {
      var pathLen = path2.length;
      var prefix = currentNode.prefix;
      if (pathLen === 0 || path2 === prefix) {
        var handle = derivedConstraints !== void 0 ? currentNode.getMatchingHandler(derivedConstraints) : currentNode.unconstrainedHandler;
        if (handle !== null && handle !== void 0) {
          var paramsObj = {};
          if (handle.paramsLength > 0) {
            var paramNames = handle.params;
            for (i2 = 0; i2 < handle.paramsLength; i2++) {
              paramsObj[paramNames[i2]] = params[i2];
            }
          }
          return {
            handler: handle.handler,
            params: paramsObj,
            store: handle.store
          };
        }
      }
      var prefixLen = prefix.length;
      var len = 0;
      var previousPath = path2;
      i2 = pathLen < prefixLen ? pathLen : prefixLen;
      while (len < i2 && path2.charCodeAt(len) === prefix.charCodeAt(len))
        len++;
      if (len === prefixLen) {
        path2 = path2.slice(len);
        pathLen = path2.length;
        idxInOriginalPath += len;
      }
      var node = currentNode.findMatchingChild(derivedConstraints, path2);
      if (node === null) {
        node = currentNode.parametricBrother;
        if (node === null) {
          return this._getWildcardNode(wildcardNode, originalPath, pathLenWildcard);
        }
        var goBack = previousPath.charCodeAt(0) === 47 ? previousPath : "/" + previousPath;
        if (originalPath.indexOf(goBack) === -1) {
          var pathDiff = originalPath.slice(0, originalPathLength - pathLen);
          previousPath = pathDiff.slice(pathDiff.lastIndexOf("/") + 1, pathDiff.length) + path2;
        }
        idxInOriginalPath = idxInOriginalPath - (previousPath.length - path2.length);
        path2 = previousPath;
        pathLen = previousPath.length;
        len = prefixLen;
      }
      var kind = node.kind;
      if (kind === NODE_TYPES.STATIC) {
        if (currentNode.wildcardChild !== null) {
          wildcardNode = currentNode.wildcardChild;
          pathLenWildcard = pathLen;
        }
        currentNode = node;
        continue;
      }
      if (len !== prefixLen) {
        return this._getWildcardNode(wildcardNode, originalPath, pathLenWildcard);
      }
      if (currentNode.wildcardChild !== null) {
        wildcardNode = currentNode.wildcardChild;
        pathLenWildcard = pathLen;
      }
      if (kind === NODE_TYPES.PARAM) {
        currentNode = node;
        i2 = path2.indexOf("/");
        if (i2 === -1)
          i2 = pathLen;
        if (i2 > maxParamLength)
          return null;
        decoded = fastDecode(originalPath.slice(idxInOriginalPath, idxInOriginalPath + i2));
        if (decoded === null) {
          return this.onBadUrl !== null ? this._onBadUrl(originalPath.slice(idxInOriginalPath, idxInOriginalPath + i2)) : null;
        }
        params || (params = []);
        params[pindex++] = decoded;
        path2 = path2.slice(i2);
        idxInOriginalPath += i2;
        continue;
      }
      if (kind === NODE_TYPES.MATCH_ALL) {
        decoded = fastDecode(originalPath.slice(idxInOriginalPath));
        if (decoded === null) {
          return this.onBadUrl !== null ? this._onBadUrl(originalPath.slice(idxInOriginalPath)) : null;
        }
        params || (params = []);
        params[pindex] = decoded;
        currentNode = node;
        path2 = "";
        continue;
      }
      if (kind === NODE_TYPES.REGEX) {
        currentNode = node;
        i2 = path2.indexOf("/");
        if (i2 === -1)
          i2 = pathLen;
        if (i2 > maxParamLength)
          return null;
        decoded = fastDecode(originalPath.slice(idxInOriginalPath, idxInOriginalPath + i2));
        if (decoded === null) {
          return this.onBadUrl !== null ? this._onBadUrl(originalPath.slice(idxInOriginalPath, idxInOriginalPath + i2)) : null;
        }
        if (!node.regex.test(decoded))
          return null;
        params || (params = []);
        params[pindex++] = decoded;
        path2 = path2.slice(i2);
        idxInOriginalPath += i2;
        continue;
      }
      if (kind === NODE_TYPES.MULTI_PARAM) {
        currentNode = node;
        i2 = 0;
        if (node.regex !== null) {
          var matchedParameter = path2.match(node.regex);
          if (matchedParameter === null)
            return null;
          i2 = matchedParameter[1].length;
        } else {
          while (i2 < pathLen && path2.charCodeAt(i2) !== 47 && path2.charCodeAt(i2) !== 45)
            i2++;
          if (i2 > maxParamLength)
            return null;
        }
        decoded = fastDecode(originalPath.slice(idxInOriginalPath, idxInOriginalPath + i2));
        if (decoded === null) {
          return this.onBadUrl !== null ? this._onBadUrl(originalPath.slice(idxInOriginalPath, idxInOriginalPath + i2)) : null;
        }
        params || (params = []);
        params[pindex++] = decoded;
        path2 = path2.slice(i2);
        idxInOriginalPath += i2;
        continue;
      }
      wildcardNode = null;
    }
  };
  Router.prototype._getWildcardNode = function(node, path2, len) {
    if (node === null)
      return null;
    var decoded = fastDecode(path2.slice(-len));
    if (decoded === null) {
      return this.onBadUrl !== null ? this._onBadUrl(path2.slice(-len)) : null;
    }
    var handle = node.handlers[0];
    if (handle !== null && handle !== void 0) {
      return {
        handler: handle.handler,
        params: {"*": decoded},
        store: handle.store
      };
    }
    return null;
  };
  Router.prototype._defaultRoute = function(req, res, ctx) {
    if (this.defaultRoute !== null) {
      return ctx === void 0 ? this.defaultRoute(req, res) : this.defaultRoute.call(ctx, req, res);
    } else {
      res.statusCode = 404;
      res.end();
    }
  };
  Router.prototype._onBadUrl = function(path2) {
    const onBadUrl = this.onBadUrl;
    return {
      handler: (req, res, ctx) => onBadUrl(path2, req, res),
      params: {},
      store: null
    };
  };
  Router.prototype.prettyPrint = function() {
    const root = {
      prefix: "/",
      nodes: [],
      children: {}
    };
    for (const node of Object.values(this.trees)) {
      if (node) {
        flattenNode(root, node);
      }
    }
    compressFlattenedNode(root);
    return prettyPrintFlattenedNode(root, "", true);
  };
  for (var i in http.METHODS) {
    if (!http.METHODS.hasOwnProperty(i))
      continue;
    const m = http.METHODS[i];
    const methodName = m.toLowerCase();
    if (Router.prototype[methodName])
      throw new Error("Method already exists: " + methodName);
    Router.prototype[methodName] = function(path2, handler, store) {
      return this.on(m, path2, handler, store);
    };
  }
  Router.prototype.all = function(path2, handler, store) {
    this.on(httpMethods, path2, handler, store);
  };
  module2.exports = Router;
  function sanitizeUrl(url) {
    for (var i2 = 0, len = url.length; i2 < len; i2++) {
      var charCode = url.charCodeAt(i2);
      if (charCode === 63 || charCode === 59 || charCode === 35) {
        return url.slice(0, i2);
      }
    }
    return url;
  }
  function getClosingParenthensePosition(path2, idx) {
    var parentheses = 1;
    while (idx < path2.length) {
      idx++;
      if (path2[idx] === "\\") {
        idx++;
        continue;
      }
      if (path2[idx] === ")") {
        parentheses--;
      } else if (path2[idx] === "(") {
        parentheses++;
      }
      if (!parentheses)
        return idx;
    }
    throw new TypeError('Invalid regexp expression in "' + path2 + '"');
  }
});

// node_modules/lodash/lodash.js
var require_lodash = __commonJS((exports2, module2) => {
  /**
   * @license
   * Lodash <https://lodash.com/>
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */
  (function() {
    var undefined2;
    var VERSION = "4.17.21";
    var LARGE_ARRAY_SIZE = 200;
    var CORE_ERROR_TEXT = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", FUNC_ERROR_TEXT = "Expected a function", INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`";
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var MAX_MEMOIZE_SIZE = 500;
    var PLACEHOLDER = "__lodash_placeholder__";
    var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
    var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
    var WRAP_BIND_FLAG = 1, WRAP_BIND_KEY_FLAG = 2, WRAP_CURRY_BOUND_FLAG = 4, WRAP_CURRY_FLAG = 8, WRAP_CURRY_RIGHT_FLAG = 16, WRAP_PARTIAL_FLAG = 32, WRAP_PARTIAL_RIGHT_FLAG = 64, WRAP_ARY_FLAG = 128, WRAP_REARG_FLAG = 256, WRAP_FLIP_FLAG = 512;
    var DEFAULT_TRUNC_LENGTH = 30, DEFAULT_TRUNC_OMISSION = "...";
    var HOT_COUNT = 800, HOT_SPAN = 16;
    var LAZY_FILTER_FLAG = 1, LAZY_MAP_FLAG = 2, LAZY_WHILE_FLAG = 3;
    var INFINITY = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991, MAX_INTEGER = 17976931348623157e292, NAN = 0 / 0;
    var MAX_ARRAY_LENGTH = 4294967295, MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1, HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
    var wrapFlags = [
      ["ary", WRAP_ARY_FLAG],
      ["bind", WRAP_BIND_FLAG],
      ["bindKey", WRAP_BIND_KEY_FLAG],
      ["curry", WRAP_CURRY_FLAG],
      ["curryRight", WRAP_CURRY_RIGHT_FLAG],
      ["flip", WRAP_FLIP_FLAG],
      ["partial", WRAP_PARTIAL_FLAG],
      ["partialRight", WRAP_PARTIAL_RIGHT_FLAG],
      ["rearg", WRAP_REARG_FLAG]
    ];
    var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", domExcTag = "[object DOMException]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]", weakSetTag = "[object WeakSet]";
    var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
    var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
    var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g, reUnescapedHtml = /[&<>"']/g, reHasEscapedHtml = RegExp(reEscapedHtml.source), reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
    var reEscape = /<%-([\s\S]+?)%>/g, reEvaluate = /<%([\s\S]+?)%>/g, reInterpolate = /<%=([\s\S]+?)%>/g;
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source);
    var reTrimStart = /^\s+/;
    var reWhitespace = /\s/;
    var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/, reSplitDetails = /,? & /;
    var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
    var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
    var reEscapeChar = /\\(\\)?/g;
    var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
    var reFlags = /\w*$/;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reIsOctal = /^0o[0-7]+$/i;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
    var reNoMatch = /($^)/;
    var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
    var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsDingbatRange = "\\u2700-\\u27bf", rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff", rsMathOpRange = "\\xac\\xb1\\xd7\\xf7", rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", rsPunctuationRange = "\\u2000-\\u206f", rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde", rsVarRange = "\\ufe0e\\ufe0f", rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
    var rsApos = "['\u2019]", rsAstral = "[" + rsAstralRange + "]", rsBreak = "[" + rsBreakRange + "]", rsCombo = "[" + rsComboRange + "]", rsDigits = "\\d+", rsDingbat = "[" + rsDingbatRange + "]", rsLower = "[" + rsLowerRange + "]", rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsUpper = "[" + rsUpperRange + "]", rsZWJ = "\\u200d";
    var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")", rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")", rsOptContrLower = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?", rsOptContrUpper = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?", reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*", rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsEmoji = "(?:" + [rsDingbat, rsRegional, rsSurrPair].join("|") + ")" + rsSeq, rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
    var reApos = RegExp(rsApos, "g");
    var reComboMark = RegExp(rsCombo, "g");
    var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
    var reUnicodeWord = RegExp([
      rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [rsBreak, rsUpper, "$"].join("|") + ")",
      rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [rsBreak, rsUpper + rsMiscLower, "$"].join("|") + ")",
      rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower,
      rsUpper + "+" + rsOptContrUpper,
      rsOrdUpper,
      rsOrdLower,
      rsDigits,
      rsEmoji
    ].join("|"), "g");
    var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]");
    var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
    var contextProps = [
      "Array",
      "Buffer",
      "DataView",
      "Date",
      "Error",
      "Float32Array",
      "Float64Array",
      "Function",
      "Int8Array",
      "Int16Array",
      "Int32Array",
      "Map",
      "Math",
      "Object",
      "Promise",
      "RegExp",
      "Set",
      "String",
      "Symbol",
      "TypeError",
      "Uint8Array",
      "Uint8ClampedArray",
      "Uint16Array",
      "Uint32Array",
      "WeakMap",
      "_",
      "clearTimeout",
      "isFinite",
      "parseInt",
      "setTimeout"
    ];
    var templateCounter = -1;
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    var cloneableTags = {};
    cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
    var deburredLetters = {
      \u00C0: "A",
      \u00C1: "A",
      \u00C2: "A",
      \u00C3: "A",
      \u00C4: "A",
      \u00C5: "A",
      \u00E0: "a",
      \u00E1: "a",
      \u00E2: "a",
      \u00E3: "a",
      \u00E4: "a",
      \u00E5: "a",
      \u00C7: "C",
      \u00E7: "c",
      \u00D0: "D",
      \u00F0: "d",
      \u00C8: "E",
      \u00C9: "E",
      \u00CA: "E",
      \u00CB: "E",
      \u00E8: "e",
      \u00E9: "e",
      \u00EA: "e",
      \u00EB: "e",
      \u00CC: "I",
      \u00CD: "I",
      \u00CE: "I",
      \u00CF: "I",
      \u00EC: "i",
      \u00ED: "i",
      \u00EE: "i",
      \u00EF: "i",
      \u00D1: "N",
      \u00F1: "n",
      \u00D2: "O",
      \u00D3: "O",
      \u00D4: "O",
      \u00D5: "O",
      \u00D6: "O",
      \u00D8: "O",
      \u00F2: "o",
      \u00F3: "o",
      \u00F4: "o",
      \u00F5: "o",
      \u00F6: "o",
      \u00F8: "o",
      \u00D9: "U",
      \u00DA: "U",
      \u00DB: "U",
      \u00DC: "U",
      \u00F9: "u",
      \u00FA: "u",
      \u00FB: "u",
      \u00FC: "u",
      \u00DD: "Y",
      \u00FD: "y",
      \u00FF: "y",
      \u00C6: "Ae",
      \u00E6: "ae",
      \u00DE: "Th",
      \u00FE: "th",
      \u00DF: "ss",
      \u0100: "A",
      \u0102: "A",
      \u0104: "A",
      \u0101: "a",
      \u0103: "a",
      \u0105: "a",
      \u0106: "C",
      \u0108: "C",
      \u010A: "C",
      \u010C: "C",
      \u0107: "c",
      \u0109: "c",
      \u010B: "c",
      \u010D: "c",
      \u010E: "D",
      \u0110: "D",
      \u010F: "d",
      \u0111: "d",
      \u0112: "E",
      \u0114: "E",
      \u0116: "E",
      \u0118: "E",
      \u011A: "E",
      \u0113: "e",
      \u0115: "e",
      \u0117: "e",
      \u0119: "e",
      \u011B: "e",
      \u011C: "G",
      \u011E: "G",
      \u0120: "G",
      \u0122: "G",
      \u011D: "g",
      \u011F: "g",
      \u0121: "g",
      \u0123: "g",
      \u0124: "H",
      \u0126: "H",
      \u0125: "h",
      \u0127: "h",
      \u0128: "I",
      \u012A: "I",
      \u012C: "I",
      \u012E: "I",
      \u0130: "I",
      \u0129: "i",
      \u012B: "i",
      \u012D: "i",
      \u012F: "i",
      \u0131: "i",
      \u0134: "J",
      \u0135: "j",
      \u0136: "K",
      \u0137: "k",
      \u0138: "k",
      \u0139: "L",
      \u013B: "L",
      \u013D: "L",
      \u013F: "L",
      \u0141: "L",
      \u013A: "l",
      \u013C: "l",
      \u013E: "l",
      \u0140: "l",
      \u0142: "l",
      \u0143: "N",
      \u0145: "N",
      \u0147: "N",
      \u014A: "N",
      \u0144: "n",
      \u0146: "n",
      \u0148: "n",
      \u014B: "n",
      \u014C: "O",
      \u014E: "O",
      \u0150: "O",
      \u014D: "o",
      \u014F: "o",
      \u0151: "o",
      \u0154: "R",
      \u0156: "R",
      \u0158: "R",
      \u0155: "r",
      \u0157: "r",
      \u0159: "r",
      \u015A: "S",
      \u015C: "S",
      \u015E: "S",
      \u0160: "S",
      \u015B: "s",
      \u015D: "s",
      \u015F: "s",
      \u0161: "s",
      \u0162: "T",
      \u0164: "T",
      \u0166: "T",
      \u0163: "t",
      \u0165: "t",
      \u0167: "t",
      \u0168: "U",
      \u016A: "U",
      \u016C: "U",
      \u016E: "U",
      \u0170: "U",
      \u0172: "U",
      \u0169: "u",
      \u016B: "u",
      \u016D: "u",
      \u016F: "u",
      \u0171: "u",
      \u0173: "u",
      \u0174: "W",
      \u0175: "w",
      \u0176: "Y",
      \u0177: "y",
      \u0178: "Y",
      \u0179: "Z",
      \u017B: "Z",
      \u017D: "Z",
      \u017A: "z",
      \u017C: "z",
      \u017E: "z",
      \u0132: "IJ",
      \u0133: "ij",
      \u0152: "Oe",
      \u0153: "oe",
      \u0149: "'n",
      \u017F: "s"
    };
    var htmlEscapes = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    var htmlUnescapes = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'"
    };
    var stringEscapes = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    };
    var freeParseFloat = parseFloat, freeParseInt = parseInt;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    var freeExports = typeof exports2 == "object" && exports2 && !exports2.nodeType && exports2;
    var freeModule = freeExports && typeof module2 == "object" && module2 && !module2.nodeType && module2;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
    var nodeUtil = function() {
      try {
        var types = freeModule && freeModule.require && freeModule.require("util").types;
        if (types) {
          return types;
        }
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e) {
      }
    }();
    var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer, nodeIsDate = nodeUtil && nodeUtil.isDate, nodeIsMap = nodeUtil && nodeUtil.isMap, nodeIsRegExp = nodeUtil && nodeUtil.isRegExp, nodeIsSet = nodeUtil && nodeUtil.isSet, nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
    function apply(func, thisArg, args) {
      switch (args.length) {
        case 0:
          return func.call(thisArg);
        case 1:
          return func.call(thisArg, args[0]);
        case 2:
          return func.call(thisArg, args[0], args[1]);
        case 3:
          return func.call(thisArg, args[0], args[1], args[2]);
      }
      return func.apply(thisArg, args);
    }
    function arrayAggregator(array, setter, iteratee, accumulator) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        var value = array[index];
        setter(accumulator, value, iteratee(value), array);
      }
      return accumulator;
    }
    function arrayEach(array, iteratee) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }
    function arrayEachRight(array, iteratee) {
      var length = array == null ? 0 : array.length;
      while (length--) {
        if (iteratee(array[length], length, array) === false) {
          break;
        }
      }
      return array;
    }
    function arrayEvery(array, predicate) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        if (!predicate(array[index], index, array)) {
          return false;
        }
      }
      return true;
    }
    function arrayFilter(array, predicate) {
      var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }
    function arrayIncludes(array, value) {
      var length = array == null ? 0 : array.length;
      return !!length && baseIndexOf(array, value, 0) > -1;
    }
    function arrayIncludesWith(array, value, comparator) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        if (comparator(value, array[index])) {
          return true;
        }
      }
      return false;
    }
    function arrayMap(array, iteratee) {
      var index = -1, length = array == null ? 0 : array.length, result = Array(length);
      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }
    function arrayPush(array, values) {
      var index = -1, length = values.length, offset = array.length;
      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }
    function arrayReduce(array, iteratee, accumulator, initAccum) {
      var index = -1, length = array == null ? 0 : array.length;
      if (initAccum && length) {
        accumulator = array[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }
    function arrayReduceRight(array, iteratee, accumulator, initAccum) {
      var length = array == null ? 0 : array.length;
      if (initAccum && length) {
        accumulator = array[--length];
      }
      while (length--) {
        accumulator = iteratee(accumulator, array[length], length, array);
      }
      return accumulator;
    }
    function arraySome(array, predicate) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }
    var asciiSize = baseProperty("length");
    function asciiToArray(string) {
      return string.split("");
    }
    function asciiWords(string) {
      return string.match(reAsciiWord) || [];
    }
    function baseFindKey(collection, predicate, eachFunc) {
      var result;
      eachFunc(collection, function(value, key, collection2) {
        if (predicate(value, key, collection2)) {
          result = key;
          return false;
        }
      });
      return result;
    }
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
      while (fromRight ? index-- : ++index < length) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }
    function baseIndexOf(array, value, fromIndex) {
      return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
    }
    function baseIndexOfWith(array, value, fromIndex, comparator) {
      var index = fromIndex - 1, length = array.length;
      while (++index < length) {
        if (comparator(array[index], value)) {
          return index;
        }
      }
      return -1;
    }
    function baseIsNaN(value) {
      return value !== value;
    }
    function baseMean(array, iteratee) {
      var length = array == null ? 0 : array.length;
      return length ? baseSum(array, iteratee) / length : NAN;
    }
    function baseProperty(key) {
      return function(object) {
        return object == null ? undefined2 : object[key];
      };
    }
    function basePropertyOf(object) {
      return function(key) {
        return object == null ? undefined2 : object[key];
      };
    }
    function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
      eachFunc(collection, function(value, index, collection2) {
        accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection2);
      });
      return accumulator;
    }
    function baseSortBy(array, comparer) {
      var length = array.length;
      array.sort(comparer);
      while (length--) {
        array[length] = array[length].value;
      }
      return array;
    }
    function baseSum(array, iteratee) {
      var result, index = -1, length = array.length;
      while (++index < length) {
        var current = iteratee(array[index]);
        if (current !== undefined2) {
          result = result === undefined2 ? current : result + current;
        }
      }
      return result;
    }
    function baseTimes(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    function baseToPairs(object, props) {
      return arrayMap(props, function(key) {
        return [key, object[key]];
      });
    }
    function baseTrim(string) {
      return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
    }
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
    function baseValues(object, props) {
      return arrayMap(props, function(key) {
        return object[key];
      });
    }
    function cacheHas(cache, key) {
      return cache.has(key);
    }
    function charsStartIndex(strSymbols, chrSymbols) {
      var index = -1, length = strSymbols.length;
      while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
      }
      return index;
    }
    function charsEndIndex(strSymbols, chrSymbols) {
      var index = strSymbols.length;
      while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
      }
      return index;
    }
    function countHolders(array, placeholder) {
      var length = array.length, result = 0;
      while (length--) {
        if (array[length] === placeholder) {
          ++result;
        }
      }
      return result;
    }
    var deburrLetter = basePropertyOf(deburredLetters);
    var escapeHtmlChar = basePropertyOf(htmlEscapes);
    function escapeStringChar(chr) {
      return "\\" + stringEscapes[chr];
    }
    function getValue(object, key) {
      return object == null ? undefined2 : object[key];
    }
    function hasUnicode(string) {
      return reHasUnicode.test(string);
    }
    function hasUnicodeWord(string) {
      return reHasUnicodeWord.test(string);
    }
    function iteratorToArray(iterator) {
      var data, result = [];
      while (!(data = iterator.next()).done) {
        result.push(data.value);
      }
      return result;
    }
    function mapToArray(map) {
      var index = -1, result = Array(map.size);
      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    function replaceHolders(array, placeholder) {
      var index = -1, length = array.length, resIndex = 0, result = [];
      while (++index < length) {
        var value = array[index];
        if (value === placeholder || value === PLACEHOLDER) {
          array[index] = PLACEHOLDER;
          result[resIndex++] = index;
        }
      }
      return result;
    }
    function setToArray(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }
    function setToPairs(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index] = [value, value];
      });
      return result;
    }
    function strictIndexOf(array, value, fromIndex) {
      var index = fromIndex - 1, length = array.length;
      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
    function strictLastIndexOf(array, value, fromIndex) {
      var index = fromIndex + 1;
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return index;
    }
    function stringSize(string) {
      return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
    }
    function stringToArray(string) {
      return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
    }
    function trimmedEndIndex(string) {
      var index = string.length;
      while (index-- && reWhitespace.test(string.charAt(index))) {
      }
      return index;
    }
    var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
    function unicodeSize(string) {
      var result = reUnicode.lastIndex = 0;
      while (reUnicode.test(string)) {
        ++result;
      }
      return result;
    }
    function unicodeToArray(string) {
      return string.match(reUnicode) || [];
    }
    function unicodeWords(string) {
      return string.match(reUnicodeWord) || [];
    }
    var runInContext = function runInContext2(context) {
      context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));
      var Array2 = context.Array, Date2 = context.Date, Error2 = context.Error, Function2 = context.Function, Math2 = context.Math, Object2 = context.Object, RegExp2 = context.RegExp, String2 = context.String, TypeError2 = context.TypeError;
      var arrayProto = Array2.prototype, funcProto = Function2.prototype, objectProto = Object2.prototype;
      var coreJsData = context["__core-js_shared__"];
      var funcToString = funcProto.toString;
      var hasOwnProperty = objectProto.hasOwnProperty;
      var idCounter = 0;
      var maskSrcKey = function() {
        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
        return uid ? "Symbol(src)_1." + uid : "";
      }();
      var nativeObjectToString = objectProto.toString;
      var objectCtorString = funcToString.call(Object2);
      var oldDash = root._;
      var reIsNative = RegExp2("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
      var Buffer2 = moduleExports ? context.Buffer : undefined2, Symbol2 = context.Symbol, Uint8Array2 = context.Uint8Array, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : undefined2, getPrototype = overArg(Object2.getPrototypeOf, Object2), objectCreate = Object2.create, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : undefined2, symIterator = Symbol2 ? Symbol2.iterator : undefined2, symToStringTag = Symbol2 ? Symbol2.toStringTag : undefined2;
      var defineProperty = function() {
        try {
          var func = getNative(Object2, "defineProperty");
          func({}, "", {});
          return func;
        } catch (e) {
        }
      }();
      var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout, ctxNow = Date2 && Date2.now !== root.Date.now && Date2.now, ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;
      var nativeCeil = Math2.ceil, nativeFloor = Math2.floor, nativeGetSymbols = Object2.getOwnPropertySymbols, nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : undefined2, nativeIsFinite = context.isFinite, nativeJoin = arrayProto.join, nativeKeys = overArg(Object2.keys, Object2), nativeMax = Math2.max, nativeMin = Math2.min, nativeNow = Date2.now, nativeParseInt = context.parseInt, nativeRandom = Math2.random, nativeReverse = arrayProto.reverse;
      var DataView = getNative(context, "DataView"), Map2 = getNative(context, "Map"), Promise2 = getNative(context, "Promise"), Set2 = getNative(context, "Set"), WeakMap = getNative(context, "WeakMap"), nativeCreate = getNative(Object2, "create");
      var metaMap = WeakMap && new WeakMap();
      var realNames = {};
      var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map2), promiseCtorString = toSource(Promise2), setCtorString = toSource(Set2), weakMapCtorString = toSource(WeakMap);
      var symbolProto = Symbol2 ? Symbol2.prototype : undefined2, symbolValueOf = symbolProto ? symbolProto.valueOf : undefined2, symbolToString = symbolProto ? symbolProto.toString : undefined2;
      function lodash(value) {
        if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
          if (value instanceof LodashWrapper) {
            return value;
          }
          if (hasOwnProperty.call(value, "__wrapped__")) {
            return wrapperClone(value);
          }
        }
        return new LodashWrapper(value);
      }
      var baseCreate = function() {
        function object() {
        }
        return function(proto) {
          if (!isObject(proto)) {
            return {};
          }
          if (objectCreate) {
            return objectCreate(proto);
          }
          object.prototype = proto;
          var result2 = new object();
          object.prototype = undefined2;
          return result2;
        };
      }();
      function baseLodash() {
      }
      function LodashWrapper(value, chainAll) {
        this.__wrapped__ = value;
        this.__actions__ = [];
        this.__chain__ = !!chainAll;
        this.__index__ = 0;
        this.__values__ = undefined2;
      }
      lodash.templateSettings = {
        escape: reEscape,
        evaluate: reEvaluate,
        interpolate: reInterpolate,
        variable: "",
        imports: {
          _: lodash
        }
      };
      lodash.prototype = baseLodash.prototype;
      lodash.prototype.constructor = lodash;
      LodashWrapper.prototype = baseCreate(baseLodash.prototype);
      LodashWrapper.prototype.constructor = LodashWrapper;
      function LazyWrapper(value) {
        this.__wrapped__ = value;
        this.__actions__ = [];
        this.__dir__ = 1;
        this.__filtered__ = false;
        this.__iteratees__ = [];
        this.__takeCount__ = MAX_ARRAY_LENGTH;
        this.__views__ = [];
      }
      function lazyClone() {
        var result2 = new LazyWrapper(this.__wrapped__);
        result2.__actions__ = copyArray(this.__actions__);
        result2.__dir__ = this.__dir__;
        result2.__filtered__ = this.__filtered__;
        result2.__iteratees__ = copyArray(this.__iteratees__);
        result2.__takeCount__ = this.__takeCount__;
        result2.__views__ = copyArray(this.__views__);
        return result2;
      }
      function lazyReverse() {
        if (this.__filtered__) {
          var result2 = new LazyWrapper(this);
          result2.__dir__ = -1;
          result2.__filtered__ = true;
        } else {
          result2 = this.clone();
          result2.__dir__ *= -1;
        }
        return result2;
      }
      function lazyValue() {
        var array = this.__wrapped__.value(), dir = this.__dir__, isArr = isArray(array), isRight = dir < 0, arrLength = isArr ? array.length : 0, view = getView(0, arrLength, this.__views__), start = view.start, end = view.end, length = end - start, index = isRight ? end : start - 1, iteratees = this.__iteratees__, iterLength = iteratees.length, resIndex = 0, takeCount = nativeMin(length, this.__takeCount__);
        if (!isArr || !isRight && arrLength == length && takeCount == length) {
          return baseWrapperValue(array, this.__actions__);
        }
        var result2 = [];
        outer:
          while (length-- && resIndex < takeCount) {
            index += dir;
            var iterIndex = -1, value = array[index];
            while (++iterIndex < iterLength) {
              var data = iteratees[iterIndex], iteratee2 = data.iteratee, type = data.type, computed = iteratee2(value);
              if (type == LAZY_MAP_FLAG) {
                value = computed;
              } else if (!computed) {
                if (type == LAZY_FILTER_FLAG) {
                  continue outer;
                } else {
                  break outer;
                }
              }
            }
            result2[resIndex++] = value;
          }
        return result2;
      }
      LazyWrapper.prototype = baseCreate(baseLodash.prototype);
      LazyWrapper.prototype.constructor = LazyWrapper;
      function Hash(entries) {
        var index = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function hashClear() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {};
        this.size = 0;
      }
      function hashDelete(key) {
        var result2 = this.has(key) && delete this.__data__[key];
        this.size -= result2 ? 1 : 0;
        return result2;
      }
      function hashGet(key) {
        var data = this.__data__;
        if (nativeCreate) {
          var result2 = data[key];
          return result2 === HASH_UNDEFINED ? undefined2 : result2;
        }
        return hasOwnProperty.call(data, key) ? data[key] : undefined2;
      }
      function hashHas(key) {
        var data = this.__data__;
        return nativeCreate ? data[key] !== undefined2 : hasOwnProperty.call(data, key);
      }
      function hashSet(key, value) {
        var data = this.__data__;
        this.size += this.has(key) ? 0 : 1;
        data[key] = nativeCreate && value === undefined2 ? HASH_UNDEFINED : value;
        return this;
      }
      Hash.prototype.clear = hashClear;
      Hash.prototype["delete"] = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;
      function ListCache(entries) {
        var index = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function listCacheClear() {
        this.__data__ = [];
        this.size = 0;
      }
      function listCacheDelete(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        if (index < 0) {
          return false;
        }
        var lastIndex = data.length - 1;
        if (index == lastIndex) {
          data.pop();
        } else {
          splice.call(data, index, 1);
        }
        --this.size;
        return true;
      }
      function listCacheGet(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        return index < 0 ? undefined2 : data[index][1];
      }
      function listCacheHas(key) {
        return assocIndexOf(this.__data__, key) > -1;
      }
      function listCacheSet(key, value) {
        var data = this.__data__, index = assocIndexOf(data, key);
        if (index < 0) {
          ++this.size;
          data.push([key, value]);
        } else {
          data[index][1] = value;
        }
        return this;
      }
      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype["delete"] = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;
      function MapCache(entries) {
        var index = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function mapCacheClear() {
        this.size = 0;
        this.__data__ = {
          hash: new Hash(),
          map: new (Map2 || ListCache)(),
          string: new Hash()
        };
      }
      function mapCacheDelete(key) {
        var result2 = getMapData(this, key)["delete"](key);
        this.size -= result2 ? 1 : 0;
        return result2;
      }
      function mapCacheGet(key) {
        return getMapData(this, key).get(key);
      }
      function mapCacheHas(key) {
        return getMapData(this, key).has(key);
      }
      function mapCacheSet(key, value) {
        var data = getMapData(this, key), size2 = data.size;
        data.set(key, value);
        this.size += data.size == size2 ? 0 : 1;
        return this;
      }
      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype["delete"] = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;
      function SetCache(values2) {
        var index = -1, length = values2 == null ? 0 : values2.length;
        this.__data__ = new MapCache();
        while (++index < length) {
          this.add(values2[index]);
        }
      }
      function setCacheAdd(value) {
        this.__data__.set(value, HASH_UNDEFINED);
        return this;
      }
      function setCacheHas(value) {
        return this.__data__.has(value);
      }
      SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
      SetCache.prototype.has = setCacheHas;
      function Stack(entries) {
        var data = this.__data__ = new ListCache(entries);
        this.size = data.size;
      }
      function stackClear() {
        this.__data__ = new ListCache();
        this.size = 0;
      }
      function stackDelete(key) {
        var data = this.__data__, result2 = data["delete"](key);
        this.size = data.size;
        return result2;
      }
      function stackGet(key) {
        return this.__data__.get(key);
      }
      function stackHas(key) {
        return this.__data__.has(key);
      }
      function stackSet(key, value) {
        var data = this.__data__;
        if (data instanceof ListCache) {
          var pairs = data.__data__;
          if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
            pairs.push([key, value]);
            this.size = ++data.size;
            return this;
          }
          data = this.__data__ = new MapCache(pairs);
        }
        data.set(key, value);
        this.size = data.size;
        return this;
      }
      Stack.prototype.clear = stackClear;
      Stack.prototype["delete"] = stackDelete;
      Stack.prototype.get = stackGet;
      Stack.prototype.has = stackHas;
      Stack.prototype.set = stackSet;
      function arrayLikeKeys(value, inherited) {
        var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result2 = skipIndexes ? baseTimes(value.length, String2) : [], length = result2.length;
        for (var key in value) {
          if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) {
            result2.push(key);
          }
        }
        return result2;
      }
      function arraySample(array) {
        var length = array.length;
        return length ? array[baseRandom(0, length - 1)] : undefined2;
      }
      function arraySampleSize(array, n) {
        return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
      }
      function arrayShuffle(array) {
        return shuffleSelf(copyArray(array));
      }
      function assignMergeValue(object, key, value) {
        if (value !== undefined2 && !eq(object[key], value) || value === undefined2 && !(key in object)) {
          baseAssignValue(object, key, value);
        }
      }
      function assignValue(object, key, value) {
        var objValue = object[key];
        if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined2 && !(key in object)) {
          baseAssignValue(object, key, value);
        }
      }
      function assocIndexOf(array, key) {
        var length = array.length;
        while (length--) {
          if (eq(array[length][0], key)) {
            return length;
          }
        }
        return -1;
      }
      function baseAggregator(collection, setter, iteratee2, accumulator) {
        baseEach(collection, function(value, key, collection2) {
          setter(accumulator, value, iteratee2(value), collection2);
        });
        return accumulator;
      }
      function baseAssign(object, source) {
        return object && copyObject(source, keys(source), object);
      }
      function baseAssignIn(object, source) {
        return object && copyObject(source, keysIn(source), object);
      }
      function baseAssignValue(object, key, value) {
        if (key == "__proto__" && defineProperty) {
          defineProperty(object, key, {
            configurable: true,
            enumerable: true,
            value,
            writable: true
          });
        } else {
          object[key] = value;
        }
      }
      function baseAt(object, paths) {
        var index = -1, length = paths.length, result2 = Array2(length), skip = object == null;
        while (++index < length) {
          result2[index] = skip ? undefined2 : get(object, paths[index]);
        }
        return result2;
      }
      function baseClamp(number, lower, upper) {
        if (number === number) {
          if (upper !== undefined2) {
            number = number <= upper ? number : upper;
          }
          if (lower !== undefined2) {
            number = number >= lower ? number : lower;
          }
        }
        return number;
      }
      function baseClone(value, bitmask, customizer, key, object, stack) {
        var result2, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
        if (customizer) {
          result2 = object ? customizer(value, key, object, stack) : customizer(value);
        }
        if (result2 !== undefined2) {
          return result2;
        }
        if (!isObject(value)) {
          return value;
        }
        var isArr = isArray(value);
        if (isArr) {
          result2 = initCloneArray(value);
          if (!isDeep) {
            return copyArray(value, result2);
          }
        } else {
          var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
          if (isBuffer(value)) {
            return cloneBuffer(value, isDeep);
          }
          if (tag == objectTag || tag == argsTag || isFunc && !object) {
            result2 = isFlat || isFunc ? {} : initCloneObject(value);
            if (!isDeep) {
              return isFlat ? copySymbolsIn(value, baseAssignIn(result2, value)) : copySymbols(value, baseAssign(result2, value));
            }
          } else {
            if (!cloneableTags[tag]) {
              return object ? value : {};
            }
            result2 = initCloneByTag(value, tag, isDeep);
          }
        }
        stack || (stack = new Stack());
        var stacked = stack.get(value);
        if (stacked) {
          return stacked;
        }
        stack.set(value, result2);
        if (isSet(value)) {
          value.forEach(function(subValue) {
            result2.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
          });
        } else if (isMap(value)) {
          value.forEach(function(subValue, key2) {
            result2.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
          });
        }
        var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
        var props = isArr ? undefined2 : keysFunc(value);
        arrayEach(props || value, function(subValue, key2) {
          if (props) {
            key2 = subValue;
            subValue = value[key2];
          }
          assignValue(result2, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
        });
        return result2;
      }
      function baseConforms(source) {
        var props = keys(source);
        return function(object) {
          return baseConformsTo(object, source, props);
        };
      }
      function baseConformsTo(object, source, props) {
        var length = props.length;
        if (object == null) {
          return !length;
        }
        object = Object2(object);
        while (length--) {
          var key = props[length], predicate = source[key], value = object[key];
          if (value === undefined2 && !(key in object) || !predicate(value)) {
            return false;
          }
        }
        return true;
      }
      function baseDelay(func, wait, args) {
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        return setTimeout(function() {
          func.apply(undefined2, args);
        }, wait);
      }
      function baseDifference(array, values2, iteratee2, comparator) {
        var index = -1, includes2 = arrayIncludes, isCommon = true, length = array.length, result2 = [], valuesLength = values2.length;
        if (!length) {
          return result2;
        }
        if (iteratee2) {
          values2 = arrayMap(values2, baseUnary(iteratee2));
        }
        if (comparator) {
          includes2 = arrayIncludesWith;
          isCommon = false;
        } else if (values2.length >= LARGE_ARRAY_SIZE) {
          includes2 = cacheHas;
          isCommon = false;
          values2 = new SetCache(values2);
        }
        outer:
          while (++index < length) {
            var value = array[index], computed = iteratee2 == null ? value : iteratee2(value);
            value = comparator || value !== 0 ? value : 0;
            if (isCommon && computed === computed) {
              var valuesIndex = valuesLength;
              while (valuesIndex--) {
                if (values2[valuesIndex] === computed) {
                  continue outer;
                }
              }
              result2.push(value);
            } else if (!includes2(values2, computed, comparator)) {
              result2.push(value);
            }
          }
        return result2;
      }
      var baseEach = createBaseEach(baseForOwn);
      var baseEachRight = createBaseEach(baseForOwnRight, true);
      function baseEvery(collection, predicate) {
        var result2 = true;
        baseEach(collection, function(value, index, collection2) {
          result2 = !!predicate(value, index, collection2);
          return result2;
        });
        return result2;
      }
      function baseExtremum(array, iteratee2, comparator) {
        var index = -1, length = array.length;
        while (++index < length) {
          var value = array[index], current = iteratee2(value);
          if (current != null && (computed === undefined2 ? current === current && !isSymbol(current) : comparator(current, computed))) {
            var computed = current, result2 = value;
          }
        }
        return result2;
      }
      function baseFill(array, value, start, end) {
        var length = array.length;
        start = toInteger(start);
        if (start < 0) {
          start = -start > length ? 0 : length + start;
        }
        end = end === undefined2 || end > length ? length : toInteger(end);
        if (end < 0) {
          end += length;
        }
        end = start > end ? 0 : toLength(end);
        while (start < end) {
          array[start++] = value;
        }
        return array;
      }
      function baseFilter(collection, predicate) {
        var result2 = [];
        baseEach(collection, function(value, index, collection2) {
          if (predicate(value, index, collection2)) {
            result2.push(value);
          }
        });
        return result2;
      }
      function baseFlatten(array, depth, predicate, isStrict, result2) {
        var index = -1, length = array.length;
        predicate || (predicate = isFlattenable);
        result2 || (result2 = []);
        while (++index < length) {
          var value = array[index];
          if (depth > 0 && predicate(value)) {
            if (depth > 1) {
              baseFlatten(value, depth - 1, predicate, isStrict, result2);
            } else {
              arrayPush(result2, value);
            }
          } else if (!isStrict) {
            result2[result2.length] = value;
          }
        }
        return result2;
      }
      var baseFor = createBaseFor();
      var baseForRight = createBaseFor(true);
      function baseForOwn(object, iteratee2) {
        return object && baseFor(object, iteratee2, keys);
      }
      function baseForOwnRight(object, iteratee2) {
        return object && baseForRight(object, iteratee2, keys);
      }
      function baseFunctions(object, props) {
        return arrayFilter(props, function(key) {
          return isFunction(object[key]);
        });
      }
      function baseGet(object, path2) {
        path2 = castPath(path2, object);
        var index = 0, length = path2.length;
        while (object != null && index < length) {
          object = object[toKey(path2[index++])];
        }
        return index && index == length ? object : undefined2;
      }
      function baseGetAllKeys(object, keysFunc, symbolsFunc) {
        var result2 = keysFunc(object);
        return isArray(object) ? result2 : arrayPush(result2, symbolsFunc(object));
      }
      function baseGetTag(value) {
        if (value == null) {
          return value === undefined2 ? undefinedTag : nullTag;
        }
        return symToStringTag && symToStringTag in Object2(value) ? getRawTag(value) : objectToString(value);
      }
      function baseGt(value, other) {
        return value > other;
      }
      function baseHas(object, key) {
        return object != null && hasOwnProperty.call(object, key);
      }
      function baseHasIn(object, key) {
        return object != null && key in Object2(object);
      }
      function baseInRange(number, start, end) {
        return number >= nativeMin(start, end) && number < nativeMax(start, end);
      }
      function baseIntersection(arrays, iteratee2, comparator) {
        var includes2 = comparator ? arrayIncludesWith : arrayIncludes, length = arrays[0].length, othLength = arrays.length, othIndex = othLength, caches = Array2(othLength), maxLength = Infinity, result2 = [];
        while (othIndex--) {
          var array = arrays[othIndex];
          if (othIndex && iteratee2) {
            array = arrayMap(array, baseUnary(iteratee2));
          }
          maxLength = nativeMin(array.length, maxLength);
          caches[othIndex] = !comparator && (iteratee2 || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined2;
        }
        array = arrays[0];
        var index = -1, seen = caches[0];
        outer:
          while (++index < length && result2.length < maxLength) {
            var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
            value = comparator || value !== 0 ? value : 0;
            if (!(seen ? cacheHas(seen, computed) : includes2(result2, computed, comparator))) {
              othIndex = othLength;
              while (--othIndex) {
                var cache = caches[othIndex];
                if (!(cache ? cacheHas(cache, computed) : includes2(arrays[othIndex], computed, comparator))) {
                  continue outer;
                }
              }
              if (seen) {
                seen.push(computed);
              }
              result2.push(value);
            }
          }
        return result2;
      }
      function baseInverter(object, setter, iteratee2, accumulator) {
        baseForOwn(object, function(value, key, object2) {
          setter(accumulator, iteratee2(value), key, object2);
        });
        return accumulator;
      }
      function baseInvoke(object, path2, args) {
        path2 = castPath(path2, object);
        object = parent(object, path2);
        var func = object == null ? object : object[toKey(last(path2))];
        return func == null ? undefined2 : apply(func, object, args);
      }
      function baseIsArguments(value) {
        return isObjectLike(value) && baseGetTag(value) == argsTag;
      }
      function baseIsArrayBuffer(value) {
        return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
      }
      function baseIsDate(value) {
        return isObjectLike(value) && baseGetTag(value) == dateTag;
      }
      function baseIsEqual(value, other, bitmask, customizer, stack) {
        if (value === other) {
          return true;
        }
        if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
          return value !== value && other !== other;
        }
        return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
      }
      function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
        var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
        objTag = objTag == argsTag ? objectTag : objTag;
        othTag = othTag == argsTag ? objectTag : othTag;
        var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
        if (isSameTag && isBuffer(object)) {
          if (!isBuffer(other)) {
            return false;
          }
          objIsArr = true;
          objIsObj = false;
        }
        if (isSameTag && !objIsObj) {
          stack || (stack = new Stack());
          return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
        }
        if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
          var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
          if (objIsWrapped || othIsWrapped) {
            var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
            stack || (stack = new Stack());
            return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
          }
        }
        if (!isSameTag) {
          return false;
        }
        stack || (stack = new Stack());
        return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
      }
      function baseIsMap(value) {
        return isObjectLike(value) && getTag(value) == mapTag;
      }
      function baseIsMatch(object, source, matchData, customizer) {
        var index = matchData.length, length = index, noCustomizer = !customizer;
        if (object == null) {
          return !length;
        }
        object = Object2(object);
        while (index--) {
          var data = matchData[index];
          if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
            return false;
          }
        }
        while (++index < length) {
          data = matchData[index];
          var key = data[0], objValue = object[key], srcValue = data[1];
          if (noCustomizer && data[2]) {
            if (objValue === undefined2 && !(key in object)) {
              return false;
            }
          } else {
            var stack = new Stack();
            if (customizer) {
              var result2 = customizer(objValue, srcValue, key, object, source, stack);
            }
            if (!(result2 === undefined2 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result2)) {
              return false;
            }
          }
        }
        return true;
      }
      function baseIsNative(value) {
        if (!isObject(value) || isMasked(value)) {
          return false;
        }
        var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
      }
      function baseIsRegExp(value) {
        return isObjectLike(value) && baseGetTag(value) == regexpTag;
      }
      function baseIsSet(value) {
        return isObjectLike(value) && getTag(value) == setTag;
      }
      function baseIsTypedArray(value) {
        return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
      }
      function baseIteratee(value) {
        if (typeof value == "function") {
          return value;
        }
        if (value == null) {
          return identity;
        }
        if (typeof value == "object") {
          return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
        }
        return property(value);
      }
      function baseKeys(object) {
        if (!isPrototype(object)) {
          return nativeKeys(object);
        }
        var result2 = [];
        for (var key in Object2(object)) {
          if (hasOwnProperty.call(object, key) && key != "constructor") {
            result2.push(key);
          }
        }
        return result2;
      }
      function baseKeysIn(object) {
        if (!isObject(object)) {
          return nativeKeysIn(object);
        }
        var isProto = isPrototype(object), result2 = [];
        for (var key in object) {
          if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
            result2.push(key);
          }
        }
        return result2;
      }
      function baseLt(value, other) {
        return value < other;
      }
      function baseMap(collection, iteratee2) {
        var index = -1, result2 = isArrayLike(collection) ? Array2(collection.length) : [];
        baseEach(collection, function(value, key, collection2) {
          result2[++index] = iteratee2(value, key, collection2);
        });
        return result2;
      }
      function baseMatches(source) {
        var matchData = getMatchData(source);
        if (matchData.length == 1 && matchData[0][2]) {
          return matchesStrictComparable(matchData[0][0], matchData[0][1]);
        }
        return function(object) {
          return object === source || baseIsMatch(object, source, matchData);
        };
      }
      function baseMatchesProperty(path2, srcValue) {
        if (isKey(path2) && isStrictComparable(srcValue)) {
          return matchesStrictComparable(toKey(path2), srcValue);
        }
        return function(object) {
          var objValue = get(object, path2);
          return objValue === undefined2 && objValue === srcValue ? hasIn(object, path2) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
        };
      }
      function baseMerge(object, source, srcIndex, customizer, stack) {
        if (object === source) {
          return;
        }
        baseFor(source, function(srcValue, key) {
          stack || (stack = new Stack());
          if (isObject(srcValue)) {
            baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
          } else {
            var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : undefined2;
            if (newValue === undefined2) {
              newValue = srcValue;
            }
            assignMergeValue(object, key, newValue);
          }
        }, keysIn);
      }
      function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
        var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
        if (stacked) {
          assignMergeValue(object, key, stacked);
          return;
        }
        var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : undefined2;
        var isCommon = newValue === undefined2;
        if (isCommon) {
          var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
          newValue = srcValue;
          if (isArr || isBuff || isTyped) {
            if (isArray(objValue)) {
              newValue = objValue;
            } else if (isArrayLikeObject(objValue)) {
              newValue = copyArray(objValue);
            } else if (isBuff) {
              isCommon = false;
              newValue = cloneBuffer(srcValue, true);
            } else if (isTyped) {
              isCommon = false;
              newValue = cloneTypedArray(srcValue, true);
            } else {
              newValue = [];
            }
          } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
            newValue = objValue;
            if (isArguments(objValue)) {
              newValue = toPlainObject(objValue);
            } else if (!isObject(objValue) || isFunction(objValue)) {
              newValue = initCloneObject(srcValue);
            }
          } else {
            isCommon = false;
          }
        }
        if (isCommon) {
          stack.set(srcValue, newValue);
          mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
          stack["delete"](srcValue);
        }
        assignMergeValue(object, key, newValue);
      }
      function baseNth(array, n) {
        var length = array.length;
        if (!length) {
          return;
        }
        n += n < 0 ? length : 0;
        return isIndex(n, length) ? array[n] : undefined2;
      }
      function baseOrderBy(collection, iteratees, orders) {
        if (iteratees.length) {
          iteratees = arrayMap(iteratees, function(iteratee2) {
            if (isArray(iteratee2)) {
              return function(value) {
                return baseGet(value, iteratee2.length === 1 ? iteratee2[0] : iteratee2);
              };
            }
            return iteratee2;
          });
        } else {
          iteratees = [identity];
        }
        var index = -1;
        iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
        var result2 = baseMap(collection, function(value, key, collection2) {
          var criteria = arrayMap(iteratees, function(iteratee2) {
            return iteratee2(value);
          });
          return {criteria, index: ++index, value};
        });
        return baseSortBy(result2, function(object, other) {
          return compareMultiple(object, other, orders);
        });
      }
      function basePick(object, paths) {
        return basePickBy(object, paths, function(value, path2) {
          return hasIn(object, path2);
        });
      }
      function basePickBy(object, paths, predicate) {
        var index = -1, length = paths.length, result2 = {};
        while (++index < length) {
          var path2 = paths[index], value = baseGet(object, path2);
          if (predicate(value, path2)) {
            baseSet(result2, castPath(path2, object), value);
          }
        }
        return result2;
      }
      function basePropertyDeep(path2) {
        return function(object) {
          return baseGet(object, path2);
        };
      }
      function basePullAll(array, values2, iteratee2, comparator) {
        var indexOf2 = comparator ? baseIndexOfWith : baseIndexOf, index = -1, length = values2.length, seen = array;
        if (array === values2) {
          values2 = copyArray(values2);
        }
        if (iteratee2) {
          seen = arrayMap(array, baseUnary(iteratee2));
        }
        while (++index < length) {
          var fromIndex = 0, value = values2[index], computed = iteratee2 ? iteratee2(value) : value;
          while ((fromIndex = indexOf2(seen, computed, fromIndex, comparator)) > -1) {
            if (seen !== array) {
              splice.call(seen, fromIndex, 1);
            }
            splice.call(array, fromIndex, 1);
          }
        }
        return array;
      }
      function basePullAt(array, indexes) {
        var length = array ? indexes.length : 0, lastIndex = length - 1;
        while (length--) {
          var index = indexes[length];
          if (length == lastIndex || index !== previous) {
            var previous = index;
            if (isIndex(index)) {
              splice.call(array, index, 1);
            } else {
              baseUnset(array, index);
            }
          }
        }
        return array;
      }
      function baseRandom(lower, upper) {
        return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
      }
      function baseRange(start, end, step, fromRight) {
        var index = -1, length = nativeMax(nativeCeil((end - start) / (step || 1)), 0), result2 = Array2(length);
        while (length--) {
          result2[fromRight ? length : ++index] = start;
          start += step;
        }
        return result2;
      }
      function baseRepeat(string, n) {
        var result2 = "";
        if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
          return result2;
        }
        do {
          if (n % 2) {
            result2 += string;
          }
          n = nativeFloor(n / 2);
          if (n) {
            string += string;
          }
        } while (n);
        return result2;
      }
      function baseRest(func, start) {
        return setToString(overRest(func, start, identity), func + "");
      }
      function baseSample(collection) {
        return arraySample(values(collection));
      }
      function baseSampleSize(collection, n) {
        var array = values(collection);
        return shuffleSelf(array, baseClamp(n, 0, array.length));
      }
      function baseSet(object, path2, value, customizer) {
        if (!isObject(object)) {
          return object;
        }
        path2 = castPath(path2, object);
        var index = -1, length = path2.length, lastIndex = length - 1, nested = object;
        while (nested != null && ++index < length) {
          var key = toKey(path2[index]), newValue = value;
          if (key === "__proto__" || key === "constructor" || key === "prototype") {
            return object;
          }
          if (index != lastIndex) {
            var objValue = nested[key];
            newValue = customizer ? customizer(objValue, key, nested) : undefined2;
            if (newValue === undefined2) {
              newValue = isObject(objValue) ? objValue : isIndex(path2[index + 1]) ? [] : {};
            }
          }
          assignValue(nested, key, newValue);
          nested = nested[key];
        }
        return object;
      }
      var baseSetData = !metaMap ? identity : function(func, data) {
        metaMap.set(func, data);
        return func;
      };
      var baseSetToString = !defineProperty ? identity : function(func, string) {
        return defineProperty(func, "toString", {
          configurable: true,
          enumerable: false,
          value: constant(string),
          writable: true
        });
      };
      function baseShuffle(collection) {
        return shuffleSelf(values(collection));
      }
      function baseSlice(array, start, end) {
        var index = -1, length = array.length;
        if (start < 0) {
          start = -start > length ? 0 : length + start;
        }
        end = end > length ? length : end;
        if (end < 0) {
          end += length;
        }
        length = start > end ? 0 : end - start >>> 0;
        start >>>= 0;
        var result2 = Array2(length);
        while (++index < length) {
          result2[index] = array[index + start];
        }
        return result2;
      }
      function baseSome(collection, predicate) {
        var result2;
        baseEach(collection, function(value, index, collection2) {
          result2 = predicate(value, index, collection2);
          return !result2;
        });
        return !!result2;
      }
      function baseSortedIndex(array, value, retHighest) {
        var low = 0, high = array == null ? low : array.length;
        if (typeof value == "number" && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
          while (low < high) {
            var mid = low + high >>> 1, computed = array[mid];
            if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) {
              low = mid + 1;
            } else {
              high = mid;
            }
          }
          return high;
        }
        return baseSortedIndexBy(array, value, identity, retHighest);
      }
      function baseSortedIndexBy(array, value, iteratee2, retHighest) {
        var low = 0, high = array == null ? 0 : array.length;
        if (high === 0) {
          return 0;
        }
        value = iteratee2(value);
        var valIsNaN = value !== value, valIsNull = value === null, valIsSymbol = isSymbol(value), valIsUndefined = value === undefined2;
        while (low < high) {
          var mid = nativeFloor((low + high) / 2), computed = iteratee2(array[mid]), othIsDefined = computed !== undefined2, othIsNull = computed === null, othIsReflexive = computed === computed, othIsSymbol = isSymbol(computed);
          if (valIsNaN) {
            var setLow = retHighest || othIsReflexive;
          } else if (valIsUndefined) {
            setLow = othIsReflexive && (retHighest || othIsDefined);
          } else if (valIsNull) {
            setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
          } else if (valIsSymbol) {
            setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
          } else if (othIsNull || othIsSymbol) {
            setLow = false;
          } else {
            setLow = retHighest ? computed <= value : computed < value;
          }
          if (setLow) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return nativeMin(high, MAX_ARRAY_INDEX);
      }
      function baseSortedUniq(array, iteratee2) {
        var index = -1, length = array.length, resIndex = 0, result2 = [];
        while (++index < length) {
          var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
          if (!index || !eq(computed, seen)) {
            var seen = computed;
            result2[resIndex++] = value === 0 ? 0 : value;
          }
        }
        return result2;
      }
      function baseToNumber(value) {
        if (typeof value == "number") {
          return value;
        }
        if (isSymbol(value)) {
          return NAN;
        }
        return +value;
      }
      function baseToString(value) {
        if (typeof value == "string") {
          return value;
        }
        if (isArray(value)) {
          return arrayMap(value, baseToString) + "";
        }
        if (isSymbol(value)) {
          return symbolToString ? symbolToString.call(value) : "";
        }
        var result2 = value + "";
        return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
      }
      function baseUniq(array, iteratee2, comparator) {
        var index = -1, includes2 = arrayIncludes, length = array.length, isCommon = true, result2 = [], seen = result2;
        if (comparator) {
          isCommon = false;
          includes2 = arrayIncludesWith;
        } else if (length >= LARGE_ARRAY_SIZE) {
          var set2 = iteratee2 ? null : createSet(array);
          if (set2) {
            return setToArray(set2);
          }
          isCommon = false;
          includes2 = cacheHas;
          seen = new SetCache();
        } else {
          seen = iteratee2 ? [] : result2;
        }
        outer:
          while (++index < length) {
            var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
            value = comparator || value !== 0 ? value : 0;
            if (isCommon && computed === computed) {
              var seenIndex = seen.length;
              while (seenIndex--) {
                if (seen[seenIndex] === computed) {
                  continue outer;
                }
              }
              if (iteratee2) {
                seen.push(computed);
              }
              result2.push(value);
            } else if (!includes2(seen, computed, comparator)) {
              if (seen !== result2) {
                seen.push(computed);
              }
              result2.push(value);
            }
          }
        return result2;
      }
      function baseUnset(object, path2) {
        path2 = castPath(path2, object);
        object = parent(object, path2);
        return object == null || delete object[toKey(last(path2))];
      }
      function baseUpdate(object, path2, updater, customizer) {
        return baseSet(object, path2, updater(baseGet(object, path2)), customizer);
      }
      function baseWhile(array, predicate, isDrop, fromRight) {
        var length = array.length, index = fromRight ? length : -1;
        while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {
        }
        return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
      }
      function baseWrapperValue(value, actions) {
        var result2 = value;
        if (result2 instanceof LazyWrapper) {
          result2 = result2.value();
        }
        return arrayReduce(actions, function(result3, action) {
          return action.func.apply(action.thisArg, arrayPush([result3], action.args));
        }, result2);
      }
      function baseXor(arrays, iteratee2, comparator) {
        var length = arrays.length;
        if (length < 2) {
          return length ? baseUniq(arrays[0]) : [];
        }
        var index = -1, result2 = Array2(length);
        while (++index < length) {
          var array = arrays[index], othIndex = -1;
          while (++othIndex < length) {
            if (othIndex != index) {
              result2[index] = baseDifference(result2[index] || array, arrays[othIndex], iteratee2, comparator);
            }
          }
        }
        return baseUniq(baseFlatten(result2, 1), iteratee2, comparator);
      }
      function baseZipObject(props, values2, assignFunc) {
        var index = -1, length = props.length, valsLength = values2.length, result2 = {};
        while (++index < length) {
          var value = index < valsLength ? values2[index] : undefined2;
          assignFunc(result2, props[index], value);
        }
        return result2;
      }
      function castArrayLikeObject(value) {
        return isArrayLikeObject(value) ? value : [];
      }
      function castFunction(value) {
        return typeof value == "function" ? value : identity;
      }
      function castPath(value, object) {
        if (isArray(value)) {
          return value;
        }
        return isKey(value, object) ? [value] : stringToPath(toString(value));
      }
      var castRest = baseRest;
      function castSlice(array, start, end) {
        var length = array.length;
        end = end === undefined2 ? length : end;
        return !start && end >= length ? array : baseSlice(array, start, end);
      }
      var clearTimeout = ctxClearTimeout || function(id) {
        return root.clearTimeout(id);
      };
      function cloneBuffer(buffer, isDeep) {
        if (isDeep) {
          return buffer.slice();
        }
        var length = buffer.length, result2 = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
        buffer.copy(result2);
        return result2;
      }
      function cloneArrayBuffer(arrayBuffer) {
        var result2 = new arrayBuffer.constructor(arrayBuffer.byteLength);
        new Uint8Array2(result2).set(new Uint8Array2(arrayBuffer));
        return result2;
      }
      function cloneDataView(dataView, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
        return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
      }
      function cloneRegExp(regexp) {
        var result2 = new regexp.constructor(regexp.source, reFlags.exec(regexp));
        result2.lastIndex = regexp.lastIndex;
        return result2;
      }
      function cloneSymbol(symbol) {
        return symbolValueOf ? Object2(symbolValueOf.call(symbol)) : {};
      }
      function cloneTypedArray(typedArray, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
        return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
      }
      function compareAscending(value, other) {
        if (value !== other) {
          var valIsDefined = value !== undefined2, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
          var othIsDefined = other !== undefined2, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
          if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
            return 1;
          }
          if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
            return -1;
          }
        }
        return 0;
      }
      function compareMultiple(object, other, orders) {
        var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
        while (++index < length) {
          var result2 = compareAscending(objCriteria[index], othCriteria[index]);
          if (result2) {
            if (index >= ordersLength) {
              return result2;
            }
            var order = orders[index];
            return result2 * (order == "desc" ? -1 : 1);
          }
        }
        return object.index - other.index;
      }
      function composeArgs(args, partials, holders, isCurried) {
        var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(leftLength + rangeLength), isUncurried = !isCurried;
        while (++leftIndex < leftLength) {
          result2[leftIndex] = partials[leftIndex];
        }
        while (++argsIndex < holdersLength) {
          if (isUncurried || argsIndex < argsLength) {
            result2[holders[argsIndex]] = args[argsIndex];
          }
        }
        while (rangeLength--) {
          result2[leftIndex++] = args[argsIndex++];
        }
        return result2;
      }
      function composeArgsRight(args, partials, holders, isCurried) {
        var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(rangeLength + rightLength), isUncurried = !isCurried;
        while (++argsIndex < rangeLength) {
          result2[argsIndex] = args[argsIndex];
        }
        var offset = argsIndex;
        while (++rightIndex < rightLength) {
          result2[offset + rightIndex] = partials[rightIndex];
        }
        while (++holdersIndex < holdersLength) {
          if (isUncurried || argsIndex < argsLength) {
            result2[offset + holders[holdersIndex]] = args[argsIndex++];
          }
        }
        return result2;
      }
      function copyArray(source, array) {
        var index = -1, length = source.length;
        array || (array = Array2(length));
        while (++index < length) {
          array[index] = source[index];
        }
        return array;
      }
      function copyObject(source, props, object, customizer) {
        var isNew = !object;
        object || (object = {});
        var index = -1, length = props.length;
        while (++index < length) {
          var key = props[index];
          var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined2;
          if (newValue === undefined2) {
            newValue = source[key];
          }
          if (isNew) {
            baseAssignValue(object, key, newValue);
          } else {
            assignValue(object, key, newValue);
          }
        }
        return object;
      }
      function copySymbols(source, object) {
        return copyObject(source, getSymbols(source), object);
      }
      function copySymbolsIn(source, object) {
        return copyObject(source, getSymbolsIn(source), object);
      }
      function createAggregator(setter, initializer) {
        return function(collection, iteratee2) {
          var func = isArray(collection) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
          return func(collection, setter, getIteratee(iteratee2, 2), accumulator);
        };
      }
      function createAssigner(assigner) {
        return baseRest(function(object, sources) {
          var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : undefined2, guard = length > 2 ? sources[2] : undefined2;
          customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : undefined2;
          if (guard && isIterateeCall(sources[0], sources[1], guard)) {
            customizer = length < 3 ? undefined2 : customizer;
            length = 1;
          }
          object = Object2(object);
          while (++index < length) {
            var source = sources[index];
            if (source) {
              assigner(object, source, index, customizer);
            }
          }
          return object;
        });
      }
      function createBaseEach(eachFunc, fromRight) {
        return function(collection, iteratee2) {
          if (collection == null) {
            return collection;
          }
          if (!isArrayLike(collection)) {
            return eachFunc(collection, iteratee2);
          }
          var length = collection.length, index = fromRight ? length : -1, iterable = Object2(collection);
          while (fromRight ? index-- : ++index < length) {
            if (iteratee2(iterable[index], index, iterable) === false) {
              break;
            }
          }
          return collection;
        };
      }
      function createBaseFor(fromRight) {
        return function(object, iteratee2, keysFunc) {
          var index = -1, iterable = Object2(object), props = keysFunc(object), length = props.length;
          while (length--) {
            var key = props[fromRight ? length : ++index];
            if (iteratee2(iterable[key], key, iterable) === false) {
              break;
            }
          }
          return object;
        };
      }
      function createBind(func, bitmask, thisArg) {
        var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
        function wrapper() {
          var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
          return fn.apply(isBind ? thisArg : this, arguments);
        }
        return wrapper;
      }
      function createCaseFirst(methodName) {
        return function(string) {
          string = toString(string);
          var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined2;
          var chr = strSymbols ? strSymbols[0] : string.charAt(0);
          var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
          return chr[methodName]() + trailing;
        };
      }
      function createCompounder(callback) {
        return function(string) {
          return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
        };
      }
      function createCtor(Ctor) {
        return function() {
          var args = arguments;
          switch (args.length) {
            case 0:
              return new Ctor();
            case 1:
              return new Ctor(args[0]);
            case 2:
              return new Ctor(args[0], args[1]);
            case 3:
              return new Ctor(args[0], args[1], args[2]);
            case 4:
              return new Ctor(args[0], args[1], args[2], args[3]);
            case 5:
              return new Ctor(args[0], args[1], args[2], args[3], args[4]);
            case 6:
              return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
            case 7:
              return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
          }
          var thisBinding = baseCreate(Ctor.prototype), result2 = Ctor.apply(thisBinding, args);
          return isObject(result2) ? result2 : thisBinding;
        };
      }
      function createCurry(func, bitmask, arity) {
        var Ctor = createCtor(func);
        function wrapper() {
          var length = arguments.length, args = Array2(length), index = length, placeholder = getHolder(wrapper);
          while (index--) {
            args[index] = arguments[index];
          }
          var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
          length -= holders.length;
          if (length < arity) {
            return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, undefined2, args, holders, undefined2, undefined2, arity - length);
          }
          var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
          return apply(fn, this, args);
        }
        return wrapper;
      }
      function createFind(findIndexFunc) {
        return function(collection, predicate, fromIndex) {
          var iterable = Object2(collection);
          if (!isArrayLike(collection)) {
            var iteratee2 = getIteratee(predicate, 3);
            collection = keys(collection);
            predicate = function(key) {
              return iteratee2(iterable[key], key, iterable);
            };
          }
          var index = findIndexFunc(collection, predicate, fromIndex);
          return index > -1 ? iterable[iteratee2 ? collection[index] : index] : undefined2;
        };
      }
      function createFlow(fromRight) {
        return flatRest(function(funcs) {
          var length = funcs.length, index = length, prereq = LodashWrapper.prototype.thru;
          if (fromRight) {
            funcs.reverse();
          }
          while (index--) {
            var func = funcs[index];
            if (typeof func != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            if (prereq && !wrapper && getFuncName(func) == "wrapper") {
              var wrapper = new LodashWrapper([], true);
            }
          }
          index = wrapper ? index : length;
          while (++index < length) {
            func = funcs[index];
            var funcName = getFuncName(func), data = funcName == "wrapper" ? getData(func) : undefined2;
            if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) && !data[4].length && data[9] == 1) {
              wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
            } else {
              wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
            }
          }
          return function() {
            var args = arguments, value = args[0];
            if (wrapper && args.length == 1 && isArray(value)) {
              return wrapper.plant(value).value();
            }
            var index2 = 0, result2 = length ? funcs[index2].apply(this, args) : value;
            while (++index2 < length) {
              result2 = funcs[index2].call(this, result2);
            }
            return result2;
          };
        });
      }
      function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary2, arity) {
        var isAry = bitmask & WRAP_ARY_FLAG, isBind = bitmask & WRAP_BIND_FLAG, isBindKey = bitmask & WRAP_BIND_KEY_FLAG, isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG), isFlip = bitmask & WRAP_FLIP_FLAG, Ctor = isBindKey ? undefined2 : createCtor(func);
        function wrapper() {
          var length = arguments.length, args = Array2(length), index = length;
          while (index--) {
            args[index] = arguments[index];
          }
          if (isCurried) {
            var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
          }
          if (partials) {
            args = composeArgs(args, partials, holders, isCurried);
          }
          if (partialsRight) {
            args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
          }
          length -= holdersCount;
          if (isCurried && length < arity) {
            var newHolders = replaceHolders(args, placeholder);
            return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, thisArg, args, newHolders, argPos, ary2, arity - length);
          }
          var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func] : func;
          length = args.length;
          if (argPos) {
            args = reorder(args, argPos);
          } else if (isFlip && length > 1) {
            args.reverse();
          }
          if (isAry && ary2 < length) {
            args.length = ary2;
          }
          if (this && this !== root && this instanceof wrapper) {
            fn = Ctor || createCtor(fn);
          }
          return fn.apply(thisBinding, args);
        }
        return wrapper;
      }
      function createInverter(setter, toIteratee) {
        return function(object, iteratee2) {
          return baseInverter(object, setter, toIteratee(iteratee2), {});
        };
      }
      function createMathOperation(operator, defaultValue) {
        return function(value, other) {
          var result2;
          if (value === undefined2 && other === undefined2) {
            return defaultValue;
          }
          if (value !== undefined2) {
            result2 = value;
          }
          if (other !== undefined2) {
            if (result2 === undefined2) {
              return other;
            }
            if (typeof value == "string" || typeof other == "string") {
              value = baseToString(value);
              other = baseToString(other);
            } else {
              value = baseToNumber(value);
              other = baseToNumber(other);
            }
            result2 = operator(value, other);
          }
          return result2;
        };
      }
      function createOver(arrayFunc) {
        return flatRest(function(iteratees) {
          iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
          return baseRest(function(args) {
            var thisArg = this;
            return arrayFunc(iteratees, function(iteratee2) {
              return apply(iteratee2, thisArg, args);
            });
          });
        });
      }
      function createPadding(length, chars) {
        chars = chars === undefined2 ? " " : baseToString(chars);
        var charsLength = chars.length;
        if (charsLength < 2) {
          return charsLength ? baseRepeat(chars, length) : chars;
        }
        var result2 = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
        return hasUnicode(chars) ? castSlice(stringToArray(result2), 0, length).join("") : result2.slice(0, length);
      }
      function createPartial(func, bitmask, thisArg, partials) {
        var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
        function wrapper() {
          var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array2(leftLength + argsLength), fn = this && this !== root && this instanceof wrapper ? Ctor : func;
          while (++leftIndex < leftLength) {
            args[leftIndex] = partials[leftIndex];
          }
          while (argsLength--) {
            args[leftIndex++] = arguments[++argsIndex];
          }
          return apply(fn, isBind ? thisArg : this, args);
        }
        return wrapper;
      }
      function createRange(fromRight) {
        return function(start, end, step) {
          if (step && typeof step != "number" && isIterateeCall(start, end, step)) {
            end = step = undefined2;
          }
          start = toFinite(start);
          if (end === undefined2) {
            end = start;
            start = 0;
          } else {
            end = toFinite(end);
          }
          step = step === undefined2 ? start < end ? 1 : -1 : toFinite(step);
          return baseRange(start, end, step, fromRight);
        };
      }
      function createRelationalOperation(operator) {
        return function(value, other) {
          if (!(typeof value == "string" && typeof other == "string")) {
            value = toNumber(value);
            other = toNumber(other);
          }
          return operator(value, other);
        };
      }
      function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary2, arity) {
        var isCurry = bitmask & WRAP_CURRY_FLAG, newHolders = isCurry ? holders : undefined2, newHoldersRight = isCurry ? undefined2 : holders, newPartials = isCurry ? partials : undefined2, newPartialsRight = isCurry ? undefined2 : partials;
        bitmask |= isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG;
        bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);
        if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
          bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
        }
        var newData = [
          func,
          bitmask,
          thisArg,
          newPartials,
          newHolders,
          newPartialsRight,
          newHoldersRight,
          argPos,
          ary2,
          arity
        ];
        var result2 = wrapFunc.apply(undefined2, newData);
        if (isLaziable(func)) {
          setData(result2, newData);
        }
        result2.placeholder = placeholder;
        return setWrapToString(result2, func, bitmask);
      }
      function createRound(methodName) {
        var func = Math2[methodName];
        return function(number, precision) {
          number = toNumber(number);
          precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
          if (precision && nativeIsFinite(number)) {
            var pair = (toString(number) + "e").split("e"), value = func(pair[0] + "e" + (+pair[1] + precision));
            pair = (toString(value) + "e").split("e");
            return +(pair[0] + "e" + (+pair[1] - precision));
          }
          return func(number);
        };
      }
      var createSet = !(Set2 && 1 / setToArray(new Set2([, -0]))[1] == INFINITY) ? noop : function(values2) {
        return new Set2(values2);
      };
      function createToPairs(keysFunc) {
        return function(object) {
          var tag = getTag(object);
          if (tag == mapTag) {
            return mapToArray(object);
          }
          if (tag == setTag) {
            return setToPairs(object);
          }
          return baseToPairs(object, keysFunc(object));
        };
      }
      function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary2, arity) {
        var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
        if (!isBindKey && typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        var length = partials ? partials.length : 0;
        if (!length) {
          bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
          partials = holders = undefined2;
        }
        ary2 = ary2 === undefined2 ? ary2 : nativeMax(toInteger(ary2), 0);
        arity = arity === undefined2 ? arity : toInteger(arity);
        length -= holders ? holders.length : 0;
        if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
          var partialsRight = partials, holdersRight = holders;
          partials = holders = undefined2;
        }
        var data = isBindKey ? undefined2 : getData(func);
        var newData = [
          func,
          bitmask,
          thisArg,
          partials,
          holders,
          partialsRight,
          holdersRight,
          argPos,
          ary2,
          arity
        ];
        if (data) {
          mergeData(newData, data);
        }
        func = newData[0];
        bitmask = newData[1];
        thisArg = newData[2];
        partials = newData[3];
        holders = newData[4];
        arity = newData[9] = newData[9] === undefined2 ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0);
        if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
          bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
        }
        if (!bitmask || bitmask == WRAP_BIND_FLAG) {
          var result2 = createBind(func, bitmask, thisArg);
        } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
          result2 = createCurry(func, bitmask, arity);
        } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
          result2 = createPartial(func, bitmask, thisArg, partials);
        } else {
          result2 = createHybrid.apply(undefined2, newData);
        }
        var setter = data ? baseSetData : setData;
        return setWrapToString(setter(result2, newData), func, bitmask);
      }
      function customDefaultsAssignIn(objValue, srcValue, key, object) {
        if (objValue === undefined2 || eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key)) {
          return srcValue;
        }
        return objValue;
      }
      function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
        if (isObject(objValue) && isObject(srcValue)) {
          stack.set(srcValue, objValue);
          baseMerge(objValue, srcValue, undefined2, customDefaultsMerge, stack);
          stack["delete"](srcValue);
        }
        return objValue;
      }
      function customOmitClone(value) {
        return isPlainObject(value) ? undefined2 : value;
      }
      function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
        if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
          return false;
        }
        var arrStacked = stack.get(array);
        var othStacked = stack.get(other);
        if (arrStacked && othStacked) {
          return arrStacked == other && othStacked == array;
        }
        var index = -1, result2 = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined2;
        stack.set(array, other);
        stack.set(other, array);
        while (++index < arrLength) {
          var arrValue = array[index], othValue = other[index];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
          }
          if (compared !== undefined2) {
            if (compared) {
              continue;
            }
            result2 = false;
            break;
          }
          if (seen) {
            if (!arraySome(other, function(othValue2, othIndex) {
              if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
                return seen.push(othIndex);
              }
            })) {
              result2 = false;
              break;
            }
          } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
            result2 = false;
            break;
          }
        }
        stack["delete"](array);
        stack["delete"](other);
        return result2;
      }
      function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
        switch (tag) {
          case dataViewTag:
            if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
              return false;
            }
            object = object.buffer;
            other = other.buffer;
          case arrayBufferTag:
            if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
              return false;
            }
            return true;
          case boolTag:
          case dateTag:
          case numberTag:
            return eq(+object, +other);
          case errorTag:
            return object.name == other.name && object.message == other.message;
          case regexpTag:
          case stringTag:
            return object == other + "";
          case mapTag:
            var convert = mapToArray;
          case setTag:
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
            convert || (convert = setToArray);
            if (object.size != other.size && !isPartial) {
              return false;
            }
            var stacked = stack.get(object);
            if (stacked) {
              return stacked == other;
            }
            bitmask |= COMPARE_UNORDERED_FLAG;
            stack.set(object, other);
            var result2 = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
            stack["delete"](object);
            return result2;
          case symbolTag:
            if (symbolValueOf) {
              return symbolValueOf.call(object) == symbolValueOf.call(other);
            }
        }
        return false;
      }
      function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
        if (objLength != othLength && !isPartial) {
          return false;
        }
        var index = objLength;
        while (index--) {
          var key = objProps[index];
          if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
            return false;
          }
        }
        var objStacked = stack.get(object);
        var othStacked = stack.get(other);
        if (objStacked && othStacked) {
          return objStacked == other && othStacked == object;
        }
        var result2 = true;
        stack.set(object, other);
        stack.set(other, object);
        var skipCtor = isPartial;
        while (++index < objLength) {
          key = objProps[index];
          var objValue = object[key], othValue = other[key];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
          }
          if (!(compared === undefined2 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
            result2 = false;
            break;
          }
          skipCtor || (skipCtor = key == "constructor");
        }
        if (result2 && !skipCtor) {
          var objCtor = object.constructor, othCtor = other.constructor;
          if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
            result2 = false;
          }
        }
        stack["delete"](object);
        stack["delete"](other);
        return result2;
      }
      function flatRest(func) {
        return setToString(overRest(func, undefined2, flatten), func + "");
      }
      function getAllKeys(object) {
        return baseGetAllKeys(object, keys, getSymbols);
      }
      function getAllKeysIn(object) {
        return baseGetAllKeys(object, keysIn, getSymbolsIn);
      }
      var getData = !metaMap ? noop : function(func) {
        return metaMap.get(func);
      };
      function getFuncName(func) {
        var result2 = func.name + "", array = realNames[result2], length = hasOwnProperty.call(realNames, result2) ? array.length : 0;
        while (length--) {
          var data = array[length], otherFunc = data.func;
          if (otherFunc == null || otherFunc == func) {
            return data.name;
          }
        }
        return result2;
      }
      function getHolder(func) {
        var object = hasOwnProperty.call(lodash, "placeholder") ? lodash : func;
        return object.placeholder;
      }
      function getIteratee() {
        var result2 = lodash.iteratee || iteratee;
        result2 = result2 === iteratee ? baseIteratee : result2;
        return arguments.length ? result2(arguments[0], arguments[1]) : result2;
      }
      function getMapData(map2, key) {
        var data = map2.__data__;
        return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
      }
      function getMatchData(object) {
        var result2 = keys(object), length = result2.length;
        while (length--) {
          var key = result2[length], value = object[key];
          result2[length] = [key, value, isStrictComparable(value)];
        }
        return result2;
      }
      function getNative(object, key) {
        var value = getValue(object, key);
        return baseIsNative(value) ? value : undefined2;
      }
      function getRawTag(value) {
        var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
        try {
          value[symToStringTag] = undefined2;
          var unmasked = true;
        } catch (e) {
        }
        var result2 = nativeObjectToString.call(value);
        if (unmasked) {
          if (isOwn) {
            value[symToStringTag] = tag;
          } else {
            delete value[symToStringTag];
          }
        }
        return result2;
      }
      var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
        if (object == null) {
          return [];
        }
        object = Object2(object);
        return arrayFilter(nativeGetSymbols(object), function(symbol) {
          return propertyIsEnumerable.call(object, symbol);
        });
      };
      var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
        var result2 = [];
        while (object) {
          arrayPush(result2, getSymbols(object));
          object = getPrototype(object);
        }
        return result2;
      };
      var getTag = baseGetTag;
      if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
        getTag = function(value) {
          var result2 = baseGetTag(value), Ctor = result2 == objectTag ? value.constructor : undefined2, ctorString = Ctor ? toSource(Ctor) : "";
          if (ctorString) {
            switch (ctorString) {
              case dataViewCtorString:
                return dataViewTag;
              case mapCtorString:
                return mapTag;
              case promiseCtorString:
                return promiseTag;
              case setCtorString:
                return setTag;
              case weakMapCtorString:
                return weakMapTag;
            }
          }
          return result2;
        };
      }
      function getView(start, end, transforms) {
        var index = -1, length = transforms.length;
        while (++index < length) {
          var data = transforms[index], size2 = data.size;
          switch (data.type) {
            case "drop":
              start += size2;
              break;
            case "dropRight":
              end -= size2;
              break;
            case "take":
              end = nativeMin(end, start + size2);
              break;
            case "takeRight":
              start = nativeMax(start, end - size2);
              break;
          }
        }
        return {start, end};
      }
      function getWrapDetails(source) {
        var match = source.match(reWrapDetails);
        return match ? match[1].split(reSplitDetails) : [];
      }
      function hasPath(object, path2, hasFunc) {
        path2 = castPath(path2, object);
        var index = -1, length = path2.length, result2 = false;
        while (++index < length) {
          var key = toKey(path2[index]);
          if (!(result2 = object != null && hasFunc(object, key))) {
            break;
          }
          object = object[key];
        }
        if (result2 || ++index != length) {
          return result2;
        }
        length = object == null ? 0 : object.length;
        return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
      }
      function initCloneArray(array) {
        var length = array.length, result2 = new array.constructor(length);
        if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
          result2.index = array.index;
          result2.input = array.input;
        }
        return result2;
      }
      function initCloneObject(object) {
        return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
      }
      function initCloneByTag(object, tag, isDeep) {
        var Ctor = object.constructor;
        switch (tag) {
          case arrayBufferTag:
            return cloneArrayBuffer(object);
          case boolTag:
          case dateTag:
            return new Ctor(+object);
          case dataViewTag:
            return cloneDataView(object, isDeep);
          case float32Tag:
          case float64Tag:
          case int8Tag:
          case int16Tag:
          case int32Tag:
          case uint8Tag:
          case uint8ClampedTag:
          case uint16Tag:
          case uint32Tag:
            return cloneTypedArray(object, isDeep);
          case mapTag:
            return new Ctor();
          case numberTag:
          case stringTag:
            return new Ctor(object);
          case regexpTag:
            return cloneRegExp(object);
          case setTag:
            return new Ctor();
          case symbolTag:
            return cloneSymbol(object);
        }
      }
      function insertWrapDetails(source, details) {
        var length = details.length;
        if (!length) {
          return source;
        }
        var lastIndex = length - 1;
        details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
        details = details.join(length > 2 ? ", " : " ");
        return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
      }
      function isFlattenable(value) {
        return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
      }
      function isIndex(value, length) {
        var type = typeof value;
        length = length == null ? MAX_SAFE_INTEGER : length;
        return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
      }
      function isIterateeCall(value, index, object) {
        if (!isObject(object)) {
          return false;
        }
        var type = typeof index;
        if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
          return eq(object[index], value);
        }
        return false;
      }
      function isKey(value, object) {
        if (isArray(value)) {
          return false;
        }
        var type = typeof value;
        if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
          return true;
        }
        return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object2(object);
      }
      function isKeyable(value) {
        var type = typeof value;
        return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
      }
      function isLaziable(func) {
        var funcName = getFuncName(func), other = lodash[funcName];
        if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) {
          return false;
        }
        if (func === other) {
          return true;
        }
        var data = getData(other);
        return !!data && func === data[0];
      }
      function isMasked(func) {
        return !!maskSrcKey && maskSrcKey in func;
      }
      var isMaskable = coreJsData ? isFunction : stubFalse;
      function isPrototype(value) {
        var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
        return value === proto;
      }
      function isStrictComparable(value) {
        return value === value && !isObject(value);
      }
      function matchesStrictComparable(key, srcValue) {
        return function(object) {
          if (object == null) {
            return false;
          }
          return object[key] === srcValue && (srcValue !== undefined2 || key in Object2(object));
        };
      }
      function memoizeCapped(func) {
        var result2 = memoize(func, function(key) {
          if (cache.size === MAX_MEMOIZE_SIZE) {
            cache.clear();
          }
          return key;
        });
        var cache = result2.cache;
        return result2;
      }
      function mergeData(data, source) {
        var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);
        var isCombo = srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG || srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_REARG_FLAG && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG;
        if (!(isCommon || isCombo)) {
          return data;
        }
        if (srcBitmask & WRAP_BIND_FLAG) {
          data[2] = source[2];
          newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
        }
        var value = source[3];
        if (value) {
          var partials = data[3];
          data[3] = partials ? composeArgs(partials, value, source[4]) : value;
          data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
        }
        value = source[5];
        if (value) {
          partials = data[5];
          data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
          data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
        }
        value = source[7];
        if (value) {
          data[7] = value;
        }
        if (srcBitmask & WRAP_ARY_FLAG) {
          data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
        }
        if (data[9] == null) {
          data[9] = source[9];
        }
        data[0] = source[0];
        data[1] = newBitmask;
        return data;
      }
      function nativeKeysIn(object) {
        var result2 = [];
        if (object != null) {
          for (var key in Object2(object)) {
            result2.push(key);
          }
        }
        return result2;
      }
      function objectToString(value) {
        return nativeObjectToString.call(value);
      }
      function overRest(func, start, transform2) {
        start = nativeMax(start === undefined2 ? func.length - 1 : start, 0);
        return function() {
          var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array2(length);
          while (++index < length) {
            array[index] = args[start + index];
          }
          index = -1;
          var otherArgs = Array2(start + 1);
          while (++index < start) {
            otherArgs[index] = args[index];
          }
          otherArgs[start] = transform2(array);
          return apply(func, this, otherArgs);
        };
      }
      function parent(object, path2) {
        return path2.length < 2 ? object : baseGet(object, baseSlice(path2, 0, -1));
      }
      function reorder(array, indexes) {
        var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = copyArray(array);
        while (length--) {
          var index = indexes[length];
          array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined2;
        }
        return array;
      }
      function safeGet(object, key) {
        if (key === "constructor" && typeof object[key] === "function") {
          return;
        }
        if (key == "__proto__") {
          return;
        }
        return object[key];
      }
      var setData = shortOut(baseSetData);
      var setTimeout = ctxSetTimeout || function(func, wait) {
        return root.setTimeout(func, wait);
      };
      var setToString = shortOut(baseSetToString);
      function setWrapToString(wrapper, reference, bitmask) {
        var source = reference + "";
        return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
      }
      function shortOut(func) {
        var count = 0, lastCalled = 0;
        return function() {
          var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
          lastCalled = stamp;
          if (remaining > 0) {
            if (++count >= HOT_COUNT) {
              return arguments[0];
            }
          } else {
            count = 0;
          }
          return func.apply(undefined2, arguments);
        };
      }
      function shuffleSelf(array, size2) {
        var index = -1, length = array.length, lastIndex = length - 1;
        size2 = size2 === undefined2 ? length : size2;
        while (++index < size2) {
          var rand = baseRandom(index, lastIndex), value = array[rand];
          array[rand] = array[index];
          array[index] = value;
        }
        array.length = size2;
        return array;
      }
      var stringToPath = memoizeCapped(function(string) {
        var result2 = [];
        if (string.charCodeAt(0) === 46) {
          result2.push("");
        }
        string.replace(rePropName, function(match, number, quote, subString) {
          result2.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
        });
        return result2;
      });
      function toKey(value) {
        if (typeof value == "string" || isSymbol(value)) {
          return value;
        }
        var result2 = value + "";
        return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
      }
      function toSource(func) {
        if (func != null) {
          try {
            return funcToString.call(func);
          } catch (e) {
          }
          try {
            return func + "";
          } catch (e) {
          }
        }
        return "";
      }
      function updateWrapDetails(details, bitmask) {
        arrayEach(wrapFlags, function(pair) {
          var value = "_." + pair[0];
          if (bitmask & pair[1] && !arrayIncludes(details, value)) {
            details.push(value);
          }
        });
        return details.sort();
      }
      function wrapperClone(wrapper) {
        if (wrapper instanceof LazyWrapper) {
          return wrapper.clone();
        }
        var result2 = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
        result2.__actions__ = copyArray(wrapper.__actions__);
        result2.__index__ = wrapper.__index__;
        result2.__values__ = wrapper.__values__;
        return result2;
      }
      function chunk(array, size2, guard) {
        if (guard ? isIterateeCall(array, size2, guard) : size2 === undefined2) {
          size2 = 1;
        } else {
          size2 = nativeMax(toInteger(size2), 0);
        }
        var length = array == null ? 0 : array.length;
        if (!length || size2 < 1) {
          return [];
        }
        var index = 0, resIndex = 0, result2 = Array2(nativeCeil(length / size2));
        while (index < length) {
          result2[resIndex++] = baseSlice(array, index, index += size2);
        }
        return result2;
      }
      function compact(array) {
        var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result2 = [];
        while (++index < length) {
          var value = array[index];
          if (value) {
            result2[resIndex++] = value;
          }
        }
        return result2;
      }
      function concat() {
        var length = arguments.length;
        if (!length) {
          return [];
        }
        var args = Array2(length - 1), array = arguments[0], index = length;
        while (index--) {
          args[index - 1] = arguments[index];
        }
        return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
      }
      var difference = baseRest(function(array, values2) {
        return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true)) : [];
      });
      var differenceBy = baseRest(function(array, values2) {
        var iteratee2 = last(values2);
        if (isArrayLikeObject(iteratee2)) {
          iteratee2 = undefined2;
        }
        return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2)) : [];
      });
      var differenceWith = baseRest(function(array, values2) {
        var comparator = last(values2);
        if (isArrayLikeObject(comparator)) {
          comparator = undefined2;
        }
        return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), undefined2, comparator) : [];
      });
      function drop(array, n, guard) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        n = guard || n === undefined2 ? 1 : toInteger(n);
        return baseSlice(array, n < 0 ? 0 : n, length);
      }
      function dropRight(array, n, guard) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        n = guard || n === undefined2 ? 1 : toInteger(n);
        n = length - n;
        return baseSlice(array, 0, n < 0 ? 0 : n);
      }
      function dropRightWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true, true) : [];
      }
      function dropWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true) : [];
      }
      function fill(array, value, start, end) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        if (start && typeof start != "number" && isIterateeCall(array, value, start)) {
          start = 0;
          end = length;
        }
        return baseFill(array, value, start, end);
      }
      function findIndex(array, predicate, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index = fromIndex == null ? 0 : toInteger(fromIndex);
        if (index < 0) {
          index = nativeMax(length + index, 0);
        }
        return baseFindIndex(array, getIteratee(predicate, 3), index);
      }
      function findLastIndex(array, predicate, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index = length - 1;
        if (fromIndex !== undefined2) {
          index = toInteger(fromIndex);
          index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
        }
        return baseFindIndex(array, getIteratee(predicate, 3), index, true);
      }
      function flatten(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseFlatten(array, 1) : [];
      }
      function flattenDeep(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseFlatten(array, INFINITY) : [];
      }
      function flattenDepth(array, depth) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        depth = depth === undefined2 ? 1 : toInteger(depth);
        return baseFlatten(array, depth);
      }
      function fromPairs(pairs) {
        var index = -1, length = pairs == null ? 0 : pairs.length, result2 = {};
        while (++index < length) {
          var pair = pairs[index];
          result2[pair[0]] = pair[1];
        }
        return result2;
      }
      function head(array) {
        return array && array.length ? array[0] : undefined2;
      }
      function indexOf(array, value, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index = fromIndex == null ? 0 : toInteger(fromIndex);
        if (index < 0) {
          index = nativeMax(length + index, 0);
        }
        return baseIndexOf(array, value, index);
      }
      function initial(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseSlice(array, 0, -1) : [];
      }
      var intersection = baseRest(function(arrays) {
        var mapped = arrayMap(arrays, castArrayLikeObject);
        return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
      });
      var intersectionBy = baseRest(function(arrays) {
        var iteratee2 = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
        if (iteratee2 === last(mapped)) {
          iteratee2 = undefined2;
        } else {
          mapped.pop();
        }
        return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, getIteratee(iteratee2, 2)) : [];
      });
      var intersectionWith = baseRest(function(arrays) {
        var comparator = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
        comparator = typeof comparator == "function" ? comparator : undefined2;
        if (comparator) {
          mapped.pop();
        }
        return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined2, comparator) : [];
      });
      function join(array, separator) {
        return array == null ? "" : nativeJoin.call(array, separator);
      }
      function last(array) {
        var length = array == null ? 0 : array.length;
        return length ? array[length - 1] : undefined2;
      }
      function lastIndexOf(array, value, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index = length;
        if (fromIndex !== undefined2) {
          index = toInteger(fromIndex);
          index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
        }
        return value === value ? strictLastIndexOf(array, value, index) : baseFindIndex(array, baseIsNaN, index, true);
      }
      function nth(array, n) {
        return array && array.length ? baseNth(array, toInteger(n)) : undefined2;
      }
      var pull = baseRest(pullAll);
      function pullAll(array, values2) {
        return array && array.length && values2 && values2.length ? basePullAll(array, values2) : array;
      }
      function pullAllBy(array, values2, iteratee2) {
        return array && array.length && values2 && values2.length ? basePullAll(array, values2, getIteratee(iteratee2, 2)) : array;
      }
      function pullAllWith(array, values2, comparator) {
        return array && array.length && values2 && values2.length ? basePullAll(array, values2, undefined2, comparator) : array;
      }
      var pullAt = flatRest(function(array, indexes) {
        var length = array == null ? 0 : array.length, result2 = baseAt(array, indexes);
        basePullAt(array, arrayMap(indexes, function(index) {
          return isIndex(index, length) ? +index : index;
        }).sort(compareAscending));
        return result2;
      });
      function remove(array, predicate) {
        var result2 = [];
        if (!(array && array.length)) {
          return result2;
        }
        var index = -1, indexes = [], length = array.length;
        predicate = getIteratee(predicate, 3);
        while (++index < length) {
          var value = array[index];
          if (predicate(value, index, array)) {
            result2.push(value);
            indexes.push(index);
          }
        }
        basePullAt(array, indexes);
        return result2;
      }
      function reverse(array) {
        return array == null ? array : nativeReverse.call(array);
      }
      function slice(array, start, end) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        if (end && typeof end != "number" && isIterateeCall(array, start, end)) {
          start = 0;
          end = length;
        } else {
          start = start == null ? 0 : toInteger(start);
          end = end === undefined2 ? length : toInteger(end);
        }
        return baseSlice(array, start, end);
      }
      function sortedIndex(array, value) {
        return baseSortedIndex(array, value);
      }
      function sortedIndexBy(array, value, iteratee2) {
        return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2));
      }
      function sortedIndexOf(array, value) {
        var length = array == null ? 0 : array.length;
        if (length) {
          var index = baseSortedIndex(array, value);
          if (index < length && eq(array[index], value)) {
            return index;
          }
        }
        return -1;
      }
      function sortedLastIndex(array, value) {
        return baseSortedIndex(array, value, true);
      }
      function sortedLastIndexBy(array, value, iteratee2) {
        return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2), true);
      }
      function sortedLastIndexOf(array, value) {
        var length = array == null ? 0 : array.length;
        if (length) {
          var index = baseSortedIndex(array, value, true) - 1;
          if (eq(array[index], value)) {
            return index;
          }
        }
        return -1;
      }
      function sortedUniq(array) {
        return array && array.length ? baseSortedUniq(array) : [];
      }
      function sortedUniqBy(array, iteratee2) {
        return array && array.length ? baseSortedUniq(array, getIteratee(iteratee2, 2)) : [];
      }
      function tail(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseSlice(array, 1, length) : [];
      }
      function take(array, n, guard) {
        if (!(array && array.length)) {
          return [];
        }
        n = guard || n === undefined2 ? 1 : toInteger(n);
        return baseSlice(array, 0, n < 0 ? 0 : n);
      }
      function takeRight(array, n, guard) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        n = guard || n === undefined2 ? 1 : toInteger(n);
        n = length - n;
        return baseSlice(array, n < 0 ? 0 : n, length);
      }
      function takeRightWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3), false, true) : [];
      }
      function takeWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3)) : [];
      }
      var union = baseRest(function(arrays) {
        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
      });
      var unionBy = baseRest(function(arrays) {
        var iteratee2 = last(arrays);
        if (isArrayLikeObject(iteratee2)) {
          iteratee2 = undefined2;
        }
        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2));
      });
      var unionWith = baseRest(function(arrays) {
        var comparator = last(arrays);
        comparator = typeof comparator == "function" ? comparator : undefined2;
        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined2, comparator);
      });
      function uniq(array) {
        return array && array.length ? baseUniq(array) : [];
      }
      function uniqBy(array, iteratee2) {
        return array && array.length ? baseUniq(array, getIteratee(iteratee2, 2)) : [];
      }
      function uniqWith(array, comparator) {
        comparator = typeof comparator == "function" ? comparator : undefined2;
        return array && array.length ? baseUniq(array, undefined2, comparator) : [];
      }
      function unzip(array) {
        if (!(array && array.length)) {
          return [];
        }
        var length = 0;
        array = arrayFilter(array, function(group) {
          if (isArrayLikeObject(group)) {
            length = nativeMax(group.length, length);
            return true;
          }
        });
        return baseTimes(length, function(index) {
          return arrayMap(array, baseProperty(index));
        });
      }
      function unzipWith(array, iteratee2) {
        if (!(array && array.length)) {
          return [];
        }
        var result2 = unzip(array);
        if (iteratee2 == null) {
          return result2;
        }
        return arrayMap(result2, function(group) {
          return apply(iteratee2, undefined2, group);
        });
      }
      var without = baseRest(function(array, values2) {
        return isArrayLikeObject(array) ? baseDifference(array, values2) : [];
      });
      var xor = baseRest(function(arrays) {
        return baseXor(arrayFilter(arrays, isArrayLikeObject));
      });
      var xorBy = baseRest(function(arrays) {
        var iteratee2 = last(arrays);
        if (isArrayLikeObject(iteratee2)) {
          iteratee2 = undefined2;
        }
        return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee2, 2));
      });
      var xorWith = baseRest(function(arrays) {
        var comparator = last(arrays);
        comparator = typeof comparator == "function" ? comparator : undefined2;
        return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined2, comparator);
      });
      var zip = baseRest(unzip);
      function zipObject(props, values2) {
        return baseZipObject(props || [], values2 || [], assignValue);
      }
      function zipObjectDeep(props, values2) {
        return baseZipObject(props || [], values2 || [], baseSet);
      }
      var zipWith = baseRest(function(arrays) {
        var length = arrays.length, iteratee2 = length > 1 ? arrays[length - 1] : undefined2;
        iteratee2 = typeof iteratee2 == "function" ? (arrays.pop(), iteratee2) : undefined2;
        return unzipWith(arrays, iteratee2);
      });
      function chain(value) {
        var result2 = lodash(value);
        result2.__chain__ = true;
        return result2;
      }
      function tap(value, interceptor) {
        interceptor(value);
        return value;
      }
      function thru(value, interceptor) {
        return interceptor(value);
      }
      var wrapperAt = flatRest(function(paths) {
        var length = paths.length, start = length ? paths[0] : 0, value = this.__wrapped__, interceptor = function(object) {
          return baseAt(object, paths);
        };
        if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
          return this.thru(interceptor);
        }
        value = value.slice(start, +start + (length ? 1 : 0));
        value.__actions__.push({
          func: thru,
          args: [interceptor],
          thisArg: undefined2
        });
        return new LodashWrapper(value, this.__chain__).thru(function(array) {
          if (length && !array.length) {
            array.push(undefined2);
          }
          return array;
        });
      });
      function wrapperChain() {
        return chain(this);
      }
      function wrapperCommit() {
        return new LodashWrapper(this.value(), this.__chain__);
      }
      function wrapperNext() {
        if (this.__values__ === undefined2) {
          this.__values__ = toArray(this.value());
        }
        var done = this.__index__ >= this.__values__.length, value = done ? undefined2 : this.__values__[this.__index__++];
        return {done, value};
      }
      function wrapperToIterator() {
        return this;
      }
      function wrapperPlant(value) {
        var result2, parent2 = this;
        while (parent2 instanceof baseLodash) {
          var clone2 = wrapperClone(parent2);
          clone2.__index__ = 0;
          clone2.__values__ = undefined2;
          if (result2) {
            previous.__wrapped__ = clone2;
          } else {
            result2 = clone2;
          }
          var previous = clone2;
          parent2 = parent2.__wrapped__;
        }
        previous.__wrapped__ = value;
        return result2;
      }
      function wrapperReverse() {
        var value = this.__wrapped__;
        if (value instanceof LazyWrapper) {
          var wrapped = value;
          if (this.__actions__.length) {
            wrapped = new LazyWrapper(this);
          }
          wrapped = wrapped.reverse();
          wrapped.__actions__.push({
            func: thru,
            args: [reverse],
            thisArg: undefined2
          });
          return new LodashWrapper(wrapped, this.__chain__);
        }
        return this.thru(reverse);
      }
      function wrapperValue() {
        return baseWrapperValue(this.__wrapped__, this.__actions__);
      }
      var countBy = createAggregator(function(result2, value, key) {
        if (hasOwnProperty.call(result2, key)) {
          ++result2[key];
        } else {
          baseAssignValue(result2, key, 1);
        }
      });
      function every(collection, predicate, guard) {
        var func = isArray(collection) ? arrayEvery : baseEvery;
        if (guard && isIterateeCall(collection, predicate, guard)) {
          predicate = undefined2;
        }
        return func(collection, getIteratee(predicate, 3));
      }
      function filter(collection, predicate) {
        var func = isArray(collection) ? arrayFilter : baseFilter;
        return func(collection, getIteratee(predicate, 3));
      }
      var find = createFind(findIndex);
      var findLast = createFind(findLastIndex);
      function flatMap(collection, iteratee2) {
        return baseFlatten(map(collection, iteratee2), 1);
      }
      function flatMapDeep(collection, iteratee2) {
        return baseFlatten(map(collection, iteratee2), INFINITY);
      }
      function flatMapDepth(collection, iteratee2, depth) {
        depth = depth === undefined2 ? 1 : toInteger(depth);
        return baseFlatten(map(collection, iteratee2), depth);
      }
      function forEach(collection, iteratee2) {
        var func = isArray(collection) ? arrayEach : baseEach;
        return func(collection, getIteratee(iteratee2, 3));
      }
      function forEachRight(collection, iteratee2) {
        var func = isArray(collection) ? arrayEachRight : baseEachRight;
        return func(collection, getIteratee(iteratee2, 3));
      }
      var groupBy = createAggregator(function(result2, value, key) {
        if (hasOwnProperty.call(result2, key)) {
          result2[key].push(value);
        } else {
          baseAssignValue(result2, key, [value]);
        }
      });
      function includes(collection, value, fromIndex, guard) {
        collection = isArrayLike(collection) ? collection : values(collection);
        fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
        var length = collection.length;
        if (fromIndex < 0) {
          fromIndex = nativeMax(length + fromIndex, 0);
        }
        return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
      }
      var invokeMap = baseRest(function(collection, path2, args) {
        var index = -1, isFunc = typeof path2 == "function", result2 = isArrayLike(collection) ? Array2(collection.length) : [];
        baseEach(collection, function(value) {
          result2[++index] = isFunc ? apply(path2, value, args) : baseInvoke(value, path2, args);
        });
        return result2;
      });
      var keyBy = createAggregator(function(result2, value, key) {
        baseAssignValue(result2, key, value);
      });
      function map(collection, iteratee2) {
        var func = isArray(collection) ? arrayMap : baseMap;
        return func(collection, getIteratee(iteratee2, 3));
      }
      function orderBy(collection, iteratees, orders, guard) {
        if (collection == null) {
          return [];
        }
        if (!isArray(iteratees)) {
          iteratees = iteratees == null ? [] : [iteratees];
        }
        orders = guard ? undefined2 : orders;
        if (!isArray(orders)) {
          orders = orders == null ? [] : [orders];
        }
        return baseOrderBy(collection, iteratees, orders);
      }
      var partition = createAggregator(function(result2, value, key) {
        result2[key ? 0 : 1].push(value);
      }, function() {
        return [[], []];
      });
      function reduce(collection, iteratee2, accumulator) {
        var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
        return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEach);
      }
      function reduceRight(collection, iteratee2, accumulator) {
        var func = isArray(collection) ? arrayReduceRight : baseReduce, initAccum = arguments.length < 3;
        return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEachRight);
      }
      function reject(collection, predicate) {
        var func = isArray(collection) ? arrayFilter : baseFilter;
        return func(collection, negate(getIteratee(predicate, 3)));
      }
      function sample(collection) {
        var func = isArray(collection) ? arraySample : baseSample;
        return func(collection);
      }
      function sampleSize(collection, n, guard) {
        if (guard ? isIterateeCall(collection, n, guard) : n === undefined2) {
          n = 1;
        } else {
          n = toInteger(n);
        }
        var func = isArray(collection) ? arraySampleSize : baseSampleSize;
        return func(collection, n);
      }
      function shuffle(collection) {
        var func = isArray(collection) ? arrayShuffle : baseShuffle;
        return func(collection);
      }
      function size(collection) {
        if (collection == null) {
          return 0;
        }
        if (isArrayLike(collection)) {
          return isString(collection) ? stringSize(collection) : collection.length;
        }
        var tag = getTag(collection);
        if (tag == mapTag || tag == setTag) {
          return collection.size;
        }
        return baseKeys(collection).length;
      }
      function some(collection, predicate, guard) {
        var func = isArray(collection) ? arraySome : baseSome;
        if (guard && isIterateeCall(collection, predicate, guard)) {
          predicate = undefined2;
        }
        return func(collection, getIteratee(predicate, 3));
      }
      var sortBy = baseRest(function(collection, iteratees) {
        if (collection == null) {
          return [];
        }
        var length = iteratees.length;
        if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
          iteratees = [];
        } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
          iteratees = [iteratees[0]];
        }
        return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
      });
      var now = ctxNow || function() {
        return root.Date.now();
      };
      function after(n, func) {
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        n = toInteger(n);
        return function() {
          if (--n < 1) {
            return func.apply(this, arguments);
          }
        };
      }
      function ary(func, n, guard) {
        n = guard ? undefined2 : n;
        n = func && n == null ? func.length : n;
        return createWrap(func, WRAP_ARY_FLAG, undefined2, undefined2, undefined2, undefined2, n);
      }
      function before(n, func) {
        var result2;
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        n = toInteger(n);
        return function() {
          if (--n > 0) {
            result2 = func.apply(this, arguments);
          }
          if (n <= 1) {
            func = undefined2;
          }
          return result2;
        };
      }
      var bind = baseRest(function(func, thisArg, partials) {
        var bitmask = WRAP_BIND_FLAG;
        if (partials.length) {
          var holders = replaceHolders(partials, getHolder(bind));
          bitmask |= WRAP_PARTIAL_FLAG;
        }
        return createWrap(func, bitmask, thisArg, partials, holders);
      });
      var bindKey = baseRest(function(object, key, partials) {
        var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
        if (partials.length) {
          var holders = replaceHolders(partials, getHolder(bindKey));
          bitmask |= WRAP_PARTIAL_FLAG;
        }
        return createWrap(key, bitmask, object, partials, holders);
      });
      function curry(func, arity, guard) {
        arity = guard ? undefined2 : arity;
        var result2 = createWrap(func, WRAP_CURRY_FLAG, undefined2, undefined2, undefined2, undefined2, undefined2, arity);
        result2.placeholder = curry.placeholder;
        return result2;
      }
      function curryRight(func, arity, guard) {
        arity = guard ? undefined2 : arity;
        var result2 = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined2, undefined2, undefined2, undefined2, undefined2, arity);
        result2.placeholder = curryRight.placeholder;
        return result2;
      }
      function debounce(func, wait, options) {
        var lastArgs, lastThis, maxWait, result2, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        wait = toNumber(wait) || 0;
        if (isObject(options)) {
          leading = !!options.leading;
          maxing = "maxWait" in options;
          maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
          trailing = "trailing" in options ? !!options.trailing : trailing;
        }
        function invokeFunc(time) {
          var args = lastArgs, thisArg = lastThis;
          lastArgs = lastThis = undefined2;
          lastInvokeTime = time;
          result2 = func.apply(thisArg, args);
          return result2;
        }
        function leadingEdge(time) {
          lastInvokeTime = time;
          timerId = setTimeout(timerExpired, wait);
          return leading ? invokeFunc(time) : result2;
        }
        function remainingWait(time) {
          var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
          return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
        }
        function shouldInvoke(time) {
          var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
          return lastCallTime === undefined2 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
        }
        function timerExpired() {
          var time = now();
          if (shouldInvoke(time)) {
            return trailingEdge(time);
          }
          timerId = setTimeout(timerExpired, remainingWait(time));
        }
        function trailingEdge(time) {
          timerId = undefined2;
          if (trailing && lastArgs) {
            return invokeFunc(time);
          }
          lastArgs = lastThis = undefined2;
          return result2;
        }
        function cancel() {
          if (timerId !== undefined2) {
            clearTimeout(timerId);
          }
          lastInvokeTime = 0;
          lastArgs = lastCallTime = lastThis = timerId = undefined2;
        }
        function flush() {
          return timerId === undefined2 ? result2 : trailingEdge(now());
        }
        function debounced() {
          var time = now(), isInvoking = shouldInvoke(time);
          lastArgs = arguments;
          lastThis = this;
          lastCallTime = time;
          if (isInvoking) {
            if (timerId === undefined2) {
              return leadingEdge(lastCallTime);
            }
            if (maxing) {
              clearTimeout(timerId);
              timerId = setTimeout(timerExpired, wait);
              return invokeFunc(lastCallTime);
            }
          }
          if (timerId === undefined2) {
            timerId = setTimeout(timerExpired, wait);
          }
          return result2;
        }
        debounced.cancel = cancel;
        debounced.flush = flush;
        return debounced;
      }
      var defer = baseRest(function(func, args) {
        return baseDelay(func, 1, args);
      });
      var delay = baseRest(function(func, wait, args) {
        return baseDelay(func, toNumber(wait) || 0, args);
      });
      function flip(func) {
        return createWrap(func, WRAP_FLIP_FLAG);
      }
      function memoize(func, resolver) {
        if (typeof func != "function" || resolver != null && typeof resolver != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        var memoized = function() {
          var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
          if (cache.has(key)) {
            return cache.get(key);
          }
          var result2 = func.apply(this, args);
          memoized.cache = cache.set(key, result2) || cache;
          return result2;
        };
        memoized.cache = new (memoize.Cache || MapCache)();
        return memoized;
      }
      memoize.Cache = MapCache;
      function negate(predicate) {
        if (typeof predicate != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        return function() {
          var args = arguments;
          switch (args.length) {
            case 0:
              return !predicate.call(this);
            case 1:
              return !predicate.call(this, args[0]);
            case 2:
              return !predicate.call(this, args[0], args[1]);
            case 3:
              return !predicate.call(this, args[0], args[1], args[2]);
          }
          return !predicate.apply(this, args);
        };
      }
      function once(func) {
        return before(2, func);
      }
      var overArgs = castRest(function(func, transforms) {
        transforms = transforms.length == 1 && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(getIteratee())) : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));
        var funcsLength = transforms.length;
        return baseRest(function(args) {
          var index = -1, length = nativeMin(args.length, funcsLength);
          while (++index < length) {
            args[index] = transforms[index].call(this, args[index]);
          }
          return apply(func, this, args);
        });
      });
      var partial = baseRest(function(func, partials) {
        var holders = replaceHolders(partials, getHolder(partial));
        return createWrap(func, WRAP_PARTIAL_FLAG, undefined2, partials, holders);
      });
      var partialRight = baseRest(function(func, partials) {
        var holders = replaceHolders(partials, getHolder(partialRight));
        return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined2, partials, holders);
      });
      var rearg = flatRest(function(func, indexes) {
        return createWrap(func, WRAP_REARG_FLAG, undefined2, undefined2, undefined2, indexes);
      });
      function rest(func, start) {
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        start = start === undefined2 ? start : toInteger(start);
        return baseRest(func, start);
      }
      function spread(func, start) {
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        start = start == null ? 0 : nativeMax(toInteger(start), 0);
        return baseRest(function(args) {
          var array = args[start], otherArgs = castSlice(args, 0, start);
          if (array) {
            arrayPush(otherArgs, array);
          }
          return apply(func, this, otherArgs);
        });
      }
      function throttle(func, wait, options) {
        var leading = true, trailing = true;
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        if (isObject(options)) {
          leading = "leading" in options ? !!options.leading : leading;
          trailing = "trailing" in options ? !!options.trailing : trailing;
        }
        return debounce(func, wait, {
          leading,
          maxWait: wait,
          trailing
        });
      }
      function unary(func) {
        return ary(func, 1);
      }
      function wrap(value, wrapper) {
        return partial(castFunction(wrapper), value);
      }
      function castArray() {
        if (!arguments.length) {
          return [];
        }
        var value = arguments[0];
        return isArray(value) ? value : [value];
      }
      function clone(value) {
        return baseClone(value, CLONE_SYMBOLS_FLAG);
      }
      function cloneWith(value, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined2;
        return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
      }
      function cloneDeep(value) {
        return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
      }
      function cloneDeepWith(value, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined2;
        return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
      }
      function conformsTo(object, source) {
        return source == null || baseConformsTo(object, source, keys(source));
      }
      function eq(value, other) {
        return value === other || value !== value && other !== other;
      }
      var gt = createRelationalOperation(baseGt);
      var gte = createRelationalOperation(function(value, other) {
        return value >= other;
      });
      var isArguments = baseIsArguments(function() {
        return arguments;
      }()) ? baseIsArguments : function(value) {
        return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
      };
      var isArray = Array2.isArray;
      var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
      function isArrayLike(value) {
        return value != null && isLength(value.length) && !isFunction(value);
      }
      function isArrayLikeObject(value) {
        return isObjectLike(value) && isArrayLike(value);
      }
      function isBoolean(value) {
        return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
      }
      var isBuffer = nativeIsBuffer || stubFalse;
      var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
      function isElement(value) {
        return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
      }
      function isEmpty(value) {
        if (value == null) {
          return true;
        }
        if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
          return !value.length;
        }
        var tag = getTag(value);
        if (tag == mapTag || tag == setTag) {
          return !value.size;
        }
        if (isPrototype(value)) {
          return !baseKeys(value).length;
        }
        for (var key in value) {
          if (hasOwnProperty.call(value, key)) {
            return false;
          }
        }
        return true;
      }
      function isEqual2(value, other) {
        return baseIsEqual(value, other);
      }
      function isEqualWith(value, other, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined2;
        var result2 = customizer ? customizer(value, other) : undefined2;
        return result2 === undefined2 ? baseIsEqual(value, other, undefined2, customizer) : !!result2;
      }
      function isError(value) {
        if (!isObjectLike(value)) {
          return false;
        }
        var tag = baseGetTag(value);
        return tag == errorTag || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject(value);
      }
      function isFinite2(value) {
        return typeof value == "number" && nativeIsFinite(value);
      }
      function isFunction(value) {
        if (!isObject(value)) {
          return false;
        }
        var tag = baseGetTag(value);
        return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
      }
      function isInteger(value) {
        return typeof value == "number" && value == toInteger(value);
      }
      function isLength(value) {
        return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
      }
      function isObject(value) {
        var type = typeof value;
        return value != null && (type == "object" || type == "function");
      }
      function isObjectLike(value) {
        return value != null && typeof value == "object";
      }
      var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
      function isMatch(object, source) {
        return object === source || baseIsMatch(object, source, getMatchData(source));
      }
      function isMatchWith(object, source, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined2;
        return baseIsMatch(object, source, getMatchData(source), customizer);
      }
      function isNaN2(value) {
        return isNumber(value) && value != +value;
      }
      function isNative(value) {
        if (isMaskable(value)) {
          throw new Error2(CORE_ERROR_TEXT);
        }
        return baseIsNative(value);
      }
      function isNull(value) {
        return value === null;
      }
      function isNil(value) {
        return value == null;
      }
      function isNumber(value) {
        return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
      }
      function isPlainObject(value) {
        if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
          return false;
        }
        var proto = getPrototype(value);
        if (proto === null) {
          return true;
        }
        var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
        return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
      }
      var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
      function isSafeInteger(value) {
        return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
      }
      var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
      function isString(value) {
        return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
      }
      function isSymbol(value) {
        return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
      }
      var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
      function isUndefined(value) {
        return value === undefined2;
      }
      function isWeakMap(value) {
        return isObjectLike(value) && getTag(value) == weakMapTag;
      }
      function isWeakSet(value) {
        return isObjectLike(value) && baseGetTag(value) == weakSetTag;
      }
      var lt = createRelationalOperation(baseLt);
      var lte = createRelationalOperation(function(value, other) {
        return value <= other;
      });
      function toArray(value) {
        if (!value) {
          return [];
        }
        if (isArrayLike(value)) {
          return isString(value) ? stringToArray(value) : copyArray(value);
        }
        if (symIterator && value[symIterator]) {
          return iteratorToArray(value[symIterator]());
        }
        var tag = getTag(value), func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;
        return func(value);
      }
      function toFinite(value) {
        if (!value) {
          return value === 0 ? value : 0;
        }
        value = toNumber(value);
        if (value === INFINITY || value === -INFINITY) {
          var sign = value < 0 ? -1 : 1;
          return sign * MAX_INTEGER;
        }
        return value === value ? value : 0;
      }
      function toInteger(value) {
        var result2 = toFinite(value), remainder = result2 % 1;
        return result2 === result2 ? remainder ? result2 - remainder : result2 : 0;
      }
      function toLength(value) {
        return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
      }
      function toNumber(value) {
        if (typeof value == "number") {
          return value;
        }
        if (isSymbol(value)) {
          return NAN;
        }
        if (isObject(value)) {
          var other = typeof value.valueOf == "function" ? value.valueOf() : value;
          value = isObject(other) ? other + "" : other;
        }
        if (typeof value != "string") {
          return value === 0 ? value : +value;
        }
        value = baseTrim(value);
        var isBinary = reIsBinary.test(value);
        return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
      }
      function toPlainObject(value) {
        return copyObject(value, keysIn(value));
      }
      function toSafeInteger(value) {
        return value ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value === 0 ? value : 0;
      }
      function toString(value) {
        return value == null ? "" : baseToString(value);
      }
      var assign = createAssigner(function(object, source) {
        if (isPrototype(source) || isArrayLike(source)) {
          copyObject(source, keys(source), object);
          return;
        }
        for (var key in source) {
          if (hasOwnProperty.call(source, key)) {
            assignValue(object, key, source[key]);
          }
        }
      });
      var assignIn = createAssigner(function(object, source) {
        copyObject(source, keysIn(source), object);
      });
      var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
        copyObject(source, keysIn(source), object, customizer);
      });
      var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
        copyObject(source, keys(source), object, customizer);
      });
      var at = flatRest(baseAt);
      function create(prototype, properties) {
        var result2 = baseCreate(prototype);
        return properties == null ? result2 : baseAssign(result2, properties);
      }
      var defaults = baseRest(function(object, sources) {
        object = Object2(object);
        var index = -1;
        var length = sources.length;
        var guard = length > 2 ? sources[2] : undefined2;
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          length = 1;
        }
        while (++index < length) {
          var source = sources[index];
          var props = keysIn(source);
          var propsIndex = -1;
          var propsLength = props.length;
          while (++propsIndex < propsLength) {
            var key = props[propsIndex];
            var value = object[key];
            if (value === undefined2 || eq(value, objectProto[key]) && !hasOwnProperty.call(object, key)) {
              object[key] = source[key];
            }
          }
        }
        return object;
      });
      var defaultsDeep = baseRest(function(args) {
        args.push(undefined2, customDefaultsMerge);
        return apply(mergeWith, undefined2, args);
      });
      function findKey(object, predicate) {
        return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
      }
      function findLastKey(object, predicate) {
        return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
      }
      function forIn(object, iteratee2) {
        return object == null ? object : baseFor(object, getIteratee(iteratee2, 3), keysIn);
      }
      function forInRight(object, iteratee2) {
        return object == null ? object : baseForRight(object, getIteratee(iteratee2, 3), keysIn);
      }
      function forOwn(object, iteratee2) {
        return object && baseForOwn(object, getIteratee(iteratee2, 3));
      }
      function forOwnRight(object, iteratee2) {
        return object && baseForOwnRight(object, getIteratee(iteratee2, 3));
      }
      function functions(object) {
        return object == null ? [] : baseFunctions(object, keys(object));
      }
      function functionsIn(object) {
        return object == null ? [] : baseFunctions(object, keysIn(object));
      }
      function get(object, path2, defaultValue) {
        var result2 = object == null ? undefined2 : baseGet(object, path2);
        return result2 === undefined2 ? defaultValue : result2;
      }
      function has(object, path2) {
        return object != null && hasPath(object, path2, baseHas);
      }
      function hasIn(object, path2) {
        return object != null && hasPath(object, path2, baseHasIn);
      }
      var invert = createInverter(function(result2, value, key) {
        if (value != null && typeof value.toString != "function") {
          value = nativeObjectToString.call(value);
        }
        result2[value] = key;
      }, constant(identity));
      var invertBy = createInverter(function(result2, value, key) {
        if (value != null && typeof value.toString != "function") {
          value = nativeObjectToString.call(value);
        }
        if (hasOwnProperty.call(result2, value)) {
          result2[value].push(key);
        } else {
          result2[value] = [key];
        }
      }, getIteratee);
      var invoke = baseRest(baseInvoke);
      function keys(object) {
        return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
      }
      function keysIn(object) {
        return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
      }
      function mapKeys(object, iteratee2) {
        var result2 = {};
        iteratee2 = getIteratee(iteratee2, 3);
        baseForOwn(object, function(value, key, object2) {
          baseAssignValue(result2, iteratee2(value, key, object2), value);
        });
        return result2;
      }
      function mapValues(object, iteratee2) {
        var result2 = {};
        iteratee2 = getIteratee(iteratee2, 3);
        baseForOwn(object, function(value, key, object2) {
          baseAssignValue(result2, key, iteratee2(value, key, object2));
        });
        return result2;
      }
      var merge = createAssigner(function(object, source, srcIndex) {
        baseMerge(object, source, srcIndex);
      });
      var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
        baseMerge(object, source, srcIndex, customizer);
      });
      var omit = flatRest(function(object, paths) {
        var result2 = {};
        if (object == null) {
          return result2;
        }
        var isDeep = false;
        paths = arrayMap(paths, function(path2) {
          path2 = castPath(path2, object);
          isDeep || (isDeep = path2.length > 1);
          return path2;
        });
        copyObject(object, getAllKeysIn(object), result2);
        if (isDeep) {
          result2 = baseClone(result2, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
        }
        var length = paths.length;
        while (length--) {
          baseUnset(result2, paths[length]);
        }
        return result2;
      });
      function omitBy(object, predicate) {
        return pickBy(object, negate(getIteratee(predicate)));
      }
      var pick = flatRest(function(object, paths) {
        return object == null ? {} : basePick(object, paths);
      });
      function pickBy(object, predicate) {
        if (object == null) {
          return {};
        }
        var props = arrayMap(getAllKeysIn(object), function(prop) {
          return [prop];
        });
        predicate = getIteratee(predicate);
        return basePickBy(object, props, function(value, path2) {
          return predicate(value, path2[0]);
        });
      }
      function result(object, path2, defaultValue) {
        path2 = castPath(path2, object);
        var index = -1, length = path2.length;
        if (!length) {
          length = 1;
          object = undefined2;
        }
        while (++index < length) {
          var value = object == null ? undefined2 : object[toKey(path2[index])];
          if (value === undefined2) {
            index = length;
            value = defaultValue;
          }
          object = isFunction(value) ? value.call(object) : value;
        }
        return object;
      }
      function set(object, path2, value) {
        return object == null ? object : baseSet(object, path2, value);
      }
      function setWith(object, path2, value, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined2;
        return object == null ? object : baseSet(object, path2, value, customizer);
      }
      var toPairs = createToPairs(keys);
      var toPairsIn = createToPairs(keysIn);
      function transform(object, iteratee2, accumulator) {
        var isArr = isArray(object), isArrLike = isArr || isBuffer(object) || isTypedArray(object);
        iteratee2 = getIteratee(iteratee2, 4);
        if (accumulator == null) {
          var Ctor = object && object.constructor;
          if (isArrLike) {
            accumulator = isArr ? new Ctor() : [];
          } else if (isObject(object)) {
            accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
          } else {
            accumulator = {};
          }
        }
        (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object2) {
          return iteratee2(accumulator, value, index, object2);
        });
        return accumulator;
      }
      function unset(object, path2) {
        return object == null ? true : baseUnset(object, path2);
      }
      function update(object, path2, updater) {
        return object == null ? object : baseUpdate(object, path2, castFunction(updater));
      }
      function updateWith(object, path2, updater, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined2;
        return object == null ? object : baseUpdate(object, path2, castFunction(updater), customizer);
      }
      function values(object) {
        return object == null ? [] : baseValues(object, keys(object));
      }
      function valuesIn(object) {
        return object == null ? [] : baseValues(object, keysIn(object));
      }
      function clamp(number, lower, upper) {
        if (upper === undefined2) {
          upper = lower;
          lower = undefined2;
        }
        if (upper !== undefined2) {
          upper = toNumber(upper);
          upper = upper === upper ? upper : 0;
        }
        if (lower !== undefined2) {
          lower = toNumber(lower);
          lower = lower === lower ? lower : 0;
        }
        return baseClamp(toNumber(number), lower, upper);
      }
      function inRange(number, start, end) {
        start = toFinite(start);
        if (end === undefined2) {
          end = start;
          start = 0;
        } else {
          end = toFinite(end);
        }
        number = toNumber(number);
        return baseInRange(number, start, end);
      }
      function random(lower, upper, floating) {
        if (floating && typeof floating != "boolean" && isIterateeCall(lower, upper, floating)) {
          upper = floating = undefined2;
        }
        if (floating === undefined2) {
          if (typeof upper == "boolean") {
            floating = upper;
            upper = undefined2;
          } else if (typeof lower == "boolean") {
            floating = lower;
            lower = undefined2;
          }
        }
        if (lower === undefined2 && upper === undefined2) {
          lower = 0;
          upper = 1;
        } else {
          lower = toFinite(lower);
          if (upper === undefined2) {
            upper = lower;
            lower = 0;
          } else {
            upper = toFinite(upper);
          }
        }
        if (lower > upper) {
          var temp = lower;
          lower = upper;
          upper = temp;
        }
        if (floating || lower % 1 || upper % 1) {
          var rand = nativeRandom();
          return nativeMin(lower + rand * (upper - lower + freeParseFloat("1e-" + ((rand + "").length - 1))), upper);
        }
        return baseRandom(lower, upper);
      }
      var camelCase = createCompounder(function(result2, word, index) {
        word = word.toLowerCase();
        return result2 + (index ? capitalize(word) : word);
      });
      function capitalize(string) {
        return upperFirst(toString(string).toLowerCase());
      }
      function deburr(string) {
        string = toString(string);
        return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
      }
      function endsWith(string, target, position) {
        string = toString(string);
        target = baseToString(target);
        var length = string.length;
        position = position === undefined2 ? length : baseClamp(toInteger(position), 0, length);
        var end = position;
        position -= target.length;
        return position >= 0 && string.slice(position, end) == target;
      }
      function escape2(string) {
        string = toString(string);
        return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
      }
      function escapeRegExp(string) {
        string = toString(string);
        return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
      }
      var kebabCase = createCompounder(function(result2, word, index) {
        return result2 + (index ? "-" : "") + word.toLowerCase();
      });
      var lowerCase = createCompounder(function(result2, word, index) {
        return result2 + (index ? " " : "") + word.toLowerCase();
      });
      var lowerFirst = createCaseFirst("toLowerCase");
      function pad(string, length, chars) {
        string = toString(string);
        length = toInteger(length);
        var strLength = length ? stringSize(string) : 0;
        if (!length || strLength >= length) {
          return string;
        }
        var mid = (length - strLength) / 2;
        return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
      }
      function padEnd(string, length, chars) {
        string = toString(string);
        length = toInteger(length);
        var strLength = length ? stringSize(string) : 0;
        return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
      }
      function padStart(string, length, chars) {
        string = toString(string);
        length = toInteger(length);
        var strLength = length ? stringSize(string) : 0;
        return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
      }
      function parseInt2(string, radix, guard) {
        if (guard || radix == null) {
          radix = 0;
        } else if (radix) {
          radix = +radix;
        }
        return nativeParseInt(toString(string).replace(reTrimStart, ""), radix || 0);
      }
      function repeat(string, n, guard) {
        if (guard ? isIterateeCall(string, n, guard) : n === undefined2) {
          n = 1;
        } else {
          n = toInteger(n);
        }
        return baseRepeat(toString(string), n);
      }
      function replace() {
        var args = arguments, string = toString(args[0]);
        return args.length < 3 ? string : string.replace(args[1], args[2]);
      }
      var snakeCase = createCompounder(function(result2, word, index) {
        return result2 + (index ? "_" : "") + word.toLowerCase();
      });
      function split(string, separator, limit) {
        if (limit && typeof limit != "number" && isIterateeCall(string, separator, limit)) {
          separator = limit = undefined2;
        }
        limit = limit === undefined2 ? MAX_ARRAY_LENGTH : limit >>> 0;
        if (!limit) {
          return [];
        }
        string = toString(string);
        if (string && (typeof separator == "string" || separator != null && !isRegExp(separator))) {
          separator = baseToString(separator);
          if (!separator && hasUnicode(string)) {
            return castSlice(stringToArray(string), 0, limit);
          }
        }
        return string.split(separator, limit);
      }
      var startCase = createCompounder(function(result2, word, index) {
        return result2 + (index ? " " : "") + upperFirst(word);
      });
      function startsWith(string, target, position) {
        string = toString(string);
        position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
        target = baseToString(target);
        return string.slice(position, position + target.length) == target;
      }
      function template(string, options, guard) {
        var settings = lodash.templateSettings;
        if (guard && isIterateeCall(string, options, guard)) {
          options = undefined2;
        }
        string = toString(string);
        options = assignInWith({}, options, settings, customDefaultsAssignIn);
        var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
        var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
        var reDelimiters = RegExp2((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");
        var sourceURL = "//# sourceURL=" + (hasOwnProperty.call(options, "sourceURL") ? (options.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++templateCounter + "]") + "\n";
        string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
          interpolateValue || (interpolateValue = esTemplateValue);
          source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
          if (escapeValue) {
            isEscaping = true;
            source += "' +\n__e(" + escapeValue + ") +\n'";
          }
          if (evaluateValue) {
            isEvaluating = true;
            source += "';\n" + evaluateValue + ";\n__p += '";
          }
          if (interpolateValue) {
            source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
          }
          index = offset + match.length;
          return match;
        });
        source += "';\n";
        var variable = hasOwnProperty.call(options, "variable") && options.variable;
        if (!variable) {
          source = "with (obj) {\n" + source + "\n}\n";
        } else if (reForbiddenIdentifierChars.test(variable)) {
          throw new Error2(INVALID_TEMPL_VAR_ERROR_TEXT);
        }
        source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
        source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
        var result2 = attempt(function() {
          return Function2(importsKeys, sourceURL + "return " + source).apply(undefined2, importsValues);
        });
        result2.source = source;
        if (isError(result2)) {
          throw result2;
        }
        return result2;
      }
      function toLower(value) {
        return toString(value).toLowerCase();
      }
      function toUpper(value) {
        return toString(value).toUpperCase();
      }
      function trim(string, chars, guard) {
        string = toString(string);
        if (string && (guard || chars === undefined2)) {
          return baseTrim(string);
        }
        if (!string || !(chars = baseToString(chars))) {
          return string;
        }
        var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars), start = charsStartIndex(strSymbols, chrSymbols), end = charsEndIndex(strSymbols, chrSymbols) + 1;
        return castSlice(strSymbols, start, end).join("");
      }
      function trimEnd(string, chars, guard) {
        string = toString(string);
        if (string && (guard || chars === undefined2)) {
          return string.slice(0, trimmedEndIndex(string) + 1);
        }
        if (!string || !(chars = baseToString(chars))) {
          return string;
        }
        var strSymbols = stringToArray(string), end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
        return castSlice(strSymbols, 0, end).join("");
      }
      function trimStart(string, chars, guard) {
        string = toString(string);
        if (string && (guard || chars === undefined2)) {
          return string.replace(reTrimStart, "");
        }
        if (!string || !(chars = baseToString(chars))) {
          return string;
        }
        var strSymbols = stringToArray(string), start = charsStartIndex(strSymbols, stringToArray(chars));
        return castSlice(strSymbols, start).join("");
      }
      function truncate(string, options) {
        var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
        if (isObject(options)) {
          var separator = "separator" in options ? options.separator : separator;
          length = "length" in options ? toInteger(options.length) : length;
          omission = "omission" in options ? baseToString(options.omission) : omission;
        }
        string = toString(string);
        var strLength = string.length;
        if (hasUnicode(string)) {
          var strSymbols = stringToArray(string);
          strLength = strSymbols.length;
        }
        if (length >= strLength) {
          return string;
        }
        var end = length - stringSize(omission);
        if (end < 1) {
          return omission;
        }
        var result2 = strSymbols ? castSlice(strSymbols, 0, end).join("") : string.slice(0, end);
        if (separator === undefined2) {
          return result2 + omission;
        }
        if (strSymbols) {
          end += result2.length - end;
        }
        if (isRegExp(separator)) {
          if (string.slice(end).search(separator)) {
            var match, substring = result2;
            if (!separator.global) {
              separator = RegExp2(separator.source, toString(reFlags.exec(separator)) + "g");
            }
            separator.lastIndex = 0;
            while (match = separator.exec(substring)) {
              var newEnd = match.index;
            }
            result2 = result2.slice(0, newEnd === undefined2 ? end : newEnd);
          }
        } else if (string.indexOf(baseToString(separator), end) != end) {
          var index = result2.lastIndexOf(separator);
          if (index > -1) {
            result2 = result2.slice(0, index);
          }
        }
        return result2 + omission;
      }
      function unescape(string) {
        string = toString(string);
        return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
      }
      var upperCase = createCompounder(function(result2, word, index) {
        return result2 + (index ? " " : "") + word.toUpperCase();
      });
      var upperFirst = createCaseFirst("toUpperCase");
      function words(string, pattern, guard) {
        string = toString(string);
        pattern = guard ? undefined2 : pattern;
        if (pattern === undefined2) {
          return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
        }
        return string.match(pattern) || [];
      }
      var attempt = baseRest(function(func, args) {
        try {
          return apply(func, undefined2, args);
        } catch (e) {
          return isError(e) ? e : new Error2(e);
        }
      });
      var bindAll = flatRest(function(object, methodNames) {
        arrayEach(methodNames, function(key) {
          key = toKey(key);
          baseAssignValue(object, key, bind(object[key], object));
        });
        return object;
      });
      function cond(pairs) {
        var length = pairs == null ? 0 : pairs.length, toIteratee = getIteratee();
        pairs = !length ? [] : arrayMap(pairs, function(pair) {
          if (typeof pair[1] != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          return [toIteratee(pair[0]), pair[1]];
        });
        return baseRest(function(args) {
          var index = -1;
          while (++index < length) {
            var pair = pairs[index];
            if (apply(pair[0], this, args)) {
              return apply(pair[1], this, args);
            }
          }
        });
      }
      function conforms(source) {
        return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
      }
      function constant(value) {
        return function() {
          return value;
        };
      }
      function defaultTo(value, defaultValue) {
        return value == null || value !== value ? defaultValue : value;
      }
      var flow = createFlow();
      var flowRight = createFlow(true);
      function identity(value) {
        return value;
      }
      function iteratee(func) {
        return baseIteratee(typeof func == "function" ? func : baseClone(func, CLONE_DEEP_FLAG));
      }
      function matches(source) {
        return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
      }
      function matchesProperty(path2, srcValue) {
        return baseMatchesProperty(path2, baseClone(srcValue, CLONE_DEEP_FLAG));
      }
      var method = baseRest(function(path2, args) {
        return function(object) {
          return baseInvoke(object, path2, args);
        };
      });
      var methodOf = baseRest(function(object, args) {
        return function(path2) {
          return baseInvoke(object, path2, args);
        };
      });
      function mixin(object, source, options) {
        var props = keys(source), methodNames = baseFunctions(source, props);
        if (options == null && !(isObject(source) && (methodNames.length || !props.length))) {
          options = source;
          source = object;
          object = this;
          methodNames = baseFunctions(source, keys(source));
        }
        var chain2 = !(isObject(options) && "chain" in options) || !!options.chain, isFunc = isFunction(object);
        arrayEach(methodNames, function(methodName) {
          var func = source[methodName];
          object[methodName] = func;
          if (isFunc) {
            object.prototype[methodName] = function() {
              var chainAll = this.__chain__;
              if (chain2 || chainAll) {
                var result2 = object(this.__wrapped__), actions = result2.__actions__ = copyArray(this.__actions__);
                actions.push({func, args: arguments, thisArg: object});
                result2.__chain__ = chainAll;
                return result2;
              }
              return func.apply(object, arrayPush([this.value()], arguments));
            };
          }
        });
        return object;
      }
      function noConflict() {
        if (root._ === this) {
          root._ = oldDash;
        }
        return this;
      }
      function noop() {
      }
      function nthArg(n) {
        n = toInteger(n);
        return baseRest(function(args) {
          return baseNth(args, n);
        });
      }
      var over = createOver(arrayMap);
      var overEvery = createOver(arrayEvery);
      var overSome = createOver(arraySome);
      function property(path2) {
        return isKey(path2) ? baseProperty(toKey(path2)) : basePropertyDeep(path2);
      }
      function propertyOf(object) {
        return function(path2) {
          return object == null ? undefined2 : baseGet(object, path2);
        };
      }
      var range = createRange();
      var rangeRight = createRange(true);
      function stubArray() {
        return [];
      }
      function stubFalse() {
        return false;
      }
      function stubObject() {
        return {};
      }
      function stubString() {
        return "";
      }
      function stubTrue() {
        return true;
      }
      function times(n, iteratee2) {
        n = toInteger(n);
        if (n < 1 || n > MAX_SAFE_INTEGER) {
          return [];
        }
        var index = MAX_ARRAY_LENGTH, length = nativeMin(n, MAX_ARRAY_LENGTH);
        iteratee2 = getIteratee(iteratee2);
        n -= MAX_ARRAY_LENGTH;
        var result2 = baseTimes(length, iteratee2);
        while (++index < n) {
          iteratee2(index);
        }
        return result2;
      }
      function toPath(value) {
        if (isArray(value)) {
          return arrayMap(value, toKey);
        }
        return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
      }
      function uniqueId(prefix) {
        var id = ++idCounter;
        return toString(prefix) + id;
      }
      var add = createMathOperation(function(augend, addend) {
        return augend + addend;
      }, 0);
      var ceil = createRound("ceil");
      var divide = createMathOperation(function(dividend, divisor) {
        return dividend / divisor;
      }, 1);
      var floor = createRound("floor");
      function max(array) {
        return array && array.length ? baseExtremum(array, identity, baseGt) : undefined2;
      }
      function maxBy(array, iteratee2) {
        return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseGt) : undefined2;
      }
      function mean(array) {
        return baseMean(array, identity);
      }
      function meanBy(array, iteratee2) {
        return baseMean(array, getIteratee(iteratee2, 2));
      }
      function min(array) {
        return array && array.length ? baseExtremum(array, identity, baseLt) : undefined2;
      }
      function minBy(array, iteratee2) {
        return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseLt) : undefined2;
      }
      var multiply = createMathOperation(function(multiplier, multiplicand) {
        return multiplier * multiplicand;
      }, 1);
      var round = createRound("round");
      var subtract = createMathOperation(function(minuend, subtrahend) {
        return minuend - subtrahend;
      }, 0);
      function sum(array) {
        return array && array.length ? baseSum(array, identity) : 0;
      }
      function sumBy(array, iteratee2) {
        return array && array.length ? baseSum(array, getIteratee(iteratee2, 2)) : 0;
      }
      lodash.after = after;
      lodash.ary = ary;
      lodash.assign = assign;
      lodash.assignIn = assignIn;
      lodash.assignInWith = assignInWith;
      lodash.assignWith = assignWith;
      lodash.at = at;
      lodash.before = before;
      lodash.bind = bind;
      lodash.bindAll = bindAll;
      lodash.bindKey = bindKey;
      lodash.castArray = castArray;
      lodash.chain = chain;
      lodash.chunk = chunk;
      lodash.compact = compact;
      lodash.concat = concat;
      lodash.cond = cond;
      lodash.conforms = conforms;
      lodash.constant = constant;
      lodash.countBy = countBy;
      lodash.create = create;
      lodash.curry = curry;
      lodash.curryRight = curryRight;
      lodash.debounce = debounce;
      lodash.defaults = defaults;
      lodash.defaultsDeep = defaultsDeep;
      lodash.defer = defer;
      lodash.delay = delay;
      lodash.difference = difference;
      lodash.differenceBy = differenceBy;
      lodash.differenceWith = differenceWith;
      lodash.drop = drop;
      lodash.dropRight = dropRight;
      lodash.dropRightWhile = dropRightWhile;
      lodash.dropWhile = dropWhile;
      lodash.fill = fill;
      lodash.filter = filter;
      lodash.flatMap = flatMap;
      lodash.flatMapDeep = flatMapDeep;
      lodash.flatMapDepth = flatMapDepth;
      lodash.flatten = flatten;
      lodash.flattenDeep = flattenDeep;
      lodash.flattenDepth = flattenDepth;
      lodash.flip = flip;
      lodash.flow = flow;
      lodash.flowRight = flowRight;
      lodash.fromPairs = fromPairs;
      lodash.functions = functions;
      lodash.functionsIn = functionsIn;
      lodash.groupBy = groupBy;
      lodash.initial = initial;
      lodash.intersection = intersection;
      lodash.intersectionBy = intersectionBy;
      lodash.intersectionWith = intersectionWith;
      lodash.invert = invert;
      lodash.invertBy = invertBy;
      lodash.invokeMap = invokeMap;
      lodash.iteratee = iteratee;
      lodash.keyBy = keyBy;
      lodash.keys = keys;
      lodash.keysIn = keysIn;
      lodash.map = map;
      lodash.mapKeys = mapKeys;
      lodash.mapValues = mapValues;
      lodash.matches = matches;
      lodash.matchesProperty = matchesProperty;
      lodash.memoize = memoize;
      lodash.merge = merge;
      lodash.mergeWith = mergeWith;
      lodash.method = method;
      lodash.methodOf = methodOf;
      lodash.mixin = mixin;
      lodash.negate = negate;
      lodash.nthArg = nthArg;
      lodash.omit = omit;
      lodash.omitBy = omitBy;
      lodash.once = once;
      lodash.orderBy = orderBy;
      lodash.over = over;
      lodash.overArgs = overArgs;
      lodash.overEvery = overEvery;
      lodash.overSome = overSome;
      lodash.partial = partial;
      lodash.partialRight = partialRight;
      lodash.partition = partition;
      lodash.pick = pick;
      lodash.pickBy = pickBy;
      lodash.property = property;
      lodash.propertyOf = propertyOf;
      lodash.pull = pull;
      lodash.pullAll = pullAll;
      lodash.pullAllBy = pullAllBy;
      lodash.pullAllWith = pullAllWith;
      lodash.pullAt = pullAt;
      lodash.range = range;
      lodash.rangeRight = rangeRight;
      lodash.rearg = rearg;
      lodash.reject = reject;
      lodash.remove = remove;
      lodash.rest = rest;
      lodash.reverse = reverse;
      lodash.sampleSize = sampleSize;
      lodash.set = set;
      lodash.setWith = setWith;
      lodash.shuffle = shuffle;
      lodash.slice = slice;
      lodash.sortBy = sortBy;
      lodash.sortedUniq = sortedUniq;
      lodash.sortedUniqBy = sortedUniqBy;
      lodash.split = split;
      lodash.spread = spread;
      lodash.tail = tail;
      lodash.take = take;
      lodash.takeRight = takeRight;
      lodash.takeRightWhile = takeRightWhile;
      lodash.takeWhile = takeWhile;
      lodash.tap = tap;
      lodash.throttle = throttle;
      lodash.thru = thru;
      lodash.toArray = toArray;
      lodash.toPairs = toPairs;
      lodash.toPairsIn = toPairsIn;
      lodash.toPath = toPath;
      lodash.toPlainObject = toPlainObject;
      lodash.transform = transform;
      lodash.unary = unary;
      lodash.union = union;
      lodash.unionBy = unionBy;
      lodash.unionWith = unionWith;
      lodash.uniq = uniq;
      lodash.uniqBy = uniqBy;
      lodash.uniqWith = uniqWith;
      lodash.unset = unset;
      lodash.unzip = unzip;
      lodash.unzipWith = unzipWith;
      lodash.update = update;
      lodash.updateWith = updateWith;
      lodash.values = values;
      lodash.valuesIn = valuesIn;
      lodash.without = without;
      lodash.words = words;
      lodash.wrap = wrap;
      lodash.xor = xor;
      lodash.xorBy = xorBy;
      lodash.xorWith = xorWith;
      lodash.zip = zip;
      lodash.zipObject = zipObject;
      lodash.zipObjectDeep = zipObjectDeep;
      lodash.zipWith = zipWith;
      lodash.entries = toPairs;
      lodash.entriesIn = toPairsIn;
      lodash.extend = assignIn;
      lodash.extendWith = assignInWith;
      mixin(lodash, lodash);
      lodash.add = add;
      lodash.attempt = attempt;
      lodash.camelCase = camelCase;
      lodash.capitalize = capitalize;
      lodash.ceil = ceil;
      lodash.clamp = clamp;
      lodash.clone = clone;
      lodash.cloneDeep = cloneDeep;
      lodash.cloneDeepWith = cloneDeepWith;
      lodash.cloneWith = cloneWith;
      lodash.conformsTo = conformsTo;
      lodash.deburr = deburr;
      lodash.defaultTo = defaultTo;
      lodash.divide = divide;
      lodash.endsWith = endsWith;
      lodash.eq = eq;
      lodash.escape = escape2;
      lodash.escapeRegExp = escapeRegExp;
      lodash.every = every;
      lodash.find = find;
      lodash.findIndex = findIndex;
      lodash.findKey = findKey;
      lodash.findLast = findLast;
      lodash.findLastIndex = findLastIndex;
      lodash.findLastKey = findLastKey;
      lodash.floor = floor;
      lodash.forEach = forEach;
      lodash.forEachRight = forEachRight;
      lodash.forIn = forIn;
      lodash.forInRight = forInRight;
      lodash.forOwn = forOwn;
      lodash.forOwnRight = forOwnRight;
      lodash.get = get;
      lodash.gt = gt;
      lodash.gte = gte;
      lodash.has = has;
      lodash.hasIn = hasIn;
      lodash.head = head;
      lodash.identity = identity;
      lodash.includes = includes;
      lodash.indexOf = indexOf;
      lodash.inRange = inRange;
      lodash.invoke = invoke;
      lodash.isArguments = isArguments;
      lodash.isArray = isArray;
      lodash.isArrayBuffer = isArrayBuffer;
      lodash.isArrayLike = isArrayLike;
      lodash.isArrayLikeObject = isArrayLikeObject;
      lodash.isBoolean = isBoolean;
      lodash.isBuffer = isBuffer;
      lodash.isDate = isDate;
      lodash.isElement = isElement;
      lodash.isEmpty = isEmpty;
      lodash.isEqual = isEqual2;
      lodash.isEqualWith = isEqualWith;
      lodash.isError = isError;
      lodash.isFinite = isFinite2;
      lodash.isFunction = isFunction;
      lodash.isInteger = isInteger;
      lodash.isLength = isLength;
      lodash.isMap = isMap;
      lodash.isMatch = isMatch;
      lodash.isMatchWith = isMatchWith;
      lodash.isNaN = isNaN2;
      lodash.isNative = isNative;
      lodash.isNil = isNil;
      lodash.isNull = isNull;
      lodash.isNumber = isNumber;
      lodash.isObject = isObject;
      lodash.isObjectLike = isObjectLike;
      lodash.isPlainObject = isPlainObject;
      lodash.isRegExp = isRegExp;
      lodash.isSafeInteger = isSafeInteger;
      lodash.isSet = isSet;
      lodash.isString = isString;
      lodash.isSymbol = isSymbol;
      lodash.isTypedArray = isTypedArray;
      lodash.isUndefined = isUndefined;
      lodash.isWeakMap = isWeakMap;
      lodash.isWeakSet = isWeakSet;
      lodash.join = join;
      lodash.kebabCase = kebabCase;
      lodash.last = last;
      lodash.lastIndexOf = lastIndexOf;
      lodash.lowerCase = lowerCase;
      lodash.lowerFirst = lowerFirst;
      lodash.lt = lt;
      lodash.lte = lte;
      lodash.max = max;
      lodash.maxBy = maxBy;
      lodash.mean = mean;
      lodash.meanBy = meanBy;
      lodash.min = min;
      lodash.minBy = minBy;
      lodash.stubArray = stubArray;
      lodash.stubFalse = stubFalse;
      lodash.stubObject = stubObject;
      lodash.stubString = stubString;
      lodash.stubTrue = stubTrue;
      lodash.multiply = multiply;
      lodash.nth = nth;
      lodash.noConflict = noConflict;
      lodash.noop = noop;
      lodash.now = now;
      lodash.pad = pad;
      lodash.padEnd = padEnd;
      lodash.padStart = padStart;
      lodash.parseInt = parseInt2;
      lodash.random = random;
      lodash.reduce = reduce;
      lodash.reduceRight = reduceRight;
      lodash.repeat = repeat;
      lodash.replace = replace;
      lodash.result = result;
      lodash.round = round;
      lodash.runInContext = runInContext2;
      lodash.sample = sample;
      lodash.size = size;
      lodash.snakeCase = snakeCase;
      lodash.some = some;
      lodash.sortedIndex = sortedIndex;
      lodash.sortedIndexBy = sortedIndexBy;
      lodash.sortedIndexOf = sortedIndexOf;
      lodash.sortedLastIndex = sortedLastIndex;
      lodash.sortedLastIndexBy = sortedLastIndexBy;
      lodash.sortedLastIndexOf = sortedLastIndexOf;
      lodash.startCase = startCase;
      lodash.startsWith = startsWith;
      lodash.subtract = subtract;
      lodash.sum = sum;
      lodash.sumBy = sumBy;
      lodash.template = template;
      lodash.times = times;
      lodash.toFinite = toFinite;
      lodash.toInteger = toInteger;
      lodash.toLength = toLength;
      lodash.toLower = toLower;
      lodash.toNumber = toNumber;
      lodash.toSafeInteger = toSafeInteger;
      lodash.toString = toString;
      lodash.toUpper = toUpper;
      lodash.trim = trim;
      lodash.trimEnd = trimEnd;
      lodash.trimStart = trimStart;
      lodash.truncate = truncate;
      lodash.unescape = unescape;
      lodash.uniqueId = uniqueId;
      lodash.upperCase = upperCase;
      lodash.upperFirst = upperFirst;
      lodash.each = forEach;
      lodash.eachRight = forEachRight;
      lodash.first = head;
      mixin(lodash, function() {
        var source = {};
        baseForOwn(lodash, function(func, methodName) {
          if (!hasOwnProperty.call(lodash.prototype, methodName)) {
            source[methodName] = func;
          }
        });
        return source;
      }(), {chain: false});
      lodash.VERSION = VERSION;
      arrayEach(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(methodName) {
        lodash[methodName].placeholder = lodash;
      });
      arrayEach(["drop", "take"], function(methodName, index) {
        LazyWrapper.prototype[methodName] = function(n) {
          n = n === undefined2 ? 1 : nativeMax(toInteger(n), 0);
          var result2 = this.__filtered__ && !index ? new LazyWrapper(this) : this.clone();
          if (result2.__filtered__) {
            result2.__takeCount__ = nativeMin(n, result2.__takeCount__);
          } else {
            result2.__views__.push({
              size: nativeMin(n, MAX_ARRAY_LENGTH),
              type: methodName + (result2.__dir__ < 0 ? "Right" : "")
            });
          }
          return result2;
        };
        LazyWrapper.prototype[methodName + "Right"] = function(n) {
          return this.reverse()[methodName](n).reverse();
        };
      });
      arrayEach(["filter", "map", "takeWhile"], function(methodName, index) {
        var type = index + 1, isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
        LazyWrapper.prototype[methodName] = function(iteratee2) {
          var result2 = this.clone();
          result2.__iteratees__.push({
            iteratee: getIteratee(iteratee2, 3),
            type
          });
          result2.__filtered__ = result2.__filtered__ || isFilter;
          return result2;
        };
      });
      arrayEach(["head", "last"], function(methodName, index) {
        var takeName = "take" + (index ? "Right" : "");
        LazyWrapper.prototype[methodName] = function() {
          return this[takeName](1).value()[0];
        };
      });
      arrayEach(["initial", "tail"], function(methodName, index) {
        var dropName = "drop" + (index ? "" : "Right");
        LazyWrapper.prototype[methodName] = function() {
          return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
        };
      });
      LazyWrapper.prototype.compact = function() {
        return this.filter(identity);
      };
      LazyWrapper.prototype.find = function(predicate) {
        return this.filter(predicate).head();
      };
      LazyWrapper.prototype.findLast = function(predicate) {
        return this.reverse().find(predicate);
      };
      LazyWrapper.prototype.invokeMap = baseRest(function(path2, args) {
        if (typeof path2 == "function") {
          return new LazyWrapper(this);
        }
        return this.map(function(value) {
          return baseInvoke(value, path2, args);
        });
      });
      LazyWrapper.prototype.reject = function(predicate) {
        return this.filter(negate(getIteratee(predicate)));
      };
      LazyWrapper.prototype.slice = function(start, end) {
        start = toInteger(start);
        var result2 = this;
        if (result2.__filtered__ && (start > 0 || end < 0)) {
          return new LazyWrapper(result2);
        }
        if (start < 0) {
          result2 = result2.takeRight(-start);
        } else if (start) {
          result2 = result2.drop(start);
        }
        if (end !== undefined2) {
          end = toInteger(end);
          result2 = end < 0 ? result2.dropRight(-end) : result2.take(end - start);
        }
        return result2;
      };
      LazyWrapper.prototype.takeRightWhile = function(predicate) {
        return this.reverse().takeWhile(predicate).reverse();
      };
      LazyWrapper.prototype.toArray = function() {
        return this.take(MAX_ARRAY_LENGTH);
      };
      baseForOwn(LazyWrapper.prototype, function(func, methodName) {
        var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName), isTaker = /^(?:head|last)$/.test(methodName), lodashFunc = lodash[isTaker ? "take" + (methodName == "last" ? "Right" : "") : methodName], retUnwrapped = isTaker || /^find/.test(methodName);
        if (!lodashFunc) {
          return;
        }
        lodash.prototype[methodName] = function() {
          var value = this.__wrapped__, args = isTaker ? [1] : arguments, isLazy = value instanceof LazyWrapper, iteratee2 = args[0], useLazy = isLazy || isArray(value);
          var interceptor = function(value2) {
            var result3 = lodashFunc.apply(lodash, arrayPush([value2], args));
            return isTaker && chainAll ? result3[0] : result3;
          };
          if (useLazy && checkIteratee && typeof iteratee2 == "function" && iteratee2.length != 1) {
            isLazy = useLazy = false;
          }
          var chainAll = this.__chain__, isHybrid = !!this.__actions__.length, isUnwrapped = retUnwrapped && !chainAll, onlyLazy = isLazy && !isHybrid;
          if (!retUnwrapped && useLazy) {
            value = onlyLazy ? value : new LazyWrapper(this);
            var result2 = func.apply(value, args);
            result2.__actions__.push({func: thru, args: [interceptor], thisArg: undefined2});
            return new LodashWrapper(result2, chainAll);
          }
          if (isUnwrapped && onlyLazy) {
            return func.apply(this, args);
          }
          result2 = this.thru(interceptor);
          return isUnwrapped ? isTaker ? result2.value()[0] : result2.value() : result2;
        };
      });
      arrayEach(["pop", "push", "shift", "sort", "splice", "unshift"], function(methodName) {
        var func = arrayProto[methodName], chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru", retUnwrapped = /^(?:pop|shift)$/.test(methodName);
        lodash.prototype[methodName] = function() {
          var args = arguments;
          if (retUnwrapped && !this.__chain__) {
            var value = this.value();
            return func.apply(isArray(value) ? value : [], args);
          }
          return this[chainName](function(value2) {
            return func.apply(isArray(value2) ? value2 : [], args);
          });
        };
      });
      baseForOwn(LazyWrapper.prototype, function(func, methodName) {
        var lodashFunc = lodash[methodName];
        if (lodashFunc) {
          var key = lodashFunc.name + "";
          if (!hasOwnProperty.call(realNames, key)) {
            realNames[key] = [];
          }
          realNames[key].push({name: methodName, func: lodashFunc});
        }
      });
      realNames[createHybrid(undefined2, WRAP_BIND_KEY_FLAG).name] = [{
        name: "wrapper",
        func: undefined2
      }];
      LazyWrapper.prototype.clone = lazyClone;
      LazyWrapper.prototype.reverse = lazyReverse;
      LazyWrapper.prototype.value = lazyValue;
      lodash.prototype.at = wrapperAt;
      lodash.prototype.chain = wrapperChain;
      lodash.prototype.commit = wrapperCommit;
      lodash.prototype.next = wrapperNext;
      lodash.prototype.plant = wrapperPlant;
      lodash.prototype.reverse = wrapperReverse;
      lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
      lodash.prototype.first = lodash.prototype.head;
      if (symIterator) {
        lodash.prototype[symIterator] = wrapperToIterator;
      }
      return lodash;
    };
    var _ = runInContext();
    if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
      root._ = _;
      define(function() {
        return _;
      });
    } else if (freeModule) {
      (freeModule.exports = _)._ = _;
      freeExports._ = _;
    } else {
      root._ = _;
    }
  }).call(exports2);
});

// src/index.ts
__markAsModule(exports);
__export(exports, {
  DataMapper: () => DataMapper_default,
  DbHelper: () => DbHelper_default,
  MigrationHelper: () => MigrationHelper_default,
  RestAPI: () => RestAPI_default
});

// node_modules/source-map-support/register.js
require_source_map_support().install();

// src/lib/SchemaHelper.ts
var import_path = __toModule(require("path"));
var import_fs = __toModule(require("fs"));
var schema = void 0;
(function loadSchema() {
  let configPath = process.env.SCHEMA_PATH || import_path.resolve(process.cwd(), "config", "schema.json");
  if (!import_fs.existsSync(configPath)) {
    throw "Schema file not found at: " + configPath;
  }
  schema = JSON.parse(import_fs.readFileSync(configPath, {encoding: "utf-8"}));
})();
var SchemaHelper = class {
  constructor() {
    this._schemas = {};
  }
  static getSchema(name) {
    if (!schema) {
      throw "Could not locate schema.json file";
    }
    if (name) {
      if (typeof schema[name] != "undefined") {
        return schema[name];
      } else {
        throw `Type ${name} does not exist within the schema`;
      }
    }
    return schema;
  }
  static getPropType(pDef) {
    if (typeof pDef == "string") {
      return pDef;
    } else {
      if (pDef.type) {
        return pDef.type;
      } else if (pDef.enum) {
        return "string";
      } else {
        throw "No type found for property.";
      }
    }
  }
  static getSanitizedPropType(pDef) {
    function _san(type2) {
      switch (type2) {
        case "string":
        case "email":
          return "string";
        case "date-time":
          return "datetime";
        case "int":
          return "int";
        default:
          return "string";
      }
    }
    let type = "";
    if (typeof pDef == "string") {
      type = pDef;
    } else {
      if (pDef.type) {
        type = pDef.type;
      } else if (pDef.enum) {
        type = "string";
      } else {
        throw "No type found for property.";
      }
    }
    return _san(type);
  }
};
var SchemaHelper_default = SchemaHelper;

// src/lib/DbHelper.ts
var mysql = __toModule(require_mysql());

// src/lib/Config.ts
var import_path2 = __toModule(require("path"));
var import_fs2 = __toModule(require("fs"));
function getConfig() {
  let configPath = process.env.CONFIG_PATH || import_path2.resolve(process.cwd(), "config", "config.json");
  try {
    if (!import_fs2.existsSync(configPath)) {
      return {};
    }
    var config = import_fs2.readFileSync(configPath, {encoding: "utf-8"});
    return JSON.parse(config);
  } catch (e) {
    console.log("Error parsing config file: " + configPath, e);
    return {};
  }
}
var Config_default = getConfig();

// src/utils.ts
var import_fs3 = __toModule(require("fs"));
function lpad(str, padChar, totalLength) {
  str = str.toString();
  var neededPadding = totalLength - str.length;
  for (var i = 0; i < neededPadding; i++) {
    str = padChar + str;
  }
  return str;
}
function getdef(arg, defaultVal, allFalsy = false) {
  return typeof arg == "undefined" ? defaultVal : allFalsy ? !arg ? defaultVal : arg : arg;
}
function mysqlDate(date) {
  let d = date || new Date();
  return d.toISOString().slice(0, 19).replace("T", " ");
}
function stripFirstLastSlash(str) {
  return str.replace(/^\/|\/$/g, "");
}
function mkDirSync(dir) {
  if (import_fs3.default.existsSync(dir)) {
    return;
  }
  try {
    import_fs3.default.mkdirSync(dir, {recursive: true});
  } catch (err) {
    if (err.code == "ENOENT") {
      import_fs3.default.mkdirSync(path.dirname(dir, {recursive: true}));
      import_fs3.default.mkdirSync(dir, {recursive: true});
    }
  }
}

// src/lib/DbHelper.ts
var _DbHelper = class {
  static getDbConfig() {
    let dbConfig;
    if (process.env.DATABASE_URL) {
      return process.env.DATABASE_URL;
    }
    if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_DATABASE) {
      dbConfig = {
        driver: process.env.DB_DRIVER || "mysql",
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        multipleStatement: typeof process.env.DB_MULTI_STATEMENTS == "undefined" ? false : process.env.DB_MULTI_STATEMENTS
      };
      return dbConfig;
    }
    return null;
  }
  static isInitialized() {
    return this._isInitialized;
  }
  static initialize() {
    if (!this._isInitialized) {
      var self2 = this;
      let dbConfig;
      try {
        dbConfig = _DbHelper.getDbConfig();
        if (!dbConfig) {
          if (!Config_default.database) {
            throw new Error("Could not find database config in environment variables or config.json");
          }
          dbConfig = Config_default.database;
        }
      } catch (e) {
        console.log("Error initialize()", e, "Config:", dbConfig);
        throw "Error loading database configuration. Cannot proceed. " + JSON.stringify(e);
      }
      if (typeof dbConfig == "string") {
        _DbHelper._pool = mysql.createPool(dbConfig);
      } else {
        _DbHelper._pool = mysql.createPool({
          connectionLimit: 100,
          host: dbConfig.host,
          port: dbConfig.port || 3306,
          user: dbConfig.user,
          password: dbConfig.password,
          database: dbConfig.database,
          multipleStatements: typeof dbConfig.multipleStatements == "undefined" ? true : dbConfig.multipleStatements
        });
      }
      this._isInitialized = true;
    }
    return this;
  }
  static escapeString(input) {
    return input ? mysql.escape(input) : "''";
  }
  static async queryOne(sql, data) {
    return new Promise(async (resolve4, reject) => {
      try {
        await _DbHelper._pool.getConnection((err, connection) => {
          if (err) {
            console.log(">> Db.getConnection() ERROR -> ", err, "SQL:", sql);
            return reject({
              error: err,
              query: sql,
              data
            });
          }
          connection.query(sql, data, (err2, qr) => {
            connection.release();
            if (err2) {
              console.log(">> Db.query() ERROR -> ", err2, "SQL:", sql);
              return reject({
                error: err2,
                query: sql,
                data
              });
            } else {
              let result = null;
              if (typeof qr.length != "undefined") {
                result = qr.length ? qr[0] : null;
              } else {
                if (qr != null)
                  result = qr;
              }
              return resolve4(result);
            }
          });
        });
      } catch (err) {
        return reject(err);
      }
    });
  }
  static async query(sql, data) {
    const self2 = this;
    return new Promise((resolve4, reject) => {
      _DbHelper._pool.getConnection((err, connection) => {
        if (err) {
          console.log(">> Db.getConnection() ERROR -> ", err, "SQL:", sql);
          return reject({
            error: err,
            query: sql,
            data
          });
        }
        connection.query(sql, data, (err2, qr) => {
          connection.release();
          if (err2) {
            console.log(">> Db.query() ERROR -> ", err2, "SQL:", sql);
            reject({
              error: err2,
              query: sql,
              data
            });
          } else {
            resolve4(qr);
          }
        });
      });
    });
  }
  static async upsert(table, data, indexName = "id") {
    let upsertResult = null;
    if (typeof data != "object")
      throw new Error("Upsert data must be an object.");
    return new Promise(async (resolve4, reject) => {
      if (typeof data[indexName] == "undefined") {
        upsertResult = await _DbHelper.insert(table, data, indexName);
      } else {
        let sql = `SELECT * FROM ${table} WHERE ${indexName}='${mysql.escape(data[indexName])}'`;
        let existingResult = await _DbHelper.queryOne(sql);
        if (existingResult == "not-found") {
          upsertResult = await _DbHelper.insert(table, data, indexName);
        } else {
          upsertResult = await _DbHelper.update(table, data, indexName);
        }
      }
      return resolve4(upsertResult);
    });
  }
  static async insert(table, data, indexName = "id") {
    return new Promise(async (resolve4, reject) => {
      let cols = _DbHelper._generateTableCols(data, indexName);
      let colVals = _DbHelper._generateTableVals(data, indexName);
      let sql = `INSERT INTO ${table} (${cols}) VALUES (${colVals})`;
      let result = await _DbHelper.queryOne(sql);
      if (result && typeof data.id == "undefined") {
        result.id = data.id = result.insertId;
      }
      return resolve4(data);
    });
  }
  static async update(table, data, indexName = "id") {
    return new Promise(async (resolve4, reject) => {
      let updateVals = _DbHelper._generateTableUpdateVals(data, indexName);
      let indexValue = typeof data[indexName] == "string" ? mysql.escape(data[indexName]) : data[indexName];
      let sql = `UPDATE ${table} SET ${updateVals} WHERE ${indexName}=${indexValue}`;
      let result = await _DbHelper.queryOne(sql);
      return resolve4(data);
    });
  }
  static async deleteById(table, id) {
    return new Promise(async (resolve4, reject) => {
      let sql = `DELETE FROM ${table} WHERE id=${id}`;
      let result = await _DbHelper.queryOne(sql);
      return resolve4(result);
    });
  }
  static _generateTableCols(data, indexName = null, updateIndex = false) {
    const cols = [];
    for (const prop in data) {
      if (data.hasOwnProperty(prop)) {
        if (prop == indexName && !updateIndex || data[prop] == void 0)
          continue;
        cols.push(prop);
      }
    }
    return cols.join(",");
  }
  static _generateTableVals(data, indexName = null, updateIndex = false) {
    let colVals = "";
    let delim = "";
    for (const prop in data) {
      if (data.hasOwnProperty(prop)) {
        if (prop == indexName && !updateIndex || data[prop] == void 0)
          continue;
        const propVal = typeof data[prop] == "string" ? this.escapeString(data[prop]) : data[prop] instanceof Date ? this.escapeString(mysqlDate(data[prop])) : data[prop];
        colVals += delim + propVal;
        delim = ", ";
      }
    }
    return colVals;
  }
  static _generateTableUpdateVals(data, indexName = null, updateIndex = false) {
    let updateVals = "";
    let delim = "";
    for (const prop in data) {
      if (data.hasOwnProperty(prop)) {
        if (prop == indexName && !updateIndex || data[prop] == void 0)
          continue;
        const propVal = typeof data[prop] == "string" ? this.escapeString(data[prop]) : data[prop] instanceof Date ? this.escapeString(mysqlDate(data[prop])) : data[prop];
        updateVals += delim + `${prop}=${propVal}`;
        delim = ", ";
      }
    }
    return updateVals;
  }
};
var DbHelper = _DbHelper;
DbHelper._isInitialized = false;
var DbHelper_default = DbHelper;

// src/lib/DataMapper.ts
var DataMapper = class {
  constructor() {
    this.schema = SchemaHelper_default.getSchema();
  }
  get(type, params, limit) {
    let query = this.getQueryString(type, params, limit);
    return new Promise((resolve4, reject) => {
      DbHelper_default.query(query).then((r) => {
        return resolve4(r);
      }).catch((e) => {
        throw e;
      });
    });
  }
  async getOne(type, params) {
    let r = await this.get(type, params, 1);
    if (r.length)
      return r[0];
    return null;
  }
  save(type, o) {
    let query = this.upsertQueryString(type, o);
    let isInsert = o["id"] ? false : true;
    return new Promise((resolve4, reject) => {
      DbHelper_default.query(query).then((r) => {
        if (isInsert) {
          if (r[r.length - 1][0].last_id) {
            o.id = r[r.length - 1][0].last_id;
          }
        }
        return resolve4(o);
      }).catch((e) => {
        throw e;
      });
    });
  }
  delete(type, params) {
    let query = this.deleteQueryString(type, params);
    return new Promise((resolve4, reject) => {
      DbHelper_default.query(query).then((r) => {
        return resolve4(r);
      }).catch((e) => {
        throw e;
      });
    });
  }
  getQueryString(type, params, limit) {
    if (!type)
      throw "Cannot get without a type";
    if (typeof this.schema[type] == "undefined")
      throw "Unknown object type for save: " + type;
    let query = `SELECT * FROM ${type}`;
    if (params) {
      if (typeof params == "number") {
        query += ` WHERE id=${params}`;
      } else if (typeof params == "object") {
        var delim = " WHERE ";
        for (var pName in params) {
          if (params.hasOwnProperty(pName)) {
            let pVal = params[pName];
            let pDef = this.schema[type][pName];
            let pQuery = this._makePropQuery(pName, pVal, pDef);
            query += delim + pQuery;
            delim = " AND";
          }
        }
        if (limit) {
          query += ` LIMIT ${limit}`;
        }
      } else {
        throw "Unknown parameter type to get() method. Only integer and object supported.";
      }
    }
    return query;
  }
  upsertQueryString(type, o) {
    if (!type || !o)
      throw "Cannot save without a type and an object";
    if (typeof this.schema[type] == "undefined")
      throw "Unknown object type for save: " + type;
    let query, data, schema3 = this.schema[type], isInsert = false;
    if (typeof o != "object") {
      throw "Object parameter must be an object, " + typeof o + " found";
    }
    if (o["id"]) {
      var valString = "", delim = " ";
      for (var p in schema3.properties) {
        if (o.hasOwnProperty(p)) {
          valString += delim + p + "=" + this.tryEscape(o[p]);
          delim = ", ";
        }
      }
      query = `UPDATE ${type} SET ${valString} WHERE id=${o["id"]}`;
    } else {
      isInsert = true;
      var propString = "", valString = "", delim = "";
      for (var p in schema3.properties) {
        if (o.hasOwnProperty(p)) {
          let propType = SchemaHelper_default.getSanitizedPropType(schema3.properties[p]);
          propString += delim + p;
          valString += delim + this.tryEscape(o[p], propType);
          delim = ",";
        }
      }
      query = `INSERT INTO ${type} (${propString}) VALUES (${valString});
                    SELECT LAST_INSERT_ID() as last_id;`;
    }
    return query;
  }
  deleteQueryString(type, params) {
    if (!type)
      throw "Cannot delete without a type";
    if (typeof this.schema[type] == "undefined")
      throw "Unknown object type for save: " + type;
    if (!params.id) {
      throw "Delete requires an id parameter";
    }
    let query = `DELETE FROM ${type}`;
    if (params) {
      var delim = " WHERE ";
      for (var pName in params) {
        if (params.hasOwnProperty(pName)) {
          let pVal = params[pName];
          let pDef = this.schema[type][pName];
          let pQuery = this._makePropQuery(pName, pVal, pDef);
          query += delim + pQuery;
          delim = " AND";
        }
      }
    }
    return query;
  }
  tryEscape(propVal, propType) {
    if (typeof propType == "undefined")
      propType = typeof propVal;
    if (["string", "email", "enum"].includes(propType)) {
      return DbHelper_default.escapeString(propVal);
    }
    if (propType == "date-time" || propType == "datetime") {
      return DbHelper_default.escapeString(propVal);
    }
    return propVal;
  }
  _makePropQuery(pName, pVal, pDef) {
    let q = pName;
    let pType = this._getPropType(pVal, pDef);
    let eVal = this.tryEscape(pVal, pType);
    return `${pName}=${eVal}`;
  }
  _getPropType(propVal, propDef) {
    let type = "";
    if (typeof propDef == "object") {
      if (!propDef.type && !propDef.enum) {
        throw "Property definition requires a type property";
      } else if (propDef.enum) {
        type = "enum";
      } else {
        type = propDef.type.toLowerCase();
      }
    } else if (typeof propDef == "string") {
      type = propDef.toLowerCase();
    } else {
      type = typeof propVal;
    }
    return type;
  }
};
var DataMapper_default = new DataMapper();

// src/lib/ResourceHelper.ts
var schema2 = SchemaHelper_default.getSchema();
var ResourceHelper = class {
  static async get(request, response, params) {
    console.log("default object get", params);
    let d = null;
    let type = this.getTypeFromRequestUrl(request.url);
    if (!_isValidTypeRequest(type, params, "GET")) {
      throw "Invalid request for type: " + type;
    }
    d = await DataMapper_default.get(type, params);
    response.end(JSON.stringify({success: true, data: d}));
  }
  static async put(request, response, params) {
    console.log("default object put");
    let type = this.getTypeFromRequestUrl(request.url);
    let d = await DataMapper_default.save(type, params);
    response.end(JSON.stringify({success: true, data: d}));
  }
  static async post(request, response, params) {
    console.log("default object post");
    let d = null;
    let type = this.getTypeFromRequestUrl(request.url);
    if (!_isValidTypeRequest(type, params, "POST")) {
      throw "Invalid request for type: " + type;
    }
    try {
      let data = await parseBody(request);
      console.log("saving", type, data);
      d = await DataMapper_default.save(type, data);
      response.end(JSON.stringify({success: true, data: d}));
    } catch (e) {
      console.log("Error parsing request body JSON", e);
      return response.end({success: false, message: "Error parsing request body JSON"});
    }
  }
  static async patch(request, response, params) {
    console.log("default object patch");
    let type = this.getTypeFromRequestUrl(request.url);
    if (!params.id) {
      throw "Patch requires an id parameter";
    }
    let d = await DataMapper_default.save(type, params);
    response.end(JSON.stringify({success: true, data: d}));
  }
  static async delete(request, response, params) {
    console.log("default object delete");
    let type = this.getTypeFromRequestUrl(request.url);
    if (!params.id) {
      throw "Delete requires an id parameter";
    }
    let d = await DataMapper_default.delete(type, params);
    response.end(JSON.stringify({success: true, data: d}));
  }
  static getTypeFromRequestUrl(url) {
    let apiPrefix = RouteHelper_default.getApiPrefix();
    url = url.replace(apiPrefix, "");
    console.log("get type from url", url);
    let type = url.match(/\/?([a-zA-Z0-9]{0,})\/?/);
    return type[1];
  }
};
var ResourceHelper_default = ResourceHelper;
function _isValidTypeRequest(type, params, method) {
  if (schema2.hasOwnProperty(type)) {
    if (params) {
      let s = schema2[type].properties;
      for (var p in params) {
        if (params.hasOwnProperty(p)) {
          if (!s.hasOwnProperty(p)) {
            return false;
          }
        }
      }
      for (var p in s) {
        if (s.hasOwnProperty(p)) {
          if (!params.hasOwnProperty(p)) {
            if (s[p].required) {
              return false;
            }
          } else {
          }
        }
      }
    }
    return true;
  } else {
    console.log("schema doesnt have type", type, params);
    throw "Schema doesn't have type " + type;
    return false;
  }
}
function parseBody(req) {
  const FORM_DATA_TYPES = [
    "application/x-www-form-urlencoded",
    "multipart/form-data",
    "application/json"
  ];
  function _isDataType(header) {
    let types = FORM_DATA_TYPES.filter((t) => {
      return header.indexOf(t) >= 0;
    });
    return types.length > 0;
  }
  return new Promise((resolve4) => {
    if (_isDataType(req.headers["content-type"])) {
      const chunks = [];
      req.on("data", (chunk) => {
        chunks.push(chunk);
      });
      req.on("end", () => {
        req.body = Buffer.concat(chunks).toString();
        ;
        try {
          req.body = JSON.parse(req.body);
        } catch (e) {
          throw "Error parsing POST body, not JSON? TODO";
        }
        resolve4(req.body);
      });
    } else {
      req.body = null;
      resolve4(null);
    }
  });
}

// src/lib/RouteHelper.ts
var METHODS = ["GET", "PUT", "POST", "PATCH", "DELETE"];
var RouteHelper = class {
  static getApiPrefix() {
    let apiPrefix = stripFirstLastSlash(Config_default.apiPrefix || "");
    if (apiPrefix.length)
      apiPrefix = "/" + apiPrefix;
    apiPrefix += "/";
    return apiPrefix;
  }
  static registerAPIRoutes(router) {
    let apiPrefix = this.getApiPrefix();
    let schema3 = SchemaHelper_default.getSchema();
    for (let p in schema3) {
      let type = schema3[p];
      let urlEndpoint = apiPrefix + p;
      let registerDefaultRoutes = true;
      if (type.api) {
        if (typeof type.api.generate != "undefined" && !type.api.generate) {
          continue;
        }
        urlEndpoint = apiPrefix + getdef(type.api.urlPrefix, p);
        if (type.api.methods) {
          type.api.methods.forEach((m) => {
            let method = this._getSchemaMethod(m);
            let handler = this._getSchemaHandler(m);
            if (!["GET", "PUT", "POST"].includes(m)) {
              router.on(method, urlEndpoint, handler);
              console.log("route registerd", m, urlEndpoint);
            }
            router.on(method, urlEndpoint + "/:id", handler);
            console.log("route registerd", m, urlEndpoint + "/:id");
          });
          registerDefaultRoutes = false;
        }
      }
      if (registerDefaultRoutes) {
        this._registerDefaultRoutesForType(router, urlEndpoint);
      }
    }
    router.on("GET", apiPrefix + "schema", (req, res) => {
      res.end(JSON.stringify(schema3));
    });
  }
  static _registerDefaultRoutesForType(router, urlEndpoint) {
    METHODS.forEach((m) => {
      let handler = ResourceHelper_default[m.toLowerCase()];
      if (typeof handler == "function") {
        if (["GET", "PUT", "POST"].includes(m)) {
          router.on(m, urlEndpoint, handler);
        }
        router.on(m, urlEndpoint + "/:id", handler);
      } else {
        throw "Could not obtain default route handler for: " + m;
      }
    });
  }
  static _getSchemaMethod(methodDef) {
    let m = "";
    if (typeof methodDef == "object") {
      if (!methodDef.type) {
        throw "Method definition requires a type property";
      } else {
        m = methodDef.type.toUpperCase();
      }
    } else {
      m = methodDef.toUpperCase();
    }
    if (!METHODS.includes(m)) {
      throw `${m} is not a valid method`;
    }
    return m;
  }
  static _getDefaultHandler(method) {
    let h = ResourceHelper_default[method.toLowerCase()];
    if (typeof h != "function") {
      throw "Error obtaining default handler for method: " + method;
    }
    return h;
  }
  static _getSchemaHandler(methodDef) {
    let handler = void 0;
    let method = this._getSchemaMethod(methodDef);
    if (typeof methodDef == "object") {
      if (!methodDef.handler) {
        handler = this._getDefaultHandler(method);
      } else {
        handler = methodDef.handler;
      }
    } else {
      handler = this._getDefaultHandler(method);
      if (!handler) {
        throw "Could not obtain a handler for the given method: " + method;
      }
    }
    return handler;
  }
};
var RouteHelper_default = RouteHelper;

// src/lib/RestAPI.ts
var RestAPI = class {
  constructor(configPath, schemaPath) {
    this.routesRegistered = false;
    if (configPath && schemaPath) {
      process.env["CONFIG_PATH"] = configPath;
      process.env["SCHEMA_PATH"] = schemaPath;
    }
    if (!Config_default.apiEnabled) {
      return;
    }
    this.router = require_find_my_way()({
      ignoreTrailingSlash: true,
      defaultRoute: (req, res) => {
        res.end(JSON.stringify({
          success: false,
          message: "Endpoint not found."
        }));
      }
    });
    let registerRoutes = true;
    if (typeof Config_default.autoRegisterRoutes != "undefined") {
      if (!Config_default.autoRegisterRoutes) {
        registerRoutes = false;
      }
    }
    if (registerRoutes) {
      this.registerRoutes();
    }
  }
  registerRoutes() {
    if (!Config_default.apiEnabled) {
      throw "API is not enabled. Please set 'apiEnabled' to true in config.json";
    }
    if (!this.routesRegistered) {
      RouteHelper_default.registerAPIRoutes(this.router);
      this.routesRegistered = true;
    }
  }
  handler(request, response, context) {
    this.router.lookup(request, response, context);
    return true;
  }
};
var RestAPI_default = RestAPI;

// src/lib/MigrationHelper.ts
var import_fs4 = __toModule(require("fs"));
var import_path3 = __toModule(require("path"));
var import_lodash = __toModule(require_lodash());
var MigrationHelper = class {
  generateMigration(currSchema, newSchema, migrationsDir) {
    if (currSchema != newSchema) {
      let newSchemaClone = JSON.parse(JSON.stringify(newSchema));
      let {up, down} = this.generateDiffOperations(currSchema, newSchema);
      if (!up.length && !down.length) {
        return false;
      }
      let migrationCode = this.generateMigrationCode(up, down);
      this.writeMigration(migrationCode, newSchemaClone, migrationsDir);
      return true;
    }
  }
  writeMigration(migrationCode, newSchema, migrationsDir) {
    let migrationFilePath = import_path3.resolve(migrationsDir, this._formatDate(new Date()) + "-generated.js");
    mkDirSync(migrationsDir);
    import_fs4.writeFile(migrationFilePath, migrationCode, (err) => {
      if (err)
        console.log(err);
      console.log("Successfully generated migration file:\n", migrationFilePath);
    });
  }
  generateDiffOperations(currentSchema, newSchema) {
    let ops = {
      up: [],
      down: []
    };
    for (var resourceName in newSchema) {
      if (newSchema.hasOwnProperty(resourceName)) {
        if (!currentSchema.hasOwnProperty(resourceName)) {
          if (typeof newSchema[resourceName].persistent == "undefined" || newSchema[resourceName].persistent) {
            ops.up.push({type: "create_table", name: resourceName, data: newSchema[resourceName]});
            ops.down.push({type: "drop_table", name: resourceName});
          }
        }
      }
    }
    for (var resourceName in currentSchema) {
      if (currentSchema.hasOwnProperty(resourceName)) {
        if (!newSchema.hasOwnProperty(resourceName)) {
          ops.up.push({type: "drop_table", name: resourceName});
          ops.down.push({type: "create_table", name: resourceName, data: currentSchema[resourceName]});
        }
      }
    }
    for (var resourceName in newSchema) {
      if (newSchema.hasOwnProperty(resourceName)) {
        if (currentSchema.hasOwnProperty(resourceName)) {
          for (var propName in newSchema[resourceName].properties) {
            if (newSchema[resourceName].properties.hasOwnProperty(propName)) {
              if (!currentSchema[resourceName].properties.hasOwnProperty(propName)) {
                ops.up.push({type: "add_column", table: resourceName, name: propName, data: newSchema[resourceName].properties[propName]});
                ops.down.push({type: "remove_column", table: resourceName, name: propName});
              } else {
                let prevProp = currentSchema[resourceName].properties[propName];
                let nextProp = newSchema[resourceName].properties[propName];
                if (!import_lodash.isEqual(prevProp, nextProp)) {
                  ops.up.push({type: "remove_column", table: resourceName, name: propName});
                  ops.up.push({type: "add_column", table: resourceName, name: propName, data: newSchema[resourceName].properties[propName]});
                  ops.down.push({type: "remove_column", table: resourceName, name: propName});
                  ops.down.push({type: "add_column", table: resourceName, name: propName, data: currentSchema[resourceName].properties[propName]});
                }
              }
            }
          }
          for (var propName in currentSchema[resourceName].properties) {
            if (currentSchema[resourceName].properties.hasOwnProperty(propName)) {
              if (!newSchema[resourceName].properties.hasOwnProperty(propName)) {
                ops.up.push({type: "remove_column", table: resourceName, name: propName});
                ops.down.push({type: "add_column", table: resourceName, name: propName, data: currentSchema[resourceName].properties[propName]});
              }
            }
          }
        }
      }
    }
    return ops;
  }
  generateMigrationCode(upOperations, downOperations) {
    let self2 = this, upCode = "", downCode = "";
    upOperations.forEach((o) => {
      upCode += self2.generateOperationCode(o) + "\n";
    });
    downOperations.forEach((o) => {
      downCode += self2.generateOperationCode(o) + "\n";
    });
    let code = MIGRATION_TEMPLATE.replace("{{UP_CODE}}", upCode).replace("{{DOWN_CODE}}", downCode);
    return code;
  }
  generateOperationCode(o) {
    switch (o.type) {
      case "create_table":
        return this._generateCreateTableCode(o);
        break;
      case "drop_table":
        return this._generateDropTableCode(o);
        break;
      case "add_column":
        return this._generateAddColumnCode(o);
        break;
      case "remove_column":
        return this._generateRemoveColumnCode(o);
        break;
      default:
        throw "Operation not supported: " + o.type;
    }
  }
  _generateCreateTableCode(o) {
    o.data.properties = this._sanitizePropertyTypes(o.data.properties);
    return `
	db.createTable('${o.name}', ${JSON.stringify(o.data.properties, null, 4)});`;
  }
  _generateDropTableCode(o) {
    return `
	db.dropTable('${o.name}');`;
  }
  _generateAddColumnCode(o) {
    return `
	db.addColumn('${o.table}', '${o.name}', ${JSON.stringify(o.data, null, 4)});`;
  }
  _generateRemoveColumnCode(o) {
    return `
	db.removeColumn('${o.table}', '${o.name}');`;
  }
  _sanitizePropertyTypes(props) {
    for (var p in props) {
      let pDef = props[p];
      if (typeof pDef == "string") {
        pDef = SchemaHelper_default.getSanitizedPropType(pDef);
      } else {
        pDef.type = SchemaHelper_default.getSanitizedPropType(pDef);
        if (!pDef.type) {
          throw "No type property found on " + p;
        }
      }
      props[p] = pDef;
    }
    return props;
  }
  _formatDate(date) {
    return [
      date.getUTCFullYear(),
      lpad(date.getUTCMonth() + 1, "0", 2),
      lpad(date.getUTCDate(), "0", 2),
      lpad(date.getUTCHours(), "0", 2),
      lpad(date.getUTCMinutes(), "0", 2),
      lpad(date.getUTCSeconds(), "0", 2)
    ].join("");
  }
};
var MigrationHelper_default = MigrationHelper;
var MIGRATION_TEMPLATE = `
'use strict';
var dbm;
var type;
var seed;

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
    {{UP_CODE}}
	return null;
};

exports.down = function(db) {
    {{DOWN_CODE}}
    return null;
}
`;
//# sourceMappingURL=index.js.map

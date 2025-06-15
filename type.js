"use strict";

const SDK = globalThis.SDK;

const PLUGIN_CLASS = SDK.Plugins.Eponesh_DexieQuery;

PLUGIN_CLASS.Type = class DexieQueryType extends SDK.ITypeBase {
    constructor(sdkPlugin, iObjectType) {
        super(sdkPlugin, iObjectType);
    }
};

"use strict";

const SDK = globalThis.SDK;

const PLUGIN_CLASS = SDK.Plugins.Eponesh_DexieQuery;

PLUGIN_CLASS.Instance = class DexieQueryInstance extends SDK.IInstanceBase {
    constructor(sdkType, inst) {
        super(sdkType, inst);
    }

    Release() {}

    OnCreate() {}

    OnPropertyChanged(id, value) {}

    LoadC2Property(name, valueString) {
        return false; // not handled
    }
};

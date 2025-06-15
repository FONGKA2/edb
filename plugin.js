"use strict";

const SDK = globalThis.SDK;

const PLUGIN = {
    ID: 'Eponesh_DexieQuery',
    CATEGORY: 'general',
};

SDK.Plugins.Eponesh_DexieQuery = class DexieQueryPlugin extends SDK.IPluginBase {
    constructor() {
        super(PLUGIN.ID);

        SDK.Lang.PushContext('plugins.' + PLUGIN.ID.toLowerCase());

        this._info.SetName(globalThis.lang('.name'));
        this._info.SetDescription(globalThis.lang('.description'));
        this._info.SetCategory(PLUGIN.CATEGORY);
        this._info.SetAuthor('Eponesh');
        this._info.SetHelpUrl(globalThis.lang('.help-url'));
        this._info.SetIsSingleGlobal(true);
        
        // 設置運行時腳本
        this._info.SetDOMSideScripts(["c3runtime/domSide.js"]);
        
        // 添加外部依賴
        this._info.AddFileDependency({
            filename: "c3runtime/tweetnacl.js",
            type: "external-dom-script"
        });
        this._info.AddFileDependency({
            filename: "c3runtime/spark-md5.js",
            type: "external-dom-script"
        });

        this._info.SetSupportedRuntimes(['c3']);

        SDK.Lang.PushContext('.properties');

        this._info.SetProperties([
            new SDK.PluginProperty('text', 'database-name', 'trustDB'),
            new SDK.PluginProperty('integer', 'version', 1),
            new SDK.PluginProperty('check', 'enable-log', false)
        ]);

        SDK.Lang.PopContext();
        SDK.Lang.PopContext();
    }
};

SDK.Plugins.Eponesh_DexieQuery.Register(PLUGIN.ID, SDK.Plugins.Eponesh_DexieQuery);

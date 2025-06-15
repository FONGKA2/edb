"use strict";

C3.Plugins.Eponesh_DexieQuery.Exps = {
    LastPath()
    {
        return this._lastPath || "";
    },

    LastFile()
    {
        return this._lastFile || "";
    },

    GetDefaultNeedVerify()
    {
        return this._defaultNeedVerify|0;
    },

    GetEnableLog()
    {
        return this._enableLog ? 1 : 0;
    },

    GetQuerySuccess()
    {
        return this._querySuccess ? 1 : 0;
    }
};

"use strict";

C3.Plugins.Eponesh_DexieQuery.Cnds = {
    OnQuerySuccess() {},
    OnQueryFailed() {},
    OnVerifyFailed() {},

    IsLastQuerySuccess()
    {
        return !!this._querySuccess;
    },

    IsLogEnabled()
    {
        return !!this._enableLog;
    },

    ComparePath(path)
    {
        return this._lastPath === path;
    },

    HasResult()
    {
        return !!this._lastFile;
    }
};

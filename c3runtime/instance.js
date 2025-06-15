"use strict";

C3.Plugins.Eponesh_DexieQuery.Instance = class extends globalThis.ISDKInstanceBase {
    Release() {}

    OnCreate()
    {
        this._db = null;
        this._enableLog = false;
        this._defaultNeedVerify = 0;
        this._lastPath = "";
        this._lastFile = "";
        this._querySuccess = false;
    }

    OnPropertyChanged(id, value)
    {
        if (id === "enable-log")
            this._enableLog = !!value;
    }

    _log(msg)
    {
        if (this._enableLog)
            console.log(`[DexieQuery] ${msg}`);
    }

    _fromHex(hex)
    {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < bytes.length; i++)
            bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
        return bytes;
    }

    _trigger(cnd)
    {
        if (this._runtime && this._runtime.Trigger)
            this._runtime.Trigger(cnd, this);
    }
};

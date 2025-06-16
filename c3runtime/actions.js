"use strict";

C3.Plugins.Eponesh_DexieQuery.Acts = {
    SetDatabase(name)
    {
        if (typeof name === "string")
            this._db = globalThis[name] || null;
        else
            this._db = null;
    },

    SetEnableLog(enable)
    {
        this._enableLog = !!enable;
    },

    SetDefaultNeedVerify(value)
    {
        this._defaultNeedVerify = value|0;
    },

    ClearResults()
    {
        this._lastPath = "";
        this._lastFile = "";
        this._querySuccess = false;
    },

    async QueryPath(path)
    {
        await C3.Plugins.Eponesh_DexieQuery.Acts.QueryPathWithVerify.call(this, path, this._defaultNeedVerify, "");
    },

    async QueryPathWithVerify(path, needVerify, pubKey)
    {
        this._lastPath = path;
        this._querySuccess = false;
        this._lastFile = "";

        if (!this._db)
        {
            this._log("Database not set");
            this._trigger(C3.Plugins.Eponesh_DexieQuery.Cnds.OnQueryFailed);
            return;
        }

        try
        {
            const rec = await this._db.table("data").where("path").equals(path).first();
            if (!rec)
            {
                this._log("Path not found: " + path);
                this._trigger(C3.Plugins.Eponesh_DexieQuery.Cnds.OnQueryFailed);
                return;
            }

            this._lastFile = rec.file || "";
            if (needVerify === -1)
                needVerify = this._defaultNeedVerify;

            if (needVerify & 1)
            {
                if (typeof SparkMD5 === "undefined")
                {
                    this._log("SparkMD5 not loaded");
                }
                else
                {
                    const md5 = SparkMD5.hash(rec.file || "");
                    if (md5 !== rec.MD5)
                    {
                        this._trigger(C3.Plugins.Eponesh_DexieQuery.Cnds.OnVerifyFailed);
                        return;
                    }
                }
            }

            if ((needVerify & 2) && rec.sign && pubKey && typeof nacl !== "undefined")
            {
                const ok = nacl.sign.detached.verify(
                    new TextEncoder().encode(rec.file || ""),
                    this._fromHex(rec.sign),
                    this._fromHex(pubKey)
                );
                if (!ok)
                {
                    this._trigger(C3.Plugins.Eponesh_DexieQuery.Cnds.OnVerifyFailed);
                    return;
                }
            }

            this._querySuccess = true;
            this._trigger(C3.Plugins.Eponesh_DexieQuery.Cnds.OnQuerySuccess);
        }
        catch (err)
        {
            this._log(err.message);
            this._trigger(C3.Plugins.Eponesh_DexieQuery.Cnds.OnQueryFailed);
        }
    },

    async QueryMultiplePaths(pathList, needVerify)
    {
        const paths = (pathList || "").split(/\r?\n/).filter(p => p);
        if (!paths.length)
            return;

        await C3.Plugins.Eponesh_DexieQuery.Acts.QueryPathWithVerify.call(this, paths[0], needVerify, "");
    },

    async QueryMultiplePathsWithCallback(pathList, returnTo, needVerify)
    {
        const paths = (pathList || "").split(/\r?\n/).filter(p => p);
        for (const p of paths)
        {
            await C3.Plugins.Eponesh_DexieQuery.Acts.QueryPathWithVerify.call(this, p, needVerify, "");
            if (returnTo && this._runtime && this._runtime.CallFunction)
                this._runtime.CallFunction(returnTo, p, this._lastFile);
        }
    }
};

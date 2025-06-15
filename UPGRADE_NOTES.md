# DexieDBQuery SDK V2 升級說明

## 升級概述
DexieDBQuery addon 已成功從 SDK V1 升級到 SDK V2。

## 主要變更

### 1. addon.json
- 添加了 `"sdk-version": 2`
- 移除了 `runtime-scripts` 配置（SDK V2 不需要）

### 2. Editor 文件結構變更
- **plugin.js**: 更新為 SDK V2 格式，使用 `globalThis.SDK` 和 `globalThis.lang`
- **type.js**: 更新為 SDK V2 格式
- **instance.js**: 更新為 SDK V2 格式

### 3. Runtime 文件結構變更
- **c3runtime/plugin.js**: 簡化為 `C3.Plugins.Eponesh_DexieQuery = class extends globalThis.ISDKPluginBase {}`
- **c3runtime/type.js**: 簡化為 `C3.Plugins.Eponesh_DexieQuery.Type = class extends globalThis.ISDKObjectTypeBase {}`
- **c3runtime/instance.js**: 更新為 `C3.Plugins.Eponesh_DexieQuery.Instance = class extends globalThis.ISDKInstanceBase`
- **c3runtime/actions.js**: 更新為 `C3.Plugins.Eponesh_DexieQuery.Acts = {}`
- **c3runtime/conditions.js**: 更新為 `C3.Plugins.Eponesh_DexieQuery.Cnds = {}`
- **c3runtime/expressions.js**: 更新為 `C3.Plugins.Eponesh_DexieQuery.Exps = {}`

### 4. 命名規範變更
- 條件函數名稱從小寫改為大寫開頭（如 `onQuerySuccess` → `OnQuerySuccess`）
- 表達式函數名稱從小寫改為大寫開頭（如 `lastPath` → `LastPath`）
- 動作函數名稱保持大寫開頭格式

### 5. 觸發器調用變更
- 從 `this._trigger(this._getConditions().onQueryFailed)` 
- 改為 `this._trigger(C3.Plugins.Eponesh_DexieQuery.Cnds.OnQueryFailed)`

## 功能保持不變
- 所有原有功能完全保留
- Dexie 資料庫查詢功能
- MD5 驗證功能（使用 park-md5）
- 數位簽名驗證功能（使用 TweetNaCl）
- 日誌記錄功能
- 所有 Actions、Conditions 和 Expressions

## 相容性
- 與 Construct 3 SDK V2 完全相容
- 保持與現有專案的向後相容性
- aces.json 和語言文件無需變更

## 測試建議
1. 在 Construct 3 中載入升級後的 addon
2. 測試基本的路徑查詢功能
3. 測試 MD5 驗證功能
4. 測試簽名驗證功能
5. 驗證所有條件和表達式正常工作

## v2.3.1 - 修復觸發器錯誤

### 問題修復
- **觸發器調用錯誤**: 修復 `TypeError: Cannot read properties of undefined (reading 'Cnds')` 錯誤
- **SDK v2 相容性**: 更新觸發器調用方式，從 `this._objectClass.Cnds` 改為 `C3.Plugins.Eponesh_DexieQuery.Cnds`

### 技術細節
在 SDK v2 中，實例無法通過 `this._objectClass` 訪問條件對象，需要直接使用完整的插件命名空間。

### 修復的觸發器
- `OnQuerySuccess`: 查詢成功時觸發
- `OnQueryFailed`: 查詢失敗時觸發  
- `OnVerifyFailed`: 驗證失敗時觸發

---

## v2.3.0 - API 簡化更新

### 移除項目
- **LastResult 表達式**: 移除重複的 `LastResult` 表達式，因為它與 `LastFile` 功能完全相同
- **Set Global Database 動作**: 移除 `SetGlobalDatabase` 動作，統一使用 `SetDatabase` 動作

### 主要變更
- 簡化了表達式 API，避免混淆
- 統一資料庫設定方式
- 減少插件體積和複雜度
- 更新了相關文檔和語言文件

### 向後相容性影響
- **重要**: 如果您的專案使用了 `LastResult` 表達式，請改用 `LastFile` 表達式
- **重要**: 如果您的專案使用了 `Set Global Database` 動作，請改用 `Set Database` 動作並傳入 "db" 作為參數

### 遷移指南

**舊用法**:
```javascript
// 表達式
MyPlugin.LastResult  // ❌ 不再可用

// 動作
Set Global Database  // ❌ 不再可用
```

**新用法**:
```javascript
// 表達式
MyPlugin.LastFile    // ✅ 使用這個替代

// 動作
Set Database "db"    // ✅ 使用這個替代
```

## v2.2.0 - 多種驗證模式支援

### 新功能
- **多種驗證模式**: 支援不同的驗證組合
  - `needVerify = 0`: 不進行任何驗證
  - `needVerify = 1`: 只驗證 MD5
  - `needVerify = 2`: 只驗證數位簽名 (sign)
  - `needVerify = 3`: 同時驗證 MD5 和數位簽名

### 主要變更
- 修改了 `queryPath` 方法的驗證邏輯
- 分離了 MD5 驗證和簽名驗證的執行流程
- 更新了錯誤處理和日誌記錄
- 改進了缺少簽名或公鑰時的錯誤處理
- 更新了文檔和語言文件

### 向後相容性
- 舊的 `needVerify = 1` 用法仍然有效，但現在只進行 MD5 驗證
- 如果需要同時驗證 MD5 和簽名，請使用 `needVerify = 3`

### 使用範例

```javascript
// 只驗證 MD5
yourDexieQueryInstance.QueryPathWithVerify("path/to/file.txt", 1, "");

// 只驗證簽名
yourDexieQueryInstance.QueryPathWithVerify("path/to/file.txt", 2, "YOUR_PUBLIC_KEY");

// 同時驗證 MD5 和簽名
yourDexieQueryInstance.QueryPathWithVerify("path/to/file.txt", 3, "YOUR_PUBLIC_KEY");
```

### 注意事項
- 當使用簽名驗證 (`needVerify = 2` 或 `needVerify = 3`) 時，必須提供有效的公鑰
- 資料庫中的 path 記錄必須包含 `sign` 欄位才能進行簽名驗證
- 所有驗證都在本地進行，無需外部API呼叫 
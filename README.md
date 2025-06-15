# Dexie DB Query Plugin for Construct 3

這是一個基於Dexie資料庫的查詢插件，專為Construct 3設計。它提供了path查詢和MD5驗證功能，類似於get.js的邏輯。

**重要更新**: 本插件已升級至 **Addon SDK v2**，支援 Construct 3 的最新功能和更好的性能。


## 使用方法

### 屬性設定

- **Enable Log**: 啟用控制台日誌記錄（預設：false）
- **Default Need Verify**: 默認MD5驗證設定（0=停用，1=啟用，預設：0）

### 動作 (Actions)

1. **Query Path**: 查詢指定路徑的文件（使用默認驗證設定）
2. **Query Path With Verify**: 查詢指定路徑的文件並指定驗證需求
3. **Query Multiple Paths**: 查詢多個路徑（換行分隔），可指定驗證設定
4. **Query Multiple Paths With Callback**: 查詢多個路徑並通過回調函數返回結果
5. **Set Default Need Verify**: 設定默認MD5驗證設定
6. **Set Enable Log**: 設定是否啟用日誌
7. **Clear Results**: 清除查詢結果
8. **Set Database**: 指定 Dexie 全域名稱

### 條件 (Conditions)

1. **On Query Success**: 查詢成功時觸發
2. **On Query Failed**: 查詢失敗時觸發
3. **On Verify Failed**: MD5驗證失敗時觸發
4. **Is Last Query Success**: 檢查上次查詢是否成功
5. **Is Verify Enabled**: 檢查是否啟用默認MD5驗證
6. **Is Log Enabled**: 檢查是否啟用日誌
7. **Compare Path**: 比較路徑是否匹配
8. **Has Result**: 檢查是否有查詢結果

### 表達式 (Expressions)

1. **LastPath**: 獲取最後查詢的路徑
2. **LastFile**: 獲取最後查詢的文件內容
3. **GetDefaultNeedVerify**: 獲取默認MD5驗證設定
4. **GetEnableLog**: 獲取當前日誌設定
5. **GetQuerySuccess**: 獲取查詢成功狀態

## MD5驗證選項

### 每次查詢獨立設定

- **Query Path With Verify**: 明確指定每次查詢的驗證需求
  - `needVerify = 0`: 此次查詢不進行任何驗證
  - `needVerify = 1`: 此次查詢只驗證MD5
  - `needVerify = 2`: 此次查詢只驗證數位簽名 (sign)
  - `needVerify = 3`: 此次查詢同時驗證MD5和數位簽名

- **Query Multiple Paths**: 批量查詢時的驗證設定
  - `needVerify = -1`: 使用默認設定
  - `needVerify = 0`: 此次查詢不進行任何驗證
  - `needVerify = 1`: 此次查詢只驗證MD5
  - `needVerify = 2`: 此次查詢只驗證數位簽名 (sign)
  - `needVerify = 3`: 此次查詢同時驗證MD5和數位簽名

### 驗證模式說明

1. **MD5驗證** (`needVerify = 1`): 
   - 使用 SparkMD5 庫計算文件內容的MD5值
   - 與資料庫中存儲的MD5值進行比較
   - 確保文件內容完整性

2. **簽名驗證** (`needVerify = 2`):
   - 使用 TweetNaCl 庫驗證數位簽名
   - 需要提供公鑰 (pubKey) 參數
   - 驗證文件路徑和MD5的數位簽名
   - 確保文件來源可信

3. **雙重驗證** (`needVerify = 3`):
   - 同時進行MD5驗證和簽名驗證
   - 提供最高級別的安全保障
   - 確保文件完整性和來源可信性

### 默認設定

- 在插件屬性中設定默認值
- 使用"Set Default Need Verify"動作修改默認值
- 當查詢時未指定驗證需求時使用默認設定

## 資料庫結構

插件假設使用以下Dexie資料庫結構：

```javascript
/db.version(4).stores({
  claim: "sign, ver, PubKey, dis, path, MD5", // 
  path: "path, MD5, donwloaded",
  data: "MD5, size, date", // file
  connection: "ikey, trustkey, path, dis, ver, sign" // 
});
```

## 工作流程

1. 查詢指定路徑在`db.path`表中的記錄
2. 檢查文件是否已下載（`downloaded = 1`）
3. 根據MD5值在`db.data`表中獲取文件內容
4. 根據指定的驗證設定或默認設定決定是否驗證MD5
5. 如果需要驗證，計算文件內容的MD5並與存儲的MD5比較
6. 觸發相應的事件（成功/失敗/驗證失敗）

## 注意事項

- 插件需要全域的`db`物件（Dexie資料庫實例）
- **MD5驗證**: 使用 SparkMD5 庫進行本地計算，無需外部函數調用
- **簽名驗證**: 使用 TweetNaCl 庫進行本地驗證，無需外部函數調用
- 所有操作都是異步的
- **重要**: 修復了DOM相關錯誤，插件現在使用正確的基類

## 版本

- 版本: 2.3.1
- 作者: Eponesh
- 基於: get.js 和 fetch.js 的邏輯
- 更新: 
  - v2.3.1: 修復 SDK v2 觸發器調用錯誤 (Cannot read properties of undefined)
  - v2.3.0: 移除重複的 LastResult 表達式和 Set Global Database 動作，簡化API
  - v2.2.0: 新增多種驗證模式支援（1=只驗證MD5，2=只驗證簽名，3=皆驗證）
  - v2.1.0: 支援每次查詢獨立設定needVerify，修復DOM錯誤


2. **在事件表中**:
   - 使用「Set Database」動作設定資料庫，傳入 Dexie 的全域名稱 (例如 "db")
   - 使用「Query Path With Verify」查詢文件，參數：
     - Path: "path/to/file.txt"
     - Need Verify: 1

3. **監聽結果**:
   - 「On Query Success」→ 使用 LastFile 表達式獲取文件內容
   - 「On Query Failed」→ 處理查詢失敗
   - 「On Verify Failed」→ 處理MD5驗證失敗


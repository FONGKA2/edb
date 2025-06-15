# Dexie DB Query Plugin for Construct 3

這是一個基於Dexie資料庫的查詢插件，專為Construct 3設計。它提供了path查詢和MD5驗證功能，類似於get.js的邏輯。

**重要更新**: 本插件已升級至 **Addon SDK v2**，支援 Construct 3 的最新功能和更好的性能。

## 功能特點

- **路徑查詢**: 根據指定路徑查詢資料庫中的文件
- **獨立MD5驗證**: 每次查詢時可獨立指定是否需要MD5驗證
- **默認驗證設定**: 可設定默認的MD5驗證行為
- **批量查詢**: 支援多個路徑的查詢（每次處理一個）
- **日誌記錄**: 可選的控制台日誌輸出用於調試
- **事件觸發**: 查詢成功、失敗和驗證失敗的事件觸發
- **SDK v2**: 基於最新的 Construct 3 Addon SDK v2
- **本地MD5計算**: 使用 SparkMD5 庫進行MD5哈希計算
- **本地簽名驗證**: 使用 TweetNaCl 庫進行數位簽名驗證

## Query Multiple Paths 返回格式

**重要說明**: `Query Multiple Paths` **不會**返回一行一個結果。根據設計要求，它採用"每次一個項目"的處理方式：

- 輸入多個路徑（換行分隔）
- **只處理第一個路徑**
- 觸發對應的事件（成功/失敗）
- 結果可通過表達式 `LastFile`、`LastPath` 等獲取

如果需要處理多個路徑，您需要：
1. 多次調用 `Query Path` 動作
2. 或者自行在事件表中循環處理路徑列表

## Query Multiple Paths With Callback 功能

**新功能**: `Query Multiple Paths With Callback` 提供了更進階的批量查詢方式：

- **輸入**: 多個路徑（換行分隔）和回調函數名稱
- **處理**: 逐一處理所有路徑
- **回調**: 對每個路徑的結果調用 `callFunction(returnTo, path, file)`
- **參數說明**:
  - `pathList`: 換行分隔的路徑列表
  - `returnTo`: 回調函數名稱
  - `needVerify`: MD5驗證設定（-1=使用默認，0=停用，1=啟用）

### 回調函數調用格式

對於每個查詢的路徑，插件會調用：
```javascript
runtime.callFunction(returnTo, path, file)
```

其中：
- `returnTo`: 您指定的函數名稱
- `path`: 當前查詢的路徑
- `file`: 查詢成功時為文件內容，失敗時為空字符串

### 使用範例

1. **在 Script 事件中定義回調函數**:
```javascript
function processQueryResult(path, file) {
    if (file) {
        console.log(`成功查詢 ${path}, 文件大小: ${file.length}`);
        // 處理成功的文件內容
    } else {
        console.log(`查詢失敗: ${path}`);
        // 處理失敗情況
    }
}

// 將函數設為全域函數
globalThis.processQueryResult = processQueryResult;
```

2. **在事件表中使用動作**:
   - 動作: "Query Multiple Paths With Callback"
   - 參數:
     - Path List: "file1.txt\nfile2.txt\nfile3.txt"
     - Return To: "processQueryResult"
     - Need Verify: -1

這種方式適合需要處理大量文件或需要自定義處理邏輯的場景。

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
8. **Set Database**: 根據指定名稱設定資料庫物件

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
// db.path 表
{
  path: string,      // 文件路徑
  MD5: string,       // 文件MD5值
  downloaded: number // 是否已下載 (0/1)
}

// db.data 表
{
  MD5: string,       // 文件MD5值
  file: any,         // 文件內容
  size: number,      // 文件大小
  date: string       // 日期
}
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
- 每次只處理一個路徑項目，符合要求的設計
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

## 設定資料庫

### 方法 1: 設定為全域變數（推薦）

在 Construct 3 的 Script 事件中：

```javascript
// 創建 Dexie 資料庫並設為全域變數
const db = new Dexie("MyDatabase");
db.version(1).stores({
    path: 'path, MD5, downloaded',
    data: 'MD5, file, size, date'
});

// 重要：設定為全域變數
globalThis.db = db;
```

然後在事件表中使用「Set Database」動作，參數設定為 "db"。

### 方法 2: 使用指定名稱設定

```javascript
// 創建資料庫
const mydb = new Dexie("MyDatabase");
mydb.version(1).stores({
    path: 'path, MD5, downloaded',
    data: 'MD5, file, size, date'
});

// 設定為全域變數（任意名稱）
globalThis.mydb = mydb;
```

然後使用「Set Database」動作，參數設定為 "mydb"。

### 方法 3: 直接設定 window.db

```javascript
const db = new Dexie("MyDatabase");
db.version(1).stores({
    path: 'path, MD5, downloaded',
    data: 'MD5, file, size, date'
});

window.db = db;
``` 

## 故障排除

### 問題: "ReferenceError: db is not defined"

**原因**: 插件無法訪問資料庫實例

**解決方案**:
1. 確保在 Script 事件中正確創建並設定資料庫為全域變數
2. 在查詢前使用「Set Database」動作
3. 檢查資料庫是否正確初始化

### 使用範例

#### 完整設定流程：

1. **在 Script 事件中創建資料庫**:
```javascript
const db = new Dexie("MyDatabase");
db.version(1).stores({
    path: 'path, MD5, downloaded',
    data: 'MD5, file, size, date'
});

// 初始化資料庫
await db.open();

// 設定為全域變數
globalThis.db = db;
```

2. **在事件表中**:
   - 使用「Set Database」動作設定資料庫，參數設定為 "db"
   - 使用「Query Path With Verify」查詢文件，參數：
     - Path: "path/to/file.txt"
     - Need Verify: 1

3. **監聽結果**:
   - 「On Query Success」→ 使用 LastFile 表達式獲取文件內容
   - 「On Query Failed」→ 處理查詢失敗
   - 「On Verify Failed」→ 處理MD5驗證失敗

## 版本歷史

- **版本 2.1.0**: 🚀 本地加密驗證升級
  - 使用 SparkMD5 進行本地 MD5 哈希計算
  - 使用 TweetNaCl 進行本地數位簽名驗證
  - 移除對外部 runtime.callFunction 的依賴
  - 提升性能和安全性
  - 簡化部署和使用流程
- **版本 2.0.0**: 🎉 升級到 Addon SDK v2
  - 所有方法改為 camelCase 命名約定
  - 改善效能和穩定性
  - 支援最新的 Construct 3 功能
  - 向後相容的脚本接口
- **版本 1.0.2**: 修復資料庫訪問問題，添加資料庫設定動作
- **版本 1.0.1**: 支援每次查詢獨立設定needVerify，修復DOM錯誤  
- **版本 1.0.0**: 初始版本

## SDK v2 更新內容

### 新的命名約定
所有內部方法現在遵循 camelCase 約定：
- `OnQuerySuccess` → `onQuerySuccess`
- `QueryPath` → `queryPath`
- `SetEnableLog` → `setEnableLog`

### 改善的性能
- 更快的執行速度
- 更少的記憶體使用
- 更好的錯誤處理

### 腳本接口整合
插件的所有公共方法現在都可以直接從 Construct 3 的腳本功能訪問，實現更好的整合。 

## 依賴庫

本插件需要以下JavaScript庫：

1. **SparkMD5**: 用於 MD5 哈希計算
   - 可通過 CDN 引入: `https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.2/spark-md5.min.js`
   
2. **TweetNaCl**: 用於數位簽名驗證  
   - 可通過 CDN 引入: `https://cdnjs.cloudflare.com/ajax/libs/tweetnacl/1.0.3/nacl.min.js`

請在使用插件前確保這些庫已正確載入到您的項目中。

### 如何引入依賴庫

在 Construct 3 中，您可以通過以下方式引入這些庫：

**方法1: 通過 Script 事件引入**
```javascript
// 動態載入 SparkMD5
if (typeof SparkMD5 === 'undefined') {
    const script1 = document.createElement('script');
    script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.2/spark-md5.min.js';
    document.head.appendChild(script1);
}

// 動態載入 TweetNaCl
if (typeof nacl === 'undefined') {
    const script2 = document.createElement('script');
    script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/tweetnacl/1.0.3/nacl.min.js';
    document.head.appendChild(script2);
}
```

**方法2: 下載並作為項目文件引入**
1. 下載 spark-md5.min.js 和 nacl.min.js 文件
2. 將它們添加到 Construct 3 項目的 Files 中
3. 在項目開始時通過 Script 事件載入


## Development

Run `node validate-lang.js` to verify translation files have a languageTag matching the addon.json entry.

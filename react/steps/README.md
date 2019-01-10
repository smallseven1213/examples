# GraphQL pagination cursor design, using Golang
主要紀錄如何設計出pagination cursor的分頁製作
! 本source code無法直接執行，僅有片段

## 按例：讀取更多的電影
現在想要依Relay Cursor的規範製作電影列表的讀取
根據規範，GQL Query Schema應該如下

### GQL Query
```
{
  articles(first: 1, after: "MTU0NTkwNDM4NA==") {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        title
        content
	  }
	  cursor
    }
  }
}
```

### 程式碼檔案說明
|檔名|說明|
|---|---|
|root.go|在第36行可以看到在query root做了Movies的程式入口|
|movies.go|電影列表查詢入口，從最下面往上定義|

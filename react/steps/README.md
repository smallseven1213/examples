# React Step
由於公司專案有單一頁面(Route)但多分頁切換的需求
因此製作React Steps，令程式可方便控制分頁切換

### 使用方式
```
{
  <Steps name="demo">
    {({step, gotoNextStep, gotoPrevStep, gotoSpecStep}) => (
      <div>
        <p>{step}</p>
        <Step>
          {({data}) => (
            <div><p>111</p></div>
          )}
        </Step>
        <Step>
          {({data}) => (
            <div>{data ? data.get('data') : null}</div>
          )}
        </Step>
        <Step>
          {({data}) => (
            <div>333</div>
          )}
        </Step>
        <button disabled={step === 1} onClick={() => gotoPrevStep()}>prev</button>
        <button
          disabled={step === 3}
          onClick={() => gotoNextStep(fromJS({
            data: 'hello'
          }))}
        >next</button>
        <button
          disabled={step === 3}
          onClick={() => gotoSpecStep({
            stepNum: 3,
            data: fromJS({
              data: 'hello'
            })
          })}
        >到3</button>
      </div>
    )}
  </Steps>
}
```

### 程式碼檔案說明
|檔名|說明|
|---|---|
|index.js|Steps Entry
|Step/index.js|使用Step包住elment，使該element變成一組分頁|

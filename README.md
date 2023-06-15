# requestLimiter

批量请求限制并发数，并符合以下功能：

1. 允许用户传入最大并发数限制参数
2. 允许使用者传入其喜欢的异步api(比如：ajax，fetch，axios等)
3. 封装后的request请求结果都返回一个promise
4. 设置每个请求的retry次数
5. 对每个请求设置缓存处理

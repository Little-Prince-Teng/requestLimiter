
export class RequestLimiter {
	constructor({
		maxLimit = 5,
		requestApi
	}) {
		// 最大并发量
		this.maxLimit = maxLimit
		// 请求队列，若当前请求并发量 > maxLimit，则将该请求加入到请求队列中
		this.requestQueue = []
		// 当前请求的并发量
		this.currentCount = 0
		// 使用用户定义的请求api
		this.requestApi = requestApi
	}

	// 发起请求api
	async request(...args) {
		// 若当前请求数并发量超过最大并发量，则将其阻断在这里
		// startBlocking会返回一个promise，并将该promise的resolve函数放在this.requestQueue队列里。这样的话，除非这个promise被resolve,否则不会继续向下执行。
		// 当之前发出的请求结果回来/请求失败的时候，则将当前并发量-1，并且调用this.next函数执行队列中的请求
		// 当调用next函数的时候，会从this.requestQueue队列里取出队首的resolve函数并且执行。这样，对应的请求则可以继续向下执行。
		if(this.currentCount >= this.maxLimit) {
			await this.startBlocking()
		}

		try {
			this.currentCount++
			const result = await this.requestApi(...args)
			return Promise.resolve(result)
		} catch(error) {
			return Promise.reject(error)
		} finally {
			this.currentCount--
			this.next()
		}
	}

	// 新建一个promise，并且将该resolve函数放入到requestQueue队列中
	// 当调用next函数的时候会从队列中取出一个resolve函数并执行
	startBlocking() {
		let _resolve
		let promise2 = new Promise(resolve => _resolve = resolve)
		this.requestQueue.push(_resolve)
		return promise2
	}

	// 从请求队列中取出队首的resolve并执行
	next() {
		if(this.requestQueue.length <= 0 ) return
		const _resolve = this.requestQueue.shift()
		_resolve()
	}
}
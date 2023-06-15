import { RequestLimiter } from '../src/requestLimiter'

async function requestDemo(num, time) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(num)
		}, time)
	})
}

const limiter = new RequestLimiter({
	maxLimit: 5,
	retryCount: 2,
	requestApi: requestDemo
})

let promises = []

for(let i = 0; i < 30; i++) {
	promises.push(
		limiter.request(i, Math.random() * 3000)
			.then(
				result => console.log('result', result))
			.catch(error => {
				console.log(error)
			})
	)
}

async function test() {
	await Promise.all(promises)
}

test()
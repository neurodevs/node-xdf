import AbstractSpruceTest, {
	test,
	assert,
	errorAssert,
	generateId,
} from '@sprucelabs/test-utils'
import XdfReader from '../../XdfReader'
import XdfReaderImpl from '../../XdfReader'
import SpyXdfReader from '../support/SpyXdfReader'

export default class XdfReaderTest extends AbstractSpruceTest {
	private static xdfReader: XdfReader
	private static randomFilePath: string

	protected static async beforeEach() {
		await super.beforeEach()
		this.xdfReader = new XdfReader()
		this.randomFilePath = generateId()
		assert.isTruthy(this.xdfReader)
	}

	@test()
	protected static canSetAndGetClass() {
		XdfReaderImpl.setClass(SpyXdfReader)
		assert.isEqual(XdfReaderImpl.getClass(), SpyXdfReader)
	}

	@test()
	protected static async factoryInstantiatesSetClass() {
		XdfReaderImpl.setClass(SpyXdfReader)
		const reader = XdfReaderImpl.Reader()
		assert.isInstanceOf(reader, SpyXdfReader)
	}

	@test()
	protected static async loadThrowsWithMissingRequiredOptions() {
		//@ts-ignore
		const err = await assert.doesThrowAsync(() => this.xdfReader.load())
		errorAssert.assertError(err, 'MISSING_PARAMETERS', {
			parameters: ['filePath'],
		})
	}

	@test()
	protected static async loadThrowsWithInvalidTimeout() {
		await this.assertInvalidTimeout(-1)
		await this.assertInvalidTimeout(-1.5)
	}

	@test()
	protected static async loadAcceptsTimeoutOptionAndWaits() {
		const expectedWaitTimeMs = 10
		const startTime = Date.now()
		await this.load({ timeoutMs: expectedWaitTimeMs })

		const actualWaitTimeMs = Date.now() - startTime
		const waitsLongEnough = actualWaitTimeMs >= expectedWaitTimeMs
		const waitsNotTooLong = actualWaitTimeMs < expectedWaitTimeMs * 1.5

		assert.isTrue(waitsLongEnough && waitsNotTooLong)
	}

	private static async load(options?: TestXdfReaderLoadOptions) {
		const { filePath = this.randomFilePath, ...loadOptions } = options ?? {}
		await this.xdfReader.load(filePath, loadOptions)
	}

	private static async assertInvalidTimeout(timeoutMs: number) {
		const err = await assert.doesThrowAsync(() => this.load({ timeoutMs }))
		errorAssert.assertError(err, 'INVALID_TIMEOUT_MS', {
			timeoutMs,
		})
	}
}

interface TestXdfReaderLoadOptions {
	filePath?: string
	timeoutMs?: number
}

import AbstractSpruceTest, {
	test,
	assert,
	errorAssert,
	generateId,
} from '@sprucelabs/test-utils'
import LibxdfImpl from '../Libxdf'
import FakeLibxdf from '../testDoubles/FakeLibxdf'
import SpyXdfReader from '../testDoubles/SpyXdfReader'
import XdfReaderImpl from '../XdfReader'

export default class XdfReaderTest extends AbstractSpruceTest {
	private static instance: SpyXdfReader
	private static filePath: string

	protected static async beforeEach() {
		await super.beforeEach()

		XdfReaderImpl.Class = SpyXdfReader
		LibxdfImpl.Class = FakeLibxdf

		this.filePath = generateId()
		this.instance = this.XdfReader()
	}

	@test()
	protected static async canCreateInstance() {
		assert.isTruthy(this.instance, 'Should have created an instance!')
	}

	@test()
	protected static async loadThrowsWithMissingRequiredOptions() {
		const err = await assert.doesThrowAsync(
			//@ts-ignore
			async () => await this.instance.load()
		)

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

	@test()
	protected static async createsLibxdfInstance() {
		await this.load()

		assert.isTruthy(
			FakeLibxdf.libxdfPath,
			'Should have created a Libxdf instance!'
		)
	}

	private static async load(options?: TestXdfReaderLoadOptions) {
		const { filePath = this.filePath, ...loadOptions } = options ?? {}
		await this.instance.load(filePath, loadOptions)
	}

	private static async assertInvalidTimeout(timeoutMs: number) {
		const err = await assert.doesThrowAsync(() => this.load({ timeoutMs }))
		errorAssert.assertError(err, 'INVALID_TIMEOUT_MS', {
			timeoutMs,
		})
	}

	private static XdfReader() {
		return XdfReaderImpl.Create() as SpyXdfReader
	}
}

interface TestXdfReaderLoadOptions {
	filePath?: string
	timeoutMs?: number
}

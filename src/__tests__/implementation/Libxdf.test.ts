import AbstractSpruceTest, {
	test,
	assert,
	errorAssert,
	generateId,
} from '@sprucelabs/test-utils'
import LibxdfImpl, { Libxdf, LibxdfBindings } from '../../Libxdf'

export default class LibxdfTest extends AbstractSpruceTest {
	private static libxdf: SpyLibxdf
	private static libxdfPath: string
	private static shouldThrowWhenLoadingBindings: boolean
	private static calledLibxdfPath: string
	private static calledLibxdfOptions: Record<string, any>
	private static fakeBindings: LibxdfBindings

	protected static async beforeEach() {
		await super.beforeEach()

		this.libxdfPath = generateId()
		this.shouldThrowWhenLoadingBindings = false

		LibxdfImpl.clearInstance()
		process.env.LIBXDF_PATH = this.libxdfPath

		this.fakeBindings = this.FakeBindings()
		assert.isTruthy(this.fakeBindings)

		LibxdfImpl.setFfi({
			Library: (path: string, options: Record<string, any>) => {
				this.calledLibxdfPath = path
				this.calledLibxdfOptions = options
				if (this.shouldThrowWhenLoadingBindings) {
					throw new Error('Simulated failure for load bindings!')
				}
				return {}
			},
		})

		this.libxdf = new SpyLibxdf(this.libxdfPath)
		LibxdfImpl.setInstance(this.libxdf)
		assert.isTruthy(this.libxdf)
	}

	@test()
	protected static canSetAndGetInstance() {
		const fake = new FakeLibxdf()
		LibxdfImpl.setInstance(fake)
		assert.isEqual(LibxdfImpl.getInstance(), fake)
	}

	@test()
	protected static async worksAsASingleton() {
		const libxdf = LibxdfImpl.getInstance()
		assert.isInstanceOf(libxdf, LibxdfImpl as any)
	}

	@test()
	protected static async singletonIsTheSame() {
		assert.isEqual(LibxdfImpl.getInstance(), LibxdfImpl.getInstance())
	}

	@test()
	protected static async canGetAndSetForeignFunctionInterface() {
		const ffi = {}
		LibxdfImpl.setFfi(ffi)
		assert.isEqual(LibxdfImpl.getFfi(), ffi)
	}

	@test()
	protected static async throwsWithMissingLibxdfPathInEnv() {
		delete process.env.LIBXDF_PATH
		const err = assert.doesThrow(() => this.Libxdf())
		errorAssert.assertError(err, 'MISSING_PARAMETERS', {
			parameters: ['LIBXDF_PATH'],
		})
	}

	@test()
	protected static async throwsWhenBindingsFailToLoad() {
		this.shouldThrowWhenLoadingBindings = true
		const err = assert.doesThrow(() => this.Libxdf())
		errorAssert.assertError(err, 'FAILED_TO_LOAD_LIBXDF', {
			libxdfPath: process.env.LIBXDF_PATH,
		})
	}

	@test()
	protected static async createsExpectedBindingsToLibxdf() {
		assert.isEqual(this.calledLibxdfPath, this.libxdfPath)
		const expectedLibxdfOptions = {
			load_xdf: ['int', ['string']],
		}
		assert.isEqualDeep(this.calledLibxdfOptions, expectedLibxdfOptions)
	}

	private static FakeBindings() {
		return {
			load_xdf: (_path: string) => {
				return 0
			},
		}
	}

	private static Libxdf() {
		return LibxdfImpl.Libxdf()
	}
}

class SpyLibxdf extends LibxdfImpl {
	public constructor(libxdfPath: string) {
		super(libxdfPath)
	}

	public getBindings() {
		return this.bindings
	}
}

class FakeLibxdf implements Libxdf {}

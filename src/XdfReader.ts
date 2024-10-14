import { assertOptions } from '@sprucelabs/schema'
import SpruceError from './errors/SpruceError'
import LibxdfImpl from './Libxdf'

export default class XdfReaderImpl implements XdfReader {
	public static Class?: XdfReaderConstructor

	protected constructor() {}

	public static Create() {
		LibxdfImpl.Create('asdf')
		return new (this.Class ?? this)()
	}

	public async load(filePath: string, options?: XdfReaderLoadOptions) {
		assertOptions({ filePath }, ['filePath'])
		const { timeoutMs = 0 } = options ?? {}

		this.assertValidTimeout(timeoutMs)
		await this.wait(timeoutMs)
	}

	protected assertValidTimeout(timeoutMs: number) {
		if (timeoutMs < 0) {
			throw new SpruceError({
				code: 'INVALID_TIMEOUT_MS',
				timeoutMs,
			})
		}
	}

	protected async wait(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}
}

export interface XdfReader {
	load(filePath: string, options?: XdfReaderLoadOptions): Promise<void>
}

export type XdfReaderConstructor = new () => XdfReader

export interface XdfReaderLoadOptions {
	timeoutMs?: number
}

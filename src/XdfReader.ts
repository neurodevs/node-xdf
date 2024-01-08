import { assertOptions } from '@sprucelabs/schema'
import SpruceError from './errors/SpruceError'

export default class XdfReaderImpl implements XdfReader {
	private static Class?: XdfReaderClass

	public static setClass(Class: XdfReaderClass) {
		this.Class = Class
	}

	public static getClass(): XdfReaderClass {
		return this.Class ?? this
	}

	public static Reader() {
		const Class = this.getClass()
		return new Class()
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

export interface XdfReaderLoadOptions {
	timeoutMs?: number
}

export type XdfReaderClass = new () => XdfReader

import { assertOptions } from '@sprucelabs/schema'
import SpruceError from './errors/SpruceError'
import LibxdfImpl, { Libxdf, XdfFile } from './Libxdf'

export default class XdfReaderImpl implements XdfReader {
	public static Class?: XdfReaderConstructor

	private readonly libxdf: Libxdf

	protected constructor(libxdf: Libxdf) {
		this.libxdf = libxdf
	}

	public static async Create(
		libxdfPath = '/usr/local/lib/libxdf/libxdf.dylib'
	) {
		const libxdf = await LibxdfImpl.Create(libxdfPath)
		return new (this.Class ?? this)(libxdf)
	}

	public async load(filePath: string, options?: XdfReaderLoadOptions) {
		assertOptions({ filePath }, ['filePath'])
		const { timeoutMs = 0 } = options ?? {}

		this.assertValidTimeout(timeoutMs)
		return await this.libxdf.loadXdf(filePath)
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
	load(filePath: string, options?: XdfReaderLoadOptions): Promise<XdfFile>
}

export type XdfReaderConstructor = new (libxdf: Libxdf) => XdfReader

export interface XdfReaderLoadOptions {
	timeoutMs?: number
}

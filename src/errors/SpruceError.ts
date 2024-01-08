import BaseSpruceError from '@sprucelabs/error'
import ErrorOptions from '#spruce/errors/options.types'

export default class SpruceError extends BaseSpruceError<ErrorOptions> {
	/** an easy to understand version of the errors */
	public friendlyMessage(): string {
		const { options } = this
		let message
		switch (options?.code) {
			case 'INVALID_TIMEOUT_MS':
				message = `You set an invalid timeout! It must be a positive number in milliseconds, but you set it to ${options?.timeoutMs}.`
				break

			case 'FAILED_TO_LOAD_LIBXDF':
				message = `Failed to load libxdf bindings from: ${options?.libxdfPath}! Please make sure you have libxdf installed at env.LIBXDF_PATH.`
				break

			default:
				message = super.friendlyMessage()
		}

		const fullMessage = options.friendlyMessage
			? options.friendlyMessage
			: message

		return fullMessage
	}
}

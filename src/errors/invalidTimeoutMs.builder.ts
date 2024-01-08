import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
	id: 'invalidTimeoutMs',
	name: 'Invalid Timeout Ms',
	fields: {
		timeoutMs: {
			type: 'number',
			isRequired: true,
		},
	},
})

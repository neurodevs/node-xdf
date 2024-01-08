import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
	id: 'failedToLoadLibxdf',
	name: 'Failed to Load Libxdf',
	fields: {
		libxdfPath: {
			type: 'text',
			isRequired: true,
		},
	},
})

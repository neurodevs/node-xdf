import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
    id: 'invalidFileExtension',
    name: 'INVALID_FILE_EXTENSION',
    fields: {
        xdfSavePath: {
            type: 'text',
            isRequired: true,
        },
    },
})

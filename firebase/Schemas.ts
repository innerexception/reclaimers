export const Schemas = {
    Collections: {
        Encounters: {
            collectionName: 'encounters',
            fields: {
                id: 'id',
                characterStates: 'characterStates',
                map: 'map',
                difficulty: 'difficulty'
            }
        },
        Accounts: {
            collectionName: 'accounts',
            fields: {
                id:'id',
                characters:'characters',
                email:'email',
                encounterId: 'encounterId'
            }
        }
    }
}
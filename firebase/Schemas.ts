export const Schemas = {
    Collections: {
        Encounters: {
            collectionName: 'rc-encounters',
            fields: {
                id: 'id',
                entities: 'entities',
                map: 'map',
                difficulty: 'difficulty'
            }
        },
        Accounts: {
            collectionName: 'rc-accounts',
            fields: {
                id:'id',
                email:'email',
                encounterId: 'encounterId',
                completedMissionIds: 'completedMissionIds'
            }
        }
    }
}
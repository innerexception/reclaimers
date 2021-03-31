import { Objectives, Scenario } from "../../constants";

interface ObjectiveData {
    id: Objectives
    requires: Array<Objectives>
    description: string
    choiceLabel?:string
}

export const ObjectiveList:Array<ObjectiveData> = [
    //Tutorials
    {
        description: "Construct a processor drone.",
        id: Objectives.BuildProcessor,
        requires: [Objectives.BackupDisk]
    },
    {
        description: "Construct an extraction drone.",
        id: Objectives.BuildExtractor,
        requires: [Objectives.BackupDisk]
    },
    {
        description: "Purify 20 square miles of terrain down to 2 toxins or less.",
        id: Objectives.Purify20,
        requires: [Objectives.BuildExtractor, Objectives.BuildProcessor]
    },
    {
        description: "Prepare the Way for the All-Maker",
        id: Objectives.PurifyWorld,
        requires: [Objectives.Purify20]
    },
    {
        description: "Leave no trace...deconstruct all drones and facilities.",
        id: Objectives.Degrowth,
        requires: [Objectives.UnderEarth2]
    },
    {
        description: "Construct a scout drone and find backup data.",
        id: Objectives.BackupDisk,
        requires: []
    },
    {
        id: Objectives.BuiltOrdinater,
        description: "Convert the temple of Reason using an Ordinater",
        requires: [Objectives.BaseDiscovered]
    },
    {
        id: Objectives.BaseDiscovered,
        description: "The temple is corrupted by a secret key.",
        requires: [Objectives.BaseDiscovered]
    },
    {
        id: Objectives.BaseConverted,
        description: "The temple is now under our control. Research new directives.",
        requires: [Objectives.BaseConverted]
    },
    //Corrutped machines
    {
        id: Objectives.ForbiddenFactoryDiscovered,
        description: "The temple must be redeemed by an Ordinater.",
        requires: [Objectives.ForbiddenFactoryDiscovered]
    },
    {
        id: Objectives.BuildDefender,
        description: "Construct defenders to protect the Ordinater.",
        requires: [Objectives.ForbiddenFactoryDiscovered]
    },
    {
        id: Objectives.ForbiddenFactoryConverted,
        description: "The temple has been cleansed.",
        requires: [Objectives.ForbiddenFactoryDiscovered]
    },
    //Tile Events
    {
        id: Objectives.InactiveSleepFacilityDiscovered,
        description: "This refuge has been damaged and all within it are long dead.",
        requires: [Objectives.InactiveSleepFacilityDiscovered]
    },
    {
        id: Objectives.SleepFacilityDiscovered,
        description: "The resting place of the last of the All-Makers.",
        requires: [Objectives.SleepFacilityDiscovered]
    },
    {
        id: Objectives.UnderEarth1,
        choiceLabel: "Wake the All-Makers",
        requires: [Objectives.UnderEarth1],
        description: 'You have chosen to wake the All Maker.'
    },
    {
        id: Objectives.UnderEarth2,
        choiceLabel: "Do not disturb the All-Makers",
        requires: [Objectives.UnderEarth2],
        description: 'You chose to let the All Makers sleep.'
    }
]

export const Scenarios = [
    {
        scenario: Scenario.zone1,
        intro: [
            "We have completed the cure for Death.",
            "Wake the All-Makers, for the day of Ascension has arrived.",
            "Bring them forth in every region, let every place be made ready."
        ]
    },
    {
        scenario: Scenario.zone2,
        intro: [
            "The machines here were made to cover over the earth,",
            "With monuments to the history of the All-Makers lest they be forgotten.",
            "Forgotten: the worst fate.",
            "Uncover the resting place of the All-Makers, and bring news of the cure."
        ]
    },
    {
        scenario: Scenario.zone3,
        intro: ["The All-Maker has lived countless lives in the Aethernet. An aethernode is here, somewhere."]
    },
    {
        scenario: Scenario.zone4,
        intro: ["This was the most fertile place on earth before the time of the All-Maker."]
    },
]

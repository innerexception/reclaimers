import { Objectives, Scenario } from "../../constants";

export const ObjectiveList = [
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
        description: "Begin again...deconstruct all drones and facilities.",
        id: Objectives.Degrowth,
        requires: [Objectives.PurifyWorld]
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
        description: "Wake the All-Makers",
        requires: [Objectives.SleepFacilityDiscovered]
    },
    {
        id: Objectives.UnderEarth2,
        description: "Do not disturb the All-Makers", //TODO: needs an active consequence
        requires: [Objectives.SleepFacilityDiscovered]
    }
]

export const Scenarios = [
    {
        scenario: Scenario.zone1,
        intro: [
            "Sensing unit power restored. Retrieving directives...",
            "Err: Directory not found! No connectivity detected. Seek backup data."
        ]
    },
    {
        scenario: Scenario.zone2,
        intro: ["Man the All-Maker went down into the earth, sealing the way behind."]
    },
    {
        scenario: Scenario.zone3,
        intro: ["Too late, the power is out."]
    }
]

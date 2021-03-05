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
        requires: [Objectives.BuildExtractor]
    },
    {
        description: "Purify 20 square miles of terrain down to 2 toxins or less.",
        id: Objectives.Purify20,
        requires: [Objectives.BuildExtractor]
    },
    {
        description: "Prepare the Way for the All-Maker",
        id: Objectives.PurifyWorld,
        requires: [Objectives.Purify20]
    },
    {
        description: "Construct a scout drone and find backup data.",
        id: Objectives.BackupDisk,
        requires: []
    },
    {
        id: Objectives.DiscoveredOrdinater,
        description: "Convert the temple of Reason using an Ordinater",
        requires: [Objectives.FindAnOrdinater]
    },
    {
        id: Objectives.FindAnOrdinater,
        description: "Find a way to discover the secret key of this temple",
        requires: [Objectives.BaseDiscovered]
    },
    {
        id: Objectives.BaseDiscovered,
        description: "The temple is locked by a secret key.",
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
        id: Objectives.UnderEarth1,
        description: "",
        requires: [Objectives.UnderEarth1]
    },
    {
        id: Objectives.UnderEarth2,
        description: "",
        requires: [Objectives.UnderEarth1]
    }
]

export const Scenarios = [
    {
        scenario: Scenario.LightOfTheWorld,
        intro: [
            "Sensing unit power restored. Retrieving directives...",
            "Err: Directory not found! No connectivity detected. Seek backup data."
        ]
    },
    {
        scenario: Scenario.Ordinaters,
        intro: ["Man the All-Maker went down into the earth, sealing the way behind."]
    }
]

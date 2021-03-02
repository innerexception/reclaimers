import { Objectives, Scenario } from "../../constants";

export const ObjectiveList = [
    {
        description: "Construct a processor drone.",
        id: Objectives.BuildProcessor,
        requires: []
    },
    {
        description: "Construct an extraction drone.",
        id: Objectives.BuildExtractor,
        requires: []
    },
    {
        description: "Purify 20 square miles of terrain down to 2 toxins or less.",
        id: Objectives.Purify20,
        requires: []
    },
    {
        description: "Construct a scout drone and find a backup data source.",
        id: Objectives.BackupDisk,
        requires: []
    },
    {
        id: Objectives.DiscoveredOrdinater,
        description: "Use the ordinater drone to deliver the secret key to another facility",
        requires: [Objectives.FindAnOrdinater]
    },
    {
        id: Objectives.FindAnOrdinater,
        description: "Find a way to discover the secret key of this facility",
        requires: [Objectives.BaseDiscovered]
    },
    {
        id: Objectives.BaseDiscovered,
        description: "This facility is locked by a secret key.",
        requires: []
    },
    {
        id: Objectives.BaseConverted,
        description: "This facility is now under our control. Downloading directives...incompatible directive format found.",
        requires: [Objectives.DiscoveredOrdinater]
    }
]

export const Scenarios = [
    {
        scenario: Scenario.LightOfTheWorld,
        intro: [
            "Solar activity increasing. Air particulates returning to normal. Radiation levels reduced.",
            "Sensing unit power restored. Retrieving directives...",
            "Err: Directory not found! No connectivity detected. Seek backup data.",
            "Temporary directive activated: Reclaim the Earth."
        ]
    },
    {
        scenario: Scenario.Ordinaters,
        intro: ["Man went down into the earth, sealing the way behind."]
    }
]

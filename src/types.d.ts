declare type TMessage = {
    sender: "master" | "player",
    command: "updateGame" | "selectQuestion" | "closeQuestion"
    data: any
}

declare type TDBEntry = {
    id: number
}

declare type TPlayer = {
    name: string,
    profilePicture?: string,
}

declare type TJoker = {
    name: string,
    description: string,
}

declare type TQuestion = {
    name: string,
    gameMasterInfo?: string,
    playerInfo?: string
    type: "video" | "audio" | "text" | "zoom" | "image",
    file?: string,
    text?: string,
    points: number,
    penalty: number,
    hints?: string[]
}

declare type TGame = {
    name: string,
    players: (TPlayer & TDBEntry)[],
    type: "basic" | "jeopardy"
    playerData: Record<number, {score: number, jokers?: {name: string, isUsed: boolean}}>,
    questionData: Record<number, boolean>,
    multiplier: number,
    questions?: (TQuestion & TDBEntry)[],
    currentQuestion?: number,
    categories?:{
        name: string,
        questions: (TQuestion & TDBEntry)[]
    }[],
}
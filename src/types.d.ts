declare type TDBEntry = {
    id: number
}

declare type TPlayer = {
    name: string,
    score: number,
    profilePicture?: Blob,
    jokers?: TJoker[]
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
    file?: Blob,
    text?: string,
    points: number,
    penalty: number,
}

declare type TBasicGame = {
    name: string,
    players: TPlayer[],
    questions: TQuestion[],
    currentQuestion: number
}

declare type TJeopardyGame = {
    name: string,
    players: TPlayer[],
    categories:{
        name: string,
        questions: TQuestion[]
    }[],
    currentQuestion: number
}
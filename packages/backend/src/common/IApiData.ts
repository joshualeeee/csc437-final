export interface IApiJournalData {
    id: string;
    author: IApiUserData;
    title: string;
    entry: string;
    date: string;
    
}

export interface IApiUserData {
    id: string,
    username: string
}
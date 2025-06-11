export interface IApiImageData {
    id: string;
    author: IApiUserData;
    title: string;
    entry: string;
    date: Date;
    
}

export interface IApiUserData {
    id: string,
    username: string
}
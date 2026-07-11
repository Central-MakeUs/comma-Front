import { relaxApiClient } from "./apiClient"

export type moodType = 'A' | 'B' | 'C';
export type timeType = 'X' | 'Y' | 'Z'; 

export interface recommendRequest {
    mood: moodType,
    time: timeType,
}

export interface recommendResponse {
    success: boolean,
    message: string,
    data: [
        {
            id: number,
            name: string,
            description: string,
            imageUrl: string,
            activeUserCount: number,
        }
    ]
}

export const recommend = async ({mood, time}:recommendRequest) => {
    console.log(`recommend start: ${mood}, ${time}`);
    const {data} = await relaxApiClient.get<recommendResponse>('/recommendations', {
        params: {
            mood,
            time,
        },
    });
    
    console.log(data);
    return data;
}
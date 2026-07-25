export const transformDate = (date:string) => {
    const diff = (Date.now() - new Date(date).getTime())/1000;
    if(diff < 60) return `${Math.floor(diff)}초 전`;
    else if(diff < 3600) return `${Math.floor(diff/60)}분 전`;
    else return `${Math.floor(diff/3600)}시간 전`;
}
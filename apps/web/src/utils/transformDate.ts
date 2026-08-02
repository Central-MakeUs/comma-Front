export const transformDate = (date: string) => {
  const t = new Date(date).getTime();
  if (Number.isNaN(t)) return '';

  const diff = Math.max(0, (Date.now() - t) / 1000);
  if (diff < 60) return `${Math.floor(diff)}초 전`;
  else if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  else if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  else return `${Math.floor(diff / 86400)}일 전`;
};

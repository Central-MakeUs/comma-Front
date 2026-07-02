export type fieldType = 'KAKAO' | 'GOOGLE' | 'APPLE';

export const login = async (field: fieldType) => {
  console.log('login start');
  let code: string | null = null;
  if (field === 'KAKAO') code = new URLSearchParams(window.location.search).get('code');
  else if (field === 'GOOGLE')
    code = new URLSearchParams(window.location.hash.slice(1)).get('access_token');
  if (!code) return null;
  console.log(code);
  const res = await (
    await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/login/${field}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code
      })
    })
  ).json();
  console.log(res);
  return res;
};

export type fieldType = 'KAKAO' | 'GOOGLE' | 'APPLE';

export const login = async (field: fieldType) => {
  console.log('login start');
  let code: string | null = null;
  code = new URLSearchParams(window.location.search).get('code');
  if (!code) return null;
  console.log(code);
  let redirectUri;
  if(field == 'KAKAO') redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  else if(field == 'GOOGLE') redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
  else redirectUri = import.meta.env.VITE_APPLE_REDIRECT_URI;
  const res = await (
    await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/login/${field}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code,
        redirectUri
      })
    })
  ).json();
  console.log(res);
  return res;
};

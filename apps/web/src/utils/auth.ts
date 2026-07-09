export type fieldType = 'KAKAO' | 'GOOGLE' | 'APPLE';

export const login = async (field: fieldType, appleCode?: string) => {
  console.log('login start');
  let code: string | null = null;
  if (field !== 'APPLE') code = new URLSearchParams(window.location.search).get('code');
  else code = appleCode ?? null;

  if (!code) return null;
  // console.log(code);
  let redirectUri: string;
  if (field === 'KAKAO') redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  else if (field === 'GOOGLE') redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
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
  // console.log(res);
  return res;
};

const BASE_URL = 'https://comma-production-9c37.up.railway.app';

export const login = async () => {
  const code = new URLSearchParams(window.location.search).get('code');
  console.log(code);
  const res = await (
    await fetch(`${BASE_URL}/api/auth/login/KAKAO`, {
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
};

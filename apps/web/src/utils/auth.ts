export const login = async () => {
  console.log('login start');
  const code = new URLSearchParams(window.location.search).get('code');
  console.log(code);
  const res = await (
    await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/login/KAKAO`, {
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

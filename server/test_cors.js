async function test() {
  try {
    const res = await fetch('https://team-task-manager-ag7w.onrender.com/api/auth/login', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://team-task-manager-61e8gjsia-vishu6213s-projects.vercel.app',
        'Access-Control-Request-Method': 'POST'
      }
    });
    console.log("CORS Header:", res.headers.get('access-control-allow-origin'));
  } catch(e) {
    console.error(e);
  }
}
test();

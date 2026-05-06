async function check() {
  const res = await fetch('https://team-task-manager-b5yeghcr8-vishu6213s-projects.vercel.app');
  const html = await res.text();
  
  const match = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
  if (match) {
    const jsUrl = 'https://team-task-manager-b5yeghcr8-vishu6213s-projects.vercel.app' + match[1];
    const jsRes = await fetch(jsUrl);
    const jsText = await jsRes.text();
    
    if (jsText.includes('http://localhost:5000')) {
      console.log("Vercel is STILL using LOCALHOST API! (Stale Build)");
    } 
    if (jsText.includes('https://team-task-manager-ag7w.onrender.com/api')) {
      console.log("Vercel is using RENDER API! (Correct Build)");
    }
  } else {
    console.log("Script not found");
  }
}
check();

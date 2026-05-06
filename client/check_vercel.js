async function check() {
  const res = await fetch('https://team-task-manager-b5yeghcr8-vishu6213s-projects.vercel.app');
  const html = await res.text();
  console.log(html);
}
check();

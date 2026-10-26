// Change this if your GitHub username differs
const GITHUB_USERNAME = "dbrack13";

const grid = document.getElementById("repo-grid");

if (grid) {
  const limit = Number(grid.dataset.limit) || 100;
  const status = document.getElementById("repo-status");

  fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`)
    .then((res) => {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then((repos) => {
      const shown = repos.filter((r) => !r.fork).slice(0, limit);
      if (!shown.length) {
        status.textContent = "No public repositories yet.";
        return;
      }
      status.remove();
      grid.innerHTML = shown.map(renderRepo).join("");
    })
    .catch(() => {
      status.innerHTML = `Couldn't load repositories. View them on <a href="https://github.com/${GITHUB_USERNAME}">GitHub</a>.`;
    });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function renderRepo(r) {
  const topics = (r.topics || []).slice(0, 3).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");
  return `
    <a class="card" href="${r.html_url}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">
      <h3>${escapeHtml(r.name)}</h3>
      <p>${escapeHtml(r.description) || "No description provided."}</p>
      <div>${topics}</div>
      <div class="meta">
        ${r.language ? `<span>● ${escapeHtml(r.language)}</span>` : ""}
        <span>★ ${r.stargazers_count}</span>
        <span>⑂ ${r.forks_count}</span>
      </div>
    </a>`;
}

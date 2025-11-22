const API_PAGE = `
  <header>
    <h1> Welcome to PONG</h1>
  </header>

  <main>
    <section class="card">
      <h2>Backend Test</h2>
      <p>Click the button below to call the backend API:</p>
      <input id="btn-theme" type="button" value="Themes" class="btn btn-test"/>
      <input id="btn-user" type="button" value="Users" class="btn btn-user"/>
      <input id="btn-play-ranked" type="button" value="Ranked" class="btn btn-play"/>
      <input id="btn-play-local" type="button" value="Local 2 Players" class="btn btn-play"/>
      <div id="print-content" class="response-box"></div>
    </section>
  </main>

  <footer>
    <p>Made with ❤️ at 42</p>
  </footer>
`;

export { API_PAGE };

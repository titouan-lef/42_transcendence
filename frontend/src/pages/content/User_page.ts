const USER_PAGE = `
  <header>
    <h1> Welcome to PONG</h1>
  </header>

  <main>
    <section class="card">
      <h2>Create new account</h2>
      <form class="form">
        <label for="user_id">Account name:</label>
        <input id="user_id" type="text"/>
        <label for="user_pseudo">Pseudo:</label>
        <input id="user_pseudo" type="text"/>
        <label for="user_password">Password:</label>
        <input id="user_password" type="password"/>
        <label for="conf_password">Confirm password:</label>
        <input id="conf_password" type="password"/>
        <input id="new_user" type="button" value="Create new user" class="btn new_user"/>
      </form>
      <div id="print-content" class="response-box"></div>
    </section>
  </main>

  <footer>
    <p>Made with ❤️ at 42</p>
  </footer>
`;

export { USER_PAGE };

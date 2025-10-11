const USER_PAGE = `
  <header>
    <h1> Welcome to PONG</h1>
  </header>

  <main>
    <section class="card">
      <h2>Create new account</h2>
      <form class="form">
        <label for="create_user_id">Account name:</label>
        <input id="create_user_id" type="text"/>
        <label for="create_user_pseudo">Pseudo:</label>
        <input id="create_user_pseudo" type="text"/>
        <label for="create_user_password">Password:</label>
        <input id="create_user_password" type="password"/>
        <label for="create_conf_password">Confirm password:</label>
        <input id="create_conf_password" type="password"/>
        <input id="create_new_user" type="button" value="Create new user"/>
      </form>
    </section>
    <section class="card">
      <h2>Login</h2>
      <form class="form">
        <label for="login_user_id">Account name:</label>
        <input id="login_user_id" type="text"/>
        <label for="login_user_password">Password:</label>
        <input id="login_user_password" type="password"/>
        <input id="login" type="button" value="Connect"/>
      </form>
    </section>
    <br>
    <div id="print-content" class="response-box"></div>
  </main>

  <footer>
    <p>Made with ❤️ at 42</p>
  </footer>
`;

export { USER_PAGE };

export const API_PAGE =
`
  <header>
    <h1> Welcome to PONG</h1>

    <div id="select_theme" class="flex gap-4 flex-wrap justify-center"></div>

  </header>

  <main>
    <section class="card">
      <h2>Backend Test</h2>
      <p>Click the button below to call the backend API:</p>
      <input id="btn-hello" type="button" value="Hello" class="btn btn-hello"/>
      <input id="btn-test" type="button" value="Test" class="btn btn-test"/>
      <div id="print-content" class="response-box"></div>
    </section>
  </main>

  <input id="btn-pizza" type="button" value="PIZZA" class="btn btn-hello"/>
  <input id="btn-gameover" type="button" value="GAME OVER" class="btn btn-test"/>
	<input id="btn-sugarrush" type="button" value="SUGAR RUSH" class="btn btn-test"/>

  <footer>
    <p>Made with ❤️ at 42</p>
  </footer>
`;

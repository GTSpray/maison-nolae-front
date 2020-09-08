import Application, { ApplicationConfiguration } from "./Application";

const appContainer = document.getElementById("app") as HTMLElement;
const loader = document.getElementById("teapotcontainer") as HTMLElement;

const oauthLink = document.getElementById("discord") as HTMLLinkElement;
oauthLink.href = process.env.discord_oauth_link as string;

appContainer.innerHTML = `
  <canvas id="kanvas"></canvas>
  <div id="panel">
    <div class="inputtextcontainer">
      <div class="webflow-style-input">
          <input id="pseudo" type="text" placeholder="pseudo"/>
      </div>
    </div>
    <div class="noevent">
      <div class="indicator">
        <input class="tgl tgl-flip" id="nope" type="checkbox"/>
        <label class="tgl-btn" data-tg-off="✘ Nope" data-tg-on="✔ Yeah!" for="cb5"></label>
      <div>
      <div class="indicator">
        <input class="tgl tgl-flip" id="uiactive" type="checkbox"/>
        <label class="tgl-btn" data-tg-off="◎" data-tg-on="◉" for="cb5"></label>
      <div>
    </div>
  </div>
`;

const conf: ApplicationConfiguration = {
  mapUrl: process.env.mapurl as string,
  pinSpriteUrl: process.env.pinspriteurl as string,
  wsendpoint: process.env.wsendpoint as string,
  backendendpoint: process.env.backendendpoint as string,
  canvas: document.getElementById("kanvas") as HTMLCanvasElement,
  pseudo: document.getElementById("pseudo") as HTMLInputElement,
  nope: document.getElementById("nope") as HTMLInputElement,
  uiactive: document.getElementById("uiactive") as HTMLInputElement,
};

const app = new Application(conf);
app
  .start()
  .then(() => {
    loader.style.display = "none";
    appContainer.style.display = "block";
  })
  .catch((err) => {
    loader.style.display = "flex";
    appContainer.style.display = "none";
    console.error(err);
  });

import Application, { ApplicationConfiguration } from "./Application";
import sandbox from "../.config/endpoint";

const appContainer = document.getElementById("app") as HTMLElement;

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
  mapUrl:
    "https://cdn.discordapp.com/attachments/437009603948183553/739789849942425630/Maison_de_Nolae.jpg",
  pinSpriteUrl: "http://www.clker.com/cliparts/w/O/e/P/x/i/map-marker-hi.png",
  wsendpoint: sandbox.wsendpoint,
  backendendpoint: sandbox.backendendpoint,
  canvas: document.getElementById("kanvas") as HTMLCanvasElement,
  pseudo: document.getElementById("pseudo") as HTMLInputElement,
  nope: document.getElementById("nope") as HTMLInputElement,
  uiactive: document.getElementById("uiactive") as HTMLInputElement
};

const app = new Application(conf);
app
  .start()
  .then(() => {
    const loader = document.getElementById("teapotcontainer") as HTMLElement;
    loader.style.display = "none";
    appContainer.style.display = "block";
  })
  .catch((err) => console.error(err));

import dotenv from "dotenv";
import Application, { ApplicationConfiguration } from "./Application";

dotenv.config();

const appContainer = document.getElementById("app") as HTMLElement;
const loader = document.getElementById("teapotcontainer") as HTMLElement;
const oauthLink = document.getElementById("discord") as HTMLLinkElement;

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


const wsendpoint="wss://maison-nolae-back.herokuapp.com",
backendendpoint="https://maison-nolae-back.herokuapp.com",
discord_oauth_link="https://discord.com/api/oauth2/authorize?client_id=743536530319998986&redirect_uri=https%3A%2F%2Fmaison-nolae.herokuapp.com&response_type=code&scope=identify%20guilds",
mapurl="https://cdn.discordapp.com/attachments/437009603948183553/739789849942425630/Maison_de_Nolae.jpg",
pinspriteurl="https://www.clker.com/cliparts/w/O/e/P/x/i/map-marker-hi.png";


oauthLink.href = discord_oauth_link as string;

const conf: ApplicationConfiguration = {
  mapUrl: mapurl as string,
  pinSpriteUrl: pinspriteurl as string,
  wsendpoint: wsendpoint as string,
  backendendpoint: backendendpoint as string,
  canvas: document.getElementById("kanvas") as HTMLCanvasElement,
  pseudo: document.getElementById("pseudo") as HTMLInputElement,
  nope: document.getElementById("nope") as HTMLInputElement,
  uiactive: document.getElementById("uiactive") as HTMLInputElement
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

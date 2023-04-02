import { Telegraf } from "telegraf";
import axios from "axios";
import * as cheerio from "cheerio";

const bot = new Telegraf("5921140574:AAFZEjU7yqouhpzaCfHSWL6H50_i9XGtAzY");

const getInfo = async () => {
  const html = await (
    await axios.get("https://www.antalyaeo.org.tr/tr/nobetci-eczaneler")
  ).data;

  let $ = cheerio.load(html);

  const map = {
    title: null,
    telephone: null,
    adress: null,
    coordinatesUrl: null,
    url: "https://www.antalyaeo.org.tr/tr/nobetci-eczaneler",
  };

  map.telephone = $('div.nobetciler:has(span:contains("Gazipaşa")) a:first')
    .attr("href")
    .replace(/[^0-9 | ' ']/gi, "")
    .trim();

  map.title = $('div.nobetciler:has(span:contains("Gazipaşa")) a:first')
    .text()
    .trim();

  map.adress = $('div.nobetciler:has(span:contains("Gazipaşa")) a:nth(2)')
    .text()
    .trim();

  map.coordinatesUrl = $(
    'div.nobetciler:has(span:contains("Gazipaşa")) a:nth(2)'
  )
    .attr("href")
    .trim();

  return map;
};

bot.hears("/аптека", async (ctx) => {
  const info = await getInfo();

  const speech =
    "Merhaba! Şu anda çalışıyor musun? (Здравствуйте, вы сейчас работаете?)";

  const translate = "Мерхаба! Шу анда чаляшыор мусун?";

  const extraInfo =
    "Некоторые аптеки могут не дежурить в ночное время; некоторые из них могут быть только дежурными или не могут дежурить из-за форс-мажора. Перед походом в аптеку рекомендуется подтвердить по телефону, что она открыта.";

  const PS = `Информация с сайта: ${info.url} `;
  // ctx.replyWithMarkdownV2(
  //   `🏣 \\*${info.title}\\* \n\n☎️ ${info.telephone} \n\n📍 ${info.adress} \n\n${info.coordinatesUrl} \n\n⚠️ ${extraInfo} \n\n😲 ${speech} \n${translate}`
  // );

  ctx.replyWithHTML(
    `<b>🏣 ${info.title}</b> \n\n☎️ ${info.telephone} \n\n📍 ${info.adress} \n\n${info.coordinatesUrl} \n\n⚠️ ${extraInfo} \n\n😲 ${speech} ${translate} \n\n <i>${PS}</i>`,
    { parse_mode: "HTML" }
  );
});

bot.launch();

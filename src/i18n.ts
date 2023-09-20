import I18n from "i18n";
import path from "path";

I18n.configure({
  locales: ["en", "pt-BR"],
  directory: path.join(__dirname, "translation"),
  defaultLocale: "pt-BR",
});

export default I18n;

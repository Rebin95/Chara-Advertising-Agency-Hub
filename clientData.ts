import type { Client } from './types';

export const CLIENT_DATA: Client[] = [
  {
    id: 1,
    name: "خەجێ خانم",
    type: "شیرەمەنی سروشتی و بەرهەمی خۆماڵی",
    about: "خاجی خانم یەکەم براندی کوردی بەرهەمی ناوخۆیە کە لە ساڵی 2010 دامەزراوە، گەورەترین براندی شیرەمەنییە لە کوردستان و عێراق. سێ لقی سەرەکییان لە سلێمانی هەیە.",
    locations: ["سلێمانی - هەواری تازە", "سلێمانی - بەختیاری پشت شارە جوانەکە", "سلێمانی - سەنتەری بازرگانی دانیا سیتی"],
    tasks: { videos: "12", posts: "لەگەڵ ڤیدیۆکانە", visiting: "N/A", stories: "N/A", sponsorship: "400 دۆلار" },
    pages: { facebook: "https://www.facebook.com/khaje.xanm/" }
  },
  {
    id: 2,
    name: "شیرەمەنی جوانڕۆ",
    type: "بەرهەمە شیرەمەنیە ناوخۆییەکان",
    about: "جوانڕۆ کارگەیەکی هەیە کە بەرهەمی ناوخۆیی بە بەرزترین کوالێتی بەرهەم دەهێنێت و بەسەر بازاڕەکانیدا دابەشی دەکات.",
    locations: ["سلێمانی/ ڕزگاری، بەرامبەر مزگەوتی حەزرەتی ئیبراهیم", "سلێمانی/ شەقامی بازنەی مەلیک مەحموود، بەرامبەر چوێسە", "سلێمانی / جوت سایدی کانی با - نزیک شاری سپی - بینای لازۆ مۆڵ"],
    tasks: { videos: "N/A", posts: "N/A", visiting: "N/A", stories: "N/A", sponsorship: "N/A" },
    pages: { facebook: "https://www.facebook.com/کارگەی شیرەمەنی.جوانڕۆ/" }
  },
  {
    id: 3,
    name: "چێشتخانەی الطبیخ",
    type: "ڕیستۆرانتی خواردنی عێراقی و بەغدادی",
    about: "یەکێکە لە چێشتخانەکانی شاری سلێمانی کە خواردنی کوردی و بەغدادی ئامادەدەکات و لە بۆنەکاندا گەشتیاران سەردانی دەکەن.",
    locations: ["سلێمانی شەقامی سالم بەرامبەر ئەزمەڕ ئەیر"],
    tasks: { videos: "2-3", posts: "15", visiting: "N/A", stories: "N/A", sponsorship: "200$" },
    pages: { facebook: "https://www.facebook.com/share/1CXKn6L4uD/?mibextid=wwXIfr", instagram: "https://www.instagram.com/tabeekh.suly?igsh=MXUxdzBzaWs2d25u" }
  },
  {
    id: 4,
    name: "TCHE TCHE پارکی ئازادی",
    type: "خواردنی خێرا، ڕێستۆرانت و کافێ",
    about: "Tche Tche براندێکی جیهانییە. ئەم لقەیان دەکەوێتە ناو شاری سلێمانی و خواردنی خێرا و نانی بەیانی پێشکەش دەکات.",
    locations: ["سلێمانی - تەنیشت دەرگای خوارەوەی پارکی ئازادی"],
    tasks: { videos: "2", posts: "10", visiting: "N/A", stories: "N/A", sponsorship: "200$" },
    pages: { facebook: "https://www.facebook.com/TCHESULAIMANI?mibextid=wwXIfr", instagram: "https://www.instagram.com/tchetche.cafe.sulaimani?igsh=MWF6eDBkamtsZTJ3Mw==" }
  },
  {
    id: 5,
    name: "TCHE TCHE ماجدی مۆڵ",
    type: "خواردنی خێرا، ڕێستۆرانت و کافێ",
    about: "ئەم لقەی Tche Tche دەکەوێتە ناو ماجدی مۆڵ و خواردنی خێرا و نانی بەیانی پێشکەش دەکات.",
    locations: ["سلێمانی - لە ناو ماجدی مۆڵ"],
    tasks: { videos: "4", posts: "8", visiting: "N/A", stories: "N/A", sponsorship: "200$" },
    pages: { facebook: "https://www.facebook.com/TCHESULAIMANI?mibextid=wwXIfr", instagram: "https://www.instagram.com/tchetche.cafe.sulaimani?igsh=MWF6eDBkamtsZTJ3Mw==" }
  },
  {
    id: 6,
    name: "ڕێستۆرانتی تێراس",
    type: "ڕیستۆرانت و باڕ",
    about: "ڕێستۆرانتێکە بە دیمەنێکی جوانی شاری سلێمانی (پارکی ئازادی). خواردنی خێرا، برژاو، و خواردنەوەی جۆراوجۆر پێشکەش دەکات.",
    locations: ["سلێمانی - نزیک دەرگای خوارەوەی پارکی ئازادی"],
    tasks: { videos: "2", posts: "10", visiting: "N/A", stories: "N/A", sponsorship: "100$" },
    pages: { facebook: "https://www.facebook.com/share/18zqPyBSug/?mibextid=wwXIfr", instagram: "https://www.instagram.com/terrace_restaurantt?igsh=aGVxMmtlbHVpbnJj" }
  },
  {
    id: 7,
    name: "کارگەی چرۆ",
    type: "کارگەی دروستکردنی خواردنی ئامادەکراو",
    about: "کارگەیەکە بۆ ئامادەکردنی خواردنە کوردەوارییەکان و شیرینی. لەلایەن ستافێکی خانمانەوە بەڕێوەدەبرێت و تەنها گەیاندنیان هەیە.",
    locations: ["سلێمانی - عەقاری خوار ئەمنەسورەکە"],
    tasks: { videos: "1", posts: "4", visiting: "N/A", stories: "N/A", sponsorship: "0" },
    pages: { facebook: "https://www.facebook.com/share/14uXibkSn9/?mibextid=wwXIfr", instagram: "https://www.instagram.com/chrofactory?igsh=MXA0czlrMXJmbWk0Mg==" }
  },
  {
    id: 8,
    name: "کۆرۆڤکا",
    type: "بسکیت و شیر و بابەتی مناڵان",
    about: "وەکیلی براندی کۆرۆڤکای ڕووسییە لە عێراق و بەرهەمەکانیان بەسەر مارکێتەکاندا دابەش دەکات.",
    locations: [],
    tasks: { videos: "2", posts: "10", visiting: "N/A", stories: "N/A", sponsorship: "100$" },
    pages: { facebook: "https://www.facebook.com/uniconfiraq" }
  },
  {
    id: 9,
    name: "ڕێستۆرانتی حمودی",
    type: "خواردنی دەریایی و گۆشت و مریشکی برژاو",
    about: "ڕێستۆرانتێکی گەورەیە لە سلێمانی کە خواردنی دەریایی، برژاو، و فاست فوودی تەندروست پێشکەش دەکات.",
    locations: [],
    tasks: { videos: "8", posts: "14", visiting: "N/A", stories: "N/A", sponsorship: "200$" },
    pages: { facebook: "https://www.facebook.com/profile.php?id=61578012819860" }
  },
  {
    id: 10,
    name: "ڤینێکس",
    type: "کافی و سەنتەری بلیارد و نێرگەلە",
    about: "شوێنێکی خۆشە بۆ گەنجان لە پڕۆژەی دەروازە کۆڕنیشی شاری سلێمانی.",
    locations: ["پڕۆژەی دەروازە کۆڕنیشی شاری سلێمانی"],
    tasks: { videos: "4", posts: "10", visiting: "N/A", stories: "N/A", sponsorship: "200$" },
    pages: { facebook: "https://www.facebook.com/profile.php?id=61582130316119" }
  },
  {
    id: 11,
    name: "پاشا تراڤڵ",
    type: "کۆمپانیای گەشتیاری",
    about: "کۆمپانیایەکە بۆ دەستەبەرکردنی تیکت، ڤیزا، هۆتێل، مۆڵەتی شۆفێری و گروپی گەشتیاری.",
    locations: ["شاری سلێمانی لە شەقامی سالم"],
    tasks: { videos: "2", posts: "10", visiting: "N/A", stories: "N/A", sponsorship: "N/A" },
    pages: { facebook: "https://www.facebook.com/share/16TMYmJSjP/?mibextid=wwXIfr", instagram: "https://www.instagram.com/pashaa.travel?igsh=MWZuNzA4ZTMyaGJnZA==", tiktok: "https://www.tiktok.com/@pasha.fardo.travel?_t=ZS-8vkWRphF162&_r=1" }
  },
  {
    id: 12,
    name: "تەلاری پزیشکی هایکوالێتی",
    type: "تەلاری پزیشکی",
    about: "تەلارێکی پزیشکییە کە پێکدێت لە چەندین پزیشکی شارەزا، دەرمانخانە و تاقیگە. پزیشکەکان: د. هاژە عبدللە، د. ڕەنج بلال، د. ئالان نهاد، د. کرمانج محمد.",
    locations: ["سلێمانی - شەقامی سەرەکی ابراهیم پاشا - بەرامبەر مزگەوتی صلاح الدین"],
    tasks: { videos: "2", posts: "10", visiting: "N/A", stories: "N/A", sponsorship: "25$" },
    pages: {}
  },
  {
    id: 13,
    name: "سەنتەری دکتۆرە شیلان",
    type: "سەنتەری جوانکاری",
    about: "سەنتەرێکی جوانکارییە کە کاری لێزەر، فیلەر، بۆتۆکس، پلازما و چەندین کاری دیکەی جوانکاری پێست ئەنجام دەدات.",
    locations: ["شاری سلێمانی لە شەقامی توی مەلیک"],
    tasks: { videos: "2-3", posts: "10", visiting: "N/A", stories: "N/A", sponsorship: "لەسەر داواکاری خۆیان" },
    pages: { facebook: "https://www.facebook.com/share/18gfXDXCk5/?mibextid=wwXIfr", instagram: "https://www.instagram.com/dr.shelan?igsh=MWk0azM5ampnemw5bA==" }
  },
  {
    id: 14,
    name: "دكتۆره كۆسار عەلی رشید",
    type: "پزیشکی پسپۆڕی چاو",
    about: "پزیشکی پسپۆڕی نەخۆشییەکان و نەشتەرگەری چاو. چارەسەری ئاوی ڕەش، ئاوی سپی، چاوکزی و نەخۆشییەکانی دیکەی چاو دەکات.",
    locations: [],
    tasks: { videos: "N/A", posts: "5", visiting: "N/A", stories: "N/A", sponsorship: "10$" },
    pages: { facebook: "https://www.facebook.com/share/1A5j8sRJoZ/?mibextid=wwXIfr", instagram: "https://www.instagram.com/dr.kosaralirashid?igsh=MTMwdjlzZXk2c21rYw==" }
  },
  {
    id: 15,
    name: "دکتۆر سمییە عطا نەقشبەندی",
    type: "پسپۆری نەخۆشیەکانی ژنان و منداڵبوون",
    about: "پسپۆری نەخۆشییەکانی ژنان، منداڵبوون، نەزۆکی و نەشتەرگەری ژنان. کلینیکی دکتۆرە لە تەلاری پزیشکی هەرمانە.",
    locations: ["تەلاری پزیشکی هەرمان، سەرەتای شەقامی توویمەلیک"],
    tasks: { videos: "1", posts: "2 мۆشن", visiting: "N/A", stories: "N/A", sponsorship: "50$" },
    pages: { facebook: "https://www.facebook.com/share/14EkHhKPbxy/?mibextid=wwXIfr", instagram: "https://www.instagram.com/dr_sumaia_?igsh=MWJyeTdnMDZwcTJoYQ==" }
  },
  {
    id: 16,
    name: "دکتۆر سەردار ابراهیم",
    type: "پسپۆری نەشتەرگەری گشتی",
    about: "پسپۆڕی نەشتەرگەری گشتی و چارەسەری نەخۆشییەکانی کۆم بە لەیزەر. لە تەلاری پزیشکی هەرمان کاردەکات.",
    locations: ["تەلاری پزیشکی هەرمان، سەرەتای شەقامی توویمەلیک"],
    tasks: { videos: "1", posts: "5", visiting: "N/A", stories: "N/A", sponsorship: "50$" },
    pages: { facebook: "https://www.facebook.com/share/15zZYbzKsw/?mibextid=wwXIfr" }
  },
  {
    id: 17,
    name: "تەلاری شێرکۆ",
    type: "تەلاری پزیشکی",
    about: "تەلارێکی پزیشکییە کە د. دیاری نیهاد (نەشتەرگەری گشتی و قەڵەوی) و د. دلۆڤان محمد (ژنان و منداڵبوون)ی تێدایە.",
    locations: ["شاری سلێمانی لە شەقامی ابراهیم پاشا"],
    tasks: { videos: "3", posts: "10", visiting: "N/A", stories: "N/A", sponsorship: "100$" },
    pages: { facebook: "https://www.facebook.com/share/1APJLZuzzB/?mibextid=wwXIfr", instagram: "https://www.instagram.com/sherko_medical_building?igsh=MmltZ21iZTVudm8w" }
  },
  {
    id: 18,
    name: "سەنتەری سیتی سمایل",
    type: "سەنتەری پزیشکی ددان",
    about: "سەنتەرێک بۆ جوانکاری، ڕێککردنەوە، چاندن و چارەسەری کێشەکانی ددان. چەندین پزیشکی پسپۆڕی تێدایە.",
    locations: ["شاری سلێمانی، گەڕەکی ئاشتی، بەرامبەر قوتابخانەی بڵند"],
    tasks: { videos: "2", posts: "10", visiting: "N/A", stories: "N/A", sponsorship: "100$" },
    pages: { facebook: "https://www.facebook.com/share/1Eva7Kv2g2/?mibextid=wwXIfr", instagram: "https://www.instagram.com/citysmiledesign?igsh=MWdrN2NkZm5jbnZ5aQ==" }
  },
  {
    id: 19,
    name: "دکتۆر ھاوار حسن نەقشبەندی",
    type: "پسپۆڕی نەخۆشیەکانی مەمک و غودە",
    about: "پسپۆڕی نەخۆشییەکانی مەمک، غودە، کۆئەندامی هەرس، ناظور و قەڵەوی. مامۆستایە لە زانکۆی سلێمانی.",
    locations: ["تەلاری پزیشکی خانی، سەرەتای شەقامی توویمەلیک"],
    tasks: { videos: "2-3", posts: "10", visiting: "N/A", stories: "N/A", sponsorship: "100$" },
    pages: { facebook: "https://www.facebook.com/share/1J2mgQ9SPc/?mibextid=wwXIfr", instagram: "https://www.instagram.com/dr.hawarnaqshbandi?igsh=ZWY0ZXBkeXlzNXlh" }
  }
];
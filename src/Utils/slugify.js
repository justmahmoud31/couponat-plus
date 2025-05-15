import mongoose from "mongoose";

export default function slugify(text) {
  if (!text) return "";

  const arabicTranslation = {
    أ: "a",
    إ: "e",
    آ: "a",
    ب: "b",
    ت: "t",
    ث: "th",
    ج: "j",
    ح: "h",
    خ: "kh",
    د: "d",
    ذ: "th",
    ر: "r",
    ز: "z",
    س: "s",
    ش: "sh",
    ص: "s",
    ض: "d",
    ط: "t",
    ظ: "z",
    ع: "a",
    غ: "gh",
    ف: "f",
    ق: "q",
    ك: "k",
    ل: "l",
    م: "m",
    ن: "n",
    ه: "h",
    و: "w",
    ي: "y",
    ى: "a",
    ة: "a",
    ء: "",
    ؤ: "o",
    ئ: "e",
  };

  let transliterated = "";
  for (let i = 0; i < text.length; i++) {
    if (arabicTranslation[text[i]]) {
      transliterated += arabicTranslation[text[i]];
    } else {
      transliterated += text[i];
    }
  }

  let slug = transliterated
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  if (!slug) {
    const randomId = new mongoose.Types.ObjectId().toString().substring(0, 6);
    slug = `store-${randomId}`;
  }

  return slug;
}

import { Category } from "../Models/Category.js";
import mongoose from "mongoose";

export const seedCategories = async () => {
  try {
    await Category.deleteMany({});
    console.log("✅ Cleared existing categories");

    const mainCategories = [
      {
        name: "إلكترونيات",
        slug: "electronics",
        description: "أحدث المنتجات الإلكترونية وأفضل العروض",
        subcategories: [
          {
            name: "هواتف ذكية",
            slug: "smartphones",
            description: "أحدث الهواتف الذكية من مختلف الشركات",
            children: [
              { name: "آيفون", slug: "iphone" },
              { name: "سامسونج", slug: "samsung" },
              { name: "هواوي", slug: "huawei" },
              { name: "شاومي", slug: "xiaomi" },
              { name: "وان بلس", slug: "oneplus" },
              { name: "جوجل بيكسل", slug: "google-pixel" },
              { name: "موتورولا", slug: "motorola" },
              { name: "نوكيا", slug: "nokia" },
              { name: "ريلمي", slug: "realme" },
              { name: "فيفو", slug: "vivo" },
              { name: "أوبو", slug: "oppo" },
            ],
          },
          {
            name: "حواسيب",
            slug: "computers",
            description: "أجهزة الكمبيوتر المكتبية والمحمولة",
            children: [
              { name: "لابتوب", slug: "laptops" },
              { name: "كمبيوتر مكتبي", slug: "desktops" },
              { name: "ماك بوك", slug: "macbooks" },
              { name: "ألعاب", slug: "gaming-pc" },
              {
                name: "أجهزة كمبيوتر محمولة للأعمال",
                slug: "business-laptops",
              },
              { name: "لابتوب للطلاب", slug: "student-laptops" },
              { name: "أجهزة ألترابوك", slug: "ultrabooks" },
              { name: "حواسيب لتحرير الفيديو", slug: "video-editing-pcs" },
              { name: "محطات العمل", slug: "workstations" },
            ],
          },
          {
            name: "أجهزة لوحية",
            slug: "tablets",
            description: "الأجهزة اللوحية بمختلف الأحجام",
            children: [
              { name: "آيباد", slug: "ipad" },
              { name: "تابلت أندرويد", slug: "android-tablets" },
              { name: "سيرفس", slug: "surface" },
              { name: "آيباد برو", slug: "ipad-pro" },
              { name: "سامسونج تاب", slug: "samsung-tab" },
              { name: "تابلت للأطفال", slug: "kids-tablets" },
              { name: "آيباد ميني", slug: "ipad-mini" },
              { name: "تابلت للرسم", slug: "drawing-tablets" },
            ],
          },
          {
            name: "سماعات",
            slug: "headphones",
            description: "سماعات سلكية ولاسلكية",
            children: [
              { name: "سماعات لاسلكية", slug: "wireless-headphones" },
              { name: "سماعات أذن", slug: "earbuds" },
              { name: "سماعات رأس", slug: "over-ear" },
              { name: "سماعات مع ميكروفون", slug: "headsets" },
              { name: "سماعات إلغاء الضوضاء", slug: "noise-cancelling" },
              { name: "سماعات للرياضة", slug: "sports-headphones" },
              { name: "سماعات بلوتوث", slug: "bluetooth-headphones" },
              { name: "سماعات للألعاب", slug: "gaming-headphones" },
            ],
          },
          {
            name: "تلفزيونات",
            slug: "tvs",
            description: "تلفزيونات ذكية عالية الدقة",
            children: [
              { name: "تلفزيونات ذكية", slug: "smart-tvs" },
              { name: "تلفزيونات 4K", slug: "4k-tvs" },
              { name: "تلفزيونات OLED", slug: "oled-tvs" },
              { name: "تلفزيونات QLED", slug: "qled-tvs" },
              { name: "تلفزيونات 8K", slug: "8k-tvs" },
              { name: "تلفزيونات HDR", slug: "hdr-tvs" },
              { name: "تلفزيونات صغيرة", slug: "small-tvs" },
              { name: "تلفزيونات كبيرة", slug: "large-tvs" },
            ],
          },
          {
            name: "الصوتيات",
            slug: "audio",
            description: "أنظمة صوتية ومكبرات صوت",
            children: [
              { name: "مكبرات صوت بلوتوث", slug: "bluetooth-speakers" },
              { name: "أنظمة مسرح منزلي", slug: "home-theater" },
              { name: "ساوند بار", slug: "soundbars" },
              { name: "مشغلات MP3", slug: "mp3-players" },
              { name: "أنظمة الصوت المحيطي", slug: "surround-sound" },
              { name: "مضخمات صوت", slug: "amplifiers" },
              { name: "مشغلات فينيل", slug: "vinyl-players" },
              { name: "مكبرات صوت ذكية", slug: "smart-speakers" },
            ],
          },
          {
            name: "كاميرات",
            slug: "cameras",
            description: "كاميرات رقمية واحترافية",
            children: [
              { name: "كاميرات DSLR", slug: "dslr-cameras" },
              { name: "كاميرات بدون مرآة", slug: "mirrorless-cameras" },
              { name: "كاميرات كومباكت", slug: "compact-cameras" },
              { name: "كاميرات أكشن", slug: "action-cameras" },
              { name: "كاميرات فورية", slug: "instant-cameras" },
              { name: "عدسات الكاميرا", slug: "camera-lenses" },
              { name: "كاميرات المراقبة", slug: "security-cameras" },
              { name: "طائرات بدون طيار", slug: "drones" },
            ],
          },
          {
            name: "أجهزة ذكية",
            slug: "smart-devices",
            description: "أجهزة ذكية للمنزل والاستخدام الشخصي",
            children: [
              { name: "ساعات ذكية", slug: "smartwatches" },
              { name: "أجهزة تتبع اللياقة", slug: "fitness-trackers" },
              { name: "مساعدات صوتية", slug: "voice-assistants" },
              { name: "أجهزة ذكية منزلية", slug: "smart-home" },
              { name: "أجهزة إضاءة ذكية", slug: "smart-lighting" },
              { name: "أجهزة أمان ذكية", slug: "smart-security" },
              { name: "أنظمة ترموستات ذكية", slug: "smart-thermostats" },
              { name: "أجهزة تحكم بالمنزل", slug: "home-automation" },
            ],
          },
        ],
      },
      {
        name: "أزياء",
        slug: "fashion",
        description: "أحدث صيحات الموضة والأزياء",
        subcategories: [
          {
            name: "ملابس رجالية",
            slug: "mens-clothing",
            description: "أزياء وملابس للرجال",
            children: [
              { name: "قمصان", slug: "shirts" },
              { name: "بناطيل", slug: "pants" },
              { name: "أحذية", slug: "shoes" },
              { name: "اكسسوارات", slug: "accessories" },
              { name: "بدلات", slug: "suits" },
              { name: "جاكيتات", slug: "jackets" },
              { name: "سترات", slug: "sweaters" },
              { name: "تي شيرت", slug: "t-shirts" },
              { name: "جينز", slug: "jeans" },
              { name: "ملابس رياضية", slug: "sports-wear" },
              { name: "ملابس داخلية", slug: "underwear" },
            ],
          },
          {
            name: "ملابس نسائية",
            slug: "womens-clothing",
            description: "أزياء وملابس للنساء",
            children: [
              { name: "فساتين", slug: "dresses" },
              { name: "بلوزات", slug: "blouses" },
              { name: "أحذية", slug: "women-shoes" },
              { name: "حقائب", slug: "bags" },
              { name: "اكسسوارات", slug: "women-accessories" },
              { name: "تنانير", slug: "skirts" },
              { name: "بناطيل", slug: "women-pants" },
              { name: "جاكيتات", slug: "women-jackets" },
              { name: "عبايات", slug: "abayas" },
              { name: "جلابيات", slug: "jalabiyas" },
              { name: "لانجري", slug: "lingerie" },
              { name: "أوشحة", slug: "scarves" },
              { name: "ملابس رياضية", slug: "women-sportswear" },
            ],
          },
          {
            name: "ملابس أطفال",
            slug: "kids-clothing",
            description: "ملابس للأطفال من مختلف الأعمار",
            children: [
              { name: "ملابس أولاد", slug: "boys-clothing" },
              { name: "ملابس بنات", slug: "girls-clothing" },
              { name: "ملابس أطفال رضع", slug: "baby-clothing" },
              { name: "أحذية أطفال", slug: "kids-shoes" },
              { name: "ملابس المدرسة", slug: "school-uniforms" },
              { name: "ملابس للنوم", slug: "sleepwear" },
              { name: "ملابس السباحة", slug: "swimwear" },
              { name: "إكسسوارات أطفال", slug: "kids-accessories" },
            ],
          },
          {
            name: "ساعات",
            slug: "watches",
            description: "ساعات فاخرة ورياضية",
            children: [
              { name: "ساعات ذكية", slug: "smartwatches" },
              { name: "ساعات فاخرة", slug: "luxury-watches" },
              { name: "ساعات رياضية", slug: "sport-watches" },
              { name: "ساعات كلاسيكية", slug: "classic-watches" },
              { name: "ساعات كاجوال", slug: "casual-watches" },
              { name: "ساعات أوتوماتيكية", slug: "automatic-watches" },
              { name: "ساعات كوارتز", slug: "quartz-watches" },
            ],
          },
          {
            name: "مجوهرات",
            slug: "jewelry",
            description: "مجوهرات وإكسسوارات فاخرة",
            children: [
              { name: "خواتم", slug: "rings" },
              { name: "أساور", slug: "bracelets" },
              { name: "قلادات", slug: "necklaces" },
              { name: "أقراط", slug: "earrings" },
              { name: "مجوهرات ذهبية", slug: "gold-jewelry" },
              { name: "مجوهرات فضية", slug: "silver-jewelry" },
              { name: "مجوهرات للرجال", slug: "mens-jewelry" },
            ],
          },
          {
            name: "أحذية",
            slug: "footwear",
            description: "تشكيلة واسعة من الأحذية",
            children: [
              { name: "أحذية رجالية", slug: "mens-footwear" },
              { name: "أحذية نسائية", slug: "womens-footwear" },
              { name: "أحذية رياضية", slug: "sports-shoes" },
              { name: "أحذية رسمية", slug: "formal-shoes" },
              { name: "صنادل", slug: "sandals" },
              { name: "أحذية كاجوال", slug: "casual-shoes" },
              { name: "أحذية للأطفال", slug: "children-footwear" },
            ],
          },
        ],
      },
      {
        name: "منزل وحديقة",
        slug: "home-garden",
        description: "مستلزمات المنزل والحدائق",
        subcategories: [
          {
            name: "أثاث",
            slug: "furniture",
            description: "أثاث منزلي عصري",
            children: [
              { name: "غرف معيشة", slug: "living-room" },
              { name: "غرف نوم", slug: "bedroom" },
              { name: "مطبخ وطعام", slug: "kitchen-dining" },
              { name: "مكاتب", slug: "office-furniture" },
              { name: "أثاث خارجي", slug: "outdoor-furniture" },
              { name: "أثاث للأطفال", slug: "kids-furniture" },
              { name: "خزائن", slug: "storage-furniture" },
              { name: "أرائك", slug: "sofas" },
              { name: "كراسي", slug: "chairs" },
              { name: "طاولات", slug: "tables" },
            ],
          },
          {
            name: "مستلزمات المطبخ",
            slug: "kitchen",
            description: "أدوات وأجهزة مطبخ",
            children: [
              { name: "أجهزة صغيرة", slug: "small-appliances" },
              { name: "أواني طهي", slug: "cookware" },
              { name: "أدوات مائدة", slug: "tableware" },
              { name: "تخزين", slug: "storage" },
              { name: "أجهزة القهوة", slug: "coffee-makers" },
              { name: "أفران", slug: "ovens" },
              { name: "خلاطات", slug: "blenders" },
              { name: "محضرات طعام", slug: "food-processors" },
              { name: "أدوات الخبز", slug: "baking-tools" },
              { name: "مستلزمات تحضير الطعام", slug: "food-preparation" },
            ],
          },
          {
            name: "حديقة",
            slug: "garden",
            description: "مستلزمات وأثاث الحدائق",
            children: [
              { name: "أثاث حدائق", slug: "garden-furniture" },
              { name: "نباتات", slug: "plants" },
              { name: "أدوات حدائق", slug: "gardening-tools" },
              { name: "معدات سقي", slug: "watering-equipment" },
              { name: "بذور", slug: "seeds" },
              { name: "تربة وأسمدة", slug: "soil-fertilizers" },
              { name: "أحواض وأصص", slug: "planters-pots" },
              { name: "معدات جز العشب", slug: "lawn-mowers" },
              { name: "شواء وباربكيو", slug: "barbecue-grilling" },
              { name: "ديكورات خارجية", slug: "outdoor-decor" },
            ],
          },
          {
            name: "ديكور",
            slug: "decor",
            description: "اكسسوارات وديكورات منزلية",
            children: [
              { name: "إضاءة", slug: "lighting" },
              { name: "مفروشات", slug: "textiles" },
              { name: "إكسسوارات جدران", slug: "wall-decor" },
              { name: "سجاد وبسط", slug: "rugs-carpets" },
              { name: "وسائد", slug: "pillows" },
              { name: "ستائر", slug: "curtains" },
              { name: "إطارات صور", slug: "photo-frames" },
              { name: "مرايا", slug: "mirrors" },
              { name: "ساعات حائط", slug: "wall-clocks" },
              { name: "نباتات داخلية", slug: "indoor-plants" },
            ],
          },
          {
            name: "أجهزة منزلية",
            slug: "home-appliances",
            description: "أجهزة منزلية كبيرة وصغيرة",
            children: [
              { name: "ثلاجات", slug: "refrigerators" },
              { name: "غسالات", slug: "washing-machines" },
              { name: "مجففات", slug: "dryers" },
              { name: "مكيفات هواء", slug: "air-conditioners" },
              { name: "مكانس كهربائية", slug: "vacuum-cleaners" },
              { name: "غسالات صحون", slug: "dishwashers" },
              { name: "أفران", slug: "ovens-ranges" },
              { name: "مراوح", slug: "fans" },
              { name: "مبردات مياه", slug: "water-coolers" },
            ],
          },
          {
            name: "مستلزمات الحمام",
            slug: "bathroom",
            description: "أكسسوارات ومستلزمات الحمام",
            children: [
              { name: "مناشف", slug: "towels" },
              { name: "ستائر الاستحمام", slug: "shower-curtains" },
              { name: "إكسسوارات الحمام", slug: "bathroom-accessories" },
              { name: "تخزين الحمام", slug: "bathroom-storage" },
              { name: "مرايا الحمام", slug: "bathroom-mirrors" },
              { name: "صنابير ودش", slug: "faucets-showerheads" },
              { name: "سجاد الحمام", slug: "bathroom-rugs" },
            ],
          },
        ],
      },
      {
        name: "صحة وجمال",
        slug: "health-beauty",
        description: "منتجات العناية الشخصية والجمال",
        subcategories: [
          {
            name: "عطور",
            slug: "perfumes",
            description: "عطور نسائية ورجالية",
            children: [
              { name: "عطور نسائية", slug: "women-perfumes" },
              { name: "عطور رجالية", slug: "men-perfumes" },
              { name: "مجموعات عطور", slug: "perfume-sets" },
              { name: "عطور شرقية", slug: "oriental-perfumes" },
              { name: "عطور فرنسية", slug: "french-perfumes" },
              { name: "عطور فواحة", slug: "eau-de-parfum" },
              { name: "كولونيا", slug: "cologne" },
              { name: "عطور طبيعية", slug: "natural-perfumes" },
              { name: "معطرات الجسم", slug: "body-mists" },
            ],
          },
          {
            name: "مستحضرات تجميل",
            slug: "makeup",
            description: "مكياج وأدوات تجميل",
            children: [
              { name: "وجه", slug: "face-makeup" },
              { name: "عيون", slug: "eye-makeup" },
              { name: "شفاه", slug: "lips" },
              { name: "طقم مكياج", slug: "makeup-sets" },
              { name: "أساس البشرة", slug: "foundation" },
              { name: "كونسيلر", slug: "concealer" },
              { name: "أحمر الخدود", slug: "blush" },
              { name: "برونزر وهايلايتر", slug: "bronzer-highlighter" },
              { name: "ظلال العيون", slug: "eyeshadow" },
              { name: "كحل وآيلاينر", slug: "eyeliner" },
              { name: "ماسكارا", slug: "mascara" },
              { name: "أحمر شفاه", slug: "lipstick" },
              { name: "فرش المكياج", slug: "makeup-brushes" },
            ],
          },
          {
            name: "العناية بالبشرة",
            slug: "skincare",
            description: "منتجات للعناية بالبشرة",
            children: [
              { name: "منظفات", slug: "cleansers" },
              { name: "مرطبات", slug: "moisturizers" },
              { name: "سيروم", slug: "serums" },
              { name: "أقنعة", slug: "masks" },
              { name: "كريمات العين", slug: "eye-creams" },
              { name: "واقي شمس", slug: "sunscreen" },
              { name: "تونر", slug: "toners" },
              { name: "مقشرات", slug: "exfoliators" },
              { name: "زيوت البشرة", slug: "face-oils" },
              { name: "منتجات مكافحة الشيخوخة", slug: "anti-aging" },
              { name: "منتجات لحب الشباب", slug: "acne-treatments" },
              { name: "منتجات العناية بالشفاه", slug: "lip-care" },
            ],
          },
          {
            name: "العناية بالشعر",
            slug: "haircare",
            description: "منتجات للعناية بالشعر",
            children: [
              { name: "شامبو وبلسم", slug: "shampoo-conditioner" },
              { name: "زيوت شعر", slug: "hair-oils" },
              { name: "أجهزة تصفيف", slug: "styling-tools" },
              { name: "ماسكات للشعر", slug: "hair-masks" },
              { name: "سيروم للشعر", slug: "hair-serums" },
              { name: "صبغات شعر", slug: "hair-colors" },
              { name: "بخاخات تصفيف", slug: "styling-sprays" },
              { name: "مستحضرات فرد الشعر", slug: "hair-straightening" },
              { name: "منتجات للشعر المجعد", slug: "curly-hair-products" },
              { name: "مستحضرات مكافحة تساقط الشعر", slug: "anti-hair-loss" },
            ],
          },
          {
            name: "العناية الشخصية",
            slug: "personal-care",
            description: "منتجات النظافة والعناية الشخصية",
            children: [
              { name: "صابون ومنظفات", slug: "soap-cleansers" },
              { name: "مزيلات العرق", slug: "deodorants" },
              { name: "منتجات الاستحمام", slug: "bath-products" },
              { name: "العناية بالأسنان", slug: "dental-care" },
              { name: "منتجات الحلاقة", slug: "shaving-products" },
              { name: "منتجات اللحية", slug: "beard-care" },
              { name: "مستحضرات الشعر للرجال", slug: "mens-hair-products" },
              { name: "منتجات النظافة النسائية", slug: "feminine-hygiene" },
            ],
          },
          {
            name: "العناية بالجسم",
            slug: "body-care",
            description: "منتجات العناية بالجسم",
            children: [
              { name: "مرطبات الجسم", slug: "body-lotions" },
              { name: "زيوت الجسم", slug: "body-oils" },
              { name: "مقشرات الجسم", slug: "body-scrubs" },
              { name: "كريمات لليدين", slug: "hand-creams" },
              { name: "العناية بالقدمين", slug: "foot-care" },
              { name: "منتجات مكافحة السيلوليت", slug: "anti-cellulite" },
              { name: "منتجات تسمير البشرة", slug: "tanning-products" },
              { name: "منتجات مكافحة علامات التمدد", slug: "stretch-marks" },
            ],
          },
        ],
      },
      {
        name: "رياضة وترفيه",
        slug: "sports-leisure",
        description: "مستلزمات رياضية وترفيهية",
        subcategories: [
          {
            name: "ملابس رياضية",
            slug: "sportswear",
            description: "ملابس وأحذية رياضية",
            children: [
              { name: "ملابس رجالية", slug: "mens-sportswear" },
              { name: "ملابس نسائية", slug: "womens-sportswear" },
              { name: "أحذية رياضية", slug: "sport-shoes" },
              { name: "ملابس للجري", slug: "running-clothes" },
              { name: "ملابس اليوغا", slug: "yoga-clothes" },
              { name: "ملابس السباحة", slug: "swimming-clothes" },
              { name: "ملابس كرة القدم", slug: "football-clothes" },
              { name: "ملابس كرة السلة", slug: "basketball-clothes" },
              { name: "جوارب رياضية", slug: "sports-socks" },
              { name: "حقائب رياضية", slug: "sports-bags" },
            ],
          },
          {
            name: "معدات تمارين",
            slug: "fitness",
            description: "أجهزة ومعدات رياضية",
            children: [
              { name: "أجهزة لياقة", slug: "fitness-equipment" },
              { name: "أوزان", slug: "weights" },
              { name: "يوجا", slug: "yoga" },
              { name: "أجهزة جري", slug: "treadmills" },
              { name: "دراجات ثابتة", slug: "exercise-bikes" },
              { name: "مقاعد تمارين", slug: "workout-benches" },
              { name: "مطاط مقاومة", slug: "resistance-bands" },
              { name: "كرات تمارين", slug: "exercise-balls" },
              { name: "حصائر تمارين", slug: "exercise-mats" },
              { name: "اكسسوارات تمارين", slug: "fitness-accessories" },
            ],
          },
          {
            name: "رياضات خارجية",
            slug: "outdoor-sports",
            description: "معدات للرياضات الخارجية",
            children: [
              { name: "تخييم", slug: "camping" },
              { name: "صيد", slug: "fishing" },
              { name: "دراجات", slug: "cycling" },
              { name: "تسلق", slug: "climbing" },
              { name: "جري", slug: "running" },
              { name: "مشي لمسافات طويلة", slug: "hiking" },
              { name: "سباحة", slug: "swimming" },
              { name: "رياضات مائية", slug: "water-sports" },
              { name: "رياضات شتوية", slug: "winter-sports" },
              { name: "معدات نزهات", slug: "picnic-equipment" },
            ],
          },
          {
            name: "رياضات كرة",
            slug: "ball-sports",
            description: "معدات ومستلزمات رياضات الكرة",
            children: [
              { name: "كرة قدم", slug: "football" },
              { name: "كرة سلة", slug: "basketball" },
              { name: "كرة طائرة", slug: "volleyball" },
              { name: "تنس", slug: "tennis" },
              { name: "كرة طاولة", slug: "table-tennis" },
              { name: "جولف", slug: "golf" },
              { name: "كرة يد", slug: "handball" },
              { name: "بادمنتون", slug: "badminton" },
              { name: "بيسبول", slug: "baseball" },
              { name: "كريكيت", slug: "cricket" },
            ],
          },
          {
            name: "مستلزمات الترفيه",
            slug: "entertainment",
            description: "منتجات للترفيه والألعاب",
            children: [
              { name: "ألعاب لوحية", slug: "board-games" },
              { name: "بازل", slug: "puzzles" },
              { name: "ألعاب ورق", slug: "card-games" },
              { name: "ألعاب خارجية", slug: "outdoor-games" },
              { name: "ألعاب إلكترونية", slug: "electronic-games" },
              { name: "معدات كاريوكي", slug: "karaoke-equipment" },
              { name: "ألعاب الحفلات", slug: "party-games" },
              { name: "دمى وألعاب", slug: "toys-collectibles" },
            ],
          },
          {
            name: "ألعاب فيديو",
            slug: "video-games",
            description: "أجهزة وألعاب الفيديو",
            children: [
              { name: "أجهزة ألعاب", slug: "gaming-consoles" },
              { name: "ألعاب بلايستيشن", slug: "playstation-games" },
              { name: "ألعاب إكس بوكس", slug: "xbox-games" },
              { name: "ألعاب نينتندو", slug: "nintendo-games" },
              { name: "ملحقات ألعاب", slug: "gaming-accessories" },
              { name: "كراسي ألعاب", slug: "gaming-chairs" },
              { name: "أجهزة الواقع الافتراضي", slug: "vr-gaming" },
            ],
          },
        ],
      },
      {
        name: "سفر وفنادق",
        slug: "travel-hotels",
        description: "خدمات السفر والفنادق",
        subcategories: [
          {
            name: "فنادق",
            slug: "hotels",
            description: "حجوزات فندقية",
            children: [
              { name: "فنادق فاخرة", slug: "luxury-hotels" },
              { name: "منتجعات", slug: "resorts" },
              { name: "شقق فندقية", slug: "apartments" },
            ],
          },
          {
            name: "رحلات طيران",
            slug: "flights",
            description: "حجوزات تذاكر طيران",
            children: [
              { name: "رحلات محلية", slug: "domestic-flights" },
              { name: "رحلات دولية", slug: "international-flights" },
              { name: "عروض خاصة", slug: "flight-deals" },
            ],
          },
          {
            name: "مستلزمات سفر",
            slug: "travel-accessories",
            description: "اكسسوارات ومستلزمات السفر",
            children: [
              { name: "حقائب سفر", slug: "luggage" },
              { name: "اكسسوارات", slug: "travel-essentials" },
              { name: "إلكترونيات السفر", slug: "travel-electronics" },
            ],
          },
          {
            name: "نشاطات سياحية",
            slug: "activities",
            description: "نشاطات وجولات سياحية",
            children: [
              { name: "جولات سياحية", slug: "tours" },
              { name: "تجارب", slug: "experiences" },
              { name: "مغامرات", slug: "adventures" },
            ],
          },
        ],
      },
      {
        name: "مطاعم وكافيهات",
        slug: "restaurants-cafes",
        description: "عروض المطاعم والكافيهات",
        subcategories: [
          {
            name: "مطاعم",
            slug: "restaurants",
            description: "عروض المطاعم المختلفة",
            children: [
              { name: "مطاعم شرقية", slug: "eastern-cuisine" },
              { name: "مطاعم غربية", slug: "western-cuisine" },
              { name: "مطاعم آسيوية", slug: "asian-cuisine" },
              { name: "مطاعم سريعة", slug: "fast-food" },
            ],
          },
          {
            name: "كافيهات",
            slug: "cafes",
            description: "عروض الكافيهات والمقاهي",
            children: [
              { name: "قهوة مختصة", slug: "specialty-coffee" },
              { name: "مخابز", slug: "bakeries" },
              { name: "حلويات", slug: "desserts" },
            ],
          },
          {
            name: "توصيل طعام",
            slug: "food-delivery",
            description: "خدمات توصيل الطعام",
            children: [
              { name: "تطبيقات توصيل", slug: "delivery-apps" },
              { name: "وجبات جاهزة", slug: "ready-meals" },
              { name: "اشتراكات طعام", slug: "meal-subscriptions" },
            ],
          },
        ],
      },
      {
        name: "تعليم",
        slug: "education",
        description: "خدمات وكورسات تعليمية",
        subcategories: [
          {
            name: "كورسات أونلاين",
            slug: "online-courses",
            description: "دورات تدريبية عبر الإنترنت",
            children: [
              { name: "برمجة", slug: "programming" },
              { name: "تسويق", slug: "marketing" },
              { name: "لغات", slug: "languages" },
              { name: "تصميم", slug: "design" },
            ],
          },
          {
            name: "كتب وموارد",
            slug: "books-resources",
            description: "كتب ومصادر تعليمية",
            children: [
              { name: "كتب إلكترونية", slug: "ebooks" },
              { name: "كتب ورقية", slug: "printed-books" },
              { name: "صوتيات", slug: "audiobooks" },
            ],
          },
          {
            name: "أدوات تعليمية",
            slug: "learning-tools",
            description: "أدوات ومستلزمات تعليمية",
            children: [
              { name: "برامج", slug: "software" },
              { name: "أجهزة", slug: "devices" },
              { name: "قرطاسية", slug: "stationery" },
            ],
          },
        ],
      },
      {
        name: "خدمات",
        slug: "services",
        description: "خدمات متنوعة للأفراد والشركات",
        subcategories: [
      {
        name: "خدمات رقمية",
        slug: "digital-services",
            description: "خدمات التسويق والتصميم الرقمي",
            children: [
              { name: "تصميم مواقع", slug: "web-design" },
              { name: "تسويق رقمي", slug: "digital-marketing" },
              { name: "استضافة", slug: "hosting" },
            ],
          },
          {
            name: "خدمات منزلية",
            slug: "home-services",
            description: "خدمات الصيانة والتنظيف المنزلي",
            children: [
              { name: "تنظيف", slug: "cleaning" },
              { name: "صيانة", slug: "maintenance" },
              { name: "ديكور", slug: "home-decor" },
            ],
          },
          {
            name: "خدمات أعمال",
            slug: "business-services",
            description: "خدمات للشركات والأعمال",
            children: [
              { name: "محاسبة", slug: "accounting" },
              { name: "استشارات", slug: "consulting" },
              { name: "تدريب", slug: "training" },
            ],
          },
          {
            name: "خدمات صحية",
            slug: "health-services",
            description: "الخدمات الطبية والصحية",
            children: [
              { name: "استشارات طبية", slug: "medical-consultations" },
              { name: "تأمين صحي", slug: "health-insurance" },
              { name: "علاج طبيعي", slug: "physiotherapy" },
            ],
          },
        ],
      },
    ];

    for (const mainCategory of mainCategories) {
      const { subcategories, ...mainCategoryData } = mainCategory;
      const newMainCategory = await Category.create(mainCategoryData);
      console.log(`Created main category: ${newMainCategory.name}`);

      if (subcategories && subcategories.length > 0) {
        for (const subcategory of subcategories) {
          const { children, ...subCategoryData } = subcategory;
          const newSubCategory = await Category.create({
            ...subCategoryData,
            parent_id: newMainCategory._id,
          });
          console.log(`Created subcategory: ${newSubCategory.name}`);

          if (children && children.length > 0) {
            for (const child of children) {
              const newChildCategory = await Category.create({
                ...child,
                parent_id: newSubCategory._id,
                description: `${child.name} - ${newSubCategory.name}`,
              });
              console.log(`Created child category: ${newChildCategory.name}`);
            }
          }
        }
      }
    }

    console.log("Category seeding completed successfully");
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    // mongoose.connection.close();
  }
};

export default seedCategories;

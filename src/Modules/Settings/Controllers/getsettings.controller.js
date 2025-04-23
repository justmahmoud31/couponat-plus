import { Settings } from "../../../../database/Models/Settings.js";
import { catchError } from "../../../Middlewares/catchError.js";

export const getSettings = catchError(async (req, res, next) => {
  let existingSettings = await Settings.findOne();

  if (!existingSettings) {
    const newSettingsData = {
      name: "example",
      description: "Description",
      emails: req.body.emails ? JSON.parse(req.body.emails) : [],
      socialMedia: req.body.socialMedia ? JSON.parse(req.body.socialMedia) : {},
      copyright: req.body.copyright || "",
      logo: req.files?.logo ? req.files.logo[0].path : undefined,
      icon: req.files?.icon ? req.files.icon[0].path : undefined,
      marketingBanners: req.files?.marketingBanners
        ? req.files.marketingBanners.map((file) => file.path)
        : [],
      sections: [
        { title: "Default Section", content: "This is a default section." },
      ],
      pages: {
        privacyPolicy:
          "<h1>سياسة الخصوصية</h1><p>محتوى سياسة الخصوصية يظهر هنا.</p>",
        terms: "<h1>الشروط والأحكام</h1><p>محتوى الشروط والأحكام يظهر هنا.</p>",
      },
    };

    const newSettings = await Settings.create(newSettingsData);
    return res
      .status(201)
      .json({ message: "Settings created successfully", data: newSettings });
  }

  // Ensure sections field is present even if missing in existing data
  if (!existingSettings.sections || !existingSettings.sections.length) {
    existingSettings.sections = [
      { title: "Default Section", content: "This is a default section." },
    ];
  }

  // Ensure pages field is present even if missing in existing data
  if (!existingSettings.pages) {
    existingSettings.pages = {
      privacyPolicy:
        "<h1>سياسة الخصوصية</h1><p>محتوى سياسة الخصوصية يظهر هنا.</p>",
      terms: "<h1>الشروط والأحكام</h1><p>محتوى الشروط والأحكام يظهر هنا.</p>",
    };
    await existingSettings.save();
  }

  res.status(200).json({
    message: "Success",
    settings: existingSettings,
  });
});

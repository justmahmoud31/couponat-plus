import fs from "fs";
import { Settings } from "../../../../database/Models/Settings.js";

const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const initializeSettings = async () => {
  const existingSettings = await Settings.findOne();
  if (!existingSettings) {
    await Settings.create({});
  }
};

export const updateSettings = async (req, res) => {
  try {
    const {
      name,
      description,
      emails,
      socialMedia,
      copyright,
      pages,
      featuredStores,
    } = req.body;

    let existingSettings = await Settings.findOne();

    if (!existingSettings) {
      const newSettingsData = {
        name,
        description,
        emails: emails ? JSON.parse(emails) : [],
        socialMedia: socialMedia ? JSON.parse(socialMedia) : {},
        copyright,
        logo: req.files?.logo ? req.files.logo[0].path : undefined,
        icon: req.files?.icon ? req.files.icon[0].path : undefined,
        marketingBanners: req.files?.marketingBanners
          ? req.files.marketingBanners.map((file) => file.path)
          : [],
        featuredStores: featuredStores ? JSON.parse(featuredStores) : [],
        pages: pages
          ? JSON.parse(pages)
          : {
              privacyPolicy:
                "<h1>سياسة الخصوصية</h1><p>محتوى سياسة الخصوصية يظهر هنا.</p>",
              terms:
                "<h1>الشروط والأحكام</h1><p>محتوى الشروط والأحكام يظهر هنا.</p>",
            },
      };

      const newSettings = await Settings.create(newSettingsData);
      return res
        .status(201)
        .json({ message: "Settings created successfully", data: newSettings });
    }

    // Handle logo replacement
    if (req.files?.logo) {
      if (existingSettings.logo) deleteFile(existingSettings.logo);
      existingSettings.logo = req.files.logo[0].path;
    }

    // Handle icon replacement
    if (req.files?.icon) {
      if (existingSettings.icon) deleteFile(existingSettings.icon);
      existingSettings.icon = req.files.icon[0].path;
    }

    // Handle marketingBanners replacement
    if (req.files?.marketingBanners) {
      existingSettings.marketingBanners.forEach(deleteFile);
      existingSettings.marketingBanners = req.files.marketingBanners.map(
        (file) => file.path
      );
    }

    // Update other fields
    if (name) existingSettings.name = name;
    if (description) existingSettings.description = description;
    if (emails) existingSettings.emails = JSON.parse(emails);
    if (socialMedia) existingSettings.socialMedia = JSON.parse(socialMedia);
    if (copyright) existingSettings.copyright = copyright;

    // Update featured stores if provided
    if (featuredStores) {
      existingSettings.featuredStores = JSON.parse(featuredStores);
    }

    // Update pages content
    if (pages) {
      const parsedPages = JSON.parse(pages);
      existingSettings.pages = {
        ...existingSettings.pages,
        ...parsedPages,
      };
    }

    await existingSettings.save();
    res.status(200).json({
      message: "Settings updated successfully",
      settings: existingSettings,
    });
  } catch (error) {
    console.error("Error in updateSettings:", error);
    res
      .status(500)
      .json({ message: "Error updating settings", error: error.message });
  }
};

import Marketing from "../../../../database/Models/Marketing.js";

export const getMarketingSection = async (req, res) => {
    try {
      let section = await Marketing.findOne();
  
      // If no section exists, create a default one
      if (!section) {
        section = new Marketing({
          content: "<h2>Welcome to Marketing</h2><p>This is a default marketing section.</p>",
        });
        await section.save();
      }
  
      res.json({ message: "Marketing section fetched successfully", section });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
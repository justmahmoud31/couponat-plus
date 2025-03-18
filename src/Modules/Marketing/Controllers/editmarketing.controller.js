import Marketing from "../../../../database/Models/Marketing.js";
import sanitizeHtml from "sanitize-html";

export const updateMarketingSection = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Content is required" });

    // Sanitize the input to prevent XSS
    const sanitizedContent = sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.filter(tag => tag !== "script"), // Remove <script>
      allowedAttributes: {
        "*": ["style", "class"], // Allow only safe attributes
      },
      disallowedTagsMode: "discard",
    });

    // Find or create the section
    let section = await Marketing.findOne();
    if (!section) {
      section = new Marketing({ content: sanitizedContent });
    } else {
      section.content = sanitizedContent;
    }

    await section.save();

    res.json({ message: "Section updated successfully", section });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

import mongoose from "mongoose";
import sanitizeHtml from "sanitize-html";

const MarketingSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            set: (value) => {
                // Sanitize input to remove <script> tags and inline JavaScript
                return sanitizeHtml(value, {
                    allowedTags: sanitizeHtml.defaults.allowedTags.filter(
                        (tag) => tag !== "script"
                    ), // Remove <script>
                    allowedAttributes: {
                        "*": ["style", "class"], // Allow only safe attributes
                    },
                    disallowedTagsMode: "discard", // Remove disallowed tags
                });
            },
        },
    },
    { timestamps: true }
);

const Marketing = mongoose.model("Marketing", MarketingSchema);

export default Marketing;

import { createCn } from "cn/config";

// The type scale in globals.css defines custom `text-*` sizes. Without
// registering them, the merger reads `text-display-xl` as a text color and
// drops it whenever a real color like `text-dresde-paper` follows.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-xl",
            "display-l",
            "display-m",
            "display-s",
            "heading",
            "body",
            "small",
            "label",
            "caption",
          ],
        },
      ],
    },
  },
});

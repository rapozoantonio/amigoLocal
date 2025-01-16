export default {
  name: "users",
  sections: [
    {
      name: "Promoter Settings",
      index: 1,
      type: "section",
      fields: [
        {
          id: "name",
          label: "Name",
          type: "text",
          size: "lg",
          rules: ["required"],
        },
        {
          id: "code",
          label: "Code",
          type: "custom-username",
          size: "lg",
          rules: ["required"],
        },
        {
          id: "whatsapp_groups",
          label: "Whatsapp Groups",
          type: "list",
          size: "lg",
          children: [
            {
              id: "group_name",
              label: "Group name",
              type: "text",
              size: "sm",
              rules: ["required"],
            },
            {
              id: "group_category",
              label: "Group category",
              type: "text",
              size: "sm",
              rules: ["required"],
            },
            {
              id: "group_url",
              label: "Group URL",
              type: "text",
              size: "lg",
              rules: ["required"],
            },
          ],
        },
      ],
    },
  ],
};

// TYPES: TEXT, TEXTAREA, DATE, TIME, AUTOCOMPLETE, IMAGE, PRICE, SELECT, CHECKBOX, OBJECT; ADDRESS; CUSTOM-LINKS, CUSTOM-PRICE, CUSTOM-PRODUCER, CUSTOM-MEDIAS, CUSTOM-REGION, CUSTOM-COUNTRY

export default {
  name: "events",
  sections: [
    {
      name: "Edit event",
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
          id: "startDate",
          label: "Start Date",
          type: "date",
          size: "sm",
          rules: ["required"],
        },
        {
          id: "startTime",
          label: "Start Time",
          type: "time",
          size: "sm",
        },
        {
          id: "description",
          type: "textarea",
          size: "lg",
          label: "Description",
        },
        {
          id: "links",
          type: "list",
          size: "lg",
          label: "Links",
          children: [
            {
              id: "name",
              label: "Link Name",
              type: "text",
              size: "lg",
              rules: ["required"],
            },
            {
              id: "url",
              label: "Link URL",
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

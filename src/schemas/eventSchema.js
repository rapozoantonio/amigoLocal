export default {
  name: "events",
  sections: [
   
    {
      name: "Basic Info",
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
          id: "endDate",
          label: "End Date",
          type: "date",
          size: "sm",
        },
        {
          id: "endTime",
          label: "End Time",
          type: "time",
          size: "sm",
        },
      
        {
          id: "location",
          type: "custom-location",
          size: "lg",
          label: "Location",
        },
      ],
    },
    {
      name: "Details & LineUp",
      index: 2,
      type: "section",
      fields: [
        {
          id: "genres",
          label: "Genres",
          type: "autocomplete",
          size: "sm",
          rules: ["required"],
        },
        {
          id: "categories",
          label: "Categories",
          type: "autocomplete",
          size: "sm",
        },
        {
          id: "lineup",
          label: "Line Up",
          type: "textarea",
          size: "lg",
        },
   
        {
          id: "description",
          type: "textarea",
          size: "lg",
          label: "Description",
        },
        {
          id: "producer",
          type: "custom-producer",
          size: "sm",
          label: "Producer",
        },
        {
          id: "promoter",
          type: "custom-promoter",
          size: "sm",
          label: "Promoter",
        },
      ],
    },
    {
      name: "Promotional",
      index: 3,
      type: "section",
      fields: [
        {
          id: "image",
          type: "image",
          size: "lg",
          label: "Image",
        },
        {
          id: "price",
          type: "custom-price",
          size: "md",
          label: "Price",
        },
        {
          id: "links",
          type: "custom-links",
          size: "lg",
          label: "Links",
        },
        {
          id: "medias",
          type: "custom-medias",
          size: "lg",
          label: "Media",
        },
      ],
    },
  ],
};

// TYPES: TEXT, TEXTAREA, DATE, TIME, AUTOCOMPLETE, IMAGE, PRICE, SELECT, CHECKBOX, OBJECT; ADDRESS; CUSTOM-LINKS, CUSTOM-PRICE, CUSTOM-PRODUCER, CUSTOM-MEDIAS, CUSTOM-REGION, CUSTOM-COUNTRY

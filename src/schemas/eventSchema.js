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
          label: "Start Date",
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
          id: "termsAndConditions",
          type: "checkbox",
          size: "lg",
          label:
            "Eu aceito os <a class='text-primary' href='https://cooltra.com' target='_blank' >termos e condiçoes</a> de uso do serviço.",
        },
        {
          id: "optinEmail",
          type: "switch",
          size: "lg",

          label:
            "Eu aceito os <a class='text-primary' href='https://cooltra.com' target='_blank' >termos e condiçoes</a> de uso do serviço.",
        },
        // {
        //   id: "divider-location",
        //   type: "divider",
        //   label: "Location",
        // },
        // {
        //   id: "header-location",
        //   type: "header",
        //   label: "Location",
        // },
        {
          id: "location",
          type: "custom-location",
          size: "lg",
          label: "Location",
        },
      ],
    },
    {
      name: "Line Up",
      index: 2,
      type: "section",
      fields: [
        {
          id: "lineup",
          label: "Line Up",
          type: "textarea",
          size: "md",
        },
        {
          id: "genres",
          label: "Genres",
          type: "autocomplete",
          size: "md",
          rules: ["required"],
        },
      ],
    },
    {
      name: "Details",
      index: 3,
      type: "section",
      fields: [
        {
          id: "description",
          type: "textarea",
          size: "lg",
          label: "Description",
        },

        {
          id: "image",
          type: "image",
          size: "sm",
          label: "Image",
        },
        {
          id: "promoter",
          type: "custom-promoter",
          size: "sm",
          label: "Promoter",
        },
        {
          id: "producer",
          type: "custom-producer",
          size: "lg",
          label: "Producer",
        },
        {
          id: "price",
          type: "custom-price",
          size: "md",
          label: "Price",
        },
      ],
    },
    {
      name: "Promotional",
      index: 4,
      type: "section",
      fields: [
        {
          id: "flyerFront",
          type: "image",
          size: "md",
          label: "Flyer Front",
        },
        {
          id: "flyerBack",
          type: "image",
          size: "md",
          label: "Flyer Back",
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

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
          id: "categories",
          type: "autocomplete",
          size: "md",
          label: "Categories",
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
    {
      name: "Informações básicas",
      index: 1,
      type: "section",
      fields: [
        {
          id: "color", // Keep id unchanged
          label: "Color",
          type: "color",
          size: "auto",
          initial: "#EC407A",
          fieldParams: {
            variant: "mini",
            // allowCustom: false,
          },
          rules: ["required"],
        },
        {
          id: "color2", // Keep id unchanged
          label: "Color2",
          type: "color",
          size: "auto",
          initial: "#EC407A",
          fieldParams: {
            // allowCustom: false,
          },
          rules: ["required"],
        },
        {
          id: "icones", // Keep id unchanged
          label: "Icone",
          type: "icon",
          size: "auto",
          initial: "mdi-account",
          fieldParams: {
            // variant: "mini",
            // allowCustom: false,
          },
          items: [
            "mdi-account",
            "mdi-delete",
            "mdi-pencil",
            "mdi-account",
            "mdi-delete",
            "mdi-pencil",
            "mdi-account",
            "mdi-delete",
            "mdi-pencil",
            "mdi-account",
            "mdi-delete",
            "mdi-pencil",
          ],
          rules: ["required"],
        },
        {
          id: "name", // Keep id unchanged
          label: "Nome",
          type: "text",
          size: "fill",
          rules: ["required"],
        },
        {
          id: "image", // Keep id unchanged
          label: "Imagem",
          type: "image",
          size: "lg",
        },
        {
          id: "images", // Keep id unchanged
          label: "Images",
          type: "gallery",
          size: "lg",
          max: 4,
        },
        {
          id: "startDate",
          label: "Data",
          type: "date",
          size: "xs",
          rules: ["required"],
          initial: new Date().toISOString().split("T")[0],
        },
        {
          id: "startTime",
          label: "Horário",
          type: "time",
          size: "xs",
        },
        {
          id: "location",
          label: "Local",
          type: "text",
          size: "lg",
          // rules: ["required"],
          prependIcon: "mdi-account",
        },
      ],
    },
  ],
};

// TYPES: TEXT, TEXTAREA, DATE, TIME, AUTOCOMPLETE, IMAGE, PRICE, SELECT, CHECKBOX, OBJECT; ADDRESS; CUSTOM-LINKS, CUSTOM-PRICE, CUSTOM-PRODUCER, CUSTOM-MEDIAS, CUSTOM-REGION, CUSTOM-COUNTRY

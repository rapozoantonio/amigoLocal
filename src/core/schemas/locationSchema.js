export default {
  name: "locations",
  sections: [
    {
      name: "Address Info",
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
          id: "address",
          label: "Street Address",
          type: "text",
          size: "lg",
          rules: ["required"],
        },

        {
          id: "city",
          label: "City",
          type: "text",
          size: "sm",
        },
        {
          id: "postalcode",
          label: "Postal Code",
          type: "text",
          size: "xs",
        },
        {
          id: "state",
          label: "State",
          type: "text",
          size: "xs",
        },
        {
          id: "country",
          label: "Country",
          type: "custom-country",
          size: "sm",
          rules: ["required"],
          initial: "BR",
        },
        {
          id: "region",
          label: "Region",
          type: "custom-region",
          size: "sm",
          rules: ["required"],
          initial: {
            id: "riodejaneiro",
            name: "Rio de Janeiro",
          },
        },
      ],
    },
  ],
};

// TYPES: TEXT, TEXTAREA, DATE, TIME, AUTOCOMPLETE, IMAGE, PRICE, SELECT, CHECKBOX, OBJECT; ADDRESS; CUSTOM-LINKS, CUSTOM-PRICE, CUSTOM-PRODUCER, CUSTOM-MEDIAS, CUSTOM-REGION, CUSTOM-COUNTRY

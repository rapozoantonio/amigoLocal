export default {
  module: "producers",
  name: "Create producer",
  sections: [
    {
      name: "",
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
          id: "username",
          label: "Username",
          type: "custom-username",
          size: "lg",
          rules: ["required"],
        },
        {
          id: "country",
          label: "Country",
          type: "custom-country",
          size: "lg",
          rules: ["required"],
          initial: "BR",
        },
        {
          id: "region",
          label: "Region",
          type: "custom-region",
          size: "lg",
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

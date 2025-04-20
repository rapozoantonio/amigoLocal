export default {
  name: "registration",
  sections: [
    {
      name: "Informações de Login",
      index: 1,
      type: "section",
      fields: [
        {
          id: "email",
          label: "Email",
          type: "email",
          size: "lg",
          rules: ["required"],
        },

        {
          id: "password",
          label: "Password",
          type: "password",
          size: "lg",
          rules: ["required"],
        },
      ],
    },
  ],
};

// TYPES: TEXT, TEXTAREA, DATE, TIME, AUTOCOMPLETE, IMAGE, PRICE, SELECT, CHECKBOX, OBJECT; ADDRESS; CUSTOM-LINKS, CUSTOM-PRICE, CUSTOM-PRODUCER, CUSTOM-MEDIAS, CUSTOM-REGION, CUSTOM-COUNTRY

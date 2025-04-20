export default {
  name: "registration",
  sections: [
    {
      name: "Informações de Login",
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

    {
      name: "Junte-se a comunidade",
      index: 2,
      type: "section",
      fields: [
        {
          id: "emailOptin",
          label: "Se inscreber",
          type: "checkbox",
          size: "lg",
          prepend:
            "Inscreva-se a Newsletter semanal da RA para receberes atualizações sobre as últimas notícias e eventos",
        },
      ],
    },
  ],
  append:
    "Ao se registrar, você indica que leu e concorda com os <a class='link' href='/events'>Termos de Uso e a Política de Privacidade</a>",
};

// TYPES: TEXT, TEXTAREA, DATE, TIME, AUTOCOMPLETE, IMAGE, PRICE, SELECT, CHECKBOX, OBJECT; ADDRESS; CUSTOM-LINKS, CUSTOM-PRICE, CUSTOM-PRODUCER, CUSTOM-MEDIAS, CUSTOM-REGION, CUSTOM-COUNTRY

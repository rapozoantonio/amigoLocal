import { readonly } from "vue";

export default {
  name: "promoter",
  sections: [
    {
      name: "Informações básicas",
      index: 1,
      type: "section",
      fields: [
        {
          id: "name", // Keep id unchanged
          label: "Nome Completo",
          type: "text",
          size: "lg",
          rules: ["required"],
          disabled: true,
        },
        {
          id: "phone",
          label: "Telefone",
          type: "text",
          size: "xs",
        },
        {
          id: "email",
          label: "Email",
          type: "email",
          size: "sm",
          disabled: true,
        },
        {
          id: "instagram",
          label: "Instagram",
          type: "text",
          size: "sm",
        },
        {
          id: "active",
          label: "Activo",
          type: "checkbox",
          size: "sm",
        },
      ],
    },
  ],
};

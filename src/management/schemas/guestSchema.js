export default {
  name: "guest",
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
        },
        {
          id: "taxId",
          label: "CPF",
          type: "text",
          size: "xs",
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
        },
        {
          id: "instagram",
          label: "Instagram",
          type: "custom-text-instagram",
          textType: "instagram",
          size: "sm",
        },
        {
          id: "list",
          label: "Lista",
          type: "select-id",
          size: "lg",
          rules: ["required"],
        },
        {
          id: "vip",
          label: "Convidado VIP",
          type: "checkbox",
          size: "lg",
          initial: false,
        },
        {
          id: "blacklist",
          label: "Restrição",
          type: "checkbox",
          size: "lg",
          initial: false,
        },
        {
          id: "promoter",
          label: "Promoter",
          type: "custom-current-user",
          size: "lg",
        },
      ],
    },
  ],
};

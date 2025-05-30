export default {
  name: "guestCheckin",
  fieldVariant: "outlined",
  buttonVariant: "elevated",
  actionColor: "green-darken-3",
  sections: [
    {
      name: "Dados do convidado",
      index: 2,
      type: "section",
      fields: [
        // {
        //   id: "name", // Keep id unchanged
        //   label: "Nome Completo",
        //   type: "text",
        //   size: "lg",
        //   rules: ["required"],
        // },
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
          type: "text",
          size: "sm",
        },
        {
          id: "divider",
          type: "divider",
        },
        {
          id: "price",
          label: "Preço",
          type: "number",
          size: "lg",
        },
        {
          id: "checkInNotes",
          label: "Observações",
          type: "textarea",
          size: "lg",
        },
      ],
    },
  ],
};

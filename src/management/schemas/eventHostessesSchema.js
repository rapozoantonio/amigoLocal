import { readonly } from "vue";

export default {
  name: "hostesses",

  fieldParams: {
    // variant: "solo",
    // labelType: "in",
  },
  // actionParams: {},
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
          readOnly: true,
        },
        {
          id: "email",
          label: "Email",
          type: "email",
          size: "sm",
          readOnly: true,
        },
        {
          id: "phone",
          label: "Telefone",
          type: "phone",
          size: "sm",
          // fieldStyle: {
          //   bgColor: "red",
          // },
        },
        {
          id: "area",
          label: "Área de atuação",
          type: "select",
          size: "lg",
        },
        {
          id: "startTime",
          label: "Horário de entrada",
          type: "time",
          size: "sm",
        },
        {
          id: "endTime",
          label: "Horário de saída",
          type: "time",
          size: "sm",
        },
        {
          id: "payment",
          label: "Pagamento",
          type: "number",
          size: "sm",
        },
        {
          id: "confirmed",
          label: "Presença confirmada / Ativo",
          type: "checkbox",
          size: "lg",
        },
        {
          id: "notes",
          label: "Observações",
          type: "textarea",
          size: "lg",
        },
      ],
    },
  ],
};

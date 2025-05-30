export default {
  name: "list",
  sections: [
    {
      name: "Informações básicas",
      index: 1,
      type: "section",
      fields: [
        {
          id: "icon",
          label: "Icone",
          type: "icon",
          size: "auto",
          items: ["mdi-list-status", "mdi-star", "mdi-ticket"],
          initial: "mdi-ticket",
          fieldParams: {
            allowCustom: false,
          },
        },
        {
          id: "name", // Keep id unchanged
          label: "Nome",
          type: "text",
          size: "fill",
          rules: ["required"],
        },
        {
          id: "promoters",
          label: "Promoters",
          type: "select-ids",
          size: "lg",

          // returnObject: true,
        },
        {
          id: "quota",
          label: "Cota",
          type: "number",
          size: "xs",
          initial: 0,
        },
        {
          id: "price",
          label: "Preço",
          type: "number",
          size: "xs",
          initial: 0,
        },
        {
          id: "cutoffTime",
          label: "Horário de corte",
          type: "time",
          size: "xs",
        },
        {
          id: "active",
          label: "Activo",
          type: "switch",
          size: "lg",
          initial: true,
        },
      ],
    },
  ],
};

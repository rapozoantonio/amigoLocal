export default {
  name: "list",
  sections: [
    {
      name: "Informações básicas",
      index: 1,
      type: "section",
      fields: [
        {
          id: "name", // Keep id unchanged
          label: "Nome",
          type: "text",
          size: "lg",
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

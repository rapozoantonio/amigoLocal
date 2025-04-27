export default {
  name: "eventList",
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
          id: "startDate",
          label: "Data",
          type: "date",
          size: "xs",
          rules: ["required"],
          initial: new Date().toISOString().split("T")[0],
        },
        {
          id: "startTime",
          label: "Horário",
          type: "time",
          size: "xs",
        },
        {
          id: "location",
          label: "Local",
          type: "text",
          size: "lg",
          rules: ["required"],
          prependIcon: "mdi-account",
        },
      ],
    },
  ],
};

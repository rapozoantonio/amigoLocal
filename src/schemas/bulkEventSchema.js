export default {
  name: "events",
  sections: [
    {
      name: "Editar evento",
      index: 1,
      type: "section", 
      fields: [
        {
          id: "name",
          label: "Nome do evento",
          type: "text",
          size: "lg",
          rules: ["required"],
        },
        {
          id: "startDate",
          label: "Data", 
          type: "date",
          size: "sm",
          rules: ["required"],
        },
        {
          id: "startTime",
          label: "Horário",
          type: "time",
          size: "sm",
        },
        {
          id: "description",
          label: "Sobre", 
          type: "textarea",
          size: "lg",
        },
        {
          id: "links",
          type: "list",
          size: "lg",
          label: "Links",
          children: [
            {
              id: "name",
              label: "Título do link",
              type: "text", 
              size: "lg",
              rules: ["required"],
            },
            {
              id: "url",
              label: "URL",
              type: "text",
              size: "lg", 
              rules: ["required"],
            },
          ],
        },
      ],
    },
  ],
 };
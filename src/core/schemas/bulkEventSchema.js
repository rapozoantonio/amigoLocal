import eventCategories from "@/core/assets/eventCategories";
import genres from "@/core/assets/genres";

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
          type: "textarea",
          rows: 1,
          size: "lg",
          rules: ["required"],
        },
        {
          id: "startDate",
          label: "Data de inicio",
          type: "date",
          size: "xs",
          rules: ["required"],
        },
        {
          id: "startTime",
          label: "Hora de inicio",
          type: "time",
          size: "xs",
        },
        {
          id: "endDate",
          label: "Data de fim",
          type: "date",
          size: "xs",
        },
        {
          id: "endTime",
          label: "Hora de fin",
          type: "time",
          size: "xs",
        },
        // {
        //   id: "region",
        //   label: "Region",
        //   type: "custom-region",
        //   size: "xs",
        //   rules: ["required"],
        //   initial: {
        //     id: "riodejaneiro",
        //     name: "Rio de Janeiro",
        //   },
        // },
        // {
        //   id: "country",
        //   label: "Country",
        //   type: "custom-country",
        //   size: "xs",
        //   rules: ["required"],
        //   initial: "BR",
        // },

        {
          id: "description",
          label: "Sobre",
          type: "textarea",
          size: "lg",
        },
        {
          id: "genres",
          label: "Estilos",
          type: "autocomplete",
          size: "xs",
          items: genres,
        },
        {
          id: "categories",
          label: "Categorias",
          type: "boolean-flags",
          items: eventCategories,
          size: "xs",
        },
        {
          id: "event_type",
          label: "Tipo de evento",
          type: "select",
          size: "xs",
          items: ["carnaval", "reveillon"],
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
        {
          id: "promoter",
          label: "Promoter",
          type: "custom-promoter",
          size: "sm",
        },
        {
          id: "image",
          label: "Imagem",
          type: "image",
          size: "lg",
        },
      ],
    },
  ],
};

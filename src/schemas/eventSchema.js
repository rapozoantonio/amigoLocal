export default {
  name: "events",
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
          label: "Data início",
          type: "date",
          size: "xs",
          rules: ["required"],
        },
        {
          id: "startTime",
          label: "Horário início",
          type: "time",
          size: "xs",
        },
        {
          id: "endDate",
          label: "Data fim",
          type: "date",
          size: "xs",
        },
        {
          id: "endTime",
          label: "Horário fim",
          type: "time",
          size: "xs",
        },
        {
          id: "region",
          label: "Region",
          type: "custom-region",
          size: "sm",
          rules: ["required"],
          initial: {
            id: "riodejaneiro",
            name: "Rio de Janeiro",
          },
        },
        {
          id: "country",
          label: "Country",
          type: "custom-country",
          size: "sm",
          rules: ["required"],
          initial: "BR",
        },

        {
          id: "location",
          label: "Local",
          type: "custom-location",
          size: "lg",
        },
      ],
    },
    {
      name: "Detalhes & Line-up",
      index: 2,
      type: "section",
      fields: [
        {
          id: "genres",
          label: "Estilos",
          type: "autocomplete",
          size: "sm",
          rules: ["required"],
        },
        {
          id: "categories",
          label: "Categorias",
          type: "autocomplete",
          size: "sm",
        },
        {
          id: "lineup",
          label: "Artistas",
          type: "textarea",
          size: "lg",
        },
        {
          id: "description",
          label: "Sobre",
          type: "textarea",
          size: "lg",
        },
        {
          id: "producer",
          label: "Produtora",
          type: "custom-producer",
          size: "sm",
        },
        {
          id: "promoter",
          label: "Promoter",
          type: "custom-promoter",
          size: "sm",
        },
      ],
    },
    {
      name: "Divulgação",
      index: 3,
      type: "section",
      fields: [
        {
          id: "image",
          label: "Imagem",
          type: "image",
          size: "lg",
        },
        {
          id: "price",
          label: "Preço",
          type: "custom-price",
          size: "md",
        },
        {
          id: "links",
          label: "Links",
          type: "custom-links",
          size: "lg",
        },
        {
          id: "medias",
          label: "Mídia",
          type: "custom-medias",
          size: "lg",
        },
      ],
    },
  ],
};

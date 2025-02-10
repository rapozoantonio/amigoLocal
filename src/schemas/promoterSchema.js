import { readonly } from "vue";

export default {
  name: "promoters",
  sections: [
    {
      name: "Perfil Promoter",
      index: 1,
      type: "section",
      fields: [
        {
          id: "name",
          label: "Nome",
          type: "text",
          size: "lg",
          rules: ["required"],
          readOnly: true,
        },
        {
          id: "code",
          label: "Código",
          type: "custom-username",
          size: "lg",
          rules: ["required"],
          readOnly: true,
        },
        {
          id: "image",
          label: "Imagem",
          imageSize: { width: 90, height: 90 },
          type: "image",
          size: "lg",
        },
        {
          id: "instagram",
          label: "Instagram",
          type: "text",
          size: "lg",
          rules: ["required"],
        },
        {
          id: "contact",
          label:
            "Contato de Whatsapp para  Despedidas, Aniversários, Pix ou Dúvidas",
          type: "text",
          size: "lg",
          // rules: ["required"],
        },
        {
          id: "whatsapp",
          label: "Whatsapp",
          type: "text",
          size: "lg",
          placeholder: "+55 21 999 888 777",
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
          id: "whatsapp_groups",
          label: "Grupos de Whatsapp",
          type: "list",
          size: "lg",
          children: [
            {
              id: "group_name",
              label: "Nome do grupo",
              type: "text",
              size: "sm",
              rules: ["required"],
            },
            {
              id: "group_category",
              label: "Categoria",
              type: "text",
              size: "sm",
              rules: ["required"],
            },
            {
              id: "group_url",
              label: "URL do Grupo",
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

// TYPES: TEXT, TEXTAREA, DATE, TIME, AUTOCOMPLETE, IMAGE, PRICE, SELECT, CHECKBOX, OBJECT; ADDRESS; CUSTOM-LINKS, CUSTOM-PRICE, CUSTOM-PRODUCER, CUSTOM-MEDIAS, CUSTOM-REGION, CUSTOM-COUNTRY

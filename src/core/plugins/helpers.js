export default {
  install(app) {
    const helpers = {};
    helpers.momento = (data) => {
      const antes = data;
      const agora = Date.now();
      const minutos = (agora - antes) / 1000 / 60;
      if (minutos < 60) {
        return Math.floor(minutos) + " min";
      }
      const horas = minutos / 60;
      if (horas < 24) {
        return Math.floor(horas) + " h";
      }
      const dias = horas / 24;
      if (dias < 7) {
        return Math.floor(dias) + " d";
      }
      const semanas = dias / 7;
      return Math.floor(semanas) + " sem";
    };

    helpers.fieldAttrs = {
      rounded: "lg",
      variant: "outlined",
      density: "compact",
      color: "primary",
      // class: "mt-1",
      hideDetails: "auto",
      listProps: { bgColor: "grey-darken-4" },
    };

    helpers.toDate = (date) => {
      const parsedDate = new Date(date);
      const currentYear = new Date().getFullYear();

      // Set date format options, adding the year if it's not the current year
      const options = {
        day: "2-digit",
        month: "short",
      };

      if (parsedDate.getFullYear() !== currentYear) {
        options.year = "numeric";
      }

      return new Intl.DateTimeFormat("pt-BR", options)
        .format(parsedDate)
        .toUpperCase();
    };

    helpers.getRandomColor = (usedColors = []) => {
      const defaultSwatches = [
        "#F44336",
        "#E91E63",
        "#9C27B0",
        "#673AB7",
        "#3F51B5",
        "#2196F3",
        "#009688",
        "#4CAF50",
        "#FFC107",
        "#FF5722",
      ];
      let randomIndex = getRandomIndex(defaultSwatches.length - 1);

      function getRandomIndex(max) {
        return Math.round(Math.random() * max);
      }

      if (usedColors || usedColors.length > 0) {
        while (usedColors.includes(defaultSwatches[randomIndex])) {
          randomIndex = getRandomIndex(defaultSwatches.length - 1);
        }
      }

      return defaultSwatches[randomIndex];
    };

    helpers.rules = {
      required: (value) => {
        return (
          (!!value && Array.isArray(value)
            ? value?.length > 0
            : !!value && typeof value === "string"
            ? value?.length > 0
            : !!value) || "Field is required"
        );
      },
      notNull: (value) => value !== null,
      lengthMin4: (value) =>
        value.length > 3 || "Must be at least 4 characters",
      lengthMin: (value) => value.length > 0 || "Field is required",
    };

    helpers.capitalize = (name) => {
      return name
        .toLowerCase() // tudo minúsculo primeiro
        .split(" ") // divide por espaço
        .filter(Boolean) // remove espaços extras
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // capitaliza
        .join(" "); // junta de novo
    };

    helpers.formatCurrency = (value) => {
      if (!value && value !== 0) return "R$ 0";

      // Convert to number if it's not already
      const numValue = typeof value === "number" ? value : Number(value);

      // Handle invalid values
      if (isNaN(numValue)) return "R$ 0";

      // Format based on value range
      if (numValue >= 1000000) {
        return `R$ ${(numValue / 1000000).toFixed(1)}M`;
      } else if (numValue >= 1000) {
        return `R$ ${(numValue / 1000).toFixed(1)}k`;
      } else {
        return `R$ ${numValue}`;
      }
    };

    app.provide("$helpers", helpers);
  },
};

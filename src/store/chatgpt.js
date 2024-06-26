/*       {
            role: "system",
            content: `Atue como um especialista de eventos, você precisa incluir essas informações em campos separados e retornar um json com esses campos: 
                         {name: string, startDate: date, startTime: time, endDate: date, endTime: time, location: {name: string, country: string(country code short code), region: string, address: string}, genres: array[string], lineup: array[string], price: [{title: string, value: number}], description: string, age: string, links: array[{name: string, url: string}]}`,
          }, 


 {
            role: "system",
            content: `Atue como um especialista de eventos, você vai receber um texto de divulgação que se usa no whatsapp, você precisa incluir as informações do texto em campos separados e retornar um json, para identificar os preços deve considerar os icones que tiver no texto para distinguir entre masculino e feminino, se for gratuito retornar 0, os campos do evento sao: 
                         {name: string, startDate: date, startTime: time, endDate: date, endTime: time, location: {name: string, country: string(country code short code), region: string, address: string}, genres: array[string], lineup: array[string], price: [{title: string, value: number}], description: string, age: string, links: array[{name: string, url: string}]}`,
          },




          */

// Utilities
import { defineStore } from "pinia";

export const useChatgptStore = defineStore("chatgpt", () => {
  async function fetchEventAssistente(text) {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        "Bearer " + import.meta.env.VITE_CHATGPT_KEY
      );

      const payload = {
        model: import.meta.env.VITE_CHATGPT_MODEL,
        messages: [
          {
            role: "system",
            content: `Atue como um especialista de eventos, você precisa incluir essas informações em campos separados e retornar um json com esses campos: 
                             {name: string, startDate: date, startTime: time, endDate: date, endTime: time, location: {name: string, country: string(country code short code), region: string, address: string}, genres: array[string], lineup: array[string], price: [{name: string, value: number}], description: string,  links: array[{name: string, url: string}]}`,
          },

          {
            role: "user",
            content: `TEXTO: ${text}`,
          },
        ],
      };

      const raw = JSON.stringify(payload);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const response = await fetch(
        import.meta.env.VITE_CHATGPT_URL,
        requestOptions
      );
      const result = await response.json();
      console.log({ result });
      return result;
    } catch (error) {
      console.log({ error });
      return error;
    }
  }

  async function getBulkEventList(text) {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        "Bearer " + import.meta.env.VITE_CHATGPT_KEY
      );

      const payload = {
        model: import.meta.env.VITE_CHATGPT_MODEL,
        messages: [
          {
            role: "system",
            content: `Atue como um especialista de eventos, receberá um texto de divulgação de eventos usado nos grupos de whatsapp. Preciso que retorne um JSON com um atributo 'events' que seja uma array com esses eventos, cada evento tem a seguinte configuração: {startDate: date, name: string, description: string, links: [{name: string, url: string}]}`,
          },

          {
            role: "user",
            content: `TEXTO: ${text}`,
          },
        ],
      };

      const raw = JSON.stringify(payload);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const response = await fetch(
        import.meta.env.VITE_CHATGPT_URL,
        requestOptions
      );
      const result = await response.json();
      console.log({ result });
      return result;
    } catch (error) {
      console.log({ error });
      return error;
    }
  }

  return { fetchEventAssistente, getBulkEventList };
});

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
                             name: string, 
                             location: {name: string, country: string(country code short code), 
                             region: string, address: string}, 
                             lineup: array[string], 
                             price: [{name: string, value: number}], 
                             description: string,  
                             links: array[{name: string, url: string}]
                              startDate: date (format yyyy-MM-dd);
                              endDate: date (format yyyy-MM-dd e somente terá valor se detectar um rango de datas para esse evento);
                              startTime: time (format HH:mm);
                              endDate: time (format HH:mm e somente terá valor se detectar que existe uma hora explicita para terminar);
                              genres: [string] (possivéis opções: Funk,Sertanejo,Pagode,Samba,Forró,Axé,Pop,Eletrônica,Reggaeton,Hip Hop,MPB,Rock,Brega,Arrocha,Trap,Indie,K-pop,Jazz,Blues);
                              categories: boolean-flags ({key: true|false}) (possivéis opções de chave: open_bar,day_party,lista_amiga);
                              event_type: string (possivéis opções: carnaval,reveillon);
                             `,
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

      return result;
    } catch (error) {
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
            content: `Atue como um especialista de eventos, receberá um texto de divulgação de eventos usado nos grupos de whatsapp. Preciso que extraia a informação desses eventos retorne um JSON com um atributo 'events' que seja uma array com esses eventos, deve tentar completar os seguintes campos com base nas informações extraidas do texto:
            name: string;
            description: string;
            links: [{name: string, url: string}] (Se não tiver um nome explícito para o link podemos usar de nome algo como 'Mais Informações');
            startDate: date (format yyyy-MM-dd);
            endDate: date (format yyyy-MM-dd e somente terá valor se detectar um rango de datas para esse evento);
            startTime: time (format HH:mm);
            endDate: time (format HH:mm e somente terá valor se detectar que existe uma hora explicita para terminar);
            genres: [string] (possivéis opções: Funk,Sertanejo,Pagode,Samba,Forró,Axé,Pop,Eletrônica,Reggaeton,Hip Hop,MPB,Rock,Brega,Arrocha,Trap,Indie,K-pop,Jazz,Blues);
            categories: boolean-flags ({key: true|false}) (possivéis opções de chave: open_bar,day_party,lista_amiga);
            event_type: string (possivéis opções: carnaval,reveillon);`,
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

      return result;
    } catch (error) {
      return error;
    }
  }

  async function getGuestList(text) {
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
            content: `Atue como um especialista de eventos, receberá um listado de convidados, deve interpretar cada linha para extrair a informação de cada convidado e preencher os seguintes campos quando possivel: name, phone, instagram, email, taxId. Com base nos nomes tente identificar o genero do convidado e coloque essa info no campo 'gender' (possiveis valores "Male", "Female", null). Deve retornar uma JSON List`,
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

      return result;
    } catch (error) {
      return error;
    }
  }

  return { fetchEventAssistente, getBulkEventList, getGuestList };
});

import jsdom from "jsdom";

const { JSDOM } = jsdom;

export const parseGrades = (html: string): any[] => {
  try {
    const dom = new JSDOM(html);
    // const studentName = dom.window.document.querySelector(".page_title_variable")?.textContent;

    const document = dom.window.document;
    const evaluations: {
      data: string;
      voto: string;
      materia: string;
      tipo: string;
      peso: string;
      descrizione: string;
    }[] = [];

    const days = document.querySelectorAll(".registro");

    for (const day of days) {
      const data = day?.textContent?.trim();
      const voto = day?.parentElement?.nextElementSibling?.querySelector(".cella_trattino")?.textContent?.trim();
      const materia = day?.parentElement?.nextElementSibling?.querySelector(".cella_data")?.textContent?.trim();
      const descrizione =
        day?.parentElement?.nextElementSibling?.querySelectorAll("td")?.[5]?.querySelector("span")?.textContent || "";

      const tipoEPeso = day?.parentElement?.nextElementSibling
        ?.querySelectorAll("p")?.[2]
        ?.querySelector("span")
        ?.textContent?.split("Peso");
      const tipo = tipoEPeso?.[0];
      const peso = tipoEPeso?.[1].replace(": ", "");

      if (!voto || !data || !materia || !tipo || !peso) continue;

      const evaluation = {
        data,
        voto,
        materia,
        tipo,
        peso,
        descrizione,
      };

      evaluations.push(evaluation);
    }

    return evaluations;
  } catch (e) {
    console.error(e);
    return [];
  }
};

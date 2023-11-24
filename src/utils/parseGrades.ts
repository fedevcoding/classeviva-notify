import { Grade } from "@/types";
import jsdom from "jsdom";

const { JSDOM } = jsdom;

export const parseGrades = (html: string): Grade[] => {
  try {
    const dom = new JSDOM(html);

    const document = dom.window.document;
    const evaluations: Grade[] = [];

    const days = document.querySelectorAll(".registro");

    for (const day of days) {
      const data = day?.textContent?.trim();
      let latestGradeOfDay = day.parentElement?.nextElementSibling;

      while (true) {
        const voto = latestGradeOfDay?.querySelector(".cella_trattino")?.textContent?.trim();
        const materia = latestGradeOfDay?.querySelector(".cella_data")?.textContent?.trim();
        const descrizione = latestGradeOfDay?.querySelectorAll("td")?.[5]?.querySelector("span")?.textContent || "";

        const tipoEPeso = latestGradeOfDay
          ?.querySelectorAll("p")?.[2]
          ?.querySelector("span")
          ?.textContent?.split("Peso");
        const tipo = tipoEPeso?.[0];
        const peso = tipoEPeso?.[1]?.replace(": ", "");

        if (voto && data && materia) {
          const evaluation = {
            data,
            voto,
            materia,
            tipo: tipo?.trim() || "",
            peso: peso?.trim() || "",
            descrizione,
          };

          evaluations.push(evaluation);
        }

        if (
          latestGradeOfDay?.nextElementSibling?.hasAttribute("align") ||
          !latestGradeOfDay?.nextElementSibling ||
          !latestGradeOfDay
        ) {
          break;
        }

        latestGradeOfDay = latestGradeOfDay?.nextElementSibling;
      }
    }

    return evaluations;
  } catch (e) {
    console.error(e);
    return [];
  }
};

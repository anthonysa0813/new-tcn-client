import { createIntl, createIntlCache } from "react-intl";
import { string } from "yup";

interface PropMessage {
  en: {
    langEs: string;
    langEn: string;
    jobPosition: string;
    login: string;
    hero: string;
    subHeroFirst: string;
    subHeroSecond: string;
    inboundTitle: string;
    inboundResumen: string;
    multipleChannelTitle: string;
    multipleChannelResumen: string;
    collectTitle: string;
    collectResumen: string;
    innovationTitle: string;
    innovationResumen: string;
    titleButton: string;
    titleSlider: string;
  };
  es: {
    jobPosition: string;
    login: string;
    hero: string;
    subHeroFirst: string;
    subHeroSecond: string;
    inboundTitle: string;
    inboundResumen: string;
    multipleChannelTitle: string;
    multipleChannelResumen: string;
    collectTitle: string;
    collectResumen: string;
    innovationTitle: string;
    innovationResumen: string;
    titleButton: string;
    titleSlider: string;
    langEs: string;
    langEn: string;
  };
}

export const messages: PropMessage = {
  en: {
    langEs: "Spanish",
    langEn: "English",
    jobPosition: "Job Position",
    login: "Login",
    hero: "We offer multi-channel technological solutions and development of digital platforms using innovation as the basis for designing and executing each project.",
    subHeroFirst:
      "We love what we do, that's why we have the bestWe love what we do, that's why we have the best",
    subHeroSecond: "services adapted to the needs of each client.",
    inboundTitle: "INBOUND CARE",
    inboundResumen:
      "We know that we are the face of our clients. The quality of service is the most important.",
    multipleChannelTitle: "MULTICHANNEL SALES",
    multipleChannelResumen:
      "We consolidate all digital and traditional channels with Inbound Marketing to maximize your sales.",
    collectTitle: "COLLECTIONS",
    collectResumen:
      "We manage preventive, medium and late collections using various communication channels.",
    innovationTitle: "DIGITAL INNOVATION",
    innovationResumen:
      "We develop Web, Mobile and Artificial Intelligence platforms to generate business efficiency.",
    titleButton: "see more",
    titleSlider: "they trust us",
  },
  es: {
    langEs: "Español",
    langEn: "Inglés",
    jobPosition: "Puestos de trabajo",
    login: "Inicia sesión",
    hero: `Ofrecemos soluciones tecnológicas multicanal y
           desarrollo de plataformas digitales utilizando la
           innovación como base para diseñar y ejecutar cada
          proyecto.`,
    subHeroFirst: "Nos encanta lo que hacemos, por eso tenemos los mejores",
    subHeroSecond: "servicios adecuados a la necesidad de cada cliente.",
    inboundTitle: "ATENCIÓN INBOUND",
    inboundResumen:
      "Sabemos que somos la cara de nuestros clientes. La calidad de servicio es lo más importante.",
    multipleChannelTitle: "VENTAS MULTICANAl",
    multipleChannelResumen:
      "Consolidamos todos los canales digitales y tradicionales con Inbound Marketing para maximizar tus ventas.",
    collectTitle: "COBRANZAS",
    collectResumen:
      "Gestionamos cobranzas preventivas, medias y tardías utilizando diversos canales de comunicación.",
    innovationTitle: "INNOVACIÓN DIGITAL",
    innovationResumen:
      "Desarrollamos plataformas Web, Móvil e Inteligencia Artificial para generar eficiencia en los negocios.",
    titleButton: "Ver más",
    titleSlider: "Ellos confían en nosotros",
  },
};

const cache = createIntlCache();

let int = createIntl(
  {
    locale: "en",
    messages: messages["en"],
  },
  cache
);

export function changeLanguage(lang: string) {
  const newIntl = createIntl(
    {
      locale: lang,
      messages: messages[lang as keyof PropMessage],
    },
    cache
  );
  int = newIntl;
}

const translate = (id: string, values?: {}) => {
  return int.formatMessage({ id }, values);
};

export default translate;

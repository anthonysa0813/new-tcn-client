import React, { useState, useEffect, useContext } from "react";
import LayoutEmployee from "./employee/layoutEmployee";
import styles from "../styles/client/Campaign.module.css";
import { GetServerSideProps } from "next/types";
import { Service, ServiceI } from "../interfaces";
import dynamic from "next/dynamic";
import NotFoundJobs from "../components/cards/NotFoundJobs";
import { TokenContext } from "../context/CurrentToken";
const Head = dynamic(() => import("next/head").then((res) => res.default));
import { API_URL } from "../utils/constanstApi";
import { BounceLoader } from "react-spinners";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

interface ServiceProp {
  services: ServiceI[] | [];
}
const ServiceCard = dynamic(
  () => import("../components/dashboard/clients/ServiceCard"),
  {
    ssr: false,
  }
);

const CampaignEmployees = () => {
  const [services, setServices] = useState([]);
  const {
    privateToken: { token },
    setPrivateToken,
  } = useContext(TokenContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = 'TfMpUlxJ62UurAnGV56Cq7RczQMlg5ffdF4Zw1wsqx7NxogeFzg4HiwQ8vvE';
const dniNumber = '70502697'; // Reemplaza con el número de DNI que desees consultar

// Construir la URL de la solicitud con el número de DNI
const apiUrl = `https://api.peruapis.com/v1/dni?document=${dniNumber}`;

// Configurar la solicitud GET
const requestOptions = {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
};

// Realizar la solicitud utilizando fetch
fetch(apiUrl, requestOptions)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    //console.log('Respuesta de la API:', data);
  })
  .catch(error => {
    console.error('Error al realizar la solicitud:', error.message);
  });


    fetch(`${API_URL}/services`)
      .then((res) => {
        return res.json();
      })
      .then((serv) => {
        const servciesActives = serv.services.filter(
          (service: ServiceI) => service.status
        );
	// order serv by the column order in asc 
        servciesActives.sort((a: ServiceI, b: ServiceI) => {
          if ((a.order ?? 0) > (b.order ?? 0)) {
            return 1;
          }
          if ((a.order ?? 0) < (b.order ?? 0)) {
            return -1;
          }
          return 0;
        });
        
        setServices(servciesActives);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Trabaja con nosotros | Contact Americas</title>
        <meta
          name="description"
          content="Trabaja con nosotros Contact Americas."
        />
	<meta name="keywords" content="trabaja con nosotros, contact americas, call center" />
	<meta property="og:title" content="Trabaja con nosotros | Contact Americas" />
	<meta property="og:type" content="website" />
	<meta property="og:description" content="Explora oportunidades laborales emocionantes y descubre tu próximo paso profesional en Contact Americas " />
	<meta property="og:url" content="https://work.contactamericas.com/" />
	<meta property="og:image" content="https://res.cloudinary.com/da0d2neas/image/upload/v1709087979/Imagen_TCN.png" /> 
      </Head>
      <LayoutEmployee>
        <>
          {loading && (
            <div className={styles.loadingContainer}>
              <h3 className="text-3xl">Cargando Puestos...</h3>
              <BounceLoader color="#0072f5" />
            </div>
          )}
        </>
        <main className={styles.main}>
          <div className={styles.wrapper}>
            <div className={styles.mainContainer}>
              {services?.length > 0 ? (
		<>
                  <h3>Puestos de trabajo</h3>
		  <a href="https://contactamericas.com/" className="cursor-pointer flex items-center mt-2 mb-4">
		     <ArrowBackIosIcon />
		     <span className="font-semibold">Regresar a la página principal de Contact</span>
		  </a>
		</>
              ) : (
                <div className={"text-3xl"}>
		  
                  <h3>No tenemos puestos disponibles por el momento</h3>
		  <p className="font-semibold tex-2xl text-gray-500 mt-2">Te invitamos a seguirnos en nuestras redes sociales para mantenerte siempre al tanto</p>
		  <div className="flex items-center gap-4 mt-2 ">
		    <a href="https://www.facebook.com/ContactBPO" target="_blank" className="flex items-center gap-1 text-sm hover:text-blue-500 transition ease">
		    	<FacebookIcon />
			<span>Facebook</span>
		    </a>
		     <a  href="https://www.instagram.com/contactbpo/" target="_blank" className="flex items-center hover:text-rose-500  transition ease  gap-1 text-sm">
			<InstagramIcon />
			<span>Instagram</span>
		    </a>
     			<a  href="https://www.linkedin.com/company/contactamericas/" target="_blank" className="flex items-center gap-1 text-sm hover:text-blue-700  transition ease">
                          <LinkedInIcon />
			  <span>Linkedln</span>
                        </a>  
		  </div>
  		     <a href="https://contactamericas.com/" className="cursor-pointer flex items-center gap-1 text-sm mt-5" >   
		       <ArrowBackIosIcon />
                       <span>Regresar a la página principal</span>
                     </a>
                </div>
              )}
              <div className={styles.servicesGrid}>
                {services?.map((service: ServiceI) => {
                  return (
                    <>
                      <ServiceCard key={service._id} service={service} />
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </LayoutEmployee>
    </>
  );
};
export default CampaignEmployees;

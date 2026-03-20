export const Blog = () => {

    const guiaApp = [
        {
            num: "1.",
            title: "¿Cómo usar el mapa de Vandoo?",
            img: "https://i.imgur.com/fYyBO9I.png",
            text: "Navegar por la libertad es fácil. Filtra por puntos de interés, gasolineras o campings. Haz clic en cualquier icono para ver fotos reales y opiniones de otros viajeros de la comunidad."
        },
        {
            num: "2.",
            title: "Crea tu propio punto de interés",
            img: "https://i.imgur.com/iA4iCB3.png",
            text: "¿Has descubierto un rincón mágico? Pulsa el botón de añadir, sube una foto y cuéntanos qué lo hace especial. Tu aportación ayuda a que la comunidad crezca de forma segura."
        },
        {
            num: "3.",
            title: "Deja un comentario útil",
            img: "https://i.imgur.com/FBpuo3q.png",
            text: "La información en tiempo real es vital. Avisa si una fuente no tiene agua o si el acceso está difícil. Tus reseñas son los ojos de otros conductores en la carretera."
        },
        {
            num: "4.",
            title: "Alquila la camper ideal",
            img: "https://i.imgur.com/67hiCGq.png", 
            text: "¿Aún no tienes casa sobre ruedas? Explora nuestro catálogo de campers totalmente equipadas. Filtra por tamaño, equipamiento o precio, y reserva de forma segura para empezar tu aventura sin complicaciones."
        }
    ]
    return (
        <>
            {/* <h2 className="fw-bold display-6 text-center mb-4 mt-5">¿Como usar Vandoo?</h2> */}
            <div className="container py-5 bg-white overflow-hidden">
                <div className="row justify-content-center">
                    {guiaApp.map((item, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div className="col-12 col-lg-10 pb-md-5" key={index}>
                                <div className={`row align-items-center ${isEven ? '' : 'flex-md-row-reverse'}`}>
                                   <div className="col-md-6 mb-5 mb-md-0 d-flex align-items-start">
                                        <div 
                                            className="fw-bold opacity-25 me-4 display-2">
                                            {item.num}
                                        </div>
                                        <div className="flex-grow-1">
                                            <h2 className="display-6 fw-bold mb-4">
                                                {item.title}
                                            </h2>
                                            <p className="fs-5 text-muted" style={{ textAlign: "justify" }}>
                                                {item.text}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 text-center">
                                        <div className="px-3">
                                            <img
                                                src={item.img}
                                                className="img-fluid rounded-4 shadow-lg"
                                                alt={item.title}
                                                style={{
                                                    maxHeight: '400px',
                                                    objectFit: 'cover',
                                                    width: '100%',
                                                    transition: 'transform 0.3s ease'
                                                }}
                                            // onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                            // onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <hr className="my-5" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};
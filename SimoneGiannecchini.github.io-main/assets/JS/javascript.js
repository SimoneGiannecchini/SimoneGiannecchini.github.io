const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const nome = document.getElementById("nome")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const messaggio = document.getElementById("messaggio")?.value.trim();

        if (!nome || !email || !messaggio) {
            alert("Per favore compila tutti i campi richiesti.");
            return;
        }

        if (typeof emailjs === "undefined") {
            alert("Il servizio email non è disponibile in questo momento. Riprova più tardi.");
            return;
        }

        const params = {
            user_name: nome,
            user_email: email,
            user_messaggio: messaggio
        };

        const serviceID = "service_e46sjhm";
        const templateID = "template_vx9y51g";

        emailjs.send(serviceID, templateID, params)
            .then(() => {
                alert("Messaggio inviato con successo!");
                contactForm.reset();
            })
            .catch((error) => {
                console.error("Errore durante l'invio:", error);
                alert("Si è verificato un errore durante l'invio del messaggio. Riprova tra poco.");
            });
    });
}

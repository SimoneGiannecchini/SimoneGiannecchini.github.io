const EMAILJS_PUBLIC_KEY = "BYiHUsedcY9JxwMqz";
const EMAILJS_SERVICE_ID = "service_adue8qo";
const EMAILJS_TEMPLATE_ID = "template_vx9y51g";

const contactForm = document.getElementById("contactForm");
const submitButton = document.getElementById("contactSubmit");
const formStatus = document.getElementById("formStatus");

function setFormStatus(message, tone = "") {
    if (!formStatus) {
        return;
    }

    formStatus.textContent = message;
    formStatus.className = tone ? `form-status ${tone}` : "form-status";
}

function setSubmittingState(isSubmitting) {
    if (!submitButton) {
        return;
    }

    submitButton.disabled = isSubmitting;
    submitButton.textContent = isSubmitting ? "Invio..." : "Invia";
}

if (contactForm) {
    if (typeof window.emailjs !== "undefined") {
        window.emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    contactForm.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" || event.isComposing) {
            return;
        }

        const isMessageField = event.target?.id === "messaggio";
        const shouldSubmit = !isMessageField || event.ctrlKey || event.metaKey;

        if (!shouldSubmit) {
            return;
        }

        event.preventDefault();

        if (typeof contactForm.requestSubmit === "function") {
            contactForm.requestSubmit(submitButton || undefined);
        } else if (submitButton) {
            submitButton.click();
        }
    });

    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nome = document.getElementById("nome")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const oggetto = document.getElementById("oggetto")?.value.trim();
        const messaggio = document.getElementById("messaggio")?.value.trim();

        if (!nome || !email || !oggetto || !messaggio) {
            setFormStatus("Compila tutti i campi richiesti prima di inviare.", "is-error");
            return;
        }

        if (typeof window.emailjs === "undefined") {
            setFormStatus("Il servizio email non e disponibile in questo momento. Riprova piu tardi.", "is-error");
            return;
        }

        setSubmittingState(true);
        setFormStatus("Invio del messaggio in corso...", "is-pending");

        const templateParams = {
            user_name: nome,
            user_email: email,
            user_subject: oggetto,
            user_messaggio: messaggio,
            from_name: nome,
            from_email: email,
            subject: oggetto,
            oggetto,
            reply_to: email,
            message: messaggio,
            messaggio,
            nome,
            email
        };

        try {
            await window.emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY
            );
            contactForm.reset();
            setFormStatus("Messaggio inviato con successo. Ti rispondero il prima possibile.", "is-success");
        } catch (error) {
            console.error("Errore durante l'invio del form:", error);
            const errorHint = error?.text || error?.message || "";
            const detailedMessage = errorHint
                ? `Invio non riuscito. ${errorHint}`
                : "Invio non riuscito. Controlla la configurazione EmailJS oppure riprova tra poco.";
            setFormStatus(detailedMessage, "is-error");
        } finally {
            setSubmittingState(false);
        }
    });
}

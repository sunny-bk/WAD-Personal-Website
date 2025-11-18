// MOBILE NAV TOGGLE
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("show");
    });
}

// DYNAMIC YEAR
const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// PROBLEM-SOLVING PAGE: EMAIL GENERATION LOGIC
const problemForm = document.getElementById("problemForm");

if (problemForm) {
    problemForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("customerName").value.trim();
        const email = document.getElementById("customerEmail").value.trim();
        const enquiryType = document.getElementById("enquiryType").value;
        const date = document.getElementById("bookingDate").value;
        const time = document.getElementById("bookingTime").value;
        const guests = document.getElementById("guests").value;
        const message = document.getElementById("message").value.trim();

        const restaurantEmail = "hello@riversidebistro.example";

        // Subject
        const subject = `${enquiryType} from ${name || "customer"}`;

        // Body (plain text)
        let bodyLines = [];
        bodyLines.push(`Enquiry type: ${enquiryType}`);
        bodyLines.push(`Name: ${name}`);
        bodyLines.push(`Email: ${email}`);

        if (date || time || guests) {
            bodyLines.push("");
            bodyLines.push("Booking details:");
            if (date) bodyLines.push(`- Date: ${date}`);
            if (time) bodyLines.push(`- Time: ${time}`);
            if (guests) bodyLines.push(`- Number of guests: ${guests}`);
        }

        bodyLines.push("");
        bodyLines.push("Message:");
        bodyLines.push(message);

        const body = bodyLines.join("\n");

        // Update preview fields
        const subjectInput = document.getElementById("emailSubject");
        const bodyTextarea = document.getElementById("emailBody");
        const sendLink = document.getElementById("sendEmailLink");

        if (subjectInput) subjectInput.value = subject;
        if (bodyTextarea) bodyTextarea.value = body;

        // Build mailto link
        if (sendLink) {
            const mailtoHref =
                "mailto:" +
                encodeURIComponent(restaurantEmail) +
                "?subject=" +
                encodeURIComponent(subject) +
                "&body=" +
                encodeURIComponent(body);

            sendLink.href = mailtoHref;
        }
    });
}

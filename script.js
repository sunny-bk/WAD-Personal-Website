"use strict";

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
        hamburger.setAttribute("aria-expanded", String(!isExpanded));
        navLinks.classList.toggle("show");
    });
}

const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

/* ---------- PROBLEM-SOLVING FORM LOGIC: VALIDATION + EMAIL PREVIEW ---------- */

const problemForm = document.getElementById("problemForm");

/**
 * Helper: set error message for a field, toggle aria-invalid
 */
function setFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}-error`);

    if (!field || !errorEl) return;

    if (message) {
        errorEl.textContent = message;
        field.setAttribute("aria-invalid", "true");
    } else {
        errorEl.textContent = "";
        field.removeAttribute("aria-invalid");
    }
}

/**
 * Validate the form and return an object:
 * { isValid: boolean, errors: string[] }
 */
function validateProblemForm() {
    const name = document.getElementById("customerName").value.trim();
    const email = document.getElementById("customerEmail").value.trim();
    const enquiryType = document.getElementById("enquiryType").value;
    const date = document.getElementById("bookingDate").value;
    const time = document.getElementById("bookingTime").value;
    const guests = document.getElementById("guests").value.trim();
    const message = document.getElementById("message").value.trim();

    const errors = [];

    // Reset all field errors before validating
    setFieldError("customerName", "");
    setFieldError("customerEmail", "");
    setFieldError("enquiryType", "");
    setFieldError("bookingDate", "");
    setFieldError("bookingTime", "");
    setFieldError("guests", "");
    setFieldError("message", "");

    // Name
    if (!name) {
        errors.push("Enter your full name.");
        setFieldError("customerName", "Please enter your full name.");
    }

    // Email (basic pattern)
    if (!email) {
        errors.push("Enter your email address.");
        setFieldError("customerEmail", "Please enter your email address.");
    } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            errors.push("Enter an email address in the correct format, like name@example.com.");
            setFieldError("customerEmail", "Enter an email address in the format name@example.com.");
        }
    }

    // Enquiry type – already has sensible defaults, so no hard validation needed
    if (!enquiryType) {
        errors.push("Select an enquiry type.");
        setFieldError("enquiryType", "Please select an enquiry type.");
    }

    // Guests (optional, but if filled must be between 1 and 20)
    if (guests !== "") {
        const guestsNumber = Number(guests);
        if (!Number.isInteger(guestsNumber) || guestsNumber < 1 || guestsNumber > 20) {
            errors.push("Number of guests must be a whole number between 1 and 20.");
            setFieldError("guests", "Enter a whole number between 1 and 20.");
        }
    }

    // Message
    if (!message) {
        errors.push("Enter your message.");
        setFieldError("message", "Please enter your message.");
    }

    // Optional: if time is set but no date (or vice versa), gently nudge
    if ((date && !time) || (!date && time)) {
        errors.push("If you include booking details, please provide both a date and a time.");
        if (!date) setFieldError("bookingDate", "Please add a date or clear the time.");
        if (!time) setFieldError("bookingTime", "Please add a time or clear the date.");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

if (problemForm) {
    problemForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const errorSummary = document.getElementById("formErrors");

        if (errorSummary) {
            errorSummary.innerHTML = "";
        }

        const validation = validateProblemForm();

        if (!validation.isValid) {
            // Build accessible error summary
            if (errorSummary && validation.errors.length > 0) {
                const listItems = validation.errors
                    .map((msg) => `<li>${msg}</li>`)
                    .join("");

                errorSummary.innerHTML = `
                    <p><strong>There is a problem with your submission:</strong></p>
                    <ul>${listItems}</ul>
                `;

                // Move focus to the error summary for keyboard/screen-reader users
                errorSummary.focus?.();
                errorSummary.scrollIntoView({ behavior: "smooth", block: "start" });
            }

            return; // stop here if validation fails
        }

        // If valid, build the email content
        const name = document.getElementById("customerName").value.trim();
        const email = document.getElementById("customerEmail").value.trim();
        const enquiryType = document.getElementById("enquiryType").value;
        const date = document.getElementById("bookingDate").value;
        const time = document.getElementById("bookingTime").value;
        const guests = document.getElementById("guests").value.trim();
        const message = document.getElementById("message").value.trim();

        const restaurantEmail = "hello@riversidebistro.example";

        const subject = `${enquiryType} from ${name || "customer"}`;

        const bodyLines = [];
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

        const subjectInput = document.getElementById("emailSubject");
        const bodyTextarea = document.getElementById("emailBody");
        const sendLink = document.getElementById("sendEmailLink");

        if (subjectInput) subjectInput.value = subject;
        if (bodyTextarea) bodyTextarea.value = body;

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

// ---- Home heading: Swap between name and "a CTO" ----

(function () {
    const dynamic = document.querySelector(".home-heading-dynamic");
    if (!dynamic) return;

    const prefersReducedMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const realName = dynamic.textContent.trim();  // e.g., "Brian"
    const altText = "CTO";

    if (prefersReducedMotion) {
        dynamic.textContent = realName;
        return;
    }

    let showingName = true;
    let charIndex = 0;
    let isDeleting = false;

    const TYPING_SPEED = 80;
    const ERASE_SPEED = 55;
    const HOLD_TIME = 1100;

    function tick() {
        const fullText = showingName ? realName : altText;

        if (!isDeleting) {
            // Typing forward
            dynamic.textContent = fullText.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === fullText.length) {
                setTimeout(() => {
                    isDeleting = true;
                    tick();
                }, HOLD_TIME);
                return;
            }
            setTimeout(tick, TYPING_SPEED);

        } else {
            // Deleting backward
            dynamic.textContent = fullText.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                showingName = !showingName; // swap target text
                setTimeout(tick, 400);
                return;
            }
            setTimeout(tick, ERASE_SPEED);
        }
    }

    setTimeout(tick, 900);
})();


document.addEventListener("submit", function (e) {
    if (e.target.matches("form")) {
        sessionStorage.setItem("scrollY", window.scrollY);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const scrollY = sessionStorage.getItem("scrollY");
    if (scrollY) {
        window.scrollTo({ top: parseInt(scrollY, 10), behavior: "instant" });
        sessionStorage.removeItem("scrollY");
    }
});


/* 
------------------------------------------------------------
The code below is inspired by Hans’s form validation video from MVC 
.Net course and adapted for this project with assistance from ChatGPT.

 This JavaScript file handles real-time form validation for 
 the callback form in my Umbraco project.

 It uses the same validation attributes 
 (data-val, data-val-required, data-val-regex, etc.) that 
 ASP.NET automatically adds to inputs via the asp-for tag helper.

 The script dynamically checks each field when the user types 
 or changes a value. If a field is empty or doesn’t match a 
 specified pattern (like an email format), an error message 
 appears next to it using the <span asp-validation-for="..."> element.

 When the form is submitted, the script prevents submission 
 if any errors exist, highlights the invalid fields with 
 red borders, and scrolls to the first error for better UX.

 This approach is based on the JavaScript validation logic 
 I used in my previous MVC project, but adapted for Umbraco’s 
 Html.BeginUmbracoForm and Tailwind CSS instead of Bootstrap.

------------------------------------------------------------
*/

function getErrorSpan(field) {
    const name = field.getAttribute("name");
    return document.querySelector(`span[data-valmsg-for="${name}"]`);
}

function setError(field, span, message) {
    field.classList.add("border-red-500", "focus:ring-red-500");
    field.classList.remove("border-gray-300");

    if (span) {
        span.classList.remove("field-validation-valid");
        span.classList.add("field-validation-error");
        span.textContent = message;
    }
}

function clearError(field, span) {
    field.classList.remove("border-red-500", "focus:ring-red-500");
    field.classList.add("border-gray-300");

    if (span) {
        span.classList.remove("field-validation-error");
        span.classList.add("field-validation-valid");
        span.textContent = "";
    }
}

function validateField(field) {
    const span = getErrorSpan(field);
    if (!span) return true;

    let message = "";
    const value = (field.value || "").trim();

    if (field.hasAttribute("data-val-required") && value === "") {
        message = field.getAttribute("data-val-required");
    }

    if (!message && field.hasAttribute("data-val-regex") && value !== "") {
        const pattern = new RegExp(field.getAttribute("data-val-regex-pattern"));
        if (!pattern.test(value)) {
            message = field.getAttribute("data-val-regex");
        }
    }

    if (!message && field.hasAttribute("data-val-equalto")) {
        const otherName = field.getAttribute("data-val-equalto-other")?.replace("*.", "");
        if (otherName) {
            const other = field.form?.querySelector(`[name="${otherName}"]`);
            if (other && other.value !== value) {
                message = field.getAttribute("data-val-equalto");
            }
        }
    }

    if (message) {
        setError(field, span, message);
        return false;
    } else {
        clearError(field, span);
        return true;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("callbackForm");
    if (!form) return;

    const fields = form.querySelectorAll("input[data-val='true'], select[data-val='true'], textarea[data-val='true']");


    fields.forEach(field => {
        field.addEventListener("input", () => validateField(field));
        field.addEventListener("change", () => validateField(field));
    });


    form.addEventListener("submit", (e) => {
        let allValid = true;
        fields.forEach(field => {
            const ok = validateField(field);
            if (!ok) allValid = false;
        });

        if (!allValid) {
            e.preventDefault();
            const firstError = form.querySelector(".field-validation-error");
            if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });
});

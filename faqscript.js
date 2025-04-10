//FAQ HTML structure const faqHTML = `
<ul class="faq-list main-list">
    {/* <!-- Add more level-1 sections as needed --> */}
</ul>
;

// Function to generate Schema.org FAQPage JSON-LD
function generateFAQSchema() {
    // Create a temporary container to parse the HTML string
    const container = document.getElementById('faq-container');
    container.innerHTML = faqHTML;

    const faqItems = container.querySelectorAll('.faq-list-item-level-two');
    const faqData = [];

    faqItems.forEach(item => {
        // Extract question text (excluding SVG)
        const questionText = Array.from(item.childNodes)
            .filter(node => node.nodeType === Node.TEXT_NODE)
            .map(node => node.textContent.trim())
            .join('')
            .trim();

        // Extract answer text (full HTML content of faq-item-body)
        const answerBody = item.nextElementSibling;
        const answerText = answerBody ? answerBody.innerHTML.trim() : '';

        // Add to faqData array
        faqData.push({
            "@type": "Question",
            "name": questionText,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": answerText
            }
        });
    });

    // Create the FAQPage schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData
    };

    // Output to console
    console.log(JSON.stringify(faqSchema, null, 2));

    // Optionally, return the schema if you want to use it elsewhere
    return faqSchema;
}

// Run the function when the page loads
window.onload = function() {
    const schema = generateFAQSchema();
    // You can also display it on the page if desired:
    // document.body.innerHTML += `<pre>${JSON.stringify(schema, null, 2)}</pre>`;
};
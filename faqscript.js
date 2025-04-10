//FAQ HTML structure 
const faqHTML = `

`;

// Function to generate Schema.org FAQPage JSON-LD wrapped in <script> tag
function generateFAQSchema() {
    // Create a temporary container to parse the HTML string
    const container = document.getElementById('faq-container');
    container.innerHTML = faqHTML;

    const faqItems = container.querySelectorAll('.faq-list-item-level-two');
    const faqData = [];
    const seenQuestions = new Set(); // Track duplicates

    faqItems.forEach(item => {
        // Extract question text (excluding SVG)
        const questionText = Array.from(item.childNodes)
            .filter(node => node.nodeType === Node.TEXT_NODE)
            .map(node => node.textContent.trim())
            .join('')
            .trim()
            .replace(/\s+/g, ' '); // Normalize whitespace

        // Skip if question is empty or malformed
        if (!questionText) return;

        // Extract answer text (convert HTML to plain text)
        const answerBody = item.nextElementSibling;
        let answerText = '';
        if (answerBody) {
            // Get all text content, excluding the separator div
            const paragraphs = answerBody.querySelectorAll('p, ul, dl');
            answerText = Array.from(paragraphs)
                .map(p => p.textContent.trim())
                .join(' ')
                .replace(/\s+/g, ' '); // Normalize whitespace
        }

        // Handle duplicates
        if (seenQuestions.has(questionText)) {
            console.warn(`Duplicate question found: "${questionText}"`);
            return; // Skip duplicates; alternatively, you could merge answers
        }
        seenQuestions.add(questionText);

        // Add to faqData array
        faqData.push({
            "@type": "Question",
            "name": questionText,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": answerText || "No answer provided."
            }
        });
    });

    // Create the FAQPage schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData
    };

    // Wrap in <script> tag
    const output = `<script type="application/ld+json">\n${JSON.stringify(faqSchema, null, 2)}\n</script>`;

    // Output to console
    console.log(output);

    return output;
}

// Run the function when the page loads
window.onload = function() {
    generateFAQSchema();
};

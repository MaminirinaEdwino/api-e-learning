const fs = require('fs');

// Charger le fichier exporté de Restfox
const data = JSON.parse(fs.readFileSync('restfox_export.json', 'utf8'));

let markdown = `# Documentation API\n\n`;

data.collection.forEach(item => {
    if (item._type === 'request') {
        markdown += `## ${item.name}\n\n`;
        markdown += `**Endpoint:** \`${item.method}\` \`${item.url}\`  \n`;
        
        // Gestion du Body
        if (item.body && item.body.text) {
            markdown += `### Request Body (JSON)\n\`\`\`json\n${item.body.text}\n\`\`\`\n`;
        }

        // Gestion des Headers
        if (item.headers && item.headers.length > 0) {
            markdown += `### Headers\n`;
            item.headers.forEach(h => {
                markdown += `- **${h.name}**: ${h.value}\n`;
            });
        }
        
        markdown += `\n---\n`;
    }
});

fs.writeFileSync('../README.md', markdown);
console.log('Documentation générée dans API_DOC.md !');
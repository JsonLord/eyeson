
const axios = require('axios');

class BlabladorService {
    constructor() {
        this.apiKey = process.env.BLABLADOR_API_KEY;
        this.apiUrl = 'https://api.helmholtz-blablador.fz-juelich.de/v1/chat/completions';
    }

    async query(prompt, modelAlias, imageData = null) {
        if (!this.apiKey) {
            throw new Error('BLABLADOR_API_KEY is not set.');
        }

        const content = [{ type: 'text', text: prompt }];

        if (imageData) {
            content.push({
                type: 'image_url',
                image_url: {
                    url: `data:image/png;base64,${imageData}`
                }
            });
        }

        try {
            const response = await axios.post(this.apiUrl, {
                model: modelAlias,
                messages: [{ role: 'user', content: content }]
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Error querying Blablador API:', error.response ? error.response.data : error.message);
            throw new Error('Failed to get a response from the Blablador API.');
        }
    }
}

module.exports = new BlabladorService();

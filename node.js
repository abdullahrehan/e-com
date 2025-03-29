const fs = require('fs');
const path = require('path');

// Configuration Constants
const CONFIG = {
    HTTP_METHODS: ['GET', 'POST', 'PUT', 'DELETE'],
    OUTPUT_DIRECTORIES: {
        API_SERVICES: 'client/src/api', // Updated path for API services
        REACT_HOOKS: 'client/src/hooks' // Updated path for React hooks
    }
};

// Utility Functions for String Manipulation
const StringUtils = {
    toCamelCase: (input) => {
        return input
            .split(/[^a-zA-Z0-9]/)
            .map((word, index) =>
                index === 0
                    ? word.toLowerCase()
                    : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join('');
    },
    toCapitalizedCamelCase: (input) => {
        const camelCase = StringUtils.toCamelCase(input);
        return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
    }
};

// URL and Parameter Processing Utilities
const URLProcessor = {
    parseParameters: (url) => {
        const cleanUrl = url.replace('{{quickphotos}}', '');
        const paramMatches = cleanUrl.match(/\?([^#]*)/);

        if (!paramMatches) return { cleanUrl, params: [] };

        const queryParams = paramMatches[1].split('&');
        const params = queryParams.map(param => {
            const [key] = param.split('=');
            return StringUtils.toCamelCase(key);
        });

        const processedUrl = cleanUrl.replace(
            /\?[^#]*/,
            params.map((p, i) => `${queryParams[i].split('=')[0]}=\${${p}}`).join('&')
        );

        return {
            cleanUrl: processedUrl,
            params
        };
    }
};

// API Generation Logic
const APIGenerator = {
    groupByHttpMethod: (items) => {
        return items.reduce((grouped, item) => {
            const method = item.request?.method || 'GET';
            grouped[method] = grouped[method] || [];
            grouped[method].push(item);
            return grouped;
        }, {});
    },

    createAPIFunction: (item) => {
        const {
            name,
            request: {
                body,
                method,
                url: { raw }
            } = {}
        } = item;

        const hasRequestBody = body?.raw;
        const { cleanUrl, params } = URLProcessor.parseParameters(raw);

        const functionParams = [...(hasRequestBody ? ['body'] : []), ...params].join(', ');

        return `export const ${StringUtils.toCamelCase(name)}Request = async (${functionParams}) => {
    return apiClient(\`${cleanUrl}\`, {
        method: "${method}",
        requiresAuth: false,
        ${hasRequestBody ? 'body,' : ''}
    });
};`;
    },

    generateAPIService: (name, subItems) => {
        const groupedItems = APIGenerator.groupByHttpMethod(subItems);

        const apiMethods = CONFIG.HTTP_METHODS
            .map(method => {
                const items = groupedItems[method];
                if (!items?.length) return '';

                const apis = items
                    .map(APIGenerator.createAPIFunction)
                    .join('\n\n');

                return `//------------------------- ${method} APIs --------------------//\n\n${apis}\n\n`;
            })
            .filter(Boolean)
            .join('');

        return `import apiClient from '@/lib/apiClient.js';

// API service for ${name}\n\n${apiMethods}`;
    }
};

// Service and Hook Generation
const ServiceGenerator = {
    generateAPIService: (name, subItems) => {
        const groupedItems = APIGenerator.groupByHttpMethod(subItems);

        const apiMethods = CONFIG.HTTP_METHODS
            .map(method => {
                const items = groupedItems[method];
                if (!items?.length) return '';

                const apis = items
                    .map(APIGenerator.createAPIFunction)
                    .join('\n\n');

                return `//------------------------- ${method} APIs --------------------//\n\n${apis}\n\n`;
            })
            .filter(Boolean)
            .join('');

        return `import apiClient from '@/lib/apiClient.js';

// API service for ${name}\n\n${apiMethods}`;
    },

    generateReactHook: (name, subItems) => {
        if (!Array.isArray(subItems)) {
            throw new Error(`Invalid subItems for ${name}. Expected an array.`);
        }

        const imports = subItems
            .map(data => `${StringUtils.toCamelCase(data.name)}Request`)
            .join(',\n  ');

        const hookFunctions = subItems.map(data => {
            const hasBody = data.request?.method === 'POST' && data.request?.body?.raw;
            const params = hasBody ? 'body' : '';
            return `  const ${StringUtils.toCamelCase(data.name)} = (${params}) => 
                      handleRequest(${StringUtils.toCamelCase(data.name)}Request,true,true${params ? ', body' : ''});`;
        }).join('\n');

        const returnObject = subItems
            .map(data => `${StringUtils.toCamelCase(data.name)},`)
            .join('\n    ');

        // return `import handleRequest from './handleRequest';
        //         import { ${imports} } from "../api/${StringUtils.toCamelCase(name)}Service";
        //         import { useState } from 'react';

        //         const use${StringUtils.toCapitalizedCamelCase(name)} = () => { 
        //         const [isLoading, setIsLoading] = useState(false);

        //         ${hookFunctions}

        //         return { isLoading, ${returnObject}};
        //         };

        //     export default use${StringUtils.toCapitalizedCamelCase(name)};`;
        return `import { useState } from 'react';
import { ${subItems.map(data => `${StringUtils.toCamelCase(data.name)}Request`).join(', ')} } from "../api/${StringUtils.toCamelCase(name)}Service";
import handleRequest from '@/lib/handleRequest';

const use${StringUtils.toCapitalizedCamelCase(name)} = () => {
  const [isLoading, setIsLoading] = useState(false);

  ${subItems.map(data => {
            const hasBody = data.request?.method === 'POST' && data.request?.body?.raw;
            const paramName = hasBody ? 'body' : 'params';
            const params = hasBody || data.request?.url?.raw.includes('?') ? paramName : '';
            return `const ${StringUtils.toCamelCase(data.name)} = (${params}) => handleRequest(${StringUtils.toCamelCase(data.name)}Request,true,true${params ? `, ${params}` : ''});`;
        }).join('\n  ')}

  return {
    isLoading,
    ${subItems.map(data => StringUtils.toCamelCase(data.name)).join(',\n    ')}
  };
};

export default use${StringUtils.toCapitalizedCamelCase(name)};`;
    }
};

// File System Utilities
const FileManager = {
    createDirectory: (dirPath) => {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    },
    writeFile: (filePath, content) => {
        fs.writeFileSync(filePath, content, 'utf8');
    },
    readJsonFile: async (filePath) => {
        const data = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(data);
    }
};

// Main Execution
const generateAPIFiles = async (jsonFilePath) => {
    try {
        const file = await FileManager.readJsonFile(jsonFilePath);

        if (!file.item?.length) {
            throw new Error('JSON file must contain an array in file.item');
        }

        const outputDirectories = {
            api: path.join(__dirname, CONFIG.OUTPUT_DIRECTORIES.API_SERVICES),
            hooks: path.join(__dirname, CONFIG.OUTPUT_DIRECTORIES.REACT_HOOKS)
        };

        Object.values(outputDirectories).forEach(FileManager.createDirectory);

        file.item.forEach((item) => {
            const { name, item: subItems = [] } = item;

            if (!name || typeof name !== 'string') {
                console.warn('Skipping item without valid name:', item);
                return;
            }

            const camelCaseName = StringUtils.toCamelCase(name);

            FileManager.writeFile(
                path.join(outputDirectories.api, `${camelCaseName}Service.js`),
                ServiceGenerator.generateAPIService(name, subItems)
            );

            FileManager.writeFile(
                path.join(outputDirectories.hooks, `use${StringUtils.toCapitalizedCamelCase(name)}.js`),
                ServiceGenerator.generateReactHook(name, subItems)
            );
        });

        console.log('Files generated successfully.');
    } catch (error) {
        console.error('Generation Error:', error.message);
        process.exit(1);
    }
};

// Script Execution
generateAPIFiles('./api.postman_collection.json');
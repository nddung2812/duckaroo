const fs = require('fs');
const path = require('path');

const filePath = '/Users/johnny/Desktop/Duckaroo/Swan_Design_Aquatic_Center/app/products/data/products.js';
let content = fs.readFileSync(filePath, 'utf8');

// The file exports const productsData = [...]
// We can use a regex or just simple string manipulation since it's a JS file.
// However, since it's a large file, let's be careful.

const productsDataRegex = /export const productsData = (\[[\s\S]*?\]);/;
const match = content.match(productsDataRegex);

if (match) {
    let products = JSON.parse(match[1]);
    let updatedCount = 0;

    products = products.map(product => {
        if (product.name.toLowerCase().includes('koika') && product.category !== 'probiotics') {
            console.log(`Updating ${product.name} from ${product.category} to probiotics`);
            product.category = 'probiotics';
            updatedCount++;
        }
        return product;
    });

    if (updatedCount > 0) {
        const newContent = content.replace(productsDataRegex, `export const productsData = ${JSON.stringify(products, null, 2)};`);
        fs.writeFileSync(filePath, newContent);
        console.log(`Successfully updated ${updatedCount} Koika products.`);
    } else {
        console.log('No Koika products needed updating.');
    }
} else {
    console.log('Could not find productsData export.');
}

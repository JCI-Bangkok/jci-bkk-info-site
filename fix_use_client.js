const fs = require('fs');
let code = fs.readFileSync('src/lib/builder/config.tsx', 'utf8');

code = code.replace(/"use client";\n/g, '');
code = '"use client";\n' + code;

fs.writeFileSync('src/lib/builder/config.tsx', code);

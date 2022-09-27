const APP = process.env.APP;
const CLIENT = process.env.CLIENT;
const HOST = process.env.HOST;

const common = `
  features/${APP}/${CLIENT}/**/*.feature  
  --require-module ts-node/register
  --require src/**/*.ts
  --format json:reports/report.json
  --format summary 
  --format progress-bar 
  --format @cucumber/pretty-formatter
  --format-options ${JSON.stringify({ snippetInterface: 'async-await' })}
  --publish-quiet
  `;

const getWorldParams = async () => {
    if(!APP){
        throw new Error('APP name was not specified.');
    }else if(!CLIENT){
        throw new Error('CLIENT name was not provided.');
    }else if(!HOST){
        throw new Error('HOST name was not provided. Example : DEV1,DEV2');
    }
    return `--world-parameters ${JSON.stringify({
        foo: 'bar'})}`;
};

module.exports = {
    default: `${common} ${getWorldParams()}`,
};

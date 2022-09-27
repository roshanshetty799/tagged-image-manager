
import * as soap from "soap";
import {SoapMethod} from "soap";
import {EnvConstants} from "../support/cucumber-world";
import {logger} from "./logger";


export class SoapDriver{

    env: EnvConstants

    constructor(env:EnvConstants) {
        this.env = env;
    }

    /**
     *  Create a new SOAP g_CLIENT from the WSDL url
     *
     * @return soapOperation - Returns a SOAP Operation as a function object
     *
     * @param serviceName - The service name of a Web Service, typically found
     * at the end of an Web Service Endpoint
     * Example:- For the following, web service - http://sup-ing-app1:9390/IngDev2WebServices/Member, 'Member' is the serviceName
     *
     * @param operationName - The SOAP operation that you wish to return
     * When the WSDL file is opened in a browser, the various operations are listed are the 'message' tag
     */
    private async getOperationByWSDLAndMessageName (serviceName:string, operationName:string): Promise<SoapMethod> {
        return new Promise((resolve, reject) => {
            //  soap.createClient(`http://${getWebServiceURL(g_CLIENT, g_HOST)}/${serviceName}?wsdl`, (err, g_CLIENT) => {
            soap.createClient(`http://${this.env.ENV_CONFIG[this.env.APP][this.env.CLIENT][this.env.HOST].webService}/${serviceName}?wsdl`,
                (err, client) => {
                if (err) {
                    logger.error(err);
                    reject(err);
                } else {
                    resolve(client[operationName]);
                }
            });

        });
    }

    /**
     * @return array of objects. Objects are elements returned from the SOAP response.
     * @param soapOperation
     * @param soapRequestArgs
     * @param elementName - Collection of tags that you wish to return. In the above example, 'investment'
     *
     */
    private async getOperationResponseBody (soapOperation:SoapMethod ,soapRequestArgs:object,elementName:string):Promise<object[]>{
        return new Promise((resolve, reject) => {
            soapOperation(soapRequestArgs, (err, result) => {
                if (err) {
                    logger.error(err);
                    reject(err);
                } else {
                    resolve(result['return'][elementName]);
                }

            });
        });
    }


     async getSoapResponseByWSDLAndOperation (serviceName: string,operationName:string,soapRequestArgs:object,elementName:string):Promise<object[]> {
         return this.getOperationResponseBody(await this.getOperationByWSDLAndMessageName(serviceName, operationName), soapRequestArgs, elementName);
     }

}















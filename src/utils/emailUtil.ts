/*
* Author     : Roshan S.
* Description: This file contains email verification utility functions which can be used across the framework.
*              It uses an open source throw away email service to simulate user account verifications.
*              Complete API doc can be found here : https://www.1secmail.com/api/
* */

const axios = require('axios')
const mail_BaseUrl = `https://www.1secmail.com/api/v1/`;

export const get_New_Disposable_Email = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        axios.get(`${mail_BaseUrl}?action=genRandomMailbox&count=1`)
            .then((rez: { data: (string | PromiseLike<string>)[]; }) => resolve(rez.data[0]))
            .catch((error: any) => reject(error));
    })
}

/**
 * This will return body of the latest email in the mailbox
 * @param emailAdddress
 *
 */
export const get_Email_body = (emailAdddress: string): Promise<string> => {
    let emailName = emailAdddress.split('@')[0];
    let domain = emailAdddress.split('@')[1];

    return new Promise((resolve, reject) => {
        axios.get(`${mail_BaseUrl}?action=getMessages&login=${emailName}&domain=${domain}`).
        then((emails_Inbox: { data: { [x: string]: any; }[]; }) => {
            axios.get(`${mail_BaseUrl}?action=readMessage&login=${emailName}&domain=${domain}&id=${emails_Inbox.data[0]['id']}`).
            then((email_Content: { data: { body: string | PromiseLike<string>; }; }) => resolve(email_Content.data.body)).
            catch((error: any)=> reject(error));
        }).
        catch((error: any)=> reject(error));

    })
}
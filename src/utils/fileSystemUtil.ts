/*
* Author     : Roshan S.
* Description: This file contains file system functions which can be used across the framework
* */


import {logger} from "../drivers/logger";
import path from "path";

const fs = require('fs-extra');
const exceljs = require('exceljs');
const pdf = require('pdf-parse');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

const delay = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fileSystemUtils = {

    /**
     * Function to move a file.
     * @currentPath - The path where the file currently resides. Can be absolute or relative to the project root dir
     * @destinationPath - The path where the file should be moved to. Can be absolute or relative to the project root dir
     */
    moveFile: (currentPath:string, destinationPath: string) => fs.renameSync(currentPath,destinationPath),

    /**
     * Creates a new folder(s)/directory(s) at the specified path
     * @path - path where the folder needs to created. To create sub-folders, specify it after a '/'
     *
     * Example createNewDire('parentDir/childDir');
     */
    createNewDir: async (path: string) => {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, {recursive: true});
        }
        await delay(2000);
    },


    checkFileExists: async (path: string) => {
        let fileExists = fs.existsSync(path);
        if (!fileExists) {
            await logger.error(`File does not exist at path :- ${path}`);
        }
        return fileExists;
    },

    checkIfExistsWithTimeout: async (filePath: string, timeout: number, errorMsg: string) => {
        return new Promise<void>(async function (resolve, reject) {

            let timer = setTimeout(function () {
                watcher.close();
                reject(new Error(errorMsg));
            }, timeout);

            await fs.access(filePath, fs.constants.R_OK, function (err: Error) {
                if (!err) {
                    clearTimeout(timer);
                    watcher.close();
                    resolve();
                }
            });

            let dir = path.dirname(filePath);
            let basename = path.basename(filePath);
            let watcher = await fs.watch(dir, function (eventType: string, filename: string) {
                if (eventType === 'rename' && filename === basename) {
                    clearTimeout(timer);
                    watcher.close();
                    resolve();
                }
            });
        });
    },


    deleteFiles: (path: string, filePattern: string) => {
        fs.readdirSync(path)
            .filter((file: string | string[]) => file.includes(filePattern))
            .map((file: any) => fs.unlinkSync(`${path}/${file}`))
    },

    readFile: (path:string) => {
      return fs.readFileSync(path)
    },

    /**
     *  Retrieve cell value from an excel file.
     */
    getValueFromExcelCell: async (fileName: string, sheetNameOrIndex: string, cellAddress: string) => {
        let workbook = await new exceljs.Workbook().xlsx.readFile(`./downloads/${fileName}.xlsx`);
        let worksheet = await workbook.getWorksheet(sheetNameOrIndex);
        return worksheet.getCell(cellAddress).value;
    },

    /**
     *  Delete's the specified xlsx file in the system 'Downloads' folder
     */
    deleteFile: async (fileName: string) => {
        await fs.remove(fileName, (err: any) => {
            if (err) return logger.error(`Unable to delete file ${fileName}. ERROR : ${err}`);
            logger.info(`Deleted file ${fileName}`);
        });

    },

    /**
     *  Returns complete text from specified pdf file in the 'Downloads' folder
     */
    getTextFrompdf: (pdfName: string): Promise<string> => {
        let dataBuffer = fs.readFileSync(`./downloads/${pdfName}.pdf`);

        return new Promise((resolve, reject) => {
            pdf(dataBuffer).then((data: { text: string | PromiseLike<string>; }) => {
                resolve(data.text);
            }).catch((err: any) => {
                reject(err);
            });
        })

    },
    /**
     *  Compares two images and returns the difference found as a PNG
     */
    compareImages: (baseImg: Buffer, referenceImg: Buffer ) => {
        const baseImage = PNG.sync.read(baseImg);
        const referenceImage = PNG.sync.read(referenceImg);
        const {width, height} = baseImage;
        const diff = new PNG({width, height});

        const mismatchDifference = pixelmatch(baseImage.data, referenceImage.data, diff.data, width, height, {threshold: 0.2});

        if (mismatchDifference > 0) {
            return PNG.sync.write(diff);
        } else {
            return undefined;
        }
    }


}



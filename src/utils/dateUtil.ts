/*
* Author     : Roshan S.
* Description: This file contains date utility functions which can be used across the framework
* */


import moment from "moment";

export const dateUtil ={

    getCurrentDate_OR_AND_Time: (format = "YYYY-MM-DD") => moment().format(format),

    subtractYearsFromCurrentDate: (years: moment.DurationInputArg1) => moment(new Date(moment().subtract(years, 'years').calendar())).format("YYYY/MM/DD"),

    addDaysToCurrentDate: (numberOfDays: moment.DurationInputArg1, format = "DD/MM/YYYY") => moment().add(numberOfDays, 'days').format(format)

}













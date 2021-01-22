import { FeedbackPosition } from "nativescript-feedback";

const FeedBack = require("nativescript-feedback");
const feedBack = new FeedBack.Feedback;
const Color = require("color").Color;
const Platform = require("platform");

export const ShowMessage = (title, mess, status, pos) => {
    try {
        var screen = Platform.screen.mainScreen.metrics;
        var statuses = {
            success: "#099c4b",
            primary: "#127cdf",
            warning: "#e6bf0c",
            error: "#a32323",
            default: "#737373",
        };

        pos = pos == undefined || pos == "" ? "top" : pos;

        feedBack.show({
            title: title == undefined ? "" : title,
            titleSize: (screen.scaledDensity >= 2 ? 14 : 20 / screen.scaledDensity),
            titleColor: status == "warning" ? new Color("black") : new Color("white"),
            message: mess,
            messageColor: status == "warning" ? new Color("black") : new Color("white"),
            messageSize: (screen.scaledDensity >= 2 ? 14 : 20 / screen.scaledDensity),
            backgroundColor: new Color(
                status == undefined || status == ""
                    ? statuses["default"]
                    : statuses[status]
            ),
            duration: 3500,
            icon: status,
            position: pos.toLowerCase() != "top" && pos.toLowerCase() != "bottom" ? FeedbackPosition.Top : (pos.toLowerCase() == "top" ? FeedbackPosition.Top : FeedbackPosition.Bottom),
            android: {
                iconColor: status == "warning" ? new Color("black") : new Color("white"), // optional, leave out if you don't need it
            },
            onTap: () => {
                feedBack.hide();
            }
        });
    }
    catch(err){
        console.log(`Feedback Error: ${err}`);
    }
};